    import React, { createContext, useState, ReactNode } from "react";

    interface User {
    name: string;
    role: string;
    }

    interface AppContextType {
    accessToken: string | null;
    setAccessToken: (value: string | null) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    resetContext: () => void;
    }

    export const AppContext = createContext<AppContextType | undefined>(undefined);

    interface Props {
    children: ReactNode;
    }

    const initialState = {
    accessToken: localStorage.getItem("accessToken"),
    user: JSON.parse(localStorage.getItem("app-user") || "null") as User | null,
    };

    const AppContextProvider: React.FC<Props> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(initialState.accessToken);
    const [user, setUser] = useState<User | null>(initialState.user);

    const resetContext = () => {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("app-user");
    };

    const value: AppContextType = {
        accessToken,
        setAccessToken,
        user,
        setUser,
        resetContext,
    };

    return (
        <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>
    );
    };

    export default AppContextProvider;
