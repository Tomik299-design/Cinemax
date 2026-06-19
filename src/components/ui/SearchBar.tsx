"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      if (e.target.value) {
        params.set("q", e.target.value);
      } else {
        params.delete("q");
      }
      router.push(`/search?${params}`);
    });
  };

  return (
    <div className="relative flex-1 max-w-sm">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search movies..."
        className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
