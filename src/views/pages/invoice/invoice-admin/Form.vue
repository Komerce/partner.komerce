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
            <b>Nominal</b>
          </b-col>
          <b-col md="2" />
        </b-row>
        <b-row
          v-for="(talent, index) in talents"
          :key="`talent-${index}`"
        >
          <b-col
            md="2"
            offset-md="2"
          >
            <p
              v-if="talent.talent_user"
              class="mt-1"
            >
              {{ talent.talent_user.full_name }}
            </p>
            <p
              v-else
              class="mt-1"
            >
              -
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
              :name="`Nominal Talent ke-${index + 1}`"
              rules="required"
            >
              <money
                v-model="talent.total_fee"
                v-bind="money"
                :state="errors.length > 0 || submitErrors.name ? false : null"
                class="mt-1 form-control"
                :disabled="disabledInput"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-col>
          <b-col md="2">
            <b-row>
              <b-button
                v-show="!disabledInput"
                variant="outline-danger"
                type="button"
                size="sm"
                class="mt-1"
                @click="talents.splice(index, 1)"
              >
                <feather-icon
                  icon="Trash2Icon"
                  size="18"
                />
              </b-button>
            </b-row>
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
              :to="{ name: 'invoice-admin' }"
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
    flatPickr,
    vSelect,
    Money,
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
        (total, talent) => total + parseInt(talent.total_fee, 0),
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
      return `Invoice Admin Partner ${noPartner} ${fullName} ${months[
        period.getMonth()
      ] || ''} ${period.getFullYear() || ''}`
    },
  },
  watch: {
    partner() {
      this.getTalents()
    },
    invoicePeriod() {
      this.getTalents()
    },
  },
  async created() {
    await this.loadPartners()
    if (this.publishMode) await this.loadForm()
  },
  methods: {
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
      const key = /^-?\d+$/.test(search) ? 'no_partner' : 'name'
      this.loading = true

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
      if (this.partner && this.invoicePeriod && !this.id) {
        const { invoicePeriod } = this
        this.$http
          .get(
            `/invoice/admin/getInvoiceAdminEstimation?partner_id=${this.partner.partner_detail.id}&period=${invoicePeriod}`,
          )
          .then(res => {
            if (!res?.data.status) {
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
            const { talent_admin_fee } = res.data.data
            this.talents = talent_admin_fee.map(value => ({
              user_id: value.talent_user.id,
              description: '',
              hired_at: value.hire_at,
              total_fee: value.actual_talent_fee,
              talent_user: value.talent_user,
            }))
            this.wasGetTalent = true
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
      }
    },
    validateTalents() {
      const errorTalent = this.talents.find(
        talent => !talent.hired_at || !talent.total_fee,
      )
      return errorTalent !== undefined
    },
    submit() {
      this.save()
        .then(() => {
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
            name: 'invoice-admin',
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
              .post('/invoice/admin/saveDraft', data)
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
                    'Periksa kembali inputan Anda, pastikan tanggal assign dan nominal sudah terisi',
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
                  name: 'invoice-admin',
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
        .get(`/invoice/detail/admin/${this.id}`)
        .then(response => {
          const { data } = response.data

          // mapping response into local state
          this.invoice_status = data.status
          this.title = data.title
          this.partner = data.user_to
          this.partner.label = `${this.partner.no_partner} ${this.partner.full_name}`
          this.invoicePeriod = data.invoice_period
          this.invoice_no = data.invoice_km_id
          this.invoice_id = data.id
          this.talents = data.invoice_detail_admin.map(admin => ({
            user_id: admin.user_id,
            description: admin.description,
            hired_at: admin.hired_at,
            total_fee: admin.total_fee,
            talent_user: admin.user,
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
              name: 'invoice-admin',
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
