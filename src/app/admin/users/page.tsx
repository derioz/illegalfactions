'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { COLLECTIONS, UserProfile } from '@/lib/db-types';
import { useAuth } from '@/lib/auth-context';
import { factions } from '@/lib/factions';

export default function UserManagement() {
    const { userRole } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ uid: '', email: '', isSuperAdmin: false, factionIds: [] as string[] });

    const isSuperAdmin = userRole?.isSuperAdmin || false;

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const db = getFirebaseDb();
        if (!db) return;

        try {
            const snap = await getDocs(collection(db, COLLECTIONS.USERS));
            setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile)));
        } catch (err) {
            console.error('Error loading users:', err);
        }
        setLoading(false);
    };

    const saveUser = async () => {
        const db = getFirebaseDb();
        if (!db || !formData.uid) return;

        await setDoc(doc(db, COLLECTIONS.USERS, formData.uid), {
            email: formData.email,
            isSuperAdmin: formData.isSuperAdmin,
            factionIds: formData.factionIds,
            createdAt: new Date(),
            lastLoginAt: new Date(),
        });

        setShowForm(false);
        setFormData({ uid: '', email: '', isSuperAdmin: false, factionIds: [] });
        loadUsers();
    };

    if (!isSuperAdmin) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
                <p className="text-[var(--foreground-muted)]">Super Admin privileges required.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <motion.h1 className="text-3xl font-bold text-white mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        User Management
                    </motion.h1>
                    <motion.p className="text-[var(--foreground-muted)]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        Manage user roles and faction access
                    </motion.p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-cinematic">
                    {showForm ? 'Cancel' : '+ Add User'}
                </button>
            </div>

            {showForm && (
                <motion.div className="glass-card p-6 mb-8 max-w-2xl" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-lg font-semibold text-white mb-4">Add User Role</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Firebase UID</label>
                            <input type="text" placeholder="Get from Firebase Console → Authentication" value={formData.uid}
                                onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Email</label>
                            <input type="email" placeholder="user@example.com" value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                        </div>
                        <label className="flex items-center gap-2 text-white">
                            <input type="checkbox" checked={formData.isSuperAdmin}
                                onChange={(e) => setFormData({ ...formData, isSuperAdmin: e.target.checked })} />
                            Super Admin (can edit all factions)
                        </label>
                        {!formData.isSuperAdmin && (
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Faction Access</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {factions.map((f) => (
                                        <label key={f.id} className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                                            <input type="checkbox" checked={formData.factionIds.includes(f.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, factionIds: [...formData.factionIds, f.id] });
                                                    } else {
                                                        setFormData({ ...formData, factionIds: formData.factionIds.filter(id => id !== f.id) });
                                                    }
                                                }} />
                                            {f.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button onClick={saveUser} className="btn-cinematic">Save User</button>
                    </div>
                </motion.div>
            )}

            <div className="space-y-4">
                {loading ? (
                    <p className="text-[var(--foreground-muted)]">Loading users...</p>
                ) : users.length === 0 ? (
                    <p className="text-[var(--foreground-muted)]">No users configured yet.</p>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="glass-card p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                                        <span className="text-white font-bold">{user.email?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{user.email}</h3>
                                        <p className="text-sm text-[var(--foreground-muted)]">
                                            {user.isSuperAdmin ? 'Super Admin' : `Access to ${user.factionIds?.length || 0} factions`}
                                        </p>
                                    </div>
                                </div>
                                {user.isSuperAdmin && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">Super Admin</span>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
