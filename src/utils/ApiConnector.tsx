/**
 * :mod:`ApiConnector` -- Класс для работы с API
 * ===================================
 * .. moduleauthor:: Ilya Barinov <i-barinov@it-serv.ru>
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getToken, setToken } from "./TokenProcessing";

interface BaseResponse<T = any> {
    status?: string | null;
    message?: string | null;
    data?: T;
}

interface GoodResponse<T = any> extends BaseResponse<T> {
    status: "Good";
}

interface BadResponse<T = any> extends BaseResponse<T> {
    status: "Bad";
}

export type APIResponse<T = any> = GoodResponse<T> | BadResponse<T>;

export default class ApiConnector {
    private api: AxiosInstance;

    constructor(routUrl: string) {
        // TODO: API бэка нужно получить из env-переменных (Vite)
        // https://vite.dev/guide/env-and-mode
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

        this.api = axios.create({
            baseURL: `${baseUrl}/${routUrl}/`,
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Автоматическое добавление токена во все запросы
        this.api.interceptors.request.use((config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    // private clearToken(): void {
    //     Cookies.remove(this.TOKEN_NAME);
    // }

    private async _request<T extends APIResponse = APIResponse>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        endpoint: string,
        data?: any
    ): Promise<T> {
        try {
            const config: AxiosRequestConfig = {
                method,
                url: endpoint,
                data,
            };

            const response = await this.api.request<T>(config);
            return response.data;
        } catch (error: any) {
            console.error("API Request Error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            throw error;
        }
    }


    public async refreshToken(newToken: string): Promise<void> {
        try {
            if (newToken) {
                setToken(newToken);
                this.api.defaults.headers["Authorization"] = `Bearer ${newToken}`;
                console.log("Token successfully refreshed.");
            } else {
                throw new Error("No new access token received.");
            }
        } catch (error) {
            console.error("Failed to refresh token:", error);
            // TODO: На тест нужно ли чистить их
            // localStorage.removeItem("authToken");
            // localStorage.removeItem("refreshToken");
            // this.clearToken()
            throw error;
        }
    }

    public get<T extends APIResponse = APIResponse>(endpoint: string): Promise<T> {
        return this._request("GET", endpoint);
    }

    public post<T extends APIResponse = APIResponse>(endpoint: string, body: any): Promise<T> {
        return this._request("POST", endpoint, body);
    }

    public put<T extends APIResponse = APIResponse>(endpoint: string, body: any): Promise<T> {
        return this._request("PUT", endpoint, body);
    }

    public delete<T extends APIResponse = APIResponse>(endpoint: string): Promise<T> {
        return this._request("DELETE", endpoint);
    }
}
