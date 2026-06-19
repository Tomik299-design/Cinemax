"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface MoviePlayerProps {
  videoUrl?: string | null;
  title: string;
  posterUrl?: string | null;
}

export function MoviePlayer({ videoUrl, title, posterUrl }: MoviePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-surface rounded-card flex flex-col items-center justify-center gap-3 text-muted">
        <AlertCircle size={32} />
        <p className="text-sm font-medium">Film není k dispozici</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full aspect-video bg-surface rounded-card flex flex-col items-center justify-center gap-3 text-muted">
        <AlertCircle size={32} />
        <p className="text-sm font-medium">Video se nepodařilo přehrát</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-card overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <Loader2 size={32} className="animate-spin text-accent" />
        </div>
      )}
      <video
        src={videoUrl}
        poster={posterUrl || undefined}
        title={title}
        controls
        controlsList="nodownload"
        className="w-full h-full"
        onLoadedData={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      >
        Váš prohlížeč nepodporuje přehrávání videa.
      </video>
    </div>
  );
}