<script setup>
import { moneyFormat } from '@/composables/useFormatter';
import { useCartStore } from '@/stores/cart';
import { useCourierStore } from '@/stores/courier';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const { getCart, getTotalCart, getTotalWeight, removeCartItem, checkout } = useCartStore();
const carts = ref([])
const cartTotal = ref(0)
const cartWeight = ref(0)

const { getProvinces, getCities, getDistricts, checkOngkir } = useCourierStore();
const { provinces, cities, districts, couriers, ongkirOptions } = storeToRefs(useCourierStore());

const selectedProvinceId = ref('');
const selectedCityId = ref('');
const selectedDistrictId = ref('');
const selectedCourier = ref('');
const selectedCourierService = ref();
const router = useRouter();

// Gunakan watcher untuk memantau perubahan province
watch(selectedProvinceId, (newProvinceId) => {
  if (newProvinceId) {
    getCities(newProvinceId);
  } else {
    // Jika tidak ada provinsi yang dipilih, kosongkan data kota dan distrik
    cities.value = [];
    districts.value = [];
    selectedCityId.value = '';
  }
});

// Gunakan watcher untuk memantau perubahan city
watch(selectedCityId, (newCityId) => {
  if (newCityId) {
    getDistricts(newCityId);
  } else {
    // Jika tidak ada kota yang dipilih, kosongkan data distrik
    districts.value = [];
  }
});

watch([selectedCourier, selectedDistrictId], async ([newCourier, newDistrict]) => {
  if (newCourier && newDistrict && cartWeight.value > 0) {
    await checkOngkir(newDistrict, cartWeight.value, newCourier);
  }
});


onMounted(async () => {
  carts.value = await getCart();
  cartTotal.value = await getTotalCart();
  cartWeight.value = await getTotalWeight();

  provinces.value = await getProvinces();
})

// Deklarasikan semua data formulir
const formData = ref({
  name: '',
  phone: '',
  address: '',
});

// Properti terhitung untuk grand_total dan data checkout lainnya
const checkoutPayload = computed(() => {
  const courierCost = selectedCourierService.value?.cost || 0;

  return {
    ...formData.value,
    courier: selectedCourier.value,
    service: selectedCourierService.value?.service,
    cost_courier: courierCost,
  };
});

