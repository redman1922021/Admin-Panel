export interface MetaResponse<T, N = undefined> {
    data: T[];
    info?: N;
    meta: {
        totalAmount: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    };
}

export interface Token {
    accessToken: string;
    refreshToken: string;
}

export enum Roles {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    USER = "USER"
}
