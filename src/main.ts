import './assets/main.css'
import 'primeicons/primeicons.css';
import "v3-infinite-loading/lib/style.css";
import 'vue3-toastify/dist/index.css'
import 'primevue/resources/primevue.min.css';
import "primevue/resources/themes/lara-light-indigo/theme.css";

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config'
import FocusTrap from 'primevue/focustrap';
import Tailwind from 'primevue/passthrough/tailwind'
import Ripple from 'primevue/ripple'
import Tooltip from 'primevue/tooltip'
import { createApp } from 'vue'
import Vue3Toasity, { toast, type ToastContainerOptions } from 'vue3-toastify'

import App from '@/views/App.vue'

import router, { initializeRouter } from './router'

const app = createApp(App)
const pinia = createPinia()

pinia.use(
  createPersistedState({
    storage: localStorage,
    key: (id) => `__persisted__${id}`
  })
)

initializeRouter()
app.use(Vue3Toasity, {
  autoClose: 3000,
  hideProgressBar: true,
  position: toast.POSITION.BOTTOM_LEFT
} as ToastContainerOptions)

app.use(PrimeVue, { ripple: true, unstyled: true, pt: Tailwind })
app.directive('tooltip', Tooltip)
app.directive('focustrap', FocusTrap);
app.directive('ripple', Ripple)
app.use(pinia)
app.use(router)
app.mount('#app')
