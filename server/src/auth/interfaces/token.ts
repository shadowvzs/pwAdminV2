import { User } from "src/users/entity/user.entity";

export interface AccessTokenPayload {
    sub: number;
}

export interface AuthenticationPayload {
    user: User;
    payload: {
        type: 'bearer';
        token: string;
        refresh_token?: string;
    }
}