import React from "react";
import { type AdResponse } from "@shared/routes";
import { AudioPlayer } from "./AudioPlayer";
import { FileText, Clock, Mic, Music, Calendar } from "lucide-react";
import { format } from "date-fns";

interface AdCardProps {
  ad: AdResponse;
}

export function AdCard({ ad }: AdCardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group">
      <div className="p-6 border-b border-border/50 bg-secondary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {ad.createdAt ? format(new Date(ad.createdAt), "MMM d, yyyy h:mm a") : 'Recently'}
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 bg-background rounded-full text-xs font-semibold text-primary border border-border">
              {ad.duration}s
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Mic className="w-4 h-4 text-primary" />
            <span className="truncate">{ad.voiceStyle}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Music className="w-4 h-4 text-accent" />
            <span className="truncate">{ad.musicStyle}</span>
          </div>
        </div>
        
        {ad.finalAudioUrl && (
          <div className="mt-4">
            <AudioPlayer url={ad.finalAudioUrl} title={`Generated Ad - ${ad.duration}s`} />
          </div>
        )}
      </div>

      <div className="p-6 flex-1 bg-background/50">
        <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 text-foreground">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Generated Script
        </h4>
        <div className="text-sm text-muted-foreground leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
          {ad.generatedScript ? (
            <p className="whitespace-pre-wrap">{ad.generatedScript}</p>
          ) : (
            <p className="italic opacity-50">Script generation in progress or failed.</p>
          )}
        </div>

        {ad.inputText && (
          <div className="mt-4">
             <h4 className="text-xs font-semibold text-muted-foreground mb-2">Original Input</h4>
             <p className="text-xs text-muted-foreground/70 line-clamp-2 italic border-l-2 border-primary/30 pl-3">
               "{ad.inputText}"
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
