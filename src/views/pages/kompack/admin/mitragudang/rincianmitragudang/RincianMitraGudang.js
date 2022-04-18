import {
  BRow,
  BCol,
  BCard,
  BForm,
  BModal,
  BTable,
  BButton,
  BFormFile,
  BFormInput,
  BInputGroup,
  BFormGroup,
  BFormSelect,
  BFormTextarea,
  BFormRadioGroup,
  BInputGroupAppend,
  BInputGroupPrepend,
} from 'bootstrap-vue'
import { required, email, integer } from '@validations'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContentVue from '@/@core/components/toastification/ToastificationContent.vue'
import { mapState } from 'vuex'

/*
  this.dataOwner.partner_verification
  this.dataProperti.warehouse_verification
  this.dataProperti.service_status
  jika partner_verification = 0 & warehouse_verification = 0 & service_status = belum verifikasi
  jika partner_verification = 0 & warehouse_verification = 1 & service_status = belum verifikasi
  jika partner_verification = 1 & warehouse_verification = 0 & service_status = belum verifikasi
  - klik tombol aktifkan layanan masih disabled
  - edit fitur utk semua atau sebagian
  jika partner_verification = 1 & warehouse_verification = 1 & service_status = nonaktif
  - klik tombol aktifkan layanan masih enable
  - tombol Batalkan Verifikasi ada
  - tombol data fulfillment bisa di klik dan edit field hanya fullfillment saja
  jika partner_verification = 1 & warehouse_verification = 1 & service_status = aktif
  - klik tombol non aktifkan layanan
  - hanya ada icon terverifikasi tidak ada lgi tombol batalkan verifikasi
*/

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BForm,
    BModal,
    BTable,
    BButton,
    BFormFile,
    BFormInput,
    BFormGroup,
    BFormSelect,
    BInputGroup,
    BFormTextarea,
    BFormRadioGroup,
    BInputGroupAppend,
    BInputGroupPrepend,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      email,
      required,
      integer,
      loadingPage: true,
      btnSubmitDisabled: false,
      optionsKetersediaan: [
        { text: 'Tersedia', value: 1 },
        { text: 'Penuh', value: 0 },
      ],
      optionsGender: [
        { text: 'L', value: 1 },
        { text: 'P', value: 0 },
      ],
      disabledField: {
        email: true,
        username: true,
        warehouse_name: true,
        avability: true,
        pic_name: true,
        pic_phone: true,
        description: true,
        image_warehouse: true,
        image_logo_url: true,
        owner: true,
        gender: true,
        phone_number: true,
        nik: true,
        image_ktp_url: true,
        destination_id: true,
        detail_address: true,
        building_area: true,
        building_type: true,
        ownership: true,
      },
      dataAkun: {
        email: '',
        username: '',
      },
      dataFulfillment: {
        warehouse_name: '',
        avability: null,
        pic_name: '',
        pic_phone: '',
        description: '',
        image_warehouse: null,
        image_logo_url: null,
        service_status: '',
      },
      dataOwner: {
        owner: '',
        gender: null,
        phone_number: '',
        nik: '',
        image_ktp_url: null,
      },
      dataProperti: {
        destination_id: '',
        detail_address: '',
        building_area: 0,
        building_type: null,
        ownership: null,
      },
      isOnEdit: false,
      statusProfile: '',
      dataStatusObj: {
        aktif: 'Aktif',
        nonaktif: 'Non - Aktif',
        unverified: 'Belum Diverifikasi',
      },
      actionStatusType: {
        partner: 'partner',
        warehouse: 'warehouse',
        batalverif: 0,
        verifikasi: 1,
        isActivated: 'isActivated',
        aktif: 'aktif',
        nonaktif: 'nonaktif',
      },
      imageFieldFormType: {
        fulfillmentLogo: 'fulfillmentLogo',
        fulfillmentWarehouse: 'fulfillmentWarehouse',
        ownerKTP: 'ownerKTP',
      },
      prevImg: {
        logo: null,
        warehouse: null,
        ktp: null,
      },
    }
  },
  watch: {
    // test changing data
    // statusProfile: {
    //   handler(val) {
    //     console.log(val)
    //   },
    //   deep: true,
    // },
  },
  computed: {
    // ...mapFields('kompackAdmin', { cobaselecOptData: 'getselecOptData' }),
    ...mapState('kompackAdmin', ['selecOptData']),
    // ...mapGetters('kompackAdmin', ['getselecOptData']),
    statuscomputed() {
      switch (this.dataFulfillment.service_status) {
        case this.actionStatusType.nonaktif:
          return `<span class="d-flex align-items-center mb-2 font-bold text-red-500">
            <span class="w-4 h-4 rounded-full bg-red-500 mr-0.5"></span>Non-Aktif</span>`
        case this.actionStatusType.aktif:
          return `<span class="d-flex align-items-center mb-2 font-bold text-green-500">
            <span class="w-4 h-4 rounded-full bg-green-500 mr-0.5"></span>Aktif</span>`
        default:
          return `<span class="d-flex align-items-center mb-2 font-bold text-warning">
            <span class="w-4 h-4 rounded-full bg-warning mr-0.5"></span>Belum Terverifikasi</span>`
      }
    },
  },
  beforeMount() {
    this.$store.dispatch('kompackAdmin/init')
  },
  mounted() {
    this.getDataDetailMitra()
  },
  methods: {
    showModalBatal() {
      this.$bvModal.show('modal-tambahmitra-warning')
    },
    checkAktivation(dt) {
      switch (dt) {
        case this.actionStatusType.nonaktif:
          this.statusProfile = this.dataStatusObj.nonaktif
          break
        case this.actionStatusType.aktif:
          this.statusProfile = this.dataStatusObj.aktif
          break
        default:
          break
      }
    },
    verificationOrAktifData(dataParams, type = '') {
      let endpoint = ''
      switch (type) {
        case this.actionStatusType.partner:
          endpoint = `/kompack/warehouse/verification-partner-warehouse?id_partner_warehouse=${this.$route.params.id}&is_verification=${dataParams}`
          this.dataOwner.partner_verification = dataParams
          break
        case this.actionStatusType.warehouse:
          endpoint = `kompack/warehouse/verification-warehouse?id_warehouse=${this.dataProperti.warehouse_id}&is_verification=${dataParams}`
          this.dataProperti.warehouse_verification = dataParams
          break
        case this.actionStatusType.isActivated:
          endpoint = `kompack/warehouse/update/service?id_partner_warehouse=${this.$route.params.id}&type_service=${dataParams}`
          this.checkAktivation(dataParams)
          break
        default:
          break
      }
      this.$http_kompack.put(endpoint)
        .then(({ data }) => {
          if (data.status === 'success' && data.code === 200) {
            this.getDataDetailMitra()
          }
        })
        .catch(() => {
          this.$toast({
            component: ToastificationContentVue,
            props: {
              title: 'Failed',
              text: 'Galat detail data mitra gudang',
              icon: 'AlertCircleIcon',
              variant: 'danger',
            },
          })
        })
    },
    getDataDetailMitra() {
      this.$http_kompack.get(`/kompack/warehouse/${this.$route.params.id}`)
        .then(({ data }) => {
          /*
          {
            "id": "16",
            "user_id": 2593,
            "email": "ragil@email.com",
            "username": "ragils",
            "owner": "ragil setiawans",
            "phone_number": "081229460004",
            "gender": "L",
            "nik": "330313120897",
            "warehouse_id": 2,
            "warehouse_name": "ragil setiawans",
            "avability": 0,
            "pic_name": "Ragil",
            "pic_phone": "081229460004",
            "description": "Warehouse Estrige",
            "destination_id": 5,
            "detail_address": "jalan mangga no 5",
            "building_area": 200,
            "building_type": 1,
            "ownership": 4,
            "image_ktp_url": "public/kompack_image_ktp/CEfRNTovd5pz0dyFMD8QLytgdTSgEuZkjaT5IC8F.jpg",
            "image_logo_url": "https://kompackdev.komerce.id/warehouse_logo/1649651136.mburi.jpg",
            "image_warehouse": []
            "warehouse_verification": 0,
            "service_status": "nonaktif",
            "partner_verification": 0,
          }
          */
          this.dataAkun = {
            email: data.data.email,
            username: data.data.username,
          }
          this.dataFulfillment = {
            warehouse_name: data.data.warehouse_name,
            avability: data.data.avability,
            pic_name: data.data.pic_name,
            pic_phone: data.data.pic_phone,
            description: data.data.description,
            image_warehouse: data.data.image_warehouse,
            image_logo_url: data.data.image_logo_url,
            service_status: data.data.service_status,
          }
          this.prevImg.ktp = data.data.image_ktp_url
          this.prevImg.logo = data.data.image_logo_url
          this.prevImg.warehouse = data.data.image_warehouse
          this.dataOwner = {
            owner: data.data.owner,
            gender: data.data.gender === 'L' ? 1 : 0,
            phone_number: data.data.phone_number,
            nik: data.data.nik,
            partner_verification: data.data.partner_verification,
            image_ktp_url: data.data.image_ktp_url,
          }
          this.dataProperti = {
            destination_id: data.data.destination_id,
            detail_addres: data.data.detail_address,
            building_area: data.data.building_area,
            building_type: data.data.building_type,
            ownership: data.data.ownership,
            warehouse_id: data.data.warehouse_id,
            warehouse_verification: data.data.warehouse_verification,
          }
          this.fetchDataDestination(data.data.destination_id)
          this.getStatusDataProfile(data.data.partner_verification, data.data.warehouse_verification, data.data.service_status)
          this.$nextTick(() => {
            this.loadingPage = false
          })
        })
        .catch(() => {
          this.$toast({
            component: ToastificationContentVue,
            props: {
              title: 'Failed',
              text: 'Galat detail data mitra gudang',
              icon: 'AlertCircleIcon',
              variant: 'danger',
            },
          })
        })
    },
    fetchDataDestination(dataId) {
      this.$http_kompack('/kompack/destination', { params: { destination_id: dataId } })
        .then(({ data }) => {
          this.dataProperti.destination_id = data.data.zip_code
        })
        .catch(() => {
          this.$toast({
            component: ToastificationContentVue,
            props: {
              title: 'Failed',
              text: 'Galat tambah data mitra gudang',
              icon: 'AlertCircleIcon',
              variant: 'danger',
            },
          })
        })
    },
    savedatalist() {
      this.btnSubmitDisabled = true
      this.$refs.tambahlistdata.validate().then(success => {
        if (success) {
          // body data
          const formData = new FormData()
          formData.append('email', this.dataAkun.email)
          formData.append('username', this.dataAkun.username)
          formData.append('owner', this.dataOwner.owner)
          formData.append('gender', this.dataOwner.gender)
          formData.append('phone_number', this.dataOwner.phone_number)
          formData.append('nik', this.dataOwner.nik)
          formData.append('image_ktp_url', this.dataOwner.image_ktp_url) // string ($binary)
          formData.append('image_logo', this.dataFulfillment.image_logo_url) // string ($binary)
          formData.append('warehouse_name', this.dataFulfillment.warehouse_name)
          formData.append('avability', this.dataFulfillment.avability)
          formData.append('pic_name', this.dataFulfillment.pic_name)
          formData.append('pic_phone', this.dataFulfillment.pic_phone)
          formData.append('description', this.dataFulfillment.description)
          this.dataFulfillment.image_warehouse.forEach(xt => {
            formData.append('image_warehouse[]', xt) // array<string ($binary)>
          })
          formData.append('destination_id', Number.isNaN(parseInt(this.dataProperti.building_area, 10)) ? this.dataProperti.destination_id : parseInt(this.dataProperti.building_area, 10))
          formData.append('detail_addres', this.dataProperti.detail_addres)
          formData.append('building_area', Number.isNaN(parseInt(this.dataProperti.building_area, 10)) ? 0 : parseInt(this.dataProperti.building_area, 10))
          formData.append('building_type', this.dataProperti.building_type)
          formData.append('ownership', this.dataProperti.ownership)

          // calling API untuk tambah mitra gudang
          this.$http_kompack.post('/kompack/warehouse/update', formData, {
            headers: {
              'content-type': 'multipart/form-data',
            },
          })
            .then(({ data }) => {
              console.log('data ', data)
              // masuk data tidak error maka munculkan popup success
              this.$bvModal.show('modal-tambahmitra-success')
            })
            .catch(() => {
              this.$toast({
                component: ToastificationContentVue,
                props: {
                  title: 'Failed',
                  text: 'Galat ubah data mitra gudang',
                  icon: 'AlertCircleIcon',
                  variant: 'danger',
                },
              })
              this.btnSubmitDisabled = false
            })
        } else {
          // jika ada error ketika validasi
          this.btnSubmitDisabled = false
          this.$toast({
            component: ToastificationContentVue,
            props: {
              title: 'Failed',
              text: 'Galat edit data mitra gudang',
              icon: 'AlertCircleIcon',
              variant: 'danger',
            },
          })
        }
      })
    },
    editdataFulfillment() {
      this.isOnEdit = !this.isOnEdit
      this.disabledField = {
        ...this.disabledField,
        warehouse_name: !this.disabledField.warehouse_name,
        avability: !this.disabledField.avability,
        pic_name: !this.disabledField.pic_name,
        pic_phone: !this.disabledField.pic_phone,
        description: !this.disabledField.description,
        image_warehouse: !this.disabledField.image_warehouse,
        image_logo_url: !this.disabledField.image_logo_url,
      }
    },
    previewLogo(evChange, type) {
      const [dataimg] = evChange.target.files
      let url = null
      const multiFile = []
      switch (type) {
        case this.imageFieldFormType.fulfillmentLogo:
          this.dataFulfillment.image_logo_url = dataimg
          url = URL.createObjectURL(dataimg)
          this.prevImg.logo = url
          break
        case this.imageFieldFormType.fulfillmentWarehouse:
          evChange.target.files.forEach(fl => {
            multiFile.push(fl)
          })
          this.dataFulfillment.image_warehouse = multiFile
          url = []
          evChange.target.files.forEach(x => {
            url.push(URL.createObjectURL(x))
          })
          this.prevImg.warehouse = url
          break
        case this.imageFieldFormType.ownerKTP:
          this.dataOwner.image_ktp_url = dataimg
          url = URL.createObjectURL(dataimg)
          this.prevImg.ktp = url
          break
        default:
          break
      }
    },
    getStatusDataProfile(partnerVerification, warehouseVerification, serviceStatus) {
      let datastatus = ''
      if (!(Boolean(partnerVerification) && Boolean(warehouseVerification))) {
        if (serviceStatus === this.dataStatusObj.unverified) {
          this.statusProfile = this.dataStatusObj.unverified
          datastatus = this.dataStatusObj.unverified
        }
      }
      if (serviceStatus === 'nonaktif') {
        this.statusProfile = this.dataStatusObj.nonaktif
        datastatus = this.dataStatusObj.nonaktif
      }
      if (Boolean(partnerVerification) && Boolean(warehouseVerification) && serviceStatus === 'aktif') {
        this.statusProfile = this.dataStatusObj.aktif
        datastatus = this.dataStatusObj.aktif
      }
      return datastatus
    },
  },
}
