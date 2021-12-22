<template>
  <section id="cod-pencairan">
    <div v-if="!loadDataAwal">
      <b-card no-body>
        <b-card-header class="custom-card-header">
          <b-row style="width: 100%;">
            <b-col
              md="12"
              class="dashboard-report-wrapper"
            >
              <h3 class="card-title">
                Antrian Penarikan
              </h3>
            </b-col>
          </b-row>
        </b-card-header>

        <b-card-body>
          <b-row>
            <b-col lg="3" />
            <b-col lg="3" />
            <b-col lg="3" />
            <b-col
              sm="12"
              lg="3"
              class="d-flex"
            >
              <b-input-group class="input-group-merge mr-1">
                <b-input-group-prepend is-text>
                  <feather-icon icon="SearchIcon" />
                </b-input-group-prepend>
                <b-form-input
                  id="field-search-for-tbl"
                  v-model="searchTerm"
                  placeholder="Search"
                />
              </b-input-group>
              <b-dropdown
                id="dropdown-search-tbl"
                ref="dropdownFilter"
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
                  <b-form-group
                    v-model="filterDropdown.partner_name"
                    label="Nama"
                    label-for="dropdown-form-nama"
                    @submit.stop.prevent
                  >
                    <b-form-input
                      id="dropdown-form-nama"
                      size="lg"
                      placeholder="Masukkan Nama"
                      @input="onChangeParter"
                    />
                  </b-form-group>

                  <b-form-group
                    label="Status"
                    label-for="dropdown-form-status"
                  >
                    <b-form-select
                      id="dropdown-form-status"
                      v-model="filterDropdown.selectedStatus"
                      size="lg"
                      class="mb-2"
                      :options="optionsStatus"
                      placeholder="Pilih Status"
                    />
                  </b-form-group>
                  <div class="d-flex justify-content-end">
                    <b-button
                      variant="outline-primary"
                      size="lg"
                      class="mr-2"
                      @click="onClickResetFilterDropdown"
                    >
                      Reset
                    </b-button>
                    <b-button
                      variant="primary"
                      size="lg"
                      @click="onClickTerapkanFilterDropdown"
                    >
                      Terapkan
                    </b-button>
                  </div>
                </b-dropdown-form>
              </b-dropdown>
            </b-col>
            <b-col
              lg="12"
              class="mt-2"
            >
              <b-table
                id="my-table"
                striped
                hover
                responsive
                :per-page="perPage"
                :current-page="currentPage"
                :items="items"
                :busy="isLoadTable"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                :filter="filter"
                :filter-included-fields="filterOn"
                @row-clicked="showDetails"
                @filtered="onFiltered"
              >
                <!-- A virtual composite column -->
                <template #cell(detailName)="data">
                  <b>
                    {{ data.item.partner_name }}
                  </b>
                  <br>
                  <span
                    class="text-secondary"
                    style="color: #222222;"
                  >
                    {{ data.item.partner_email }}
                  </span>
                </template>
                <template #cell(bankAccount)="data">
                  <span
                    class="text-secondary"
                    style="color: #222222;"
                  >
                    {{ data.item.bank_account_no }}
                  </span>
                  <br>
                  <span
                    class="text-secondary"
                    style="color: #222222;"
                  >
                    {{ data.item.bank_account_name }}
                  </span>
                </template>
                <template #cell(nominalRek)="data">
                  <div style="text-align: right;">
                    <span
                      class="text-secondary"
                      style="color: #222222;"
                    >
                      {{ data.item.nominal | formatRupiah }}
                    </span>
                  </div>
                </template>
                <template #cell(statusAccount)="data">
                  <div>
                    <b-link
                      :to="{ name: 'cod-rincian-penarikan-saldo', params: { slug: data.item.withdrawal_id } }"
                    >
                      <span
                        :class="colorStatus(data.item.status)"
                      >
                        {{ statusToIndo(data.item.status) }}
                      </span>
                    </b-link>
                  </div>
                </template>
                <template #table-busy>
                  <div class="text-center text-danger my-2">
                    <b-spinner
                      class="align-middle"
                    />
                    <strong>Loading...</strong>
                  </div>
                </template>
              </b-table>
            </b-col>
            <b-col
              cols="3"
            >
              <b-form-group
                class="mb-0"
              >
                <label class="d-inline-block text-sm-left mr-50">Per page</label>
                <b-form-select
                  id="perPageSelect"
                  v-model="perPage"
                  size="sm"
                  :options="pageOptions"
                  class="w-50"
                />
              </b-form-group>
            </b-col>
            <b-col
              cols="9"
            >
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                align="right"
                size="sm"
                class="my-0"
                aria-controls="my-table"
              />
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </div>

    <div
      v-else
      class="text-center"
    >
      <b-spinner
        variant="primary"
        label="Text Centered"
      />
    </div>
  </section>
</template>

