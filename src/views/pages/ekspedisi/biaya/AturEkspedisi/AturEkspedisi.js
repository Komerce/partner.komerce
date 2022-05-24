import vSelect from 'vue-select'
import axioskomsipdev from '@/views/pages/komship/setting-kompship/http_komship'

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

const initCriteriaStore = {
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
      shippingId: this.$route.params.shipping_id,
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
      criteriasDataStoreUpdate: [{ ...initCriteriaStore }],
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
    this.getDetail()
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
      criteriasDataParams.push({
        origin: [],
        destination: [],
        delivery: 0,
        retur: 0,
        type: null,
      })
    },
    hapusKriteria(index) {
      if (index === 0) return
      this.criteriasData.splice(index, 1)
    },
    submitData() {
      this.loadDataAwal = true
      const endpoint = `/v1/admin/shipment/update/${this.$route.params.id}`
      axioskomsipdev.put(endpoint, {
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
      axioskomsipdev
        .get(endpoint)
        .then(({ data }) => {
          const parseData = JSON.parse(JSON.stringify(data.data))
          this.optionsKota = parseData
        })
        .catch(() => {
          this.loadDataAwal = false
        })
        .finally(() => {
          this.loadDataAwal = false
        })
    },

    getDetail() {
      // eslint-disable-next-line array-callback-return
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < this.criteriasData.length; x++) {
        if (this.criteriasData[x].origin !== []) this.criteriasData[x].origin = []
        if (this.criteriasData[x].destination !== []) this.criteriasData[x].destination = []
        if (this.criteriasDataStoreUpdate[x].origin !== []) this.criteriasDataStoreUpdate[x].origin = []
        if (this.criteriasDataStoreUpdate[x].destination !== []) this.criteriasDataStoreUpdate[x].destination = []
      }
      const enpoint = `/v1/admin/shipment/detail/${this.shippingId}`
      axioskomsipdev
        .get(enpoint)
        .then(({ data }) => {
          const res = data.data
          this.shipping_name = res.shipping_name
          this.service_fee_from = res.service_fee_from
          this.cashback_to = res.cashback_to
          this.cashback_from = res.cashback_from
          this.service_fee_to = res.service_fee_to
          const onlyLeters = res.service_name
            .replace(/[^a-zA-Z]+/g, '')
            .toLowerCase()
          // const serviceName = onlyLeters.charAt(0).toUpperCase() + onlyLeters.slice(1)
          this.service_name = onlyLeters
          // eslint-disable-next-line no-plusplus
          for (let x = 0; x < res.criterias.length; x++) {
            // eslint-disable-next-line no-plusplus
            for (let y = 0; y < res.criterias[x].origin.length; y++) {
              // eslint-disable-next-line no-plusplus
              for (let z = 0; z < this.criteriasData.length; z++) {
                this.criteriasData[x].origin.push({
                  label: res.criterias[x].origin[y],
                  value: res.criterias[x].origin_value[y],
                })
                this.criteriasData[x].type = res.criterias[x].type
                this.criteriasData[x].retur = res.criterias[x].retur
                this.criteriasData[x].delivery = res.criterias[x].delivery
                this.criteriasDataStoreUpdate[x].type = res.criterias[x].type
                this.criteriasDataStoreUpdate[x].retur = res.criterias[x].retur
                this.criteriasDataStoreUpdate[x].delivery = res.criterias[x].delivery
                this.criteriasDataStoreUpdate[x].origin.push(
                  Number(res.criterias[x].origin_value[y]),
                )
              }
            }
            // eslint-disable-next-line no-plusplus
            for (let y = 0; y < res.criterias[x].destination.length; y++) {
              // eslint-disable-next-line no-plusplus
              for (let z = 0; z < this.criteriasData.length; z++) {
                this.criteriasData[x].destination.push({
                  label: res.criterias[x].destination[y],
                  value: res.criterias[x].destination_value[y],
                })
                this.criteriasDataStoreUpdate[x].destination.push(
                  Number(res.criterias[x].destination_value[y]),
                )
              }
            }
          }
        })
        .catch(() => {
          this.loadDataAwal = false
        })
        .finally(() => {
          this.loadDataAwal = false
        })
    },
  },
}
