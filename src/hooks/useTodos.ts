import {TodoFilter} from "../types/todos.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addTodo, deleteTodo, fetchTodos, updateTodo} from "../api/todos.ts";

export const useTodos = (filter: TodoFilter) => {
    return useQuery({
        queryKey: ["todos", filter],
        queryFn: () => fetchTodos(filter),
    });
};

export const useAddTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (title: string) => addTodo(title),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["todos"]}),
    });
};

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteTodo(id),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["todos"]}),
    });
};

export const useUpdateTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, title, isDone}: { id: number; title: string; isDone: boolean }) =>
            updateTodo(id, title, isDone),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["todos"]}),
    });
};
