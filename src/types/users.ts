import {Roles} from "./types.ts";

export type UserRequest = Partial<Pick<User, "username" | "email" | "phoneNumber">>;

export interface User {
    id: number;
    username: string;
    email: string;
    date: string;
    isBlocked: boolean;
    roles: Roles[];
    phoneNumber: string;
}

export interface UserFilters {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isBlocked?: boolean;
    limit?: number;
    offset?: number;
}

export interface Profile {
    id: number;
    username: string;
    email: string;
    date: string;
    isBlocked: boolean;
    isAdmin: boolean;
    roles: Roles[];
    phoneNumber: string;
}

export interface ProfileRequest {
    username?: string;
    email?: string;
    phoneNumber?: string;
}
