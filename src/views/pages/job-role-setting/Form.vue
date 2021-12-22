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
      :title="`Manage ${$route.meta.name.singular}: ${eligiblePositionMenu.name}`"
      no-actions
    >
      <b-row>
        <b-col md="6">
          <!-- form -->
          <validation-observer ref="formRules">
            <b-form>
              <b-row class="mb-2">
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
                        filterable
                        placeholder="Ketik untuk mencari..."
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col
                  md="8"
                  offset-md="4"
                >
                  <b-button
                    variant="primary"
                    :disabled="!position_id"
                    @click.prevent="assignPositionToMenu"
                  >
                    <b-spinner
                      v-if="loadingSubmit"
                      small
                    /> Assign Position
                  </b-button>
                </b-col>
              </b-row>
            </b-form>
          </validation-observer>
        </b-col>
        <b-col md="12">
          <hr>
          <b-table
            hover
            :fields="fields"
            :items="eligiblePositionMenu.positions"
          >
            <template #cell(access)="data">
              <b-button
                variant="primary"
                size="sm"
                @click.prevent="showModal(data.item)"
              >
                Berikan Akses
              </b-button>
            </template>
            <template #cell(unassign)="data">
              <b-button
                variant="warning"
                size="sm"
                @click.prevent="unassignPositionToMenu(data.item.id)"
              >
                Hapus Akses
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-card-actions>
    <modal
      ref="accessModalComponent"
      :list-access="listAccess"
      :selected-position="selectedPosition"
      :refresh-method="loadEligiblePositionMenu"
    />
  </b-overlay>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import {
  BFormGroup,
  BForm,
  BRow,
  BCol,
  VBTooltip,
  BOverlay,
  BButton,
  BTable,
  BSpinner,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import Ripple from 'vue-ripple-directive'
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
    BFormGroup,
    BForm,
    BRow,
    BCol,
    BSpinner,
    vSelect,
    BOverlay,
    BButton,
    BTable,
    Modal,
  },
  data() {
    return {
      id: this.$route.params.id,
      submitErrors: '',
      loading: false,
      loadingSubmit: false,
      required,
      fields: [
        {
          key: 'position_name',
          label: 'Posisi',
        },
        {
          key: 'access',
          label: 'Hak Akses',
        },
        {
          key: 'accesses',
          label: 'Data Hak Akses',
          formatter: value => {
            if (!value) {
              return '-'
            }
            return value.map(item => item.access_name).join(', ')
          },
        },
        {
          key: 'unassign',
          label: 'Hapus Akses',
        },
      ],

      eligiblePositionMenu: {
        positions: [],
      },
      hasMorePosition: false,
      positionItems: [],
      position_id: '',
      listAccess: [],
      selectedPosition: {},
    }
  },
  computed: {
    successText() {
      return `Satu ${this.$route.meta.name.singular} berhasil diperbaharui`
    },
  },
  mounted() {
    this.getMenuAndPositionData()
    this.getAccess()
  },
  methods: {
    async getMenuAndPositionData() {
      await this.loadEligiblePositionMenu()
      await this.loadPositions()
    },
    loadEligiblePositionMenu() {
      this.loading = true
      return this.$http
        .get(`menu/getPositionByMenu/${this.id}`)
        .then(({ data }) => {
          this.eligiblePositionMenu = data.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadPositions() {
      return this.$http
        .post(
          '/position/pagination',
          {},
          {
            params: {
              page: 1,
              limit: 1000,
              sort: 'name',
              direction: 'asc',
              is_division_external: 0,
            },
          },
        )
        .then(response => {
          const { data } = response.data.data
          this.positionItems = data.filter(
            position => !this.eligiblePositionMenu.positions.some(
              assignedPosition => assignedPosition.id === position.id,
            ),
          )
          const positionItemsLength = this.positionItems.length
          this.hasMorePosition = response.data.data.total - positionItemsLength > positionItemsLength
        })
    },
    getAccess() {
      this.loading = true
      this.$http
        .get('menu/access')
        .then(({ data }) => {
          this.listAccess = data.data
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
    assignPositionToMenu() {
      this.$refs.formRules.validate().then(success => {
        if (success) {
          this.loadingSubmit = true

          const data = {
            menu_id: this.id,
            position_id: this.position_id,
          }

          this.$http
            .post('/menu/assignPosition', data)
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
              this.position_id = 0
              this.getMenuAndPositionData()
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
    unassignPositionToMenu(positionId) {
      this.loading = true

      const data = {
        menu_id: this.id,
        position_id: positionId,
      }

      return this.$http
        .post('/menu/releasePosition', data)
        .then(() => {
          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Success',
                text: 'Berhasil Hapus Akses',
                variant: 'success',
                attachment: 'CheckIcon',
              },
            },
            { timeout: 2500 },
          )
          this.getMenuAndPositionData()
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
    showModal(position) {
      this.selectedPosition = position
      this.$refs.accessModalComponent.show()
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
