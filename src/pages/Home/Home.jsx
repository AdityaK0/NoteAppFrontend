import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import EmptyCard from '../../components/Cards/EmptyCard';
import Toast from '../../components/ToastMessage/Toast';

function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "" });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/auth/get-user/");
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/notes/");
      if (response.data && response.data.all_notes) {
        setAllNotes(response.data.all_notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (data) => {
    try {
      const response = await axiosInstance.delete(`/api/v1/notes/delete/${data.id}/`);
      if (response.data) {
        showToastMessage("Note Deleted Successfully", 'delete');
        getAllNotes();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const pinNote = async (data) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/notes/pin-note/${data.id}/`, {
        ispinned: !data.ispinned
      });
      if (response.data) {
        showToastMessage(!data.ispinned ? "Note Pinned!" : "Note Unpinned!");
        getAllNotes();
      }
    } catch (error) {
      console.error("Error pinning note:", error);
    }
  };

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get(`/api/v1/notes/search-notes/`, {
        params: { query }
      });
      if (response.data && response.data.all_notes) {
        setAllNotes(response.data.all_notes);
        setIsSearch(true);
      }
    } catch (error) {
      console.error("Error searching notes:", error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  const categories = ["All", "Work", "Personal", "Ideas", "Important", "Daily Work", "Miscellaneous"];

  const filteredNotes = filterCategory === "All"
    ? allNotes
    : allNotes.filter(note => note.category === filterCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onSearchNote={onSearchNote} onSearchClear={handleClearSearch} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-black mb-2 tracking-tighter uppercase font-['Space_Grotesk']">
              Studio Notes
            </h1>
            <p className="text-zinc-400 font-medium tracking-tight">Systematic thought organization.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
                  filterCategory === cat
                    ? "bg-black text-white border-black"
                    : "bg-white text-zinc-400 border-zinc-100 hover:border-black hover:text-black"
                }`}
                style={{ borderRadius: '4px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Section for Final Year Project depth */}
        {!loading && allNotes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="border border-zinc-100 p-4" style={{ borderRadius: '4px' }}>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total_Entries</p>
              <p className="text-2xl font-black text-black font-['Space_Grotesk']">{allNotes.length}</p>
            </div>
            <div className="border border-zinc-100 p-4" style={{ borderRadius: '4px' }}>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Pinned_Priority</p>
              <p className="text-2xl font-black text-black font-['Space_Grotesk']">{allNotes.filter(n => n.ispinned).length}</p>
            </div>
            <div className="border border-zinc-100 p-4" style={{ borderRadius: '4px' }}>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Active_Categories</p>
              <p className="text-2xl font-black text-black font-['Space_Grotesk']">{new Set(allNotes.map(n => n.category)).size}</p>
            </div>
            <div className="border border-zinc-100 p-4 bg-zinc-50" style={{ borderRadius: '4px' }}>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Last_Sync</p>
              <p className="text-[12px] font-bold text-black uppercase mt-2">Just Now</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Synchronizing...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  title={note.title}
                  date={note.created_at}
                  content={note.description}
                  tags={note.tags ? note.tags.split(',') : []}
                  category={note.category}
                  isPinned={note.ispinned}
                  onEdit={() => handleEdit(note)}
                  onDelete={() => deleteNote(note)}
                  onPinNote={() => pinNote(note)}
                />
              ))
            ) : (
              <div className="col-span-full border border-dashed border-zinc-200 py-24 flex flex-col items-center justify-center" style={{ borderRadius: '8px' }}>
                <EmptyCard 
                   message={isSearch ? "Nothing found in the archives." : "The studio is empty. Create your first entry."}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <button
        className="fixed bottom-10 right-10 w-16 h-16 bg-black text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group z-50"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
        style={{ borderRadius: '4px' }}
      >
        <MdAdd className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
          },
        }}
        contentLabel="Note Modal"
        className="w-[95%] md:w-[600px] max-h-[90vh] bg-white mx-auto mt-[5vh] p-10 overflow-auto border-black border-2 outline-none shadow-2xl"
        style={{ borderRadius: '4px' }}
      >
        <AddEditNotes
          type={openAddEditModal.type}
          data={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
}

export default Home;
