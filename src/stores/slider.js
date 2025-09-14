import Api from "@/services/Api";
import { defineStore } from "pinia";

export const useSliderStore = defineStore('sliderStore', {
  state: () => {
    return {
      errors: {},
    }
  },
  actions: {
    async getAllSliders() {
      const res = await Api.get('/sliders');
      const data = await res.data;

      console.log("data sliders: ", data)
      return data.sliders;
    },
  }
})
