import Api from "@/services/Api";
import { defineStore } from "pinia";

export const useCategoryStore = defineStore('categoryStore', {
  state: () => {
    return {
      errors: {},
    }
  },
  actions: {
    async getHeaderCategories() {
      const res = await Api.get('/categoryHeader');
      const data = await res.data;

      return data.categories;
    },

    async getAllCategories() {
      const res = await Api.get('/categories');
      const data = await res.data;

      return data.categories;
    },

    async getProductInCategories(slug) {
      const res = await Api.get(`/category/${slug}`);
      const data = await res.data;

      return data.product;
    }
  }
})
