import axios from "axios"

export class ProductsService {
    private static URL: string = 'https://dummyjson.com'

    public static getAllProducts() {
        const ProductURL: string = `${this.URL}/products`
        return axios.get(ProductURL);
    }
}