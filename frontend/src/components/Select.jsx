import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  helperText,
  icon: Icon,
  required = false,
  placeholder = 'Select an option...',
  className = '',
  ...props
}) => {
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
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full appearance-none bg-[#111827] text-white rounded-xl text-sm border focus:outline-none transition-all duration-200 ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-10 py-3 ${
            error
              ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-800 hover:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled className="bg-[#111827] text-gray-400">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val} className="bg-[#111827] text-white py-2">
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>}
    </div>
  );
};

export default Select;
