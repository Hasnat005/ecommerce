"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ShoppingCart, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { toggleCart, items } = useCartStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
  ];

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
        isScrolled
          ? "bg-white/80 backdrop-blur-md py-3 shadow-sm border-gray-200"
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
            className="text-2xl font-bold text-gray-900 cursor-pointer"
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
              <span className="text-gray-700 font-medium hover:text-black transition-colors">
                {link.name}
              </span>
              <motion.span
                className="absolute left-0 bottom-0 block h-0.5 w-full bg-black origin-left"
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
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700 relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCart}
          >
            <ShoppingCart className="w-5 h-5" />
            {items.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {items.length}
              </motion.span>
            )}
          </motion.button>

          {/* Profile Icon */}
          <motion.button
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
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
