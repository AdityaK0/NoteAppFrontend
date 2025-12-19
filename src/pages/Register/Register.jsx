import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("access")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please choose a username.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please create a password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/auth/register/", {
        username,
        fullname: name,
        email,
        password,
      });

      if (response.data?.error) {
        setError(response.data.error);
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[500px] border-2 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white" style={{ borderRadius: '4px' }}>
          <form onSubmit={handleRegister}>
            <div className="mb-12">
              <h4 className="text-4xl font-black text-black mb-2 tracking-tighter uppercase font-['Space_Grotesk'] leading-tight">
                New Identity
              </h4>
              <p className="text-zinc-400 font-medium tracking-tight">Create your entry in the system.</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">Username</label>
                  <input
                    type="text"
                    placeholder="Handle"
                    className="input-box"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    placeholder="Legal Name"
                    className="input-box"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Email System</label>
                <input
                  type="text"
                  placeholder="name@provider.com"
                  className="input-box"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Security Key</label>
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
              {isLoading ? "Provisioning..." : "Create Account"}
            </button>

            <p className="text-xs text-zinc-400 text-center mt-8 font-bold uppercase tracking-widest">
              Existing Account?{" "}
              <Link to="/login" className="text-black hover:underline underline-offset-4">
                Verify
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;