import axios from "axios"

export class ProductsService {
    private static URL: string = 'https://dummyjson.com'

    public static getAllProducts() {
        const ProductURL: string = `${this.URL}/products`
        return axios.get(ProductURL);
    }

    public static deleteProduct(id: number) {
        const ProductURL: string = `${this.URL}/products/${id}`
        return axios.delete(ProductURL);
    }

    public static updateProduct(id: number, data: unknown) {
        const ProductURL: string = `${this.URL}/products/${id}`
        return axios.put(ProductURL, data);
    }

    public static getProduct(id: number) {
        const ProductURL: string = `${this.URL}/products/${id}`
        return axios.get(ProductURL);
    }
}