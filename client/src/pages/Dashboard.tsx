import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAds, useCreateAd } from "@/hooks/use-ads";
import { ImageUploader } from "@/components/ImageUploader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AdCard } from "@/components/AdCard";
import { 
  Sparkles, 
  Type, 
  Image as ImageIcon, 
  Clock, 
  Mic, 
  Music, 
  Activity,
  History,
  FileText
} from "lucide-react";
import { type CreateAdRequest } from "@shared/routes";

const DURATION_OPTIONS = [15, 30, 60];
const VOICE_STYLES = [
  "Male", 
  "Female", 
  "Energetic promotional voice", 
  "Calm narrator voice"
];
const MUSIC_STYLES = [
  "Upbeat retail promotion", 
  "Calm background", 
  "Energetic commercial", 
  "Corporate marketing"
];

export default function Dashboard() {
  const { data: adsHistory, isLoading: isLoadingHistory } = useAds();
  const createAd = useCreateAd();

  const [inputType, setInputType] = useState<"text" | "image">("text");
  const [inputText, setInputText] = useState("");
  const [base64Image, setBase64Image] = useState<string | undefined>();
  const [duration, setDuration] = useState(30);
  const [voiceStyle, setVoiceStyle] = useState(VOICE_STYLES[0]);
  const [musicStyle, setMusicStyle] = useState(MUSIC_STYLES[0]);

  // Fun loading state texts
  const [loadingText, setLoadingText] = useState("Analyzing input...");
  useEffect(() => {
    if (!createAd.isPending) return;
    
    const steps = [
      "Analyzing input...",
      "Drafting copywriter script...",
      "Synthesizing voice actor...",
      "Composing background track...",
      "Mastering final audio...",
    ];
    let step = 0;
    const interval = setInterval(() => {
      step = Math.min(step + 1, steps.length - 1);
      setLoadingText(steps[step]);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [createAd.isPending]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputType === "text" && !inputText.trim()) return;
    if (inputType === "image" && !base64Image) return;

    const payload: CreateAdRequest = {
      voiceStyle,
      musicStyle,
      duration,
    };

    if (inputType === "text") {
      payload.inputText = inputText;
    } else {
      payload.image = base64Image;
    }

    createAd.mutate(payload, {
      onSuccess: () => {
        setInputText("");
        setBase64Image(undefined);
        // Assuming we stay on dashboard, the history list will update automatically via query invalidation
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-accent p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground leading-none">
                PromoVoice AI
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-1">Professional Audio Ads in Seconds</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <span className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground border border-border">
              v2.0 Model Engine
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Generator Form */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-gradient mb-2">Create New Ad</h2>
              <p className="text-muted-foreground">Turn your text or poster into a high-converting audio commercial.</p>
            </div>

            <form onSubmit={handleGenerate} className="glass-card rounded-3xl p-6 sm:p-8 space-y-8">
              
              {/* Input Type Toggle */}
              <div className="bg-black/30 p-1.5 rounded-xl flex gap-1 border border-white/5">
                <button
                  type="button"
                  onClick={() => setInputType("text")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                    inputType === "text" 
                      ? "bg-secondary text-foreground shadow-sm border border-white/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Type className="w-4 h-4" /> Text Prompt
                </button>
                <button
                  type="button"
                  onClick={() => setInputType("image")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                    inputType === "image" 
                      ? "bg-secondary text-foreground shadow-sm border border-white/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> Poster Upload
                </button>
              </div>

              {/* Input Area */}
              <div className="min-h-[220px]">
                <AnimatePresence mode="wait">
                  {inputType === "text" ? (
                    <motion.div
                      key="text-input"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-3"
                    >
                      <label className="text-sm font-medium text-foreground ml-1">Promotional Text / Product Details</label>
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="e.g. Big Summer Sale! 50% off all shoes at Joe's Footwear..."
                        className="w-full h-48 bg-black/40 border-2 border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none transition-all"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="image-input"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      <label className="text-sm font-medium text-foreground ml-1">Upload Event/Product Poster</label>
                      <ImageUploader onImageChange={setBase64Image} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-px bg-border w-full" />

              {/* Settings */}
              <div className="space-y-6">
                {/* Duration */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground ml-1">
                    <Clock className="w-4 h-4 text-primary" /> Target Duration
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {DURATION_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDuration(opt)}
                        className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                          duration === opt
                            ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]"
                            : "border-border bg-black/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        }`}
                      >
                        {opt}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice Style */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground ml-1">
                    <Mic className="w-4 h-4 text-accent" /> Voice Style
                  </label>
                  <div className="relative">
                    <select
                      value={voiceStyle}
                      onChange={(e) => setVoiceStyle(e.target.value)}
                      className="w-full appearance-none bg-black/40 border-2 border-border rounded-xl py-3.5 pl-4 pr-10 text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                    >
                      {VOICE_STYLES.map((style) => (
                        <option key={style} value={style} className="bg-card text-foreground">{style}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Music Style */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground ml-1">
                    <Music className="w-4 h-4 text-pink-500" /> Background Music
                  </label>
                  <div className="relative">
                    <select
                      value={musicStyle}
                      onChange={(e) => setMusicStyle(e.target.value)}
                      className="w-full appearance-none bg-black/40 border-2 border-border rounded-xl py-3.5 pl-4 pr-10 text-foreground font-medium focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer"
                    >
                      {MUSIC_STYLES.map((style) => (
                        <option key={style} value={style} className="bg-card text-foreground">{style}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={createAd.isPending || (inputType === "text" ? !inputText.trim() : !base64Image)}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent p-[1px] disabled:opacity-50 disabled:cursor-not-allowed hover-glow"
              >
                <div className="relative bg-background/50 backdrop-blur-sm px-6 py-4 rounded-[11px] transition-all group-hover:bg-transparent">
                  <div className="flex items-center justify-center gap-3">
                    {createAd.isPending ? (
                      <>
                        <Activity className="w-5 h-5 text-white animate-pulse" />
                        <span className="font-bold text-white tracking-wide">{loadingText}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-white" />
                        <span className="font-bold text-white tracking-wide text-lg">Generate Ad Magic</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            </form>
          </div>

          {/* Right Column: Results & History */}
          <div className="lg:col-span-7 space-y-10 mt-10 lg:mt-0">
            
            {/* Newest Result Area (shows immediately after creation) */}
            <AnimatePresence>
              {createAd.data && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-md opacity-25" />
                  <div className="relative glass-card rounded-3xl p-1 bg-gradient-to-br from-white/10 to-transparent">
                    <div className="bg-background rounded-[22px] p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-display font-bold text-foreground">Generation Complete</h3>
                          <p className="text-sm text-muted-foreground">Your audio ad is ready to use</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {createAd.data.finalAudioUrl && (
                          <AudioPlayer url={createAd.data.finalAudioUrl} title="New Generated Ad" />
                        )}
                        
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" /> Script Output
                          </h4>
                          <div className="bg-black/30 p-5 rounded-xl border border-white/5 text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
                            {createAd.data.generatedScript}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
                  <History className="w-6 h-6 text-primary" /> 
                  Ad Library
                </h3>
              </div>

              {isLoadingHistory ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card h-64 rounded-2xl animate-pulse bg-white/5" />
                  ))}
                </div>
              ) : adsHistory && adsHistory.length > 0 ? (
                <div className="space-y-6">
                  {adsHistory.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center border-dashed">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <Music className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">No ads generated yet</h4>
                  <p className="text-muted-foreground max-w-sm">
                    Fill out the form on the left to create your first AI-powered audio commercial.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
