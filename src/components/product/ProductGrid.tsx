"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { staggerContainer, fadeIn } from "@/lib/animations";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={fadeIn}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
