<template>
  <b-card>
    <b-row class="d-flex justify-content-end align-items-center">
      <b-col
        cols="3"
      >
        <b-input-group class="input-group-merge">
          <b-input-group-prepend is-text>
            <feather-icon icon="SearchIcon" />
          </b-input-group-prepend>
          <b-form-input
            v-model="customerName"
            placeholder="Masukan Nama Customer"
            @input="filterCustomer"
          />
        </b-input-group>
      </b-col>
      <b-col
        cols="auto"
      >

        <b-dropdown
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          right
          no-caret
          variant="primary"
        >
          <template
            #button-content
          >
            <feather-icon icon="SlidersIcon" />
          </template>
          <b-dropdown-form
            style="width: 417px;"
          >
            <b-form>
              <b-row>
                <b-col
                  cols="12"
                  class="mt-50 pr-2 pl-2"
                >
                  <b-form-group
                    label="Daerah"
                  >
                    <v-select
                      v-model="destination"
                      label="label"
                      :options="itemsDestinations"
                      :reduce="items => items.city_name"
                      placeholder="Ketik untuk mencari..."
                      @search="onSearchDestination"
                    />
                  </b-form-group>
                </b-col>

                <b-col
                  cols="12"
                  class="ml-50"
                >
                  <b-form-group
                    label="Uang Dihabiskan"
                  >
                    <div class="d-flex justify-content-center align-items-center">
                      <b-form-input
                        v-model="spentFrom"
                        class=""
                      />
                      <b-button
                        class="btn-icon"
                        variant="flat-dark"
                        disabled
                      >
                        <feather-icon
                          icon="MinusIcon"
                        />
                      </b-button>
                      <b-form-input
                        v-model="spentTo"
                        class="mr-1"
                      />
                    </div>
                  </b-form-group>
                </b-col>

                <b-col
                  cols="12"
                  class="ml-50 mt-50"
                >
                  <b-form-group
                    label="Pcs"
                  >
                    <div class="d-flex justify-content-center align-items-center">
                      <b-form-input
                        v-model="pcsFrom"
                        class=""
                      />
                      <b-button
                        class="btn-icon"
                        variant="flat-dark"
                        disabled
                      >
                        <feather-icon
                          icon="MinusIcon"
                        />
                      </b-button>
                      <b-form-input
                        v-model="pcsTo"
                        class="mr-1"
                      />
                    </div>
                  </b-form-group>
                </b-col>

                <b-col
                  cols="12"
                  class="ml-50 mt-50"
                >
                  <b-form-group
                    label="Total Order"
                  >
                    <div class="d-flex justify-content-center align-items-center">
                      <b-form-input
                        v-model="orderFrom"
                        class=""
                      />
                      <b-button
                        class="btn-icon"
                        variant="flat-dark"
                        disabled
                      >
                        <feather-icon
                          icon="MinusIcon"
                        />
                      </b-button>
                      <b-form-input
                        v-model="orderTo"
                        class="mr-1"
                      />
                    </div>
                  </b-form-group>
                </b-col>

                <!-- submit and reset -->
                <b-col
                  cols="12"
                  class="ml-50 mt-1"
                >
                  <b-button
                    v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                    type="reset"
                    variant="outline-primary"
                    class="mr-1"
                    @click="resetFilter"
                  >
                    Reset
                  </b-button>

                  <b-button
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    type="submit"
                    variant="primary"
                    @click.prevent="filterCustomer"
                  >
                    Terapkan
                  </b-button>
                </b-col>
              </b-row>
            </b-form>
          </b-dropdown-form>
        </b-dropdown>
      </b-col>
    </b-row>

    <b-overlay
      :show="loading"
      spinner-variant="primary"
      variant="light"
      rounded="sm"
      opacity=".5"
      blur="0"
    >
      <b-table
        ref="tables"
        striped
        hover
        responsive
        class="position-relative mt-2"
        empty-text="Tidak ada data untuk ditampilkan."

        :items="itemsCustomer"
        :fields="fields"
        :show-empty="!loading"
      >

        <template #cell(customer_name)="data">
          {{ data.item.customer_name }}
        </template>

        <template #cell(customer_address)="data">
          {{ data.item.customer_address }}
        </template>

        <template #cell(total_order)="data">
          {{ data.item.total_order }}
        </template>

        <template #cell(total_pcs)="data">
          {{ data.item.total_pcs }}
        </template>

        <template #cell(total_spent)="data">
          Rp. {{ formatPrice(data.value) }}
        </template>

        <template #cell(action)="data">
          <b-button
            size="sm"
            variant="flat-info"
            tag="router-link"
            :to="{ name: $route.meta.routeDetail, params: { customer_id: data.item.customer_id } }"
          >
            Lihat Detail
          </b-button>
        </template>

      </b-table>
    </b-overlay>
  </b-card>
