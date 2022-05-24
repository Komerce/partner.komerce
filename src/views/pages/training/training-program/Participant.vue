<template>
  <div>
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
            class="regency-relative"
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
            <template #cell(status)="data">
              <b-badge
                v-if="data.value === 'graduated'"
                variant="light-success"
              >
                Graduated
              </b-badge>
              <b-badge
                v-else-if="data.value === 'remedial'"
                variant="light-danger"
              >
                Remedial
              </b-badge>
              <span v-else>-</span>
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
            <template #cell(score)="data">
              <div class="text-nowrap d-flex align-items-center">
                {{ data.value || '-' }}
                <b-button
                  v-if="data.item.is_approved === '0'"
                  size="sm"
                  class="btn-icon ml-50"
                  variant="flat-warning"
                  @click="setupScoreModal(data.item)"
                >
                  <feather-icon
                    icon="EditIcon"
                  />
                </b-button>
              </div>
            </template>
            <template #cell(validation_file)="data">
              <div
                v-if="data.value"
                class="text-nowrap d-flex align-items-center"
              >
                <b-link
                  :href="data.value"
                  target="_blank"
                  class="text-body mr-50"
                >
                  ...{{ data.value.substr(data.value.length - 15) }}
                </b-link>
                <b-button
                  v-if="data.value && data.item.is_approved === '0'"
                  size="sm"
                  class="btn-icon"
                  variant="flat-warning"
                  @click="setupValidationFileModal(data.item)"
                >
                  <feather-icon
                    icon="EditIcon"
                  />
                </b-button>
              </div>
              <b-button
                v-else-if="data.item.score"
                size="sm"
                variant="outline-primary"
                @click="setupValidationFileModal(data.item)"
              >
                <span class="mr-50">Pilih file</span>
                <feather-icon
                  icon="UploadIcon"
                />
              </b-button>
              <span v-else>-</span>
            </template>
            <template #cell(is_approved)="data">
              <span
                v-if="data.value === '1'"
                class="d-flex align-items-center"
              >
                Disetujui
                <feather-icon
                  class="ml-50"
                  icon="LockIcon"
                />
              </span>
              <b-button
                v-else
                size="sm"
                :disabled="!data.item.validation_file || data.item.status === 'remedial'"
                variant="outline-primary"
                @click="confirmApprove(data.item)"
              >
                Approve
              </b-button>
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

    <b-button
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      v-b-tooltip.hover.left="'Tambah Baru'"
      :variant="loadingForm ? 'secondary' : 'primary'"
      class="btn-icon btn-floating rounded-circle"
      size="lg"
      :disabled="loadingForm"
      @click="toggleAddParticipantModal"
    >
      <feather-icon
        icon="PlusIcon"
        size="16"
      />
    </b-button>

    <b-modal
      ref="addParticipantModel"
      size="lg"
      :title="`Tambah Partisipan${positionName ? ` (${positionName})` : ''}`"
      body-class="overflow-hidden p-0"
      ok-only
      ok-title="Accept"
      centered
      no-stacking
    >
      <add-participant
        ref="cardTable"
        :filters="filters"
        :show-filter="toggleFilterModal"
        :on-row-selected="onRowSelected"
        :selected="selected"
      />
      <template #modal-footer>
        <b-form-row class="align-items-center w-100">
          <b-col md>
            <b-button
              size="sm"
              variant="flat-danger"
              class="px-50 ml-n50"
              :class="{ 'd-none': !selected.length }"
              @click="resetSelection"
            >
              Reset ({{ selected.length }})
            </b-button>
          </b-col>
          <b-col cols="auto">
            <b-button
              variant="light"
              @click="toggleAddParticipantModal"
            >
              Cancel
            </b-button>
          </b-col>
          <b-col cols="auto">
            <b-button
              variant="primary"
              :disabled="loadingSubmit || !selected.length"
              @click.prevent="submit"
            >
              <b-spinner
                v-if="loadingSubmit"
                small
              />
              Terapkan
            </b-button>
          </b-col>
        </b-form-row>
      </template>
    </b-modal>

    <b-modal
      ref="filterModal"
      title="Filter"
      centered
      no-stacking
      @hide="toggleAddParticipantModal"
    >
      <validation-observer ref="formRules">
        <b-form @submit.stop.prevent="submitFilter">
          <b-form-group label="Level">
            <b-form-checkbox-group
              v-model="statuses"
              :options="statusOptions"
              class="demo-inline-spacing"
            />
          </b-form-group>
          <b-form-group
            label="Kota"
            label-cols-md="12"
          >
            <validation-provider
              #default="{ errors }"
              name="Kota"
            >
              <v-select
                v-model="regencyId"
                label="name"
                :reduce="option => option.id"
                :options="regencyItems"
                :state="errors.length > 0 ? false:null"
                :filterable="false"
                transition=""
                placeholder="Ketik untuk mencari..."
                @search="onSearchRegency"
              >
                <li
                  v-if="hasMoreRegency"
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
              @click="toggleAddParticipantModal"
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
      ref="formScoreModal"
      title="Ubah Score"
      :ok-title="loadingSubmit ? 'Submitting..' : 'Submit'"
      :ok-disabled="loadingSubmit"
      ok-variant="warning"
      cancel-variant="light"
      centered
      @hidden="resetModalScore"
      @ok="handleOkScore"
    >
      <validation-observer ref="formScoreRules">
        <b-form @submit.stop.prevent="submitScore">
          <b-form-group
            label="Score"
            label-cols-md="12"
          >
            <validation-provider
              #default="{ errors }"
              name="Score"
              rules="required|min_value:1"
            >
              <b-form-input
                v-model="score"
                type="number"
                :state="errors.length > 0 || submitErrors.score ? false:null"
              />
              <small class="text-danger">{{ errors[0] || submitErrors.score }}</small>
            </validation-provider>
          </b-form-group>
        </b-form>
      </validation-observer>
    </b-modal>

    <b-modal
      ref="formValidationFileModal"
      title="Ubah Validasi"
      :ok-title="loadingSubmit ? 'Submitting..' : 'Submit'"
      :ok-disabled="loadingSubmit"
      ok-variant="warning"
      cancel-variant="light"
      centered
      @hidden="resetModalValidationFile"
      @ok="handleOkValidationFile"
    >
      <validation-observer ref="formValidationFileRules">
        <b-form @submit.stop.prevent="submitValidationFile">
          <b-form-group
            label="File validasi"
            label-cols-md="12"
          >
            <validation-provider
              #default="{ errors }"
              name="File validasi"
              rules="required"
            >
              <b-form-file
                v-model="validationFile"
                :state="errors.length > 0 ? false:null"
                :placeholder="validationFile ?
                  validationFile.name
                  : `Pilih atau drop file disini...`"
                drop-placeholder="Drop file disini..."
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-form>
      </validation-observer>
    </b-modal>
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
  BSpinner,
  BFormGroup,
  BFormSelect,
  BPagination,
  BCardBody,
  BOverlay,
  BLink,
  BFormCheckboxGroup,
  VBTooltip, BFormRow, BForm, BFormInput, BFormFile,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { min, required } from '@core/utils/validations/validations'
