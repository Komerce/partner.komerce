/* eslint-disable prefer-rest-params */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
/* eslint-disable prefer-destructuring */
import moment from 'moment'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import httpKomship2 from '../../setting-kompship/http_komship2'
import '@core/scss/vue/libs/vue-select.scss'

export default {
  components: { vSelect },
  data() {
    return {
      profile: [],
      dateOrder: moment().format('YYYY-MM-DD'),
      address: [],
      addressList: [],
      addressLength: null,
      customerId: null,
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      customerList: [],
      phoneCode: '+62',
      phoneCodeList: ['+62'],
      destination: null,
      destinationSearch: false,
      destinationList: [],
      product: [],
      productList: [],
      productSelected: [],
      productLength: null,
      productStock: null,
      productFields: [
        { key: 'no', label: 'No', thClass: 'align-middle' },
        {
          key: 'product_name',
          label: 'Nama Produk',
          tdClass: 'px-0',
          thClass: 'align-middle',
        },
        {
          key: 'variant',
          label: 'Variasi',
          tdClass: 'px-0',
          thClass: 'align-middle',
        },
        {
          key: 'price',
          label: 'Harga Satuan',
          thClass: 'align-middle',
        },
        {
          key: 'amount',
          label: 'Jumlah',
          tdClass: 'px-0',
          thClass: 'align-middle',
        },
        {
          key: 'subtotal',
          label: 'Subtotal',
          tdClass: 'px-0',
          thClass: 'align-middle',
        },
        { key: 'action', label: 'Hapus Produk', thClass: 'align-middle' },
      ],
      productVariantId: null,
      productVariantParent: null,
      productVariantName: null,
      productVariantOption: null,
      productHistory: false,
      loadingSearch: false,
      loadingCalculate: false,
      cartId: [],
      isCalculate: false,
      isCalculateOnExpedition: false,
      isShipping: false,
      paymentMethod: null,
      paymentHistory: false,
      listPayment: ['COD', 'BANK TRANSFER'],
      rekening: null,
      listRekening: [],
      totalRekening: 0,
      bankName: null,
      bankAccountName: null,
      bankAccountNo: null,
      shipping: null,
      listShipping: [],
      shippingCost: null,
      serviceFee: null,
      serviceFeePercentage: null,
      weight: null,
      cashback: null,
      cashbackPercentage: null,
      potonganSaldo: false,
      discount: 0,
      biayaLain: false,
      jenisBiayaLain: null,
      sesuaiNominal: 0,
      bebankanCustomer: 0,
      additionalCost: 0,
      subTotal: null,
      netProfit: null,
      grandTotal: null,
      newGrandTotal: null,
      isValidate: false,
      formData: null,

      dataErrSubmit: null,
      loadingOptionExpedition: false,

      loadingWrapperOtherCost: false,
      messageErrorLengthCustomerName: false,
      messageErrorPhone: false,
      messageErrorAddressDetail: false,
      oldGrandTotal: null,
      loadingSearchDestination: false,

      itemsCustomLabel: [],
      customLabel: null,
    }
  },
  created() {
    httpKomship2
      .post('v1/my-profile')
      .then(res => {
        this.profile = res.data.data
      })
      .then(() => {
        // this.getDestination()
        this.checkExpedition()
        this.getAddress()
        this.getProduct()
        this.addToCart()
        this.getRekening()
        this.getCustomLabel()
      })
      .catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal load data, silahkan refresh halaman!',
            variant: 'danger',
          },
        })
      })
    if (
      localStorage.getItem('productSelected')
      && localStorage.productHistory
    ) {
      try {
        this.productSelected = JSON.parse(
          localStorage.getItem('productSelected'),
        )
        this.productHistory = localStorage.productHistory
      } catch (e) {
        localStorage.removeItem('productSelected')
        localStorage.removeItem('productHistory')
      }
    }
    if (localStorage.getItem('rekening')) {
      try {
        this.rekening = JSON.parse(localStorage.getItem('rekening'))
      } catch (e) {
        localStorage.removeItem('rekening')
      }
    }
    if (localStorage.paymentMethod && localStorage.paymentHistory) {
      try {
        this.paymentMethod = localStorage.paymentMethod
        this.paymentHistory = localStorage.paymentHistory
      } catch (e) {
        localStorage.removeItem('paymentMethod')
        localStorage.removeItem('paymentHistory')
      }
    }
  },
  methods: {
    formatDate(date) {
      const monthName = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ]
      const day = moment(date).format('DD')
      const month = moment(date).format('M')
      const year = moment(date).format('YYYY')
      return `${day} ${monthName[month - 1]} ${year}`
    },
    formatNumber: value => `${value}`.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
    formatDiscount(value) {
      this.discount = `${value}`.replace(/[^\d]+|^0+(?!$)/g, '')
      if (value === '' || value === null) {
        this.discount = 0
      } else {
        this.discount = `${value}`.replace(/[^\d]+|^0+(?!$)/g, '')
      }
    },
    formatAdditional(value) {
      if (value === '' || value === null) {
        this.sesuaiNominal = 0
      } else {
        this.sesuaiNominal = `${value}`.replace(/[^\d]+|^0+(?!$)/g, '')
      }
    },
    getCustomLabel() {
      this.$http_komship
        .get(`/v1/custom-labels/${this.profile.partner_id}`)
        .then(response => {
          const { data } = response.data
          this.itemsCustomLabel = data
          const defaultLabel = this.itemsCustomLabel.find(
            items => items.is_default === 1,
          )
          const isNotDefaultLabel = this.itemsCustomLabel.find(
            items => items.name_label === this.profile.partner_name,
          )
          if (defaultLabel !== undefined) {
            // eslint-disable-next-line no-plusplus
            for (let x = 0; x < this.itemsCustomLabel.length; x++) {
              if (this.itemsCustomLabel[x].is_default === 1) {
                this.itemsCustomLabel.splice(x, 1)
              }
            }
            this.itemsCustomLabel.unshift(defaultLabel)
            this.customLabel = defaultLabel.id
          }
          if (isNotDefaultLabel !== undefined && defaultLabel === undefined) {
            this.customLabel = isNotDefaultLabel.id
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAddress() {
      this.$http_komship.get('/v1/address').then(async response => {
        const { data } = response.data
        this.addressList = data
        this.addressLength = data.length
        if (this.addressLength !== 0) {
          const result = data.find(item => item.is_default === 1)
          if (result) {
            this.address = result
          } else {
            this.address = data[0]
          }
        } else {
          this.$swal({
            title:
              '<span class="font-weight-bold h4">Tambahkan alamat Pick Up untuk melanjutan kegiatan tambah order.</span>',
            imageUrl: require('@/@core/assets/image/icon-popup-warning.png'),
            confirmButtonText: 'Tambahkan Alamat Pick Up',
            confirmButtonClass: 'btn btn-primary',
          }).then(res => {
            if (res.isConfirmed) {
              this.$router.push('setting-kompship/pickup')
            }
          })
        }
      })
    },
    async getCustomer(e) {
      const event = e.key ? 'input' : 'list'
      if (event === 'list') {
        return this.customerList.forEach(item => {
          if (item.name === this.customerName) {
            this.customerId = item.customer_id
            this.customerPhone = item.phone
            this.customerAddress = item.address
          }
        })
      }
      await this.$http_komship
        .get('v1/customer', {
          params: { search: this.customerName },
        })
        .then(response => {
          const { data } = response.data
          this.customerList = data
        })
      return this.customerList
    },
    onSearchDestination(search, loading) {
      if (search.length) {
        this.loadingSearchDestination = true
        this.searchDestination(loading, search, this)
      }
    },
    searchDestination: _.debounce((loading, search, that) => {
      that.getDestination(search).finally(() => {})
    }, 500),
    async getDestination(search) {
      setTimeout(() => {
        this.$http_komship
          .get('v1/destination', {
            params: { search },
          })
          .then(res => {
            const { data } = res.data.data
            this.destinationList = data
            this.loadingSearchDestination = false
          })
          .catch(() => {
            this.loadingSearchDestination = false
          })
      }, 2000)
    },
    async getProduct() {
      await this.$http_komship
        .get(`v1/partner-product/${this.profile.partner_id}`)
        .then(response => {
          const { data } = response.data
          this.productList = data
          this.productLength = data.length
          // if (this.productLength === 0) this.$refs['modal-validate-product'].show()
        })
    },
    addProduct(itemSelected) {
      if (itemSelected) {
        const result = this.productSelected.find(
          item => item.product_id === itemSelected.product_id,
        )
        if (
          result === undefined
          || result.length === 0
          || result.variantSubmit
        ) {
          let variantSelected
          if (itemSelected.is_variant >= 1) {
            const variantOption = itemSelected.variant[0].variant_option.map(
              item => ({
                option_id: item.option_id,
                option_name: item.option_name,
                option_parent: item.option_parent,
                variant_id: item.variant_id,
                is_active: false,
                is_disabled: false,
              }),
            )
            variantSelected = [
              {
                id: itemSelected.variant[0].id,
                variant_id: itemSelected.variant[0].variant_id,
                variant_name: itemSelected.variant[0].variant_name,
                variant_option: variantOption,
              },
            ]
          } else {
            variantSelected = []
          }
          this.productSelected.push({
            product_id: itemSelected.product_id,
            product_image: itemSelected.product_image,
            product_name: itemSelected.product_name,
            is_variant: itemSelected.is_variant,
            variant_id: 0,
            variant_name: '',
            variant: itemSelected.variant,
            variantProduct: itemSelected.product_variant,
            variantSelected,
            variantButton: false,
            variantSubmit: false,
            quantity: 1,
            price: itemSelected.price,
            subtotal: itemSelected.price,
            stock: itemSelected.stock - 1,
            stockAvailable: itemSelected.stock,
          })
          this.productHistory = false
          this.addToCart()
        }
        this.product = []
      }
    },
    getVariation(index) {
      this.$root.$emit('bv::show::modal', `modalVariation${index}`)
    },
    selectVariant(indexProduct, variantType, optionId) {
      if (variantType === 0) {
        const indexVariantActive = this.productSelected[
          indexProduct
        ].variantSelected[0].variant_option.findIndex(
          item => item.is_active === true,
        )
        if (
          this.productSelected[indexProduct].variantSelected[0].variant_option[
            indexVariantActive
          ]
        ) {
          this.productSelected[indexProduct].variantSelected[0].variant_option[
            indexVariantActive
          ].is_active = false
          if (this.productSelected[indexProduct].variantSelected[2]) {
            this.productSelected[indexProduct].variantSelected.splice(1, 2)
          } else if (this.productSelected[indexProduct].variantSelected[1]) {
            this.productSelected[indexProduct].variantSelected.splice(1, 1)
          }
        }
        const indexVariant = this.productSelected[
          indexProduct
        ].variantSelected[0].variant_option.findIndex(
          item => item.option_id === optionId,
        )
        this.productSelected[indexProduct].variantSelected[0].variant_option[
          indexVariant
        ].is_active = true
        this.productVariantId = this.productSelected[indexProduct].variantSelected[0].variant_option[
          indexVariant
        ].option_id
        this.productVariantParent = this.productSelected[indexProduct].variantSelected[0].variant_option[
          indexVariant
        ].option_parent
        this.productVariantName = this.productSelected[indexProduct].variantSelected[0].variant_option[
          indexVariant
        ].option_name
        this.productVariantOption = this.productSelected[indexProduct].variantSelected[0].variant_option[
          indexVariant
        ].option_name
        if (this.productSelected[indexProduct].variant[1]) {
          const dataVariant = this.productSelected[
            indexProduct
          ].variant[1].variant_option.filter(
            items => items.option_parent === this.productVariantId,
          )
          const variantOption = dataVariant.map(item => ({
            option_id: item.option_id,
            option_name: item.option_name,
            option_parent: item.option_parent,
            variant_id: item.variant_id,
            is_active: false,
            is_disabled: false,
          }))
          const data = {
            id: this.productSelected[indexProduct].variant[1].id,
            variant_id:
              this.productSelected[indexProduct].variant[1].variant_id,
            variant_name:
              this.productSelected[indexProduct].variant[1].variant_name,
            variant_option: variantOption,
          }
          if (
            this.productSelected[indexProduct].variantSelected[1] === undefined
          ) {
            this.productSelected[indexProduct].variantSelected.push(data)
          }
        } else {
          this.productSelected[indexProduct].variantButton = true
        }
      } else if (variantType === 1) {
        const indexVariantActive = this.productSelected[
          indexProduct
        ].variantSelected[1].variant_option.findIndex(
          item => item.is_active === true,
        )
        if (
          this.productSelected[indexProduct].variantSelected[1].variant_option[
            indexVariantActive
          ]
        ) {
          this.productSelected[indexProduct].variantSelected[1].variant_option[
            indexVariantActive
          ].is_active = false
          if (this.productSelected[indexProduct].variantSelected[2]) {
            this.productSelected[indexProduct].variantSelected.splice(2, 1)
          }
        }
        const indexVariant = this.productSelected[
          indexProduct
        ].variantSelected[1].variant_option.findIndex(
          item => item.option_id === optionId,
        )
        this.productSelected[indexProduct].variantSelected[1].variant_option[
          indexVariant
        ].is_active = true
        this.productVariantId = this.productSelected[indexProduct].variantSelected[1].variant_option[
          indexVariant
        ].option_id
        this.productVariantParent = this.productSelected[indexProduct].variantSelected[1].variant_option[
          indexVariant
        ].option_parent
        this.productVariantName += `, ${this.productSelected[indexProduct].variantSelected[1].variant_option[indexVariant].option_name}`
        this.productVariantOption = this.productSelected[indexProduct].variantSelected[1].variant_option[
          indexVariant
        ].option_name
        if (this.productSelected[indexProduct].variant[2]) {
          const dataVariant = this.productSelected[
            indexProduct
          ].variant[2].variant_option.filter(
            items => items.option_parent === this.productVariantId,
          )
          const variantOption = dataVariant.map(item => ({
            option_id: item.option_id,
            option_name: item.option_name,
            option_parent: item.option_parent,
            variant_id: item.variant_id,
            is_active: false,
            is_disabled: false,
          }))
          const data = {
            id: this.productSelected[indexProduct].variant[2].id,
            variant_id:
              this.productSelected[indexProduct].variant[2].variant_id,
            variant_name:
              this.productSelected[indexProduct].variant[2].variant_name,
            variant_option: variantOption,
          }
          if (this.productSelected[indexProduct].variantSelected[2]) {
            this.productSelected[indexProduct].variantSelected[2] = data
          } else {
            this.productSelected[indexProduct].variantSelected.push(data)
          }
        } else {
          this.productSelected[indexProduct].variantButton = true
        }
      } else if (variantType === 2) {
        const indexVariantActive = this.productSelected[
          indexProduct
        ].variantSelected[2].variant_option.findIndex(
          item => item.is_active === true,
        )
        if (
          this.productSelected[indexProduct].variantSelected[2].variant_option[
            indexVariantActive
          ]
        ) {
          this.productSelected[indexProduct].variantSelected[2].variant_option[
            indexVariantActive
          ].is_active = false
        }
        const indexVariant = this.productSelected[
          indexProduct
        ].variantSelected[2].variant_option.findIndex(
          item => item.option_id === optionId,
        )
        this.productVariantId = this.productSelected[indexProduct].variantSelected[2].variant_option[
          indexVariant
        ].option_id
        this.productVariantParent = this.productSelected[indexProduct].variantSelected[2].variant_option[
          indexVariant
        ].option_parent
        this.productVariantName += `, ${this.productSelected[indexProduct].variantSelected[2].variant_option[indexVariant].option_name}`
        this.productVariantOption = this.productSelected[indexProduct].variantSelected[2].variant_option[
          indexVariant
        ].option_name
        this.productSelected[indexProduct].variantSelected[2].variant_option[
          indexVariant
        ].is_active = true
        this.productSelected[indexProduct].variantButton = true
      }
    },
    submitVariant(index, productId) {
      const checkVariant = this.productSelected.findIndex(
        item => item.variant_name === this.productVariantName
          && item.product_id === productId,
      )
      if (checkVariant > -1) {
        this.productSelected.splice(index, 1)
      } else {
        if (this.productSelected[index].variantSelected[2]) {
          const indexVariantOne = this.productSelected[
            index
          ].variantSelected[0].variant_option.findIndex(
            item => item.is_active === true,
          )
          this.productVariantName = this.productSelected[index].variantSelected[0].variant_option[
            indexVariantOne
          ].option_name
          const indexVariantTwo = this.productSelected[
            index
          ].variantSelected[1].variant_option.findIndex(
            item => item.is_active === true,
          )
          this.productVariantName += `, ${this.productSelected[index].variantSelected[1].variant_option[indexVariantTwo].option_name}`
          const indexVariantThree = this.productSelected[
            index
          ].variantSelected[2].variant_option.findIndex(
            item => item.is_active === true,
          )
          this.productVariantName += `, ${this.productSelected[index].variantSelected[2].variant_option[indexVariantThree].option_name}`
        } else if (this.productSelected[index].variantSelected[1]) {
          const indexVariantOne = this.productSelected[
            index
          ].variantSelected[0].variant_option.findIndex(
            item => item.is_active === true,
          )
          this.productVariantName = this.productSelected[index].variantSelected[0].variant_option[
            indexVariantOne
          ].option_name
          const indexVariantTwo = this.productSelected[
            index
          ].variantSelected[1].variant_option.findIndex(
            item => item.is_active === true,
          )
          this.productVariantName += `, ${this.productSelected[index].variantSelected[1].variant_option[indexVariantTwo].option_name}`
        } else {
          const indexVariantOne = this.productSelected[
            index
          ].variantSelected[0].variant_option.findIndex(
            item => item.is_active === true,
          )
          this.productVariantName = this.productSelected[index].variantSelected[0].variant_option[
            indexVariantOne
          ].option_name
        }
        const data = this.productSelected[index].variantProduct.filter(
          item => item.parent === this.productVariantParent,
        )
        const dataVariant = data.find(
          item => item.name === this.productVariantOption,
        )
        this.productSelected[index].variant_id = this.productVariantId
        this.productSelected[index].variant_name = this.productVariantName
        this.productSelected[index].stock = dataVariant.stock
        this.productSelected[index].stockAvailable = dataVariant.stock
        this.productSelected[index].price = dataVariant.price
        this.productSelected[index].subtotal = dataVariant.price
        this.productSelected[index].variantSubmit = true
        this.productHistory = false
        this.addToCart()
      }
      this.$root.$emit('bv::hide::modal', `modalVariation${index}`)
    },
    setQuantity(status, index) {
      if (status === 'plus') {
        this.productSelected[index].quantity += 1
        this.productSelected[index].stock -= 1
        this.productSelected[index].subtotal = this.productSelected[index].price
          * this.productSelected[index].quantity
        this.productHistory = false
        this.addToCart()
      } else if (status === 'minus') {
        this.productSelected[index].quantity -= 1
        this.productSelected[index].stock += 1
        this.productSelected[index].subtotal = this.productSelected[index].price
          * this.productSelected[index].quantity
        this.productHistory = false
        this.addToCart()
      }
    },
    removeProduct(index) {
      this.productSelected.splice(index, 1)
      this.productHistory = false
      this.addToCart()
    },
    saveProductHistory() {
      const parsed = JSON.stringify(this.productSelected)
      localStorage.setItem('productSelected', parsed)
      localStorage.productHistory = true
      this.productHistory = true
    },
    removeProductHistory() {
      localStorage.removeItem('productSelected')
      localStorage.removeItem('productHistory')
      this.productHistory = false
    },
    savePaymentHistory() {
      const parsed = JSON.stringify(this.rekening)
      localStorage.setItem('rekening', parsed)
      localStorage.paymentMethod = this.paymentMethod
      localStorage.paymentHistory = true
      this.paymentHistory = true
    },
    removePaymentHistory() {
      localStorage.removeItem('rekening')
      localStorage.removeItem('paymentMethod')
      localStorage.removeItem('paymentHistory')
      this.paymentHistory = false
    },
    async addToCart() {
      if (this.productSelected.length > 0) {
        this.loadingCalculate = true
        await this.$http_komship
          .delete(`v1/cart/clear/${this.profile.user_id}`)
          .then(async () => {
            const cart = this.productSelected.map(items => ({
              product_id: items.product_id,
              product_name: items.product_name,
              variant_id: items.variant_id,
              variant_name: items.variant_name,
              product_price: items.price,
              qty: items.quantity,
              subtotal: items.subtotal,
            }))
            await this.$http_komship
              .post('v1/cart/bulk-store', cart)
              .then(res => {
                this.cartId = res.data.data.cart_id
                this.loadingCalculate = false
                this.calculate(true)
              })
          })
      } else {
        this.isCalculate = false
        this.isCalculateOnExpedition = false
        this.loadingCalculate = false
      }
    },
    async getRekening() {
      await this.$http_komship.get('v1/bank-account').then(res => {
        const { data } = res.data
        this.listRekening = data
        this.totalRekening = data.length
      })
    },
    validateRekening() {
      if (this.paymentMethod === 'BANK TRANSFER' && this.totalRekening === 0) {
        this.$swal({
          title:
            '<span class="font-weight-bold h4">Kamu belum menambahkan rekening, silahkan tambahkan rekening terlebih dahulu.</span>',
          imageUrl: require('@/@core/assets/image/icon-popup-warning.png'),
          confirmButtonText: 'Tambah Rekening',
          confirmButtonClass: 'btn btn-primary',
        }).then(result => {
          if (result.isConfirmed) {
            this.$router.push('/setting-kompship/rekening-bank')
          }
        })
      }
    },
    async checkExpedition() {
      await this.$http_komship
        .get('/v1/partner/shipment/not-active')
        .then(res => {
          const { data } = res.data
          const result = data.filter(items => items.is_active === 1)
          if (result.length < 1) {
            this.$swal({
              title:
                '<span class="font-weight-bold h4">Mohon Maaf, Ekspedisi Belum Diaktifkan.</span>',
              imageUrl: require('@/@core/assets/image/icon-popup-warning.png'),
              showCancelButton: true,
              confirmButtonText: 'Aktifkan Ekspedisi',
              confirmButtonClass: 'btn btn-primary',
              cancelButtonText: 'Oke',
              cancelButtonClass:
                'btn btn-outline-primary bg-white text-primary',
            }).then(then => {
              if (then.isConfirmed) {
                this.$router.push('/setting-kompship/ekspedisi')
              }
            })
          }
        })
    },
    async getShippingList() {
      this.loadingOptionExpedition = true
      if (
        this.destination
        && this.paymentMethod
        && this.profile
        && this.address
      ) {
        setTimeout(async () => {
          await this.$http_komship
            .get('v2/calculate', {
              params: {
                tariff_code: this.destination.value,
                payment_method: this.paymentMethod,
                partner_id: this.profile.partner_id,
                partner_address_id: this.address.address_id,
              },
            })
            .then(res => {
              const { data } = res.data
              const result = data.map(items => ({
                label: `${items.shipment_name} - ${this.shippingTypeLabel(
                  items.shipping_type,
                )} - Rp${this.formatNumber(items.shipping_cost)}`,
                value: items.value,
                image_path: items.image_path,
                shipment_name: items.shipment_name,
                label_shipping_type: this.shippingTypeLabel(
                  items.shipping_type,
                ),
                shipping_type: items.shipping_type,
                shipping_cost: items.shipping_cost,
              }))
              this.listShipping = result
              this.isShipping = true
              this.loadingOptionExpedition = false
            })
            .catch(err => {
              if (
                err.response.data.message === 'Please Complete Your Address.'
              ) {
                this.$refs['modal-check-address-pickup'].show()
              }
              this.loadingOptionExpedition = false
            })
        }, 800)
      } else {
        this.shipping = null
        this.listShipping = []
        this.isShipping = false
        this.isCalculate = false
        this.isCalculateOnExpedition = false
        this.loadingOptionExpedition = false
      }
    },
    checkNewTotal() {
      if (this.newGrandTotal < this.shippingCost) {
        this.newGrandTotal = this.shippingCost
        this.calculate(false)
      }
    },
    checkDiscount() {
      if (this.discount > this.subTotal) {
        this.discount = this.subTotal
        this.calculate(true)
      }
    },
    async calculate(getAdditional) {
      setTimeout(async () => {
        if (this.shipping && this.cartId.length > 0) {
          this.loadingCalculate = true
          let grandTotalNew
          if (this.biayaLain && this.jenisBiayaLain === '1') {
            this.additionalCost = this.sesuaiNominal
          } else if (this.biayaLain && this.jenisBiayaLain === '0') {
            this.additionalCost = this.bebankanCustomer
          } else {
            this.additionalCost = 0
          }
          if (!this.potonganSaldo) {
            this.discount = 0
          }
          if (this.profile.partner_is_allowed_edit) {
            if (getAdditional) {
              grandTotalNew = null
            } else {
              grandTotalNew = this.newGrandTotal
            }
          } else {
            grandTotalNew = null
          }
          await this.$http_komship
            .get('v2/calculate', {
              params: {
                tariff_code: this.destination.value,
                payment_method: this.paymentMethod,
                partner_id: this.profile.partner_id,
                partner_address_id: this.address.address_id,
                cart: this.cartId.toString(),
                discount: this.discount,
                additional_cost: this.additionalCost,
                grandtotal: grandTotalNew,
              },
            })
            .then(async res => {
              const { data } = res.data
              const result = data.find(
                items => items.value === this.shipping.value,
              )
              if (getAdditional) {
                this.sesuaiNominal = Math.round(result.service_fee)
                this.bebankanCustomer = Math.round(result.service_fee)
                this.newGrandTotal = result.grandtotal
                this.oldGrandTotal = result.grandtotal
                if (this.paymentMethod === 'COD') {
                  this.jenisBiayaLain = '0'
                } else {
                  this.jenisBiayaLain = '1'
                }
              }
              if (this.newGrandTotal === null) {
                this.newGrandTotal = result.grandtotal
              }
              if (
                !this.profile.partner_is_allowed_edit
                || this.newGrandTotal === result.grandtotal
              ) {
                this.subTotal = result.subtotal
                this.shippingCost = result.shipping_cost
                this.netProfit = result.net_profit
                this.serviceFee = Math.round(result.service_fee)
                this.serviceFeePercentage = result.service_fee_percentage
                this.weight = result.weight.toFixed(2)
                this.grandTotal = result.grandtotal
                this.cashback = result.cashback
                this.cashbackPercentage = result.cashback_percentage
                this.additionalCost = result.additional_cost
                this.isCalculate = true
                this.loadingCalculate = false
              }
              this.loadingCalculate = false
            })
            .catch(async () => {
              this.calculate(getAdditional)
              this.loadingWrapperOtherCost = false
              this.loadingCalculate = false
            })
        } else {
          this.isCalculate = false
          this.loadingWrapperOtherCost = false
        }
      }, 800)
    },
    async calculateOnExpedition(getAdditional) {
      this.loadingWrapperOtherCost = true
      setTimeout(async () => {
        if (this.shipping && this.cartId.length > 0) {
          this.loadingCalculate = true
          let grandTotalNew
          if (this.biayaLain && this.jenisBiayaLain === '1') {
            this.additionalCost = this.sesuaiNominal
          } else if (this.biayaLain && this.jenisBiayaLain === '0') {
            this.additionalCost = this.bebankanCustomer
          } else {
            this.additionalCost = 0
          }
          if (!this.potonganSaldo) {
            this.discount = 0
          }
          if (this.profile.partner_is_allowed_edit) {
            if (getAdditional) {
              grandTotalNew = null
            } else {
              grandTotalNew = this.newGrandTotal
            }
          } else {
            grandTotalNew = null
          }
          await this.$http_komship
            .get('v2/calculate', {
              params: {
                tariff_code: this.destination.value,
                payment_method: this.paymentMethod,
                partner_id: this.profile.partner_id,
                partner_address_id: this.address.address_id,
                cart: this.cartId.toString(),
                discount: this.discount,
                additional_cost: this.additionalCost,
                grandtotal: grandTotalNew,
              },
            })
            .then(async res => {
              const { data } = res.data
              const result = data.find(
                items => items.value === this.shipping.value,
              )
              if (getAdditional) {
                this.sesuaiNominal = Math.round(result.service_fee)
                this.bebankanCustomer = Math.round(result.service_fee)
                this.newGrandTotal = result.grandtotal
                this.oldGrandTotal = result.grandtotal
                if (this.paymentMethod === 'COD') {
                  this.jenisBiayaLain = '0'
                } else {
                  this.jenisBiayaLain = '1'
                }
              }
              if (this.newGrandTotal === null) {
                this.newGrandTotal = result.grandtotal
              }
              if (
                !this.profile.partner_is_allowed_edit
                || this.newGrandTotal === result.grandtotal
              ) {
                this.subTotal = result.subtotal
                this.shippingCost = result.shipping_cost
                this.netProfit = result.net_profit
                this.serviceFee = Math.round(result.service_fee)
                this.serviceFeePercentage = result.service_fee_percentage
                this.weight = result.weight.toFixed(2)
                this.grandTotal = result.grandtotal
                this.cashback = result.cashback
                this.cashbackPercentage = result.cashback_percentage
                this.additionalCost = result.additional_cost
                this.isCalculateOnExpedition = true
                this.loadingCalculate = false
              }
              this.loadingWrapperOtherCost = false
              this.loadingCalculate = false
            })
            .catch(async () => {
              this.loadingWrapperOtherCost = false
              this.loadingCalculate = false
              this.calculateOnExpedition(getAdditional)
            })
        } else {
          this.isCalculateOnExpedition = false
          this.loadingWrapperOtherCost = false
        }
      }, 800)
    },
    shippingTypeLabel(value) {
      if (
        value === 'REG19'
        || value === 'SIUNT'
        || value === 'STD'
        || value === 'IDlite'
        || value === 'CTC19'
      ) {
        return 'Reguler'
      }
      if (value === 'GOKIL') {
        return 'Cargo'
      }
      return value
    },
    checkValidation() {
      if (
        this.paymentMethod === 'BANK TRANSFER'
        && this.rekening
        && this.profile.partner_is_mutation_bank
      ) {
        this.bankName = this.rekening.bank_name
        this.bankAccountName = this.rekening.account_name
        this.bankAccountNo = this.rekening.account_no
      } else {
        this.bankName = 0
        this.bankAccountName = 0
        this.bankAccountNo = 0
      }
      if (
        this.paymentMethod === 'BANK TRANSFER'
        && this.rekening
        && this.customerName
        && this.customerPhone
        && this.customerAddress
      ) {
        this.isValidate = true
      } else if (
        this.paymentMethod === 'BANK TRANSFER'
        && !this.profile.partner_is_mutation_bank
        && this.customerName
        && this.customerPhone
        && this.customerAddress
      ) {
        this.isValidate = true
      } else if (
        this.paymentMethod === 'COD'
        && this.customerName
        && this.customerPhone
        && this.customerAddress
      ) {
        this.isValidate = true
      } else {
        this.isValidate = false
      }
      this.formData = {
        date: this.dateOrder,
        tariff_code: this.destination.value,
        subdistrict_name: this.destination.subdistrict_name,
        zip_code: this.destination.zip_code,
        district_name: this.destination.district_name,
        city_name: this.destination.city_name,
        is_komship: this.profile.is_komship,
        customer_id: this.customerId,
        customer_name: this.customerName,
        customer_phone: this.customerPhone,
        detail_address: this.customerAddress,
        shipping: this.shipping.shipment_name,
        shipping_type: this.shipping.shipping_type,
        payment_method: this.paymentMethod,
        bank: this.bankName,
        partner_address_id: this.address.address_id,
        bank_account_name: this.bankAccountName,
        bank_account_no: this.bankAccountNo,
        subtotal: this.subTotal,
        grandtotal: this.grandTotal,
        old_grandtotal: this.oldGrandTotal,
        shipping_cost: this.shippingCost,
        service_fee: this.serviceFee,
        discount: this.discount,
        additional_cost: this.additionalCost,
        shipping_cashback: this.cashback,
        net_profit: this.netProfit,
        cart: this.cartId,
        custom_label_id: this.customLabel,
      }
    },
    handleCustomLabel(items) {
      this.customLabel = items
    },
    async submit(order) {
      this.checkValidation()
      if (this.isValidate) {
        await this.$http_komship
          .post(`v1/order/${this.profile.partner_id}/store`, this.formData)
          .then(() => {
            this.$swal({
              title:
                '<span class="font-weight-bold h4">Berhasil Tambah Order</span>',
              imageUrl: require('@/assets/images/icons/success.svg'),
              confirmButtonText: 'Oke',
              confirmButtonClass: 'btn btn-primary',
            }).then(() => {
              if (order) {
                window.location.reload()
              } else {
                this.$router.push('/data-order')
              }
            })
          })
          .catch(err => {
            this.dataErrSubmit = err.response.data
            this.$swal({
              title:
                this.dataErrSubmit.message
                === 'Please Topup to continue your store Order.'
                  ? '<span class="font-weight-bold h4">Mohon Maaf, saldo anda tidak mencukupi untuk membuat order. Silahkan cek kembali saldo anda.</span>'
                  : '<span class="font-weight-bold h4">Mohon maaf, stok produk kamu tidak mencukupi untuk membuat orderan ini. Silahkan tambahkan stok produk terlebih dahulu</span>',
              imageUrl: require('@/assets/images/icons/fail.svg'),
              showCancelButton: true,
              confirmButtonText:
                this.dataErrSubmit.message
                === 'Sorry, there is not enough stock to continue the order'
                  ? 'Cek Produk'
                  : 'Cek Saldo',
              confirmButtonClass: 'btn btn-primary',
              cancelButtonText: 'Oke',
              cancelButtonClass:
                'btn btn-outline-primary bg-white text-primary',
            }).then(result => {
              if (result.isConfirmed) {
                if (
                  this.dataErrSubmit.message
                  === 'Please Topup to continue your store Order.'
                ) {
                  this.$router.push('/dashboard-komship')
                }
                if (
                  this.dataErrSubmit.message
                  === 'Sorry, there is not enough stock to continue the order'
                ) {
                  this.$router.push('/produk')
                }
              }
            })
          })
      } else {
        this.$swal({
          title:
            '<span class="font-weight-bold h4">Tidak Boleh Ada Field Yang Kosong!</span>',
          imageUrl: require('@/assets/images/icons/fail.svg'),
          confirmButtonText: 'Oke',
          confirmButtonClass: 'btn btn-primary',
        })
      }
    },
    formatCustomerName(e) {
      return String(e).substring(0, 30)
    },
    formatAddressDetail(e) {
      return String(e).substring(0, 85)
    },
    formatPhoneCustomer() {
      if (this.customerPhone.length < 9) {
        this.messageErrorPhone = true
      } else {
        this.messageErrorPhone = false
      }
    },
    validateInputCustomerName(e) {
      if (
        e.keyCode === 47
        || e.keyCode === 61
        || e.keyCode === 58
        || e.keyCode === 59
      ) {
        e.preventDefault()
        this.messageErrorLengthCustomerName = true
      } else {
        this.messageErrorLengthCustomerName = false
      }
    },
    validateInputAddressDetail(e) {
      if (
        e.keyCode === 47
        || e.keyCode === 61
        || e.keyCode === 58
        || e.keyCode === 59
      ) {
        e.preventDefault()
        this.messageErrorAddressDetail = true
      } else {
        this.messageErrorAddressDetail = false
      }
    },
    validateInputPhoneCustomer(e) {
      if (this.customerPhone.length === 0) {
        if (e.keyCode === 48) {
          e.preventDefault()
        }
      }
      if (e.keyCode === 46 || e.keyCode === 45 || e.keyCode === 43) {
        e.preventDefault()
      }
    },
  },
}
