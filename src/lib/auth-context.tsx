'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase';

interface UserRole {
    isSuperAdmin: boolean;
    factionIds: string[];
}

interface AuthContextType {
    user: User | null;
    userRole: UserRole | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const auth = getFirebaseAuth();
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const db = getFirebaseDb();
                if (db) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                        if (userDoc.exists()) {
                            const data = userDoc.data();
                            setUserRole({
                                isSuperAdmin: data.isSuperAdmin || false,
                                factionIds: data.factionIds || [],
                            });
                        } else {
                            // Create user document on first sign in
                            await setDoc(doc(db, 'users', firebaseUser.uid), {
                                email: firebaseUser.email,
                                displayName: firebaseUser.displayName,
                                isSuperAdmin: false,
                                factionIds: [],
                                createdAt: new Date(),
                                lastLoginAt: new Date(),
                            });
                            setUserRole({ isSuperAdmin: false, factionIds: [] });
                        }
                    } catch (err) {
                        console.error('Error fetching user role:', err);
                        setUserRole({ isSuperAdmin: false, factionIds: [] });
                    }
                }
            } else {
                setUserRole(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const auth = getFirebaseAuth();
        if (!auth) {
            setError('Authentication not available');
            return;
        }

        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
            setError(errorMessage);
            throw err;
        }
    };

    const signOut = async () => {
        const auth = getFirebaseAuth();
        if (!auth) return;

        try {
            await firebaseSignOut(auth);
            setUserRole(null);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
            setError(errorMessage);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userRole, loading, signInWithGoogle, signOut, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