<script>
import {
  BRow,
  BCol,
  BCard,
  BLink,
  BTable,
  BFormInput,
  BFormGroup,
  BPagination,
  BInputGroup,
  BDropdownForm,
  BInputGroupPrepend,
  BDropdown,
  BButton,
  BSpinner,
  BCardBody,
  BCardHeader,
  BFormSelect,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

import { kFormatter } from '@core/utils/filter'
import axioskomsipdev from '@/libs/axioskomsipdev'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BLink,
    BFormInput,
    BTable,
    BPagination,
    BInputGroup,
    BFormGroup,
    BDropdownForm,
    BInputGroupPrepend,
    BDropdown,
    BButton,
    BSpinner,
    BCardBody,
    BFormSelect,
    BCardHeader,
  },
  filters: {
    formatRupiah: val => {
      if (!val) return val
      const dataRp = new Intl.NumberFormat('id-ID').format(val)
      return dataRp
    },
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      alertshow: false,
      loadDataAwal: true,
      searchTerm: '',
      queryParterName: '',
      queryStatuse: '',
      filterDropdown: {
        partner_name: '',
        selectedStatus: null,
      },
      optionsStatus: [
        { value: null, text: 'Pilih Status', disabled: true },
        { value: 'completed', text: 'Disetujui' },
        { value: 'requested', text: 'Perlu Disetujui' },
        // { value: 'canceled', text: 'Canceled' },
        { value: 'on_review', text: 'Sedang Direview' },
        { value: 'rejected', text: 'Ditolak' },
      ],
      rowsTable: [],
      isLoadTable: false,
      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      items: [],
      fields: [
        // A virtual column made up from two fields
        {
          key: 'detailName',
          label: 'Nama',
        },
        {
          key: 'bank_name',
          label: 'Nama Bank',
        },
        {
          key: 'bankAccount',
          label: 'No Rekening',
        },
        {
          key: 'nominalRek',
          label: 'Nominal',
        },
        {
          key: 'statusAccount',
          label: 'Status',
        },
      ],
    }
  },
  computed: {
    //
  },
  watch: {
    searchTerm: {
      handler() {
        this.fetchData({ partner_name: this.searchTerm })
      },
    },
  },
  mounted() {
    this.fetchData()
    //
  },
  created() {
    //
  },
  methods: {
    showDetails(item) {
      console.log(item)
      this.$router.push({ name: 'cod-rincian-penarikan-saldo', params: { slug: item.withdrawal_id } })
    },
    onChangeParter(value) {
      this.queryParterName = value
    },
    statusToIndo(status) {
      let newStatus
      if (status === 'completed') {
        newStatus = 'Disetujui'
      } else if (status === 'requested') {
        newStatus = 'Perlu Disetujui'
      } else if (status === 'on_review') {
        newStatus = 'Sedang Direview'
      } else if (status === 'rejected') {
        newStatus = 'Ditolak'
      } else if (status === 'canceled') {
        newStatus = 'DiBatalkan'
      } else {
        newStatus = '-'
      }
      return newStatus
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    kFormatter,
    onClickResetFilterDropdown() {
      this.filterDropdown = {
        partner_name: '',
        selectedStatus: null,
      }
    },
    onClickTerapkanFilterDropdown() {
      this.fetchData(this.filterDropdown.selectedStatus, this.queryParterName)
      // Close the dropdown and (by passing true) return focus to the toggle button
      this.$refs.dropdownFilter.hide(true)
    },
    colorStatus(status) {
      let classStatusColor = ''
      switch (status) {
        case 'on_review':
          // #FBA63C
          classStatusColor = 'colorStatusWarning'
          break
        case 'rejected':
          // #FBA63C
          classStatusColor = 'colorStatusWarning'
          break
        case 'completed':
          // #34A770
          classStatusColor = 'colorStatusSuccess'
          break
        default:
          // #FF6A3A
          classStatusColor = 'colorStatusPrimary'
          break
      }
      return classStatusColor
    },
    fetchData(status, parterName) {
      // change this endpoint
      const endpoint = '/v1/admin/withdrawal/list'
      let getData = null

      if (status || parterName) {
        getData = axioskomsipdev.get(endpoint, { params: { status, partner_name: parterName } })
      } else {
        getData = axioskomsipdev.get(endpoint)
      }

      getData.then(({ data }) => {
        const parseData = JSON.parse(JSON.stringify(data.data))
        this.items = parseData
        this.totalRows = parseData.length
      })
        .catch(e => {
          console.log('error', e)
        })
        .finally(() => {
          this.loadDataAwal = false
        })
      // this.$nextTick(function () {
      //   console.log('338 :', this.row)
      // })
    },
    toPage(params = '') {
      console.log(params)
      // make sure to pass params on router base for changing page
      this.$router.push('/')
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-custom-topcodnoncod{
  @media only screen and (max-width: 390px) {
    padding: 10px;
  }
}
.colorStatusPrimary{
  color: #FF6A3A;
}
.colorStatusSuccess{
  color: #34A770;
}
.colorStatusWarning{
  color: #FBA63C;
}
</style>
