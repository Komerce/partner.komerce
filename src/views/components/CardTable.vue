<template>
  <b-row>
    <b-col cols="12">
      <b-card
        :class="{ 'has-button-floating': hasActionCreate }"
        no-body
      >
        <div class="card-header">
          <b-card-title>{{ $route.meta.name.plural }}</b-card-title>

          <!-- Card Actions -->
          <b-card-actions-container
            :available-actions="['refresh']"
            @refresh="refreshTable"
          />
        </div>
        <b-card-body>
          <div class="d-flex justify-content-start flex-wrap">
            <b-button
              v-if="hasFilter"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              size="sm"
              class="mr-50"
              @click="showFilter"
            >
              <feather-icon
                icon="FilterIcon"
                class="mr-50"
              />
              Filter
            </b-button>

            <!-- filter -->
            <b-form-group class="mb-0">
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
                  @input="onChange"
                />
              </b-input-group>
            </b-form-group>
          </div>
        </b-card-body>

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
            <template #cell(name)="data">
              <b-form-row>
                <b-col
                  v-if="data.item.icon !== undefined"
                  cols="auto"
                >
                  <b-avatar
                    :src="data.item.icon"
                    class="mr-50"
                    variant="light-secondary"
                    rounded="lg"
                  >
                    <feather-icon
                      v-if="!data.item.icon"
                      icon="ImageIcon"
                    />
                  </b-avatar>
                </b-col>
                <b-col class="d-flex align-items-center">
                  {{ data.value }}
                </b-col>
              </b-form-row>
            </template>
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
            <template #cell(status)="data">
              <b-badge :variant="status[1][data.value]">
                {{ status[0][data.value] }}
              </b-badge>
            </template>
            <template #cell(status)="data">
              <b-badge :variant="status[1][data.value]">
                {{ status[0][data.value] }}
              </b-badge>
            </template>
            <!-- start admin fee components -->
            <template #cell(admin_fee_discount_type)="data">
              <b-badge
                v-if="data.value == 'rp'"
                variant="success"
              >Nominal Rupiah</b-badge>
              <b-badge
                v-else
                variant="primary"
              >
                Presentase %
              </b-badge>
            </template>
            <template #cell(admin_fee_talent_admin_fee_discounts)="data">
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                v-b-modal="`admin-fee-modal-center-${data.item.id}`"
                variant="outline-warning"
                size="sm"
              >
                Lihat Detail
              </b-button>
              <b-modal
                :id="`admin-fee-modal-center-${data.item.id}`"
                centered
                title="Detail"
                ok-only
                ok-title="Tutup"
              >
                <b-card-text>
                  <ul>
                    <li
                      v-for="item in data.item.talent_admin_fee_discounts"
                      :key="`${data.item.id}-${item.id}`"
                    >
                      Jika hire
                      <b>{{ item.minimum_total_talent }} talent atau lebih,</b>
                      maka biaya admin
                      {{
                        (data.item.admin_fee - item.admin_fee_discount_value)
                          | rupiah
                      }}
                      / talent.
                    </li>
                  </ul>
                  <p v-if="!data.item.talent_admin_fee_discounts.length">
                    Tidak ada Potongan Admin yang tersedia
                  </p>
                </b-card-text>
              </b-modal>
            </template>
            <!-- end admin fee components -->
            <template #cell()="data">
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
                v-if="isDeleted(getId(data.item))"
                class="text-danger"
              >Deleted</span>
              <div v-else>
                <b-button
                  v-if="hasActionShow"
                  tag="router-link"
                  :to="{
                    name: $route.meta.routeShow,
                    params: { id: getId(data.item) },
                  }"
                  class="btn-icon mr-50"
                  size="sm"
                  variant="flat-info"
                >
                  <feather-icon icon="SearchIcon" />
                </b-button>
                <b-button
                  v-if="hasActionEdit"
                  tag="router-link"
                  :to="{
                    name: $route.meta.routeEdit,
                    params: { id: getId(data.item) },
                  }"
                  class="btn-icon mr-50"
                  size="sm"
                  variant="flat-warning"
                >
                  <feather-icon icon="EditIcon" />
                </b-button>
                <b-button
                  v-if="hasActionDelete"
                  class="btn-icon"
                  size="sm"
                  variant="flat-danger"
                  @click="confirmDelete(data)"
                >
                  <feather-icon icon="Trash2Icon" />
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
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import Ripple from 'vue-ripple-directive'

