import Vue from 'vue'
import { ToastPlugin, ModalPlugin, PopoverPlugin } from 'bootstrap-vue'

import VueCompositionAPI from '@vue/composition-api'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import money from 'v-money'
import Dropdown from 'vue-simple-search-dropdown'
import router from './router'
import store from './store'
import App from './App.vue'

import './index.css'
// Global Components
import './global-components'

// 3rd party plugins
import '@axios'
import '@/libs/acl'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/tour'
import '@/libs/maps'
import '@/libs/geocoder'
import '@/libs/filters'
// Axios Mock Adapter
// import '@/@fake-db/db'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)
Vue.use(PopoverPlugin)

// Composition API
Vue.use(VueCompositionAPI)
Vue.use(Dropdown)
// Lodash
Vue.use(VueLodash, { lodash })
Vue.use(money, { precision: 0 })

// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// custom font
require('@/assets/fonts/odin-rounded/style.css')

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
