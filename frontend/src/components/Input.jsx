import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-[#111827] text-white placeholder-gray-500 rounded-xl text-sm border focus:outline-none transition-all duration-200 ${
            Icon ? 'pl-11' : 'pl-4'
          } ${isPasswordType ? 'pr-11' : 'pr-4'} py-3 ${
            error
              ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-800 hover:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          } ${className}`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>}
    </div>
  );
};

export default Input;