import {
  BFormRow,
  BRow,
  BCol,
  BButton,
  BTable,
  BAvatar,
  BBadge,
  BFormGroup,
  BFormSelect,
  BPagination,
  BInputGroup,
  BFormInput,
  BInputGroupPrepend,
  BCard,
  BCardTitle,
  BCardBody,
  BOverlay,
  BModal,
  BCardText,
  VBTooltip,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import BCardActionsContainer from '@core/components/b-card-actions/BCardActionsContainer.vue'
import filters from '@/libs/filters'

export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  components: {
    BFormRow,
    BRow,
    BCol,

    BButton,
    BTable,
    BAvatar,
    BBadge,
    BFormGroup,
    BFormSelect,
    BPagination,
    BInputGroup,
    BFormInput,
    BInputGroupPrepend,
    BCard,
    BCardActionsContainer,
    BCardTitle,
    BCardText,
    BOverlay,
    BCardBody,
    BModal,
  },
  filters: { rupiah: filters.rupiah },
  props: {
    keywordKey: {
      type: String,
      default: 'keyword',
    },
    endpointGetAll: {
      type: String,
      required: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    endpointDelete: {
      type: String,
      required: false,
    },
    getAllMethod: {
      type: String,
      default: 'get',
    },
    deleteMethod: {
      type: String,
      default: 'delete',
    },
    // eslint-disable-next-line vue/require-default-prop
    filters: {
      type: Object,
      required: false,
    },
    fields: {
      type: Array,
      required: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    showFilter: {
      type: Function,
      required: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    getDeleteId: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      perPage: 10,
      pageOptions: [5, 10, 20],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      filter: null,
      filterOn: [],
      deletedIds: [],
      loading: false,
    }
  },
  computed: {
    hasFilter() {
      return this.showFilter !== undefined && this.showFilter !== null
    },
    tableFields() {
      const fields = [...this.fields]

      if (this.hasActionEdit || this.hasActionDelete || this.hasActionShow) {
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
    hasActionShow() {
      return this.$route.meta.routeShow !== undefined
    },
    hasActionCreate() {
      return this.$route.meta.routeCreate !== undefined
    },
    sortDirection() {
      return this.sortDesc ? 'desc' : 'asc'
    },
  },
  methods: {
    tableProvider() {
      return this.$http({
        method: this.getAllMethod,
        url: this.endpointGetAll,
        params: {
          ...this.filters,
          [this.keywordKey]: this.filter,
          page: this.currentPage,
          limit: this.perPage,
          sort_by: this.sortBy,
          sort: this.sortDirection,
        },
      })
        .then(response => {
          const { data } = response.data.data
          this.totalRows = response.data.data.total
          return data
        })
        .catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Failure',
              icon: 'AlertCircleIcon',
              text:
                'Unable to load the table data. Please try again later or contact support.',
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
      const endpoint = this.endpointDelete.replace(
        /:id/g,
        this.getId(data.item),
      )

      this.$http({
        method: this.deleteMethod,
        url: endpoint,
      })
        .then(response => {
          if (response.data.status !== undefined && !response.data.status) {
            this.$toast(
              {
                component: ToastificationContent,
                props: {
                  title: 'Failed',
                  text: response.data.message,
                  variant: 'danger',
                  icon: 'AlertCircleIcon',
                },
              },
              { timeout: 2500 },
            )

            return
          }

          this.deletedIds.push(this.getId(data.item))
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
      if (!item || type !== 'row') {
        return null
      }

      // eslint-disable-next-line consistent-return
      if (this.isDeleted(this.getId(item))) {
        return colorClass
      }
      return null
    },
    getId(item) {
      return item.staff?.id || item.id
    },
    onChange(value) {
      this.$emit('input', value)
    },
  },
}
</script>
