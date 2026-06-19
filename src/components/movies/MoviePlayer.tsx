"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface MoviePlayerProps {
  videoUrl: string;
  movieId: string;
  userId?: string;
}

export function MoviePlayer({ videoUrl, movieId, userId }: MoviePlayerProps) {
  const [progress, setProgress] = useState(0);

  const handleProgress = useCallback(
    async ({ played }: { played: number }) => {
      const pct = Math.round(played * 100);
      if (Math.abs(pct - progress) < 5) return;
      setProgress(pct);
      if (userId) {
        await fetch("/api/watch-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieId, progress: pct }),
        });
      }
    },
    [movieId, progress, userId]
  );

  return (
    <div className="relative rounded-card overflow-hidden bg-black aspect-video">
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        controls
        onProgress={handleProgress}
        config={{
          youtube: {
            playerVars: { showinfo: 1, modestbranding: 1 },
          },
        }}
      />
    </div>
  );
}
