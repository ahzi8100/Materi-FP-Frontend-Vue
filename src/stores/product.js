import Api from "@/services/Api";
import { defineStore } from "pinia";

export const useProductStore = defineStore('productStore', {
  state: () => {
    return {
      errors: {},
    }
  },
  actions: {
    async getAllProducts() {
      const res = await Api.get('/products');
      const data = await res.data;

      return data.products;
    },
  }
})
