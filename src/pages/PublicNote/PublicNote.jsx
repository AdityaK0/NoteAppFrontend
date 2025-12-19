import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { timeFormatter } from '../../utils/timeFormat';
import { MdOutlineArrowBack, MdPublic } from 'react-icons/md';

function PublicNote() {
    const { token } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPublicNote = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/notes/public/${token}/`);
                setNote(response.data);
            } catch (err) {
                setError("This archive is restricted or does not exist.");
            } finally {
                setLoading(false);
            }
        };
        fetchPublicNote();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <h1 className="text-4xl font-black text-black mb-4 font-['Space_Grotesk'] uppercase tracking-tighter">Access Denied</h1>
                <p className="text-zinc-400 font-medium mb-8 max-w-md">{error}</p>
                <Link to="/login" className="px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest" style={{ borderRadius: '4px' }}>
                    Return to Operator Console
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-['Inter']">
            <div className="max-w-3xl mx-auto px-6 py-12 md:py-24">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest" style={{ borderRadius: '2px' }}>
                        <MdPublic size={12} /> Public_Archives
                    </div>
                </div>

                <div className="border-l-4 border-black pl-8 py-2 mb-12">
                    <h1 className="text-5xl font-black text-black mb-4 tracking-tighter uppercase font-['Space_Grotesk'] leading-tight">
                        {note.title}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                            Published: {timeFormatter(note.created_at)}
                        </span>
                        <div className="h-4 w-[1px] bg-zinc-100"></div>
                        <span className="text-[11px] font-black text-black uppercase tracking-widest">
                            Author: {note.username}
                        </span>
                    </div>
                </div>

                <div className="prose prose-zinc max-w-none mb-16">
                    <p className="text-lg text-zinc-800 leading-relaxed font-medium whitespace-pre-wrap">
                        {note.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-12 border-t border-zinc-100">
                    <span className="px-3 py-1 border border-black text-[10px] font-bold uppercase tracking-widest text-black" style={{ borderRadius: '2px' }}>
                        {note.category}
                    </span>
                    {note.tags?.split(',').map((tag, i) => (
                        <span key={i} className="text-[11px] text-zinc-400 font-medium lowercase">#{tag.trim()}</span>
                    ))}
                </div>

                <footer className="mt-24 pt-12 border-t border-zinc-100 text-center">
                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.3em] mb-4">Powered by Note Studio SaaS</p>
                    <Link to="/register" className="inline-block text-[10px] font-black border-b-2 border-black pb-1 hover:text-zinc-600 transition-colors uppercase tracking-widest">
                        Create Your Own Archives
                    </Link>
                </footer>
            </div>
        </div>
    );
}

export default PublicNote;