import AddParticipant from './AddParticipant.vue'

export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    BFormRow,
    BRow,
    BCol,

    BForm,
    BButton,
    BTable,
    BAvatar,
    BFormFile,
    BSpinner,
    BBadge,
    BFormGroup,
    BFormSelect,
    BPagination,
    BOverlay,
    BCardBody,
    AddParticipant,
    BFormCheckboxGroup,
    BFormInput,
    BLink,
    vSelect,
  },
  mixins: [dateFormat],
  data() {
    return {
      trainingProgramId: this.$route.params.id,
      trainingProgram: '',
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
      selected: [],
      loading: false,
      loadingForm: false,
      endpointGetAll: '/trainingProgramParticipant',
      endpointDelete: '/trainingProgramParticipant/:id',

      loadingSubmit: false,
      submitErrors: '',

      required,
      min,

      id: '',
      talentId: '',
      positionId: '',
      positionName: '',
      validationFile: null,

      statuses: [],
      filterStatuses: [],
      regencyId: 3303,
      filterRegencyId: 3303,
      regencyItems: [],
      hasMoreRegency: false,

      fields: [
        { key: 'talent.user.full_name', label: 'Nama' },
        { key: 'id', label: 'Id' },
        { key: 'score', label: 'Score' },
        { key: 'status', label: 'Status' },
        { key: 'validation_file', label: 'Validasi' },
        { key: 'is_approved', label: 'Persetujuan' },
      ],

      statusOptions: [
        { text: 'Selected', value: 'selected' },
        { text: 'Hired', value: 'hired' },
        { text: 'Non Job', value: 'non job' },
      ],
    }
  },
  computed: {
    filters() {
      return {
        regency_id: this.filterRegencyId,
        status: this.filterStatuses.join(','),
        position_id: this.positionId,
      }
    },
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
    endpoint() {
      const endpoint = '/trainingProgram'
      return `${endpoint}/${this.trainingProgramId}`
    },
  },
  watch: {
    filterRegencyId(value) {
      this.regencyId = value
    },
    filterStatuses(value) {
      this.statuses = value
    },
  },
  mounted() {
    if (this.regencyId) {
      this.regencyItems = [{ id: this.regencyId, name: 'KABUPATEN PURBALINGGA' }]
    } else {
      this.loadRegencies()
    }
    this.loadForm()
  },
  methods: {
    tableProvider() {
      return this.$http.get(this.endpointGetAll, {
        params: {
          keyword: this.filter,
          page: this.currentPage,
          limit: this.perPage,
          sort: this.sortBy,
          direction: this.sortDirection,
          training_program_id: this.trainingProgramId,
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
    submit() {
      this.loadingSubmit = true

      const formData = new FormData()

      this.selected.forEach(item => {
        formData.append('training_program_id[]', this.trainingProgramId)
        formData.append('talent_id[]', item.talent.id)
        formData.append('score[]', '')
        formData.append('status[]', '')
        // formData.append('validation_file[]', null)
        formData.append('is_approved[]', '0')
      })

      this.$http.post('/trainingProgramParticipantBulk', formData)
        .then(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Success',
              text: this.successText,
              variant: 'success',
              icon: 'CheckIcon',
            },
          }, { timeout: 2500 })

          this.$nextTick(() => {
            this.toggleAddParticipantModal()
          })

          this.refreshTable()
        })
        .catch(error => {
          if (error.response.status === 422) {
            this.submitErrors = Object.fromEntries(
              Object.entries(error.response.data.data).map(
                ([key, value]) => [key, value[0]],
              ),
            )
          }
        })
        .finally(() => {
          this.loadingSubmit = false
        })
    },
    loadForm() {
      this.loadingForm = true

      return this.$http.get(this.endpoint)
        .then(async response => {
          const { data } = response.data

          let status = ''
          switch (data.level) {
            case 'basic': status = 'selected'; break
            case 'specific': status = 'hired'; break
            case 'mature': status = 'non job'; break
            default: status = 3
          }

          this.trainingProgram = data
          this.positionId = data.position_id
          this.positionName = data.position.position_name
          this.filterStatuses = [status]
        })
        .finally(() => {
          this.loadingForm = false
        })
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    confirmApprove(data) {
      this.$swal({
        title: 'Anda yakin?',
        text: 'Setujui hasil pelatihan pelatihan partisipan ini. Aksi ini tidak dapat dibatalkan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Setujui!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.approve(data)
        }
      })
    },
    approve(data) {
      this.loading = true

      const formData = {
        _method: 'put',
        id: data.id,
        training_program_id: data.training_program_id,
        talent_id: data.talent_id,
        is_approved: '1',
        score: data.score,
        status: data.status,
      }

      this.$http.post(`/trainingProgramParticipant/${data.id}`, formData)
        .then(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Success',
              text: 'Satu partisipan berhasil disetujui',
              variant: 'success',
              icon: 'CheckIcon',
            },
          }, { timeout: 2500 })

          this.loading = false

          this.$nextTick(() => {
            this.refreshTable()
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    confirmDelete(data) {
      this.$swal({
        title: 'Anda yakin?',
        text: 'Hapus satu partisipan dari tabel. Aksi ini tidak dapat dibatalkan.',
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
    toggleAddParticipantModal() {
      this.$refs.addParticipantModel.toggle()
    },
    toggleFilterModal() {
      this.$refs.filterModal.toggle()
    },
    handleOk(event) {
      event.preventDefault()
      this.submitFilter()
    },
    resetForm() {
      this.filterRegencyId = ''
      this.filterStatuses = ''
    },
    submitFilter() {
      this.$refs.formRules.validate().then(success => {
        if (success) {
          this.filterRegencyId = this.regencyId
          this.filterStatuses = this.statuses

          this.$nextTick(() => {
            this.$refs.addParticipantModel.toggle()
          })
        }
      })
    },
    setupScoreModal(data) {
      this.score = data.score
      this.id = data.id
      this.talentId = data.talent_id

      this.$refs.formScoreModal.toggle()
    },
    resetModalScore() {
      this.id = ''
      this.talentId = ''
      this.score = ''
      this.submitErrors = ''
    },
    handleOkScore(event) {
      event.preventDefault()
      this.submitScore()
    },
    submitScore() {
      this.$refs.formScoreRules.validate().then(success => {
        if (success) {
          this.loadingSubmit = true

          const data = {
            _method: 'put',
            id: this.id,
            training_program_id: this.trainingProgramId,
            talent_id: this.talentId,
            score: this.score,
            status: this.score >= Number(this.trainingProgram.curriculum.passing_grade) ? 'graduated' : 'remedial',
          }

          this.$http.post(`/trainingProgramParticipant/${this.id}`, data)
            .then(() => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  text: 'Score satu partisipan berhasil diperbaharui',
                  variant: 'success',
                  icon: 'CheckIcon',
                },
              }, { timeout: 2500 })

              this.$nextTick(() => {
                this.$refs.formScoreModal.toggle()
              })

              this.refreshTable()
            })
            .catch(error => {
              if (error.response.status === 422) {
                this.submitErrors = Object.fromEntries(
                  Object.entries(error.response.data.data).map(
                    ([key, value]) => [key, value[0]],
                  ),
                )
              }
            })
            .finally(() => {
              this.loadingSubmit = false
            })
        }
      })
    },
    setupValidationFileModal(data) {
      this.validationFile = null
      this.id = data.id
      this.talentId = data.talent_id

      this.$refs.formValidationFileModal.toggle()
    },
    resetModalValidationFile() {
      this.id = ''
      this.talentId = ''
      this.validationFile = null
      this.submitErrors = ''
    },
    handleOkValidationFile(event) {
      event.preventDefault()
      this.submitValidationFile()
    },
    submitValidationFile() {
      this.$refs.formValidationFileRules.validate().then(success => {
        if (success) {
          this.loadingSubmit = true

          const formData = new FormData()

          formData.append('_method', 'put')
          formData.append('id', this.id)
          formData.append('training_program_id', this.trainingProgramId)
          formData.append('talent_id', this.talentId)
          formData.append('validation_file', this.validationFile)

          this.$http.post(`/trainingProgramParticipant/${this.id}`, formData)
            .then(() => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  text: 'File validasi satu partisipan berhasil diperbaharui',
                  variant: 'success',
                  icon: 'CheckIcon',
                },
              }, { timeout: 2500 })

              this.$nextTick(() => {
                this.$refs.formValidationFileModal.toggle()
              })

              this.refreshTable()
            })
            .catch(error => {
              if (error.response.status === 422) {
                this.submitErrors = Object.fromEntries(
                  Object.entries(error.response.data.data).map(
                    ([key, value]) => [key, value[0]],
                  ),
                )
              }
            })
            .finally(() => {
              this.loadingSubmit = false
            })
        }
      })
    },
    onSearchRegency(search, loading) {
      if (search.length) {
        this.searchRegency(loading, search, this)
      }
    },
    searchRegency: _.debounce((loading, search, that) => {
      loading(true)
      that.loadRegencies(search).finally(() => loading(false))
    }, 500),
    loadRegencies(search) {
      return this.$http.get('/region/regency', {
        params: {
          keyword: search ?? 'jakarta',
          page: 1,
          limit: 5,
          sort: 'name',
          direction: 'asc',
        },
      })
        .then(async response => {
          const { data } = response.data
          this.regencyItems = data.slice(0, 5)
          this.hasMoreRegency = search ? data.length > this.regencyItems.length : true
        })
    },
    onRowSelected(row) {
      const index = this.selected.map(item => item.id).indexOf(row.id)

      if (index !== -1) {
        this.selected.splice(index, 1)
        return
      }

      this.selected.push(row)
    },
    resetSelection() {
      this.selected = []
    },
  },
}
</script>
