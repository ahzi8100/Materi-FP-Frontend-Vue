import axios from "axios";

const Api = axios.create({
  // baseURL: 'http://test-backend-shop.test/api',
  baseURL: 'http://testing.ahzi.my.id/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
})

export default Api
