import React from "react";
import { type AdResponse, api } from "@shared/routes";
import { AudioPlayer } from "./AudioPlayer";
import { FileText, Clock, Mic, Music, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface AdCardProps {
  ad: AdResponse;
}

export function AdCard({ ad, compact = false }: AdCardProps & { compact?: boolean }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteAd = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/ads/${ad.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete ad");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ads.list.path] });
      toast({ title: "Ad deleted", description: "The ad has been removed from your library." });
    },
  });

  if (compact) {
    return (
      <div className="glass-card rounded-xl overflow-hidden flex flex-col group relative border border-white/5 bg-secondary/10">
        <button 
          onClick={(e) => { e.stopPropagation(); deleteAd.mutate(); }}
          disabled={deleteAd.isPending}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100 z-10"
          title="Delete Ad"
        >
          <Trash2 className="w-3 h-3" />
        </button>
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {ad.createdAt ? format(new Date(ad.createdAt), "MMM d") : 'Recently'}
            </div>
            <span className="px-1.5 py-0.5 bg-background rounded-full text-[10px] font-semibold text-primary border border-border">
              {ad.duration}s
            </span>
          </div>
          <div className="mb-2">
            <AudioPlayer url={ad.finalAudioUrl!} title={`Ad ${ad.id}`} compact />
          </div>
          <p className="text-[10px] text-muted-foreground line-clamp-2 italic">
            "{ad.inputText || ad.generatedScript?.substring(0, 50)}..."
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group relative">
      <button 
        onClick={() => deleteAd.mutate()}
        disabled={deleteAd.isPending}
        className="absolute top-4 right-4 p-2 rounded-lg bg-background/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100 z-10"
        title="Delete Ad"
      >
        <Trash2 className="w-4 h-4" />
      </button>
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
