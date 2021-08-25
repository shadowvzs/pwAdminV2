import { User } from "../models/User";

export interface AuthTokenPayload {
    type: 'bearer';
    token: string;
    refresh_token: string;
}

export interface AuthUserTokenResponse {
    user: User;
    payload: AuthTokenPayload;
}
