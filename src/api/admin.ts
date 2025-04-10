import {User, UserFilters, UserRequest} from "../types/users.ts";
import {MetaResponse} from "../types/types.ts";
import {api} from "./api.ts";

export const fetchUsers = async (filters?: UserFilters): Promise<MetaResponse<User>> => {
    const response = await api.get<MetaResponse<User>>("/admin/users", {params: filters});
    return response.data;
};

export const fetchUserById = async (id: number): Promise<User> => {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
};

export const updateUser = async (id: number, data: UserRequest): Promise<void> => {
    await api.put(`/admin/users/${id}`, data);
};

export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
};

export const blockUser = async (id: number): Promise<void> => {
    await api.post(`/admin/users/${id}/block`);
};

export const updateUserRights = async (id: number, roles: string[]): Promise<void> => {
    await api.post(`/admin/users/${id}/rights`, {roles});
};

export const unlockUser = async (id: number): Promise<void> => {
    await api.post(`/admin/users/${id}/unblock`);
};
