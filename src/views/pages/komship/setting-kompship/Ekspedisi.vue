<template>
  <b-overlay
    variant="light"
    :show="loading"
    spinner-variant="primary"
    blur="0"
    opacity=".5"
    rounded="sm"
  >
    <b-card>
      <b-row class="d-flex align-items-center mt-1 mb-2">
        <b-col>
          <h3 class="text-black">
            <strong>Pengaturan Ekspedisi</strong>
          </h3>
        </b-col>
      </b-row>

      <b-row
        v-if="itemsExpedition[0] === undefined"
        class="justify-content-center"
      >
        <h4>
          <strong>
            Tidak ada data yang ditampilkan.
          </strong>
        </h4>
      </b-row>

      <b-row class="justify-content-center wrapper__setting__ekspedisi">
        <b-col
          v-for="(items, index) in itemsExpedition"
          :key="index+1"
          cols="3"
          class="mr-3 mb-3"
        >
          <b-row
            class="justify-content-center h-44"
            style="
              background: #F8F8F8;
              border-top-right-radius: 18px;
              border-top-left-radius: 18px;
            "
          >
            <div class="align-self-center">
              <b-img
                :src="items.image_path"
                fluid
                width="150"
              />
            </div>
          </b-row>
          <b-row
            class="justify-content-between pl-1 pr-50 py-2 border-2 border-top-0"
            style="
              border-bottom-left-radius: 18px;
              border-bottom-right-radius: 18px;
            "
          >
            <div>
              <h4 class="text-primary">
                <strong>
                  {{ items.shipping_name }}
                </strong>
              </h4>
            </div>
            <b-form-checkbox
              :checked="items.is_active === 1 ? true : false"
              name="check-button"
              switch
              @change="switchStatusEkspedisi(items)"
            />
          </b-row>
        </b-col>
      </b-row>

      <b-row class="justify-content-center px-1 wrapper__setting__ekspedisi__mobile">
        <b-col
          v-for="(items, index) in itemsExpedition"
          :key="index+1"
          cols="12"
          class="mb-2"
        >
          <b-row
            class="justify-content-center h-44"
            style="
              background: #F8F8F8;
              border-top-right-radius: 18px;
              border-top-left-radius: 18px;
            "
          >
            <div class="align-self-center">
              <b-img
                :src="items.image_path"
                fluid
                width="150"
              />
            </div>
          </b-row>
          <b-row
            class="justify-content-between pl-1 pr-50 py-2 border-2 border-top-0"
            style="
              border-bottom-left-radius: 18px;
              border-bottom-right-radius: 18px;
            "
          >
            <div>
              <h4 class="text-primary">
                <strong>
                  {{ items.shipping_name }}
                </strong>
              </h4>
            </div>
            <b-form-checkbox
              :checked="items.is_active === 1 ? true : false"
              name="check-button"
              switch
              @change="switchStatusEkspedisi(items)"
            />
          </b-row>
        </b-col>
      </b-row>
    </b-card>

    <!-- Modal cek address pickup -->
    <b-modal
      ref="alert-validate-address"
      hide-footer
      hide-header
      no-close-on-backdrop
      no-close-on-esc
      centered
      @hidden="onHidden"
    >
      <b-row class="pt-2 mb-2 justify-content-center">
        <img src="@/assets/images/icons/warning.svg">
      </b-row>
      <b-row class="mb-2 text-center justify-content-center">
        <b-col
          cols="10"
        >
          <span class="text-black">
            Untuk dapat mengaktifkan ekspedisi ini, Kamu harus melengkapi bagian Kelurahan/Kecamatan pada Alamat Pickup
          </span>
        </b-col>
      </b-row>
      <b-row class="pb-2 justify-content-center">
        <b-button
          class="btn-icon"
          variant="primary"
          tag="router-link"
          :to="{ name: $route.meta.routeToAddressSetting }"
        >
          Lengkapi Alamat Pickup
        </b-button>
      </b-row>
    </b-modal>
  </b-overlay>
</template>

