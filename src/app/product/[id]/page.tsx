"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag, Star, Share2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types";

// Mock Data
const PRODUCT: Product = {
  id: "1",
  name: "Premium Wireless Headphones",
  price: "$299.00",
  description:
    "Experience high-fidelity audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions for long listening sessions.",
  rating: 4.8,
  reviews: 124,
  images: [
    "/placeholder-1",
    "/placeholder-2",
    "/placeholder-3",
    "/placeholder-4",
  ],
  features: [
    "Active Noise Cancellation",
    "30-hour Battery Life",
    "Bluetooth 5.0",
    "USB-C Fast Charging",
  ],
  image: "/placeholder-1", // Add main image for compatibility
  category: "Electronics"
};

const TABS = ["Details", "Reviews", "AI Analysis"];

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = useMemo(() => ({ ...PRODUCT, id: params.id }), [params.id]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Details");
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    const price = typeof product.price === "string"
      ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
      : product.price;

    addItem({
      id: product.id,
      name: product.name,
      price: price,
      image: product.images?.[0] || product.image,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
              >
                <span className="text-gray-400 text-lg">
                  Product Image {selectedImage + 1}
                </span>
              </motion.div>
            </AnimatePresence>
            <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-red-500">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {(product.images || []).map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "aspect-square rounded-xl bg-gray-50 border-2 transition-all overflow-hidden relative",
                  selectedImage === index
                    ? "border-black ring-1 ring-black ring-offset-2"
                    : "border-transparent hover:border-gray-200"
                )}
              >
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                  Img {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating || 0) ? "fill-current" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviews} reviews)
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-medium text-indigo-600">
              {product.price}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex gap-4 mb-8">
            <motion.button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={cn(
                "flex-1 py-4 px-8 rounded-full font-semibold text-white flex items-center justify-center gap-2 shadow-lg transition-colors",
                isAdded ? "bg-green-500" : "bg-black hover:bg-gray-900"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              className="p-4 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-100 pt-8">
            <div className="flex gap-8 border-b border-gray-100 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-4 text-sm font-medium transition-colors relative",
                    activeTab === tab ? "text-black" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "Details" && (
                    <ul className="space-y-2">
                      {(product.features || []).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTab === "Reviews" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-medium">John Doe</div>
                          <div className="flex text-yellow-400 text-xs">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Absolutely amazing sound quality. The noise cancellation is top-notch!
                        </p>
                      </div>
                    </div>
                  )}
                  {activeTab === "AI Analysis" && (
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <div className="flex items-center gap-2 mb-2 text-indigo-700 font-medium">
                        <SparklesIcon className="w-4 h-4" />
                        AI Summary
                      </div>
                      <p className="text-sm text-indigo-900/80 leading-relaxed">
                        Based on 124 reviews, this product is highly rated for its <strong>sound quality</strong> and <strong>comfort</strong>. Some users noted the case is slightly bulky, but the battery life exceeds expectations.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
