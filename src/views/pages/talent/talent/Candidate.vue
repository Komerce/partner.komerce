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
          <b-col>
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
                          <!-- Pendidikan Terakhir -->
                          <b-col md="5">
                            <b-form-group
                              label="Pendidikan Terakhir"
                              label-for="item-name"
                            >
                              <validation-provider
                                #default="{ errors }"
                                name="Education"
                              >
                                <v-select
                                  v-model="filterEducation"
                                  :options="educationOptions"
                                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                  label="title"
                                  @input="filterSelectEducation"
                                />
                                <small class="text-danger">{{ errors[0] }}</small>
                              </validation-provider>
                            </b-form-group>
                          </b-col>

                          <!-- Pengalaman Kerja -->
                          <b-col
                            md="6"
                            class="d-flex justify-content-center"
                          >
                            <validation-observer>
                              <b-form-group
                                label="Pengalaman kerja"
                              >
                                <validation-provider
                                  #default="{ errors }"
                                  name="Experience Status"
                                >
                                  <b-form-radio-group
                                    v-model="filterExperienced"
                                    class="mt-50"
                                    :options="experienceStatusOptions"
                                    @change="check(experienceStatusOptions)"
                                  />
                                  <small class="text-danger">{{ errors[0] }}</small>
                                </validation-provider>
                              </b-form-group>
                            </validation-observer>
                          </b-col>
                        </b-row>
                      </b-form>
                    </validation-observer>
                  </div>
                </div>
                <!-- End Filter dropdown -->
              </b-card>
            </b-collapse>
          </b-col>

          <!-- Sortir -->
          <b-col
            md="4"
            class="sortir-talent"
          >
            <b-collapse
              id="collapse-1-inner"
              class="mt-2 text-right"
            >
              <b-card class="mb-0 text-left">
                <b-col md="10">
                  <b-form-group
                    label="Lama Pengalaman"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Lama Pengalaman"
                      rules="required"
                    >
                      <v-select
                        v-model="fieldSortirExperienceLong"
                        :options="experienceLongOptions"
                        label="title"
                        :state="errors.length > 0 ? false:null"
                        @input="sortirExperienceLong"
                      />
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </b-card>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row>
          <!-- Lama Bekerja -->
          <transition name="fade">
            <b-col
              v-if="filterExperienced"
              md="3"
              class="ml-2"
            >
              <b-form-group
                label="Lama bekerja"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Experience Year"
                >
                  <v-select
                    v-model="filterExperienceYear"
                    :options="experienceYearOptions"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    label="title"
                    @input="filterByExperienceYear"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </transition>
        </b-row>

        <!-- sortir mobile -->
        <b-row class="justify-content-end mt-1 sortir-talent-mobile">
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
                    label="Lama Pengalaman"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Lama Pengalaman"
                      rules="required"
                    >
                      <v-select
                        v-model="fieldSortirExperienceLong"
                        :options="experienceLongOptions"
                        label="title"
                        :state="errors.length > 0 ? false:null"
                        @input="sortirExperienceLong"
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
              class="mr-50"
              size="sm"
              variant="outline-primary"
              @click="toggleModalQuestionnaire(data.item)"
            >
              Lihat
            </b-button>
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
                label="Pendidikan terakhir"
                label-cols-md="4"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Education"
                >
                  <b-form-select
                    v-model="filterEducation"
                    :options="educationOptions"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Pengalaman kerja"
                label-cols-md="4"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Experience Status"
                >
                  <b-form-radio-group
                    v-model="filterExperienced"
                    class="mt-50"
                    :options="experienceStatusOptions"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <transition name="fade">
              <b-col
                v-if="filterExperienced"
                md="12"
              >
                <b-form-group
                  label="Lama bekerja"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Experience Year"
                  >
                    <b-form-select
                      v-model="filterExperienceYear"
                      :options="experienceYearOptions"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </transition>
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
        id="questionnaire-modal"
        ref="questionnaireModal"
        title="Kuesioner"
        ok-only
        centered
        ok-title="Tutup"
        ok-variant="light"
      >
        <div v-if="loadingQuestionnaire">
          <b-overlay
            variant="light"
            :show="loadingQuestionnaire"
            spinner-variant="primary"
            blur="0"
            opacity=".5"
            rounded="sm"
          >
            <br><br><br><br><br>
          </b-overlay>
        </div>
        <div
          v-for="(item, index) in questionItems"
          v-else
          :key="`question-${item.id}`"
          class="my-1 mb-2"
        >
          <div class="text-secondary mb-50">
            {{ index + 1 }}. {{ item.question }}
          </div>
          <div v-if="item.value">
            {{ item.value }}
          </div>
          <div v-else>
            -
          </div>
        </div>
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
  VBTooltip, BModal, BFormRow, BForm, BFormRadioGroup,
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
    BFormRadioGroup,
    BCardActionsContainer,
    BModal,
    BForm,
    vSelect,
  },
  mixins: [heightTransition],
  data() {
    return {
      selectEducation: '',
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
      endpointGetAll: '/talent',
      endpointDelete: '/talent/:id',
      endpointGetStaff: '/staff',

      required,
      min,
      minValue,

      filterPositionId: 1,
      filterPositionItems: [],
      filterEducation: '',
      filterExperienced: '',
      filterExperiencedPrevious: '',
      previouslySelected: '',
      filterExperiencedIsTrue: true,
      filterExperienceYear: '',

      fieldSortirExperienceLong: '',

      loadingQuestionnaire: false,
      questionItems: [],
      answers: [],

      educationOptions: [
        { value: 'SD', title: 'SD' },
        { value: 'SMP', title: 'SMP' },
        { value: 'SMA/SMK', title: 'SMA/SMK' },
        { value: 'Sarjana', title: 'Sarjana' },
      ],

      experienceStatusOptions: [
        { text: 'Ada', value: 1 },
        { text: 'Tidak ada', value: 0 },
        { text: 'Default', value: '' },
      ],
      experienceLongOptions: [
        { title: 'Terlama', value: '1' },
        { title: 'Paling Sedikit', value: '2' },
      ],
      experienceYearOptions: [
        { title: '< 1 year', value: '< 1 year' },
        { title: '1 years', value: '1 years' },
        { title: '2 years', value: '2 years' },
        { title: '3 years', value: '3 years' },
      ],

      fields: [
        { key: 'talent.id', label: 'Id' },
        { key: 'full_name', label: 'Nama' },
        {
          key: 'talent.education',
          label: 'Pendidikan',
          sortable: false,
          formatter: value => (value || '-'),
        },
        // {
        //   key: 'talent.has_work_experience',
        //   label: 'Pengalaman Kerja',
        //   sortable: false,
        //   formatter: value => (Number(value) ? 'Yes' : 'No'),
        // },
        {
          key: 'talent.year_experience',
          label: 'Pengalaman Kerja',
          formatter: value => (value || 'No'),
        },
        {
          key: 'talent.status',
          label: 'Status',
          sortable: false,
          badge: [
            {
              'non job': 'light-secondary',
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
        { key: 'questionnaire', label: 'Kuesioner', class: 'col-action' },
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
  watch: {
    filterPositionId() {
      this.refreshTable()
    },
  },
  mounted() {
    this.loadFilterPositions()
  },
  methods: {
    check(experienceStatusOptions) {
      experienceStatusOptions.forEach(items => {
        if (items.value === 1) {
          this.$http.get(this.endpointGetAll, {
            params: {
              status: 'registered,selected',
            },
          }).then(response => {
            const { data } = response.data.data
            this.refreshTable()
            return data
          })
        }
        if (items.value === 0) {
          this.$http.get(this.endpointGetAll, {
            params: {
              status: 'registered,selected',
              has_work_experience: '0',
            },
          }).then(response => {
            const { data } = response.data.data
            this.refreshTable()
            return data
          })
        }
      })
    },
    filterSelectEducation() {
      const params = {
        keyword: this.filter,
        position_id: this.filterPositionId,
        status: 'registered,selected',
        page: this.currentPage,
        limit: this.perPage,
        sort: this.sortBy,
        direction: this.sortDirection,
      }
      const getEducation = this.$http.get(this.endpointGetAll, {
        params,
      }).then(response => {
        const { data } = response.data.data
        return data
      })
      this.refreshTable()
      return { getEducation }
    },
    filterByExperienceYear() {
      const params = {
        keyword: this.filter,
        position_id: this.filterPositionId,
        has_work_experience: this.filterExperienced,
        status: 'registered,selected',
        page: this.currentPage,
        limit: this.perPage,
        sort: this.sortBy,
        direction: this.sortDirection,
      }
      const getExperienceYear = this.$http.get(this.endpointGetAll, {
        params,
      }).then(response => {
        const { data } = response.data.data
        return data
      })
      this.refreshTable()
      return { getExperienceYear }
    },
    sortirExperienceLong() {
      const params = {
        position_id: this.filterPositionId,
        status: 'registered,selected',
        page: this.currentPage,
        limit: this.perPage,
        sort: this.sortBy,
        direction: this.sortDirection,
      }

      const getResult = this.$http.get(this.endpointGetAll, {
        params,
      }).then(response => {
        const { data } = response.data.data
        return data
      })
      this.refreshTable()
      return getResult
    },
    tableProvider() {
      const params = {
        keyword: this.filter,
        position_id: this.filterPositionId,
        status: 'registered,selected',
        page: this.currentPage,
        limit: this.perPage,
        sort: this.sortBy,
        direction: this.sortDirection,
      }

      if (this.filterEducation) Object.assign(params, { education: this.filterEducation.value })
      if (this.filterExperienced === 0) Object.assign(params, { has_work_experience: '0' })
      if (this.filterExperienced) Object.assign(params, { has_work_experience: this.filterExperienced })
      if (this.filterExperienceYear) Object.assign(params, { year_experience: this.filterExperienceYear.value })
      if (this.fieldSortirExperienceLong) Object.assign(params, { sortExperience: this.fieldSortirExperienceLong.value })
      return this.$http.get(this.endpointGetAll, {
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
</style>
