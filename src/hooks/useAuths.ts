import {useMutation} from "@tanstack/react-query";
import {AuthData, UserRegistration} from "../types/auth.ts";
import {loginUser, registerUser} from "../api/auth.ts";

export const useLogin = () => {
    return useMutation({
        mutationFn: (data: AuthData) => loginUser(data),
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: (data: UserRegistration) => registerUser(data),
    });
};
