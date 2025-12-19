import React, { useState } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

function AddEditNotes({ getAllNotes, data, type, onClose, showToastMessage }) {
  const [title, setTitle] = useState(data?.title || "");
  const [description, setdescription] = useState(data?.description || "");
  const [tags, setTags] = useState(data?.tags ? data.tags.split(",").map(tag => tag.trim()) : []);
  const [category, setCategory] = useState(data?.category || "Work");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(data?.is_completed || false);
  const [isPublic, setIsPublic] = useState(data?.is_public || false);
  const [zenMode, setZenMode] = useState(false);

  const refineWithAI = () => {
    if (!description.trim()) return;
    setIsLoading(true);
    // Simulate AI refining the note for professional tone
    setTimeout(() => {
      const refined = description
        .replace(/\bi\b/g, "the operator")
        .replace(/want to/g, "aims to")
        .replace(/going to/g, "scheduled to")
        .toUpperCase()
        .split('.')
        .map(s => s.trim() ? `> ${s.trim()}.` : '')
        .join('\n');

      setdescription(refined);
      setIsLoading(false);
      showToastMessage("AI: Context Optimized.", "add");
    }, 1200);
  };

  const handleAddNote = async () => {
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const payload = {
        title,
        category,
        description,
        is_completed: isCompleted,
        is_public: isPublic,
        tags: tags.join(","),
      };

      if (type === "edit") {
        const response = await axiosInstance.put(`/api/v1/notes/update/${data.id}/`, payload);
        if (response.data) {
          showToastMessage("Note updated successfully");
          getAllNotes();
          onClose();
        }
      } else {
        const response = await axiosInstance.post("/api/v1/notes/add-note/", payload);
        if (response.data) {
          showToastMessage("Note added successfully");
          getAllNotes();
          onClose();
        }
      }
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        setError(errorData.title?.[0] || errorData.description?.[0] || errorData.detail || "Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${zenMode ? 'fixed inset-0 z-[2000] bg-white p-6 md:p-24 overflow-y-auto anima-in fade-in duration-500' : 'relative'} font-['Inter']`}>
      <div className="flex items-center justify-between mb-8">
        <h5 className="text-2xl font-black text-black uppercase tracking-tighter font-['Space_Grotesk']">
          {zenMode ? 'ZEN_PROTOCOLS_ACTIVE' : (type === 'edit' ? 'Update Entry' : 'New Entry')}
        </h5>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setZenMode(!zenMode)}
            className={`px-3 py-1.5 border text-[9px] font-black uppercase tracking-widest transition-all ${zenMode ? 'bg-black text-white border-black' : 'border-zinc-100 text-zinc-400 hover:border-black hover:text-black'}`}
            style={{ borderRadius: '2px' }}
          >
            {zenMode ? 'Exit_Zen' : 'Zen_Focus'}
          </button>
          <button
            onClick={onClose}
            className="p-1 border border-transparent hover:border-black transition-all"
            style={{ borderRadius: '4px' }}
          >
            <MdClose size={24} />
          </button>
        </div>
      </div>

      <div className={`${zenMode ? 'max-w-4xl mx-auto py-12' : 'space-y-6'}`}>
        {!zenMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="input-label">Conceptual Title</label>
              <input
                type="text"
                className="input-box"
                placeholder="Define the core idea..."
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>

            <div>
              <label className="input-label">Classification</label>
              <div className="relative">
                <select
                  className="input-box appearance-none cursor-pointer pr-10"
                  value={category}
                  onChange={({ target }) => setCategory(target.value)}
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Ideas">Ideas</option>
                  <option value="Important">Important</option>
                  <option value="Daily Work">Daily Work</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {zenMode && (
          <input
            type="text"
            className="w-full text-5xl font-black text-black mb-12 tracking-tighter uppercase font-['Space_Grotesk'] border-b-8 border-black pb-6 bg-transparent outline-none placeholder:text-zinc-100"
            placeholder="UNTITLED_ENTRY"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="input-label mb-0">Detailed Content</label>
            <button
              onClick={refineWithAI}
              disabled={isLoading}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors flex items-center gap-1 border border-zinc-50 px-3 py-1"
              style={{ borderRadius: '2px' }}
            >
              {isLoading ? "REFining..." : "✨ Optimize_Structure"}
            </button>
          </div>
          <textarea
            className={`input-box ${zenMode ? 'min-h-[50vh] text-2xl border-none p-0 outline-none ring-0 focus:ring-0 leading-relaxed' : 'min-h-[200px] py-4'} resize-none transition-all`}
            placeholder="Expand your thoughts..."
            rows={5}
            value={description}
            onChange={({ target }) => setdescription(target.value)}
          />
        </div>

        {!zenMode && (
          <div>
            <label className="input-label">Metadata Tags</label>
            <TagInput tags={tags} setTags={setTags} />
          </div>
        )}

        {!zenMode && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className={`flex-1 flex items-center gap-3 p-4 border transition-all ${isPublic ? 'bg-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' : 'bg-zinc-50 border-zinc-100'}`} style={{ borderRadius: '4px' }}>
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${isPublic ? 'bg-white border-white text-black' : 'bg-white border-black text-transparent hover:bg-zinc-100'}`}
                style={{ borderRadius: '4px' }}
              >
                {isPublic && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isPublic ? 'text-zinc-400' : 'text-black'}`}>Privacy_Protocol</p>
                <p className={`text-[11px] font-bold uppercase tracking-widest ${isPublic ? 'text-white' : 'text-zinc-400'}`}>
                  {isPublic ? "Public_Archive" : "Restricted_Entry"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-8 p-4 border border-red-500 text-red-500 text-[11px] font-bold uppercase tracking-widest text-center">
          Error: {error}
        </div>
      )}

      <button
        className={`${zenMode ? 'fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-sm' : 'w-full'} bg-black text-white font-bold py-5 uppercase tracking-[0.2em] text-xs mt-10 hover:opacity-90 active:translate-y-1 transition-all z-[2001] shadow-2xl`}
        onClick={handleAddNote}
        disabled={isLoading}
        style={{ borderRadius: '4px' }}
      >
        {isLoading ? "Processing..." : (type === "edit" ? "Synchronize Entry" : "Finalize Archive")}
      </button>
    </div>
  );
}

export default AddEditNotes;