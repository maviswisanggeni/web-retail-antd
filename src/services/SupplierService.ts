import axios, { AxiosRequestConfig } from "axios";

export class SupplierService {
  private static URL = "http://localhost:3000";

  private static config: AxiosRequestConfig = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  };

  public static getAllSupplier() {
    const SupplierURL = `${this.URL}/supplier`;
    return axios.get(SupplierURL, this.config);
  }

  public static createSupplier(data: unknown) {
    const SupplierURL = `${this.URL}/supplier`;
    return axios.post(SupplierURL, data, this.config);
  }

  public static deleteSupplier(id: number) {
    const SupplierURL = `${this.URL}/supplier/${id}`;
    return axios.delete(SupplierURL, this.config);
  }

  public static updateSupplier(id: number, data: unknown) {
    const SupplierURL = `${this.URL}/supplier/${id}`;
    return axios.patch(SupplierURL, data, this.config);
  }

  public static getSupplierById(id: number) {
    const SupplierURL = `${this.URL}/supplier/${id}`;
    return axios.get(SupplierURL, this.config);
  }
}