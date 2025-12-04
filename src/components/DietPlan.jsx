import React from "react";
import { Soup, Coffee, Salad, Apple, Fish, Beef, Wand2, Play, StopCircle } from "lucide-react";

const getMealIcon = (mealType) => {
  const icons = {
    breakfast: { Icon: Coffee, color: "text-amber-500" },
    lunch: { Icon: Salad, color: "text-green-500" },
    dinner: { Icon: Fish, color: "text-blue-500" },
    snacks: { Icon: Apple, color: "text-red-500" },
  };
  return icons[mealType] || { Icon: Beef, color: "text-slate-500" };
};

const DietPlan = ({ plan, onMealClick, onPlayAudio, isSpeaking, currentlyPlaying }) => (
  <div className="space-y-4">
    {plan.meal_plan.map((mealDay) => (
      <div
        key={mealDay.day}
        className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-500 rounded-lg">
              <Soup className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-base text-slate-900 dark:text-white">
              {mealDay.day}
            </h4>
          </div>
          <button
            onClick={() =>
              onPlayAudio(
                mealDay.day,
                `Diet for ${mealDay.day}: ${Object.entries(mealDay.meals)
                  .map(([type, meal]) => `${type}: ${meal.name}.`)
                  .join(" ")}`
              )
            }
            className="p-2 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
            aria-label={`Read ${mealDay.day} diet`}
          >
            {isSpeaking && currentlyPlaying === mealDay.day ? (
              <StopCircle className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="space-y-2">
          {Object.entries(mealDay.meals).map(([mealType, meal]) => {
            const { Icon, color } = getMealIcon(mealType);
            return (
              <div
                key={mealType}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all group"
                onClick={() =>
                  onMealClick(
                    meal.name,
                    "A delicious, high-resolution, food-photography style photo of " + meal.name
                  )
                }
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md group-hover:bg-opacity-80 transition-colors">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm text-slate-900 dark:text-slate-100 capitalize">
                      {mealType}
                    </h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                      {meal.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {meal.description} • {meal.calories} cal
                    </p>
                  </div>
                </div>
                <Wand2 className="w-4 h-4 text-green-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

export default DietPlan;
