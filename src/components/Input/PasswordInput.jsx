import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

function PasswordInput({ value, onChange, placeholder }) {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="relative group">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Keyphrase"}
        className="input-box pr-12 focus:border-black focus:ring-0 transition-all outline-none"
      />

      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-black transition-colors p-1"
      >
        {isShowPassword ? (
          <FaRegEye size={18} />
        ) : (
          <FaRegEyeSlash size={18} />
        )}
      </button>
    </div>
  );
}

export default PasswordInput;