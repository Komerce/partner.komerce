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

      <!-- Collapse dropdown filter -->
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
        </div>

        <b-collapse
          id="collapse-1"
          class="mt-2"
        >
          <b-card class="mb-0">
            <!-- filter dropdown -->
            <div>
              <div>
                <validation-observer ref="formRules">
                  <b-form
                    ref="formFilterDropdown"
                  >
                    <!-- Row Loop -->
                    <b-row
                      ref="row"
                    >
                      <!-- Filter Resign -->
                      <b-col md="3">
                        <b-form-group
                          label="Resign"
                        >
                          <validation-provider
                            #default="{ errors }"
                            name="Resign"
                          >
                            <v-select
                              v-model="fieldResign"
                              :options="resignOptions"
                              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                              label="title"
                              @input="filterResign"
                            />
                            <small class="text-danger">{{ errors[0] }}</small>
                          </validation-provider>
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </b-form>
                </validation-observer>
              </div>
            </div>
            <!-- End Filter dropdown -->
          </b-card>
        </b-collapse>
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
          <template #cell(action)="data">
            <span
              v-if="isDeleted(data.item.id)"
              class="text-danger"
            >Deleted</span>
            <div v-else>
              <b-button
                v-if="hasActionEdit"
                tag="router-link"
                :to="{ name: $route.meta.routeEditResign, params: { id: data.item.id } }"
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
                v-ripple.400="'rgba(30, 30, 30, 0.15)'"
                v-b-modal.modal-dark
                class="btn-icon"
                size="sm"
                variant="flat-secondary"
                @click="showDocument(data)"
              >
                <feather-icon
                  icon="FileTextIcon"
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
    <b-modal
      id="modal-dark"
      hide-footer
      centered
      title="Dokumen Pemberhentian"
    >
      <b-card-text class="mr-5">
        <!-- url dokumen -->
        <b-col md="12">
          <b-row>
            <b-col md="3">
              <b-form-group
                label="URL Dokumen"
              />
            </b-col>
            <b-col>
              <a
                target="_blank"
                :href="urlDocument"
              >
                <b-form-input
                  v-model="urlDocument"
                  class="area-url"
                  disabled
                  type="button"
                />
              </a>
            </b-col>
          </b-row>
        </b-col>

        <!-- url lainnya -->
        <b-col md="12">
          <b-row>
            <b-col md="3">
              <b-form-group
                label="URL Lainnya"
              />
            </b-col>
            <b-col v-if="urlOther">
              <a
                target="_blank"
                :href="urlOther"
              >
                <b-form-input
                  v-model="urlOther"
                  class="area-url"
                  disabled
                  type="button"
                />
              </a>
            </b-col>
            <b-col v-else>
              <h2>-</h2>
            </b-col>
          </b-row>
        </b-col>
      </b-card-text>
    </b-modal>
  </b-row>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Ripple from 'vue-ripple-directive'
import {
  BRow,
  BCol,
  BButton,
  BCard,
  BCollapse,
  VBToggle,
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
  VBTooltip, BFormRow, BForm, BModal, VBModal, BCardText,
} from 'bootstrap-vue'
import { required, min, minValue } from '@validations'
import BCardActionsContainer from '@core/components/b-card-actions/BCardActionsContainer.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { heightTransition } from '@core/mixins/ui/transition'
import vSelect from 'vue-select'

