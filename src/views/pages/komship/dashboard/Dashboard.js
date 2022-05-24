import CodeInput from 'vue-verification-code-input'
import { mapState, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import {
  BFormGroup,
  BModal,
  BFormInput,
  BFormSelect,
  BSpinner,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import vSelect from 'vue-select'
import moment from 'moment'
import LottieAnimation from 'lottie-vuejs/src/LottieAnimation.vue'
import ChartPenghasilan from '@/views/components/chart/ChartPenghasilan.vue'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import PopoverInfo from '@/views/components/popover/PopoverInfo.vue'

export default {
  components: {
    LottieAnimation,
    BFormGroup,
    BModal,
    BFormInput,
    BFormSelect,
    ChartPenghasilan,
    vSelect,
    PopoverInfo,
    BSpinner,
    CodeInput,
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
      dropDownValues: [
        'Real Time',
        '7 Hari Terakhir',
        '30 Hari Terakhir',
        'Custom Tanggal',
      ],
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
      status: true,
      nominalState: null,
      rekTujuanState: null,
      obj: null,

      loadingSubmitTopUp: false,

      optionRekIsEmpty: [
        {
          value: 'Anda belum menambahkan rekening bank',
          text: 'Anda belum menambahkan rekening bank',
        },
      ],
      visibilityPin: 'password',
      loadingOnboarding: true,
      disabledOnboardingMulai: false,
      stepped: 1,
      maxStepOnboard: 5,
    }
  },
  computed: {
    ...mapFields('dashboard', {
      selectedProdukTerlaris: 'selectedProdukTerlaris',
      selectedChart: 'selectedChart',
    }),
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
    this.$http_komship
      .post('v1/my-profile', {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      })
      .then(response => {
        const { data } = response.data
        if (data) {
          if (!data.is_onboarding) {
            this.$bvModal.show('modal-onboarding')
          } else {
            this.loadingOnboarding = false
          }
        }
      })
  },
  beforeMount() {
    this.$store.dispatch('dashboard/init')
    this.$store.dispatch('saldo/getBankAccount')
  },
  methods: {
    handleStepOnboard(params) {
      switch (params) {
        case 'endsteponboarding':
          this.updateProfileOnBoarding()
          break
        default:
          this.stepped = params
          break
      }
    },
    updateProfileOnBoarding() {
      this.disabledOnboardingMulai = true
      this.$http_komship
        .put('/v1/partner/onboarding/update', {})
        .then(resp => {
          if (resp.data.code === 200 && resp.data.status === 'success') {
            this.loadingOnboarding = false
            this.$bvModal.hide('modal-onboarding')
          }
        })
        .catch(() => {
          this.disabledOnboardingMulai = false
        })
    },
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
      this.loadingSubmitTopUp = true
      try {
        const response = await this.$store.dispatch('saldo/topUpSaldo')
        this.closeModal()
        if (!response.data.status) throw response.data
        window.open(response.data.data.invoice_xendit_url, '_blank').focus()
        this.$refs['modal-after-topup'].show()
        this.loadingSubmitTopUp = false
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
            popup: 'mr-2 ml-1',
          },
          buttonsStyling: false,
        })
        this.loadingSubmitTopUp = false
      } finally {
        this.$store.commit('saldo/UPDATE_NOMINAL', '')
        this.loadingSubmitTopUp = false
      }
    },
    formatDate(d) {
      return moment(d).format('D MMM YYYY')
    },
    formatNumber(n) {
      return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    showModal() {
      this.resetModal()
      if (this.rekTujuanOptions.length === 0) {
        this.$bvModal.show('modal-notif-rekTujuanBlmAda')
      } else {
        this.$bvModal.show('modal-keuangan')
      }
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
            this.status = true
          })
          break
        case 2:
          try {
            const response = await this.$store.dispatch('saldo/checkPin')
            const responseReq = this.$store.dispatch('saldo/withdrawalRequest')
            if (!response.data.data.is_match) {
              throw { message: 'Maaf pin yang anda masukkan salah' } // eslint-disable-line
            }
            responseReq
              .then(val => {
                const { data } = val

                this.$nextTick(() => {
                  this.stepNow = 2
                  this.modalTitle = null
                  this.status = data.status
                })
              })
              .catch(e => {
                if (e.response.status === 400) {
                  this.$swal({
                    title:
                      '<span class="font-weight-bold h4">Penarikan Saldo Gagal</span>',
                    text: 'Maaf, kamu tidak bisa melakukan penarikan saldo dikarenakan kamu masih memilikiantrian penarikanyang belum disetujui.',
                    imageUrl: require('@/assets/images/icons/fail.svg'), // eslint-disable-line
                    showCloseButton: false,
                    focusConfirm: true,
                    confirmButtonText: 'Oke',
                    customClass: {
                      confirmButton: 'btn bg-orange2 btn-primary rounded-lg',
                      popup: 'mr-2 ml-1',
                    },
                    buttonsStyling: false,
                  })
                }
              })

            this.visibilityPin = 'password'
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
                popup: 'mr-2 ml-1',
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
        title:
          '<span class="font-weight-bold h4">Maaf sedang ada gangguan,<br>coba lagi nanti</span>',
        imageUrl: require('@/assets/images/icons/fail.svg'), // eslint-disable-line
        showCloseButton: false,
        focusConfirm: true,
        confirmButtonText: 'Oke',
        customClass: {
          confirmButton: 'btn bg-orange2 btn-primary rounded-lg',
          popup: 'mr-2 ml-1',
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
      if (
        moment(first).format('l') === moment(this.today).format('l')
        && moment(last).format('l') === moment(this.today).format('l')
      ) {
        this.changeData(1)
        return 'Real Time'
      }
      if (
        moment(first).format('l') === moment(this.last7).format('l')
        && moment(last).format('l') === moment(this.today).format('l')
      ) {
        // eslint-disable-line
        this.changeData(2)
        return '7 Hari Terakhir'
      }
      if (
        moment(first).format('l') === moment(this.last30).format('l')
        && moment(last).format('l') === moment(this.today).format('l')
      ) {
        this.changeData(3)
        return '30 Hari Terakhir'
      }
      if (
        moment(first).format('l')
          === moment(this.firstDateOfMonth).format('l')
        && moment(last).format('l') === moment(this.lastDateOfMonth).format('l')
      ) {
        this.changeData(4)
        return 'Bulan Ini'
      }
      this.changeData(5)
      return 'Custom Tanggal'
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
          this.categories = [
            '00:00',
            '04:00',
            '08:00',
            '12:00',
            '16:00',
            '20:00',
            '24:00',
          ]
          break
        case 2:
          this.series = [
            {
              name: 'Leads',
              data: [
                '2400000',
                '2300000',
                '2700000',
                '2000000',
                '2500000',
                '2800000',
                '2100000',
              ],
            },
            {
              name: 'Orders',
              data: [
                '1400000',
                '1300000',
                '1700000',
                '2000000',
                '1500000',
                '1800000',
                '1100000',
              ],
            },
            {
              name: 'Pcs',
              data: [
                '400000',
                '300000',
                '700000',
                '1000000',
                '500000',
                '800000',
                '100000',
              ],
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
              data: [
                '24',
                '23',
                '27',
                '20',
                '25',
                '28',
                '21',
                '24',
                '23',
                '27',
                '20',
                '25',
                '28',
                '21',
                '24',
              ],
            },
            {
              name: 'Orders',
              data: [
                '14',
                '13',
                '17',
                '20',
                '15',
                '18',
                '11',
                '14',
                '13',
                '17',
                '20',
                '15',
                '18',
                '11',
                '14',
              ],
            },
            {
              name: 'Pcs',
              data: [
                '4',
                '3',
                '7',
                '10',
                '5',
                '8',
                '1',
                '4',
                '3',
                '7',
                '10',
                '5',
                '8',
                '1',
                '4',
              ],
            },
          ]
          for (let i = 0; i < 29; i += 1) {
            //eslint-disable-line
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
    onChange(v) {
      this.pin = v
    },
    onComplete(v) {
      this.pin = v
    },
    toggleVisibilityPin() {
      if (this.visibilityPin === 'password') {
        this.visibilityPin = 'text'
      } else {
        this.visibilityPin = 'password'
      }
    },
  },
}
