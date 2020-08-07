export interface IProduct {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  images: string;
}

export interface ServerResponse {
  count: number;
  products: IProduct[];
}
