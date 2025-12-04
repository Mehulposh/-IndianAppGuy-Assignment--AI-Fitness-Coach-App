import React from "react";
import { Brain, Sparkles, CheckSquare } from "lucide-react";

const AiTips = ({ tips }) => (
  <div className="space-y-4">
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-blue-500 rounded-lg">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <h4 className="font-semibold text-lg text-slate-900 dark:text-white">
          Lifestyle &amp; Posture Tips
        </h4>
      </div>
      <ul className="space-y-2">
        {tips.lifestyle_tips.map((tip, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
          >
            <CheckSquare className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-amber-500 rounded-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h4 className="font-semibold text-lg text-slate-900 dark:text-white">
          Your Motivation
        </h4>
      </div>
      <p className="text-slate-700 dark:text-slate-300 italic text-sm leading-relaxed">
        "{tips.motivation}"
      </p>
    </div>
  </div>
);

export default AiTips;
