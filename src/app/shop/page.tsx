"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductGrid from "@/components/product/ProductGrid";
import { Check } from "lucide-react";

// Mock Data
const PRODUCTS = [
  { id: "1", name: "Minimalist Watch", price: "$120.00", category: "Accessories", image: "/placeholder" },
  { id: "2", name: "Leather Backpack", price: "$180.00", category: "Bags", image: "/placeholder" },
  { id: "3", name: "Wireless Headphones", price: "$250.00", category: "Electronics", image: "/placeholder" },
  { id: "4", name: "Cotton T-Shirt", price: "$35.00", category: "Apparel", image: "/placeholder" },
  { id: "5", name: "Smart Speaker", price: "$99.00", category: "Electronics", image: "/placeholder" },
  { id: "6", name: "Running Shoes", price: "$140.00", category: "Footwear", image: "/placeholder" },
];

const CATEGORIES = ["All", "Electronics", "Apparel", "Accessories", "Footwear"];

const Checkbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
  <div className="flex items-center space-x-3 cursor-pointer group" onClick={onChange}>
    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? "bg-black border-black" : "border-gray-300 group-hover:border-gray-400"}`}>
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </motion.div>
      )}
    </div>
    <span className={`text-sm ${checked ? "text-gray-900 font-medium" : "text-gray-600"}`}>{label}</span>
  </div>
);

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);

  const toggleCategory = (category: string) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      const newCategories = selectedCategories.filter((c) => c !== "All");
      if (selectedCategories.includes(category)) {
        const filtered = newCategories.filter((c) => c !== category);
        setSelectedCategories(filtered.length ? filtered : ["All"]);
      } else {
        setSelectedCategories([...newCategories, category]);
      }
    }
  };

  const filteredProducts = selectedCategories.includes("All")
    ? PRODUCTS
    : PRODUCTS.filter((p) => selectedCategories.includes(p.category));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <div className="space-y-3">
                {CATEGORIES.map((category) => (
                  <Checkbox
                    key={category}
                    label={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Price Range</h3>
              {/* Simple slider placeholder */}
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black w-1/2"></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$0</span>
                <span>$500</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Shop All</h1>
            <p className="text-gray-500 mt-2">Showing {filteredProducts.length} results</p>
          </div>
          
          <ProductGrid products={filteredProducts} />
        </main>
      </div>
    </div>
  );
}
