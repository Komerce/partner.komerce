<template>
  <div class="container p-0">
    <h1 class="mb-2 h-text-xl">
      Informasi Saldo
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
              <p class="h-text-xs mb-0">Top Up</p>
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
                Rekening Bank
              </div>
            </div>
          </div>
          <div class="card-body pb-0 mb-0">
            <p class="h-text-md mt-1 mb-0">
              {{ rekening.nama }}
              <img
                src="@/assets/images/icons/arrow-down-light.svg"
                alt="Arrow Down"
                class="ml-1"
              >
            </p>
            <p class="h-text-xs mb-0">
              {{ `${rekening.bank} - ${rekening.noRek}` }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-12 mt-2">
        <div class="card">
          <div class="card-header mb-8 pb-0">
            <div class="h-text-lg">
              Riwayat Penarikan Saldo
            </div>
            <div class="d-flex justify-content-end">
              <date-range-picker
                ref="picker"
                v-model="dateRange"
                :locale-data="locale"
                :ranges="ranges"
                :opens="'left'"
                class="w-100 mr-1"
              >
                <template
                  v-slot:input="picker"
                  style="min-width: 350px"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <span
                      class="mr-2"
                    >{{ formatDate(picker.startDate) }} -
                      {{ formatDate(picker.endDate) }}</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 2V5"
                        stroke="#222222"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16 2V5"
                        stroke="#222222"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3.5 9.08984H20.5"
                        stroke="#222222"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                        stroke="#222222"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.6947 13.7002H15.7037"
                        stroke="#222222"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.6947 16.7002H15.7037"
                        stroke="#222222"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.9955 13.7002H12.0045"
                        stroke="#222222"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.9955 16.7002H12.0045"
                        stroke="#222222"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.29431 13.7002H8.30329"
                        stroke="#222222"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.29431 16.7002H8.30329"
                        stroke="#222222"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </template>
              </date-range-picker>
              <button
                class="btn btn-outline-primary"
                @click="$store.dispatch('saldo/exportSaldo')"
              >
                Export
              </button>
            </div>
          </div>
          <div class="card-body">
            <table class="table table-borderless mt-3">
              <thead>
                <tr>
                  <th
                    v-for="title in tableTitles"
                    :key="title"
                    class="
                      h-text-sm
                      transform-none
                      h-text-dark
                      bg-white
                      h-border-bottom
                      pb-2
                    "
                    scope="col"
                  >
                    {{ title }}
                  </th>
                </tr>
              </thead>
              <tbody class="h-text-xs font-weight-bold">
                <tr
                  v-for="riwayat in riwayatPenarikans"
                  :key="riwayatPenarikans.indexOf(riwayat)"
                  :class="
                    'py-1' +
                      (riwayatPenarikans.indexOf(riwayat) !=
                        riwayatPenarikans.length - 1
                        ? ' border-bottom'
                        : '')
                  "
                >
                  <th>
                    <p class="mb-0 h-text-dark">
                      {{ riwayat.tanggal }}
                    </p>
                    <p class="mb-0">
                      {{ riwayat.jam }}
                    </p>
                  </th>
                  <td>
                    <p class="mb-0 h-text-dark">
                      {{ riwayat.tujuan.nama }} - {{ riwayat.tujuan.bank }}
                    </p>
                    <p class="mb-0">
                      {{ riwayat.tujuan.noRek }}
                    </p>
                  </td>
                  <td class="h-text-dark">
                    {{ riwayat.status }}
                  </td>
                  <!-- <td class="h-text-dark">
                    {{ formatRupiah(riwayat.saldo) }}
                  </td> -->
                  <td class="h-text-dark">
                    {{ formatRupiah(riwayat.jumlahPenarikan) }}
                  </td>
                  <!-- <td class="h-text-dark">
                    {{ riwayat.sisaSaldo == null ? '-' : formatRupiah(riwayat.sisaSaldo) }}
                  </td> -->
                  <td>
                    <a
                      :href="'/keuangan/saldo/rincian/' + riwayat.id"
                      class="text-info"
                    >
                      Lihat Detail
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <b-pagination
              v-model="table.currentPage"
              class="mt-2 float-right"
              :total-rows="table.totalRows"
              :per-page="table.perPage"
            />
          </div>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script>
import moment from 'moment'
import { mapFields } from 'vuex-map-fields'
import {
  BFormGroup,
  BModal,
  BFormInput,
  BFormSelect,
  BPagination,
} from 'bootstrap-vue'
import { mapState, mapGetters } from 'vuex'
import DateRangePicker from 'vue2-daterange-picker'
import PincodeInput from 'vue-pincode-input'

import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import PopoverInfo from '../../../components/popover/PopoverInfo.vue'

export default {
  components: {
    BFormGroup,
    BModal,
    BFormInput,
    BFormSelect,
    BPagination,
    DateRangePicker,
    PincodeInput,
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
    const lastDateOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    )

    return {
      picker: {
        startDate: today,
        endDate: today,
      },
      locale: {
        format: 'dd/mm/yyyy',
      },
      ranges: {
        '7 Hari Terakhir': [last7, today],
        '30 Hari Terakhir': [last30, today],
        'Bulan Ini': [firstDateOfMonth, today],
      },
      today,
      last7,
      last30,
      firstDateOfMonth,
      lastDateOfMonth,
      tableTitles: [
        'Tanggal',
        'Tujuan Penarikan',
        'Status',
        'Jumlah Penarikan',
        'Rincian',
      ],
      clientKey: 'VT-client-yrHf-c8Sxr-ck8tx',
      snapToken: '31f5ef26-5121-44e9-97b5-f469039bf6cf',
      modalTitle: null,
      stepNow: 0,
      nominalState: null,
      rekTujuanState: null,
      obj: null,
    }
  },
  computed: {
    ...mapFields('saldo', [
      'dateRange',
      'nominalTopUp',
      'selectedRekTujuan',
      'nominal',
      'pin',
    ]),
    ...mapState('saldo', [
      'saldo',
      'saldoPending',
      'table',
      'riwayatPenarikans',
    ]),
    ...mapGetters('saldo', ['rekenings', 'rekening', 'rekTujuanOptions']),
  },
  watch: {
    'table.currentPage': {
      handler() {
        this.$store.dispatch('saldo/getWithdrawalRequest')
      },
    },
    dateRange: {
      handler() {
        this.$store.commit('saldo/UPDATE_CURRENT_PAGE', 1)
        this.$store.dispatch('saldo/getWithdrawalRequest')
      },
      deep: true,
    },
  },
  beforeMount() {
    this.$store.dispatch('saldo/init')
  },
  mounted() {
    if (!window.snapScriptLoaded) {
      const snapScriptEl = document.createElement('script')
      snapScriptEl.setAttribute(
        'src',
        'https://app.sandbox.midtrans.com/snap/snap.js',
      )
      snapScriptEl.setAttribute('data-client-key', this.clientKey)
      document.head.appendChild(snapScriptEl)
      window.snapScriptLoaded = 1
    }
  },
  methods: {
    formatRibuan(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
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
    stopCarret() {
      const obj = document.getElementById('input2')
      if (obj.value.length > 5) {
        this.setCaretPosition(obj, 0)
      }
    },
    setCaretPosition(elem, caretPos) {
      if (elem != null) {
        if (elem.createTextRange) {
          const range = elem.createTextRange()
          range.move('character', caretPos)
          range.select()
        } else if (elem.selectionStart) {
          elem.focus()
          elem.setSelectionRange(caretPos, caretPos)
        } else {
          elem.focus()
        }
      }
    },
    alertFail() {
      this.$swal({
        title:
          '<span class="font-weight-bold h4">Maaf sedang ada gangguan,<br>coba lagi nanti</span>',
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
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

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
.reportrange-text {
  background-color: #f1f2f6 !important;
  display: flex;
}
</style>
