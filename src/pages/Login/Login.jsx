import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("access")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email or username.");
      return;
    }

    if (email.includes("@") && !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/api/auth/login/", {
        username: email,
        password: password,
      });

      if (response.data.message) {
        localStorage.setItem("access", response.data.token.access);
        localStorage.setItem("refresh", response.data.token.refresh);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Invalid credentials or server error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-[440px] border-2 border-black p-6 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white" style={{ borderRadius: '4px' }}>
          <form onSubmit={handleLogin}>
            <div className="mb-12">
              <h4 className="text-4xl font-black text-black mb-2 tracking-tighter uppercase font-['Space_Grotesk'] leading-tight">
                Authenticating
              </h4>
              <p className="text-zinc-400 font-medium tracking-tight">Access your personal entry system.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="input-label">Identity</label>
                <input
                  type="text"
                  placeholder="Email or Username"
                  className="input-box"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="input-label mb-0">Security Key</label>
                </div>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 border border-red-500 text-red-500 text-[11px] font-bold uppercase tracking-widest text-center">
                Error: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-bold py-4 uppercase tracking-widest text-xs mt-10 hover:opacity-90 active:translate-y-1 transition-all"
              style={{ borderRadius: '4px' }}
            >
              {isLoading ? "Validating..." : "Enter Workspace"}
            </button>

            <p className="text-xs text-zinc-400 text-center mt-8 font-bold uppercase tracking-widest">
              No identity?{" "}
              <Link to="/register" className="text-black hover:underline underline-offset-4">
                Register Device
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;