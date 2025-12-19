import React from 'react';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';
import { timeFormatter } from '../../utils/timeFormat';

function NoteCard({ title, date, content, tags, category, isPinned, onEdit, onDelete, onPinNote }) {
  return (
    <div className="card-minimal group flex flex-col h-full relative border-1 p-2">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h6 className="text-lg font-bold text-black leading-tight line-clamp-1 mb-1 font-['Space_Grotesk']">
            {title}
          </h6>
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

      <p className="text-sm text-zinc-600 leading-relaxed line-clamp-4 mb-6 flex-1 font-['Inter']">
        {content}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {category && (
          <span className="px-2 py-0.5 border border-black text-[9px] font-bold uppercase tracking-tighter text-black">
            {category}
          </span>
        )}
        {tags?.map((tag, index) => (
          <span
            key={index}
            className="text-[10px] text-zinc-400 font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
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
