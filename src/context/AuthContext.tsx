import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useAsync, UseAsyncReturn, AsyncStatus } from "../hooks/useAsync";
import { authAPI, gameInitializationAPI } from "../services";

type LoginResponse = {
  uid: string;
  username?: string;
  token?: string;
};

type RegisterResponse = {
  uid: string;
  username: string;
};

type GameData = {
  character: any;
  gameState: any;
  inventory: any;
  exploration: any;
  combat: any;
  relationships: any;
  quests: any;
  story: any;
  specialMechanics: any;
};

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
    gameData: GameData | null;
    hasCharacter: boolean;
    runLoginUser: UseAsyncReturn<LoginResponse, [LoginOptions]>['run'];
    runCreateUser: UseAsyncReturn<RegisterResponse, [CreateUserOptions]>['run'];
    loginStatus: AsyncStatus;
    createUserStatus: AsyncStatus;
    loginError: UseAsyncReturn<LoginResponse, [LoginOptions]>['error'];
    createUserError: UseAsyncReturn<RegisterResponse, [CreateUserOptions]>['error'];
    logout: () => void;
    setCharacterCreated: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => authAPI.isAuthenticated());
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [hasCharacter, setHasCharacter] = useState(false);

    const loginAsync = useAsync<LoginResponse, [LoginOptions]>(async (options: LoginOptions) => {
        try {
            // Step 1: Authenticate user
            const loginResult = await authAPI.login(options);
            
            // Step 2: Check if user has character
            const userHasCharacter = await authAPI.hasCharacter();
            
            // Step 3: Initialize game data only if needed
            const gameInitData = userHasCharacter ? await gameInitializationAPI.initializeGame() : null;
            
            // Step 4: Update state
            setIsLoggedIn(true);
            setGameData(gameInitData);
            setHasCharacter(userHasCharacter);
            
            return loginResult;
        } catch (error) {
            // Make sure we're logged out if anything fails
            await authAPI.logout();
            setIsLoggedIn(false);
            setGameData(null);
            setHasCharacter(false);
            throw error;
        }
    });

    const registerAsync = useAsync<RegisterResponse, [CreateUserOptions]>(async (options: CreateUserOptions) => {
        try {
            const result = await authAPI.register(options);
            
            // After successful registration, user is logged in but has no character
            setIsLoggedIn(true);
            setGameData(null);
            setHasCharacter(false);
            
            return result;
        } catch (error) {
            await authAPI.logout();
            setIsLoggedIn(false);
            setGameData(null);
            setHasCharacter(false);
            throw error;
        }
    });

    const logout = async () => {
        await authAPI.logout();
        setIsLoggedIn(false);
        setGameData(null);
        setHasCharacter(false);
    };

    const setCharacterCreated = () => {
        setHasCharacter(true);
    };

    const value: AuthContextValue = useMemo(
        () => ({ 
            isLoggedIn,
            gameData,
            hasCharacter,
            runLoginUser: loginAsync.run, 
            runCreateUser: registerAsync.run,
            loginStatus: loginAsync.status,
            createUserStatus: registerAsync.status,
            loginError: loginAsync.error,
            createUserError: registerAsync.error,
            logout,
            setCharacterCreated
        }),
        [isLoggedIn, gameData, hasCharacter, loginAsync.run, registerAsync.run, loginAsync.status, registerAsync.status, loginAsync.error, registerAsync.error]
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


