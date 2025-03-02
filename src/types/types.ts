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

export interface MetaResponse<T, N> {
    data: T[];
    info?: N;
    meta: {
        totalAmount: number;
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
