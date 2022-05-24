<template>
  <b-card>
    <h3 class="text-black">
      <strong>
        Pengajuan Pickup
      </strong>
    </h3>

    <b-row class="mt-3 justify-content-center">
      <b-col cols="11">
        <h4 class="text-black">
          <strong>
            Penjemputan
          </strong>
        </h4>
      </b-col>
      <b-col cols="11">
        <hr style="height:1px;border-width:0;color:#C2C2C2;background-color:#C2C2C2">
      </b-col>
    </b-row>
    <b-form @submit.prevent>
      <b-row class="justify-content-center mb-1">
        <b-col
          cols="11"
          class="mb-50"
        >
          <b-form-group
            label="Alamat"
            label-for="h-first-name"
            label-cols-md="2"
            label-class="text-black font-weight-bold"
          >
            <b-row class="">
              <b-col md="auto mt-50">
                <h5 class="text-black">
                  <strong>
                    {{ addressName }}
                  </strong>
                </h5>
                <p>
                  {{ addressDetail }}
                </p>
              </b-col>
              <b-col cols="2">
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  class="btn-icon"
                  variant="flat-primary"
                  @click="openPopUpAddress"
                >
                  Pilih
                </b-button>
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>
        <b-col
          cols="11"
          class="mb-50"
        >
          <b-form-group
            label="Tanggal"
            label-for="h-email"
            label-cols-md="2"
            label-class="text-black font-weight-bold"
          >
            <b-row class="mt-50">
              <b-col
                md="3"
              >
                <b-input-group class="rounded">
                  <flat-pickr
                    ref="pickDate"
                    v-model="dateValue"
                    :config="config"
                    @context="onChangeDate"
                    @on-change="onChangeDate"
                    @on-close="onChangeDate"
                  />
                  <b-input-group-append is-text>
                    <img
                      src="@/assets/images/icons/date-picker-icon.svg"
                      @click="openFlatPicker"
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>
        <b-col
          cols="11"
          class="mb-50"
        >
          <b-form-group
            label="Waktu Jemput"
            label-for="h-number"
            label-cols-md="2"
            label-class="text-black font-weight-bold"
          >
            <b-row>
              <b-button
                id="popover-button-3"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="flat-dark"
                class="btn-icon border ml-1"
              >
                {{ timeValue }}
              </b-button>
              <b-popover
                target="popover-button-3"
                placement="bottom"
                variant="primary"
                triggers="focus"
              >
                <b-time
                  v-model="timeValue"
                  locale="en"
                  hide-header
                  :hour12="false"
                  :show-seconds="false"
                  @context="onChangeTime"
                />
              </b-popover>
            </b-row>
            <small
              v-if="isNotCorrectTime && isNotCorrectDate"
              class="text-primary mt-50"
            >
              *Tidak bisa angkut jam pickup kurang dari jam saat ini
            </small>
          </b-form-group>
        </b-col>
        <b-col
          cols="11"
          class="mb-50"
        >
          <b-form-group
            label="Kendaraan"
            label-for="h-password"
            label-cols-md="2"
            label-class="text-black font-weight-bold"
          >
            <div
              id="input-pickup-vehicle"
              class="add-pickup-input-vehicle-btn-wrapper"
            >
              <b-button
                v-if="profile && profile.vehicle && profile.vehicle.indexOf('MOTOR') > -1"
                :class="`vehicle-button-content ${chosenVehicle === 'MOTOR' ? 'vehicle-selected white-button mr-1 mb-1' : 'vehicle-button mr-1 mb-1'}`"
                @click="() => onChooseVehicle('MOTOR')"
              >
                <img src="@/assets/images/icons/motor.png">
                <span>Motor</span>
              </b-button>
              <b-button
                v-if="profile && profile.vehicle && profile.vehicle.indexOf('MOBIL') > -1"
                :class="`vehicle-button-content ${chosenVehicle === 'MOBIL' ? 'vehicle-selected white-button mr-1 mb-1' : 'vehicle-button mr-1 mb-1'}`"
                @click="() => onChooseVehicle('MOBIL')"
              >
                <img src="@/assets/images/icons/mobil.png">
                <span>Mobil</span>
              </b-button>
              <b-button
                v-if="profile && profile.vehicle && profile.vehicle.indexOf('TRUCK') > -1"
                :class="`vehicle-button-content vehicle-button-content-truk ${chosenVehicle === 'TRUCK' ? 'vehicle-selected white-button mb-1' : 'vehicle-button mb-1'}`"
                @click="() => onChooseVehicle('TRUCK')"
              >
                <img src="@/assets/images/icons/truk.png">
                <span>Truk</span>
              </b-button>
            </div>
          </b-form-group>
        </b-col>
        <b-col
          cols="11"
          class="mb-50"
        >
          <b-form-group
            label="Orderan"
            label-for="h-password"
            label-cols-md="2"
            label-class="text-black font-weight-bold"
            class="mb-0"
          >
            <b-button
              variant="primary"
              class="mt-50"
              :disabled="addressName === '' || addressDetail === ''"
              @click="chooseOrder"
            >
              Pilih orderan
            </b-button>
          </b-form-group>
          <b-col
            class="pl-0 pr-2"
          >
            <small>
              Pilih orderan yang
            </small>
            <br>
            <small>
              akan di pickup
            </small>
          </b-col>
        </b-col>
      </b-row>

      <div v-if="selectedOrderToStore === []">
        <b-row class="justify-content-center mt-1">
          <b-col
            cols="11"
            class="d-flex justify-content-between"
          >
            <div>
              <h5 class="text-black">
                <strong>
                  Produk
                </strong>
              </h5>
            </div>
            <div>
              <h5 class="text-black">
                <strong>
                  Jumlah
                </strong>
              </h5>
            </div>
          </b-col>
          <b-col cols="11">
            <hr style="height:1px;border-width:0;color:#C2C2C2;background-color:#C2C2C2">
          </b-col>
        </b-row>
      </div>

      <div v-if="selectedOrderToStore[0] !== undefined">
        <b-row class="justify-content-center">
          <b-col cols="11">
            <b-table
              hover
              responsive
              class="position-relative"

              :fields="fieldsPreviewProductOrder"
              :items="itemsPreviewProductOrder"
            >
              <template #cell(product)="data">
                <div
                  v-for="(items, index) in data.item.product"
                  :key="index+1"
                >
                  <b-row class="mb-2">
                    <b-container
                      fluid
                      class="d-flex"
                    >
                      <div>
                        <b-avatar
                          variant="light-primary"
                          square
                          size="50px"
                          :src="items.product_image"
                        />
                      </div>
                      <div class="ml-1">
                        <h5 class="text-black">
                          <strong>{{ items.product_name }}</strong>
                        </h5>
                        <div v-if="items.variant_name !== '0' && items.variant_name !== ''">
                          <span class="text-black"><strong>{{ items.variant_name }}</strong></span>
                        </div>
                        <div v-else>
                          <span class="text-black">
                            <strong>
                              Tidak ada variasi
                            </strong>
                          </span>
                        </div>
                      </div>
                    </b-container>
                  </b-row>
                </div>
              </template>

              <template #cell(total)="data">
                <div
                  v-for="(items, index) in data.item.product"
                  :key="index+1"
                >
                  <h5 class="mb-3 text-black">
                    <strong>{{ items.qty }}</strong>
                  </h5>
                </div>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </div>

      <div v-if="selectedOrderToStore[0] !== undefined">
        <b-row class="justify-content-center mb-1">
          <b-col
            cols="11"
            class="d-flex justify-content-between"
          >
            <div>
              <b-button
                class="btn-icon"
                variant="flat-info"
                tag="router-link"
                :to="{ name: $route.meta.routeDetailBefore, params: { selected_order: selectedOrderToStore } }"
              >
                Lihat detail...
              </b-button>
            </div>
            <div>
              <span class="text-black">
                <strong>
                  Total produk: {{ getTotalProductOrder(itemsPreviewProductOrder) }}
                </strong>
              </span>
            </div>
          </b-col>
          <b-col cols="11">
            <hr style="height:1px;border-width:0;color:#C2C2C2;background-color:#C2C2C2">
          </b-col>
        </b-row>
      </div>

      <b-row class="mb-1 ml-3 pl-50 warning__wrapper__makesure">
        <p class="text-primary p-50 border-2 border-red-400 rounded-lg bg-red-50">
          *Pastikan produk yang kamu masukan sudah tepat sebelum di ajukan
        </p>
      </b-row>

      <b-row class="justify-content-center">
        <b-col
          cols="11"
          class="d-flex justify-content-end"
        >
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="outline-primary"
            class="mr-1"
          >
            Batal
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="reset"
            variant="primary"
            :disabled="chosenVehicle === '' || selectedOrderToStore[0] === undefined || addressName === '' || addressDetail === '' || isNotCorrectTime"
            @click="showAlertSubmitPickup"
          >
            <b-spinner
              v-if="loadingSubmitPickup"
              small
            />
            Ajukan Pickup
          </b-button>
        </b-col>
      </b-row>
    </b-form>

    <!-- Pop Address -->
    <b-modal
      ref="popup-address"
      hide-footer
      hide-header
      modal-class="modal-primary"
      scrollable
    >
      <b-row class="justify-content-end mt-50 mr-50">
        <a
          href="#"
          @click="closeModal()"
        >
          <b-img
            src="@/assets/images/icons/close-circle.svg"
            height="18"
            width="24"
            alt="close"
            class="float-right"
          />
        </a>
      </b-row>

      <div
        v-for="(items, index) in itemsAddress"
        :key="index+1"
      >
        <b-form-radio
          v-model="valueAddressIsActive"
          name="some-radios"
          plain
          style="
            accent-color: #F95031;
          "
          :value="items.address_id"
          @change="handleSelectedAddress(items)"
        >
          <div class="d-flex">
            <h5 class="mr-1">
              <strong>
                {{ items.address_name }}
              </strong>
            </h5>
            <span
              v-if="items.is_default === 1"
              class="text-primary"
            >
              [ Alamat Utama ]
            </span>
          </div>
          <p>
            {{ items.address_detail }}
          </p>
        </b-form-radio>
      </div>
    </b-modal>

    <!-- Popup order -->
    <data-order
      :pass-address-id="addressId"
      @passDataToParent="getDataOrderToStore"
    />

    <!-- Modal Success Pickup -->
    <b-modal
      ref="modal-success-request-pickup"
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success">
        <div class="image-wrapper">
          <img src="@/assets/images/icons/success.svg">
        </div>
        <div class="text-wrapper mb-3">
          Pengajuan Pickup Berhasil
        </div>
        <b-button
          class="org-button"
          tag="router-link"
          :to="{ name: $route.meta.routeDetailAfter }"
        >
          Oke
        </b-button>
      </div>
    </b-modal>

    <!-- Modal Failed Pickup -->
    <b-modal
      ref="modal-failed-request-pickup"
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success">
        <div class="image-wrapper">
          <img src="@/assets/images/icons/fail.svg">
        </div>
        <div class="text-wrapper mb-3 px-2">
          Mohon maaf , ekpedisi sedang terkendala.
          Silahkan refresh halaman
        </div>
        <b-button
          class="org-button"
          @click="closePopupFailedPickup"
        >
          Oke
        </b-button>
      </div>
    </b-modal>

    <!-- Modal validate expedition -->
    <b-modal
      ref="modal-validate-expedition"
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success">
        <div class="image-wrapper">
          <img src="@/@core/assets/image/icon-popup-warning.png">
        </div>
        <div class="text-wrapper mb-3 px-1">
          Aktifkan minimal 1 ekspedisi untuk melanjutkan proses Pick Up
        </div>
        <b-button
          class="org-button"
          tag="router-link"
          :to="{ name: $route.meta.routeToActiveExpedition }"
        >
          Aktifkan Ekspedisi
        </b-button>
      </div>
    </b-modal>

    <!-- Modal Pickup error success -->
    <b-modal
      ref="modal-pickup-error-success"
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      hide-header
      centered
      size="xl"
    >
      <b-row class="justify-content-center mb-2 pt-2">
        <img src="@/assets/images/icons/warning.svg">
      </b-row>
      <b-row class="justify-content-center text-center mb-2 px-2">
        <b-col cols="10">
          <span class="text-black">
            Sebagian orderan telah berhasil diajukan pickup. Silahkan melakukan pickup ulang untuk orderan yang belum berhasil. Jika ada kendala silahkan hubungi CS.
          </span>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <span class="text-black ml-2">
          <strong>
            Orderan yang gagal diajukan pickup :
          </strong>
        </span>
      </b-row>
      <b-row>
        <b-overlay
          variant="light"
          :show="loadingPickupError"
          spinner-variant="primary"
          blur="0"
          opacity=".5"
          rounded="sm"
        >
          <b-table
            responsive

            :fields="fieldsDataOrder"
            :items="itemsDataOrder"
          >
            <template #cell(date_order_after)="data">
              <span class="text-black">
                <strong>
                  {{ data.item.order_date }}
                </strong>
              </span>
            </template>

            <template #cell(pelanggan_after)="data">
              <b-row>
                <span class="text-black">
                  <strong>
                    {{ data.item.customer_name }}
                  </strong>
                </span>
              </b-row>
              <b-row
                class="mb-50"
              >
                <b-img
                  src="@/assets/images/logo/Komship.png"
                />
              </b-row>
              <b-row
                v-if="data.item.shipping === 'JNE'"
                class="align-items-center"
              >
                <b-img
                  src="@/assets/images/expedisi/logo-jne.png"
                  width="40"
                />
                <span class="text-black ml-50">
                  <strong>
                    Reguler
                  </strong>
                </span>
              </b-row>
              <b-row
                v-if="data.item.shipping === 'SICEPAT'"
                class="align-items-center"
              >
                <b-img
                  src="@/@core/assets/image/icons/logo__sicepat.svg"
                  width="60"
                />
                <span class="text-black ml-50">
                  <strong>
                    {{ data.item.shipping_type }}
                  </strong>
                </span>
              </b-row>
              <b-row
                v-if="data.item.shipping === 'IDEXPRESS'"
                class="align-items-center"
              >
                <b-img
                  src="@/@core/assets/image/icons/logo-idexpress.svg"
                  width="40"
                />
                <span class="text-black ml-50">
                  <strong>
                    {{ data.item.shipping_type }}
                  </strong>
                </span>
              </b-row>
            </template>

            <template #cell(product_after)="data">
              <div
                v-for="(dataProduct, index) in data.item.product"
                :key="index+1"
              >
                <b-row class="mb-2">
                  <b-container
                    fluid
                    class="d-flex"
                  >
                    <div>
                      <b-avatar
                        variant="light-primary"
                        square
                        size="50px"
                        :src="dataProduct.product_image"
                      />
                    </div>
                    <div class="ml-1">
                      <div class="d-flex">
                        <div>
                          <h5 class="text-black">
                            <strong>{{ dataProduct.product_name }}</strong>
                          </h5>
                          <div v-if="dataProduct.variant_name !== '0' && dataProduct.variant_name !== ''">
                            <span class="text-primary"><strong>{{ dataProduct.variant_name }}</strong></span>
                          </div>
                          <div v-else>
                            <span class="text-black">
                              <strong>
                                -
                              </strong>
                            </span>
                          </div>
                        </div>
                        <div>
                          <span class="text-black">
                            <strong>
                              x{{ dataProduct.qty }}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </b-container>
                </b-row>
              </div>
            </template>

            <template #cell(grand_total_after)="data">
              <span class="text-black">
                <strong>
                  Rp. {{ formatPrice(data.item.grandtotal) }}
                </strong>
              </span>
              <p class="text-primary">
                <strong>
                  {{ data.item.payment_method === 'COD' ? data.item.payment_method : 'Non-COD' }}
                </strong>
              </p>
            </template>

            <template #cell(address_after)="data">
              <span class="text-black">
                <strong>
                  {{ data.item.customer_address }}
                </strong>
              </span>
            </template>
          </b-table>
        </b-overlay>
      </b-row>
      <b-row class="justify-content-center pb-2">
        <b-button
          class="org-button"
          @click="handleDataOrderPickupError"
        >
          Oke
        </b-button>
      </b-row>
    </b-modal>

    <!-- Modal alert pickup -->
    <b-modal
      ref="modal-alert-submit-pickup"
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success">
        <div class="image-wrapper">
          <img src="@/@core/assets/image/icon-popup-warning.png">
        </div>
        <div class="text-wrapper mb-3 px-1">
          Apakah kamu yakin untuk melakukan Pengajuan Pickup?
          Kurir akan menuju ke lokasi penjemputan kamu
        </div>
        <b-row class="justify-content-center">
          <b-button
            variant="outline-primary"
            class="mr-1"
            @click="handleCloseAlertSubmit"
          >
            Batal
          </b-button>
          <b-button
            variant="primary"
            @click="submitNewPickup"
          >
            Ajukan Pickup
          </b-button>
        </b-row>
      </div>
    </b-modal>

    <!-- Modal cek address pickup -->
    <b-modal
      ref="modal-check-address-pickup"
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success">
        <div class="image-wrapper">
          <img src="@/assets/images/icons/warning.svg">
        </div>
        <div class="text-wrapper mb-2 px-2">
          Mohon maaf, alamat pickup kamu belum lengkap. Silahkan periksa alamat Pickup
        </div>
        <b-button
          class="org-button"
          tag="router-link"
          :to="{ name: $route.meta.routeToAddressSetting }"
        >
          Ke Alamat Pickup
        </b-button>
      </div>
    </b-modal>

    <!-- Modal animate pickup -->
    <b-modal
      ref="modal-animate-pickup"
      hide-footer
      hide-header
      centered
    >
      <lottie-animation
        path="animation/animate-submit-pickup.json"
        :width="300"
        :height="300"
        class="wrapper__animate__pickup__mobile"
      />
      <b-row
        class="justify-content-center pb-2"
      >
        <h5 class="text-black">
          <strong class="proses__pickup">
            Memproses Pengajuan Pickup
          </strong>
        </h5>
      </b-row>
    </b-modal>
  </b-card>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BForm,
  BButton,
  BInputGroup,
  BInputGroupAppend,
  BModal,
  BFormRadio,
  BTable,
  BAvatar,
  BContainer,
  BPopover,
  VBPopover,
  BTime,
  BOverlay,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import useJwt from '@/auth/jwt/useJwt'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import LottieAnimation from 'lottie-vuejs/src/LottieAnimation.vue'
