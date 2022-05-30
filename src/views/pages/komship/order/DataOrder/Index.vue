<template>
  <b-card>
    <div class="d-flex justify-between mb-2">
      <h3 class="font-bold">
        Data Order
      </h3>
      <div>
        <b-button
          v-if="tabIndex === 1"
          variant="primary"
          size="sm"
          class="mr-1"
          to="ajukan-pickup"
        >
          Ajukan Pickup
        </b-button>
        <b-dropdown
          id="dropdown-1"
          variant="outline-primary"
          size="sm"
          right
          text="Export"
        >
          <b-dropdown-item>Export Excel</b-dropdown-item>
          <b-dropdown-item>Export CSV</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <b-tabs
      v-model="tabIndex"
      fill
    >
      <b-tab
        title="Semua"
        lazy
      >
        <all />
      </b-tab>
      <b-tab lazy>
        <template slot="title">
          <b-badge
            class="mr-1"
            variant="primary"
            pill
          >
            {{ totalAjukan }}
          </b-badge>
          Order Dibuat
        </template>
        <created />
      </b-tab>
      <b-tab lazy>
        <template slot="title">
          <b-badge
            class="mr-1"
            variant="primary"
            pill
          >
            {{ totalPacking }}
          </b-badge>
          Dipacking
        </template>
        <packing />
      </b-tab>
      <b-tab lazy>
        <template slot="title">
          <b-badge
            class="mr-1"
            variant="primary"
            pill
          >
            {{ totalKirim }}
          </b-badge>
          Dikirim
        </template>
        <send />
      </b-tab>
      <b-tab
        title="Diterima"
        lazy
      >
        <received />
      </b-tab>
      <b-tab
        title="Retur"
        lazy
      >
        <retur />
      </b-tab>
    </b-tabs>
  </b-card>
</template>
<script>
import {
  BCard, BTabs, BTab, BDropdown, BDropdownItem, BButton, BBadge,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import All from './List/All.vue'
import Created from './List/Created.vue'
import Packing from './List/Packing.vue'
import Send from './List/Send.vue'
import Received from './List/Received.vue'
import Retur from './List/Retur.vue'

export default {
  components: {
    BCard, BTabs, BTab, BDropdown, BDropdownItem, All, Created, Packing, Send, Received, Retur, BButton, BBadge,
  },
  data() {
    const tabs = ['semua', 'order-dibuat', 'dipacking', 'dikirim', 'diterima', 'retur']
    return {
      tabIndex: tabs.indexOf(this.$route.query.tab),
      tabs,
      profile: JSON.parse(localStorage.userData),
      totalAjukan: null,
      totalPacking: null,
      totalKirim: null,
    }
  },
  watch: {
    tabIndex(newValue) {
      const tab = this.tabs[newValue]
      this.$router.replace({ query: { tab } }).catch(() => {})
    },
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$http_komship.get(`v1/order/${this.profile.partner_detail.id}`, {
        params: { order_status: 'Diajukan' },
      }).then(res => {
        const { data } = res.data
        this.totalAjukan = data.total
      }).catch(err => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: err,
            variant: 'danger',
          },
        })
      })
      this.$http_komship.get(`v1/order/${this.profile.partner_detail.id}`, {
        params: { order_status: 'Dipacking' },
      }).then(res => {
        const { data } = res.data
        this.totalPacking = data.total
      }).catch(err => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: err,
            variant: 'danger',
          },
        })
      })
      this.$http_komship.get(`v1/order/${this.profile.partner_detail.id}`, {
        params: { order_status: 'Dikirim' },
      }).then(res => {
        const { data } = res.data
        this.totalKirim = data.total
      }).catch(err => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: err,
            variant: 'danger',
          },
        })
      })
    },
  },
}
</script>
