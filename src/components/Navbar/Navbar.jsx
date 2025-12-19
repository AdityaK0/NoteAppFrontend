import React, { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate, Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

function Navbar({ onSearchNote, onSearchClear }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    onSearchClear();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-zinc-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        <h2 className="text-xl font-bold tracking-tighter font-['Space_Grotesk']">
          <Link to="/" className="text-black hover:opacity-70 transition-opacity uppercase">
            NoteHub
          </Link>
        </h2>

        <div className="flex-1 max-w-lg hidden sm:block">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>

        <ProfileInfo onLogout={onLogout} />
      </div>
    </nav>
  );
}

export default Navbar;