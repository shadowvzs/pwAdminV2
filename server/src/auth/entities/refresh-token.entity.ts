export class RefreshToken {
    public id?: number;
    public user_id: number;
    public is_revoked: 0 | 1 = 0;
    public token?: string;
    public expires: number;
}