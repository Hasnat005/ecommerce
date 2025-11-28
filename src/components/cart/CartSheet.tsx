"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";

export default function CartSheet() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-bold">Your Cart ({items.length})</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <LayoutGroup>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                        className="flex gap-4 bg-white"
                      >
                        {/* Image Placeholder */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                          Img
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 line-clamp-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">${item.price}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-white rounded-md shadow-sm transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </motion.button>
                              <span className="text-sm font-medium w-4 text-center">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-white rounded-md shadow-sm transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </motion.button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </LayoutGroup>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-xl font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                >
                  Checkout
                  <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                    ${subtotal.toFixed(2)}
                  </span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
