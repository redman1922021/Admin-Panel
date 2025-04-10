import {Profile, ProfileRequest} from "../types/users.ts";
import {api} from "./api.ts";

export const fetchProfile = async (): Promise<Profile> => {
    const response = await api.get<Profile>("/user/profile");
    return response.data;
};

export const updateProfile = async (data: ProfileRequest): Promise<void> => {
    await api.put("/user/profile", data);
};
