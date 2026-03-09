import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCreateAd } from "@/hooks/use-ads";
import { ImageUploader } from "@/components/ImageUploader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Sparkles, Image as ImageIcon } from "lucide-react";
import { type CreateAdRequest } from "@shared/routes";

const DURATION_OPTIONS = [15, 30, 60];
const VOICE_STYLES = ["Male", "Female", "Energetic promotional voice", "Calm narrator voice"];
const MUSIC_STYLES = ["Upbeat retail promotion", "Calm background", "Energetic commercial", "Corporate marketing"];

export default function GenerateImagePage() {
  const createAd = useCreateAd();
  const [base64Image, setBase64Image] = useState<string | undefined>();
  const [duration, setDuration] = useState("30");
  const [voiceStyle, setVoiceStyle] = useState(VOICE_STYLES[0]);
  const [musicStyle, setMusicStyle] = useState(MUSIC_STYLES[0]);
  const [loadingText, setLoadingText] = useState("Analyzing image...");

  useEffect(() => {
    if (!createAd.isPending) return;
    
    const steps = [
      "Analyzing image...",
      "Extracting text...",
      "Drafting script...",
      "Synthesizing voice...",
      "Composing music...",
      "Mastering audio...",
    ];
    let step = 0;
    const interval = setInterval(() => {
      step = Math.min(step + 1, steps.length - 1);
      setLoadingText(steps[step]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [createAd.isPending]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!base64Image) return;

    const payload: CreateAdRequest = {
      image: base64Image,
      voiceStyle,
      musicStyle,
      duration: parseInt(duration),
    };

    createAd.mutate(payload, {
      onSuccess: () => {
        setBase64Image(undefined);
      }
    });
  };

  const handleDownload = () => {
    if (!createAd.data?.finalAudioUrl) return;
    const link = document.createElement("a");
    link.href = createAd.data.finalAudioUrl;
    link.download = `promo-voice-${createAd.data.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col flex-1 overflow-auto lg:mt-0 mt-16">
      {/* Mobile-first stacked layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        
        {/* Input Section */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Generate Image Ad</h1>
            <p className="text-muted-foreground">Upload a promotional poster or image</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Upload Poster
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <ImageUploader onImageSelected={setBase64Image} data-testid="image-uploader" />

                {base64Image && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-primary"
                  >
                    <img
                      src={base64Image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      data-testid="image-preview"
                    />
                  </motion.div>
                )}

                {/* Options Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Duration</label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger data-testid="select-duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map((d) => (
                          <SelectItem key={d} value={d.toString()}>
                            {d}s
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">Voice</label>
                    <Select value={voiceStyle} onValueChange={setVoiceStyle}>
                      <SelectTrigger data-testid="select-voice">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VOICE_STYLES.map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium block mb-2">Music Style</label>
                    <Select value={musicStyle} onValueChange={setMusicStyle}>
                      <SelectTrigger data-testid="select-music">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MUSIC_STYLES.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={createAd.isPending || !base64Image}
                  data-testid="button-generate"
                >
                  {createAd.isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mr-2"
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      {loadingText}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Ad
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Your Ad</h2>
            <p className="text-muted-foreground">Listen and download</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {createAd.data ? (
              <div className="space-y-6">
                {/* Extracted Text Info */}
                {createAd.data.inputText && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Extracted Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/90">{createAd.data.inputText}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Generated Script */}
                {createAd.data.generatedScript && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Generated Script</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {createAd.data.generatedScript}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Audio Player */}
                {createAd.data.finalAudioUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Audio Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AudioPlayer src={createAd.data.finalAudioUrl} data-testid="audio-player" />
                    </CardContent>
                  </Card>
                )}

                {/* Download Button */}
                {createAd.data.finalAudioUrl && (
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    variant="outline"
                    className="w-full"
                    data-testid="button-download"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download MP3
                  </Button>
                )}

                {/* Ad Metadata */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{createAd.data.duration}s</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Voice</p>
                        <p className="font-medium">{createAd.data.voiceStyle}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Music</p>
                        <p className="font-medium">{createAd.data.musicStyle}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">
                          {createAd.data.createdAt && new Date(createAd.data.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center border-dashed">
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    {createAd.isPending ? "Generating your ad..." : "Your content will appear here"}
                  </p>
                </div>
              </Card>
            )}

            {createAd.error && (
              <Card className="border-destructive bg-destructive/5">
                <CardContent className="pt-6">
                  <p className="text-destructive text-sm">
                    Error: {createAd.error instanceof Error ? createAd.error.message : "Something went wrong"}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
