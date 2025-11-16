// ...existing code...
import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
// pastikan tidak ada: axios.defaults.headers.common['Content-Type'] = 'application/json'