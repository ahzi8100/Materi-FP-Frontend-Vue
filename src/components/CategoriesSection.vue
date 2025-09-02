<script setup>
import { onMounted, ref } from "vue";
import { useCategoryStore } from "@/stores/category";

const { getHeaderCategories } = useCategoryStore();
const categories = ref([]);

onMounted(async () => {
  categories.value = await getHeaderCategories()
});
</script>

<template>
  <!-- Product banner section -->
  <section id="product-banners">
    <div class="container mx-auto py-10">
      <div class="flex flex-wrap -mx-4">
        <!-- Category 1 -->
        <div v-for="category in categories" :key="category.id" class="w-full sm:w-1/3 px-4 mb-8">
          <div class="category-banner relative overflow-hidden rounded-lg shadow-lg group">
            <img :src="`http://test-backend-shop.test/storage/categories/${category.image}`" alt="Category 1"
              class="w-full h-auto">
            <div class="absolute inset-0 bg-gray-light bg-opacity-50"></div>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <h2 class="text-2xl md:text-3xl font-bold mb-4">{{ category.name }}</h2>
              <a href="#"
                class="bg-primary hover:bg-transparent border border-transparent hover:border-white text-white hover:text-white font-semibold px-4 py-2 rounded-full inline-block">Shop
                now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.category-banner {
  height: 300px;
}
</style>
