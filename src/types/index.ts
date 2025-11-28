export interface Product {
  id: string;
  name: string;
  price: number | string; // Allow string for mock data like "$120.00"
  image: string;
  category?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  features?: string[];
  images?: string[];
}

export interface CartItem extends Product {
  price: number; // Cart items must have numeric price
  quantity: number;
}
