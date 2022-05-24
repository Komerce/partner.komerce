<template>
  <b-row class="mt-n1">
    <b-col cols="12">
      <div class="card-header d-none">
        <div class="d-flex justify-content-start flex-wrap">
          <b-button
            v-if="false"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
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
          <b-form-group>
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
          </b-form-group>

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
              v-b-toggle.collapse-1-inner
              size="sm"
              variant="primary"
              class="btn-sortir"
            >
              Sortir
            </b-button>
          </b-col>
        </div>

        <b-row>
          <b-col md="8">
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
                        <!-- Leader -->
                        <b-col md="6">
                          <validation-observer>
                            <b-form-group
                              label="Leader"
                            >
                              <validation-provider
                                #default="{ errors }"
                                name="Leader"
                              >
                                <v-select
                                  v-model="fieldFilterByLeader"
                                  :options="staffItems"
                                  label="full_name"
                                  :state="errors.length > 0 ? false:null"
                                  placeholder="Ketik untuk mencari..."
                                  @search="onSearchStaff"
                                  @input="filterByLeader"
                                >
                                  <li
                                    v-if="hasMoreStaff"
                                    slot="list-footer"
                                    class="vs__dropdown-option vs__dropdown-option--disabled"
                                  >
                                    <feather-icon
                                      icon="MoreHorizontalIcon"
                                      size="16"
                                    />
                                  </li>
                                </v-select>
                              </validation-provider>
                            </b-form-group>
                          </validation-observer>
                        </b-col>

                        <!-- Partner -->
                        <b-col md="6">
                          <validation-observer>
                            <b-form-group
                              label="Partner"
                            >
                              <validation-provider
                                #default="{ errors }"
                                name="No partner"
                                rules="required"
                              >
                                <v-select
                                  v-model="fieldFilterByPartner"
                                  :options="partnerItems"
                                  :state="errors.length > 0 ? false:null"
                                  placeholder="Ketik untuk mencari..."
                                  @search="onSearchPartner"
                                  @input="filterByPartner"
                                >
                                  <li
                                    v-if="hasMoreStaff"
                                    slot="list-footer"
                                    class="vs__dropdown-option vs__dropdown-option--disabled"
                                  >
                                    <feather-icon
                                      icon="MoreHorizontalIcon"
                                      size="16"
                                    />
                                  </li>
                                </v-select>
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
          <b-col
            md="3"
            class="sortir-talent text-right"
          >
            <b-collapse
              id="collapse-1-inner"
              class="mt-2"
            >
              <b-card class="mb-0 text-left">
                <validation-observer>
                  <b-form-group
                    label="Rating"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Rating"
                      rules="required"
                    >
                      <v-select
                        v-model="fieldSortirRating"
                        :options="ratingOptions"
                        label="title"
                        :state="errors.length > 0 ? false:null"
                        @input="sortirRating"
                      />
                    </validation-provider>
                  </b-form-group>
                </validation-observer>
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
                v-b-toggle.collapse-2-inner
                size="sm"
                variant="primary"
                class="btn-sortir"
              >
                Sortir
              </b-button>
            </b-col>
            <b-collapse
              id="collapse-2-inner"
              class="mt-2"
            >
              <b-card class="mb-0 text-left">
                <validation-observer>
                  <b-form-group
                    label="Rating"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Rating"
                      rules="required"
                    >
                      <v-select
                        v-model="fieldSortirRating"
                        :options="ratingOptions"
                        label="title"
                        :state="errors.length > 0 ? false:null"
                        @input="sortirRating"
                      />
                    </validation-provider>
                  </b-form-group>
                </validation-observer>
              </b-card>
            </b-collapse>
          </b-col>
        </b-row>
        <!-- end sortir mobile -->
      </div>

      <div class="mb-1 pl-2 d-flex overflow-x-scroll overflow-y-hidden">
        <div
          v-for="(item, index) in filterPositionItems"
          :key="`filter-position-${item.id}`"
          class="mr-50"
        >
          <b-form-group>
            <b-button
              :variant="filterPositionId === item.id ? 'primary' : 'flat-primary'"
              class="text-nowrap"
              :class="{'mr-2': index === (filterPositionItems.length - 1)}"
              :pressed="filterPositionId === item.id"
              pill
              size="sm"
              @click="selectPosition(item.id)"
            >
              {{ item.position_name }}
            </b-button>
          </b-form-group>
        </div>
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
          <template #cell(questionnaire)="data">
            <b-button
              v-if="!isDeleted(data.item.talent.id)"
              tag="router-link"
              :to="{ name: $route.meta.routeEdit, params: { id: data.item.talent.id }, query: { tab: 'questionnaire' } }"
              class="mr-50"
              size="sm"
              variant="outline-primary"
            >
              View
            </b-button>
          </template>
          <template #cell(talent_rating)="data">
            <div class="d-flex align-items-center">
              {{ data.item.talent_rating }}
              <feather-icon
                icon="StarIcon"
                class="ml-50 text-warning filled"
              />
            </div>
          </template>
          <template #cell(action)="data">
            <span
              v-if="isDeleted(data.item.talent.id)"
              class="text-danger"
            >Deleted</span>
            <div v-else>
              <b-button
                v-if="hasActionEdit"
                tag="router-link"
                :to="{ name: $route.meta.routeEdit, params: { id: data.item.talent.id } }"
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
                :to="{ name: $route.meta.routeResign, params: { id: data.item.talent.id, user_id: data.item.talent.user_id } }"
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
    </b-col>
  </b-row>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Ripple from 'vue-ripple-directive'
