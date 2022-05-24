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
              Data Arsip Partner
            </h3>
          </div>
          <div class="wrappertab__content">
            <div
              class="d-flex justify-content-end"
            >
              <!-- filter -->
              <b-form-group class="mb-0">
                <b-input-group
                  class="input-group-merge"
                >
                  <b-input-group-prepend is-text>
                    <feather-icon icon="SearchIcon" />
                  </b-input-group-prepend>
                  <b-form-input
                    id="filterSearch"
                    v-model="search"
                    type="search"
                    placeholder="Search..."
                    debounce="500"
                    @input="onChange"
                  />
                </b-input-group>
              </b-form-group>
            </div>
            <div class="mt-2">
              <b-table
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
                @filtered="onFiltered"
              >
                <!-- A virtual composite column -->
                <template #cell(detailName)="data">
                  <b>
                    {{ data.item.name }}
                  </b>
                  <br>
                  <span
                    class="text-secondary"
                    style="color: #222222;"
                  >
                    {{ data.item.email }}
                  </span>
                </template>
                <template #cell(servicesCustom)="data">
                  <div class="d-flex">
                    <div
                      v-for="(itm,idx) in data.item.services"
                      :key="idx"
                    >
                      <img
                        :src="require('@/assets/images/logo/logo.png')"
                        :title="itm"
                        alt="logo"
                        width="29px"
                        height="29px"
                        style="border-radius: 15px;"
                      >
                    </div>
                  </div>
                </template>
                <template #cell(detailPartner)="data">
                  <b-button
                    variant="flat-info"
                    @click="detailPartner(data.item.id)"
                  >
                    Lihat Detail...
                  </b-button>
                </template>
                <!-- <template #cell(arsipkanPartner)="data">
                  <b-button
                    v-b-modal.modal-konfirmasi-arsip
                    variant="flat-default"
                    @click="arsipkanBtnPartner(data.item.id)"
                  >
                    <feather-icon icon="ArchiveIcon" />
                  </b-button>
                </template> -->
                <template #table-busy>
                  <div class="text-center text-danger my-2">
                    <b-spinner
                      class="align-middle"
                    />
                    <strong>Loading...</strong>
                  </div>
                </template>
              </b-table>
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
  BCard,
  BCardBody,
  BTable,
  BModal,
  BSpinner,
  BFormGroup,
  BFormInput,
  BInputGroup,
  BInputGroupPrepend,
} from 'bootstrap-vue'

export default {
  components: {
    BButton,
    BTable,
    BModal,
    BCard,
    BSpinner,
    BCardBody,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BInputGroupPrepend,
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
      items: [
        {
          id: 1,
          name: 'Skylar Korsgaard',
          email: 'hallobusiness@gmail.com',
          username: 'Hanifsaja',
          no_hp: 'Rp 27.000.000',
          services: [1, 2, 3],
        },
        {
          id: 2,
          name: 'Skylar Korsgaard',
          email: 'hallobusiness@gmail.com',
          username: 'Hanifsaja',
          no_hp: 'Rp 27.000.000',
          services: [1, 2, 3],
        },
      ],
      fields: [
        // A virtual column made up from two fields
        {
          key: 'detailName',
          label: 'Nama',
        },
        {
          key: 'username',
          label: 'Username',
          sortable: true,
        },
        {
          key: 'no_hp',
          label: 'No Handphone',
          sortable: true,
        },
        {
          key: 'servicesCustom',
          label: 'Layanan yang digunakan',
        },
        {
          key: 'detailPartner',
          label: '',
        },
        {
          key: 'arsipkanPartner',
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
        // calling api
      },
    },
  },
  mounted() {
    // Set the initial number of items
    // items set after calling api
    this.totalRows = this.items.length
  },
  created() {
    setTimeout(() => {
      this.loadDataAwal = false
    }, 1000)
    this.fetchData()
    // check data from API when there is withdrawal pending/process in api
    // get data for series performa expedisi and performa partner
    // get data for select option kurir
    // get data for select option bulan or just hardcode
  },
  methods: {
    async fetchData() {
      // change this endpoint
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    onChange() {
      //
    },
    detailPartner(val) {
      // to page validasi exact partner
      this.$router.push(`/data-partner/${val}/detail`)
    },
    arsipkanBtnPartner(val) {
      this.modalData = val
    },
    arsipkanPartner() {
      this.$nextTick(() => {
        this.$bvModal.hide('modal-konfirmasi-arsip')
      })
      // refresh tabel
      // fetchData
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
</style>