import '@/@core/scss/vue/libs/vue-flatpicker.scss'
import moment from 'moment'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import httpKomship from '../../setting-kompship/http_komship'
import dataOrder from './DataOrder.vue'

export default {

  components: {
    BCard,
    BRow,
    BCol,
    BFormGroup,
    BForm,
    BButton,
    BInputGroup,
    BInputGroupAppend,
    BModal,
    BFormRadio,
    dataOrder,
    BTable,
    BAvatar,
    BContainer,
    flatPickr,
    LottieAnimation,
    BTime,
    BPopover,
    BOverlay,
  },
  directives: {
    'b-popover': VBPopover,
    Ripple,
  },
  data() {
    return {
      addressName: '',
      addressDetail: '',
      dateValue: new Date(),
      dateLabel: '',

      timeValueText: '09 : 00',
      timeValue: moment().format('HH:mm'),
      isNotCorrectTime: true,
      isNotCorrectDate: true,
      profile: null,
      chosenVehicle: '',

      itemsAddress: [],
      selectedOrderToStore: [],
      selectedAddress: '',

      fieldsPreviewProductOrder: [
        {
          key: 'product',
          label: 'Produk',
          thClass: 'bg-white border-top-0 text-black pl-0 ml-0',
          tdClass: 'text-black pl-0 ml-0',
        },
        {
          key: 'total',
          label: 'Jumlah',
          tdClass: 'text-center text-black',
          thClass: 'text-center bg-white border-top-0 text-black',
          class: 'col-action',
        },
      ],
      itemsPreviewProductOrder: [],
      selectedOrdersId: [],

      namePic: '',
      picPhone: '',
      addressId: '',

      valueAddressIsActive: 0,

      selectedOrderFromDetail: this.$route.params.selected_order_from_detail,

      date: '2020-10-16',
      config: {
        wrap: true,
        altFormat: 'M j, Y',
        altInput: true,
        dateFormat: 'Y-MMMM-d',
        minDate: 'today',
        mode: 'single',
      },

      itemsPickupSuccess: [],
      itemsPickupError: [],

      loadingSubmitPickup: false,

      // Data Table Popup after submit pickup
      fieldsDataOrder: [
        {
          key: 'date_order_after',
          label: 'Tanggal Order',
          class: 'bg-white',
          thClass: 'border-top-0',
          tdClass: 'border-top-0',
        },
        {
          key: 'pelanggan_after',
          label: 'Pelanggan',
          class: 'bg-white',
          thClass: 'border-top-0',
          tdClass: 'border-top-0',
        },
        {
          key: 'product_after',
          label: 'Produk',
          class: 'bg-white',
          thClass: 'border-top-0',
          tdClass: 'border-top-0',
        },
        {
          key: 'grand_total_after',
          label: 'Total Pembayaran',
          class: 'bg-white',
          thClass: 'border-top-0',
          tdClass: 'border-top-0',
        },
        {
          key: 'address_after',
          label: 'Alamat',
          class: 'bg-white',
          thClass: 'border-top-0',
          tdClass: 'border-top-0',
        },
      ],
      itemsDataOrder: [],

      showTimePicker: false,
      loadingPickupError: false,
    }
  },
  watch: {
    timeValue: {
      handler(newVal) {
        const newMom = moment(newVal, 'HHmm')
        const timeToday = moment()
        if (newMom.isBefore(timeToday) === true) {
          this.isNotCorrectTime = true
        } else {
          this.isNotCorrectTime = false
        }
        this.timeValue = newMom.format('HH:mm')
      },
    },
  },
  mounted() {
    // setInterval(() => {
    //   this.timeValue = moment().format('HH:mm:ss')
    // }, 1000)
    // this.$refs['modal-pickup-error-success'].show()
    this.cekExpedition()
    this.$http_komship.post('v1/my-profile', {
      headers: { Authorization: `Bearer ${useJwt.getToken()}` },
    }).then(response => {
      this.userData = response.data.data
      this.profile = response.data.data
    }).catch(() => {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Gagal',
          icon: 'AlertCircleIcon',
          text: 'Gagal meload data, silahkan refresh halaman!',
          variant: 'danger',
        },
      })
    })
    if (this.selectedOrderFromDetail) {
      this.selectedOrderToStore = this.selectedOrderFromDetail
      this.itemsPreviewProductOrder = this.selectedOrderFromDetail
    }
    this.getAddress()
    // this.$refs['popup-order'].show()
  },
  methods: {
    getDataOrderToStore(data) {
      this.selectedOrderToStore = data
      this.itemsPreviewProductOrder = data
      this.$refs['popup-order'].hide()
    },
    changeDate(dateString, type) {
      if (dateString && dateString !== '') {
        let today = new Date(dateString)
        const dd = today.getDate()
        const monthArr = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        const mm = today.getMonth()
        const yyyy = today.getFullYear()
        today = `${dd} ${monthArr[mm]} ${yyyy}`
        if (type && type === 2) {
          today = `${yyyy}-${mm + 1}-${dd}`
        }
        return today
      }
      return dateString
    },
    onChangeDate() {
      this.dateLabel = this.changeDate(this.dateValue)
      this.changeDate(this.dateValue)
      const dateToday = moment().format('YYYY-M-DD')

      // Date
      if (moment(dateToday).isBefore(this.changeDate(this.dateValue, 2)) === true) {
        this.isNotCorrectTime = false
        this.isNotCorrectDate = false
      } else {
        // Time
        const newMom = moment(this.timeValue, 'HHmm')
        const timeToday = moment()
        if (newMom.isBefore(timeToday) === true) {
          this.isNotCorrectTime = true
        } else {
          this.isNotCorrectTime = false
        }
        this.isNotCorrectDate = true
      }
    },
    onChangeTime(ctx) {
      if (ctx && ctx.formatted) this.timeValueText = this.getTimeFormatted(ctx.formatted)
    },
    getTimeFormatted(timeText) {
      if (timeText) {
        const splitTime = timeText.split(':')
        return `${splitTime[0]} : ${splitTime[1]}`
      }
      return timeText
    },
    getAddress() {
      this.$http_komship.get('/v1/address', {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        this.itemsAddress = data
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.itemsAddress.length; x++) {
          if (this.itemsAddress[x].is_default === 1) {
            this.addressName = this.itemsAddress[x].address_name
            this.addressDetail = this.itemsAddress[x].address_detail
            this.selectedAddress = this.itemsAddress[x].is_default
            this.namePic = this.itemsAddress[x].pic
            this.addressId = String(this.itemsAddress[x].address_id)
            this.picPhone = this.itemsAddress[x].phone
            this.valueAddressIsActive = this.itemsAddress[x].address_id
          }
        }
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal meload data address, silahkan refresh halaman!',
            variant: 'danger',
          },
        })
      })
    },
    openPopUpAddress() {
      this.$refs['popup-address'].show()
    },
    getDefaultAddress(data) {
      return data.is_default === 1
    },
    handleSelectedAddress(data) {
      this.addressName = data.address_name
      this.addressDetail = data.address_detail
      this.namePic = data.pic
      this.addressId = String(data.address_id)
      this.picPhone = data.phone
      this.valueAddressIsActive = data.address_id
    },
    onChooseVehicle(vehicle) {
      if (vehicle) this.chosenVehicle = vehicle
    },
    chooseOrder() {
      this.$bvModal.show('popupOrder')
    },
    getListOrderByPartner() {
      const partnerId = this.profile.partner_id
      return this.$http_komship.get(`v1/order/${partnerId}`, {
        params: {
          is_komship: this.profile.is_komship,
          order_status: 0,
        },
      }).then(response => {
        const { data } = response.data.data
        this.listOrder = data
      }).catch(() => {
        // handle error
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal meload data list order by partner, silahkan refresh halaman!',
            variant: 'danger',
          },
        })
      })
    },
    submitPickup() {
      this.selectedOrdersId = []
      this.$refs['modal-animate-pickup'].show()
      setTimeout(() => {
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.selectedOrderToStore.length; x++) {
          this.selectedOrdersId.push(this.selectedOrderToStore[x].order_id)
        }
        const params = {
          partner_name: this.profile.user_fullname,
          pickup_date: this.changeDate(this.dateValue, 2),
          pickup_time: this.timeValue,
          pic: this.namePic,
          pic_phone: this.picPhone,
          vehicle: this.chosenVehicle,
          address_id: this.addressId,
          address_detail: this.addressDetail,
          orders: this.selectedOrdersId,
        }

        httpKomship.post(`/v2/pickup/${this.profile.partner_id}/store`, params)
          .then(response => {
            if (response.data.code !== 500) {
              this.$refs['modal-animate-pickup'].hide()
              this.$refs['modal-success-request-pickup'].show()
            } else {
              this.$refs['modal-animate-pickup'].hide()
              this.itemsDataOrder = []
              this.handleDataErrorPickup(response.data.data)
              if (response.data.data.pickup_error.length === 0) this.$refs['modal-failed-request-pickup'].show()
            }
            if (response.data.data.pickup_error.length > 0) {
              this.$refs['modal-pickup-error-success'].show()
            } else {
              this.$refs['modal-success-request-pickup'].show()
            }
          }).catch(err => {
            this.handleDataErrorPickup(err.response.data.data)
            if (err.response.data.data.pickup_error.length > 0) {
              this.$refs['modal-pickup-error-success'].show()
              this.$refs['modal-animate-pickup'].hide()
            } else {
              this.$refs['modal-success-request-pickup'].show()
            }
            // this.$refs['modal-check-address-pickup'].show()
          })
      }, 1500)
    },
    handleSubmitPopUpSuccess() {
      this.$refs['modal-success-request-pickup'].hide()
    },
    detailOrder() {
      // handle error
    },
    getTotalProductOrder(data) {
      let value = null
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < data.length; x++) {
        if (data[x].product !== undefined) {
          // eslint-disable-next-line no-plusplus
          for (let y = 0; y < data[x].product.length; y++) {
            value += data[x].product[y].qty
          }
        }
      }
      return value
    },
    closePopupFailedPickup() {
      this.$refs['modal-failed-request-pickup'].hide()
    },
    cekExpedition() {
      httpKomship.get('/v1/partner/shipment/not-active',
        {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        }).then(response => {
        const { data } = response.data
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < data.length; x++) {
          if (!data[x].is_active === 1) {
            this.$refs['modal-validate-expedition'].show()
          }
        }
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal cek ekspedisi, silahkan refresh halaman!',
            variant: 'danger',
          },
        })
      })
    },
    closeModal() {
      this.$refs['popup-address'].hide()
    },
    openFlatPicker() {
      this.$refs.pickDate.fp.toggle()
    },
    closePopupPickupError() {
      this.$refs['modal-pickup-error-success'].hide()
    },
    handleDataErrorPickup(resData) {
      this.itemsDataOrder = []
      // eslint-disable-next-line array-callback-return
      resData.pickup_error.map(items => {
        this.loadingPickupError = true
        this.$http_komship.get(`v1/order/${this.profile.partner_id}/detail/${items.order_id}`).then(response => {
          const { data } = response.data
          this.itemsDataOrder.push(data)
          this.loadingPickupError = false
        }).catch(() => {
          this.loadingPickupError = false
          this.alertFail('Unable to get the order detail. Please try again later or contact support.')
        })
      })
    },
    handleDataOrderPickupError() {
      this.itemsPreviewProductOrder = this.itemsDataOrder
      this.$refs['modal-failed-request-pickup'].hide()
      this.$refs['modal-pickup-error-success'].hide()
    },
    formatPrice(value) {
      const val = value
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    submitNewPickup() {
      this.$refs['modal-alert-submit-pickup'].hide()
      this.submitPickup()
    },
    handleCloseAlertSubmit() {
      this.$refs['modal-alert-submit-pickup'].hide()
    },
    showAlertSubmitPickup() {
      this.$refs['modal-alert-submit-pickup'].show()
    },
  },
}
</script>

<style lang="scss">
  @import '~@core/scss/vue/libs/vue-select.scss';
  @import '../add-pickup.scss';

  @media only screen and (max-width: 990px) {
    [dir] .warning__wrapper__makesure {
      margin-left: 0px !important;
      padding-left: 0px !important;
    }
  }

  .proses__pickup:after {
    content: ' .';
    animation: dots 1s steps(5, end) infinite;
  }

  @keyframes dots {
    0%, 20% {
      color: rgba(0,0,0,0);
      text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);}
    40% {
      color: black;
      text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);}
    60% {
      text-shadow:
        .25em 0 0 black,
        .5em 0 0 rgba(0,0,0,0);}
    80%, 100% {
      text-shadow:
        .25em 0 0 black,
        .5em 0 0 black;}
  }

  @media only screen and (max-width: 576px) {
    [dir] .wrapper__animate__pickup__mobile {
      margin-left: -30px!important;
    }
  }

</style>
