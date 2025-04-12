export type Property = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  city: string;
  province: string;
  images: string[];
  status: 'available' | 'sold' | 'pending';
  features: string[];
};

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'client';
  created_at: string;
  name?: string;
  phone?: string;
};

export type ChatMessage = {
  id: number;
  created_at: string;
  user_id: string;
  message: string;
  is_ai: boolean;
}; 