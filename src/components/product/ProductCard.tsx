"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
           {/* Placeholder for real image */}
           <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
             Product Image
           </div>
        </motion.div>

        {/* Add to Cart Button */}
        <motion.button
          className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-900 z-10"
          whileHover={{ scale: 1.1, backgroundColor: "#000", color: "#fff" }}
          whileTap={{ scale: 0.9, rotate: 90 }}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-indigo-600 font-bold">{product.price}</p>
      </div>
    </motion.div>
  );
}
