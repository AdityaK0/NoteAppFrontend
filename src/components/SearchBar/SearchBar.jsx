import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';

function SearchBar({ value, onChange, handleSearch, onClearSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FaMagnifyingGlass className="h-4 w-4 text-zinc-400 group-focus-within:text-black transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full pl-11 pr-10 py-2.5 bg-white border border-zinc-200 text-sm transition-all focus:border-black focus:ring-1 focus:ring-black outline-none"
        style={{ borderRadius: '4px' }}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <button
          onClick={onClearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-black transition-colors"
        >
          <IoMdClose size={20} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;