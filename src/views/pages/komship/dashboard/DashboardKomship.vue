<template>
  <div class="container p-0">
    <h1 class="mb-2 h-text-xl">
      Dashboard
    </h1>
    <div class="row">
      <div class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-header mb-8 pb-0">
            <div class="d-flex align-items-center">
              <div class="first-card-header-text me-8 mb-0">
                Saldo
              </div>
              <popover-info text="Saldo kamu saat ini." />
            </div>
          </div>
          <div class="card-body h-text-xl pb-0 mb-0">
            {{ formatRupiah(saldo) }}
          </div>
          <div
            class="
              card-footer
              d-flex
              justify-content-around
              bg-orange
              text-white
              rounded-16
              py-9
            "
          >
            <a
              class="
                d-flex
                flex-column
                justify-content-center
                align-items-center
              "
              @click="showTopUpModal()"
            >
              <img
                src="@/assets/images/icons/send-square.svg"
                alt="Top Up"
              >
              <p class="saldo-texts mb-0">
                Top Up
              </p>
            </a>
            <a
              class="
                d-flex
                flex-column
                justify-content-center
                align-items-center
              "
              @click="showModal()"
            >
              <img
                src="@/assets/images/icons/receive-square.svg"
                alt="Tarik Saldo"
              >
              <p class="h-text-xs mb-0">Tarik Saldo</p>
            </a>
            <a
              href="/keuangan/saldo/detail"
              class="
                d-flex
                text-reset
                flex-column
                justify-content-center
                align-items-center
              "
            >
              <img
                src="@/assets/images/icons/document-text.svg"
                alt="Detail"
              >
              <p class="h-text-xs mb-0">Detail</p>
            </a>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-header mb-8 pb-0">
            <div class="d-flex align-items-center">
              <div class="first-card-header-text me-8 mb-0">
                Saldo Pending
              </div>
              <popover-info text="Saldo Pending merupakan saldo yang akan kamu terima ketika orderan yang statusnya dikirim telah berubah menjadi diterima." />
            </div>
            <img
              src="@/assets/images/icons/arrow-square-right.svg"
              alt="Arrow Right"
            >
          </div>
          <div class="card-body h-text-xl pb-0 mb-0">
            {{ formatRupiah(saldoPending) }}
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-header mb-8 pb-0">
            <div class="d-flex align-items-center">
              <div class="first-card-header-text me-8 mb-0">
                Cashback
              </div>
            </div>
          </div>
          <div class="card-body pb-0 mb-0">
            <div class="h-text-xl pb-0 mb-0">
              {{ formatRupiah(cashback) }}
            </div>
            <p class="mb-0">
              Total cashback yang kamu dapatkan semenjak menggunakan Komship
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-6 mt-2">
        <div class="card h-100">
          <div class="card-header flex-nowrap">
            <div class="d-flex align-items-center">
              <div class="first-card-header-text me-8 mb-0">
                Penghasilan
              </div>
              <popover-info text="Penghasilan merupakan grafik keuangan dari orderan yang telah kamu masukkan ke Komship dari 7 hari terakhir." />
            </div>
            <b-form-group class="flex-grow-1 pl-3 pr-1 mb-0">
              <v-select
                v-model="selectedPenghasilan"
                label="Square"
                dir="ltr"
                :options="optionsPenghasilan"
                :clearable="false"
              />
            </b-form-group>
          </div>
          <div class="position-relative card-body">
            <v-select
              v-model="selectedChart"
              label="Square"
              dir="ltr"
              class="select-chart position-absolute"
              :options="optionsChart"
              :clearable="false"
              @input="handleChangeChart"
            />
            <ChartPenghasilan
              :datasets="partnerIncomeGraph.datasets"
              :labels="partnerIncomeGraph.labels"
              class="mt-1"
            />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mt-2">
        <div class="card">
          <div class="row gap-1 my-24 mx-16">
            <div class="col-6">
              <div
                class="
                  border-gray
                  d-flex
                  flex-column
                  justify-content-between
                  rounded-16
                  p-12
                  h-100
                "
              >
                <p class="mb-0 order-head-text">
                  Orderan Perlu Dikirim
                </p>
                <div class="d-flex justify-content-between align-items-center">
                  <p class="mb-0 order-body-text">
                    {{ formatRibuan(orderanPerluDikirim) }}
                  </p>
                  <img
                    src="@/assets/images/icons/arrow-right-2.svg"
                    alt="Arrow Right"
                  >
                </div>
              </div>
            </div>
            <div class="col-6">
              <div
                class="
                  border-gray
                  d-flex
                  flex-column
                  justify-content-between
                  rounded-16
                  p-12
                  h-100
                "
              >
                <p class="mb-0 order-head-text">
                  Orderan Retur
                </p>
                <div class="d-flex justify-content-between align-items-center">
                  <p class="mb-0 order-body-text">
                    {{ formatRibuan(orderanRetur) }}
                  </p>
                  <img
                    src="@/assets/images/icons/arrow-right-2.svg"
                    alt="Arrow Right"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card h-70 mb-0">
          <div class="card-header">
            <div class="d-flex align-items-center">
              <div class="first-card-header-text me-8 mb-0">
                Top Admin Order
              </div>
              <popover-info text="Top Admin Order merupakan orang yang menginputkan order paling banyak berdasarkan nilai orderan" />
            </div>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li
                v-for="topAdminOrder in topAdminOrders"
                :key="topAdminOrders.indexOf(topAdminOrder)"
                class="list-group-item px-0"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <img
                      src="@/assets/images/icons/profile-placehold.svg"
                      alt="Photo"
                    >
                    <p class="list-text-1 h-text-dark ml-2 mb-0">
                      {{ topAdminOrder.name }}
                    </p>
                  </div>
                  <div class="right">
                    <p class="list-text-2 text-green mb-0">
                      {{ formatRupiah(topAdminOrder.totalDana) }}
                    </p>
                    <p class="list-text-3 mb-0">
                      {{ topAdminOrder.totalProduk }}pcs
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-6 mt-2">
        <div class="card h-100 mb-0">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <div class="first-card-header-text me-8 mb-0">
                Produk Terlaris
              </div>
              <popover-info text="Produk Terlaris merupakan produk kamu yang paling banyak di order." />
            </div>
            <img
              src="@/assets/images/icons/arrow-square-right.svg"
              alt="Arrow Right"
            >
          </div>
          <div class="card-body">
            <div class="w-25">
              <b-form-group class="mb-0">
                <v-select
                  id="select_produk_terlaris"
                  v-model="selectedProdukTerlaris"
                  label="Bulan Ini"
                  dir="ltr"
                  :options="optionsProdukTerlaris"
                  :clearable="false"
                  @input="handleChangeProdukTerlaris"
                />
              </b-form-group>
            </div>
            <ul class="list-group list-group-flush">
              <template v-if="produkTerlarises.length > 0">
                <li
                  v-for="produkTerlaris in produkTerlarises"
                  :key="produkTerlarises.indexOf(produkTerlaris)"
                  class="list-group-item px-0"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <img
                        width="35"
                        class="img-fluid"
                        :src="produkTerlaris.photo"
                        alt="Photo"
                      >
                      <div>
                        <p class="list-text-1 h-text-dark ml-2 mb-0">
                          {{ produkTerlaris.name }}
                        </p>
                        <p class="saldo-texts ml-2 mb-0">
                          SKU: {{ produkTerlaris.kodeBrg }}
                        </p>
                      </div>
                    </div>
                    <div class="right">
                      <p class="list-text-2 h-text-dark mb-0">
                        {{ produkTerlaris.penjualan }}
                      </p>
                      <div
                        :class="
                          `badge h-badge-${
                            produkTerlaris.persentase >= 0 ? 'success' : 'danger'
                          } rounded-pill font-weight-normal`
                        "
                      >
                        {{ produkTerlaris.persentase >= 0 ? '+' : ''
                        }}{{ produkTerlaris.persentase }}%
                      </div>
                      <img
                        v-if="produkTerlaris.persentase >= 0"
                        src="@/assets/images/icons/arrow-going-up-alt.svg"
                        alt="arrow-going-up-alt"
                      >
                      <img
                        v-else
                        src="@/assets/images/icons/arrow-going-down-alt.svg"
                        alt="arrow-going-down-alt"
                      >
                    </div>
                  </div>
                </li>
              </template>
              <template v-else>
                <div class="text-center py-4">
                  Tidak Ada Data
                </div>
              </template>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mt-2">
        <div class="card h-100 mb-0">
          <div class="card-header">
            <div class="d-flex align-items-center">
              <div class="first-card-header-text me-8 mb-0">
                Customer Loyal
              </div>
              <popover-info text="Customer Loyal merupakan customer yang sering melakukan order." />
            </div>
            <img
              src="@/assets/images/icons/arrow-square-right.svg"
              alt="Arrow Right"
            >
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li
                v-for="customerLoyal in customerLoyals"
                :key="customerLoyals.indexOf(customerLoyal)"
                class="list-group-item px-0"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <p class="list-text-1 h-text-dark mb-0">
                      {{ customerLoyal.name }}
                    </p>
                    <p class="saldo-texts mb-0">
                      {{ customerLoyal.location }}
                    </p>
                  </div>
                  <div class="right">
                    <p class="list-text-2 h-text-dark mb-0">
                      {{ customerLoyal.totalProduk }}
                    </p>
                    <p class="list-text-3 mb-0">
                      {{ formatRupiah(customerLoyal.totalDana) }},-
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- <div :class="'row' + (blurred ? ' position-relative' : '')">
      <div :class="'col-12 col-md-7 mt-2 pt-1' + (blurred ? ' blurry' : '')">
        <div class="card h-100 mb-0">
          <div class="card-header flex-nowrap">
            <div class="d-flex align-items-center">
              <div class="first-card-header-text me-8 mb-0">
                Performa Customer Service
              </div>
              <img
                src="@/assets/images/icons/info-circle.svg"
                alt="Info"
              >
            </div>
            <date-range-picker
              ref="picker"
              v-model="dateRange"
              :locale-data="locale"
              :ranges="ranges"
              class="w-25"
            >
              <template
                v-slot:input="pickers"
                style="min-width: 350px;"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <span>{{ getRange(pickers.startDate, pickers.endDate) }}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-chevron-down"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
              </template>
            </date-range-picker>
          </div>
          <div class="card-body">
            <ChartPerforma
              :series-prop="series"
              :categories-prop="categories"
            />
          </div>
        </div>
      </div>
      <div :class="'col-12 col-md-5 mt-2 pt-1' + (blurred ? ' blurry' : '')">
        <div class="card h-100 mb-0">
          <div class="card-header">
            <div class="d-flex align-items-center">
              <div class="first-card-header-text me-8 mb-0">
                Top Customer Service
              </div>
              <img
                src="@/assets/images/icons/info-circle.svg"
                alt="Info"
              >
            </div>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li
                v-for="topCustomerService in topCustomerServices"
                :key="topCustomerServices.indexOf(topCustomerService)"
                class="list-group-item px-0"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <img
                      src="@/assets/images/icons/profile-placehold.svg"
                      alt="Photo"
                    >
                    <p class="list-text-1 h-text-dark ml-2 mb-0">
                      {{ topCustomerService.name }}
                    </p>
                  </div>
                  <div class="right">
                    <p class="list-text-2 text-green mb-0">
                      {{ formatRupiah(topCustomerService.totalDana) }}
                    </p>
                    <p class="list-text-3 mb-0">
                      {{ topCustomerService.totalProduk }}pcs
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        v-if="blurred"
        class="position-absolute pos-center text-center"
      >
        <p class="h3 font-weight-bolder mb-2">
          Yuk, Hiring Talent Komerce agar kamu<br>dapat menggunakan fitur ini!
        </p>
        <button class="btn btn-outline-primary">Tutup</button>
      </div>
    </div> -->
    <b-modal
      id="modalTopUp"
      centered
      hide-header
    >
      <a
        href="#"
        @click="closeModal()"
      >
        <img
          src="@/assets/images/icons/close-circle.svg"
          height="18"
          width="18"
          alt="close"
          class="float-right"
        >
      </a>
      <div class="p-1">
        <p class="text-center h-text-lg mb-2">
          Top Up Saldo
        </p>
      </div>
      <form id="formTopUp">
        <div class="row align-items-center my-2">
          <div class="col-4">
            <p class="font-weight-bold h-text-sm h-text-dark mb-0">
              Nominal
            </p>
          </div>
          <b-form-group
            class="col-8 mb-0"
            invalid-feedback="Nominal is required"
          >
            <b-form-input
              id="nominal-topup"
              v-model="nominalTopUp"
              type="tel"
              data-type="currency"
              required
              class="h-text-sm h-text-dark"
              @keyup="formatCurrency(false, 'nominal-topup')"
              @blur="formatCurrency(true, 'nominal-topup')"
            />
          </b-form-group>
        </div>
      </form>
      <template #modal-footer>
        <button
          class="btn btn-outline-primary rounded-lg"
          @click="$bvModal.hide('modalTopUp')"
        >
          Batal
        </button>
        <button
          class="btn btn-primary rounded-lg"
          @click="topUpSaldo()"
        >
          Top Up Sekarang
        </button>
      </template>
    </b-modal>
    <b-modal
      id="modal-keuangan"
      body-class="p-1"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      no-close-on-esc
    >
      <a
        href="#"
        @click="closeModal()"
      >
        <img
          src="@/assets/images/icons/close-circle.svg"
          height="18"
          width="18"
          alt="close"
          class="float-right"
        >
      </a>
      <div class="p-1">
        <p
          id="modal-title"
          class="text-center h-text-lg mb-2"
        >
          {{ modalTitle }}
        </p>
        <div v-if="stepNow === 0">
          <form
            ref="form1"
            class="row align-items-center"
            @submit.stop.prevent="handleSubmit(1)"
          >
            <div class="col-5 mb-1">
              <p class="h-text-sm h-text-dark mb-0">
                Nominal
              </p>
            </div>
            <b-form-group
              class="col-7 mb-1"
              invalid-feedback="Nominal is required"
              :state="nominalState"
            >
              <b-form-input
                id="nominal-input"
                v-model="nominal"
                type="tel"
                data-type="currency"
                required
                class="h-text-sm h-text-dark"
                :state="nominalState"
                @keyup="formatCurrency(false, 'nominal-input')"
                @blur="formatCurrency(true, 'nominal-input')"
              />
            </b-form-group>
            <div class="col-5 mb-1">
              <p class="h-text-sm h-text-dark mb-0">
                Rekening Tujuan
              </p>
            </div>
            <b-form-group
              class="col-7 mb-1"
              invalid-feedback="Rekening tujuan is required"
              :state="rekTujuanState"
            >
              <b-form-select
                v-model="selectedRekTujuan"
                class="h-text-sm h-text-dark"
                :options="rekTujuanOptions"
                required
              />
            </b-form-group>
            <div class="col-12 text-right mt-3">
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="closeModal()"
              >
                Batal
              </button>
              <button
                type="submit"
                class="btn btn-primary ml-2"
              >
                Ajukan Penarikan
              </button>
            </div>
          </form>
        </div>
        <div v-if="stepNow === 1">
          <form
            ref="form2"
            @submit.stop.prevent="handleSubmit(2)"
          >
            <p class="text-center h-text-dark font-weight-bold mb-3">
              Mohon verifikasi identitas kamu dengan memasukan PIN
            </p>
            <PincodeInput
              v-model="pin"
              :length="6"
              class="font-weight-bold h-text-dark"
            />
            <div class="col-12 mt-2">
              <div class="text-center">
                <button
                  type="submit"
                  class="btn btn-primary d-block m-auto"
                >
                  Konfirmasi
                </button>
                <button
                  type="button"
                  class="btn btn-link mt-1"
                  @click="modalBack()"
                >
                  Kembali
                </button>
              </div>
            </div>
          </form>
        </div>
        <div
          v-if="stepNow === 2"
          class="text-center"
        >
          <img
            src="@/assets/images/icons/success.svg"
            alt="success"
          >
          <p class="mt-2 h-text-md text-center">
            Penarikan Saldo Berhasil
          </p>
          <p class="h-text-dark font-weight-bold">
            Saldo sebesar {{ formatRupiah(nominal) }} akan segera dikirim ke
            rekening atas nama {{ rekening.nama }} - {{ rekening.bank }} dalam
            1x24 jam
          </p>
        </div>
      </div>
    </b-modal>

    <onboarding
      ref="onboardingElement"
      :current-stage="0"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import {
  BFormGroup, BModal, BFormInput, BFormSelect,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import PincodeInput from 'vue-pincode-input'
import vSelect from 'vue-select'
import moment from 'moment'
// import DateRangePicker from 'vue2-daterange-picker'
import ChartPenghasilan from '../../../components/chart/ChartPenghasilan.vue'
// import ChartPerforma from '../../../components/chart/ChartPerforma.vue'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import Onboarding from '../onboarding/Onboarding.vue'
import PopoverInfo from '../../../components/popover/PopoverInfo.vue'

export default {
  components: {
    BFormGroup,
    BModal,
    BFormInput,
    BFormSelect,
    ChartPenghasilan,
    // ChartPerforma,
    // DateRangePicker,
    PincodeInput,
    vSelect,
    Onboarding,
    PopoverInfo,
  },
  data() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const last7 = new Date()
    last7.setDate(today.getDate() - 6)
    last7.setHours(0, 0, 0, 0)

    const last30 = new Date()
    last30.setDate(today.getDate() - 29)
    last30.setHours(0, 0, 0, 0)

    const firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDateOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    return {
      topCustomerServices: [
        {
          photo: null,
          name: 'Afifah Mimo',
          totalDana: 25000000,
          totalProduk: 500,
        },
        {
          photo: null,
          name: 'Afifah Mimo',
          totalDana: 25000000,
          totalProduk: 500,
        },
        {
          photo: null,
          name: 'Afifah Mimo',
          totalDana: 25000000,
          totalProduk: 500,
        },
        {
          photo: null,
          name: 'Afifah Mimo',
          totalDana: 25000000,
          totalProduk: 500,
        },
        {
          photo: null,
          name: 'Afifah Mimo',
          totalDana: 25000000,
          totalProduk: 500,
        },
      ],
      selectedPenghasilan: 'Komship',
      optionsPenghasilan: ['Komship'],
      dropDownValues: ['Real Time', '7 Hari Terakhir', '30 Hari Terakhir', 'Custom Tanggal'],
      selectedCstDateBefore: null,
      selectedCstDate: 'Real Time',
      customDate: Date.now(),
      cstDateCfg: {
        mode: 'range',
        inline: true,
        altFormat: 'M j, Y',
        altInput: true,
        altInputClass: 'd-none',
      },
      err: false,
      blurred: false,
      dateRange: {
        startDate: today,
        endDate: today,
      },
      picker: {
        startDate: today,
        endDate: today,
      },
      locale: {
        format: 'dd/mm/yyyy',
      },
      ranges: {
        'Real Time': [today, today],
        '7 Hari Terakhir': [last7, today],
        '30 Hari Terakhir': [last30, today],
        'Bulan Ini': [firstDateOfMonth, lastDateOfMonth],
        'Custom Tanggal': [null, null],
      },
      today,
      last7,
      last30,
      firstDateOfMonth,
      lastDateOfMonth,
      series: [],
      categories: ['abc', 'def', 'ghi', 'jkl'],
      modalTitle: null,
      stepNow: 0,
      nominalState: null,
      rekTujuanState: null,
      obj: null,
    }
  },
  computed: {
    ...mapFields('dashboard', { selectedProdukTerlaris: 'selectedProdukTerlaris', selectedChart: 'selectedChart' }),
    ...mapState('dashboard', [
      'saldo',
      'saldoPending',
      'cashback',
      'orderanPerluDikirim',
      'orderanRetur',
      'topAdminOrders',
      'customerLoyals',
      'produkTerlarises',
      'optionsProdukTerlaris',
      'optionsChart',
    ]),
    ...mapGetters('dashboard', ['partnerIncomeGraph']),
    ...mapFields('saldo', [
      'nominalTopUp',
      'selectedRekTujuan',
      'nominal',
      'pin',
    ]),
    ...mapGetters('saldo', ['rekenings', 'rekening', 'rekTujuanOptions']),
  },
  mounted() {
    this.$http_komship.post('v1/my-profile', {
      headers: { Authorization: `Bearer ${useJwt.getToken()}` },
    }).then(response => {
      const { data } = response.data
      console.log('onboarding', data)
      if (data) {
        if (data.is_onboarding) this.$refs.onboardingElement.showModal()
      }
    })
  },
  beforeMount() {
    this.$store.dispatch('dashboard/init')
    this.$store.dispatch('saldo/getBankAccount')
  },
  methods: {
    formatRibuan(x) {
      if (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
      return x
    },
    formatRupiah(x) {
      return `Rp ${this.formatRibuan(x)}`
    },
    showTopUpModal() {
      this.$bvModal.show('modalTopUp')
    },
    async topUpSaldo() {
      try {
        const response = await this.$store.dispatch('saldo/topUpSaldo')
        this.closeModal()
        if (!response.data.status) throw response.data
        await this.$swal({
          title:
            '<span class="font-weight-bold h4">Top Up Saldo Berhasil</span>',
          text: `Top Up sebesar ${this.formatRupiah(
            response.data.data.amount,
          )} berhasil. Silahkan Melakukan Pembayaran.`,
          imageUrl: require('@/assets/images/icons/success.svg'), // eslint-disable-line
          confirmButtonText: 'Buka Invoice',
          customClass: {
            confirmButton: 'btn bg-orange2 btn-primary rounded-lg',
          },
          buttonsStyling: false,
        })
        window.open(response.data.data.invoice_xendit_url, '_blank').focus()
      } catch (e) {
        this.$swal({
          title: '<span class="font-weight-bold h4">Top Up Saldo Gagal</span>',
          text: e.message,
          imageUrl: require('@/assets/images/icons/fail.svg'), // eslint-disable-line
          showCloseButton: false,
          focusConfirm: true,
          confirmButtonText: 'Oke',
          customClass: {
            confirmButton: 'btn bg-orange2 btn-primary rounded-lg',
          },
          buttonsStyling: false,
        })
      } finally {
        this.$store.commit('saldo/UPDATE_NOMINAL', '')
      }
      // window.snap.pay(this.snapToken, {
      //   onSuccess: function(res){ console.log('Snap result:', res) }, // eslint-disable-line
      //   onPending: function(res){ console.log('Snap result:', res) }, // eslint-disable-line
      //   onError: function(res){ console.log('Snap result:', res) }, // eslint-disable-line
      // })
    },
    formatDate(d) {
      return moment(d).format('D MMM YYYY')
    },
    formatNumber(n) {
      return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    showModal() {
      this.resetModal()
      this.$bvModal.show('modal-keuangan')
    },
    closeModal() {
      this.$bvModal.hide('modalTopUp')
      this.$bvModal.hide('modal-keuangan')
    },
    checkFormValidity(step) {
      let valid = null

      switch (step) {
        case 1:
          valid = this.$refs.form1.checkValidity()
          this.nominalState = valid
          this.rekTujuanState = valid
          break
        case 2:
          valid = this.$refs.form2.checkValidity()
          break
        default:
          break
      }
      return valid
    },
    resetModal() {
      this.stepNow = 0
      this.modalTitle = 'Penarikan Saldo'
      this.nominal = ''
      this.nominalState = null
      this.pin = ''
      this.pinState = null
      this.selectedRekTujuan = null
    },
    modalBack() {
      const nominalBefore = this.nominal
      const rekTujuanBefore = this.selectedRekTujuan
      this.resetModal()
      this.nominal = nominalBefore
      this.selectedRekTujuan = rekTujuanBefore
    },
    async handleSubmit(step) {
      if (!this.checkFormValidity(step)) {
        return
      }

      switch (step) {
        case 1:
          this.$nextTick(() => {
            this.stepNow = 1
            this.modalTitle = 'Verifikasi PIN'
          })
          break
        case 2:
          try {
            const response = await this.$store.dispatch('saldo/checkPin')
            if (!response.data.data.is_match) {
              throw { message: 'Maaf pin yang anda masukkan salah' } // eslint-disable-line
            }
            await this.$store.dispatch('saldo/withdrawalRequest')
            this.$nextTick(() => {
              this.stepNow = 2
              this.modalTitle = null
            })
          } catch (e) {
            this.$swal({
              title:
                '<span class="font-weight-bold h4">Penarikan Saldo Gagal</span>',
              text: e.message,
              imageUrl: require('@/assets/images/icons/fail.svg'), // eslint-disable-line
              showCloseButton: false,
              focusConfirm: true,
              confirmButtonText: 'Oke',
              customClass: {
                confirmButton: 'btn bg-orange2 btn-primary rounded-lg',
              },
              buttonsStyling: false,
            })
          }
          break
        default:
          break
      }
    },
    formatCurrency(blur, el) {
      const input = document.getElementById(el)
      let inputVal = input.value

      if (inputVal === '' || inputVal === 'Rp' || inputVal === 'Rp ') {
        return
      }

      const originalLen = inputVal.length
      let caretPos = input.selectionStart

      if (inputVal.indexOf(',') >= 0) {
        const decimalPos = inputVal.indexOf(',')
        let leftSide = inputVal.substring(0, decimalPos)
        let rightSide = inputVal.substring(decimalPos)

        leftSide = this.formatNumber(leftSide)
        rightSide = this.formatNumber(rightSide)

        if (blur) {
          rightSide += '00'
        }
        rightSide = rightSide.substring(0, 2)
        inputVal = 'Rp ' + leftSide + ',' + rightSide // eslint-disable-line
      } else {
        inputVal = this.formatNumber(inputVal)
        inputVal = 'Rp ' + inputVal // eslint-disable-line

        if (blur) {
          inputVal += ',00'
        }
      }

      input.value = inputVal

      const updatedLen = inputVal.length
      caretPos = updatedLen - originalLen + caretPos
      input.setSelectionRange(caretPos, caretPos)
    },
    alertFail() {
      this.$swal({
        title: '<span class="font-weight-bold h4">Maaf sedang ada gangguan,<br>coba lagi nanti</span>',
        imageUrl: require('@/assets/images/icons/fail.svg'), // eslint-disable-line
        showCloseButton: false,
        focusConfirm: true,
        confirmButtonText: 'Oke',
        customClass: {
          confirmButton: 'btn bg-orange2 btn-primary rounded-lg',
        },
        buttonsStyling: false,
      })
    },
    selectCstDate(val) {
      this.selectedCstDateBefore = this.selectedCstDate
      this.selectedCstDate = val
    },
    closeDropdown(batal) {
      this.err = false

      if (batal) {
        this.customDate = null
        this.selectedCstDate = this.selectedCstDateBefore
        this.$refs.dropdown.hide(true)
      } else if (this.customDate) {
        this.$refs.dropdown.hide(true)
      } else {
        this.err = true
      }
    },
    getRange(first, last) {
      if (moment(first).format('l') === moment(this.today).format('l') && moment(last).format('l') === moment(this.today).format('l')) {
        this.changeData(1)
        return 'Real Time'
      } else if (moment(first).format('l') === moment(this.last7).format('l') && moment(last).format('l') === moment(this.today).format('l')) { // eslint-disable-line
        this.changeData(2)
        return '7 Hari Terakhir'
      } else if (moment(first).format('l') === moment(this.last30).format('l') && moment(last).format('l') === moment(this.today).format('l')) {
        this.changeData(3)
        return '30 Hari Terakhir'
      } else if (moment(first).format('l') === moment(this.firstDateOfMonth).format('l') && moment(last).format('l') === moment(this.lastDateOfMonth).format('l')) {
        this.changeData(4)
        return 'Bulan Ini'
      } else {
        this.changeData(5)
        return 'Custom Tanggal'
      }
    },
    changeData(val) {
      const lcategories = []
      switch (val) {
        case 1:
          this.series = [
            {
              name: 'Leads',
              data: ['24', '23', '27', '20', '25', '28', '21'],
            },
            {
              name: 'Orders',
              data: ['14', '13', '17', '20', '15', '18', '11'],
            },
            {
              name: 'Pcs',
              data: ['4', '3', '7', '10', '5', '8', '1'],
            },
          ]
          this.categories = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
          break
        case 2:
          this.series = [
            {
              name: 'Leads',
              data: ['2400000', '2300000', '2700000', '2000000', '2500000', '2800000', '2100000'],
            },
            {
              name: 'Orders',
              data: ['1400000', '1300000', '1700000', '2000000', '1500000', '1800000', '1100000'],
            },
            {
              name: 'Pcs',
              data: ['400000', '300000', '700000', '1000000', '500000', '800000', '100000'],
            },
          ]
          this.categories = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
          break
        case 3:
        case 4:
        case 5:
          this.series = [
            {
              name: 'Leads',
              data: ['24', '23', '27', '20', '25', '28', '21', '24', '23', '27', '20', '25', '28', '21', '24'],
            },
            {
              name: 'Orders',
              data: ['14', '13', '17', '20', '15', '18', '11', '14', '13', '17', '20', '15', '18', '11', '14'],
            },
            {
              name: 'Pcs',
              data: ['4', '3', '7', '10', '5', '8', '1', '4', '3', '7', '10', '5', '8', '1', '4'],
            },
          ]
          for (let i = 0; i < 29; i++) { //eslint-disable-line
            if (i % 2 !== 0) {
              lcategories.push(`${i}`)
            }
          }
          lcategories.push('30')
          this.categories = lcategories
          break
        default:
          break
      }
    },
    handleChangeProdukTerlaris() {
      this.$store.dispatch('dashboard/getProdukTerlarises')
    },
    handleChangeChart() {
      this.$store.dispatch('dashboard/getPartnerIncomeGraph')
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.bg-orange {
  background-color: #ff6a3a !important;
}
.bg-orange2 {
  background-color: #f95031 !important;
}
.bg-green {
  background-color: #0faa60 !important;
}
.card,
.rounded-16 {
  border-radius: 16px !important;
}
.first-card-header-text {
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.5px;
  text-align: left;
}
.saldo-texts {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0.5px;
  text-align: left;
}
.h-text-xl {
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 48px;
  letter-spacing: 0.5px;
  text-align: left;
  color: #222222;
}
.order-head-text {
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
}
.order-body-text {
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 36px;
  letter-spacing: 0.5px;
  text-align: left;
  color: #222222;
}
.container {
  font-family: 'Poppins', sans-serif;
}
.bg-orange {
  background-color: #ff6a3a !important;
}
.bg-orange2 {
  background-color: #f95031 !important;
}
.card,
.rounded-16 {
  border-radius: 16px !important;
}
.first-card-header-text {
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.5px;
  text-align: left;
}
.h-text-xl {
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 48px;
  letter-spacing: 0.5px;
  text-align: left;
  color: #222222;
}
.h-text-lg {
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 36px;
  letter-spacing: 0.5px;
  text-align: left;
  color: #222222;
}
.h-text-md {
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 27px;
  letter-spacing: 0.5px;
  text-align: left;
  color: #222222;
}
.h-text-sm {
  font-size: 16px !important;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
}
.h-text-xs {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0.5px;
  text-align: left;
}
.py-9 {
  padding-top: 9px;
  padding-bottom: 9px;
}
.me-8 {
  margin-right: 8px;
}
.mb-8 {
  margin-bottom: 8px;
}
.h-text-dark {
  color: #222222 !important;
}
.transform-none {
  text-transform: none !important;
}
.h-border-bottom {
  border-bottom: 2px solid #c2c2c2 !important;
}
.w-20e {
  width: 20em;
}
#input2 {
  padding-left: 15px;
  letter-spacing: 42px;
  border: none !important;
  outline: none !important;
  background-image: linear-gradient(
    to left,
    black 70%,
    rgba(255, 255, 255, 0) 0%
  );
  background-position: bottom;
  background-size: 50px 2px;
  background-repeat: repeat-x;
  background-position-x: 35px;
  width: 300px;
  min-width: 300px;
}
#divInner {
  left: 0;
  position: sticky;
}
#divOuter {
  width: 288px;
  overflow: hidden;
}
.btn-primary {
  background-color: #f95031 !important;
}
.btn-outline-primary {
  border-color: #f95031 !important;
}
.ms-8 {
  margin-left: 8px;
}
.me-8 {
  margin-right: 8px;
}
.mb-8 {
  margin-bottom: 8px;
}
.py-9 {
  padding-top: 9px;
  padding-bottom: 9px;
}
.mx-16 {
  margin-left: 16px;
  margin-right: 16px;
}
.my-24 {
  margin-top: 24px;
  margin-bottom: 24px;
}
.p-12 {
  padding: 12px;
}
.h-text-dark {
  color: #222222;
}
.border-gray {
  border: 1px solid #e2e2e2;
}
.list-text-1 {
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 27px;
  letter-spacing: 0.5px;
  text-align: left;
}
.list-text-2 {
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 27px;
  letter-spacing: 0.5px;
  text-align: right;
}
.list-text-3 {
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0.5px;
  text-align: right;
}
.text-green {
  color: #34a770;
}
.h-badge-success {
  background-color: #dcf3eb;
  color: #34a770;
}
.h-badge-danger {
  background-color: #ffeded;
  color: #e31a1a;
}
#select_produk_terlaris > div {
  border: none;
  padding-left: 0px;
}
#select_produk_terlaris > div > .vs__selected-options,
#select_produk_terlaris > div > .vs__selected-options > .vs__selected {
  padding-left: 0px;
  margin-left: 0;
}
.select-chart {
  right: 42px;
  width: 38%;
}
.h-70 {
  height: 70%;
}
.w-30 {
  width: 30%;
}
.blurry {
  filter: blur(7px);
  pointer-events: none;
  user-select: none;
}
.pos-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.dropdown-item {
  width: 100% !important;
}
.vue-pincode-input-wrapper {
  width: 100%;
  justify-content: center;
}
input.vue-pincode-input {
  border-radius: 0;
  box-shadow: none !important;
  border-bottom: 3px solid #222222;
  margin-left: 5px;
  margin-right: 5px;
  max-width: 67px;
}
</style>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
