<template>
  <b-col cols="12">
    <b-card
      no-body
    >
      <h3 class="ml-2 mb-2 mt-2">
        List Modul
      </h3>
      <h3
        class="ml-2 mb-1"
      >
        {{ classSkill }}
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
          <template #cell(modules)="data">
            <h4>{{ data.item.module_title }}</h4>
            <p>{{ data.item.module_subtitle }}</p>
          </template>

          <template #cell(module_trainer)="data">
            <span>{{ data.item.module_trainer }}</span>
          </template>

          <template #cell(module_status)="data">
            <b-badge
              v-if="data.field.badge"
              :variant="data.field.badge[1][data.value]"
            >
              {{ data.field.badge[0][data.value] }}
            </b-badge>
          </template>

          <template #cell(action)="data">
            <span
              v-if="isDeleted(data.item.module_id)"
              class="text-danger"
            >Deleted</span>
            <div v-else>
              <b-button
                variant="flat-info"
                class="btn-icon"
                tag="router-link"
                :to="{ name: $route.meta.routeLesson, params: { module_id: data.item.module_id } }"
              >
                <feather-icon
                  icon="SettingsIcon"
                />
              </b-button>
              <b-button
                variant="flat-warning"
                class="btn-icon"
                tag="router-link"
                :to="{ name: $route.meta.routeEdit, params: { module_id: data.item.module_id, class_id: data.item.module_class_id } }"
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
  },

  data() {
    return {
      loading: false,
      classSkill: '',

      classId: this.$route.params.class_id,

      endpointDelete: '/lms/module/delete/:module_id',

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

      fields: [
        { key: 'modules', label: 'Modul' },
        { key: 'module_trainer', label: 'Trainer' },
        {
          key: 'module_status',
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
        },
        { key: 'action', label: 'Aksi' },
      ],
      module_id: 1,
      itemsModule: null,
    }
  },
  computed: {
    tableFields() {
      const fields = [...this.fields]
      return fields
    },
  },
  mounted() {
    this.loadClass()
  },
  methods: {
    refreshTable() {
      this.$refs.table.refresh()
    },
    tableProvider() {
      return this.$http.get(`/lms/module/list/filter/${this.classId}`, {
        params: {
          filter_title: this.filter,
        },
      }).then(response => {
        const { data } = response.data
        this.itemsModule = data.modules
        return this.itemsModule
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Failure',
            icon: 'AlertCircleIcon',
            text: 'Daftar modul tidak ada',
            variant: 'danger',
          },
        })
        return []
      })
    },
    loadClass() {
      return this.$http.get(`/lms/module/list/${this.classId}`).then(response => {
        const { data } = response.data
        this.classSkill = data.class_skill
        return data.modules
      })
    },
    confirmDelete(data) {
      if (this.itemsModule.length > 1) {
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
      } else {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Tidak bisa hapus modul, minimal modul ada 1',
            variant: 'danger',
          },
        })
      }
    },
    delete(data) {
      this.loading = true
      const endpoint = this.endpointDelete.replace(/:module_id/g, data.item.module_id)

      this.$http.delete(endpoint)
        .then(response => {
          if (response.data.status === 'failed') {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                text: 'Tidak bisa delete module, module masih dalam keadaan publish',
                variant: 'danger',
                icon: 'AlertCircleIcon',
              },
            }, { timeout: 2500 })
          } else {
            this.deletedIds.push(data.item.module_id)
          }
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
      if (this.isDeleted(item.lesson_id)) { return colorClass }
    },
  },
}
</script>
<style>

</style>
