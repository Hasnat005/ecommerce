"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const price = typeof product.price === "string"
      ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
      : product.price;

    addItem({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
    });
  };

  const formattedPrice = useMemo(() => {
    const numeric = typeof product.price === "string"
      ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
      : product.price;
    if (Number.isNaN(numeric)) {
      return product.price;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(numeric);
  }, [product.price]);

  return (
    <motion.div
      className="group relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/70 shadow-[0_15px_40px_-30px_rgba(15,23,42,0.9)] transition-colors"
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden bg-slate-900/80">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Placeholder for real image */}
          <div className="w-full h-full flex items-center justify-center text-slate-500 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_rgba(15,23,42,0.9))]">
            Product Image
          </div>
        </motion.div>

        {/* Add to Cart Button */}
        <motion.button
          className="absolute bottom-3 right-3 w-10 h-10 bg-slate-900/60 border border-slate-700 rounded-full shadow-lg flex items-center justify-center text-white/90 z-10 backdrop-blur"
          whileHover={{ scale: 1.1, backgroundColor: "#6366f1", color: "#fff" }}
          whileTap={{ scale: 0.9, rotate: 90 }}
          onClick={handleAddToCart}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{product.category}</p>
        <h3 className="font-semibold text-slate-100 mb-2">{product.name}</h3>
        <p className="text-purple-400 font-bold">{formattedPrice}</p>
      </div>
    </motion.div>
  );
}
