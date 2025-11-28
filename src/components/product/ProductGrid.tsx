"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { Product } from "@/types";

export default function ProductGrid({
  products,
  animationKey,
}: {
  products: Product[];
  animationKey: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-3xl border border-dashed border-slate-800/70 bg-slate-950/60 text-slate-400">
        No products found.
      </div>
    );
  }

  return (
    <motion.div
      key={animationKey}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={fadeIn}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
