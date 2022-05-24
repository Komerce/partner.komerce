<template>
  <b-col cols="12">
    <b-card
      no-body
    >
      <h3 class="ml-2 mb-2 mt-2">
        Kelas
      </h3>
      <b-col md="3">
        <b-form-group
          class="mb-0 ml-50"
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
      </b-col>

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
          class="position-relative mt-5"
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
          <template #cell(class_name)="data">
            <div class="d-flex align-items-center">
              <b-avatar
                square
                size="50px"
                :src="data.item.class_img"
              />
              <h4 class="ml-1">
                {{ data.item.class_name }}
              </h4>
            </div>
          </template>

          <template #cell(total_module)="data">
            <span>{{ data.value }}</span>
          </template>

          <template #cell(class_status)="data">
            <b-badge
              v-if="data.field.badge"
              :variant="data.field.badge[1][data.value]"
            >
              {{ data.field.badge[0][data.value] }}
            </b-badge>
          </template>

          <template #cell(action)="data">
            <span
              v-if="isDeleted(data.item.class_id)"
              class="text-danger"
            >Deleted</span>
            <div v-else>
              <b-button
                variant="flat-info"
                class="btn-icon"
                tag="router-link"
                :to="{ name: $route.meta.routeModul, params: { class_id: data.item.class_id } }"
              >
                <feather-icon
                  icon="SettingsIcon"
                />
              </b-button>
              <b-button
                v-if="hasActionEdit"
                variant="flat-warning"
                class="btn-icon"
                tag="router-link"
                :to="{ name: $route.meta.routeEdit, params: { class_id: data.item.class_id } }"
              >
                <feather-icon
                  icon="EditIcon"
                />
              </b-button>
              <b-button
                variant="flat-danger"
                class="btn-icon"
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
    </b-card>
  </b-col>
</template>

<script>
import {
  BCol,
  BCard,
  BInputGroup,
  BInputGroupPrepend,
  BFormGroup,
  BFormInput,
  BOverlay,
  BBadge,
  BTable,
  BButton,
  BAvatar,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BCol,
    BCard,
    BInputGroup,
    BInputGroupPrepend,
    BFormGroup,
    BFormInput,
    BOverlay,
    BBadge,
    BTable,
    BButton,
    BAvatar,
  },

  data() {
    return {
      loading: false,
      endpointGetAll: '/lms/class/list',
      endpointDelete: '/lms/class/delete/:class_id',

      deletedIds: [],

      nextTodoId: 2,
      perPage: 10,
      pageOptions: [5, 10, 20],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],

      keyword: '',
      fieldSearch: [],

      fields: [
        {
          key: 'class_name',
          label: 'Kelas',
        },
        {
          key: 'total_module',
          label: 'Total Modul',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'class_status',
          label: 'Status',
          badge: [
            {
              publish: 'Publish',
              draft: 'Private',
            },
            {
              publish: 'light-success',
              draft: 'light-danger',
            },
          ],
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        { key: 'action', label: 'Aksi', class: 'col-action' },
      ],
    }
  },
  computed: {
    tableFields() {
      const fields = [...this.fields]
      return fields
    },
    hasActionEdit() {
      return this.$route.meta.routeEdit !== undefined
    },
  },
  mounted() {
    this.isDeleted()
  },
  methods: {
    tableProvider() {
      return this.$http.get('/lms/class/list', {
        params: {
          search: this.filter,
        },
      }).then(response => {
        const { data } = response.data
        return data
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Failure',
            icon: 'AlertCircleIcon',
            text: 'Daftar kelas tidak ada',
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
          this.refreshTable()
        }
      })
    },
    delete(data) {
      this.loading = true
      const endpoint = this.endpointDelete.replace(/:class_id/g, data.item.class_id)

      this.$http.delete(endpoint)
        .then(res => {
          if (res.data.message === 'cannot delete class, Class is still publish.') {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Tidak bisa hapus kelas, saat status kelas masih dalam keadaan publish',
                variant: 'danger',
              },
            })
          } else {
            this.deletedIds.push(data.item.class_id)
          }
        })
        .finally(() => {
          this.loading = false
          this.refreshTable()
        })
    },
    isDeleted(id) {
      return this.deletedIds.includes(id)
    },
    rowClass(item, type) {
      const colorClass = 'table-danger'
      if (!item || type !== 'row') { return }

      // eslint-disable-next-line consistent-return
      if (this.isDeleted(item.class_id)) { return colorClass }
    },
  },
}
</script>
<style>

</style>
