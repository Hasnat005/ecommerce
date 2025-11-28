"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, MessageSquare, Sparkles, Play, Loader2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  type?: "text" | "sql-preview" | "product-grid";
  data?: any;
};

const SQLPreview = ({ query }: { query: string }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 1500);
  };

  return (
    <div className="mt-2 w-full max-w-xs bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="bg-gray-800 px-3 py-1 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-mono">SQL Query</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="p-3 font-mono text-xs text-green-400 overflow-x-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {query}
        </motion.div>
      </div>
      <div className="bg-gray-800/50 p-2 flex justify-end border-t border-gray-800">
        <button
          onClick={handleRun}
          disabled={isRunning || hasRun}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all",
            hasRun
              ? "bg-green-500/10 text-green-500 cursor-default"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          )}
        >
          {isRunning ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : hasRun ? (
            <span>Executed</span>
          ) : (
            <>
              <Play className="w-3 h-3" />
              Run Query
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const ProductCarousel = ({ products }: { products: Product[] }) => {
  return (
    <div className="mt-3 -mx-2 overflow-x-auto pb-2 px-2 flex gap-3 scrollbar-hide">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex-shrink-0 w-32 bg-white rounded-lg border border-gray-100 overflow-hidden cursor-pointer group"
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="h-24 bg-gray-100 relative overflow-hidden">
            {/* Placeholder for image */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">
              Product Img
            </div>
          </div>
          <div className="p-2">
            <h4 className="text-xs font-medium text-gray-900 truncate">
              {product.name}
            </h4>
            <p className="text-xs text-indigo-600 font-semibold mt-0.5">
              {product.price}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! I'm your AI shopping assistant. Try asking for 'latest sneakers' or 'show sql'.",
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      type: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response based on input
    setTimeout(() => {
      let botResponse: Message;
      const lowerInput = newMessage.content.toLowerCase();

      if (lowerInput.includes("sql")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "Here is the SQL query to fetch the latest products:",
          type: "sql-preview",
          data: "SELECT * FROM products\nWHERE category = 'sneakers'\nORDER BY created_at DESC\nLIMIT 5;",
        };
      } else if (lowerInput.includes("sneakers") || lowerInput.includes("products")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "I found these top-rated sneakers for you:",
          type: "product-grid",
          data: [
            { id: "1", name: "Air Max 90", price: "$120", image: "/placeholder" },
            { id: "2", name: "Ultra Boost", price: "$180", image: "/placeholder" },
            { id: "3", name: "Jordan 1", price: "$170", image: "/placeholder" },
            { id: "4", name: "Yeezy 350", price: "$220", image: "/placeholder" },
          ],
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "I can help you find products or show you the underlying SQL queries. Try asking for 'sneakers'!",
          type: "text",
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="bg-black text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <MessageSquare className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">AI Assistant</h3>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <motion.div
                  layout
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex w-full",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                    )}
                  >
                    <p>{msg.content}</p>
                    {msg.type === "sql-preview" && msg.data && (
                      <SQLPreview query={msg.data} />
                    )}
                    {msg.type === "product-grid" && msg.data && (
                      <ProductCarousel products={msg.data} />
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: dot * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 relative"
              >
                <motion.input
                  layout
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about products..."
                  className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-3 bg-black text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-shadow"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
