import { Navigate } from 'react-router-dom';
import { createContext, useContext, useState } from 'react';

interface LoginSession {
    token: string;
    valid: boolean;
    startSession: (newToken: string) => void;
    invalidateSession: () => void;
    endSession: () => void;
}

let LoginSession = createContext<LoginSession>(null!);

function TokenManager({ children }: { children: React.ReactNode }) {
    const rollcallTokenName = "rollcall-token";

    const saveTokenToStorage = (token: string) => {
        localStorage.setItem(rollcallTokenName, token);
    }
    const getTokenFromStorage = () => {
        return localStorage.getItem(rollcallTokenName) || "";
    }

    const [token, setToken] = useState<string>(getTokenFromStorage());
    const [valid, setValid] = useState<boolean>(true);

    const startSession = (newToken: string) => { setToken(newToken); saveTokenToStorage(newToken); setValid(true); };
    const invalidateSession = () => { setValid(false); };
    const endSession = () => { setToken(""); setValid(false); }

    return (
        <LoginSession.Provider value={{ token, valid, startSession, invalidateSession, endSession }}>
            {children}
        </LoginSession.Provider>
    )
}

function useSession() {
    return useContext(LoginSession);
}

function AuthPage({ children }: { children: React.ReactNode }) {
    let session = useSession();

    return session.valid ? <>{children}</> : <Navigate to="/login" state={{ from: "/" }} replace />
}

export default TokenManager;
export { useSession, AuthPage };
export type { LoginSession };