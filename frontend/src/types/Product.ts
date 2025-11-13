export default interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  thumbnail: string;
  images: string[];
  categories: {
    id: string;
    name: string;
  };
}