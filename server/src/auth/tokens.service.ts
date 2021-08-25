import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { SignOptions, TokenExpiredError } from 'jsonwebtoken'
import { JwtService } from '@nestjs/jwt'

import { MySQLProvider } from 'src/mysql/mysql.provider';
import { User } from 'src/users/entity/user.entity'
import { RefreshToken } from './entities/refresh-token.entity'
import { UsersService } from 'src/users/users.service';

const BASE_OPTIONS: SignOptions = {
    issuer: 'https://my-app.com',
    audience:'https://my-app.com',
}
  
export interface RefreshTokenPayload {
    jti: number;
    sub: number
}
  
@Injectable()
export class TokenService {

    public async refreshTokenCleanUp(): Promise<number> {
        const query = await this.mysqlProvider.query<RefreshToken>(`DELETE FROM refreshToken WHERE expires < ?`, [
            Date.now()
        ]);
        return query[0]?.affectedRows;
    }

    public async createRefreshToken (user: User, ttl: number): Promise<RefreshToken> {
        const expires = new Date(Date.now() + ttl).getTime();
        const insertedTokenId = await this.insert(user.id, expires);
        const refreshToken = await this.findTokenById(insertedTokenId);
        return refreshToken;
    }

    public async insert(userId: number, expires: number): Promise<number> {
        const query = await this.mysqlProvider.query<RefreshToken>(`INSERT INTO refreshToken (user_id, expires) VALUES (?, ?)`, [
            userId,
            expires
        ]);
        return query[0].insertId;
    }

    public async updateRefreshToken(refreshToken: RefreshToken): Promise<void> {
        const query = await this.mysqlProvider.query<RefreshToken>(`UPDATE refreshToken SET token=? WHERE id=?`, [
            refreshToken.token,
            refreshToken.id
        ])[0];
        return query?.affectedRows;
    }

    public async findTokenById (id: number): Promise<RefreshToken | null> {
        const refreshToken = await this.mysqlProvider.findOne<RefreshToken>(`SELECT * FROM refreshToken WHERE id=?`, [id]);
        return refreshToken;
    }

    public async generateAccessToken (user: User): Promise<string> {
        const opts: SignOptions = {
          ...BASE_OPTIONS,
          subject: String(user.id),
        }
    
        const accessToken = await this.jwtService.signAsync({}, opts);
        return accessToken;
      }
    
      public async generateRefreshToken (user: User, expiresIn: number): Promise<string> {
        const refreshToken = await this.createRefreshToken(user, expiresIn)
    
        const opts: SignOptions = {
          ...BASE_OPTIONS,
          expiresIn,
          subject: String(user.id),
          jwtid: String(refreshToken.id),
        }

        refreshToken.token = await this.jwtService.signAsync({}, opts);
        await this.updateRefreshToken(refreshToken);
        return refreshToken.token;
      }
    
      public async resolveRefreshToken (encoded: string): Promise<{ user: User, token: RefreshToken }> {
        const payload = await this.decodeRefreshToken(encoded)
        const token = await this.getStoredTokenFromRefreshTokenPayload(payload)
    
        if (!token) {
          throw new UnprocessableEntityException('Refresh token not found')
        }
    
        if (token.is_revoked) {
          throw new UnprocessableEntityException('Refresh token revoked')
        }
    
        const user = await this.getUserFromRefreshTokenPayload(payload)
    
        if (!user) {
          throw new UnprocessableEntityException('Refresh token malformed')
        }
    
        return { user, token }
      }
    
      public async createAccessTokenFromRefreshToken (refresh: string): Promise<{ token: string, user: User }> {
        const { user } = await this.resolveRefreshToken(refresh);
        const token = await this.generateAccessToken(user);
        return { user, token };
      }
    
      private async decodeRefreshToken (token: string): Promise<RefreshTokenPayload> {
        try {
          return this.jwtService.verifyAsync(token)
        } catch (e) {
          if (e instanceof TokenExpiredError) {
            throw new UnprocessableEntityException('Refresh token expired')
          } else {
            throw new UnprocessableEntityException('Refresh token malformed')
          }
        }
      }
    
      private async getUserFromRefreshTokenPayload (payload: RefreshTokenPayload): Promise<User> {
        const subId = payload.sub
    
        if (!subId) {
          throw new UnprocessableEntityException('Refresh token malformed')
        }
    
        return this.usersService.findOne(subId)
      }
    
      private async getStoredTokenFromRefreshTokenPayload (payload: RefreshTokenPayload): Promise<RefreshToken | null> {
        const tokenId = payload.jti
    
        if (!tokenId) {
          throw new UnprocessableEntityException('Refresh token malformed')
        }
    
        return this.findTokenById(tokenId)
      }

    constructor(
        private readonly mysqlProvider: MySQLProvider,
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) {
        this.refreshTokenCleanUp();
    }
}