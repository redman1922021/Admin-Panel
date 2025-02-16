import axios from "axios";
import {
    Todo,
    TodoFilter,
    TodoInfo,
    MetaResponse,
    UserRegistration,
    AuthData,
    Token, ProfileRequest, Profile,
} from "../types/types.ts";

const BASE_URL = "https://easydev.club/api/v1";

const todoApi = axios.create({
    baseURL: `${BASE_URL}/todos`,
    headers: { "Content-Type": "application/json" },
});

const authApi = axios.create({
    baseURL: `${BASE_URL}/auth`,
    headers: { "Content-Type": "application/json" },
});

const userApi = axios.create({
    baseURL: `${BASE_URL}/user`,
    headers: { "Content-Type": "application/json" },
});

const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        logoutUser();
        return null;
    }

    try {
        const response = await authApi.post<Token>("/refresh", { refreshToken });
        localStorage.setItem("accessToken", response.data.accessToken);
        return response.data.accessToken;
    } catch (error) {
        logoutUser();
        return null;
    }
};

todoApi.interceptors.request.use(async (config) => {
    let token = localStorage.getItem("accessToken");

    if (!token) {
        token = await refreshAccessToken();
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

todoApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return todoApi.request(error.config);
            }
        }
        return Promise.reject(error);
    }
);

userApi.interceptors.request.use(async (config) => {
    let token = localStorage.getItem("accessToken");

    if (!token) {
        token = await refreshAccessToken();
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

userApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return userApi.request(error.config);
            }
        }
        return Promise.reject(error);
    }
);

export const fetchTodos = async (filter: TodoFilter = TodoFilter.ALL): Promise<MetaResponse<Todo, TodoInfo>> => {
    const response = await todoApi.get("", { params: { filter } });
    return response.data;
};

export const addTodo = async (title: string): Promise<void> => {
    await todoApi.post("", { title, isDone: false });
};

export const deleteTodo = async (id: number): Promise<void> => {
    await todoApi.delete(`/${id}`);
};

export const updateTodo = async (id: number, newTitle: string, isDone: boolean): Promise<void> => {
    await todoApi.put(`/${id}`, { title: newTitle, isDone });
};

export const registerUser = async (data: UserRegistration): Promise<void> => {
    await authApi.post("/signup", data);
};

export const loginUser = async (data: AuthData): Promise<Token> => {
    const response = await authApi.post<Token>("/signin", data);
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    return response.data;
};

export const logoutUser = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });
};

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteTodo(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });
};

export const useUpdateTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, title, isDone }: { id: number; title: string; isDone: boolean }) =>
            updateTodo(id, title, isDone),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: (data: UserRegistration) => registerUser(data),
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: (data: AuthData) => loginUser(data),
    });
};

export const fetchProfile = async (): Promise<Profile> => {
    const response = await userApi.get<Profile>("/profile");
    return response.data;
};

export const updateProfile = async (data: ProfileRequest): Promise<void> => {
    await userApi.put("/profile", data);
};


export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfile,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ProfileRequest) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};
