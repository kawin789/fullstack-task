import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as localStorageService from '../services/localStorageService';

interface AuthContextType {
  currentUser: any | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isUsingLocalStorage: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUsingLocalStorage, setIsUsingLocalStorage] = useState(false);

  const signup = async (email: string, password: string) => {
    try {
      // Try Firebase first
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../config/firebase');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      setIsUsingLocalStorage(false);
    } catch (error) {
      console.warn('Firebase signup failed, using local storage:', error);
      const user = await localStorageService.signupUser(email, password);
      setCurrentUser(user);
      setIsUsingLocalStorage(true);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Try Firebase first
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../config/firebase');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      setIsUsingLocalStorage(false);
    } catch (error) {
      console.warn('Firebase login failed, using local storage:', error);
      const user = await localStorageService.loginUser(email, password);
      setCurrentUser(user);
      setIsUsingLocalStorage(true);
    }
  };

  const logout = async () => {
    try {
      if (!isUsingLocalStorage) {
        const { signOut } = await import('firebase/auth');
        const { auth } = await import('../config/firebase');
        await signOut(auth);
      }
    } catch (error) {
      console.warn('Firebase logout failed:', error);
    } finally {
      await localStorageService.logoutUser();
      setCurrentUser(null);
      setIsUsingLocalStorage(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try Firebase first
        const { onAuthStateChanged } = await import('firebase/auth');
        const { auth } = await import('../config/firebase');
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setCurrentUser(user);
            setIsUsingLocalStorage(false);
          } else {
            // Check local storage
            const localUser = localStorageService.getCurrentUserFromStorage();
            if (localUser) {
              setCurrentUser(localUser);
              setIsUsingLocalStorage(true);
            }
          }
          setLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.warn('Firebase initialization failed, using local storage only:', error);
        // Fallback to local storage
        const localUser = localStorageService.getCurrentUserFromStorage();
        setCurrentUser(localUser);
        setIsUsingLocalStorage(true);
        setLoading(false);
        return () => {};
      }
    };

    let unsubscribe: (() => void) | undefined;
    initAuth().then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    isUsingLocalStorage,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};