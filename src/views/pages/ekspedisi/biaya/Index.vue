<template>
  <section id="cod-pendapatan">
    <div v-if="!loadDataAwal">
      <b-card no-body>
        <b-card-body>
          <div class="wrapper__performa">
            <h3
              class="text-24-bold"
              style="color: #222222;"
            >
              Mengatur Besaran Biaya
            </h3>
          </div>
          <div class="wrappertab__content">
            <div class="mt-2">
              <b-table
                striped
                hover
                responsive
                style="color: #222222 !important;"
                :head-variant="'light'"
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
                @filtered="onFiltered"
              >
                <template #thead-top="">
                  <b-tr>
                    <b-th
                      class="font-weight-bolder text-capitalize"
                    >
                      Ekpedisi
                    </b-th>
                    <b-th
                      class="font-weight-bolder text-capitalize"
                      colspan="2"
                    >
                      Dari Ekspedisi
                    </b-th>
                    <b-th
                      class="font-weight-bolder text-capitalize"
                      colspan="2"
                    >
                      Ke Pengguna
                    </b-th>
                    <b-th />
                  </b-tr>
                </template>
                <template #head(shipping_name)="data">
                  <span class="font-weight-bolder text-capitalize">{{ data.label }}</span>
                </template>
                <template #head(cashback_from)="data">
                  <span class="font-weight-bolder text-capitalize">{{ data.label }}</span>
                </template>
                <template #head(service_fee_from)="data">
                  <span class="font-weight-bolder text-capitalize">{{ data.label }}</span>
                </template>
                <template #head(cashback_to)="data">
                  <span class="font-weight-bolder text-capitalize">{{ data.label }}</span>
                </template>
                <template #head(service_fee_to)="data">
                  <span class="font-weight-bolder text-capitalize">{{ data.label }}</span>
                </template>
                <template #cell(editExpedition)="data">
                  <b-button
                    variant="flat-default"
                    tag="router-link"
                    :to="{ name: $route.meta.routeDetail, params: { shipping_id: data.item.shipping_id } }"
                  >
                    <feather-icon icon="EditIcon" />
                  </b-button>
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
              <b-row align-h="between">
                <b-col
                  sm="4"
                  md="4"
                >
                  <b-form-group
                    class="mb-0"
                  >
                    <div
                      style="display: flex;align-items: center;"
                    >
                      <label class="d-inline-block text-sm-left mr-50">Per page</label>
                      <b-form-select
                        id="perPageSelect"
                        v-model="perPage"
                        :options="pageOptions"
                        size="sm"
                        style="width: 65px;"
                      />
                    </div>
                  </b-form-group>
                </b-col>
                <b-col cols="8">
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="right"
                    size="sm"
                    class="my-0"
                  />
                </b-col>
              </b-row>
            </div>

            <b-modal
              id="modal-konfirmasi-arsip"
              ref="modal-konfirmasi-arsip"
              centered
              hide-header-close
              hide-footer
              size="md"
            >
              <div class="text-center">
                <div class="konfirmasiarsip-wrapper">
                  <span
                    class="text-24-bold"
                    style="color: #222222;font-size: 20px;"
                  >
                    Konfirmasi Arsip
                  </span>
                  <span
                    class="text-16-bold mb-2 mt-1"
                    style="color: #222222;"
                  >
                    Apakah kamu yakin untuk memindah data membership ini ke arsip? Jika iya, silahkan klik Lanjutkan!
                  </span>
                  <div class="d-flex justify-content-center">
                    <b-button
                      variant="outline-primary"
                      class="btn-konfirmasi-arsip text-center mr-1"
                      @click="resetModalKonfimasi"
                    >
                      Batal
                    </b-button>
                    <b-button
                      variant="primary"
                      class="btn-konfirmasi-arsip text-center"
                      @click="arsipkanPartner()"
                    >
                      Arsipkan
                    </b-button>
                  </div>
                </div>
              </div>
            </b-modal>
          </div>
          <b-button
            variant="outline-primary"
            size="sm"
            class="btn-icon rounded btn-float-custom"
            @click="$router.push('/biaya-ekspedisi/tambah')"
          >
            <feather-icon icon="PlusIcon" /> TAMBAHKAN EKSPEDISI
          </b-button>
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
  BButton,
  BRow,
  BCol,
  BTh,
  BTr,
  BCard,
  BCardBody,
  BTable,
  BModal,
  BSpinner,
  BFormGroup,
  // BFormInput,
  BFormSelect,
  // BInputGroup,
  BPagination,
  // BInputGroupPrepend,
} from 'bootstrap-vue'
import axioskomsipdev from '@/libs/axioskomsipdev'

export default {
  components: {
    BButton,
    BTable,
    BRow,
    BCol,
    BTh,
    BTr,
    BModal,
    BCard,
    BSpinner,
    BCardBody,
    BFormGroup,
    // BFormInput,
    BFormSelect,
    // BInputGroup,
    BPagination,
    // BInputGroupPrepend,
  },
  data() {
    return {
      search: '',
      modalData: '',
      loadDataAwal: true,
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
          key: 'shipping_name',
          label: 'Nama Ekspedisi',
        },
        {
          key: 'cashback_from',
          label: 'Cashback',
          sortable: true,
        },
        {
          key: 'service_fee_from',
          label: 'Biaya COD',
          sortable: true,
        },
        {
          key: 'cashback_to',
          label: 'Cashback',
        },
        {
          key: 'service_fee_to',
          label: 'Biaya COD',
        },
        {
          key: 'editExpedition',
          label: '',
        },
      ],
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => ({ text: f.label, value: f.key }))
    },
  },
  watch: {
    search: {
      handler() {

      },
    },
  },
  mounted() {
    // Set the initial number of items
    // items set after calling api
    this.totalRows = this.items.length
  },
  created() {
    this.fetchData()
    // check data from API when there is withdrawal pending/process in api
    // get data for series performa expedisi and performa partner
    // get data for select option kurir
    // get data for select option bulan or just hardcode
  },
  methods: {
    async fetchData() {
      const endpoint = '/v1/admin/shipment'
      let getData = null
      getData = axioskomsipdev.get(endpoint)
      getData.then(({ data }) => {
        const parseData = JSON.parse(JSON.stringify(data.data))
        this.items = parseData
        this.totalRows = parseData.length
        this.loadDataAwal = false
      })
        .catch(() => {
          this.loadDataAwal = false
        })
        .finally(() => {
          this.loadDataAwal = false
        })
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    editExpedition(val) {
      this.$router.push(`/biaya-ekspedisi/${val}/edit`)
    },
    arsipkanBtnPartner(val) {
      this.modalData = val
    },
    arsipkanPartner() {
      this.$nextTick(() => {
        this.$bvModal.hide('modal-konfirmasi-arsip')
      })
    },
    resetModalKonfimasi() {
      this.$nextTick(() => {
        this.$bvModal.hide('modal-konfirmasi-arsip')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.wrappertab__content{
  display: grid;
}
.konfirmasiarsip-wrapper{
  display: grid;
  margin: 0px 16px 52px;
  justify-items: center;
  grid-gap: 20px 0px;
}
.btn-konfirmasi-arsip{
  text-align: center;
  width: 178px;
  height: 56px;
  border-radius: 12px;
}
.btn-float-custom{
  position: fixed;
  right: 30px;
  bottom: 20px;
}
</style>
