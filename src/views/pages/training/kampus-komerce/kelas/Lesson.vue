<template>
  <b-col cols="12">
    <b-card
      no-body
    >
      <h3 class="ml-2 mb-2 mt-2">
        List Lesson
      </h3>
      <h3 class="ml-2 mb-2">
        {{ moduleTitle }}
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
      <b-form-row>
        <b-col cols="auto">
          <b-avatar
            size="80px"
            rounded="sm"
            class="mt-2 ml-2"
            :src="thumbnailModule"
          />
        </b-col>
        <b-col class="d-flex align-items-center pr-5">
          <div>
            <b-card-title class="mb-1 mt-2">
              <h5 class="text-dark">
                {{ moduleTitle }} - {{ moduleSubtitle }}
              </h5>
            </b-card-title>
            <b-badge
              :variant="moduleStatus === 'publish' ? 'light-success' : 'light-primary'"
            >
              {{ moduleStatus }}
            </b-badge>
            <p class="mt-1">
              {{ trainerName }}
            </p>
          </div>
        </b-col>
      </b-form-row>

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
          class="position-relative mt-1"
          empty-text="Tidak ada data untuk ditampilkan."
          :empty-filtered-text="`Tidak ada hasil untuk kata kunci '${filter}'.`"

          :show-empty="!loading"
          :per-page="perPage"
          :current-page="currentPage"
          :items="tableProvider"
          :fields="fieldsTable"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          :filter="filter"
          :filter-included-fields="filterOn"
          :tbody-tr-class="rowClass"
          :busy.sync="loading"
        >
          <template #cell(lessons)="data">
            <b-form-row>
              <b-col cols="auto">
                <b-avatar
                  size="md"
                  rounded="sm"
                  :src="data.item.lesson_thumbnail"
                />
              </b-col>
              <b-col class="d-flex align-items-center pr-5">
                <div>
                  <b-card-title class="mb-1 mt-50">
                    <h5>{{ data.item.lesson_title }}</h5>
                  </b-card-title>
                </div>
              </b-col>
            </b-form-row>
          </template>

          <template #cell(lesson_status)="data">
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
                :to="{ name: $route.meta.routeAddQuiz, params: { lesson_id: data.item.lesson_id, module_id: data.item.module_id }, }"
              >
                <feather-icon
                  icon="PlusIcon"
                />
                <span>Add Quiz</span>
              </b-button>
              <b-button
                variant="flat-warning"
                class="btn-icon"
                tag="router-link"
                :to="{ name: $route.meta.routeEdit, params: { lesson_id: data.item.lesson_id }, }"
              >
                <feather-icon
                  icon="EditIcon"
                />
              </b-button>
              <b-button
                v-if="data.item.lesson_status === 'draft'"
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
  BFormRow,
  BCardTitle,
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
    BFormRow,
    BCardTitle,
    BAvatar,
  },

  data() {
    return {
      moduleId: this.$route.params.module_id,
      fields: [
        { key: 'lessons', label: 'Lesson' },
        {
          key: 'lesson_status',
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
        { key: 'action', label: 'Aksi' },
      ],

      moduleTitle: '',
      moduleSubtitle: '',
      trainerName: '',
      moduleStatus: '',

      thumbnailModule: null,

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

      loading: false,
      deletedIds: [],
      endpointDelete: '/lms/lesson/delete/:lesson_id',
    }
  },
  computed: {
    fieldsTable() {
      const fields = [...this.fields]
      return fields
    },
  },
  mounted() {
    this.loadModule()
  },
  methods: {
    refreshTable() {
      this.$refs.table.refresh()
    },
    tableProvider() {
      return this.$http.get(`/lms/lesson/list/filter/${this.moduleId}`, {
        params: {
          filter_title: this.filter,
        },
      }).then(response => {
        const { data } = response.data
        return data.lessons
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Failure',
            icon: 'AlertCircleIcon',
            text: 'Tidak ada list lesson untuk module ini',
            variant: 'danger',
          },
        })
        return []
      })
    },
    loadModule() {
      return this.$http.get(`/lms/module/${this.moduleId}`).then(response => {
        const { data } = response.data
        if (data.module_status === 'draft') {
          this.moduleStatus = 'Private'
        } else {
          this.moduleStatus = data.module_status
        }
        this.moduleTitle = data.module_title
        this.moduleSubtitle = data.module_subtitle
        this.trainerName = data.module_trainer.name
        this.thumbnailModule = data.module_thumbnail
        return data
      })
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
      const endpoint = this.endpointDelete.replace(/:lesson_id/g, data.item.lesson_id)

      this.$http.delete(endpoint)
        .then(() => {
          this.deletedIds.push(data.item.lesson_id)
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
