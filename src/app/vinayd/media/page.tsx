"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Image, Upload, FolderOpen } from "lucide-react";

export default function AdminMediaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => { if (status === "unauthenticated") router.push("/vinayd/login"); }, [status, router]);
  if (status === "loading" || !session) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and manage images, icons, and media files.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gold-400 text-black hover:bg-gold-500 transition">
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>
      <div className="rounded-xl border border-white/10 border-dashed p-16 text-center" style={{ background: "rgba(15,15,30,0.4)" }}>
        <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-sm mb-1">Drag & drop files here or click Upload</p>
        <p className="text-gray-600 text-xs">Supports JPG, PNG, WebP, SVG (max 5MB)</p>
        <p className="text-xs text-gold-400/60 mt-4">Media library will be enabled once PostgreSQL database is connected.</p>
      </div>
    </div>
  );
}
