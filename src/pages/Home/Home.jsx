import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd, MdOutlineSpaceDashboard, MdTaskAlt, MdPersonOutline } from 'react-icons/md';
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

  const toggleShare = async (data) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/notes/share/toggle/${data.id}/`);
      if (response.data) {
        showToastMessage(response.data.is_public ? "Public Link Generated!" : "Archive Restricted.");
        getAllNotes();
      }
    } catch (error) {
      console.error("Error toggling share:", error);
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

  const [view, setView] = useState("notes"); // 'notes' or 'tasks'
  const [activeTab, setActiveTab] = useState("archives");

  const categories = ["All", "Work", "Personal", "Ideas", "Important", "Daily Work", "Miscellaneous"];

  const filteredNotes = view === 'tasks'
    ? allNotes
      .filter(note => note.category === 'Daily Work')
      .sort((a, b) => a.is_completed - b.is_completed)
    : (filterCategory === "All"
      ? allNotes
      : allNotes.filter(note => note.category === filterCategory));

  return (
    <div className="min-h-screen bg-white font-['Inter'] pb-24 md:pb-0">
      <Navbar onSearchNote={onSearchNote} onSearchClear={handleClearSearch} />

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 animate-in fade-in duration-500">
        <div className="flex flex-col gap-8 mb-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-black mb-2 tracking-tighter uppercase font-['Space_Grotesk'] leading-none">
                {view === 'notes' ? 'Studio Notes' : 'Studio Notes'}
              </h1>
              <p className="text-zinc-400 font-medium tracking-tight text-sm uppercase tracking-[0.2em]">
                {view === 'notes' ? '_SYSTEM_READY' : '_OBJECTIVES_ACTIVE'}
              </p>
            </div>

            {/* Scrollable Categories - Mobile Optimized */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 md:pb-0 md:mx-0 md:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 whitespace-nowrap ${filterCategory === cat
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

          {/* Stats Grid - Compact for SaaS feel */}
          {!loading && allNotes.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: view === 'notes' ? 'Total_Entries' : 'Active_Tasks', value: view === 'notes' ? allNotes.length : allNotes.filter(n => n.category === 'Daily Work' && !n.is_completed).length },
                { label: view === 'notes' ? 'Pinned_Files' : 'Finalized', value: view === 'notes' ? allNotes.filter(n => n.ispinned).length : allNotes.filter(n => n.category === 'Daily Work' && n.is_completed).length },
                { label: 'System_Sync', value: '100%' },
                { label: 'Active_Index', value: new Set(allNotes.map(n => n.category)).size }
              ].map((stat, i) => (
                <div key={i} className="border border-zinc-100 p-5 flex flex-col justify-between" style={{ borderRadius: '4px' }}>
                  <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-4">{stat.label}</p>
                  <p className="text-3xl font-black text-black font-['Space_Grotesk'] leading-none">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-black"></div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-black">
              {view === 'notes' ? 'Active_Archives' : 'Mission_Directives'}
            </h2>
          </div>

          <div className="hidden md:flex bg-zinc-50 p-1" style={{ borderRadius: '4px' }}>
            <button
              onClick={() => setView('notes')}
              className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${view === 'notes' ? 'bg-black text-white' : 'text-zinc-400 hover:text-black'}`}
              style={{ borderRadius: '2px' }}
            >
              Notes
            </button>
            <button
              onClick={() => setView('tasks')}
              className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${view === 'tasks' ? 'bg-black text-white' : 'text-zinc-400 hover:text-black'}`}
              style={{ borderRadius: '2px' }}
            >
              Tasks
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Syncing_System...</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${view === 'notes' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                view === 'notes' ? (
                  <NoteCard
                    key={note.id}
                    title={note.title}
                    date={note.created_at}
                    content={note.description}
                    tags={note.tags ? note.tags.split(',') : []}
                    category={note.category}
                    isPinned={note.ispinned}
                    isPublic={note.is_public}
                    shareToken={note.share_token}
                    onEdit={() => handleEdit(note)}
                    onDelete={() => deleteNote(note)}
                    onPinNote={() => pinNote(note)}
                    onShare={() => toggleShare(note)}
                  />
                ) : (
                  <div
                    key={note.id}
                    className="group border border-zinc-100 p-6 flex items-center gap-6 hover:border-black transition-all cursor-pointer"
                    onClick={() => handleEdit(note)}
                    style={{ borderRadius: '4px' }}
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-black uppercase tracking-tight">{note.title}</h3>
                      <p className="text-[10px] text-zinc-400 font-medium uppercase mt-1 tracking-widest">{note.category}</p>
                    </div>
                    <div className="text-[10px] font-bold text-zinc-300 group-hover:text-black uppercase tracking-widest">
                      _DETAILS
                    </div>
                  </div>
                )
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

      {/* Primary Floating Action Button */}
      <button
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-black text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group z-50"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: view === 'tasks' ? { category: 'Daily Work' } : null
          });
        }}
        style={{ borderRadius: '4px' }}
      >
        <MdAdd className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      </button >

      {/* SaaS Style Bottom Navigation for Mobile */}
      < div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-6 py-3 flex items-center justify-between md:hidden z-[60]" >
        <button
          onClick={() => { setView('notes'); setActiveTab('archives'); }}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'archives' ? 'text-black' : 'text-zinc-300'}`}
        >
          <MdOutlineSpaceDashboard size={24} />
          <span className="text-[8px] font-black uppercase tracking-widest">Archives</span>
        </button>
        <button
          onClick={() => { setView('tasks'); setActiveTab('tasks'); }}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'tasks' ? 'text-black' : 'text-zinc-300'}`}
        >
          <MdTaskAlt size={24} />
          <span className="text-[8px] font-black uppercase tracking-widest">Tasks</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('operator');
            userInfo && navigate(`/profile/${userInfo.username}`, { state: { userInfo } });
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'operator' ? 'text-black' : 'text-zinc-300'}`}
        >
          <MdPersonOutline size={24} />
          <span className="text-[8px] font-black uppercase tracking-widest">Operator</span>
        </button>
      </div >

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
    </div >
  );
}

export default Home;
