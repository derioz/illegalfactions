'use client';

import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import EmojiPicker from 'emoji-picker-react';
import { getFirebaseStorage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';

interface MarkdownEditorProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minRows?: number;
}

const ToolbarButton = ({ icon, onClick, tooltip, active = false }: { icon: React.ReactNode; onClick: () => void; tooltip: string; active?: boolean }) => (
    <button
        type="button"
        onClick={onClick}
        title={tooltip}
        className={`p-2 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors ${active ? 'bg-white/10 text-white' : ''}`}
    >
        {icon}
    </button>
);

const Icons = {
    bold: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 100-8H6v8zm0 0h10a4 4 0 110 8H6v-8z" /></svg>,
    italic: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>, // Actually Code icon, but used for simplicity or change path? Let's use standard I
    italicReal: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m-6 0h6m-6 16h6" /></svg>,
    heading: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>,
    link: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    image: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    emoji: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    preview: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    edit: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    list: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>, // List icon approximate
};

export function MarkdownEditor({ label, value, onChange, placeholder, minRows = 4 }: MarkdownEditorProps) {
    const [view, setView] = useState<'write' | 'preview'>('write');
    const [showEmoji, setShowEmoji] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertText = (before: string, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) {
            onChange(value + before + after);
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newValue);

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length + after.length;
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }, 0);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const storage = getFirebaseStorage();
        if (!storage) {
            alert('Storage not initialized');
            return;
        }

        setUploading(true);
        try {
            const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            insertText(`\n![Image](${url})\n`);
        } catch (err) {
            console.error(err);
            alert('Upload failed. Check console.');
        }
        setUploading(false);
    };

    const onEmojiClick = (emojiObject: any) => {
        insertText(emojiObject.emoji);
        setShowEmoji(false);
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-neutral-300">{label}</label>}

            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-white/5">
                    <div className="flex bg-black/20 rounded p-1">
                        <ToolbarButton
                            icon={Icons.edit}
                            active={view === 'write'}
                            onClick={() => setView('write')}
                            tooltip="Write"
                        />
                        <ToolbarButton
                            icon={Icons.preview}
                            active={view === 'preview'}
                            onClick={() => setView('preview')}
                            tooltip="Preview"
                        />
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    <ToolbarButton icon={Icons.bold} onClick={() => insertText('**', '**')} tooltip="Bold" />
                    <ToolbarButton icon={Icons.italicReal} onClick={() => insertText('*', '*')} tooltip="Italic" />
                    <ToolbarButton icon={Icons.heading} onClick={() => insertText('### ')} tooltip="Heading" />
                    <ToolbarButton icon={Icons.link} onClick={() => insertText('[', '](url)')} tooltip="Link" />

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    <ToolbarButton
                        icon={uploading ? <span className="animate-spin text-xs">↻</span> : Icons.image}
                        onClick={() => fileInputRef.current?.click()}
                        tooltip="Upload Image"
                    />

                    <div className="relative">
                        <ToolbarButton
                            icon={Icons.emoji}
                            onClick={() => setShowEmoji(!showEmoji)}
                            tooltip="Insert Emoji"
                            active={showEmoji}
                        />
                        {showEmoji && (
                            <div className="absolute top-full left-0 z-50 mt-2">
                                <div className="fixed inset-0" onClick={() => setShowEmoji(false)} />
                                <div className="relative z-10 shadow-xl border border-white/10 rounded-lg overflow-hidden">
                                    <EmojiPicker theme={'dark' as any} onEmojiClick={onEmojiClick} width={300} height={400} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="relative min-h-[200px] bg-black/30">
                    {view === 'write' ? (
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full h-full min-h-[200px] p-4 bg-transparent text-white placeholder-neutral-500 focus:outline-none resize-y font-mono text-sm"
                            placeholder={placeholder}
                            rows={minRows}
                        />
                    ) : (
                        <div className="p-4 prose prose-invert prose-sm max-w-none min-h-[200px]">
                            <ReactMarkdown>{value || '*(No content)*'}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-xs text-neutral-500">
                Supports Markdown • Images can be uploaded or pasted as URLs.
            </p>
        </div>
    );
}
