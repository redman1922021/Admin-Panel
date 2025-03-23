import axios from "axios";
import {MetaResponse, Token} from "../types/types.ts";
import {UserRegistration, AuthData} from "../types/auth.ts";
import {Todo, TodoFilter, TodoInfo} from "../types/todos.ts";
import {ProfileRequest, Profile, UserFilters, User, UserRequest} from "../types/users.ts";

const BASE_URL = "https://easydev.club/api/v1";
let refreshTokenPromise: Promise<string | null> | null = null;

const todoApi = axios.create({
    baseURL: `${BASE_URL}/todos`,
    headers: {"Content-Type": "application/json"},
});

const authApi = axios.create({
    baseURL: `${BASE_URL}/auth`,
    headers: {"Content-Type": "application/json"},
});

const userApi = axios.create({
    baseURL: `${BASE_URL}/user`,
    headers: {"Content-Type": "application/json"},
});

const adminApi = axios.create({
    baseURL: `${BASE_URL}/admin`,
    headers: {"Content-Type": "application/json"},
});

const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshTokenPromise) {
        refreshTokenPromise = (async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                logoutUser();
                return null;
            }

            try {
                const response = await authApi.post<Token>("/refresh", { refreshToken });
                localStorage.setItem("accessToken", response.data.accessToken);
                if (response.data.refreshToken) {
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                }
                return response.data.accessToken;
            } catch (error) {
                logoutUser();
                return null;
            } finally {
                refreshTokenPromise = null;
            }
        })();
    }

    return refreshTokenPromise;
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

adminApi.interceptors.request.use(async (config) => {
    let token = localStorage.getItem("accessToken");

    if (!token) {
        token = await refreshAccessToken();
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

adminApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return adminApi.request(error.config);
            }
        }
        return Promise.reject(error);
    }
);

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
    const response = await todoApi.get("", {params: {filter}});
    return response.data;
};

export const addTodo = async (title: string): Promise<void> => {
    await todoApi.post("", {title, isDone: false});
};

export const deleteTodo = async (id: number): Promise<void> => {
    await todoApi.delete(`/${id}`);
};

export const updateTodo = async (id: number, newTitle: string, isDone: boolean): Promise<void> => {
    await todoApi.put(`/${id}`, {title: newTitle, isDone});
};

export const registerUser = async (data: UserRegistration): Promise<void> => {
    await authApi.post("/signup", data);
};

export const fetchUsers = async (filters?: UserFilters): Promise<MetaResponse<User>> => {
    const response = await adminApi.get<MetaResponse<User>>("/users", {params: filters});
    return response.data;
};

export const fetchUserById = async (id: number): Promise<User> => {
    const response = await adminApi.get<User>(`/users/${id}`);
    return response.data;
};

export const updateUser = async (id: number, data: UserRequest): Promise<void> => {
    await adminApi.put(`/users/${id}`, data);
};

export const deleteUser = async (id: number): Promise<void> => {
    await adminApi.delete(`/users/${id}`);
};

export const blockUser = async (id: number): Promise<void> => {
    await adminApi.post(`/users/${id}/block`);
};

export const updateUserRights = async (id: number, roles: string[]): Promise<void> => {
    await adminApi.post(`/users/${id}/rights`, {roles});
};

export const unlockUser = async (id: number): Promise<void> => {
    await adminApi.post(`/users/${id}/unblock`);
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

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";

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
            queryClient.invalidateQueries({queryKey: ["profile"]});
        },
    });
};

export const useUsers = (filters?: UserFilters) => {
    return useQuery({
        queryKey: ["users", filters],
        queryFn: () => fetchUsers(filters),
    });
};

export const useUserById = (id: number) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => fetchUserById(id),
    });
};

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: ({id, data}: { id: number; data: UserRequest }) => updateUser(id, data),
    });
};

export const useDeleteUser = () => {
    return useMutation({
        mutationFn: (id: number) => deleteUser(id),
    });
};

export const useBlockUser = () => {
    return useMutation({
        mutationFn: (id: number) => blockUser(id),
    });
};

export const useUpdateUserRights = () => {
    return useMutation({
        mutationFn: ({id, roles}: { id: number; roles: string[] }) => updateUserRights(id, roles),
    });
};

export const useUnlockUser = () => {
    return useMutation({
        mutationFn: (id: number) => unlockUser(id),
    });
};
