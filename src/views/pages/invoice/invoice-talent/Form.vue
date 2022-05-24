<template>
  <b-overlay
    variant="light"
    :show="loading"
    spinner-variant="primary"
    blur="0"
    opacity=".5"
    rounded="sm"
  >
    <b-card-actions
      ref="formCard"
      :title="`Detail ${$route.meta.name.singular}`"
      no-actions
    >
      <!-- form -->
      <validation-observer ref="formRules">
        <b-row>
          <b-col md="6">
            <b-col md="12">
              <b-form-group
                label="Status"
                label-cols-md="4"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Status"
                  rules="required"
                >
                  <b-form-input
                    v-model="status"
                    :state="
                      errors.length > 0 || submitErrors.name ? false : null
                    "
                    type="text"
                    disabled
                  />
                  <small class="text-danger">{{
                    errors[0] || submitErrors.name
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="No. Invoice"
                label-cols-md="4"
              >
                <validation-provider
                  #default="{ errors }"
                  name="No Invoice"
                  rules="required"
                >
                  <b-form-input
                    v-model="invoice_no"
                    :state="
                      errors.length > 0 || submitErrors.name ? false : null
                    "
                    type="text"
                    disabled
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Judul Invoice"
                label-cols-md="4"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Judul Invoice"
                  rules="required"
                >
                  <b-form-input
                    v-model="title"
                    :state="
                      errors.length > 0 || submitErrors.name ? false : null
                    "
                    type="text"
                    disabled
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Partner"
                label-cols-md="4"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Partner"
                  rules="required"
                >
                  <v-select
                    v-model="partner"
                    label="label"
                    :options="partnerItems"
                    placeholder="Ketik untuk mencari..."
                    :filterable="false"
                    :disabled="disabledInput"
                    @search="onSearchPartner"
                  >
                    <li
                      v-if="hasMorePartner"
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
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Periode"
                label-cols-md="4"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Periode"
                  rules="required"
                >
                  <flat-pickr
                    v-model="invoicePeriod"
                    class="form-control"
                    :config="{
                      altInput: true,
                      altFormat: 'F Y',
                      dateFormat: 'Y-m-01',
                      ...configs.monthSelect,
                    }"
                    :disabled="disabledInput"
                  />
                  <small class="text-danger">{{
                    errors[0] || submitErrors.name
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="2">
            <b>Data Tagihan</b>
          </b-col>
          <b-col md="2">
            <b>Nama Talent</b>
          </b-col>
          <b-col md="2">
            <b>Tanggal Assign</b>
          </b-col>
          <b-col md="2">
            <b>Total Gaji</b>
          </b-col>
          <b-col md="2">
            <b>Gaji Bersih</b>
          </b-col>
          <b-col md="2">
            <b>Status Disburse</b>
          </b-col>
        </b-row>
        <b-row
          v-for="(talent, index) in talents"
          :key="`talent-${index}`"
        >
          <b-col
            md="2"
            offset-md="2"
          >
            <p class="mt-1">
              {{ talent.full_name }}
            </p>
          </b-col>
          <b-col md="2">
            <validation-provider
              #default="{ errors }"
              :name="`Tanggal Assign Talent ke-${index + 1}`"
              rules="required"
            >
              <flat-pickr
                v-model="talent.hired_at"
                class="form-control mt-1"
                :config="{
                  altInput: true,
                  altFormat: 'd M Y',
                  dateFormat: 'Y-m-d',
                }"
                :disabled="disabledInput"
              />
              <small class="text-danger">{{
                errors[0] || submitErrors.name
              }}</small>
            </validation-provider>
          </b-col>
          <b-col md="2">
            <validation-provider
              #default="{ errors }"
              :name="`Total Gaji Talent ke-${index + 1}`"
              rules="required"
            >
              <money
                v-model="talent.total_gross_salary"
                v-bind="money"
                :state="errors.length > 0 || submitErrors.name ? false : null"
                class="mt-1 form-control"
                :disabled="disabledInput"
                @blur.native="talentChanged(index)"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-col>
          <b-col md="2">
            <validation-provider
              #default="{ errors }"
              :name="`Gaji Bersih Talent ke-${index + 1}`"
              rules="required"
            >
              <money
                v-model="talent.total_net_salary"
                v-bind="money"
                :state="errors.length > 0 || submitErrors.name ? false : null"
                class="mt-1 form-control"
                disabled
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-col>
          <b-col md="2 pt-2">
            <b-badge
              v-if="talent.disbursement"
              :variant="
                getDisbursementStyle(
                  talent.disbursement.disbursement_xendit_status
                )
              "
            >
              {{ talent.disbursement.disbursement_xendit_status }}
            </b-badge>
            <b-badge
              v-else
              variant="light-secondary"
            >
              N/A
            </b-badge>
          </b-col>
        </b-row>
        <b-row
          v-if="wasGetTalent && !talents.length"
          class="mt-2"
        >
          <b-col
            offset-md="2"
            md="10"
          >
            <h5>Data Talent tidak tersedia</h5>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            md="8"
            offset-md="2"
            class="mt-1"
          >
            <h3>Total Tagihan</h3>
            <b class="text-danger">{{ totalFee | rupiah }}</b>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            md="12"
            class="mt-2"
          >
            <hr>
            <b-button
              variant="outline-danger"
              type="button"
              class="mr-50"
              tag="router-link"
              :to="{ name: 'invoice-talent' }"
            >
              Kembali
            </b-button>
            <b-button
              v-show="!disabledInput"
              variant="info"
              type="submit"
              class="mr-50"
              :disabled="loadingSubmit"
              @click.prevent="submit('draft')"
            >
              <b-spinner
                v-if="loadingSubmit"
                small
              />
              Save
            </b-button>
            <b-button
              v-if="id && !disabledInput"
              v-show="id && !disabledInput"
              variant="success"
              type="submit"
              class="mr-50"
              :disabled="loadingSubmit"
              @click.prevent="publish"
            >
              <b-spinner
                v-if="loadingSubmit"
                small
              />
              Publish
            </b-button>
            <b-button
              v-if="id && invoice_status == 1"
              v-show="id && invoice_status == 1"
              variant="success"
              type="submit"
              class="mr-50"
              :disabled="loadingSubmit"
              @click.prevent="pay(2)"
            >
              <b-spinner
                v-if="loadingSubmit"
                small
              />
              Lunaskan
            </b-button>
            <b-button
              v-if="id && invoice_status == 1"
              v-show="id && invoice_status == 1"
              variant="danger"
              type="submit"
              class="mr-50"
              :disabled="loadingSubmit"
              @click.prevent="pay(3)"
            >
              <b-spinner
                v-if="loadingSubmit"
                small
              />
              Batalkan
            </b-button>
          </b-col>
        </b-row>
      </validation-observer>
    </b-card-actions>
  </b-overlay>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BFormInput,
  BFormGroup,
  BRow,
  BCol,
  BButton,
  BSpinner,
  VBTooltip,
  BOverlay,
  BBadge,
} from 'bootstrap-vue'
import { required, min, minValue } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import MonthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import { Money } from 'v-money'

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
    BRow,
    BCol,
    BButton,
    BOverlay,
    BSpinner,
    BBadge,
    Money,
    flatPickr,
    vSelect,
  },
  data() {
    return {
      id: this.$route.params.id,
      loading: true,
      loadingSubmit: false,
      submitErrors: '',

      required,
      min,
      minValue,
      configs: {
        monthSelect: {
          plugins: [
            new MonthSelectPlugin({
              shorthand: true,
              dateFormat: 'Y-m',
            }),
          ],
        },
      },

      sharingFee: {},
      sharingFee2: {},
      invoice_id: 0,
      invoice_no: 0,
      invoicePeriod: '',
      partnerItems: [],
      hasMorePartner: false,
      partner: '',
      wasGetTalent: false,
      talents: [],
      invoice_status: '',
      money: {
        thousands: '.',
        prefix: 'Rp ',
        precision: 0,
        masked: false,
      },
    }
  },
  computed: {
    method() {
      return this.publishMode ? 'put' : 'post'
    },
    publishMode() {
      return this.id !== undefined
    },
    successText() {
      return this.publishMode
        ? `Satu ${this.$route.meta.name.singular} berhasil diperbaharui`
        : `Satu ${this.$route.meta.name.singular} berhasil ditambah`
    },
    totalFee() {
      return this.talents.reduce(
        (total, talent) => total + parseInt(talent.total_gross_salary, 0),
        0,
      )
    },
    disabledInput() {
      return this.invoice_status > 0
    },
    status() {
      let statusText
      switch (this.invoice_status) {
        case 1:
          statusText = 'publish'
          break
        case 2:
          statusText = 'paid'
          break
        case 3:
          statusText = 'cancel'
          break
        default:
          statusText = 'draft'
          break
      }
      return statusText
    },
    title() {
      const noPartner = this.partner?.no_partner || ''
      const fullName = this.partner?.full_name || ''
      const period = new Date(this.invoicePeriod)
      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ]
      return `Invoice Talent Partner ${noPartner} ${fullName} ${months[
        period.getMonth()
      ] || ''} ${period.getFullYear() || ''}`
    },
  },
  watch: {
    partner(newVal) {
      if (newVal.username) this.getTalents()
    },
  },
  async created() {
    this.getSharingFee()
    await this.loadPartners()
    if (this.publishMode) await this.loadForm()
  },
  methods: {
    getSharingFee() {
      this.$http.get('talentSharingFee').then(res => {
        // const data = res.data
        // this.sharingFee = data
        const data = res.data?.data[0]
        this.sharingFee = data
        const data2 = res.data?.data[1]
        this.sharingFee2 = data2
      })
    },
    talentChanged(index) {
      const talent = this.talents[index]
      let percentageCutFee = 0
      if (talent.total_gross_salary >= this.sharingFee.minimum_income) {
        switch (this.sharingFee.sharing_fee_type) {
          case 'percentage':
            percentageCutFee = (talent.total_gross_salary * this.sharingFee.sharing_fee_value)
              / 100

            talent.total_net_salary = percentageCutFee > this.sharingFee.max_nominal_sharing_fee
              ? talent.total_gross_salary
                  - this.sharingFee.max_nominal_sharing_fee - this.sharingFee2.sharing_fee_value
              : talent.total_gross_salary - percentageCutFee - this.sharingFee2.sharing_fee_value
            break

          default:
            talent.total_net_salary = talent.total_gross_salary - this.sharingFee2.sharing_fee_value
            // talent.total_net_salary = talent.total_gross_salary - finalDisburst
            break
        }
      } else if (talent.total_gross_salary >= this.sharingFee2.minimum_income) {
        // talent.total_net_salary = talent.total_gross_salary
        switch (this.sharingFee2.sharing_fee_type) {
          case 'rp':
            talent.total_net_salary = talent.total_gross_salary - this.sharingFee2.sharing_fee_value
            break

          default:
            // talent.total_net_salary = talent.total_gross_salary - finalDisburst
            break
        }
      } else {
        talent.total_net_salary = talent.total_gross_salary
      }

      talent.total_net_salary = Math.round(talent.total_net_salary)
      this.talents[index] = talent
    },
    onSearchPartner(search, loading) {
      if (search.length) {
        this.searchPartner(loading, search, this)
      }
    },
    searchPartner: _.debounce((loading, search, that) => {
      loading(true)
      that.loadPartners(search).finally(() => loading(false))
    }, 500),
    loadPartners(search) {
      this.loading = true
      const key = /^-?\d+$/.test(search) ? 'no_partner' : 'name'

      return this.$http
        .get('/user/partner/pagination', {
          params: {
            [key]: search,
            page: 1,
            limit: 5,
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data.data
          for (let i = 0; i < data.length; i += 1) {
            data[i].label = `${data[i].no_partner} - ${data[i].full_name}`
          }
          this.partnerItems = data
          this.hasMorePartner = response.data.data.total > this.partnerItems.length
        })
        .finally(() => {
          this.loading = false
        })
    },
    getTalents() {
      if (this.partner && this.partner) {
        this.$http
          .get(
            `/talent?limit=1000&status=hired&no_partner=${this.partner.no_partner}`,
          )
          .then(res => {
            const { data } = res.data.data
            this.talents = data.map(value => ({
              user_id: value.id,
              description: '-',
              hired_at: value.talent.hired_at,
              total_gross_salary: 0,
              total_net_salary: 0,
              full_name: value.full_name,
            }))
            this.wasGetTalent = true
          })
      }
    },
    validateTalents() {
      const errorTalent = this.talents.find(
        talent => !talent.hired_at
          || !talent.total_gross_salary
          || !talent.total_net_salary,
      )
      return errorTalent !== undefined
    },
    save() {
      return new Promise((resolve, reject) => {
        this.$refs.formRules.validate().then(success => {
          if (success && !this.validateTalents()) {
            this.loadingSubmit = true

            const data = {
              invoice_id: this.invoice_id,
              user_requester_id: this.$store.state.auth.userData.id,
              user_to_id: this.partner.id,
              title: this.title,
              description: '',
              invoice_period: `${this.invoicePeriod}`,
              items: this.talents,
            }

            this.$http
              .post('/invoice/gaji/saveDraft', data)
              .then(res => {
                if (res.data.status) {
                  resolve(res)
                } else {
                  reject(res)
                }
              })
              .catch(error => {
                this.loadingSubmit = false
                reject(error)
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
          } else {
            this.$toast(
              {
                component: ToastificationContent,
                props: {
                  title: 'Failed',
                  text:
                    'Periksa kembali inputan Anda, pastikan Tanggal Assign, Total Gaji dan Gaji Bersih sudah terisi',
                  variant: 'danger',
                  attachment: 'AlertTriangleIcon',
                },
              },
              { timeout: 2500 },
            )
          }
        })
      })
    },
    submit() {
      this.save()
        .then(() => {
          this.$router.push({
            name: 'invoice-talent',
          })
        })
        .catch(error => {
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
        })
    },
    publish() {
      this.loadingSubmit = true
      this.save()
        .then(() => {
          this.loading = true
          this.$http
            .post(`/invoice/admin/publish/${this.id}`, {
              _method: 'PUT',
            })
            .then(res => {
              if (res.data.status) {
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
                this.$router.push({
                  name: 'invoice-talent',
                })
              } else {
                this.$toast(
                  {
                    component: ToastificationContent,
                    props: {
                      title: 'Failed',
                      text: res.data.message,
                      variant: 'danger',
                      attachment: 'AlertTriangleIcon',
                    },
                  },
                  { timeout: 2500 },
                )
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
              this.loading = false
            })
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
    },
    loadForm() {
      this.loading = true

      return this.$http
        .get(`/invoice/detail/gaji/${this.id}`)
        .then(response => {
          const { data } = response.data

          // mapping response into local state
          this.invoice_status = data.status
          this.title = data.title
          this.partner = data.user_to
          this.partner.label = `${this.partner.no_partner} - ${this.partner.full_name}`
          this.invoicePeriod = data.invoice_period
          this.invoice_no = data.invoice_km_id
          this.invoice_id = data.id
          this.talents = data.invoice_detail_gaji.map(value => ({
            user_id: value.sdm_data.id,
            description: '-',
            hired_at: value.hired_at,
            total_gross_salary: value.total_gross_salary,
            total_net_salary: Math.round(value.total_net_salary),
            full_name: value.sdm_data.full_name,
            disbursement: value.disbursement,
          }))
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
          this.loading = false
        })
    },
    getDisbursementStyle(status = '') {
      let style = ''
      switch (status) {
        case 'PENDING':
          style = 'light-warning'
          break
        case 'COMPLETED':
          style = 'light-success'
          break
        case 'FAILED':
          style = 'light-danger'
          break
        default:
          style = ''
          break
      }
      return style
    },
    pay(status) {
      this.$swal({
        title: 'Anda yakin?',
        text: `Status invoice akan berubah menjadi ${
          status === 2 ? 'Lunas' : 'Cancel'
        }`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Ubah!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.updateStatus(status)
        }
      })
    },
    updateStatus(status = 3) {
      this.loading = true
      this.$http
        .post('/invoice/update', {
          invoice_id: this.id,
          status,
        })
        .then(res => {
          if (res.data.status) {
            this.$toast(
              {
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  text: 'Status invoice berhasil diperbaharui',
                  variant: 'success',
                  attachment: 'CheckIcon',
                },
              },
              { timeout: 2500 },
            )
            this.$router.push({
              name: 'invoice-talent',
            })
          } else {
            this.$toast(
              {
                component: ToastificationContent,
                props: {
                  title: 'Failed',
                  text: res.data.message,
                  variant: 'danger',
                  attachment: 'AlertTriangleIcon',
                },
              },
              { timeout: 2500 },
            )
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
              Object.entries(error.response.data.data).map(([key, value]) => [
                key,
                value[0],
              ]),
            )
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
