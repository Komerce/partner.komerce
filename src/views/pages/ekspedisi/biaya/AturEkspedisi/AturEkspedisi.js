import vSelect from 'vue-select'
import axioskomsipdev from '@/libs/axioskomsipdev'

import {
  BRow,
  BCol,
  BForm,
  BFormInput,
  BFormValidFeedback,
  BFormInvalidFeedback,
  // BListGroup,
  // BListGroupItem,
  BFormTimepicker,
  BInputGroup,
  BButton,
  BFormSelect,
  BCard,
  BSpinner,
  BCardBody,
} from 'bootstrap-vue'

const initCriteria = {
  origin: [],
  destination: [],
  delivery: 0,
  retur: 0,
  type: null,
}

export default {
  components: {
    BRow,
    BCol,
    BForm,
    BFormInput,
    // BFormGroup,
    BInputGroup,
    BFormSelect,
    BFormValidFeedback,
    BFormInvalidFeedback,
    BFormTimepicker,
    // BListGroupItem,
    BButton,
    BCard,
    BSpinner,
    BCardBody,
    vSelect,
  },
  data() {
    return {
      loadDataAwal: true,
      shipping_name: '',
      max_pickup_time: '09:00',
      service_name: null,
      cashback_from: null,
      service_fee_from: null,
      service_fee_to: null,
      cashback_to: null,
      vehicles: [],
      criteriasData: [{ ...initCriteria }],
      optionsKota: [
        { value: null, text: 'Pilih layanan kota' },
        { value: 'jawa_bali', text: 'Jawa & Bali' },
        { value: 'kalimantan_sumatera', text: 'Kalimantan & Sumatera' },
        { value: 'jakarta_batam', text: 'Jakarta & Batam' },
      ],
      optionsCriteria: [
        { value: null, text: 'Pilih jenis pengiriman' },
        { text: 'Exclude', value: 'exclude' },
        { text: 'Include', value: 'include' },
      ],
      optionsServiceName: [
        { value: null, text: 'Pilih jenis service' },
        { text: 'Oke', value: 'oke' },
        { text: 'Reg', value: 'reg' },
        { text: 'Yes', value: 'yes' },
      ],
      listCheckBox: [
        { text: 'Hiring', value: 'hiring' },
        { text: 'COD', value: 'cod' },
        { text: 'Hiring dan COD', value: 'hiringncod' },
        { text: 'Lainnya', value: 'lainny' },
      ],
    }
  },
  computed: {
    changeCriteriasData() {
      const dt = [...this.criteriasData].map(x => {
        const returnData = { ...x }
        returnData.origin = [x.type]
        return returnData
      })
      return dt
    },
  },
  watch: {
    value() {
      this.value = this.value.split(':').slice(0, 2).join(':')
    },
  },
  mounted() {
    this.getIsland()
  },
  created() {
    //
  },
  methods: {
    getTimeFormatted(timeText) {
      if (timeText) {
        const splitTime = timeText.split(':')
        return `${splitTime[0]} : ${splitTime[1]}`
      }
      return timeText
    },
    onChangeTime(ctx) {
      if (ctx && ctx.formatted) this.timeValueText = this.getTimeFormatted(ctx.formatted)
    },

    tambahKriteria(criteriasDataParams) {
      criteriasDataParams.push({ ...initCriteria })
    },
    hapusKriteria(index) {
      if (index === 0) return
      this.criteriasData.splice(index, 1)
    },
    submitData() {
      this.loadDataAwal = true
      const endpoint = '/v1/admin/shipment/store'
      let getData = null
      // console.log('datasubmit :', {
      //   shipping_name: this.shipping_name,
      //   service_name: this.service_name,
      //   cashback_from: this.cashback_from,
      //   service_fee_from: this.service_fee_from,
      //   service_fee_to: this.service_fee_to,
      //   cashback_to: this.cashback_to,
      //   max_pickup_time: this.max_pickup_time,
      //   vehicles: [this.vehicles],
      //   criterias: this.changeCriteriasData,
      // })
      getData = axioskomsipdev.post(endpoint, {
        shipping_name: this.shipping_name,
        service_name: this.service_name,
        cashback_from: this.cashback_from,
        service_fee_from: this.service_fee_from,
        service_fee_to: this.service_fee_to,
        cashback_to: this.cashback_to,
        max_pickup_time: this.max_pickup_time,
        vehicles: this.vehicles,
        criterias: this.changeCriteriasData,
      })
      getData.then(data => {
        console.log(data)
        this.$router.push('/biaya-ekspedisi')
        // {
        // status: "success",
        // code: 200,
        // message: "Success Create data Shipment"}
        // const parseData = JSON.parse(JSON.stringify(data.data))
        // this.items = parseData
        // this.totalRows = parseData.length
      })
        .catch(e => {
          console.log('error', e)
        })
        .finally(() => {
          this.loadDataAwal = false
        })
    },
    checkAksesLayanan() {
      //
    },
    hideModalAksesLayanan() {
      this.$nextTick(() => {
        this.$bvModal.hide('modal-edit-akseslayanan')
      })
    },
    simpanDataAksesLayanan() {
      // calling api and finish hide modal
      // refresh or watch selected list akses layanan
      this.$nextTick(() => {
        this.$bvModal.hide('modal-edit-akseslayanan')
      })
    },
    handleChoiceTypeVehicle(val) {
      const vhc = [...this.vehicles]
      const index = vhc.indexOf(val.toUpperCase())
      const el = document.getElementById(`choice${val}`)
      if (index > -1) {
        el.classList.toggle('activeChoice')
        vhc.splice(index, 1)
      } else {
        vhc.push(val.toUpperCase())
        el.classList.toggle('activeChoice')
      }
      this.vehicles = vhc
    },
    getIsland() {
      const endpoint = '/v1/island'
      axioskomsipdev.get(endpoint)
        .then(({ data }) => {
          const parseData = JSON.parse(JSON.stringify(data.data))
          this.optionsKota = parseData
        })
        .catch(e => {
          console.log('error', e)
        })
        .finally(() => {
          this.loadDataAwal = false
        })
    },
  },
}
