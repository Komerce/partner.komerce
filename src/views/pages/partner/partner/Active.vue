<template>
  <b-row class="mt-n1">
    <b-col cols="12">
      <div class="card-header d-none">
        <div class="d-flex justify-content-start flex-wrap">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            size="sm"
            class="mr-50"
            @click="toggleModal"
          >
            <feather-icon
              icon="FilterIcon"
              class="mr-50"
            />
            Filter
          </b-button>

          <!-- filter -->
          <b-form-group
            class="mb-0"
          >
            <b-input-group
              class="input-group-merge"
              size="sm"
            >
              <b-input-group-prepend is-text>
                <feather-icon icon="SearchIcon" />
              </b-input-group-prepend>
              <b-form-input
                id="filterInput"
                v-model="filter"
                type="search"
                placeholder="Cari..."
                debounce="500"
              />
            </b-input-group>
          </b-form-group>
        </div>

        <!-- Card Actions -->
        <b-card-actions-container
          class="mr-md-50"
          :available-actions="['refresh']"
          @refresh="refreshTable"
        />
      </div>

      <!-- Collapse filter -->
      <div class="dropdown-filter">
        <!-- toggle button -->
        <div class="d-flex">
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            v-b-toggle.collapse-1
            variant="primary"
            size="sm"
            class="mr-50"
          >
            <feather-icon
              icon="FilterIcon"
              class="mr-50"
            />
            Filter
          </b-button>

          <b-form-group
            class="mb-0"
          >
            <b-input-group
              class="input-group-merge"
              size="sm"
            >
              <b-input-group-prepend is-text>
                <feather-icon icon="SearchIcon" />
              </b-input-group-prepend>
              <b-form-input
                id="filterInput"
                v-model="filter"
                type="search"
                placeholder="Cari..."
                debounce="500"
              />
            </b-input-group>
          </b-form-group>
          <b-col
            class="text-right sortir-talent"
          >
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              v-b-toggle.collapse-3
              size="sm"
              variant="primary"
              class="btn-sortir"
            >
              Sortir
            </b-button>
          </b-col>
        </div>

        <b-row>
          <b-col>
            <b-collapse
              id="collapse-1"
              class="mt-2"
            >
              <b-card class="mb-0">
                <!-- filter dropdown -->
                <div>
                  <div>
                    <b-form
                      ref="form"
                    >
                      <!-- Row Loop -->
                      <b-row
                        ref="row"
                      >
                        <!-- Sektor bisnis -->
                        <b-col md="6">
                          <b-form-group
                            label="Sektor Bisnis"
                          >
                            <validation-provider
                              #default="{ errors }"
                              name="Sektor bisnis"
                            >
                              <v-select
                                v-model="filterPartnerCategoryId"
                                label="partner_category_name"
                                :reduce="option => option.id"
                                :options="filterPartnerCategoryItems"
                                :state="errors.length > 0 ? false:null"
                                transition=""
                                placeholder="Ketik untuk mencari..."
                                @input="filterByPartnerCategory"
                              />
                              <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                          </b-form-group>
                        </b-col>

                        <!-- Leader -->
                        <b-col md="6">
                          <b-form-group
                            label="Leader"
                          >
                            <validation-provider
                              #default="{ errors }"
                              name="Leader"
                            >
                              <v-select
                                v-model="filterStaffId"
                                label="full_name"
                                :reduce="option => option.id"
                                :options="filterStaffItems"
                                :state="errors.length > 0 ? false:null"
                                :filterable="false"
                                transition=""
                                placeholder="Ketik untuk mencari..."
                                @search="onSearchStaff"
                                @input="filterByLeader"
                              >
                                <li
                                  v-if="hasMoreFilterStaff"
                                  slot="list-footer"
                                  class="vs__dropdown-option vs__dropdown-option--disabled"
                                >
                                  <feather-icon
                                    icon="MoreHorizontalIcon"
                                    size="16"
                                  />
                                </li>
                              </v-select>
                              <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </b-form>
                  </div>
                </div>
                <!-- End Filter dropdown -->
              </b-card>
            </b-collapse>
          </b-col>
          <b-col
            class="sortir-talent"
          >
            <b-collapse
              id="collapse-3"
              class="mt-2"
            >
              <b-card class="mb-0">
                <div>
                  <div>
                    <b-form
                      ref="form"
                    >
                      <!-- Row Loop -->
                      <b-row
                        ref="row"
                      >
                        <!-- Bakat dipekerjakan -->
                        <b-col md="5">
                          <validation-observer>
                            <b-form-group
                              label="Bakat di Pekerjakan"
                            >
                              <validation-provider
                                #default="{ errors }"
                                name="Bakat di Pekerjakan"
                              >
                                <v-select
                                  v-model="fieldSortirBakatDipekerjakan"
                                  :options="bakatDipekerjakanOptions"
                                  label="title"
                                  :state="errors.length > 0 ? false:null"
                                  @input="sortirBakatDipekerjakan"
                                />
                              </validation-provider>
                            </b-form-group>
                          </validation-observer>
                        </b-col>

                        <!-- Durasi -->
                        <b-col md="5">
                          <validation-observer>
                            <b-form-group
                              label="Durasi"
                            >
                              <validation-provider
                                #default="{ errors }"
                                name="Durasi"
                              >
                                <v-select
                                  v-model="fieldSortirDurasi"
                                  :options="durasiOptions"
                                  :state="errors.length > 0 ? false:null"
                                  label="title"
                                  @input="sortirDurasi"
                                />
                              </validation-provider>
                            </b-form-group>
                          </validation-observer>
                        </b-col>
                      </b-row>
                    </b-form>
                  </div>
                </div>
              </b-card>
            </b-collapse>
          </b-col>
        </b-row>

        <!-- sortir mobile -->
        <b-row class="justify-content-end sortir-talent-mobile">
          <b-col md="6">
            <b-col class="text-right">
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                v-b-toggle.collapse-3
                size="sm"
                variant="primary"
                class="btn-sortir"
              >
                Sortir
              </b-button>
            </b-col>
            <b-collapse
              id="collapse-3"
              class="mt-2"
            >
              <b-card class="mb-0">
                <div>
                  <div>
                    <b-form
                      ref="form"
                    >
                      <!-- Row Loop -->
                      <b-row
                        ref="row"
                      >
                        <!-- Bakat dipekerjakan -->
                        <b-col md="5">
                          <validation-observer>
                            <b-form-group
                              label="Bakat di Pekerjakan"
                            >
                              <validation-provider
                                #default="{ errors }"
                                name="Bakat di Pekerjakan"
                              >
                                <v-select
                                  v-model="fieldSortirBakatDipekerjakan"
                                  :options="bakatDipekerjakanOptions"
                                  label="title"
                                  :state="errors.length > 0 ? false:null"
                                  @input="sortirBakatDipekerjakan"
                                />
                              </validation-provider>
                            </b-form-group>
                          </validation-observer>
                        </b-col>

                        <!-- Durasi -->
                        <b-col md="5">
                          <validation-observer>
                            <b-form-group
                              label="Durasi"
                            >
                              <validation-provider
                                #default="{ errors }"
                                name="Durasi"
                              >
                                <v-select
                                  v-model="fieldSortirDurasi"
                                  :options="durasiOptions"
                                  :state="errors.length > 0 ? false:null"
                                  label="title"
                                  @input="sortirDurasi"
                                />
                              </validation-provider>
                            </b-form-group>
                          </validation-observer>
                        </b-col>
                      </b-row>
                    </b-form>
                  </div>
                </div>
              </b-card>
            </b-collapse>
          </b-col>
        </b-row>
        <!-- end sortir mobile -->
      </div>

      <b-overlay
        variant="light"
        :show="loading"
        spinner-variant="primary"
        blur="0"
        opacity=".5"
        rounded="sm"
      >
        <b-table
          ref="table"
          striped
          hover
          responsive
          class="position-relative"
          empty-text="Tidak ada data untuk ditampilkan."
          :empty-filtered-text="`Tidak ada hasil untuk kata kunci '${filter}'.`"

          :show-empty="!loading"
          :per-page="perPage"
          :current-page="currentPage"
          :items="tableProvider"
          :fields="tableFields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          :filter="filter"
          :filter-included-fields="filterOn"
          :tbody-tr-class="rowClass"
          :busy.sync="loading"
        >
          <template #cell(full_name)="data">
            <b-form-row class="flex-nowrap">
              <b-col
                v-if="data.item.photo_profile_url !== undefined"
                cols="auto"
              >
                <b-avatar
                  :src="data.item.photo_profile_url"
                  class="mr-50"
                />
              </b-col>
              <b-col class="d-flex align-items-center">
                {{ data.value }}
              </b-col>
            </b-form-row>
          </template>
          <template
            #cell()="data"
          >
            <b-badge
              v-if="data.field.badge"
              :variant="data.field.badge[1][data.value]"
            >
              {{ data.field.badge[0][data.value] }}
            </b-badge>
            <span v-else>{{ data.value }}</span>
          </template>
          <template #cell(action)="data">
            <span
              v-if="isDeleted(data.item.id)"
              class="text-danger"
            >Deleted</span>
            <div v-else>
              <b-button
                v-if="hasActionDelete"
                class="btn-icon mr-50"
                size="sm"
                variant="flat-info"
                @click="setupModal(data)"
              >
                <feather-icon
                  icon="EyeIcon"
                />
              </b-button>
              <b-button
                v-if="hasActionEdit"
                tag="router-link"
                :to="{ name: $route.meta.routeEdit, params: { id: data.item.id } }"
                class="btn-icon mr-50"
                size="sm"
                variant="flat-warning"
              >
                <feather-icon
                  icon="EditIcon"
                />
              </b-button>
              <b-button
                v-if="hasActionDelete"
                class="btn-icon"
                size="sm"
                variant="flat-danger"
                @click="confirmDelete(data)"
              >
                <feather-icon
                  icon="Trash2Icon"
                />
              </b-button>
            </div>
          </template>
        </b-table>
      </b-overlay>

      <b-card-body class="d-flex justify-content-between flex-wrap pt-0">
        <!-- page length -->
        <b-form-group
          label="Per Page"
          label-cols="6"
          label-align="left"
          label-size="sm"
          label-for="sortBySelect"
          class="text-nowrap mb-md-0 mr-1"
        >
          <b-form-select
            id="perPageSelect"
            v-model="perPage"
            size="sm"
            inline
            :options="pageOptions"
          />
        </b-form-group>

        <!-- pagination -->
        <div>
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
        </div>
      </b-card-body>

      <b-modal
        id="form-modal"
        ref="formModal"
        title="Filter"
        centered
      >
        <validation-observer ref="formRules">
          <b-form @submit.stop.prevent="submitFilter">
            <b-col md="12">
              <b-form-group
                label="Sektor bisnis"
                label-cols-md="12"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Sektor bisnis"
                >
                  <v-select
                    v-model="filterPartnerCategoryId"
                    label="partner_category_name"
                    :reduce="option => option.id"
                    :options="filterPartnerCategoryItems"
                    :state="errors.length > 0 ? false:null"
                    transition=""
                    placeholder="Ketik untuk mencari..."
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Leader"
                label-cols-md="12"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Leader"
                >
                  <v-select
                    v-model="filterStaffId"
                    label="full_name"
                    :reduce="option => option.id"
                    :options="filterStaffItems"
                    :state="errors.length > 0 ? false:null"
                    :filterable="false"
                    transition=""
                    placeholder="Ketik untuk mencari..."
                    @search="onSearchStaff"
                  >
                    <li
                      v-if="hasMoreFilterStaff"
                      slot="list-footer"
                      class="vs__dropdown-option vs__dropdown-option--disabled"
                    >
                      <feather-icon
                        icon="MoreHorizontalIcon"
                        size="16"
                      />
                    </li>
                  </v-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-form>
        </validation-observer>

        <template #modal-footer>
          <b-form-row class="align-items-center w-100">
            <b-col md>
              <b-button
                size="sm"
                variant="flat-danger"
                class="px-50 ml-n50"
                @click="resetForm"
              >
                Reset Filter
              </b-button>
            </b-col>
            <b-col cols="auto">
              <b-button
                variant="light"
                @click="toggleModal"
              >
                Cancel
              </b-button>
            </b-col>
            <b-col cols="auto">
              <b-button
                variant="primary"
                @click="handleOk"
              >
                Terapkan
              </b-button>
            </b-col>
          </b-form-row>
        </template>
      </b-modal>

      <b-modal
        id="detail-modal"
        ref="detailModal"
        title="Detail Partner"
        body-class="p-0"
        centered
        ok-only
        ok-title="Tutup"
      >
        <partner-form :partner-id="partnerId" />
      </b-modal>
    </b-col>
  </b-row>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Ripple from 'vue-ripple-directive'
