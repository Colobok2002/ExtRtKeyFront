import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * :mod:`ApiConnector` -- Класс для работы с API
 * ===================================
 * .. moduleauthor:: Ilya Barinov <i-barinov@it-serv.ru>
 */

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
            const token = this.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    private getToken(): string | null {
        // TODO: Пока localStorage, в будущем можно хранить в cookies
        return localStorage.getItem("authToken");
    }

    private setToken(token: string) {
        localStorage.setItem("authToken", token);
    }

    private async _request<T = any>(
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

            const response: AxiosResponse<T> = await this.api.request(config);
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
                this.setToken(newToken);
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
            throw error;
        }
    }

    public get<T = any>(endpoint: string): Promise<T> {
        return this._request("GET", endpoint);
    }

    public post<T = any>(endpoint: string, body: any): Promise<T> {
        return this._request("POST", endpoint, body);
    }

    public put<T = any>(endpoint: string, body: any): Promise<T> {
        return this._request("PUT", endpoint, body);
    }

    public delete<T = any>(endpoint: string): Promise<T> {
        return this._request("DELETE", endpoint);
    }
}
