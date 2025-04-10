import {Todo, TodoFilter, TodoInfo} from "../types/todos.ts";
import {MetaResponse} from "../types/types.ts";
import {api} from "./api.ts";

export const fetchTodos = async (filter: TodoFilter = TodoFilter.ALL): Promise<MetaResponse<Todo, TodoInfo>> => {
    const response = await api.get("/todos", {params: {filter}});
    return response.data;
};

export const addTodo = async (title: string): Promise<void> => {
    await api.post("/todos", {title, isDone: false});
};

export const deleteTodo = async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
};

export const updateTodo = async (id: number, newTitle: string, isDone: boolean): Promise<void> => {
    await api.put(`/todos/${id}`, {title: newTitle, isDone});
};
