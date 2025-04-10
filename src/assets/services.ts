import {authApi} from "../api/api.ts";

class TokenManager {
    private accessToken: string | null = null;
    private refreshTokenPromise: Promise<string | null> | null = null;

    getAccessToken(): string | null {
        return this.accessToken;
    }

    setTokens({ accessToken, refreshToken }: { accessToken: string; refreshToken?: string }) {
        this.accessToken = accessToken;
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }
    }

    async refreshAccessToken(): Promise<string | null> {
        if (this.refreshTokenPromise) return this.refreshTokenPromise;

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            this.logout();
            return null;
        }

        this.refreshTokenPromise = (async () => {
            try {
                const response = await authApi.post("/refresh", { refreshToken });
                this.setTokens({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                });
                return response.data.accessToken;
            } catch (error) {
                this.logout();
                return null;
            } finally {
                this.refreshTokenPromise = null;
            }
        })();

        return this.refreshTokenPromise;
    }

    logout() {
        this.accessToken = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
    }
}

export const tokenManager = new TokenManager();
