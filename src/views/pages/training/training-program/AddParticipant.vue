<template>
  <div>
    <b-card-body>
      <div class="d-flex justify-content-start flex-wrap">
        <b-button
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
    </b-card-body>
    <b-row>
      <b-col cols="12">
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
            @row-clicked="onRowSelected"
          >
            <template #cell(checkbox)="data">
              <template v-if="isSelected(data)">
                <span
                  aria-hidden="true"
                  class="icon-checked"
                >
                  <feather-icon
                    class="text-primary filled"
                    icon="SquareIcon"
                    size="20"
                  />
                </span>
                <span class="sr-only">Selected</span>
              </template>
              <template v-else>
                <span aria-hidden="true">
                  <feather-icon
                    class="text-secondary icon-unchecked"
                    icon="SquareIcon"
                    size="20"
                  />
                </span>
                <span class="sr-only">Not selected</span>
              </template>
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
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { dateFormat } from '@core/mixins/ui/date'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Ripple from 'vue-ripple-directive'
import {
  BRow,
  BCol,
  BButton,
  BTable,
  BAvatar,
  BBadge,
  BFormGroup,
  BFormSelect,
  BPagination,
  BCardBody,
  BOverlay,
  VBTooltip, BFormRow, BInputGroup, BInputGroupPrepend, BFormInput,
} from 'bootstrap-vue'

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
    BOverlay,
    BCardBody,
    BInputGroup,
    BInputGroupPrepend,
    BFormInput,
  },
  mixins: [dateFormat],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    filters: {
      type: Object,
      required: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    showFilter: {
      type: Function,
      required: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    onRowSelected: {
      type: Function,
      required: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    selected: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      id: this.$route.params.id,
      perPage: 7,
      pageOptions: [5, 7, 10],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      deletedIds: [],
      loading: false,
      endpointGetAll: '/talent',

      fields: [
        { key: 'checkbox', label: '' },
        { key: 'full_name', label: 'Nama' },
        { key: 'talent.id', label: 'Id' },
        {
          key: 'talent.status',
          label: 'Status',
          sortable: false,
          badge: [
            {
              'non job': 'Non Job',
              hired: 'Hired',
              registered: 'Registered',
              selected: 'Selected',
              4: 'Training',
              5: 'Graduated',
              6: 'Remedial',
            },
            {
              'non job': 'light-secondary',
              hired: 'light-warning',
              registered: 'light-primary',
              selected: 'light-success',
              4: 'light-info',
              5: 'light-graduated',
              6: 'light-danger',
            },
          ],
        },
        { key: 'talent.district.regency.name', label: 'Kota' },
        { key: 'position_name', label: 'Posisi' },
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
  methods: {
    tableProvider() {
      return this.$http.get(this.endpointGetAll, {
        params: {
          ...this.filters,
          keyword: this.filter,
          page: this.currentPage,
          limit: this.perPage,
          sort: this.sortBy,
          direction: this.sortDirection,
          training_program_id: this.id,
        },
      }).then(response => {
        const { data } = response.data.data
        this.totalRows = response.data.data.total
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

      this.$http.delete(endpoint)
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
    isSelected(row) {
      const index = this.selected.map(item => item.id).indexOf(row.item.id)
      return index !== -1
    },
  },
}
</script>
