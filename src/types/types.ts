export interface Todo {
    id: number;
    title: string;
    created: string;
    isDone: boolean;
}

export interface TodoInfo {
    all: number;
    completed: number;
    inWork: number;
}

export interface MetaResponse<T, N = undefined> {
    data: T[];
    info?: N;
    meta: {
        totalAmount: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    };
}

export enum TodoFilter {
    ALL = "all",
    COMPLETED = "completed",
    IN_WORK = "inWork",
}

export interface UserRegistration {
    login: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
}

export interface AuthData {
    login: string;
    password: string;
}

export interface Profile {
    id: number;
    username: string;
    email: string;
    date: string;
    isBlocked: boolean;
    isAdmin: boolean;
    phoneNumber: string;
}

export interface ProfileRequest {
    username: string;
    email: string;
    phoneNumber?: string;
}

export interface Token {
    accessToken: string;
    refreshToken: string;
}

export interface UserFilters {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isBlocked?: boolean;
    limit?: number;
    offset?: number;
}

export interface User {
    id: number;
    username: string;
    email: string;
    date: string;
    isBlocked: boolean;
    roles: Roles[];
    phoneNumber: string;
}

export interface UserRequest {
    username?: string;
    email?: string;
    phoneNumber?: string;
}

export enum Roles {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    USER = "USER"
}