// Fungsi untuk proses checkout
const handleCheckout = async () => {
  // Gabungkan semua data menjadi satu payload

  const snapToken = await checkout(checkoutPayload.value);

  if (snapToken) {
    // Panggil Midtrans Snap.js untuk menampilkan halaman pembayaran
    window.snap.pay(snapToken, {
      onSuccess: function (result) {
        console.log("Success:", result);
        router.push({ name: "detail_order", params: { snap_token: snapToken } });
      },
      onPending: function (result) {
        console.log("Pending:", result);
        router.push({ name: "detail_order", params: { snap_token: snapToken } });
      },
      onError: function (result) {
        console.log("Error:", result);
        router.push({ name: "detail_order", params: { snap_token: snapToken } });
      },
      onClose: function () {
        alert("Anda menutup popup tanpa menyelesaikan pembayaran");
        router.push({ name: "detail_order", params: { snap_token: snapToken } });
      }
    });
  }
};
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <div class="flex flex-col md:flex-row gap-8">

      <div class="md:w-1/2 bg-white rounded-lg shadow-lg p-6 h-fit">
        <h2 class="text-xl font-bold flex items-center text-gray-800 pb-3 border-b mb-4">
          <svg class="w-6 h-6 mr-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
          </svg>
          DETAIL PESANAN
        </h2>

        <div v-for="cart in carts" :key="cart.id"
          class="flex items-center justify-between p-2 border-1 bg-blue-50 border-gray-50 mb-4">
          <div class="flex items-start">
            <img :src="cart.product.image" alt="Product" class="h-20 w-20 object-cover rounded mr-4">
            <div>
              <p class="font-semibold text-gray-800">{{ cart.product.title }}</p>
              <p class="text-xs text-gray-500 my-1">QTY : {{ cart.quantity }}</p>
              <span v-if="cart.product.discount != null || cart.product.discount > 0"
                class="text-sm line-through text-red-500">{{ moneyFormat(cart.product.price * cart.quantity)
                }}</span>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <p class="font-semibold text-primary">{{ moneyFormat(cart.price) }}</p>
            <button @click.prevent="removeCartItem(cart.id)" class="text-red-500 hover:text-red-700 mt-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                </path>
              </svg>
            </button>
          </div>
        </div>

        <div class="text-gray-600 space-y-2 border-t">
          <div class="flex justify-between font-semibold">
            <span>JUMLAH</span>
            <span>: {{ moneyFormat(cartTotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>ONGKOS KIRIM <span class="text-sm">({{ cartWeight }} gram)</span></span>
            <span>: {{ moneyFormat(selectedCourierService?.cost) || 0 }}</span>
          </div>
          <div class="flex justify-between font-bold text-lg border-t pt-4">
            <span>GRAND TOTAL</span>
            <span class="text-primary">{{ moneyFormat((selectedCourierService?.cost || 0) + cartTotal) }}</span>
          </div>
        </div>
      </div>

      <div class="md:w-1/2 bg-white rounded-lg shadow-lg p-6 h-fit">
        <h2 class="text-xl font-bold flex items-center text-gray-800 pb-3 border-b mb-4">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-9 0V3a1 1 0 011-1h6a1 1 0 011 1v2m-6 0h6">
            </path>
          </svg>
          RINCIAN PENGIRIMAN
        </h2>

        <div class="space-y-4">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full">
              <label for="nama_lengkap" class="block text-sm font-semibold text-gray-700">NAMA LENGKAP</label>
              <input type="text" id="nama_lengkap" placeholder="Nama Lengkap" v-model="formData.name"
                class="w-full mt-1 p-2 border rounded-md focus:ring-primary focus:border-primary">
            </div>
            <div class="w-full">
              <label for="no_hp" class="block text-sm font-semibold text-gray-700">NO. HP / WHATSAPP</label>
              <input type="text" id="no_hp" placeholder="No. HP / WhatsApp" v-model="formData.phone"
                class="w-full mt-1 p-2 border rounded-md focus:ring-primary focus:border-primary">
            </div>
          </div>

          <div>
            <label for="provinsi" class="block text-sm font-semibold text-gray-700">PROVINSI</label>
            <select id="provinsi" v-model="selectedProvinceId"
              class="w-full mt-1 p-2 border rounded-md focus:ring-primary focus:border-primary">
              <option value="">-- pilih provinsi --</option>
              <option v-for="province in provinces" :key="province.id" :value="province.id">
                {{ province.name }}
              </option>
            </select>
          </div>

          <div>
            <label for="kota" class="block text-sm font-semibold text-gray-700">KOTA / KABUPATEN</label>
            <select id="kota" v-model="selectedCityId"
              class="w-full mt-1 p-2 border rounded-md focus:ring-primary focus:border-primary">
              <option value="">-- pilih kota --</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.type }} {{ city.name }}
              </option>
            </select>
          </div>

          <div>
            <label for="kecamatan" class="block text-sm font-semibold text-gray-700">KECAMATAN</label>
            <select id="distrik" v-model="selectedDistrictId"
              class="w-full mt-1 p-2 border rounded-md focus:ring-primary focus:border-primary">
              <option value="">-- pilih distrik --</option>
              <option v-for="district in districts" :key="district.id" :value="district.id">
                {{ district.name }}
              </option>
            </select>
          </div>

          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Kurir</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div v-for="courier in couriers" :key="courier.value" class="flex items-center">
                <input type="radio" name="courier" :id="`courier-${courier.value}`" :value="courier.value"
                  v-model="selectedCourier" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                <label :for="`courier-${courier.value}`" class="ml-2 block text-sm text-gray-900">{{ courier.name
                  }}</label>
              </div>
            </div>
          </div>

          <div v-if="ongkirOptions.length > 0" class="mt-4">
            <h3 class="font-semibold text-gray-800">Pilihan Layanan: </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div v-for="cost in ongkirOptions" :key="cost.code" class="flex items-center">
                <input type="radio" name="cost" :id="`cost-${cost.value}`" :value="cost"
                  v-model="selectedCourierService"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                <label :for="`cost-${cost.value}`" class="ml-2 block text-sm text-gray-900">{{ cost.service }} -
                  {{ moneyFormat(cost.cost) }}</label>
              </div>
            </div>
          </div>

          <div v-if="ongkirOptions.length === 0 && selectedCourier" class="mt-4 text-red-500">
            Tidak ada opsi pengiriman tersedia.
          </div>

          <div>
            <label for="alamat" class="block text-sm font-semibold text-gray-700">ALAMAT LENGKAP</label>
            <textarea v-model="formData.address" id="alamat"
              placeholder="Contoh: Jl. Tongkol Raya No. 1, Minomartani, Ngaglik, Sleman"
              class="w-full mt-1 p-2 border rounded-md focus:ring-primary focus:border-primary"></textarea>
          </div>

          <button @click="handleCheckout"
            class="mt-4 bg-primary text-white font-semibold py-3 px-6 rounded-full w-full hover:bg-transparent hover:text-primary transition-colors duration-200 border border-primary">
            CHECKOUT
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
