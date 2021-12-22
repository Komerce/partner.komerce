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
      <b-row class="d-flex align-items-center mt-1">
        <b-col>
          <h5>
            <strong>Pengaturan Ekspedisi</strong>
          </h5>
        </b-col>
        <b-col class="d-flex justify-content-end">
          <b-form-checkbox
            v-model="settingEkspedisi"
            class="custom-control-primary"
            name="check-button"
            switch
            @change="switchSettingEkspedisi"
          />
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <b-table
            :fields="fieldsSendKompship"
            :items="itemsSendKompship"
            class="border"
          >

            <template #cell(send_kompship)>

              <b-table
                :fields="fields"
                :items="listEkspedisi"
              >

                <template #cell(shipping_name)="data">
                  <b-col>
                    <h5>
                      {{ data.value }}
                    </h5>
                  </b-col>
                </template>

                <template #cell(is_active)="data">
                  <b-form-checkbox
                    v-model="data.item.is_active"
                    class="custom-control-primary"
                    name="check-button"
                    switch
                    @change="switchStatusEkspedisi(data)"
                  />
                </template>
              </b-table>

            </template>

          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col>
          <b-table
            :fields="fieldsSendKompship"
            :items="itemsSendKompship"
            class="border"
          />
        </b-col>
      </b-row>
    </b-card>
  </b-overlay>

</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormCheckbox,
  BTable,
  VBModal,
  BOverlay,
} from 'bootstrap-vue'
import { heightTransition } from '@core/mixins/ui/transition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import httpKomship from './http_komship'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormCheckbox,
    BTable,
    BOverlay,
  },
  directives: {
    'b-modal': VBModal,
  },
  mixins: [heightTransition],
  data() {
    return {
      loading: false,

      settingEkspedisi: false,
      statusEkspedisiNonKomship: false,

      formAddEkspedisi: false,
      partnerId: JSON.parse(localStorage.getItem('userData')),

      fields: [
        {
          key: 'shipping_name', label: 'Nama Ekspedisi', class: 'col-md-3 bg-white border-bottom-0',
        },
        {
          key: 'is_active', label: 'Status', class: 'bg-white border-bottom-0 ', thClass: 'text-right pr-5', tdClass: 'd-flex justify-content-end align-items-start',
        },
      ],

      fieldsSendKompship: [
        {
          key: 'send_kompship', label: 'Pengiriman Komship',
        },
      ],

      items: [
        {
          name_ekspedisi: 'JNE',
        },
      ],

      itemsSendKompship: [
        {
          send_kompship: 'Ketika mengaktifkan pengiriman Non Komship, maka kamu tidak mendapatkan cashback dan fitur lainnya yang ada di membership Komship (Mandiri menjadi Non Komship) ',
        },
      ],

      listEkspedisi: [],
      isActive: null,
    }
  },
  mounted() {
    this.loadEkspedisi()
  },
  methods: {
    loadEkspedisi() {
      this.loading = true
      httpKomship.get('/v1/partner/shipment/not-active',
        {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        }).then(response => {
        const { data } = response.data
        this.listEkspedisi = data
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.listEkspedisi.length; x++) {
          if (this.listEkspedisi[x].is_active === 0) {
            this.listEkspedisi[x].is_active = false
          }
          if (this.listEkspedisi[x].is_active === 1) {
            this.listEkspedisi[x].is_active = true
          }

          if (!this.listEkspedisi[x].is_active === false) {
            this.settingEkspedisi = true
          }
        }
        this.loading = false
        return this.listEkspedisi
      })
    },
    switchSettingEkspedisi() {
      if (this.settingEkspedisi === true) {
        this.isActive = 1
      }
      if (this.settingEkspedisi === false) {
        this.isActive = 0
      }
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < this.listEkspedisi.length; x++) {
        httpKomship.put(`/v1/partner/shipment/update/${this.listEkspedisi[x].id}`, {
          shipping_name: this.listEkspedisi[x].shipping_name,
          is_komship: 1,
          partner_id: this.partnerId.partner_detail.id,
          is_active: this.isActive,
        },
        {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        }).then(() => {
          this.loadEkspedisi()
        }).catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal update setting ekspedisi, silahkan coba lagi',
              variant: 'danger',
            },
          })
        })
      }
    },
    switchStatusEkspedisi(data) {
      if (data.item.is_active === false) {
        httpKomship.put(`/v1/partner/shipment/update/${data.item.id}`, {
          shipping_name: data.item.shipping_name,
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
          })
          this.loadEkspedisi()
        }).catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal update setting ekspedisi, silahkan coba lagi',
              variant: 'danger',
            },
          })
        })
      }
      if (data.item.is_active === true) {
        httpKomship.put(`/v1/partner/shipment/update/${data.item.id}`, {
          shipping_name: data.item.shipping_name,
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
          })
          this.loadEkspedisi()
        }).catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal update setting ekspedisi, silahkan coba lagi',
              variant: 'danger',
            },
          })
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
