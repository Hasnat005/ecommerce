"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import type { CartItem } from "@/types";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollStateRef = useRef<boolean>(false);

  const calculateItemCount = (items: CartItem[]) =>
    items.reduce((total, item) => total + item.quantity, 0);
  const [itemCount, setItemCount] = useState<number>(0);
  const itemCountRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 50;
      if (scrollStateRef.current !== shouldBeScrolled) {
        scrollStateRef.current = shouldBeScrolled;
        setIsScrolled(shouldBeScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncItemCount = () => {
      const nextCount = calculateItemCount(useCartStore.getState().items);
      if (itemCountRef.current !== nextCount) {
        itemCountRef.current = nextCount;
        setItemCount(nextCount);
      }
    };

    syncItemCount();

    const unsubscribe = useCartStore.subscribe((state) => {
      const nextCount = calculateItemCount(state.items);
      if (itemCountRef.current !== nextCount) {
        itemCountRef.current = nextCount;
        setItemCount(nextCount);
      }
    });

    return unsubscribe;
  }, []);

  const handleToggleCart = useCallback(() => {
    useCartStore.getState().toggleCart();
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
  ];

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-md py-3 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.75)] border-slate-800/70"
          : "bg-transparent py-5"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <motion.div
            className="text-2xl font-bold text-white cursor-pointer"
            whileHover={{
              scale: 1.05,
              textShadow: "0px 0px 8px rgba(0,0,0,0.1)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            SQL-Shop
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="relative group">
              <span className="text-slate-200 font-medium transition-colors group-hover:text-white">
                {link.name}
              </span>
              <motion.span
                className="absolute left-0 bottom-0 block h-0.5 w-full bg-slate-100 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Ask AI Button */}
          <motion.button
            className="relative overflow-hidden rounded-full px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
            />
            <Sparkles className="w-4 h-4" />
            <span>Ask AI</span>
          </motion.button>

          {/* Cart Icon */}
          <motion.button
            className="p-2 rounded-full text-slate-200 hover:bg-white/10 relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleCart}
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>

          {/* Profile Icon */}
          <motion.button
            className="p-2 rounded-full text-slate-200 hover:bg-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <User className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;