import {AuthData, UserRegistration} from "../types/auth.ts";
import {Token} from "../types/types.ts";
import {tokenManager} from "../assets/services.ts";
import {authApi} from "./api.ts";

export const loginUser = async (data: AuthData): Promise<Token> => {
    const response = await authApi.post<Token>("/signin", data);
    tokenManager.setTokens(response.data);
    return response.data;
};

export const registerUser = async (data: UserRegistration): Promise<void> => {
    await authApi.post("/signup", data);
};
