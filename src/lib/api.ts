import { Product } from "@/types";

export interface ChatMessage {
  role: "user" | "bot" | "system";
  content: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function getProducts(): Promise<Product[]> {
  // In a real app, this would fetch from an API
  // For now, we return the mock data used in the app
  return [
    { id: "1", name: "Minimalist Watch", price: "$120.00", category: "Accessories", image: "/placeholder" },
    { id: "2", name: "Leather Backpack", price: "$180.00", category: "Bags", image: "/placeholder" },
    { id: "3", name: "Wireless Headphones", price: "$250.00", category: "Electronics", image: "/placeholder" },
    { id: "4", name: "Cotton T-Shirt", price: "$35.00", category: "Apparel", image: "/placeholder" },
    { id: "5", name: "Smart Speaker", price: "$99.00", category: "Electronics", image: "/placeholder" },
    { id: "6", name: "Running Shoes", price: "$140.00", category: "Footwear", image: "/placeholder" },
  ];
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function chatWithAI(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array> | string> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chat response");
    }

    // Check if the response is a stream
    if (response.headers.get("Content-Type")?.includes("text/event-stream")) {
      return response.body as ReadableStream<Uint8Array>;
    }

    // Otherwise return JSON
    const data = await response.json();
    return data.message || data.content;
  } catch (error) {
    console.error("Error in chatWithAI:", error);
    // Fallback for demo purposes if API fails or doesn't exist
    return "I'm sorry, I couldn't connect to the server. Please try again later.";
  }
}
