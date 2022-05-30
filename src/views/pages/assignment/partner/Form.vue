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
    <b-card-actions
      ref="formCard"
      :title="`${showMode ? 'Detil' : 'Tambah'} ${$route.meta.name.singular}`"
      no-actions
    >
      <validation-observer ref="formRules">
        <b-row>
          <b-col md="6">
            <!-- form -->
            <b-form>
              <b-row>
                <b-col md="12">
                  <b-form-group
                    label="No SK"
                    label-cols-md="4"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="No SK"
                      rules="required|min:3"
                    >
                      <b-form-input
                        v-model="skNumbers"
                        :state="
                          errors.length > 0 || submitErrors.name ? false : null
                        "
                        type="text"
                        :disabled="showMode"
                      />
                      <small class="text-danger">{{
                        errors[0] || submitErrors.name
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group
                    label="Dokumen"
                    label-cols-md="4"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Dokumen"
                      rules="required|url"
                    >
                      <b-form-input
                        v-model="documentsUrl"
                        :state="
                          errors.length > 0 || submitErrors.name ? false : null
                        "
                        type="url"
                        :disabled="showMode"
                      />
                      <small class="text-danger">{{
                        errors[0] || submitErrors.name
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group
                    label="Tanggal"
                    label-cols-md="4"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Tanggal"
                      rules="required"
                    >
                      <flat-pickr
                        v-model="releaseDates"
                        class="form-control"
                        :config="{
                          altInput: true,
                          altFormat: 'j/n/Y',
                          dateFormat: 'Y-m-d',
                        }"
                        :disabled="showMode"
                      />
                      <small class="text-danger">{{
                        errors[0] || submitErrors.name
                      }}</small>
                    </validation-provider>
                    <br>
                    <small class="text-default">
                      * Tanggal Talent mulai di hire oleh Partner
                    </small>
                  </b-form-group>
                  <hr>
                </b-col>
              </b-row>
            </b-form>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            md="12"
            class="mt-2"
          >
            <b-row>
              <b-col md="1">
                <b>List Team Lead</b>
              </b-col>
              <b-col md="4">
                <b>Team Lead</b>
              </b-col>
              <b-col md="4">
                <b>Kantor</b>
              </b-col>
              <b-col
                v-if="!showMode"
                md="1"
              >
                <b>Aksi</b>
              </b-col>
            </b-row>
            <template v-if="!showMode">
              <b-row
                v-for="(assignment, index) in assignments"
                :key="index"
                class="mt-1"
              >
                <b-col
                  md="4"
                  offset-md="1"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Team Lead"
                    rules="required"
                  >
                    <v-select
                      v-model="assignment.staff"
                      label="full_name"
                      :options="teamLeadItems"
                      placeholder="Ketik untuk mencari..."
                      @search="onSearchTeamLead"
                    >
                      <li
                        v-if="hasMoreTeamLead"
                        slot="list-footer"
                        class="
                          vs__dropdown-option vs__dropdown-option--disabled
                        "
                      >
                        <feather-icon
                          icon="MoreHorizontalIcon"
                          size="16"
                        />
                      </li>
                    </v-select>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-col>
                <b-col md="4">
                  <validation-provider
                    #default="{ errors }"
                    name="Kantor"
                    rules="required"
                  >
                    <v-select
                      v-model="assignment.office"
                      label="office_name"
                      :options="officeItems"
                      placeholder="Ketik untuk mencari..."
                      @search="onSearchOffice"
                    >
                      <li
                        v-if="hasMoreOffice"
                        slot="list-footer"
                        class="
                          vs__dropdown-option vs__dropdown-option--disabled
                        "
                      >
                        <feather-icon
                          icon="MoreHorizontalIcon"
                          size="16"
                        />
                      </li>
                    </v-select>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-col>
                <b-col md="1">
                  <b-button
                    variant="outline-danger"
                    type="button"
                    @click="removeAssignment(index)"
                  >
                    <feather-icon
                      icon="Trash2Icon"
                      size="18"
                    />
                  </b-button>
                </b-col>
                <b-col md="12">
                  <hr>
                </b-col>
              </b-row>
            </template>
            <template v-else>
              <b-row
                v-for="(assignment, index) in assignments"
                :key="index"
                class="mt-1"
              >
                <b-col
                  md="4"
                  offset-md="1"
                >
                  <p>{{ assignment.staff.user.full_name }}</p>
                </b-col>
                <b-col md="4">
                  <p>{{ assignment.office.office_name }}</p>
                </b-col>
                <b-col md="12">
                  <hr>
                </b-col>
              </b-row>
            </template>
            <b-row>
              <b-col
                offset-md="9"
                md="2"
              >
                <b-button
                  v-if="!showMode"
                  variant="outline-danger"
                  type="button"
                  @click="addAssignment"
                >
                  Tambah Kolom
                </b-button>
              </b-col>
            </b-row>
          </b-col>
          <b-col md="12">
            <b-button
              v-if="!showMode"
              variant="primary"
              type="submit"
              class="mr-50"
              :disabled="loadingSubmit"
              @click.prevent="submit"
            >
              <b-spinner
                v-if="loadingSubmit"
                small
              />
              Assign
            </b-button>
          </b-col>
        </b-row>
      </validation-observer>
    </b-card-actions>
    <modal
      ref="confirmationModalComponent"
      :sk-numbers="skNumbers"
      :documents-url="documentsUrl"
      :release-dates="releaseDates"
      :assignments="assignments"
      :loading-submit="loadingSubmit"
      :save="save"
    />
  </b-overlay>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BFormInput,
  BFormGroup,
  BForm,
  BRow,
  BCol,
  BButton,
  BSpinner,
  VBTooltip,
  BOverlay,
} from 'bootstrap-vue'
import { required, integer, min } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import Ripple from 'vue-ripple-directive'
import flatPickr from 'vue-flatpickr-component'
import vSelect from 'vue-select'
import Modal from './Modal.vue'

export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  components: {
    BCardActions,
    ValidationProvider,
    ValidationObserver,
    BFormInput,
    BFormGroup,
    BForm,
    BRow,
    BCol,
    BButton,
    BSpinner,
    flatPickr,
    vSelect,
    BOverlay,
    Modal,
  },
  data() {
    return {
      id: this.$route.params.id,
      loadingSubmit: false,
      submitErrors: '',
      loading: false,

      required,
      min,
      integer,

      hasMoreTeamLead: false,
      teamLeadItems: [],
      hasMoreOffice: false,
      officeItems: [],

      skNumbers: '',
      releaseDates: null,
      document_type: 'partner assignment',
      documentsUrl: '',
      assignments: [],
    }
  },
  computed: {
    method() {
      return this.editMode ? 'put' : 'post'
    },
    showMode() {
      return this.id !== undefined
    },
    successText() {
      return `Satu ${this.$route.meta.name.singular} berhasil ditambah`
    },
    endpoint() {
      const endpoint = '/skDocument/skTeamleadOfficeAssignment'
      return this.showMode ? `${endpoint}/${this.id}` : endpoint
    },
  },
  async mounted() {
    this.loading = true
    if (this.showMode) {
      await this.loadForm()
    } else {
      this.loadTeamLeads()
      this.loadOffices()
    }
    this.loading = false
  },
  methods: {
    onSearchTeamLead(search, loading) {
      if (search.length) {
        this.searchTeamLead(loading, search, this)
      }
    },
    searchTeamLead: _.debounce((loading, search, that) => {
      loading(true)
      that.loadTeamLeads(search).finally(() => loading(false))
    }, 500),
    loadTeamLeads(search) {
      return this.$http
        .get('/leader', {
          params: {
            keyword: search,
            page: 1,
            limit: 5,
            sort: 'name',
            direction: 'asc',
            account_status: 'active',
          },
        })
        .then(async response => {
          const { data } = response.data.data
          this.teamLeadItems = this.assignments.map(
            assignment => assignment.office,
          )
          data.forEach(res => {
            this.teamLeadItems.push(res)
          })
          this.teamLeadItems = this.teamLeadItems.filter(
            (item, val) => this.teamLeadItems.indexOf(item) === val && item?.id,
          )
          this.hasMoreTeamLead = response.data.data.total > this.teamLeadItems.length
        })
    },
    onSearchOffice(search, loading) {
      if (search.length) {
        this.searchOffice(loading, search, this)
      }
    },
    searchOffice: _.debounce((loading, search, that) => {
      loading(true)
      that.loadOffices(search).finally(() => loading(false))
    }, 500),
    loadOffices(search) {
      return this.$http
        .post(
          '/office/pagination',
          {},
          {
            params: {
              office_name: search,
              page: 1,
              limit: 5,
              sort: 'name',
              direction: 'asc',
            },
          },
        )
        .then(async response => {
          const { data } = response.data.data
          this.officeItems = this.assignments.map(
            assignment => assignment.office,
          )
          data.forEach(res => {
            this.officeItems.push(res)
          })
          this.officeItems = this.officeItems.filter(
            (item, val) => this.officeItems.indexOf(item) === val && item?.id,
          )
          this.hasMoreOffice = response.data.data.total > this.officeItems.length
        })
    },
    addAssignment() {
      this.assignments.push({})
    },
    removeAssignment(index) {
      this.assignments.splice(index, 1)
    },
    submit() {
      this.$refs.formRules.validate().then(success => {
        if (success && this.assignments.length) {
          this.$refs.confirmationModalComponent.show()
        } else {
          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Failed',
                text:
                  'Check kembali isian kamu, pastikan ada satu assignment yang diinputkan',
                variant: 'danger',
                attachment: 'AlertTriangleIcon',
              },
            },
            { timeout: 2500 },
          )
        }
      })
    },
    save() {
      this.$refs.formRules.validate().then(success => {
        if (success) {
          this.loadingSubmit = true

          const data = {
            _method: this.method,
            skNumbers: this.skNumbers,
            releaseDates: this.releaseDates,
            document_type: this.document_type,
            documentsUrl: this.documentsUrl,
            assignments: this.assignments.map(assignment => ({
              office_id: assignment.office.id,
              staff_id: assignment.staff.staff.id,
            })),
          }

          this.$http
            .post(this.endpoint, data)
            .then(response => {
              if (!response.data.success) {
                this.$toast(
                  {
                    component: ToastificationContent,
                    props: {
                      title: 'Failed',
                      text: response.data.message,
                      variant: 'danger',
                      attachment: 'AlertTriangleIcon',
                    },
                  },
                  { timeout: 2500 },
                )
              } else {
                this.$toast(
                  {
                    component: ToastificationContent,
                    props: {
                      title: 'Success',
                      text: this.successText,
                      variant: 'success',
                      attachment: 'CheckIcon',
                    },
                  },
                  { timeout: 2500 },
                )
                this.$router.push({ name: this.$route.meta.navActiveLink })
              }
            })
            .catch(error => {
              if (!error.response?.data.status) {
                this.$toast(
                  {
                    component: ToastificationContent,
                    props: {
                      title: 'Failed',
                      text: error.response.data.message,
                      variant: 'danger',
                      attachment: 'AlertTriangleIcon',
                    },
                  },
                  { timeout: 2500 },
                )
              }
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
    loadForm() {
      return this.$http
        .get(this.endpoint)
        .then(async response => {
          const { data } = response.data
          this.skNumbers = data.skNumbers
          this.releaseDates = data.releaseDates
          this.documentsUrl = data.documentsUrl
          this.assignments = data.sk_teamlead_office_assignments
        })
        .catch(error => {
          if (!error.response?.data.status) {
            this.$toast(
              {
                component: ToastificationContent,
                props: {
                  title: 'Failed',
                  text: error.response.data.message,
                  variant: 'danger',
                  attachment: 'AlertTriangleIcon',
                },
              },
              { timeout: 2500 },
            )
          }
        })
        .finally(() => {
          this.$refs.formCard.showLoading = false
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
