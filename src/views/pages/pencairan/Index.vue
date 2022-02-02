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
                  @input="searching()"
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
                    label="Nama"
                    label-for="dropdown-form-nama"
                  >
                    <b-form-input
                      id="dropdown-form-nama"
                      v-model="nameFilter"
                      size="lg"
                      placeholder="Masukkan Nama"
                    />
                  </b-form-group>

                  <b-form-group
                    label="Status"
                    label-for="dropdown-form-status"
                  >
                    <b-form-select
                      id="dropdown-form-status"
                      v-model="statusFilter"
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
                      @click="resetFormFilter()"
                    >
                      Reset
                    </b-button>
                    <b-button
                      variant="primary"
                      size="lg"
                      @click="filterDropdown()"
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
              <div class="d-flex justify-between ">
                <div>
                  <span class="mr-1">List per halaman</span>
                  <b-button
                    v-for="page in pageOptions"
                    :key="page"
                    :variant="page === perPage ? 'primary' : 'light'"
                    size="sm"
                    class="btnPage"
                    @click="setPage(page)"
                  >
                    {{ page }}
                  </b-button>
                </div>
                <b-col
                  cols=""
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
              </div>
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
      nameFilter: null,
      statusFilter: null,
      pageOptions: [50, 100, 200],
      optionsStatus: [
        { value: null, text: 'Pilih Status', disabled: true },
        { value: 'completed', text: 'Disetujui' },
        { value: 'requested', text: 'Perlu Disetujui' },
        { value: 'on_review', text: 'Sedang Direview' },
        { value: 'rejected', text: 'Ditolak' },
      ],
      rowsTable: [],
      isLoadTable: false,
      perPage: 50,
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: true,
      sortDirection: 'desc',
      filter: null,
      filterOn: [],
      items: [],
      fields: [
        {
          key: 'created_at',
          label: 'Tanggal',
        },
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
  mounted() {
    this.fetchData()
  },
  methods: {
    resetFormFilter() {
      this.statusFilter = null
    },
    searching() {
      this.fetchData(this.searchTerm, null)
    },
    filterDropdown() {
      this.fetchData(this.nameFilter, this.statusFilter)
    },
    showDetails(item) {
      this.$router.push({ name: 'cod-rincian-penarikan-saldo', params: { slug: item.withdrawal_id } })
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
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    colorStatus(status) {
      let classStatusColor = ''
      switch (status) {
        case 'on_review':
          classStatusColor = 'colorStatusWarning'
          break
        case 'rejected':
          classStatusColor = 'colorStatusWarning'
          break
        case 'completed':
          classStatusColor = 'colorStatusSuccess'
          break
        default:
          classStatusColor = 'colorStatusPrimary'
          break
      }
      return classStatusColor
    },
    fetchData(search, status) {
      this.loading = true
      axioskomsipdev.get('/v1/admin/withdrawal/list', {
        params: { status, search },
      }).then(response => {
        const { data } = response.data
        this.items = [...data].sort((a, b) => b.withdrawal_id - a.withdrawal_id)
        this.totalRows = data.length
      })
        .catch(e => {
          console.log('error', e)
        })
        .finally(() => {
          this.loadDataAwal = false
        })
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
