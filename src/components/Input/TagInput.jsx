import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

function TagInput({ tags = [], setTags }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTag();
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 font-['Inter']">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest animate-in zoom-in duration-200"
            style={{ borderRadius: '2px' }}
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(index)}
              className="p-0.5 hover:bg-white/20 transition-colors"
            >
              <MdClose size={12} />
            </button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            className="input-box mb-0 py-2.5"
            placeholder="ADD_TAG"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          onClick={addNewTag}
          className="p-2.5 border border-zinc-200 text-zinc-400 hover:border-black hover:text-black transition-all duration-200"
          style={{ borderRadius: '4px' }}
        >
          <MdAdd size={20} />
        </button>
      </div>
    </div>
  );
}

export default TagInput;