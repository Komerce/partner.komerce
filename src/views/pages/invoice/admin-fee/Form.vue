<template>
  <b-card-actions
    ref="formCard"
    :title="`${editMode ? 'Ubah' : 'Tambah'} ${$route.meta.name.singular}`"
    no-actions
  >
    <b-row>
      <b-col md="6">
        <!-- form -->
        <validation-observer ref="formRules">
          <b-form>
            <b-row>
              <b-col md="12">
                <b-form-group
                  label="Posisi"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Posisi"
                    rules="required"
                  >
                    <v-select
                      v-model="position_id"
                      label="position_name"
                      :reduce="option => option.id"
                      :options="positionItems"
                      placeholder="Ketik untuk mencari..."
                      :filterable="true"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Deskripsi"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Deskripsi"
                    rules="required"
                  >
                    <b-form-textarea
                      v-model="description"
                      :state="
                        errors.length > 0 || submitErrors.description
                          ? false
                          : null
                      "
                    />
                    <small class="text-danger">{{
                      errors[0] || submitErrors.description
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Jenis Potongan"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Jenis Potongan"
                    rules="required"
                  >
                    <v-select
                      v-model="admin_fee_discount_type"
                      :reduce="option => option.value"
                      label="label"
                      :options="sharing_fee_type_option"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Biaya Standar"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Biaya Standar"
                    rules="required|integer"
                  >
                    <money
                      v-model="admin_fee"
                      v-bind="money"
                      class="form-control"
                      :state="
                        errors.length > 0 || submitErrors.admin_fee
                          ? false
                          : null
                      "
                    />
                    <small class="text-danger">{{
                      errors[0] || submitErrors.admin_fee
                    }}</small>
                  </validation-provider>
                </b-form-group>
                <hr>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="5">
                <b>Jumlah Talent Minimal</b>
              </b-col>
              <b-col md="5">
                <b>Biaya Potongan</b>
              </b-col>
            </b-row>
            <b-row
              v-for="(
                talent_admin_fee_discount, index
              ) in talent_admin_fee_discounts"
              :key="`talent_admin_fee_discounts_${index}`"
              class="mt-1"
            >
              <b-col md="5">
                <validation-provider
                  #default="{ errors }"
                  :name="`Jumlah Talent ke-${index + 1}`"
                  rules="required|integer"
                >
                  <b-form-input
                    v-model="talent_admin_fee_discount.minimum_total_talent"
                    type="number"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-col>
              <b-col md="5">
                <validation-provider
                  #default="{ errors }"
                  :name="`Jumlah Biaya Talent ke-${index + 1}`"
                  :rules="`required|integer|max_value:${admin_fee}`"
                >
                  <money
                    v-if="admin_fee_discount_type === 'rp'"
                    v-model="talent_admin_fee_discount.admin_fee_discount_value"
                    v-bind="money"
                    class="form-control"
                  />
                  <b-form-input
                    v-else
                    v-model="talent_admin_fee_discount.admin_fee_discount_value"
                    type="number"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-col>
              <b-col md="2">
                <b-button
                  variant="outline-danger"
                  type="button"
                  @click="removeTalentAdminFeeDiscounts(index)"
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
            <b-row>
              <b-col class="text-right">
                <b-button
                  variant="outline-danger"
                  type="button"
                  @click="addTalentAdminFeeDiscounts"
                >
                  Tambah Kolom
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col
                md="12"
                class="mt-2"
              >
                <b-button
                  :variant="editMode ? 'warning' : 'primary'"
                  type="submit"
                  class="mr-50"
                  :disabled="loadingSubmit"
                  @click.prevent="submit"
                >
                  <b-spinner
                    v-if="loadingSubmit"
                    small
                  />
                  Submit
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-col>
    </b-row>
  </b-card-actions>
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
  BFormTextarea,
} from 'bootstrap-vue'
import { required, integer, maxValue } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
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
    BForm,
    BRow,
    BCol,
    BButton,
    BSpinner,
    BFormTextarea,
    vSelect,
    Money,
  },
  data() {
    return {
      id: this.$route.params.id,
      loadingSubmit: false,
      submitErrors: '',

      required,
      integer,
      maxValue,

      hasMorePosition: false,
      positionItems: [],
      position_id: '',
      description: '',
      admin_fee: '',
      sharing_fee_type_option: [
        {
          value: 'percentage',
          label: 'Presentase %',
        },
        {
          value: 'rp',
          label: 'Nominal Rp',
        },
      ],
      admin_fee_discount_type: '',
      talent_admin_fee_discounts: [],
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
      return this.editMode ? 'put' : 'post'
    },
    editMode() {
      return this.id !== undefined
    },
    successText() {
      return this.editMode
        ? `Satu ${this.$route.meta.name.singular} berhasil diperbaharui`
        : `Satu ${this.$route.meta.name.singular} berhasil ditambah`
    },
    endpoint() {
      const endpoint = '/talentAdminFee'
      return this.editMode ? `${endpoint}/${this.id}` : endpoint
    },
    validateFee() {
      return this.talent_admin_fee_discounts.filter(
        talentAdminFeeDiscount => talentAdminFeeDiscount.admin_fee_discount_value > this.admin_fee,
      ).length
    },
  },
  async mounted() {
    this.loadPositions()
    if (this.editMode) await this.loadForm()
  },
  methods: {
    loadPositions() {
      return this.$http
        .post(
          '/position/pagination',
          {},
          {
            params: {
              is_division_external: 1,
              limit: 1000,
              sort: 'name',
              direction: 'asc',
            },
          },
        )
        .then(async response => {
          const { data } = response.data.data
          this.positionItems = Object.keys(data).map(key => data[key])
          this.hasMorePosition = response.data.data.total > this.positionItems.length
        })
    },
    addTalentAdminFeeDiscounts() {
      this.talent_admin_fee_discounts.push({
        minimum_total_talent: '',
        admin_fee_discount_value: '',
      })
    },
    removeTalentAdminFeeDiscounts(index) {
      this.$swal({
        title: 'Anda yakin?',
        text: 'Potongan Admin akan dihapus',
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
          this.remove(index)
        }
      })
    },
    remove(index) {
      this.talent_admin_fee_discounts.splice(index, 1)
    },
    submit() {
      this.$refs.formRules.validate().then(success => {
        if (success && !this.validateFee) {
          this.loadingSubmit = true

          const data = {
            _method: this.method,
            position_id: this.position_id,
            description: this.description,
            admin_fee: this.admin_fee,
            admin_fee_discount_type: this.admin_fee_discount_type,
            talent_admin_fee_discounts: this.talent_admin_fee_discounts,
          }

          this.$http
            .post(this.endpoint, data)
            .then(response => {
              if (!response.data.status) {
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
              this.loadingSubmit = false

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
        } else {
          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Failed',
                text: 'Deskripsi tidak boleh kosong, dan nilai diskon tidak boleh melebihi biaya standart',
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
      this.$refs.formCard.showLoading = true

      return this.$http
        .get(this.endpoint)
        .then(async response => {
          const { data } = response.data

          this.position_id = data.position_id
          this.description = data.description
          this.admin_fee = data.admin_fee
          this.admin_fee_discount_type = data.admin_fee_discount_type
          this.talent_admin_fee_discounts = data.talent_admin_fee_discounts
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
</style>
