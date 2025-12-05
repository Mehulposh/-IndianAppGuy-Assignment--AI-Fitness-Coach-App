import React, { useState } from "react";
import { Brain, Volume2, StopCircle, Trash2, Dumbbell, Soup, CheckSquare } from "lucide-react";
import WorkoutPlan from "./WorkoutPlan";
import DietPlan from "./DietPlan";
import AiTips from "./AiTips";

const PlanDisplay = ({
  plan,
  onRegenerate,
  onClearPlan,
  onActionItemClick,
  onPlayAudio,
  isSpeaking,
  currentlyPlaying,
}) => {
  const [activeTab, setActiveTab] = useState("workout");

  const readFullPlan = () => {
    const workoutText = `Here is your workout plan. ${plan.workout_plan.daily_routine
      .map(
        (day) =>
          `${day.day}, ${day.focus}: ${day.exercises.map((ex) => ex.name).join(", ")}`
      )
      .join(". ")}`;
    const dietText = `Here is your diet plan. ${plan.diet_plan.meal_plan
      .map(
        (day) =>
          `${day.day}: ${Object.entries(day.meals)
            .map(([type, meal]) => `${type}: ${meal.name}`)
            .join(", ")}`
      )
      .join(". ")}`;
    let textToRead = "";
    if (activeTab === "workout") textToRead = workoutText;
    else if (activeTab === "diet") textToRead = dietText;
    else
      textToRead = `Here are your AI tips. ${plan.ai_tips.lifestyle_tips.join(
        ". "
      )}. And for motivation: ${plan.ai_tips.motivation}`;
    onPlayAudio("fullPlan", textToRead);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Your AI-Generated Plan
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={readFullPlan}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2 text-sm"
          >
            {isSpeaking && currentlyPlaying === "fullPlan" ? (
              <StopCircle className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            {isSpeaking && currentlyPlaying === "fullPlan" ? "Stop" : "Read Plan"}
          </button>
          <button
            onClick={onRegenerate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2 text-sm"
          >
            <Brain className="w-4 h-4" />
            Regenerate
          </button>
          <button
            onClick={onClearPlan}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
          {[
            { id: "workout", label: "Workout", icon: Dumbbell },
            { id: "diet", label: "Diet", icon: Soup },
            { id: "tips", label: "AI Tips", icon: CheckSquare },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === id
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === "workout" && (
          <WorkoutPlan
            plan={plan.workout_plan}
            onExerciseClick={onActionItemClick}
            onPlayAudio={onPlayAudio}
            isSpeaking={isSpeaking}
            currentlyPlaying={currentlyPlaying}
          />
        )}
        {activeTab === "diet" && (
          <DietPlan
            plan={plan.diet_plan}
            onMealClick={onActionItemClick}
            onPlayAudio={onPlayAudio}
            isSpeaking={isSpeaking}
            currentlyPlaying={currentlyPlaying}
          />
        )}
        {activeTab === "tips" && <AiTips tips={plan.ai_tips} />}
      </div>
    </div>
  );
};

export default PlanDisplay;
