<script setup>
import { onMounted, ref } from "vue";
import { useProductStore } from "@/stores/product";
import { calculateDiscount, moneyFormat } from "@/composables/useFormatter";

const { getAllProducts } = useProductStore()
const products = ref([]);

onMounted(async () => {
  products.value = await getAllProducts()
});
</script>

<template>
  <section id="latest-products" class="py-10">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-bold mb-8">Latest products</h2>
      <div class="flex flex-wrap -mx-4 items-stretch">
        <!-- Product 1 -->
        <div v-for="product in products" :key="product.id" class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
          <div class="bg-white p-3 rounded-lg shadow-lg">
            <img :src="`http://test-backend-shop.test/storage/products/${product.image}`" alt="Product 1"
              class="w-full object-cover mb-4 rounded-lg">
            <router-link :to="{ name: 'detail_product', params: { slug: product.slug } }"
              class="text-lg font-semibold mb-2">{{ product.title }}</router-link>
            <p class="my-2">{{ product.category.name }}</p>
            <div class="flex items-center mb-4">
              <span class="text-lg font-bold text-primary">{{ moneyFormat(calculateDiscount(product)) }}</span>
              <span class="text-sm line-through ml-2">{{ moneyFormat(product.price) }}</span>
            </div>
            <router-link
              class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">Add
              to Cart</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
