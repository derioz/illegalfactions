'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseDb, getFirebaseStorage } from '@/lib/firebase';
import { getFactionById, Faction } from '@/lib/factions';
import { LoreEntry, Member, GalleryItem, Clip, COLLECTIONS } from '@/lib/db-types';
import { MarkdownEditor } from './MarkdownEditor';

// Icons
const Icons = {
    info: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    lore: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
    roster: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    gallery: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    clips: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),

    plus: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    ),
    trash: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    external: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    ),
    edit: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    upload: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    ),
};

export function FactionEditor({ factionId }: { factionId: string }) {
    const faction = getFactionById(factionId);
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Data states
    const [factionInfo, setFactionInfo] = useState({
        tagline: faction?.tagline || '',
        description: faction?.description || '',
        discordInvite: '',
    });
    const [loreEntries, setLoreEntries] = useState<LoreEntry[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [clips, setClips] = useState<Clip[]>([]);


    useEffect(() => {
        if (faction) loadFactionData();
    }, [faction]);

    const loadFactionData = async () => {
        const db = getFirebaseDb();
        if (!db || !faction) return;
        setLoading(true);
        try {
            const factionDoc = await getDoc(doc(db, COLLECTIONS.FACTIONS, faction.id));
            if (factionDoc.exists()) {
                const data = factionDoc.data();
                setFactionInfo({
                    tagline: data.tagline || faction.tagline,
                    description: data.description || faction.description,
                    discordInvite: data.discordInvite || '',
                });
            }
            const [loreSnap, membersSnap, gallerySnap, clipsSnap] = await Promise.all([
                getDocs(collection(db, COLLECTIONS.FACTIONS, faction.id, 'lore')),
                getDocs(collection(db, COLLECTIONS.FACTIONS, faction.id, 'members')),
                getDocs(collection(db, COLLECTIONS.FACTIONS, faction.id, 'gallery')),
                getDocs(collection(db, COLLECTIONS.FACTIONS, faction.id, 'clips')),
            ]);
            setLoreEntries(loreSnap.docs.map(d => ({ id: d.id, ...d.data() } as LoreEntry)));
            setMembers(membersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Member)));
            setGalleryItems(gallerySnap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem)));
            setClips(clipsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Clip)));
        } catch (err) {
            console.error('Error loading faction data:', err);
        }
        setLoading(false);
    };

    const saveFactionInfo = async () => {
        const db = getFirebaseDb();
        if (!db || !faction) return;
        setLoading(true);
        try {
            await setDoc(doc(db, COLLECTIONS.FACTIONS, faction.id), {
                ...faction,
                tagline: factionInfo.tagline,
                description: factionInfo.description,
                discordInvite: factionInfo.discordInvite,
                updatedAt: new Date(),
            }, { merge: true });
            showMessage('success', 'Saved successfully!');
        } catch (err) {
            showMessage('error', 'Failed to save');
            console.error(err);
        }
        setLoading(false);
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    if (!faction) {
        return <div className="text-white p-8">Faction not found</div>;
    }

    const tabs = [
        { id: 'info', label: 'Info', icon: Icons.info, count: null },
        { id: 'lore', label: 'Lore', icon: Icons.lore, count: loreEntries.length },
        { id: 'roster', label: 'Roster', icon: Icons.roster, count: members.length },
        { id: 'gallery', label: 'Gallery', icon: Icons.gallery, count: galleryItems.length },
        { id: 'clips', label: 'Clips', icon: Icons.clips, count: clips.length },
    ];

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${faction.gradientFrom}, ${faction.gradientTo})` }}
                >
                    <span className="text-white font-bold text-xl">{faction.name.charAt(0)}</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">{faction.name}</h1>
                    <p className="text-sm text-neutral-400">Manage faction content</p>
                </div>
                <a
                    href={`/${faction.id}`}
                    target="_blank"
                    className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors text-sm"
                >
                    View Page {Icons.external}
                </a>
            </div>

            {/* Message toast */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        className={`mb-6 px-4 py-3 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {message.type === 'success' ? '✓' : '✕'} {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-1 mb-8 p-1 bg-white/5 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-white/10 text-white shadow-sm'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                        {tab.count !== null && tab.count > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white/10">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="min-h-[400px]">
                {activeTab === 'info' && (
                    <InfoTab
                        faction={faction}
                        factionInfo={factionInfo}
                        setFactionInfo={setFactionInfo}
                        onSave={saveFactionInfo}
                        loading={loading}
                    />
                )}
                {activeTab === 'lore' && <LoreTab faction={faction} entries={loreEntries} onReload={loadFactionData} />}
                {activeTab === 'roster' && <RosterTab faction={faction} members={members} onReload={loadFactionData} />}
                {activeTab === 'gallery' && <GalleryTab faction={faction} items={galleryItems} onReload={loadFactionData} />}
                {activeTab === 'clips' && <ClipsTab faction={faction} clips={clips} onReload={loadFactionData} />}
            </div>
        </div>
    );
}

