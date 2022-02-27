<template>
  <b-card>
    <h4><strong>Customer</strong></h4>
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
            @input="datapagination(filterCustomer)"
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
                      placeholder="Masukan nama Provinsi atau Kota"
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
                        placeholder="Rp 10.000.000"
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
                        placeholder="Rp 10.000.000"
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
                        placeholder="0"
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
                        placeholder="0"
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
                        placeholder="0"
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
                        placeholder="0"
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
                    @click.prevent="datapagination"
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
      variant="light"
      :show="loading"
      spinner-variant="primary"
      blur="0"
      opacity=".5"
      rounded="sm"
    >
      <b-table
        id="pagination"
        :current-page="currentPage"
        striped
        hover
        :per-page="0"
        responsive
        class="position-relative mt-2"
        empty-text="Tidak ada data untuk ditampilkan."
        :items="itemsCustomer"
        :fields="fields"
        :show-empty="!loading"
        @row-clicked="onRowClicked"
      >

        <template #head(customer_name)="data">
          <span class="capitalizeText">{{ data.label }}</span>
        </template>
        <template #head(customer_address)="data">
          <span class="capitalizeText">{{ data.label }}</span>
        </template>
        <template #head(total_order)="data">
          <span class="capitalizeText">{{ data.label }}</span>
        </template>
        <template #head(total_pcs)="data">
          <span class="capitalizeText">{{ data.label }}</span>
        </template>
        <template #cell(total_spent)="data">
          <span class="capitalizeText">Rp {{ formatPrice(data.item.total_spent) }}</span>
        </template>
        <template #head(last_order)="data">
          <span class="capitalizeText">{{ data.label }}</span>
        </template>
      </b-table>
    </b-overlay>
    <b-row class="justify-content-between mt-5 mx-50 mb-2">
      <div>
        <span class="text-black mr-1">
          List Per halaman
        </span>
        <b-button
          v-for="itemcustomer in halamancustomer"
          :key="itemcustomer"
          class="btn-icon mr-50"
          size="sm"
          :variant="itemcustomer === per_page ? 'primary' : 'flat-dark'"
          @click="halamanpagination(itemcustomer)"
        >
          {{ itemcustomer }}
        </b-button>
      </div>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="per_page"
        first-number
        hide-goto-end-buttons
        last-number
        class="pagination-primary"
      /></b-row>
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
  BForm,
  BFormGroup,
  BCard,
  BPagination,
  BOverlay,
  VBPopover,
  BDropdown,
  BDropdownForm,
} from 'bootstrap-vue'

import Ripple from 'vue-ripple-directive'
import useJwt from '@/auth/jwt/useJwt'
import { dateFormat } from '@core/mixins/ui/date'
import vSelect from 'vue-select'
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
    BForm,
    BFormGroup,
    BOverlay,
    vSelect,
    BPagination,
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
      currentPage: 1,
      per_page: 10,
      halamancustomer: [50, 100, 200],
      totalRows: 0,
      selected: 1,
      filterCustomer: null,
      options: [
        { value: 1, text: 'Kabupaten' },
      ],
      fields: [
        {
          key: 'customer_name',
          label: 'Nama Customer',
          sortable: true,
        },
        {
          key: 'customer_address',
          label: 'Alamat',
          tdClass: 'capitalizeText',
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
          sortable: true,
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
      ],

      itemsCustomer: [],
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
      loadTable: false,

    }
  },

  watch: {
    currentPage: {
      handler(value) {
        this.tableProvider().catch(error => {
          console.error(error)
        })
      },
    },
  },
  mounted() {
    this.tableProvider()
  },
  methods: {
    halamanpagination(halamantotal) {
      this.totalper_page = halamantotal
      this.tableProvider()
    },
    tableProvider() {
      this.loading = true
      return this.$http_komship.get('v1/customers', {
      }).then(response => {
        const { data } = response.data.data
        this.itemsCustomer = data
        this.totalRows = response.data.data.total
        this.loading = false
      })
    },
    datapagination() {
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
      if (this.currentPage) Object.assign(params, { page: this.currentPage })
      if (this.totalper_page) Object.assign(params, { total_: this.totalper_page })
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
      return this.datapagination()
    },
    formatPrice(value) {
      const val = value
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    onRowClicked(item) {
      this.$router.push({
        name: this.$route.meta.routeDetail,
        params: { customer_id: item.customer_id },
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
.capitalizeText {
  text-transform: capitalize;
}
</style>
