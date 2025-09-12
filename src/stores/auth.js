import Api from "@/services/Api";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      user: null,
      errors: {},
    }
  },
  actions: {
    async getUser() {
      if (localStorage.getItem('token')) {
        try {
          const res = await Api.get('/user')

          const data = await res.data;
          this.user = data

        } catch (error) {
          this.errors = error.response.data.errors
          this.user = null
        }
      }
    },

    async authenticate(apiRoute, formData) {
      try {
        const res = await Api.post(`/${apiRoute}`, formData)

        const data = await res.data;
        console.log('res data: ', data);

        localStorage.setItem('token', data.token);
        this.errors = {};
        this.user = data.customer;
        return true;
      } catch (error) {
        this.errors = error.response.data.errors;
        return false;
      }
    },

    async logout() {
      try {
        const res = await Api.post('/logout');

        const data = await res.data;

        if (data) {
          this.user = null;
          this.errors = {};
          localStorage.removeItem('token');
          return this.router.push({ name: 'home' });
        }
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    }
  }
})
