import { fadeIn } from "@/lib/animations";
import * as motion from "framer-motion/client";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-center space-y-6 max-w-2xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
          Welcome to <span className="text-indigo-600">SQL-Shop</span>
        </h1>
        <p className="text-lg text-gray-600">
          Experience the future of digital commerce with our premium collection.
        </p>
        <div className="h-96 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
          <p className="text-gray-400">Hero Section Placeholder</p>
        </div>
      </motion.div>
    </div>
  );
}

