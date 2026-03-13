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
  FileText,
  Menu,
  X
} from "lucide-react";
import { type CreateAdRequest } from "@shared/routes";

const DURATION_OPTIONS = [15, 30, 60];
const VOICE_STYLES = [
  "Energetic promotional voice",
  "Calm",
];

export default function Dashboard() {
  const { data: adsHistory, isLoading: isLoadingHistory } = useAds();
  const createAd = useCreateAd();

  const [inputType, setInputType] = useState<"text" | "image">("text");
  const [inputText, setInputText] = useState("");
  const [base64Image, setBase64Image] = useState<string | undefined>();
  const [duration, setDuration] = useState(30);
  const [voiceStyle, setVoiceStyle] = useState(VOICE_STYLES[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const textInputRef = React.useRef<HTMLDivElement>(null);
  const imageUploadRef = React.useRef<HTMLDivElement>(null);

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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-card border-r border-border z-[70] transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block flex flex-col`}>
        <div className="p-6 h-full flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight">PromoVoice AI</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ad Library</span>
              </div>
              <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                {adsHistory?.length || 0}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {isLoadingHistory ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-xl animate-pulse bg-white/5" />
                ))
              ) : adsHistory && adsHistory.length > 0 ? (
                adsHistory.map((ad) => (
                  <AdCard key={ad.id} ad={ad} compact />
                ))
              ) : (
                <div className="text-center py-10 px-4 border border-dashed border-border/50 rounded-2xl bg-secondary/5">
                  <Music className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-[11px] text-muted-foreground">Your generated ads will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2.5 hover:bg-secondary rounded-xl transition-colors text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-semibold text-muted-foreground">
              {inputType === 'text' ? 'Text-to-Audio' : 'Poster-to-Audio'} Generator
            </h2>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12 w-full">
            <div className="space-y-12">
              <div className="space-y-2">
                <h2 className="text-4xl font-display font-bold text-gradient tracking-tight">Create New Ad</h2>
                <p className="text-muted-foreground text-lg">Turn your ideas into professional audio commercials in seconds.</p>
              </div>

              <form onSubmit={handleGenerate} className="glass-card rounded-[2rem] p-8 lg:p-10 space-y-10 border-white/5 shadow-2xl">
                <div className="bg-black/30 p-1.5 rounded-2xl flex gap-1 border border-white/5">
                  <button
                    type="button"
                    onClick={() => setInputType("text")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
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
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                      inputType === "image" 
                        ? "bg-secondary text-foreground shadow-sm border border-white/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" /> Poster Upload
                  </button>
                </div>

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
                        <label className="text-sm font-semibold text-foreground ml-1">Promotional Text / Product Details</label>
                        <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="e.g. Big Summer Sale! 50% off all shoes at Joe's Footwear..."
                          className="w-full h-48 bg-black/40 border-2 border-border rounded-2xl p-6 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none transition-all text-lg"
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
                        <label className="text-sm font-semibold text-foreground ml-1">Upload Event/Product Poster</label>
                        <ImageUploader onImageChange={setBase64Image} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-border/50 w-full" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground ml-1">
                      <Clock className="w-4 h-4 text-primary" /> Target Duration
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {DURATION_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setDuration(opt)}
                          className={`py-3 rounded-xl border-2 font-bold transition-all ${
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

                  <div className="space-y-4">
                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground ml-1">
                      <Mic className="w-4 h-4 text-accent" /> Voice Style
                    </label>
                    <div className="relative">
                      <select
                        value={voiceStyle}
                        onChange={(e) => setVoiceStyle(e.target.value)}
                        className="w-full appearance-none bg-black/40 border-2 border-border rounded-xl py-3 pl-4 pr-10 text-foreground font-semibold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                      >
                        {VOICE_STYLES.map((style) => (
                          <option key={style} value={style} className="bg-card text-foreground">{style}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
                        <X className="w-4 h-4 rotate-45" />
                      </div>
                    </div>
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={createAd.isPending || (inputType === "text" ? !inputText.trim() : !base64Image)}
                  className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent p-[1px] disabled:opacity-50 disabled:cursor-not-allowed hover-glow transition-transform active:scale-[0.98]"
                >
                  <div className="relative bg-background/50 backdrop-blur-sm px-6 py-5 rounded-[15px] transition-all group-hover:bg-transparent">
                    <div className="flex items-center justify-center gap-3">
                      {createAd.isPending ? (
                        <>
                          <Activity className="w-6 h-6 text-white animate-pulse" />
                          <span className="font-bold text-white tracking-wide text-lg">{loadingText}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 text-white" />
                          <span className="font-bold text-white tracking-wide text-xl">Generate Ad Magic</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              </form>

              <AnimatePresence>
                {createAd.data && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] blur-xl opacity-20" />
                    <div className="relative glass-card rounded-[2.5rem] p-1 bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
                      <div className="bg-background rounded-[2.4rem] p-8 lg:p-10">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-2xl font-display font-bold text-foreground tracking-tight">Generation Complete</h3>
                            <p className="text-muted-foreground">Your audio ad is ready to use</p>
                          </div>
                        </div>

                        <div className="space-y-8">
                          {createAd.data.finalAudioUrl && (
                            <AudioPlayer url={createAd.data.finalAudioUrl} title="New Generated Ad" />
                          )}
                          
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                              <FileText className="w-4 h-4 text-primary" /> Script Output
                            </h4>
                            <div className="bg-black/30 p-6 rounded-2xl border border-white/5 text-muted-foreground whitespace-pre-wrap leading-relaxed text-lg italic shadow-inner">
                              {createAd.data.generatedScript}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
