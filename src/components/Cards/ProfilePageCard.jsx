import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { MdEmail, MdPerson, MdNote, MdArrowBack } from 'react-icons/md';
import { getInitials } from '../../utils/helper';

function ProfilePageCard() {
  const navigate = useNavigate();
  const { username } = useParams();
  const location = useLocation();
  const userInfo = location.state?.userInfo;

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <Navbar onSearchNote={() => { }} onSearchClear={() => { }} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-all mb-10"
        >
          <MdArrowBack /> _BACK_TO_WORKSPACE
        </Link>

        <div className="flex justify-center">
          {userInfo ? (
            <div className="w-full max-w-md border-2 border-black p-10 bg-white" style={{ borderRadius: '4px' }}>
              <div className="flex flex-col items-center mb-10">
                <div className="w-24 h-24 flex items-center justify-center bg-black text-white text-3xl font-black mb-4" style={{ borderRadius: '4px' }}>
                  {getInitials(userInfo.fullname)}
                </div>

                <h2 className="text-3xl font-black text-black uppercase tracking-tighter font-['Space_Grotesk']">{userInfo.fullname}</h2>
                <p className="text-zinc-400 font-bold text-[11px] uppercase tracking-widest mt-1">OPERATOR_ID: {userInfo.username}</p>
              </div>

              <div className="space-y-6 border-t border-b border-zinc-100 py-8 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-zinc-100 flex items-center justify-center text-black" style={{ borderRadius: '4px' }}>
                    <MdEmail size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Network_Email</p>
                    <p className="text-sm font-bold text-black">{userInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-zinc-100 flex items-center justify-center text-black" style={{ borderRadius: '4px' }}>
                    <MdNote size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Storage_Index</p>
                    <p className="text-sm font-bold text-black">{userInfo.total_notes} Objects Stored</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-zinc-100 flex items-center justify-center text-black" style={{ borderRadius: '4px' }}>
                    <MdPerson size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Commission_Date</p>
                    <p className="text-sm font-bold text-black uppercase">
                      {new Date(userInfo.date_joined).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={onLogout}
                  className="px-6 py-4 border border-black text-black font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-50 transition-all"
                  style={{ borderRadius: '4px' }}
                >
                  Terminate
                </button>
                <Link
                  to="/"
                  className="px-6 py-4 bg-black text-white font-bold uppercase tracking-widest text-[10px] text-center hover:opacity-90 transition-all"
                  style={{ borderRadius: '4px' }}
                >
                  Workspace
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-zinc-100 px-20" style={{ borderRadius: '8px' }}>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 mb-6 font-['Inter']">
                ERR_USER_NOT_FOUND
              </div>
              <Link to="/login" className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest text-[10px]" style={{ borderRadius: '4px' }}>Reconnect</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePageCard;