import {
  BRow,
  BCol,
  BCard,
  BCollapse,
  VBToggle,
  BButton,
  BTable,
  BAvatar,
  BBadge,
  BFormGroup,
  BFormSelect,
  BInputGroup,
  BFormInput,
  BInputGroupPrepend,
  BPagination,
  BCardBody,
  BOverlay,
  VBTooltip, BModal, BFormRow, BForm,
} from 'bootstrap-vue'
import { required, min, minValue } from '@validations'
import BCardActionsContainer from '@core/components/b-card-actions/BCardActionsContainer.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import vSelect from 'vue-select'
import PartnerForm from './Form.vue'

export default {
  directives: {
    'b-tooltip': VBTooltip,
    'b-toggle': VBToggle,
    Ripple,
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    BFormRow,
    BRow,
    BCol,
    BCard,
    BCollapse,

    BButton,
    BTable,
    BAvatar,
    BBadge,
    BFormGroup,
    BFormSelect,
    BInputGroup,
    BFormInput,
    BInputGroupPrepend,
    BPagination,
    BOverlay,
    BCardBody,
    vSelect,
    BCardActionsContainer,
    BModal,
    BForm,
    PartnerForm,
  },
  data() {
    return {
      // new Filter
      staffItems: [],
      staffId: '',
      // End new filter
      perPage: 10,
      pageOptions: [5, 10, 20],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      deletedIds: [],
      loading: false,
      endpointGetAll: '/user/partner/pagination',
      endpointDelete: '/user/partner/delete/:id',

      required,
      min,
      minValue,

      filterPartnerCategoryId: '',
      filterPartnerCategoryItems: [],
      filterStaffId: '',
      filterStaffItems: [],
      hasMoreFilterStaff: false,

      partnerId: '',

      fieldSortirBakatDipekerjakan: [],
      fieldSortirDurasi: [],

      handlingNullDurasi: '0000-00-00 00:00:00',

      bakatDipekerjakanOptions: [
        { title: 'Terbanyak', value: 1 },
        { title: 'Paling Sedikit', value: 2 },
      ],

      durasiOptions: [
        { title: 'Terlama', value: 2 },
        { title: 'Paling Sedikit', value: 1 },
      ],

      fields: [
        { key: 'full_name', label: 'Nama' },
        { key: 'no_partner', label: 'No. Partner' },
        { key: 'partner_detail.partner_category_name', label: 'Sektor Bisnis' },
        { key: 'total_sdm_assigned', label: 'Bakat dipekerjakan', sortable: false },
        {
          key: 'partner_detail.active_at',
          label: 'Durasi',
          sortable: false,
          formatter: value => {
            if (!value || value === '0000-00-00 00:00:00') return '0'

            const dateDiff = (new Date() - Date.parse(value))
            const dayDiff = dateDiff / (24 * 60 * 60 * 1000)

            if (dayDiff > 365) return `${Math.round(dayDiff / 365)} tahun`
            if (dayDiff > 30) return `${Math.round(dayDiff / 30)} bulan`
            if (dayDiff > 7) return `${Math.round(dayDiff / 7)} minggu`
            return `${Math.floor(dayDiff)} hari`
          },
        },
      ],
    }
  },
  computed: {
    tableFields() {
      const fields = [...this.fields]

      if (this.hasActionEdit || this.hasActionDelete) {
        fields.push({ key: 'action', label: 'Aksi', class: 'col-action' })
      }

      return fields
    },
    hasActionDelete() {
      return this.endpointDelete !== undefined
    },
    hasActionEdit() {
      return this.$route.meta.routeEdit !== undefined
    },
    hasActionCreate() {
      return this.$route.meta.routeCreate !== undefined
    },
  },
  mounted() {
    this.loadPartnerCategories()
    this.loadStaffs()
  },
  methods: {
    filterByPartnerCategory() {
      const key = /^-?\d+$/.test(this.filter) ? 'no_partner' : 'name'
      const params = {
        [key]: this.filter,
        partner_category: this.filterPartnerCategoryId,
        account_status: 'registered',
        page: this.currentPage,
        limit: this.perPage,
        sort: this.sortBy,
        direction: this.sortDirection,
      }
      return this.$http.get(this.endpointGetAll, {
        params,
      }).then(response => {
        const { data } = response.data.data
        this.refreshTable()
        return data
      })
    },
    filterByLeader() {
      const params = {
        team_lead: this.filterStaffId,
        account_status: 'active',
        page: this.currentPage,
        limit: this.perPage,
        sort: this.sortBy,
        direction: this.sortDirection,
      }
      return this.$http.get(this.endpointGetAll, {
        params,
      }).then(response => {
        const { data } = response.data.data
        this.refreshTable()
        return data
      })
    },
    sortirBakatDipekerjakan() {
      const params = {
        account_status: 'active',
        page: this.currentPage,
        limit: this.perPage,
      }
      return this.$http.get(this.endpointGetAll, {
        params,
      }).then(response => {
        const { data } = response.data?.data
        // data.sort((itemsA, itemsB) => {
        //   if (this.fieldSortirBakatDipekerjakan.value === 1) {
        //     return itemsA.total_sdm_assigned < itemsB.total_sdm_assigned ? 1 : -1
        //   }
        //   if (this.fieldSortirBakatDipekerjakan.value === 2) {
        //     return itemsA.total_sdm_assigned > itemsB.total_sdm_assigned ? 1 : -1
        //   }
        //   return data
        // })
        if (this.fieldSortirBakatDipekerjakan === null) {
          this.fieldSortirBakatDipekerjakan = 0
        }

        this.refreshTable()
        return data
      })
    },
    sortirDurasi() {
      return this.$http.get(this.endpointGetAll, {
        params: {
          account_status: 'active',
          page: this.currentPage,
          limit: this.perPage,
        },
      }).then(response => {
        const { data } = response.data.data
        if (this.fieldSortirDurasi === null) {
          this.fieldSortirDurasi = 0
        }
        this.refreshTable()
        return data
      })
    },
    tableProvider() {
      const key = /^-?\d+$/.test(this.filter) ? 'no_partner' : 'name'
      return this.$http.get(this.endpointGetAll, {
        params: {
          [key]: this.filter,
          partner_category: this.filterPartnerCategoryId,
          team_lead: this.filterStaffId,
          account_status: 'active',
          sortDuration: this.fieldSortirDurasi.value,
          page: this.currentPage,
          limit: this.perPage,
          sort: this.sortBy,
          direction: this.sortDirection,
        },
      }).then(response => {
        const { data } = response.data.data
        this.totalRows = response.data.data.total
        data.sort((itemsA, itemsB) => {
          if (this.fieldSortirBakatDipekerjakan.value === 1) {
            return itemsA.total_sdm_assigned < itemsB.total_sdm_assigned ? 1 : -1
          }
          if (this.fieldSortirBakatDipekerjakan.value === 2) {
            return itemsA.total_sdm_assigned > itemsB.total_sdm_assigned ? 1 : -1
          }
          // if (this.fieldSortirDurasi.value === 1) {
          //   return new Date(itemsA.partner_detail.active_at) - new Date(itemsB.partner_detail.active_at)
          // }
          // if (this.fieldSortirDurasi.value === 2) {
          //   return new Date(itemsB.partner_detail.active_at) - new Date(itemsA.partner_detail.active_at)
          // }
          return data
        })
        return data
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Failure',
            icon: 'AlertCircleIcon',
            text: 'Unable to load the table data. Please try again later or contact support.',
            variant: 'danger',
          },
        })
        return []
      })
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    confirmDelete(data) {
      this.$swal({
        title: 'Anda yakin?',
        text: `Hapus satu ${this.$route.meta.name.singular} dari tabel. Aksi ini tidak dapat dibatalkan.`,
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
          this.delete(data)
        }
      })
    },
    delete(data) {
      this.loading = true
      const endpoint = this.endpointDelete.replace(/:id/g, data.item.id)

      this.$http.get(endpoint)
        .then(() => {
          this.deletedIds.push(data.item.id)
        })
        .finally(() => {
          this.loading = false
        })
    },
    isDeleted(id) {
      return this.deletedIds.includes(id)
    },
    rowClass(item, type) {
      const colorClass = 'table-danger'
      if (!item || type !== 'row') { return }

      // eslint-disable-next-line consistent-return
      if (this.isDeleted(item.id)) { return colorClass }
    },
    loadPartnerCategories() {
      return this.$http.post('/partnerCategory', {}, {
        params: {
          sort: 'name',
          direction: 'asc',
        },
      })
        .then(async response => {
          const { data } = response.data
          this.filterPartnerCategoryItems = data
        })
    },
    onSearchStaff(search, loading) {
      if (search.length) {
        this.searchStaff(loading, search, this)
      }
    },
    searchStaff: _.debounce((loading, search, that) => {
      loading(true)
      that.loadStaffs(search).finally(() => loading(false))
    }, 500),
    loadStaffs(search) {
      return this.$http.get('/leader', {
        params: {
          keyword: search,
          page: 1,
          limit: 5,
          sort: 'name',
          direction: 'asc',
        },
      })
        .then(async response => {
          const { data } = response.data.data
          this.hasMoreFilterStaff = response.data.data.total > data.length
          this.filterStaffItems = data
        })
    },
    toggleModal() {
      this.$refs.formModal.toggle()
    },
    handleOk(event) {
      event.preventDefault()
      this.submitFilter()
    },
    resetForm() {
      this.filterPartnerCategoryId = ''
      this.filterStaffId = ''
    },
    submitFilter() {
      this.$refs.formRules.validate().then(success => {
        if (success) {
          this.refreshTable()

          this.$nextTick(() => {
            this.$refs.formModal.toggle()
          })
        }
      })
    },
    setupModal(data) {
      this.partnerId = data.item.id
      this.$refs.detailModal.toggle()
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>

<style scoped>
  [dir] .card .dropdown-filter {
    padding: 1.5rem;
  }

  [dir] .sortir-talent-mobile {
    display: none;
  }

  @media only screen and (max-width: 767px) {
    [dir] .sortir-talent-mobile {
        display: block;
    }

    [dir] .sortir-talent {
        display: none;
    }
  }
</style>
