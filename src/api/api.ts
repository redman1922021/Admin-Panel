import axios from "axios";
import {tokenManager} from "../assets/services.ts";

const BASE_URL = "https://easydev.club/api/v1";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const authApi = axios.create({
    baseURL: `${BASE_URL}/auth`,
    headers: {"Content-Type": "application/json"},
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true;

            const newToken = await tokenManager.refreshAccessToken();
            if (newToken) {
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return api.request(error.config);
            }
        }

        return Promise.reject(error);
    }
);

api.interceptors.request.use(async (config) => {
    let token = tokenManager.getAccessToken();

    if (!token) {
        token = await tokenManager.refreshAccessToken();
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
