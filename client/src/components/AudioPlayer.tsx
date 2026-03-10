import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Download, Volume2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  url: string;
  title?: string;
  compact?: boolean;
}

export function AudioPlayer({ url, title = "Generated Ad Audio", compact = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = (Number(e.target.value) / 100) * duration;
      audioRef.current.currentTime = time;
      setProgress(Number(e.target.value));
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `promovoice-ad-${new Date().getTime()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (compact) {
    return (
      <div className="bg-secondary/30 rounded-xl p-3 border border-border/30 backdrop-blur-sm">
        <audio ref={audioRef} src={url} className="hidden" />
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-lg hover:scale-105 transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-px" />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.1 }}
              />
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="text-muted-foreground hover:text-primary transition-colors p-1.5 hover:bg-primary/10 rounded-lg"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary/50 rounded-2xl p-6 border border-border/50 shadow-inner">
      <audio ref={audioRef} src={url} className="hidden" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground">Ready to broadcast</p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
          title="Download MP3"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-2 bg-black/40 rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
        />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium tabular-nums">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { if(audioRef.current) audioRef.current.currentTime = 0; }}
              className="hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
            </button>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
