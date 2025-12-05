import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sun,
  Moon,
  Dumbbell,
  User,
  Cake,
  Target,
  Zap,
  MapPin,
  Soup,
  Info,
  Weight,
  Ruler,
  HeartPulse,
  CheckSquare,
  Brain,
  Loader,
  AlertTriangle,
} from "lucide-react";

import useStickyState from "./hooks/useStickyState";
import FormInput from "./components/InputForm";
import FormSelect from "./components/SelectForm";
import PlanDisplay from "./components/PlanDisplay";
import ImageModal from "./components/ImageModal";
import { JSON_SCHEMA, callGeminiApi, callGeminiTtsApi, callImagenApi } from "./utils/geminiApi";

export default function App() {
  const [darkMode, setDarkMode] = useStickyState(true, "ai-fitness-dark-mode");
  const [formData, setFormData] = useStickyState(
    {
      name: "Jane Doe",
      age: "30",
      gender: "Female",
      height: "165",
      weight: "70",
      fitnessGoal: "Weight Loss",
      fitnessLevel: "Beginner",
      workoutLocation: "Home (Basic Equipment)",
      dietaryPreference: "Vegetarian",
      medicalHistory: "None",
    },
    "ai-fitness-form-data"
  );
  const [generatedPlan, setGeneratedPlan] = useStickyState(
    null,
    "ai-fitness-generated-plan"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // TTS
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRef = useRef(null);

  // Image Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", imageUrl: null });

  // Effects
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Form
  const handleFormChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setFormData]
  );

  // Audio controls
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    setIsSpeaking(false);
    setCurrentlyPlaying(null);
  }, []);

  const handlePlayAudio = useCallback(
    async (itemId, textToSpeak) => {
      if (isSpeaking && currentlyPlaying === itemId) {
        stopAudio();
        return;
      }
      if (isSpeaking) stopAudio();

      setIsSpeaking(true);
      setCurrentlyPlaying(itemId);

      try {
        const audioUrl = await callGeminiTtsApi(textToSpeak);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => {
          setIsSpeaking(false);
          setCurrentlyPlaying(null);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
        };
      } catch (error) {
        console.error("TTS Error:", error);
        setErrorMessage("Couldn't play audio. Please try again.");
        setIsSpeaking(false);
        setCurrentlyPlaying(null);
      }
    },
    [isSpeaking, currentlyPlaying, stopAudio]
  );

  // Submit
  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    stopAudio();
    setIsLoading(true);
    setGeneratedPlan(null);
    setErrorMessage(null);

    const systemPrompt = `You are a world-class AI fitness and nutrition coach. Generate a comprehensive 7-day fitness and diet plan in strict JSON format matching the schema. Base it on: ${JSON.stringify(
      formData
    )}. Include safety considerations for any medical history. Provide specific exercises and meals.`;

    const payload = {
      contents: [
        {
          parts: [{ text: `Generate a 7-day workout and diet plan. User: ${JSON.stringify(formData)}` }],
        },
      ],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: JSON_SCHEMA,
      },
    };

    try {
      const plan = await callGeminiApi(payload);
      setGeneratedPlan(plan);
    } catch (error) {
      setErrorMessage(
        "Failed to generate plan. The AI might be busy or an error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Image click
  const handleActionItemClick = useCallback(async (name, prompt) => {
    setIsModalOpen(true);
    setIsImageLoading(true);
    setModalContent({ title: name, imageUrl: null });

    try {
      const imageUrl = await callImagenApi(prompt);
      setModalContent({ title: name, imageUrl });
    } catch (error) {
      console.error("Error generating image:", error);
      setModalContent({ title: name, imageUrl: null });
    } finally {
      setIsImageLoading(false);
    }
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const handleClearPlan = () => {
    stopAudio();
    setGeneratedPlan(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                AI Fitness Coach
              </h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* LEFT: FORM */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 bg-white dark:bg-slate-950/70 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Your Details
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  id="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  icon={User}
                  placeholder="e.g., Jane Doe"
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    id="age"
                    label="Age"
                    type="number"
                    value={formData.age}
                    onChange={handleFormChange}
                    icon={Cake}
                    placeholder="30"
                  />
                  <FormSelect
                    id="gender"
                    label="Gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    icon={User}
                    options={["Male", "Female", "Other"]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    id="height"
                    label="Height (cm)"
                    type="number"
                    value={formData.height}
                    onChange={handleFormChange}
                    icon={Ruler}
                    placeholder="165"
                  />
                  <FormInput
                    id="weight"
                    label="Weight (kg)"
                    type="number"
                    value={formData.weight}
                    onChange={handleFormChange}
                    icon={Weight}
                    placeholder="70"
                  />
                </div>

                <FormSelect
                  id="fitnessGoal"
                  label="Fitness Goal"
                  value={formData.fitnessGoal}
                  onChange={handleFormChange}
                  icon={Target}
                  options={["Weight Loss", "Muscle Gain", "General Fitness", "Improve Endurance"]}
                />

                <FormSelect
                  id="fitnessLevel"
                  label="Current Fitness Level"
                  value={formData.fitnessLevel}
                  onChange={handleFormChange}
                  icon={Zap}
                  options={["Beginner", "Intermediate", "Advanced"]}
                />

                <FormSelect
                  id="workoutLocation"
                  label="Workout Location"
                  value={formData.workoutLocation}
                  onChange={handleFormChange}
                  icon={MapPin}
                  options={[
                    "Home (No Equipment)",
                    "Home (Basic Equipment)",
                    "Gym",
                    "Outdoor",
                  ]}
                />

                <FormSelect
                  id="dietaryPreference"
                  label="Dietary Preference"
                  value={formData.dietaryPreference}
                  onChange={handleFormChange}
                  icon={Soup}
                  options={["Non-Vegetarian", "Vegetarian", "Vegan", "Keto", "Paleo"]}
                />

                <FormInput
                  id="medicalHistory"
                  label="Medical History (Optional)"
                  value={formData.medicalHistory}
                  onChange={handleFormChange}
                  icon={Info}
                  placeholder="e.g., Knee injury, allergies"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Generate My Plan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: PLAN */}
          <div className="lg:col-span-2 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-slate-950/70 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 min-h-[600px]">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <div className="relative">
                    <Loader className="w-16 h-16 text-indigo-500 animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-pulse"></div>
                  </div>
                  <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
                    Generating Your Personal Plan
                  </h2>
                  <p className="mt-3 text-base text-slate-600 dark:text-slate-400 text-center max-w-md">
                    The AI is analyzing your profile and creating a customized workout and diet
                    plan...
                  </p>
                </div>
              )}

              {errorMessage && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
                    <AlertTriangle className="w-16 h-16 text-red-500" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
                    Something Went Wrong
                  </h2>
                  <p className="mt-3 text-base text-slate-600 dark:text-slate-400 text-center max-w-md">
                    {errorMessage}
                  </p>
                  <button
                    onClick={handleSubmit}
                    className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!isLoading && !errorMessage && !generatedPlan && (
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                    <HeartPulse className="w-16 h-16 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
                    Your Personal Plan Awaits
                  </h2>
                  <p className="mt-3 text-base text-slate-600 dark:text-slate-400 text-center max-w-md">
                    Fill out your details on the left, and your AI-powered workout and diet plan
                    will appear here instantly!
                  </p>
                  <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-green-500" />
                      <span>Personalized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-green-500" />
                      <span>Science-Based</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-green-500" />
                      <span>7-Day Plan</span>
                    </div>
                  </div>
                </div>
              )}

              {generatedPlan && !isLoading && !errorMessage && (
                <PlanDisplay
                  plan={generatedPlan}
                  onRegenerate={handleSubmit}
                  onClearPlan={handleClearPlan}
                  onActionItemClick={handleActionItemClick}
                  onPlayAudio={handlePlayAudio}
                  isSpeaking={isSpeaking}
                  currentlyPlaying={currentlyPlaying}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title}
        imageUrl={modalContent.imageUrl}
        isLoading={isImageLoading}
      />
    </div>
  );
}
