<template>
  <div>
    <b-row>
      <b-col
        md="3"
        class="mb-2 ml-2"
      >
        <label for="">Pilih Partner</label>
        <v-select
          v-model="partner"
          label="label"
          :options="partnerItems"
          :filterable="false"
          placeholder="Ketik untuk mencari..."
          @search="onSearchPartner"
        >
          <li
            v-if="hasMorePartner"
            slot="list-footer"
            class="vs__dropdown-option vs__dropdown-option--disabled"
          >
            <feather-icon
              icon="MoreHorizontalIcon"
              size="16"
            />
          </li>
        </v-select>
      </b-col>
      <b-col
        md="3"
        class="mb-2"
      >
        <label for="">Pilih Status</label>
        <v-select
          v-model="status"
          multiple
          label="label"
          :options="statusOptions"
          placeholder="Ketik untuk mencari..."
        />
      </b-col>
      <b-col
        md="3"
        class="mb-2"
      >
        <label for="">Pilih Periode</label>
        <flat-pickr
          v-model="invoicePeriod"
          class="form-control"
          :config="{
            altInput: true,
            altFormat: 'F Y',
            dateFormat: 'Y-m',
            ...configs.monthSelect,
          }"
        />
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
        responsive
        :fields="fields"
        :items="items"
        class="mb-0"
        empty-text="Tidak ada data untuk ditampilkan."
        show-empty
      >
        <template #cell(Phone)="data">
          <span class="text-nowrap">
            {{ data.value }}
          </span>
        </template>

        <!-- Optional default data cell scoped slot -->
        <template #cell()="data">
          {{ data.value }}
        </template>

        <template #cell(draft)="data">
          <b-avatar
            v-if="data.item.status >= 0"
            variant="success"
          >
            <feather-icon icon="CheckIcon" />
          </b-avatar>
        </template>

        <template #cell(published)="data">
          <b-avatar
            v-if="data.item.status >= 1"
            variant="success"
          >
            <feather-icon icon="CheckIcon" />
          </b-avatar>
        </template>

        <template #cell(action)="data">
          <b-row>
            <b-button
              tag="router-link"
              :to="{
                name: $route.meta.routeShow,
                params: { id: data.item.id },
              }"
              class="btn-icon mr-50"
              size="sm"
              variant="flat-warning"
            >
              <feather-icon icon="EditIcon" />
            </b-button>
            <b-button
              v-if="data.item.status == 0"
              class="btn-icon mr-50"
              size="sm"
              variant="flat-danger"
              @click="confirmDelete(data.item.id)"
            >
              <feather-icon icon="TrashIcon" />
            </b-button>
          </b-row>
        </template>
        <template #empty="">
          <div class="text-center">
            <b>Tidak ada data untuk ditampilkan.</b>
          </div>
        </template>
      </b-table>
      <b-row>
        <b-col
          md="12"
          class="ml-1 my-2"
        >
          <h4 class="text-success">
            Total Nominal
          </h4>
          <b>{{ totalAmount | rupiah }}</b>
        </b-col>
        <b-col
          md="12"
          class="ml-1 my-2"
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            first-number
            last-number
            prev-class="prev-item"
            next-class="next-item"
            class="mb-0"
          >
            <template #prev-text>
              <feather-icon
                icon="ChevronLeftIcon"
                size="18"
              />
            </template>
            <template #next-text>
              <feather-icon
                icon="ChevronRightIcon"
                size="18"
              />
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </b-overlay>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BTable,
  BButton,
  BOverlay,
  BAvatar,
  BPagination,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import MonthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import filters from '@/libs/filters'

export default {
  components: {
    BCol,
    BRow,
    BTable,
    BButton,
    BOverlay,
    BAvatar,
    BPagination,

    vSelect,
    flatPickr,
  },
  filters: { rupiah: filters.rupiah },
  data() {
    const statusOptions = [
      {
        key: 0,
        label: 'Draft',
      },
      {
        key: 1,
        label: 'Publish',
      },
    ]
    const currentDate = new Date()
    return {
      loading: false,
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      fields: [
        {
          key: 'user_to',
          label: 'Partner',
          formatter: val => `${val.no_partner} - ${val.full_name}`,
        },
        {
          key: 'invoice_km_id',
          label: 'No. Invoice',
        },
        {
          key: 'invoice_period',
          label: 'Tanggal',
        },
        {
          key: 'total_items',
          label: 'Jumlah Talent',
        },
        {
          key: 'amount',
          label: 'Nominal',
          formatter: val => filters.rupiah(parseInt(val, 0)),
        },
        {
          key: 'draft',
          label: 'Draft',
        },
        {
          key: 'published',
          label: 'Published',
        },
        {
          key: 'action',
          label: 'Aksi',
        },
      ],
      items: [],
      totalAmount: 0,

      partnerItems: [],
      hasMorePartner: false,
      partner: '',

      statusOptions,
      status: statusOptions,

      invoicePeriod: `${currentDate.getFullYear()}-${currentDate.getMonth()
        + 1}`,
      configs: {
        monthSelect: {
          plugins: [
            new MonthSelectPlugin({
              shorthand: true,
              dateFormat: 'Y-m',
            }),
          ],
        },
      },
    }
  },
  watch: {
    currentPage() {
      this.getData()
    },
    partner() {
      this.getData()
    },
    status() {
      this.getData()
    },
    invoicePeriod() {
      this.getData()
    },
  },
  mounted() {
    this.loadPartners()
    this.getData()
  },
  methods: {
    onSearchPartner(search, loading) {
      if (search.length) {
        this.searchPartner(loading, search, this)
      }
    },
    searchPartner: _.debounce((loading, search, that) => {
      loading(true)
      that.loadPartners(search).finally(() => loading(false))
    }, 500),
    loadPartners(search) {
      const key = /^-?\d+$/.test(search) ? 'no_partner' : 'name'

      return this.$http
        .get('/user/partner/pagination', {
          params: {
            [key]: search,
            page: 1,
            limit: 5,
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data.data
          for (let i = 0; i < data.length; i += 1) {
            data[i].label = `${data[i].no_partner} - ${data[i].full_name}`
          }
          this.partnerItems = data
          this.hasMorePartner = response.data.data.total > this.partnerItems.length
        })
    },
    async getData() {
      this.loading = true
      const userRequesterId = this.$store.state.auth.userData.role_name !== 'Admin'
        ? this.$store.state.auth.userData.id
        : ''
      const userToId = this.partner?.id || ''
      const status = this.status.map(val => val.key).join(',')
      const invoicePeriod = this.invoicePeriod ? `${this.invoicePeriod}-01` : ''

      this.$http
        .get(
          `/invoice?page=${this.currentPage}&limit=${this.perPage}&invoice_type=2&status=${status}&user_requester_id=${userRequesterId}&user_to_id=${userToId}&invoice_period=${invoicePeriod}`,
        )
        .then(res => {
          const { data } = res.data
          this.items = data.data
          this.totalRows = data.total
          this.totalAmount = data.total_amount
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    confirmDelete(data) {
      this.$swal({
        title: 'Anda yakin?',
        text:
          'Hapus satu Invoice Admin dari tabel. Aksi ini tidak dapat dibatalkan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.remove(data)
        }
      })
    },
    async remove(id) {
      this.loading = true
      this.$http({
        method: 'delete',
        url: `/invoice/admin/deleteDraft/${id}`,
      })
        .then(() => {
          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Success',
                text: 'Draft Invoice Admin Berhasil Dihapus',
                variant: 'success',
                attachment: 'CheckIcon',
              },
            },
            { timeout: 2500 },
          )
          this.getData()
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
