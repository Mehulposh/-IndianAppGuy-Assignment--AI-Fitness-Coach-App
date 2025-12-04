import React from "react";
import { Dumbbell, Zap, Wand2, Play, StopCircle } from "lucide-react";

const WorkoutPlan = ({ plan, onExerciseClick, onPlayAudio, isSpeaking, currentlyPlaying }) => (
  <div className="space-y-4">
    {plan.daily_routine.map((day) => (
      <div
        key={day.day}
        className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500 rounded-lg">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-base text-slate-900 dark:text-white">
                {day.day}
              </h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">{day.focus}</p>
            </div>
          </div>
          <button
            onClick={() =>
              onPlayAudio(
                day.day,
                `Workout for ${day.day}: ${day.focus}. ${day.exercises
                  .map((ex) => `${ex.name}: ${ex.sets} sets of ${ex.reps}`)
                  .join(". ")}`
              )
            }
            className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            aria-label={`Read ${day.day} workout`}
          >
            {isSpeaking && currentlyPlaying === day.day ? (
              <StopCircle className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
        </div>
        <ul className="space-y-2">
          {day.exercises.map((ex) => (
            <li
              key={ex.name}
              className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group"
              onClick={() =>
                onExerciseClick(
                  ex.name,
                  "A clear, high-quality, realistic photo of a person performing a " + ex.name
                )
              }
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                  <Zap className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-slate-900 dark:text-slate-100 block truncate">
                    {ex.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {ex.sets} sets × {ex.reps} • {ex.rest} rest
                  </span>
                </div>
              </div>
              <Wand2 className="w-4 h-4 text-indigo-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default WorkoutPlan;
