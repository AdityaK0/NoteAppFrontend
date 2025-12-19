import React from 'react';

function EmptyCard({ message, extramessage = "" }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-8 text-center font-['Inter']">
      <div className="mb-6 px-4 py-2 border border-zinc-100 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 pointer-events-none">
        Empty_State
      </div>

      <p className="max-w-[320px] text-zinc-400 font-medium leading-relaxed text-sm">
        {message}
      </p>

      {extramessage && (
        <p className="mt-6 text-black font-bold uppercase tracking-widest text-[9px] border-b border-black pb-1">
          {extramessage}
        </p>
      )}
    </div>
  );
}

export default EmptyCard;