<script>
import { heightTransition } from '@core/mixins/ui/transition'
import {
  BCard,
  BRow,
  BCol,
  VBModal,
  BOverlay,
  BImg,
  BFormCheckbox,
  BModal,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import httpKomship from './http_komship'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BOverlay,
    BImg,
    BFormCheckbox,
    BModal,
  },
  directives: {
    'b-modal': VBModal,
  },
  mixins: [heightTransition],
  data() {
    return {
      loading: false,
      partnerId: JSON.parse(localStorage.getItem('userData')),

      itemsExpedition: [],
      addressNoValid: false,
      setEkspedisi: '',
    }
  },
  mounted() {
    this.getExpedition()
    this.getAddress()
  },
  methods: {
    getExpedition() {
      this.loading = true
      httpKomship.get('/v1/partner/shipment/not-active',
        {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        }).then(response => {
        const { data } = response.data
        this.itemsExpedition = data
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal load data ekspedisi, silahkan refresh page!',
            variant: 'danger',
          },
        }, 2000)
      })
    },
    switchStatusEkspedisi(data) {
      if (data.id === 3 || data.id === 2) {
        if (this.addressNoValid) {
          this.$refs['alert-validate-address'].show()
        }
        if (this.addressNoValid === false) {
          if (data.is_active === 1) {
            httpKomship.put(`/v1/partner/shipment/update/${data.id}`, {
              shipping_name: data.shipping_name,
              is_komship: 1,
              partner_id: this.partnerId.partner_detail.id,
              is_active: 0,
            }).then(() => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: 'Success update setting ekspedisi',
                  variant: 'success',
                },
              }, 2000)
              this.getExpedition()
            }).catch(() => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Gagal',
                  icon: 'AlertCircleIcon',
                  text: 'Gagal update setting ekspedisi, silahkan coba lagi',
                  variant: 'danger',
                },
              }, 2000)
            })
          } else if (data.is_active === 0) {
            httpKomship.put(`/v1/partner/shipment/update/${data.id}`, {
              shipping_name: data.shipping_name,
              is_komship: 1,
              partner_id: this.partnerId.partner_detail.id,
              is_active: 1,
            }).then(() => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: 'Success update setting ekspedisi',
                  variant: 'success',
                },
              }, 2000)
              this.getExpedition()
            }).catch(() => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Gagal',
                  icon: 'AlertCircleIcon',
                  text: 'Gagal update setting ekspedisi, silahkan coba lagi',
                  variant: 'danger',
                },
              }, 2000)
            })
          }
        }
      }
      if (data.is_active === 1 && data.id !== 3 && data.id !== 2) {
        httpKomship.put(`/v1/partner/shipment/update/${data.id}`, {
          shipping_name: data.shipping_name,
          is_komship: 1,
          partner_id: this.partnerId.partner_detail.id,
          is_active: 0,
        }).then(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Success',
              icon: 'CheckIcon',
              text: 'Success update setting ekspedisi',
              variant: 'success',
            },
          }, 2000)
          this.getExpedition()
        }).catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal update setting ekspedisi, silahkan coba lagi',
              variant: 'danger',
            },
          }, 2000)
        })
      } else if (data.is_active === 0 && data.id !== 3 && data.id !== 2) {
        httpKomship.put(`/v1/partner/shipment/update/${data.id}`, {
          shipping_name: data.shipping_name,
          is_komship: 1,
          partner_id: this.partnerId.partner_detail.id,
          is_active: 1,
        }).then(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Success',
              icon: 'CheckIcon',
              text: 'Success update setting ekspedisi',
              variant: 'success',
            },
          }, 2000)
          this.getExpedition()
        }).catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal update setting ekspedisi, silahkan coba lagi',
              variant: 'danger',
            },
          }, 2000)
        })
      }
    },
    getAddress() {
      this.$http_komship.get('/v1/address').then(response => {
        const { data } = response.data
        const nullAddress = data.find(items => items.destination_id === null || items.destination_id === 0 || items.zip_code === null || items.zip_code === 0)
        if (nullAddress !== undefined) {
          this.addressNoValid = true
        } else {
          this.addressNoValid = false
        }
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal load data, silahkan coba lagi',
            variant: 'danger',
          },
        }, 2000)
      })
    },
    onHidden() {
      this.setEkspedisiSicepat = true
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';

@media only screen and (min-width: 991px) {

  [dir] .wrapper__setting__ekspedisi__mobile {
    display: none;
  }
}

@media only screen and (max-width: 990px) {
  [dir] .wrapper__setting__ekspedisi {
    display: none!important;
  }

  [dir] .wrapper__setting__ekspedisi__mobile {
    display: block;
  }
}
</style>
