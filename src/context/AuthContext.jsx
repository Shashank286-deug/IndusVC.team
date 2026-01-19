import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Creator credentials for full access
const CREATOR_EMAIL = 'creator@indusvc.team';
const CREATOR_CODE = 'INDUS_CREATOR_2024';

// Mock user database (in real app, this would be backend)
const MOCK_USERS = {
    'creator@indusvc.team': {
        email: 'creator@indusvc.team',
        name: 'Creator',
        password: 'creator123',
        plan: 'creator'
    }
};

export function AuthProvider({ children }) {
    // Default to creator account for full access without login
    const [user, setUser] = useState({
        email: 'creator@indusvc.team',
        name: 'Creator',
        plan: 'creator',
        createdAt: new Date().toISOString()
    });
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Save auth state to localStorage
    const saveAuth = (userData) => {
        const authData = {
            user: userData,
            timestamp: Date.now()
        };
        localStorage.setItem('indusvc_auth', JSON.stringify(authData));
    };

    const login = async (email, password, creatorCode = '') => {
        // Check for creator access
        if (creatorCode === CREATOR_CODE || email === CREATOR_EMAIL) {
            const creatorUser = {
                email: email || CREATOR_EMAIL,
                name: 'Creator',
                plan: 'creator',
                createdAt: new Date().toISOString()
            };
            setUser(creatorUser);
            setIsAuthenticated(true);
            saveAuth(creatorUser);
            return { success: true, user: creatorUser };
        }

        // Check mock users
        const existingUser = MOCK_USERS[email];
        if (existingUser && existingUser.password === password) {
            const userData = {
                email: existingUser.email,
                name: existingUser.name,
                plan: existingUser.plan,
                createdAt: new Date().toISOString()
            };
            setUser(userData);
            setIsAuthenticated(true);
            saveAuth(userData);
            return { success: true, user: userData };
        }

        // For demo: any email/password combo works with free plan
        if (email && password) {
            const newUser = {
                email,
                name: email.split('@')[0],
                plan: 'free',
                createdAt: new Date().toISOString()
            };
            setUser(newUser);
            setIsAuthenticated(true);
            saveAuth(newUser);
            return { success: true, user: newUser };
        }

        return { success: false, error: 'Invalid credentials' };
    };

    const signup = async (email, password, name) => {
        // For demo: create user with free plan
        const newUser = {
            email,
            name: name || email.split('@')[0],
            plan: 'free',
            createdAt: new Date().toISOString()
        };

        setUser(newUser);
        setIsAuthenticated(true);
        saveAuth(newUser);

        return { success: true, user: newUser };
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('indusvc_auth');
        localStorage.removeItem('indusvc_subscription');
    };

    const updatePlan = (newPlan) => {
        if (user) {
            const updatedUser = { ...user, plan: newPlan };
            setUser(updatedUser);
            saveAuth(updatedUser);
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updatePlan,
        isCreator: user?.plan === 'creator'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
