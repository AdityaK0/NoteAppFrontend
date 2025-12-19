import React, { useState, useEffect } from 'react';
import { getInitials } from '../../utils/helper';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

function ProfileInfo() {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const saved = localStorage.getItem("userInfo");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (userInfo) {
      navigate(`/profile/${userInfo.username}`, { state: { userInfo } });
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/auth/get-user/");
      if (response.data) {
        setUserInfo(response.data);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!userInfo && localStorage.getItem("access")) {
      getUserInfo();
    }
  }, []);

  const isAuthenticated = !!localStorage.getItem("access");

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-6">
        <Link to="/login" className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
          AUTH_SYSTEM
        </Link>
        <Link to="/register" className="px-6 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-80 transition-all" style={{ borderRadius: '2px' }}>
          JOIN
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 font-['Inter']">
      <div className="text-right hidden sm:block">
        <p className="text-[12px] font-black text-black leading-none mb-1 uppercase tracking-tighter">{userInfo?.fullname || "OPERATOR"}</p>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="text-[9px] font-bold text-zinc-300 hover:text-black uppercase tracking-[0.2em] transition-colors"
        >
          _TERMINATE_SESSION
        </button>
      </div>

      <button
        onClick={handleProfileClick}
        className="w-10 h-10 flex items-center justify-center bg-black text-white font-black text-xs hover:scale-105 active:scale-95 transition-all duration-200"
        style={{ borderRadius: '4px' }}
      >
        {getInitials(userInfo?.fullname) || "OP"}
      </button>
    </div>
  );
}

export default ProfileInfo;