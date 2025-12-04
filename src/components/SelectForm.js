import React from "react";
import { ChevronsUpDown } from "lucide-react";

const FormSelect = ({ id, label, value, onChange, icon: Icon, options }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronsUpDown className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  </div>
);

export default FormSelect;
