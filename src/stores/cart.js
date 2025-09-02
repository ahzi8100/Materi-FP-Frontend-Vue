import Api from "@/services/Api";
import { defineStore } from "pinia";

export const useCartStore = defineStore('cartStore', {
  state: () => {
    return {
      // carts: null,
      errors: {},
    }
  },
  actions: {
    async addToCart(product_id, customer_id, quantity, price) {
      try {
        const res = await Api.post('/cart', {
          product_id: product_id,
          customer_id: customer_id,
          quantity: quantity,
          price: price,
        });

        const data = res.data;
        console.log(data.carts);
        this.router.push({ name: 'cart' });
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    },

    async getCart() {
      try {
        const res = await Api.get('/cart');

        const data = res.data;
        return data.cart;
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    },

    async getTotalCart() {
      try {
        const res = await Api.get('/cart/total');

        const data = res.data
        return parseFloat(data.total)
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    },

    async getTotalWeight() {
      try {
        const res = await Api.get('/cart/totalWeight');

        const data = res.data;
        return data.total;
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    },

    async removeCartItem(cart) {
      try {
        const res = await Api.post(`/cart/remove/${cart}`);

        console.log(res.data);
        this.router.push({ name: 'cart' });
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    },

    async checkout(formData) {
      try {
        const res = await Api.post('/checkout', formData);

        // Asumsi data respons langsung berisi snap_token
        const data = res.data;

        return data.snap_token;
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
        } else {
          this.errors = { general: ['Gagal melakukan checkout.'] };
        }
        return false;
      }
    }
  }
})
