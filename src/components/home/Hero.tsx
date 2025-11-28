"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

export default function Hero() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950/70 px-6 py-16 sm:px-12 sm:py-20 text-center text-slate-100 shadow-[0_0_40px_-20px_rgba(59,130,246,0.35)]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.4),_transparent_65%)] opacity-80" />
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-4rem] h-80 w-80 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute -bottom-20 left-[-6rem] h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.6em] text-indigo-300/80">
        Next-Generation Commerce
      </p>
      <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-100">
        Welcome to
        <span className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          SQL-Shop
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
        Discover curated drops, AI-powered recommendations, and seamless checkout experiences designed to make premium commerce feel effortless.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400"
        >
          Start Shopping
        </Link>
        <Link
          href="/shop#categories"
          className="inline-flex items-center justify-center rounded-full border border-slate-500/60 px-8 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-200 hover:text-white"
        >
          View Categories
        </Link>
      </div>
    </motion.section>
  );
}
