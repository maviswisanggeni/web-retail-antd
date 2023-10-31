import axios, { AxiosRequestConfig } from "axios";

export class AdjustmentService {
    private static URL = "http://localhost:3000";

    // config cors
    private static config: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
    };

    public static getAllAdjustment() {
        const AdjustmentURL = `${this.URL}/stockopn`;
        return axios.get(AdjustmentURL);
    }

    public static createAdjustment(data: unknown) {
        const AdjustmentURL = `${this.URL}/stockopn`;
        return axios.post(AdjustmentURL, data, this.config);
    }

    public static deleteAdjustment(id: number) {
        const AdjustmentURL = `${this.URL}/stockopn/${id}`;
        return axios.delete(AdjustmentURL, this.config);
    }

        public static getAdjustmentById(id: number) {
            const AdjustmentURL = `${this.URL}/stockopn/${id}`;
            return axios.get(AdjustmentURL, this.config);
        }
}