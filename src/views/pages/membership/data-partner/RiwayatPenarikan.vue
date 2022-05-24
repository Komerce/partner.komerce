<template>
  <section id="cod-data-partner-detail">
    <div v-if="!loadDataAwal">
      <b-card no-body>
        <b-card-body>
          <div class="d-flex align-items-center">
            <b-button
              variant="primary"
              size="sm"
              class="mr-2 btn-custom"
              @click="$router.push(`/data-partner/${$route.params.id}/detail`)"
            >
              <feather-icon
                size="2x"
                icon="ChevronLeftIcon"
              />
            </b-button>
            <h4
              class="text-24-bold"
              style="color: #222222;"
            >
              Riwayat Penarikan
            </h4>
          </div>
          <div class="d-flex justify-content-end">
            <flat-pickr
              v-model="rangeDate"
              class="form-control my-1"
              style="width: 200px;"
              :config="{ mode: 'range'}"
            />
          </div>
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
            <template #cell(status)="data">
              <span
                :class="colorStatus(data.item.status)"
              >
                {{ data.item.status }}
              </span>
            </template>
            <template #cell(nominal)="data">
              <span
                class="colorStatusSuccess"
              >
                {{ data.item.nominal }}
              </span>
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
  // BRow,
  // BCol,
  // BForm,
  // BFormInput,
  // BFormGroup,
  // BFormCheckbox,
  // BListGroup,
  BButton,
  BTable,
  BCard,
  BSpinner,
  BCardBody,
} from 'bootstrap-vue'
import flatPickr from 'vue-flatpickr-component'

export default {
  components: {
    // BRow,
    // BCol,
    // BForm,
    // BFormInput,
    // BFormGroup,
    // BFormCheckbox,
    // BListGroup,
    flatPickr,
    BButton,
    BTable,
    BCard,
    BSpinner,
    BCardBody,
  },
  data() {
    return {
      loadDataAwal: true,
      rangeDate: '2021-09-01 to ',
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
          tanggal: '10 September 2021',
          bank_name: 'Mandiri',
          bank_no: '900001234123',
          nominal: '4.500.000',
          status: 'Disetujui',
        },
        {
          id: 2,
          tanggal: '10 September 2021',
          bank_name: 'Mandiri',
          bank_no: '900001234123',
          nominal: '4.500.000',
          status: 'Sedang direview',
        },
        {
          id: 3,
          tanggal: '10 September 2021',
          bank_name: 'Mandiri',
          bank_no: '900001234123',
          nominal: '4.500.000',
          status: 'Perlu disetujui',
        },
      ],
      fields: [
        {
          key: 'tanggal',
          label: 'Tanggal',
          sortable: true,
        },
        {
          key: 'bank_name',
          label: 'Nama Bank',
          sortable: true,
        },
        {
          key: 'bank_no',
          label: 'Rekening',
        },
        {
          key: 'nominal',
          label: 'Nominal',
          sortable: true,
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
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
    rangeDate: {
      handler(val) {
        // calling api for table and update data table
        if (val.indexOf('to') !== -1) {
          val.split(' to ')
        }
      },
    },
  },
  mounted() {
    //
    this.totalRows = this.items.length
  },
  created() {
    setTimeout(() => {
      this.loadDataAwal = false
    }, 1000)
  },
  methods: {
    submitData() {

    },
    checkAksesLayanan() {
      //
    },
    hideModalAksesLayanan() {
      this.$nextTick(() => {
        this.$bvModal.hide('modal-edit-akseslayanan')
      })
    },
    simpanDataAksesLayanan() {
      // calling api and finish hide modal
      // refresh or watch selected list akses layanan
      this.$nextTick(() => {
        this.$bvModal.hide('modal-edit-akseslayanan')
      })
    },
    colorStatus(status) {
      let classStatusColor = ''
      switch (status) {
        case 'Perlu disetujui':
          // #FF6A3A
          classStatusColor = 'colorStatusPrimary'
          break
        case 'Sedang direview':
          // #FBA63C
          classStatusColor = 'colorStatusWarning'
          break
        case 'Disetujui':
          // #34A770
          classStatusColor = 'colorStatusSuccess'
          break
        default:
          break
      }
      return classStatusColor
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@core/scss/vue/libs/vue-flatpicker.scss';

.btn-custom{
  border-radius: 16px;
  width: 56px;
  height: 56px;

  &--edit{
    width: 178px;
    height: 56px;
    border-radius: 12px;
  }
  &--editakseslayanan{
    height: 56px;

    &btn{
      width: 178px;
      height: 56px;
    }
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
