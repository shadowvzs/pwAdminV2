import { Injectable } from '@nestjs/common';
import { jsDate2MySqlDateTime } from 'src/common/helpers/dateConvert';
import { MySQLProvider } from 'src/mysql/mysql.provider';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { AddGoldDto } from './dto/AddGold.dto';

@Injectable()
export class PwServerActionService {
    constructor(
        private readonly mysqlProvider: MySQLProvider,
        private readonly usersService: UsersService,
    ) {}
    
    public async addGoldToUser(addGoldDto: AddGoldDto): Promise<boolean> {
        const data = {
            ...addGoldDto,
            zoneId: 1,
            sn: 0,
            aid: 1,
            point: 0,
            cash: addGoldDto.amount,
            status: 1,
            creatime: jsDate2MySqlDateTime()
        };
        try {
            const query = await this.mysqlProvider.query(`INSERT INTO usecashnow (userid, zoneid, sn, aid, point, cash, status, creatime) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE cash = cash + ?`, [
                data.userId,
                data.zoneId,
                data.sn,
                data.aid,
                data.point,
                data.cash,
                data.status,
                data.creatime,
                data.amount,
            ]);
            console.log(query);
            return query[0].affectedRows > 0;
        } catch (err) {
            console.error(err);
        }
        return false;
    }

    public async promoteToGM(userId: number): Promise<User> {
        try {
            const query = await this.mysqlProvider.query(`call addGM(?, 1)`, [userId]);
            console.log(query[0].affectedRows);
            if (query[0].affectedRows) {
                return await this.usersService.getDetails(userId);
            }
        } catch (err) {
            throw new Error(err?.sqlMessage);
        }
        throw new Error('Something went wrong');
    }

    public async demoteFromGM(userId: number): Promise<User> {
        try {
            // const query = await this.mysqlProvider.execute<User>(`call adduser(:name, :passwd, :prompt, :answer, :truename, :idnumber, :email, :mobilenumber, :province, :city, :phonenumber, :address, :postalcode, :gender, :birthday, :qq, :passwd2)`, user);
            const query = await this.mysqlProvider.delete('auth',[[userId, 'userId']]);
            console.log(query);
            if (query) {
                return await this.usersService.getDetails(userId);
            }
        } catch (err) {
            throw new Error(err?.sqlMessage);
        }
        throw new Error('Something went wrong');
    }
}
