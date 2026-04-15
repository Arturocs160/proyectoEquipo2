import connection from '../config/db';

export interface ITokenBlacklist {
    id: number;
    token: string;
    expires_at: Date;
    created_at: Date;
}

export class TokenBlacklistModel {
    static async addToBlacklist(token: string, expiresAt: Date): Promise<void> {
        const query = 'INSERT INTO revoked_tokens (token, expires_at) VALUES ($1, $2)';
        await connection.query(query, [token, expiresAt]);
    }

    static async isTokenBlacklisted(token: string): Promise<boolean> {
        const query = 'SELECT id FROM revoked_tokens WHERE token = $1';
        const { rows } = await connection.query(query, [token]);
        return rows.length > 0;
    }
}

export default TokenBlacklistModel;