import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useAsync, UseAsyncReturn } from "../hooks/useAsync";

type LoginResponse = unknown;
type RegisterResponse = unknown;

interface LoginOptions {
    username: string;
    password: string;
}

interface CreateUserOptions {
    username: string;
    email: string;
    password: string;
}

interface AuthContextValue {
    isLoggedIn: boolean;
    runLoginUser: UseAsyncReturn<LoginResponse, [LoginOptions]>['run'];
    runCreateUser: UseAsyncReturn<RegisterResponse, [CreateUserOptions]>['run'];
    loginStatus: UseAsyncReturn<LoginResponse, [LoginOptions]>['status'];
    createUserStatus: UseAsyncReturn<RegisterResponse, [CreateUserOptions]>['status'];
    loginError: UseAsyncReturn<LoginResponse, [LoginOptions]>['error'];
    createUserError: UseAsyncReturn<RegisterResponse, [CreateUserOptions]>['error'];
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loginAsync = useAsync<LoginResponse, [LoginOptions]>(async (options: LoginOptions) => {
        const result = await postJson<LoginResponse>(
            "http://localhost:8080/api/login-user",
            { username: options.username, password: options.password }
        );
        setIsLoggedIn(true);
        return result;
    });

    const registerAsync = useAsync<RegisterResponse, [CreateUserOptions]>(async (options: CreateUserOptions) => {
        const result = await postJson<RegisterResponse>(
            "http://localhost:8080/api/create-user",
            { username: options.username, email: options.email, password: options.password }
        );
        return result;
    });

    const logout = () => {
        setIsLoggedIn(false);
    };

    const value: AuthContextValue = useMemo(
        () => ({ 
            isLoggedIn, 
            runLoginUser: loginAsync.run, 
            runCreateUser: registerAsync.run,
            loginStatus: loginAsync.status,
            createUserStatus: registerAsync.status,
            loginError: loginAsync.error,
            createUserError: registerAsync.error,
            logout 
        }),
        [isLoggedIn, loginAsync.run, registerAsync.run, loginAsync.status, registerAsync.status, loginAsync.error, registerAsync.error]
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


