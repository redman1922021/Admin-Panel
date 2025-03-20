export enum TodoFilter {
    ALL = "all",
    COMPLETED = "completed",
    IN_WORK = "inWork",
}

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
