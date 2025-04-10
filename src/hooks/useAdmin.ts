import {UserFilters, UserRequest} from "../types/users.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {
    fetchUsers,
    fetchUserById,
    updateUser,
    deleteUser,
    blockUser,
    updateUserRights,
    unlockUser
} from "../api/admin.ts";

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
