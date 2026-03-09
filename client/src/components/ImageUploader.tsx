import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploaderProps {
  onImageChange: (base64: string | undefined) => void;
}

export function ImageUploader({ onImageChange }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageChange(undefined);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            {...getRootProps()}
            className={`
              relative p-8 rounded-2xl border-2 border-dashed
              transition-all duration-300 ease-in-out cursor-pointer
              flex flex-col items-center justify-center gap-4 text-center
              ${isDragActive 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50 hover:bg-white/5"}
            `}
          >
            <input {...getInputProps()} />
            <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isDragActive ? "Drop image here" : "Click or drag image to upload"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports JPG, PNG, WEBP up to 5MB
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden border border-border group"
          >
            <img 
              src={preview} 
              alt="Upload preview" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={clearImage}
                className="bg-destructive/90 text-destructive-foreground p-3 rounded-full hover:bg-destructive hover:scale-105 transition-all shadow-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