import {
  BCard,
  BCollapse,
  VBToggle,
  BRow,
  BCol,
  BButton,
  BTable,
  BAvatar,
  BBadge,
  BForm,
  BFormGroup,
  BFormSelect,
  BInputGroup,
  BFormInput,
  BInputGroupPrepend,
  BPagination,
  BCardBody,
  BOverlay,
  VBTooltip, BFormRow,
} from 'bootstrap-vue'
import BCardActionsContainer from '@core/components/b-card-actions/BCardActionsContainer.vue'
import { heightTransition } from '@core/mixins/ui/transition'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, min, minValue } from '@validations'
import vSelect from 'vue-select'

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

    BCollapse,
    BCard,
    BButton,
    BTable,
    BAvatar,
    BBadge,
    BForm,
    BFormGroup,
    BFormSelect,
    BInputGroup,
    BFormInput,
    BInputGroupPrepend,
    BPagination,
    BOverlay,
    BCardBody,
    BCardActionsContainer,
    vSelect,
  },
  mixins: [heightTransition],
  data() {
    return {
      // Dropdown filter
      fieldFilterByLeader: '',
      fieldFilterByPartner: '',
      fieldSortirRating: [],

      partnerNums: [],
      ratingNums: [],
      ratingItems: [],
      partnerItems: [],
      staffItems: [],
      staffId: '',
      items: [{
        id: 1,
        selected: 'male',
        selected1: 'designer',
        prevHeight: 0,
      }],
      // End Dropdown filter
      perPage: 10,
      pageOptions: [5, 10, 20],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: true,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      deletedIds: [],
      loading: false,
      endpointGetAll: '/talent',
      endpointDelete: '/talent/:id',
      hasMoreStaff: false,

      ratingOptions: [
        { title: 'Paling Banyak', value: 1 },
        { title: 'Paling Sedikit', value: 2 },
      ],

      filterPositionId: 1,
      filterPositionItems: [],

      required,
      min,
      minValue,

      fields: [
        { key: 'id', label: 'Id' },
        { key: 'full_name', label: 'Nama' },
        {
          key: 'position_name',
          label: 'Posisi',
          sortable: false,
        },
        {
          key: 'partner_assignments',
          label: 'Partner',
          sortable: false,
          formatter: array => array.map(value => `${value.no_partner} - ${value.full_name}`).join(','),
        },
        {
          key: 'management.full_name',
          label: 'Talent Lead',
          sortable: false,
        },
        {
          key: 'talent_rating',
          label: 'Rating',
          sortable: false,
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
      return this.$route.meta.routeResign !== undefined
    },
    hasActionEdit() {
      return this.$route.meta.routeEdit !== undefined
    },
    hasActionCreate() {
      return this.$route.meta.routeCreate !== undefined
    },
  },
  watch: {
    filterPositionId() {
      this.refreshTable()
    },
  },
  mounted() {
    this.loadFilterPositions()
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

      return this.$http.get('/user/partner/pagination', {
        params: {
          [key]: search,
          account_status: 'active',
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
          this.hasMorePartner = response.data.data.total > data.length
          this.partnerItems = data
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
          this.hasMoreStaff = response.data.data.total > data.length
          this.staffItems = data
        })
    },
    filterByLeader() {
      const params = {
        keyword: this.filter,
        position_id: this.filterPositionId,
        status: 'hired',
        page: this.currentPage,
        limit: this.perPage,
        sort: this.sortBy,
        direction: this.sortDirection,
      }
      const getTalentByLeader = this.$http.get(this.endpointGetAll, {
        params,
      }).then(response => {
        const { data } = response.data.data
        return data
      })
      this.refreshTable()
      return { getTalentByLeader }
    },
    filterByPartner() {
      const params = {
        keyword: this.filter,
        position_id: this.filterPositionId,
        status: 'hired',
        page: this.currentPage,
        limit: this.perPage,
        sort: this.sortBy,
        direction: this.sortDirection,
      }
      const getPartner = this.$http.get(this.endpointGetAll, {
        params,
      }).then(response => {
        const { data } = response.data.data
        return data
      })
      this.refreshTable()
      return getPartner
    },
    sortirRating() {
      const params = {
        status: 'hired',
        page: this.currentPage,
        limit: this.perPage,
      }
      const resultRating = this.$http.get(this.endpointGetAll, {
        params,
      }).then(response => {
        const { data } = response.data.data
        if (this.fieldSortirRating === null) {
          this.fieldSortirRating = ''
        }
        return data
      })
      this.refreshTable()
      return resultRating
    },
    tableProvider() {
      const params = {
        keyword: this.filter,
        position_id: this.filterPositionId,
        status: 'hired',
        page: this.currentPage,
        limit: this.perPage,
        sort: this.sortBy,
        direction: this.sortDirection,
      }
      if (this.fieldFilterByPartner) Object.assign(params, { no_partner: String(this.fieldFilterByPartner.no_partner) })
      if (this.fieldFilterByLeader) Object.assign(params, { name_lead: this.fieldFilterByLeader.full_name })
      const getResultData = this.$http.get(this.endpointGetAll, {
        params,
      }).then(response => {
        const { data } = response.data.data
        this.totalRows = response.data.data.total
        data.sort((itemsA, itemsB) => {
          if (this.fieldSortirRating.value === 1) {
            return itemsB.talent_rating - itemsA.talent_rating
          }
          if (this.fieldSortirRating.value === 2) {
            return itemsA.talent_rating - itemsB.talent_rating
          }
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
      return getResultData
    },
    // End new filter
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
      const endpoint = this.endpointDelete.replace(/:id/g, data.item.talent.id)

      this.$http.delete(endpoint)
        .then(() => {
          this.deletedIds.push(data.item.talent.id)
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
    loadFilterPositions() {
      return this.$http.post('/position', {}, {
        params: {
          is_division_external: 1,
          sort: 'name',
          direction: 'asc',
        },
      })
        .then(async response => {
          const { data } = response.data
          this.filterPositionItems = Object.keys(data).map(key => data[key])
        })
    },
    selectPosition(id) {
      this.filterPositionId = id
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
  [dir] .card .dropdown-filter {
    padding: 1.5rem;
  }
</style>
