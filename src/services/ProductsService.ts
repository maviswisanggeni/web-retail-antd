import axios, { AxiosRequestConfig } from "axios"

export class ProductsService {
    private static URL: string = 'https://dummyjson.com'
    private static URL2: string = 'http://localhost:3000'

    // config cors 
    private static config: AxiosRequestConfig = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    }

    public static getAllProducts() {
        const ProductURL: string = `${this.URL2}/product`
        return axios.get(ProductURL);
    }

    public static createProduct(data: unknown) {
        const ProductURL: string = `${this.URL2}/product`
        return axios.post(ProductURL, data, this.config);
    }

    public static deleteProduct(id: number) {
        const ProductURL: string = `${this.URL2}/product/${id}`
        return axios.delete(ProductURL, this.config);
    }

    public static updateProduct(id: number, data: unknown) {
        const ProductURL: string = `${this.URL2}/product/${id}`
        return axios.patch(ProductURL, data, this.config);
    }

    public static getProductById(id: number) {
        const ProductURL: string = `${this.URL2}/product/${id}`
        return axios.get(ProductURL, this.config);
    }
}