export default {
  directives: {
    'b-tooltip': VBTooltip,
    'b-toggle': VBToggle,
    'b-modal': VBModal,
    Ripple,
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    BFormRow,
    BRow,
    BCol,

    BButton,
    BCollapse,
    BCard,
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
    BCardActionsContainer,
    BForm,
    vSelect,
    BModal,
    BCardText,
  },
  mixins: [heightTransition],
  data() {
    return {
      items: [{
        id: 1,
        selected: 'male',
        selected1: 'designer',
        prevHeight: 0,
      }],
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
      deletedIds: [],
      loading: false,
      endpointGetAll: '/docResign',
      endpointDelete: '/docResign/:id',
      endpointGetStaff: '/staff',

      required,
      min,
      minValue,

      filterPositionId: 1,
      filterPositionItems: [],

      loadingQuestionnaire: false,
      questionItems: [],
      answers: [],

      urlDocument: '',
      urlOther: '',
      fieldUrl: [],

      fieldResign: [],

      resignOptions: [
        { value: 'resign', title: 'Resign' },
        { value: 'dismissed', title: 'Diberhentikan' },
      ],

      fields: [
        { key: 'data_last_job.full_name', label: 'Nama' },
        { key: 'data_last_job.position_name', label: 'Posisi' },
        {
          key: 'data_last_job.talent.last_job_resign.last_partner.user.full_name',
          label: 'Partner Terakhir',
          sortable: false,
        },
        {
          key: 'data_last_job.talent.last_job_resign.last_team_lead.full_name',
          label: 'Talent Lead Terakhir',
          formatter: value => (value || 'No'),
        },
        {
          key: 'status_off',
          label: 'Status Off',
          sortable: false,
          badge: [
            {
              'non job': 'light-secondary',
              hired: 'Hired',
              registered: 'Registered',
              selected: 'Selected',
              dismissed: 'Diberhentikan',
              resign: 'Resign',
              4: 'Training',
              5: 'Graduated',
              6: 'Remedial',
            },
            {
              'non job': 'light-secondary',
              hired: 'light-warning',
              registered: 'light-primary',
              selected: 'light-success',
              dismissed: 'primary',
              resign: 'warning',
              4: 'light-info',
              5: 'light-graduated',
              6: 'light-danger',
            },
          ],
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
      return this.$route.meta.routeEditResign !== undefined
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
    showDocument(data) {
      this.urlDocument = data.item.url_document
      this.urlOther = data.item.url_other
    },
    filterResign() {
      const params = {
        status: this.fieldResign,
      }
      this.$http.get(this.endpointGetAll, params).then(response => {
        const { data } = response.data.data
        if (this.fieldResign === null) {
          this.fieldResign = ''
        }
        this.refreshTable()
        return data
      })
    },
    tableProvider() {
      const params = {
        keyword: this.filter,
        position_id: this.filterPositionId,
        page: this.currentPage,
        limit: this.perPage,
        sort: this.sortBy,
        direction: this.sortDirection,
      }
      if (this.fieldResign) Object.assign(params, { status: this.fieldResign.value })
      const result = this.$http.get(this.endpointGetAll, {
        params,
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
      return result
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
      return id
    },
    toggleModal() {
      this.$refs.formFilterDropdown.toggle()
    },
    async toggleModalQuestionnaire(item) {
      this.$refs.questionnaireModal.toggle()

      this.loadingQuestionnaire = true

      await this.loadAnswer(item.talent.user_id)
      await this.loadQuestionnaire(item.position_id)

      this.loadingQuestionnaire = false
    },
    handleOk(event) {
      event.preventDefault()
      this.submitFilter()
    },
    resetForm() {
      this.filterEducation = ''
      this.filterExperienced = ''
      this.filterExperienceYear = ''
    },
    submitFilter() {
      this.$refs.formRules.validate().then(success => {
        if (success) {
          this.refreshTable()

          this.$nextTick(() => {
            this.$refs.formFilterDropdown.toggle()
          })
        }
      })
    },
    loadAnswer(userId) {
      return this.$http.get(`/questionnaireAnswer/${userId}`)
        .then(async response => {
          const { data } = response.data

          this.answers = data.map(item => ({ ...item, questionnaire_id: Number(item.questionnaire_id) }))
        })
    },
    loadQuestionnaire(positionId) {
      return this.$http.get('/questionnaire', {
        params: {
          position_id: positionId,
          sort: 'name',
          direction: 'asc',
        },
      })
        .then(async response => {
          const { data } = response.data
          this.questionItems = data.map(item => {
            const answerIndex = this.answers.map(answer => answer.questionnaire_id).indexOf(item.id)
            return { ...item, value: answerIndex !== -1 ? this.answers[answerIndex].answer : '' }
          })
        })
    },
  },
}
</script>

<style scoped>
  [dir] .card .dropdown-filter {
    padding: 1.5rem;
  }
  [dir] .area-url {
    cursor: pointer;
  }
</style>