// Reusable components
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`bg-white/5 border border-white/10 rounded-xl p-6 ${className}`}>{children}</div>;
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
            <input {...props} className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/50 transition-colors" />
        </div>
    );
}

function TextArea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
            <textarea {...props} className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/50 transition-colors resize-none" />
        </div>
    );
}

function PrimaryButton({ children, loading, onClick }: { children: React.ReactNode; loading?: boolean; onClick?: () => void }) {
    return (
        <motion.button onClick={onClick} className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
            {loading ? 'Saving...' : children}
        </motion.button>
    );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <motion.button onClick={onClick} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors text-sm font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {Icons.plus} {children}
        </motion.button>
    );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
    return <button onClick={onClick} className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">{Icons.trash}</button>;
}

function SectionHeader({ title, count, onAdd, addLabel }: { title: string; count: number; onAdd: () => void; addLabel: string }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="text-sm text-neutral-400">{count} item{count !== 1 ? 's' : ''}</p>
            </div>
            <AddButton onClick={onAdd}>{addLabel}</AddButton>
        </div>
    );
}

// Info Tab
function InfoTab({ faction, factionInfo, setFactionInfo, onSave, loading }: { faction: Faction; factionInfo: { tagline: string; description: string; discordInvite: string }; setFactionInfo: (info: typeof factionInfo) => void; onSave: () => void; loading: boolean }) {
    return (
        <Card className="max-w-2xl">
            <h2 className="text-lg font-semibold text-white mb-6">Faction Information</h2>
            <div className="space-y-5">
                <Input label="Tagline" value={factionInfo.tagline} onChange={(e) => setFactionInfo({ ...factionInfo, tagline: e.target.value })} placeholder="Enter faction tagline..." />
                <TextArea label="Description" rows={4} value={factionInfo.description} onChange={(e) => setFactionInfo({ ...factionInfo, description: e.target.value })} placeholder="Enter faction description..." />
                <Input label="Discord Invite Link" type="url" value={factionInfo.discordInvite} onChange={(e) => setFactionInfo({ ...factionInfo, discordInvite: e.target.value })} placeholder="https://discord.gg/..." />
                <div className="pt-2"><PrimaryButton onClick={onSave} loading={loading}>Save Changes</PrimaryButton></div>
            </div>
        </Card>
    );
}

