import React from 'react';
import { MdOutlinePushPin, MdCreate, MdDelete, MdShare, MdPublic, MdOutlineDone, MdContentCopy } from 'react-icons/md';
import { timeFormatter } from '../../utils/timeFormat';
import { useState } from 'react';

function NoteCard({ title, date, content, tags, category, isPinned, isPublic, shareToken, onEdit, onDelete, onPinNote, onShare, showToastMessage }) {
  const [copied, setCopied] = useState(false);


  const copyShareLink = (e) => {
    e.stopPropagation();
    if (!isPublic) {
      onShare();
      return;
    }
    const shareUrl = `${window.location.origin}/s/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToastMessage("Public Access Link Copied!", "add");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-minimal group flex flex-col h-full relative border-1 p-2 bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h6 className="text-lg font-bold text-black leading-tight line-clamp-1 font-['Space_Grotesk'] uppercase tracking-tight">
              {title}
            </h6>
            {isPublic && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                title="Revoke Public Access"
                className="flex items-center gap-1 px-1.5 py-0.5 bg-black text-white text-[8px] font-black uppercase tracking-widest hover:bg-red-500 transition-all active:scale-95"
                style={{ borderRadius: '2px' }}
              >
                <MdPublic size={8} /> Public
              </button>
            )}
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {timeFormatter(date)}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinNote();
          }}
          className={`p-1.5 border transition-all duration-200 ${isPinned
            ? 'bg-black text-white border-black'
            : 'text-zinc-300 border-transparent hover:border-zinc-200 hover:text-black'
            }`}
          style={{ borderRadius: '4px' }}
        >
          <MdOutlinePushPin className={`w-4 h-4 ${isPinned ? 'rotate-[-45deg]' : ''}`} />
        </button>
      </div>

      <p className="text-sm text-zinc-600 leading-relaxed line-clamp-4 mb-6 flex-1 font-['Inter'] transition-all">
        {content}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {category && (
          <span className="px-2 py-0.5 border border-black text-[9px] font-bold uppercase tracking-tighter text-black transition-all">
            {category}
          </span>
        )}
        {tags?.map((tag, index) => (
          <span
            key={index}
            className="text-[10px] text-zinc-400 font-medium transition-all"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
        <button
          onClick={copyShareLink}
          title={isPublic ? (copied ? "Copied!" : "Copy Link") : "Publish to Web"}
          className={`p-2 border transition-all duration-300 ${copied ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-100'} ${isPublic && !copied ? 'text-black border-black' : ''} hover:text-black hover:border-black`}
          style={{ borderRadius: '4px' }}
        >
          {copied ? (
            <MdOutlineDone size={16} className="animate-in zoom-in duration-300" />
          ) : isPublic ? (
            <MdContentCopy size={16} className="animate-in fade-in duration-300" />
          ) : (
            <MdShare size={16} />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 border border-zinc-100 bg-white text-zinc-400 hover:text-black hover:border-black transition-all"
          style={{ borderRadius: '4px' }}
        >
          <MdCreate size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 border border-zinc-100 bg-white text-zinc-400 hover:text-red-500 hover:border-red-500 transition-all"
          style={{ borderRadius: '4px' }}
        >
          <MdDelete size={16} />
        </button>
      </div>
    </div>

  );
}

export default NoteCard;
