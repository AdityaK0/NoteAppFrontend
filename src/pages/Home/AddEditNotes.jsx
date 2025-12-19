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
    <div className="relative font-['Inter']">
      <div className="flex items-center justify-between mb-8">
        <h5 className="text-2xl font-black text-black uppercase tracking-tighter font-['Space_Grotesk']">
          {type === 'edit' ? 'Update Entry' : 'New Entry'}
        </h5>
        <button
          onClick={onClose}
          className="p-1 border border-transparent hover:border-black transition-all"
          style={{ borderRadius: '4px' }}
        >
          <MdClose size={24} />
        </button>
      </div>

      <div className="space-y-6">
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

        <div>
          <label className="input-label">Detailed Content</label>
          <textarea
            className="input-box min-h-[140px] resize-none py-4"
            placeholder="Expand your thoughts..."
            rows={5}
            value={description}
            onChange={({ target }) => setdescription(target.value)}
          />
        </div>

        <div>
          <label className="input-label">Metadata Tags</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 border border-red-500 text-red-500 text-[11px] font-bold uppercase tracking-widest text-center">
          Error: {error}
        </div>
      )}

      <button
        className="w-full bg-black text-white font-bold py-4 uppercase tracking-widest text-xs mt-10 hover:opacity-90 active:translate-y-1 transition-all"
        onClick={handleAddNote}
        disabled={isLoading}
        style={{ borderRadius: '4px' }}
      >
        {isLoading ? "Processing..." : (type === "edit" ? "Update System Entry" : "Commit Entry")}
      </button>
    </div>
  );
}

export default AddEditNotes;