// Lore Tab
function LoreTab({ faction, entries, onReload }: { faction: Faction; entries: LoreEntry[]; onReload: () => void }) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Default eventDate to current time formatted for input
    const getNowStr = () => {
        const now = new Date();
        return new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    };

    const [form, setForm] = useState({ title: '', content: '', year: '2026', eventDate: getNowStr() });
    const [saving, setSaving] = useState(false);

    const startEdit = (entry: LoreEntry) => {
        setEditingId(entry.id);

        let dateStr = getNowStr();
        if (entry.eventDate) {
            // Handle Timestamp or Date
            // @ts-ignore - Handle firebase timestamp loose typing
            const d = entry.eventDate.seconds ? new Date(entry.eventDate.seconds * 1000) : new Date(entry.eventDate);
            if (!isNaN(d.getTime())) {
                dateStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            }
        }

        setForm({
            title: entry.title,
            content: entry.content,
            year: entry.year || '2026',
            eventDate: dateStr
        });
        setShowForm(true);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm({ title: '', content: '', year: '2026', eventDate: getNowStr() });
        setShowForm(false);
    };

    const saveEntry = async () => {
        const db = getFirebaseDb();
        if (!db || !form.title || !form.content) return;
        setSaving(true);

        const entryData = {
            factionId: faction.id,
            title: form.title,
            content: form.content,
            year: form.year,
            eventDate: new Date(form.eventDate),
            updatedAt: new Date()
        };

        if (editingId) {
            await setDoc(doc(db, COLLECTIONS.FACTIONS, faction.id, 'lore', editingId), entryData, { merge: true });
        } else {
            await addDoc(collection(db, COLLECTIONS.FACTIONS, faction.id, 'lore'), {
                ...entryData,
                order: entries.length,
                createdAt: new Date()
            });
        }

        cancelEdit();
        setSaving(false);
        onReload();
    };

    const deleteEntry = async (id: string) => {
        const db = getFirebaseDb();
        if (!db || !confirm('Delete this lore entry?')) return;
        await deleteDoc(doc(db, COLLECTIONS.FACTIONS, faction.id, 'lore', id));
        onReload();
    };

    return (
        <div>
            <SectionHeader title="Lore Entries" count={entries.length} onAdd={() => showForm ? cancelEdit() : setShowForm(true)} addLabel={showForm ? 'Cancel' : 'Add Entry'} />
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <Card className="mb-6 max-w-2xl">
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2"><Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Entry title..." /></div>
                                    <Input label="Display Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2026" />
                                </div>
                                <Input label="Event Date & Time" type="datetime-local" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
                                <MarkdownEditor label="Content" value={form.content} onChange={(val) => setForm({ ...form, content: val })} placeholder="Lore content..." />
                                <PrimaryButton onClick={saveEntry} loading={saving}>{editingId ? 'Update Entry' : 'Save Entry'}</PrimaryButton>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="space-y-3">
                {entries.map((entry) => (
                    <motion.div key={entry.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-start group" whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-orange-400">{entry.year}</span>
                                {entry.eventDate && (
                                    <span className="text-xs text-neutral-500">
                                        • {new Date((entry.eventDate as any).seconds ? (entry.eventDate as any).seconds * 1000 : entry.eventDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-white font-semibold mt-1">{entry.title}</h3>
                            <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{entry.content}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => startEdit(entry)} className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-colors" title="Edit">
                                {Icons.edit}
                            </button>
                            <DeleteButton onClick={() => deleteEntry(entry.id)} />
                        </div>
                    </motion.div>
                ))}
                {entries.length === 0 && <p className="text-neutral-500 text-center py-8">No lore entries yet.</p>}
            </div>
        </div>
    );
}

// Roster Tab
function RosterTab({ faction, members, onReload }: { faction: Faction; members: Member[]; onReload: () => void }) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', role: '', rank: '', isLeader: false });
    const [saving, setSaving] = useState(false);

    const addMember = async () => {
        const db = getFirebaseDb();
        if (!db || !form.name) return;
        setSaving(true);
        await addDoc(collection(db, COLLECTIONS.FACTIONS, faction.id, 'members'), { factionId: faction.id, ...form, joinedAt: new Date(), updatedAt: new Date() });
        setShowForm(false);
        setForm({ name: '', role: '', rank: '', isLeader: false });
        setSaving(false);
        onReload();
    };

    const deleteMember = async (id: string) => {
        const db = getFirebaseDb();
        if (!db || !confirm('Remove this member?')) return;
        await deleteDoc(doc(db, COLLECTIONS.FACTIONS, faction.id, 'members', id));
        onReload();
    };

    return (
        <div>
            <SectionHeader title="Members" count={members.length} onAdd={() => setShowForm(!showForm)} addLabel={showForm ? 'Cancel' : 'Add Member'} />
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <Card className="mb-6 max-w-2xl">
                            <div className="space-y-4">
                                <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Character name..." />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Enforcer" />
                                    <Input label="Rank" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} placeholder="e.g. Lieutenant" />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={form.isLeader} onChange={(e) => setForm({ ...form, isLeader: e.target.checked })} className="w-4 h-4 rounded bg-black/30 border-white/20" />
                                    <span className="text-neutral-300">Is Leader/Founder</span>
                                </label>
                                <PrimaryButton onClick={addMember} loading={saving}>Add Member</PrimaryButton>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {members.map((member) => (
                    <motion.div key={member.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-3 group" whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${faction.gradientFrom}, ${faction.gradientTo})` }}>{member.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-white font-semibold truncate">{member.name}</h3>
                                {member.isLeader && <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-orange-500/20 text-orange-400">LEADER</span>}
                            </div>
                            <p className="text-xs text-neutral-400 truncate">{member.role} {member.rank && `• ${member.rank}`}</p>
                        </div>
                        <DeleteButton onClick={() => deleteMember(member.id)} />
                    </motion.div>
                ))}
                {members.length === 0 && <p className="text-neutral-500 text-center py-8 col-span-full">No members yet.</p>}
            </div>
        </div>
    );
}

// Gallery Tab
function GalleryTab({ faction, items, onReload }: { faction: Faction; items: GalleryItem[]; onReload: () => void }) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ imageUrl: '', title: '', tag: '', desc: '' });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const storage = getFirebaseStorage();
        if (!storage) {
            alert('Storage not configured');
            return;
        }

        setUploading(true);
        try {
            const storageRef = ref(storage, `gallery/${faction.id}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setForm(prev => ({ ...prev, imageUrl: url }));
        } catch (err) {
            console.error('Upload failed', err);
            alert('Upload failed. Check console.');
        }
        setUploading(false);
    };

    const addItem = async () => {

        const db = getFirebaseDb();
        if (!db || !form.imageUrl) return;
        setSaving(true);
        await addDoc(collection(db, COLLECTIONS.FACTIONS, faction.id, 'gallery'), {
            factionId: faction.id,
            imageUrl: form.imageUrl,
            title: form.title,
            tag: form.tag,
            desc: form.desc,
            caption: form.title, // Fallback
            uploadedAt: new Date(),
            updatedAt: new Date()
        });
        setShowForm(false);
        setForm({ imageUrl: '', title: '', tag: '', desc: '' });
        setSaving(false);
        onReload();
    };

    const deleteItem = async (id: string) => {
        const db = getFirebaseDb();
        if (!db || !confirm('Delete this image?')) return;
        await deleteDoc(doc(db, COLLECTIONS.FACTIONS, faction.id, 'gallery', id));
        onReload();
    };

    return (
        <div>
            <SectionHeader title="Gallery Images" count={items.length} onAdd={() => setShowForm(!showForm)} addLabel={showForm ? 'Cancel' : 'Add Image'} />
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <Card className="mb-6 max-w-2xl">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Image title..." />
                                    <Input label="Tag" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="e.g. Event, Raid..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">Image</label>
                                    <div className="flex gap-2">
                                        <Input label="" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://imgur.com/..." style={{ marginBottom: 0 }} />
                                        <label className="flex items-center justify-center px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors border border-white/10" title="Upload Image">
                                            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                                            {uploading ? <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : Icons.upload}
                                        </label>
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1">Paste a URL or upload a file.</p>
                                </div>

                                <TextArea label="Description" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Image description..." />
                                <PrimaryButton onClick={addItem} loading={saving}>Add Image</PrimaryButton>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                    <motion.div key={item.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden group relative" whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                        <div className="aspect-video bg-black/30 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.imageUrl} alt={item.title || 'Gallery'} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <div className="p-3">
                            <h4 className="text-white font-medium truncate">{item.title || 'Untitled'}</h4>
                            <p className="text-xs text-orange-400 mb-1">{item.tag}</p>
                            <p className="text-sm text-neutral-400 truncate">{item.desc || item.caption}</p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"><DeleteButton onClick={() => deleteItem(item.id)} /></div>
                    </motion.div>
                ))}
                {items.length === 0 && <p className="text-neutral-500 text-center py-8 col-span-full">No gallery images yet.</p>}
            </div>
        </div>
    );
}

// Clips Tab
function ClipsTab({ faction, clips, onReload }: { faction: Faction; clips: Clip[]; onReload: () => void }) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', videoUrl: '', thumbnailUrl: '', platform: 'youtube' });
    const [saving, setSaving] = useState(false);

    const addClip = async () => {
        const db = getFirebaseDb();
        if (!db || !form.videoUrl || !form.title) return;
        setSaving(true);
        await addDoc(collection(db, COLLECTIONS.FACTIONS, faction.id, 'clips'), { factionId: faction.id, title: form.title, videoUrl: form.videoUrl, thumbnailUrl: form.thumbnailUrl, platform: form.platform, uploadedAt: new Date(), updatedAt: new Date() });
        setShowForm(false);
        setForm({ title: '', videoUrl: '', thumbnailUrl: '', platform: 'youtube' });
        setSaving(false);
        onReload();
    };

    const deleteClip = async (id: string) => {
        const db = getFirebaseDb();
        if (!db || !confirm('Delete this clip?')) return;
        await deleteDoc(doc(db, COLLECTIONS.FACTIONS, faction.id, 'clips', id));
        onReload();
    };

    return (
        <div>
            <SectionHeader title="Video Clips" count={clips.length} onAdd={() => setShowForm(!showForm)} addLabel={showForm ? 'Cancel' : 'Add Clip'} />
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <Card className="mb-6 max-w-2xl">
                            <div className="space-y-4">
                                <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Clip title..." />
                                <Input label="Video URL" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
                                <Input label="Thumbnail URL (optional)" value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="https://..." />
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">Platform</label>
                                    <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:border-orange-500/50">
                                        <option value="youtube">YouTube</option>
                                        <option value="twitch">Twitch</option>
                                        <option value="tiktok">TikTok</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <PrimaryButton onClick={addClip} loading={saving}>Add Clip</PrimaryButton>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clips.map((clip) => (
                    <motion.div key={clip.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden group" whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                        <div className="aspect-video bg-black/30 flex items-center justify-center relative">
                            {clip.thumbnailUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-4xl">🎬</div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href={clip.videoUrl} target="_blank" className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">▶</a>
                            </div>
                        </div>
                        <div className="p-3 flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium truncate">{clip.title}</h3>
                                <span className="text-xs text-neutral-400 uppercase">{clip.platform}</span>
                            </div>
                            <DeleteButton onClick={() => deleteClip(clip.id)} />
                        </div>
                    </motion.div>
                ))}
                {clips.length === 0 && <p className="text-neutral-500 text-center py-8 col-span-full">No video clips yet.</p>}
            </div>
        </div>
    );
}