</template>

<script>
import {
  BCol,
  BFormInput,
  BInputGroup,
  BInputGroupPrepend,
  BButton,
  BRow,
  BTable,
  VBPopover,
  BForm,
  BFormGroup,
  BCard,
  BOverlay,
  BDropdown,
  BDropdownForm,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { dateFormat } from '@core/mixins/ui/date'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import useJwt from '@/auth/jwt/useJwt'
import httpKomship from '../setting-kompship/http_komship'

export default {
  components: {
    BCard,
    BCol,
    BFormInput,
    BInputGroup,
    BInputGroupPrepend,
    BButton,
    BRow,
    BTable,
    FeatherIcon,
    BForm,
    BFormGroup,
    BOverlay,
    vSelect,
    BDropdown,
    BDropdownForm,
  },
  directives: {
    'b-popover': VBPopover,
    Ripple,
  },
  mixins: [dateFormat],
  data() {
    return {
      loading: false,

      selected: 1,
      options: [
        { value: 1, text: 'Kabupaten' },
      ],

      fields: [
        {
          key: 'customer_name',
          label: 'Nama Customer',
        },
        {
          key: 'customer_address',
          label: 'Alamat',
        },
        {
          key: 'total_order',
          label: 'Total Order',
          tdClass: 'text-center',
          sortable: true,
        },
        {
          key: 'total_pcs',
          label: 'Total Pcs',
          tdClass: 'text-center',
          sortable: true,
        },
        {
          key: 'total_spent',
          label: 'Uang Dihabiskan',
          sortable: true,
        },
        {
          key: 'last_order',
          label: 'Terakhir Order',
          formatter: value => {
            if (!value || value === '00-00-0000') return '-'
            value.split('')
            const newFormat = []
            newFormat.push(value[6])
            newFormat.push(value[7])
            newFormat.push(value[8])
            newFormat.push(value[9])
            newFormat.push(value[2])
            newFormat.push(value[3])
            newFormat.push(value[4])
            newFormat.push(value[5])
            newFormat.push(value[0])
            newFormat.push(value[1])
            newFormat.join('')
            return this.dateFormat(String(newFormat.join('')), 'dd mmmm yyyy')
          },
        },
        {
          key: 'action',
          label: 'Aksi',
        },
      ],

      itemsCustomer: [],

      // Params Filter
      productName: '',
      spentFrom: null,
      spentTo: null,
      orderFrom: null,
      orderTo: null,
      pcsFrom: null,
      pcsTo: null,
      area: '',
      destination: '',
      itemsDestinations: [],

      customerName: '',

      endpoint: null,
      url: '/v1/customers',
    }
  },
  mounted() {
    this.tableProvider()
  },
  methods: {
    tableProvider() {
      this.loading = true
      httpKomship.get('/v1/customers', {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        this.itemsCustomer = data
        this.loading = false
        return this.itemsCustomer
      })
    },
    filterCustomer() {
      this.loading = true
      const params = {}

      if (this.customerName) Object.assign(params, { customer_name: this.customerName })
      if (this.orderFrom) Object.assign(params, { orderFrom: this.orderFrom })
      if (this.orderTo) Object.assign(params, { orderTo: this.orderTo })
      if (this.destination) Object.assign(params, { area: this.destination })
      if (this.spentFrom) Object.assign(params, { spentFrom: this.spentFrom })
      if (this.spentTo) Object.assign(params, { spentTo: this.spentTo })
      if (this.pcsFrom) Object.assign(params, { pcsFrom: this.pcsFrom })
      if (this.pcsTo) Object.assign(params, { pcsTo: this.pcsTo })

      httpKomship.get('/v1/customers', {
        params,
      }, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        this.itemsCustomer = data
        this.loading = false
        return this.itemsCustomer
      })
    },
    onSearchDestination(search, loading) {
      if (search.length) {
        this.searchDestination(loading, search, this)
      }
    },
    searchDestination: _.debounce((loading, search, that) => {
      loading(true)
      that.loadDestination(search).finally(() => loading(false))
    }, 500),
    loadDestination(search) {
      return httpKomship.get(`/v1/destination?search=${search}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data.data
        this.itemsDestinations = data
        return this.itemsDestinations
      })
    },
    resetFilter() {
      this.tableProvider()
    },
    formatPrice(value) {
      const val = value
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
