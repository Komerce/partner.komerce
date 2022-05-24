<template>
  <b-overlay
    variant="light"
    :show="loading"
    spinner-variant="primary"
    blur="0"
    opacity=".5"
    rounded="sm"
    class="p-2"
  >
    <b-row
      v-if="!loading || experienceItems.length"
      class="mb-5"
    >
      <b-col md="6">
        <!-- form -->
        <validation-observer ref="formRules">
          <b-form>
            <b-row>
              <b-col md="12">
                <b-row>
                  <b-col>
                    <h3 class="mb-2">
                      Pengalaman
                    </h3>
                  </b-col>
                  <b-col cols="auto">
                    <b-button
                      v-b-modal.form-modal
                      variant="flat-primary"
                      class="btn-icon mt-n25"
                    >
                      <feather-icon icon="PlusIcon" />
                      Tambah
                    </b-button>
                  </b-col>
                </b-row>

                <div
                  v-if="!experienceItems.length"
                  class="d-flex align-items-center text-secondary"
                >
                  <feather-icon
                    icon="InfoIcon"
                    class="mr-50"
                    size="16"
                  />
                  Belum ada pengalaman
                </div>
                <app-timeline class="mt-1">
                  <app-timeline-item
                    v-for="item in experienceItems"
                    :key="`experience-${item.id}`"
                    variant="primary"
                  >
                    <b-form-row>
                      <b-col col>
                        <h6>
                          {{
                            item.partner_category || item.position
                              ? `${
                                item.partner_category
                                  ? `Menangani produk ${item.partner_category.partner_category_name} sebagai `
                                  : ''
                              }${item.position.position_name}`
                              : ''
                          }}
                        </h6>
                      </b-col>
                      <b-col cols="auto">
                        <div v-if="isDeleted(item.id)">
                          <h6 class="text-danger">
                            Deleted
                          </h6>
                        </div>
                        <div
                          v-else
                          class="mt-n50"
                        >
                          <b-button
                            class="btn-icon mr-25"
                            size="sm"
                            variant="flat-warning"
                            @click="setupModal(item)"
                          >
                            <feather-icon icon="EditIcon" />
                          </b-button>
                          <b-button
                            class="btn-icon"
                            size="sm"
                            variant="flat-danger"
                            @click="confirmDelete(item)"
                          >
                            <feather-icon icon="Trash2Icon" />
                          </b-button>
                        </div>
                      </b-col>
                    </b-form-row>
                    <p>{{ dateRangeFormat(item.start_at, item.end_at) }}</p>
                  </app-timeline-item>
                </app-timeline>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-col>
    </b-row>
    <div v-else>
      <br><br><br><br><br>
    </div>
    <b-modal
      id="form-modal"
      ref="formModal"
      :title="`${editMode ? 'Ubah' : 'Tambah'} Pengalaman`"
      :ok-title="loadingSubmit ? 'Submitting..' : 'Submit'"
      :ok-disabled="loadingSubmit"
      :ok-variant="editMode ? 'warning' : 'primary'"
      :no-enforce-focus="true"
      cancel-variant="light"
      centered
      @show="loadModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <validation-observer ref="formRules">
        <b-form @submit.stop.prevent="submit">
          <b-form-group
            label="Posisi"
            label-cols-md="12"
          >
            <validation-provider
              #default="{ errors }"
              name="Posisi"
              rules="required"
            >
              <v-select
                v-model="positionId"
                label="position_name"
                :reduce="option => option.id"
                :options="positionItems"
                :state="errors.length > 0 ? false : null"
                placeholder="Ketik untuk mencari..."
              >
                <li
                  v-if="hasMorePosition"
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
          <b-form-group
            label="Sektor bisnis"
            label-cols-md="12"
          >
            <validation-provider
              #default="{ errors }"
              name="Sektor bisnis"
              rules="required"
            >
              <v-select
                v-model="partnerCategoryId"
                label="partner_category_name"
                :reduce="option => option.id"
                :options="partnerCategoryItems"
                :state="errors.length > 0 ? false : null"
                transition=""
                placeholder="Ketik untuk mencari..."
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
          <b-form-group
            label="Tanggal mulai"
            label-cols-md="12"
          >
            <flat-pickr
              v-model="startDate"
              class="form-control"
              :config="{
                altInput: true,
                altFormat: 'j/n/Y',
                dateFormat: 'Y-m-d',
              }"
            />
            <small class="text-danger">{{ submitErrors.start_at }}</small>
          </b-form-group>
          <b-form-group
            label="Tanggal selesai"
            label-cols-md="12"
          >
            <flat-pickr
              v-model="endDate"
              class="form-control"
              :config="{
                altInput: true,
                altFormat: 'j/n/Y',
                dateFormat: 'Y-m-d',
              }"
            />
            <small class="text-danger">{{ submitErrors.start_at }}</small>
          </b-form-group>
        </b-form>
      </validation-observer>
    </b-modal>
  </b-overlay>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BFormInput,
  BFormGroup,
  BForm,
  BRow,
  BCol,
  BButton,
  BSpinner,
  BOverlay,
  BModal,
  BFormRow,
} from 'bootstrap-vue'
import { required, min, minValue } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { heightFade } from '@core/directives/animations'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BFormInput,
    BFormGroup,
    // BFormTextarea,
    BForm,
    BRow,
    BCol,
    BButton,
    BSpinner,
    BOverlay,
    AppTimeline,
    AppTimelineItem,
    BModal,
    BFormRow,
    flatPickr,
    vSelect,
  },
  directives: {
    heightFade,
  },
  data() {
    return {
      id: this.$route.params.id || this.$route.query.id,
      selfRegister: this.$route.name === 'talent-register',
      loading: false,
      loadingSubmit: false,
      submitErrors: '',
      endpointDelete: '/experience/:id',

      experienceId: '',
      talent: '',
      experienceItems: [],
      positionId: '',
      partnerCategoryId: '',
      date: null,
      partnerCategoryItems: [],
      positionItems: [],
      hasMorePosition: false,
      startDate: null,
      endDate: null,
      deletedIds: [],

      required,
      min,
      minValue,
    }
  },
  computed: {
    method() {
      return this.editMode ? 'put' : 'post'
    },
    editMode() {
      return this.experienceId
    },
    successText() {
      return this.editMode
        ? `Satu ${this.$route.meta.name.singular} berhasil diperbaharui`
        : `Satu ${this.$route.meta.name.singular} berhasil ditambah`
    },
    endpoint() {
      return '/experience'
    },
    endpointSubmit() {
      const endpoint = '/experience'
      return this.editMode ? `${endpoint}/${this.experienceId}` : endpoint
    },
  },
  watch: {
    startDate(newValue) {
      if (!this.endDate) return
      const diff = Date.parse(this.endDate) - Date.parse(newValue)
      if (diff < 0) this.endDate = newValue
    },
    endDate(newValue) {
      if (!this.startDate) return
      const diff = Date.parse(newValue) - Date.parse(this.startDate)
      if (diff < 0) this.startDate = newValue
    },
  },
  async mounted() {
    this.loading = true

    await this.loadPositions()
    await this.loadTalent()
    await this.loadForm()

    this.loading = false
  },
  methods: {
    loadForm() {
      return this.$http
        .get(this.endpoint, {
          params: {
            talent_id: this.talent.talent.id,
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data.data

          this.experienceItems = data
        })
    },
    loadTalent() {
      return this.$http.get(`/talent/${this.id}`).then(async response => {
        const { data } = response.data

        this.talent = data
      })
    },
    setupModal(data) {
      this.positionId = Number(data.position_id)

      if (data.partner_category) {
        this.partnerCategoryId = Number(data.partner_category_id)
        this.partnerCategoryItems = [data.partner_category]
        this.loadPartnerCategories(data.partner_category.partner_category_name)
      } else {
        this.loadPartnerCategories()
      }

      this.startDate = data.start_at
      this.endDate = data.end_at
      this.experienceId = data.id

      this.$refs.formModal.toggle()
    },
    resetModal() {
      this.experienceId = ''
      this.positionId = ''
      this.partnerCategoryId = ''
      this.partnerCategoryItems = []
      this.startDate = ''
      this.endDate = ''

      this.submitErrors = ''
    },
    loadModal() {
      if (!this.experienceId) {
        this.loadPartnerCategories()
      }
    },
    handleOk(event) {
      event.preventDefault()
      this.submit()
    },
    submit() {
      this.$refs.formRules.validate().then(success => {
        if (success) {
          this.loadingSubmit = true

          const data = {
            _method: this.method,
            talent_id: this.talent.talent.id,
            position_id: this.positionId,
            partner_category_id: this.partnerCategoryId,
            start_at: this.startDate,
            end_at: this.endDate,
          }

          if (this.editMode) Object.assign(data, { id: this.id })

          this.$http
            .post(this.endpointSubmit, data)
            .then(() => {
              this.$toast(
                {
                  component: ToastificationContent,
                  props: {
                    title: 'Success',
                    text: this.successText,
                    variant: 'success',
                    icon: 'CheckIcon',
                  },
                },
                { timeout: 2500 },
              )

              this.$nextTick(() => {
                this.$refs.formModal.toggle()
              })

              this.$nextTick(async () => {
                this.loading = true
                await this.loadForm()
                this.loading = false
              })
            })
            .catch(error => {
              if (error.response.status === 422) {
                this.submitErrors = Object.fromEntries(
                  Object.entries(
                    error.response.data.data,
                  ).map(([key, value]) => [key, value[0]]),
                )
              }
            })
            .finally(() => {
              this.loadingSubmit = false
            })
        }
      })
    },
    loadPartnerCategories() {
      return this.$http
        .post(
          '/partnerCategory',
          {},
          {
            params: {
              sort: 'name',
              direction: 'asc',
            },
          },
        )
        .then(async response => {
          const { data } = response.data
          this.partnerCategoryItems = data
        })
    },
    loadPositions() {
      return this.$http
        .post(
          '/position',
          {},
          {
            params: {
              is_division_external: 1,
              sort: 'name',
              direction: 'asc',
            },
          },
        )
        .then(async response => {
          const { data } = response.data
          this.positionItems = Object.keys(data).map(key => data[key])
        })
    },
    dateRangeFormat(startAt, endAt = null) {
      if (!startAt || startAt === '0000-00-00 00:00:00') return '-'

      const startDate = Date.parse(startAt)
      const endDate = Date.parse(endAt)

      if (startDate > endDate) return '-'

      const yearDays = 365
      const yearToleranceDays = yearDays - 30
      const monthDays = 30
      const monthToleranceDays = monthDays - 7
      const weekDays = 7
      const weekToleranceDays = weekDays - 2

      const dateDiff = (endAt ? endDate : new Date()) - startDate
      let dayDiff = Math.ceil(dateDiff / (24 * 60 * 60 * 1000))
      let text = ''

      for (let i = 0; i < 2; i += 1) {
        if (dayDiff <= 0) break

        if (i > 0) text += ', '

        if (dayDiff >= yearToleranceDays) {
          let range = Math.floor(dayDiff / yearDays)
          dayDiff -= yearDays * range

          if (dayDiff >= yearToleranceDays) {
            dayDiff -= yearDays
            range += 1
          }

          text += `${range} tahun`
          if (dayDiff === 0) break
        } else if (dayDiff >= monthToleranceDays) {
          let range = Math.floor(dayDiff / monthDays)
          dayDiff -= monthDays * range

          if (dayDiff >= monthToleranceDays) {
            dayDiff -= monthDays
            range += 1
          }

          text += `${range} bulan`
          break
        } else if (dayDiff >= weekToleranceDays) {
          let range = Math.floor(dayDiff / weekDays)
          dayDiff -= weekDays * range

          if (dayDiff >= weekToleranceDays) {
            dayDiff -= weekDays
            range += 1
          }

          text += `${range} minggu`
          break
        } else {
          text += `${Math.ceil(dayDiff)} hari`
          break
        }
      }

      return text
    },
    confirmDelete(data) {
      this.$swal({
        title: 'Anda yakin?',
        text:
          'Hapus satu pengalaman dari daftar. Aksi ini tidak dapat dibatalkan.',
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
      const endpoint = this.endpointDelete.replace(/:id/g, data.id)

      this.$http
        .delete(endpoint)
        .then(() => {
          this.deletedIds.push(data.id)

          setTimeout(() => {
            const index = this.items.indexOf(data)
            this.items.splice(index, 1)
            this.total -= 1
          }, 3000)
        })
        .finally(() => {
          this.loading = false
        })
    },
    isDeleted(id) {
      return this.deletedIds.includes(id)
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
