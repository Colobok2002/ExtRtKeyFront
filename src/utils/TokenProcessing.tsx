import { COOKIES_TOKEN_NAME } from "@/Const";
import Cookies from "js-cookie";

/**
 * Получает токен из cookies
 */
export const getToken = (): string | null => {
    const token = Cookies.get(COOKIES_TOKEN_NAME);
    return token ? atob(token) : null;
};

/**
 * Устанавливает токен в cookies
 * @param token JWT-токен
 */
export const setToken = (token: string): void => {
    const encodedToken = btoa(token);
    Cookies.set(COOKIES_TOKEN_NAME, encodedToken, {
        expires: 180,
        // secure: true, // Отключено для localhost, включить в продакшене
        sameSite: "Strict",
    });
};

/**
 * Удаляет токен из cookies
 */
export const clearToken = (): void => {
    Cookies.remove(COOKIES_TOKEN_NAME);
};
