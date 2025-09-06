import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useAsync, UseAsyncReturn } from "../hooks/useAsync";

type LoginResponse = unknown;
type RegisterResponse = unknown;

interface AuthContextValue {
    isUserLoggedIn: boolean;
    loginUser: UseAsyncReturn<LoginResponse, [string]>;
    registerUser: UseAsyncReturn<RegisterResponse, [string]>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function postJson<T>(url: string, body: unknown): Promise<T> {
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(async (response) => {
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Request failed with ${response.status}`);
        }
        try {
            return (await response.json()) as T;
        } catch {
            return {} as T;
        }
    });
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const loginAsync = useAsync<LoginResponse, [string]>(async (username: string) => {
        const result = await postJson<LoginResponse>(
            "http://localhost:8080/api/login-user",
            { username }
        );
        setIsUserLoggedIn(true);
        return result;
    });

    const registerAsync = useAsync<RegisterResponse, [string]>(async (username: string) => {
        const result = await postJson<RegisterResponse>(
            "http://localhost:8080/api/create-user",
            { username }
        );
        return result;
    });

    const logout = () => {
        setIsUserLoggedIn(false);
    };

    const value: AuthContextValue = useMemo(
        () => ({ isUserLoggedIn, loginUser: loginAsync, registerUser: registerAsync, logout }),
        [isUserLoggedIn, loginAsync, registerAsync]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}


