export interface IProducts {
  products?: ProductsEntity[] | null;
  total: number;
  skip: number;
  limit: number;
}
export interface ProductsEntity {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images?: string[] | null;
}
