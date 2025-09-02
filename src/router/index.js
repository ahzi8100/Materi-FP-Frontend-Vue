import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import IndexView from '@/views/dashboard/IndexView.vue'
import { useAuthStore } from '@/stores/auth'
import OrderView from '@/views/dashboard/OrderView.vue'
import IndexViewCategory from '@/views/category/IndexView.vue'
import ShowViewCategory from '@/views/category/ShowView.vue'
import ShowProduct from '@/views/product/ShowProduct.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guest: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guest: true },
    },
    {
      path: '/customer/dashboard',
      name: 'dashboard',
      component: IndexView,
      meta: { auth: true },
    },
    {
      path: '/customer/order',
      name: 'order',
      component: OrderView,
      meta: { auth: true },
    },
    {
      path: '/categories',
      name: 'categories',
      component: IndexViewCategory,
    },
    {
      path: '/category/:slug',
      name: 'detail_category',
      component: ShowViewCategory
    },
    {
      path: '/product/:slug',
      name: 'detail_product',
      component: ShowProduct
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  await authStore.getUser();

  if (authStore.user && to.meta.guest) {
    return { name: 'dashboard' };
  }

  if (!authStore.user && to.meta.auth) {
    return { name: 'login' };
  }
})

export default router
