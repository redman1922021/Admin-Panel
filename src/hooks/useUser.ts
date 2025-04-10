import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ProfileRequest} from "../types/users.ts";
import {fetchProfile, updateProfile} from "../api/user.ts";

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
