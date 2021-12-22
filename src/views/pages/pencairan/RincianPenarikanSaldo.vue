<template>
  <section id="cod-rincian-penarikan-saldo">
    <div v-if="!loadDataAwal">
      <b-card no-body>
        <b-card-header class="custom-card-header">
          <b-row style="width: 100%;">
            <b-col
              md="12"
              class="d-flex justify-content-between"
            >
              <div class="d-flex align-items-center">
                <b-button
                  variant="primary"
                  size="sm"
                  class="mr-50 btn-custom"
                  @click="$router.go(-1)"
                >
                  <feather-icon
                    size="2x"
                    icon="ChevronLeftIcon"
                  />
                </b-button>
                <h4
                  class="card-title text-24-bold"
                >
                  Rincian Penarikan Saldo
                </h4>
              </div>
              <div
                class="statusWrapper d-flex align-items-center justify-content-center"
                :class="detailData.status.toLowerCase() | changeStatus"
              >
                {{ detailData.status }}
              </div>
            </b-col>
          </b-row>
        </b-card-header>
        <b-card-body>
          <div class="mb-2 d-flex justify-content-between">
            <table
              class="table-custom"
            >
              <tr>
                <td class="td-custom text-18-normal">
                  Tanggal Penarikan
                </td>
                <td class="text-18-bold">
                  {{ detailData.withdrawal_date }}
                </td>
              </tr>
              <tr>
                <td class="td-custom text-18-normal">
                  Nama
                </td>
                <td class="text-18-bold">
                  {{ detailData.partner_name }}
                </td>
              </tr>
              <tr>
                <td class="td-custom text-18-normal">
                  Nama Bank
                </td>
                <td class="text-18-bold">
                  {{ detailData.bank_name }}
                </td>
              </tr>
              <tr>
                <td class="td-custom text-18-normal">
                  No Rekening
                </td>
                <td class="text-18-bold">
                  {{ detailData.bank_account_no }}
                </td>
              </tr>
            </table>
            <b-card
              v-if="detailData.transfer_proof"
              no-body
            >
              <b-card-body>
                <div style="display: grid;">
                  <span class="text-bukti-transfer">
                    Bukti Transfer
                  </span>
                  <div class="wrapper-uploaded d-flex">
                    <div class="icon-uploaded d-flex justify-content-center align-items-center">
                      <feather-icon
                        icon="FileIcon"
                        size="2x"
                      />
                    </div>
                    <div style="display: grid;">
                      <span class="text-bukti-transfer">
                        Bukti-Transfer.png
                      </span>
                      <span class="text-filesize-bukti-transfer">
                        159 Kb
                      </span>
                    </div>
                  </div>
                </div>
              </b-card-body>
            </b-card>
          </div>
          <div class="d-flex mb-2">
            <div class="details-total mr-2">
              <div class="d-flex align-items-center">
                <span class="text-16-normal">
                  Total Saldo:
                  <span class="text-16-normal font-weight-bolder text-danger">
                    Rp{{ detailData.total_balance | formatRupiah }}
                  </span>
                </span>
                <b-button
                  variant="outline-primary"
                  size="sm"
                  class="btn-icon btn-custom-details"
                >
                  <feather-icon icon="AlertCircleIcon" />
                </b-button>
              </div>
              <div class="d-flex align-items-center">
                <span class="text-16-normal">
                  Saldo Awal:
                  <span class="text-16-normal font-weight-bolder">
                    Rp{{ detailData.beginning_balance | formatRupiah }}
                  </span>
                </span>
                <b-button
                  variant="outline-info"
                  size="sm"
                  class="btn-icon btn-custom-details"
                >
                  <feather-icon icon="AlertCircleIcon" />
                </b-button>
              </div>
            </div>

            <div class="details-total">
              <div class="d-flex align-items-center">
                <span class="text-16-normal">
                  Nominal Penarikan Saldo:
                  <span
                    ref="nominalPenarikanSaldo"
                    class="text-16-normal font-weight-bolder text-success"
                  >Rp{{ detailData.withdrawal_nominal | formatRupiah }}</span>
                </span>
                <b-button
                  variant="outline-success"
                  size="sm"
                  class="btn-icon btn-custom-details"
                  @click="handleCopyNominalPenarikanSaldo()"
                >
                  <feather-icon icon="CopyIcon" />
                </b-button>
              </div>
              <span class="text-16-normal">
                Sisa Saldo:
                <span class="text-16-normal font-weight-bolder">
                  Rp{{ detailData.current_balance | formatRupiah }}
                </span>
              </span>
            </div>
          </div>
          <b-row>
            <b-col
              lg="12"
            >
              <b-table
                striped
                hover
                responsive
                :per-page="perPage"
                :current-page="currentPage"
                :items="items"
                :busy="isLoadTable"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
              >
                <template #cell(status)="data">
                  <b-badge :variant="status[1][data.value]">
                    {{ status[0][data.value] }}
                  </b-badge>
                </template>
                <!-- A virtual composite column -->
                <template #cell(transreturn)="data">
                  <b>
                    {{ data.item.payment_method }}
                  </b>
                  <br>
                  <span class="text-secondary">
                    Return
                  </span>
                </template>
                <template #table-busy>
                  <div class="text-center text-danger my-2">
                    <b-spinner
                      class="align-middle"
                    />
                    <strong>Loading...</strong>
                  </div>
                </template>
              </b-table>
            </b-col>
            <b-col
              cols="12"
            >
              <div class="d-flex justify-content-between">
                <b-form-group
                  class="mb-0"
                >
                  <label class="d-inline-block text-sm-left mr-0">Per page</label>
                  <b-form-select
                    id="perPageSelect"
                    v-model="perPage"
                    size="sm"
                    :options="pageOptions"
                    class="w-50"
                  />
                </b-form-group>
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  align="center"
                  size="sm"
                  class="my-0"
                />
              </div>
            </b-col>
            <b-col
              v-if="detailData.notes !== ''"
              lg="12"
            >
              <div class="catatan-review p-1 mt-1">
                <h4
                  class="mb-2"
                >
                  Catatan :
                </h4>
                <p>
                  {{ detailData.notes }}
                </p>
              </div>
            </b-col>
          </b-row>

          <div class="d-flex justify-content-end mt-2">
            <b-button
              v-b-modal.modal-review
              variant="outline-danger"
              class="mr-1 btn-custom-bottom"
            >
              Review
            </b-button>
            <b-button
              :to="{ name: 'cod-penarikan-upload-bukti-transfer', params: { slug: $route.params.slug } }"
              variant="outline-primary"
              class="mr-1 btn-custom-bottom"
            >
              Transfer Manual
            </b-button>
            <b-button
              v-b-modal.modal-transfer-sekarang
              variant="primary"
              class="btn-custom-bottom"
            >
              Transfer Sekarang
            </b-button>
          </div>
        </b-card-body>
      </b-card>
      <b-modal
        id="modal-review"
        ref="modal-review"
        ok-title="Selesai"
        cancel-title="Batal"
        centered
        hide-header-close
        size="lg"
        title="Buat Catatan Penarikan"
        @show="resetModalReview"
      >
        <div>
          <form
            ref="form-review"
            @submit.stop.prevent="handleSubmitReview"
          >
            <b-form-group
              label=""
              label-for="catatan-penarikan-textarea"
              invalid-feedback="Silahkan isi catatan"
              :state="catatanReviewState"
            >
              <b-form-textarea
                id="catatan-penarikan-textarea"
                v-model="catatanReview"
                debounce="300"
                placeholder="Berikan catatan kamu untuk partner dalam penarikan"
                rows="8"
                :state="catatanReviewState"
                required
              />
            </b-form-group>
          </form>
        </div>
        <template #modal-footer>
          <div class="w-100 d-flex justify-content-end">
            <b-button
              variant="outline-primary"
              class="mr-1 btn-custom-footer-modal text-center"
              @click="resetModalReview"
            >
              Batal
            </b-button>
            <b-button
              variant="primary"
              class="btn-custom-footer-modal text-center"
              @click="handleOkReview"
            >
              Selesai
            </b-button>
          </div>
        </template>
      </b-modal>

      <b-modal
        id="modal-transfer-sekarang"
        ref="modal-transfer-sekarang"
        centered
        hide-header-close
        hide-footer
        size="md"
        no-stacking
      >
        <div class="text-center">
          <div class="pt-3 transfersekarang-wrapper">
            <span
              class="text-24-bold"
              style="color: #222222;"
            >
              Apakah kamu yakin ingin mentransfer nominal penarikan saldo?
            </span>
            <span
              class="text-16-normal"
              style="color: #222222;"
            >
              Pilih jawaban anda sekarang!
            </span>
            <b-button
              variant="primary"
              class="btn-custom-footer-transfer-skrng text-center"
              @click="handleOkTransNow"
            >
              Yakin
            </b-button>
            <b-button
              variant="outline-primary"
              class="btn-custom-footer-transfer-skrng text-center"
              style="border-color: unset;"
              @click="resetModalTransNow"
            >
              Tidak
            </b-button>
          </div>
        </div>
      </b-modal>

      <b-modal
        id="modal-transfer-berhasil"
        ref="modal-transfer-berhasil"
        centered
        hide-header-close
        hide-footer
        size="md"
      >
        <div class="text-center">
          <div class="pt-3 transfersekarang-wrapper">
            <b-img
              :src="require('@/assets/images/elements/transfer-success.png')"
              height="142"
              width="150"
              alt="Transfer-saldo-berhasil"
            />
            <span
              class="text-24-bold"
              style="font-seze: 20px;color: #222222;"
            >
              Transfer Saldo Berhasil!
            </span>
            <b-button
              variant="primary"
              class="btn-custom-footer-transfer-berhasil text-center"
              @click="handleOkTransBerhasil"
            >
              Oke
            </b-button>
          </div>
        </div>
      </b-modal>
      <b-modal
        id="modal-transfer-gagal"
        ref="modal-transfer-gagal"
        centered
        hide-header-close
        hide-footer
        size="md"
      >
        <div class="text-center">
          <div class="pt-3 transfersekarang-wrapper">
            <b-img
              :src="require('@/assets/images/elements/transfer-fail.png')"
              height="142"
              width="150"
              alt="Transfer-saldo-berhasil"
            />
            <span
              class="text-24-bold"
              style="font-seze: 20px;color: #222222;"
            >
              Transfer Saldo Gagal!
            </span>
            <b-button
              variant="primary"
              class="btn-custom-footer-transfer-berhasil text-center"
              @click="handleOkTransGagal"
            >
              Oke
            </b-button>
          </div>
        </div>
      </b-modal>
    </div>

    <div
      v-else
      class="text-center"
    >
      <b-spinner
        variant="primary"
        label="Text Centered"
      />
    </div>
  </section>
</template>

<script>
import {
  BRow,
  BCol,
  BCard,
  BModal,
  BFormTextarea,
  BImg,
  BFormGroup,
  // BDropdownForm,
  BBadge,
  // BAvatar,
  BTable,
  BPagination,
  // BTableSimple,
  // BThead,
  // BTbody,
  // BTh,
  // BTr,
  // BTd,
  // BInputGroup,
  // BInputGroupPrepend,
  // BDropdown,
  BButton,
  BSpinner,
  BCardBody,
  BCardHeader,
  BFormSelect,
} from 'bootstrap-vue'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import axioskomsipdev from '@/libs/axioskomsipdev'

export default {
  components: {
    BImg,
    BRow,
    BCol,
    BCard,
    BModal,
    BFormTextarea,
    // BFormInput,
    BBadge,
    // BAvatar,
    BTable,
    BPagination,
    // BTableSimple,
    // BThead,
    // BTbody,
    // BTh,
    // BTr,
    // BTd,
    // BInputGroup,
    BFormGroup,
    // BDropdownForm,
    // BInputGroupPrepend,
    // BDropdown,
    BButton,
    BSpinner,
    BCardBody,
    BFormSelect,
    BCardHeader,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  filters: {
    formatRupiah: val => {
      if (!val) return val
      const dataRp = new Intl.NumberFormat('id-ID').format(val)
      return dataRp
    },
    changeStatus: status => {
      let classStatusColor = ''
      switch (status) {
        case 'on_review':
          // #FBA63C
          classStatusColor = 'statusWarning'
          break
        case 'rejected':
          // #FBA63C
          classStatusColor = 'statusWarning'
          break
        case 'completed':
          // #34A770
          classStatusColor = 'statusSuccess'
          break
        default:
          // #FF6A3A
          classStatusColor = 'statusPrimary'
          break
      }
      return classStatusColor
    },
  },
  data() {
    return {
      loadDataAwal: true,
      catatanReview: '',
      catatanReviewState: null,
      detailData: {
        status: '',
        notes: '',
      },
      isLoadTable: false,
      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: '',
      },
      fields: [
        {
          key: 'order_id',
          label: 'Id',
        },
        {
          key: 'order_date',
          label: 'Tanggal',
          sortable: true,
        },
        // A virtual column made up from two fields
        {
          key: 'transreturn',
          label: 'Transaksi',
        },
        {
          key: 'order_grandtotal',
          label: 'Nilai Transaksi',
        },
        {
          key: 'shipping_cost',
          label: 'Ongkos Kirim',
        },
        {
          key: 'service_fee',
          label: 'Biaya COD',
        },
        {
          key: 'net_profit',
          label: 'Saldo',
        },
      ],
      items: [],
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => ({ text: f.label, value: f.key }))
    },
  },
  watch: {
    //
  },
  mounted() {
    this.loadDataAwal = false
    // Set the initial number of items
    this.totalRows = this.items.length
    //
  },
  created() {
    this.$store.commit('pencairan/UPDATE_PENCAIRAN_ID', this.$route.params.slug)
    this.fetchData()
  },
  methods: {
    selectText(element) {
      let range
      if (document.selection) {
        // IE
        range = document.body.createTextRange()
        range.moveToElementText(element)
        range.select()
      } else if (window.getSelection) {
        range = document.createRange()
        range.selectNode(element)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
      }
    },
    handleCopyNominalPenarikanSaldo() {
      this.selectText(this.$refs.nominalPenarikanSaldo)
      document.execCommand('copy')
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Success copy to clipboard',
          icon: 'BellIcon',
        },
      })
    },
    checkFormValidity() {
      const valid = this.$refs['form-review'].checkValidity()
      this.catatanReviewState = valid
      return valid
    },
    resetModalReview() {
      this.catatanReview = ''
      this.catatanReviewState = null
      this.$nextTick(() => {
        this.$bvModal.hide('modal-review')
      })
    },
    handleOkReview(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmitReview()
    },
    handleSubmitReview() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // calling api for submit review
      const endpoint = `/v1/admin/withdrawal/update/${this.$route.params.slug}?status=${this.detailData.status}`
      const formData = new FormData()
      formData.append('notes', this.catatanReview)
      // formData.append('yinyang.png', fs.createReadStream('./yinyang.png'));
      // res.data.files; // 'yinyang.png': an extremely long binary string
      // res.data.form; // form: { id: '1', string: 'Text we want to add to the submit' }
      axioskomsipdev.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(({ data }) => {
          console.log(data)
        })
        .catch(e => {
          console.log('error', e)
        })
      // then hide modal
      this.$nextTick(() => {
        this.$bvModal.hide('modal-review')
      })
    },
    resetModalTransNow() {
      this.$nextTick(() => {
        this.$bvModal.hide('modal-transfer-sekarang')
      })
    },
    handleOkTransNow() {
      // Trigger submit handler calling api for transfer
      // if success display modal transfer berhasil
      // this.$bvModal.show('modal-transfer-berhasil')
      // if fail display modal transfer fail
      this.$bvModal.show('modal-transfer-gagal')
    },
    handleOkTransBerhasil() {
      // hide modal
      this.$nextTick(() => {
        this.$bvModal.hide('modal-transfer-berhasil')
      })
    },
    handleOkTransGagal() {
      // hide modal
      this.$nextTick(() => {
        this.$bvModal.hide('modal-transfer-gagal')
      })
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async fetchData() {
      this.isLoadTable = true
      const endpoint = `/v1/admin/withdrawal/detail/${this.$route.params.slug}`
      axioskomsipdev.get(endpoint)
        .then(({ data }) => {
          const parseData = JSON.parse(JSON.stringify(data.data))
          this.$store.commit('pencairan/UPDATE_PENCAIRAN_STATUS', parseData.status)
          this.detailData = parseData
          this.items = parseData.orders
          this.totalRows = parseData.length
        })
        .catch(e => {
          console.log('error', e)
        })
        .finally(() => {
          this.isLoadTable = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.statusSuccess{
  background: #DCF3EB;
  color: #34A770;
}
.statusPrimary{
  background: #FFECE9;
  color: #F95031;
}
.statusWarning{
  background: #FFF2E2;
  color: #FBA63C;
}
.statusWrapper{
  width: 194px;
  height: 50px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-size: 20px;
  line-height: 150%;
}
.btn-custom{
  border-radius: 16px;
  width: 56px;
  height: 56px;
}
.btn-custom-bottom{
  padding: 16px 24px;
}
.btn-custom-footer-modal{
  width: 275px;
  height: 56px;
}
.transfersekarang-wrapper{
  display: grid;
  margin: 0px 16px 52px;
  justify-items: center;
  grid-gap: 20px 0px;
}
.btn-custom-footer-transfer-skrng{
  width: 274px;
  height: 56px;
  border-radius: 12px;
}
.btn-custom-footer-transfer-berhasil{
  width: 120px;
  height: 56px;
  border-radius: 12px;
}
.table-custom{
  border: none;
}
td{
  padding-bottom: 20px;
}
.td-custom{
  width: 200px;
}
.catatan-review{
  height: 127px;
  border: 1px solid #C4C4C4;
  border-radius: 12px;
}
.text-bukti-transfer{
  font-weight: 600;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: 0.5px;
  color: #444444;
}
.text-filesize-bukti-transfer{
  font-weight: 500;
  font-size: 18px;
  line-height: 150%;
  /* identical to box height, or 27px */
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  /* Grayscale/Label */
  color: #828282;
}
.wrapper-uploaded{
  background: #FFFFFF;
  border: 1px solid #444444;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
}
.icon-uploaded{
  background: #F1F2F6;
  border: 1px solid #444444;
  box-sizing: border-box;
  width: 57px;
  height: 65px;
  margin-right: 10px;
  border-radius: 12px;
}
.details-total{
  display: grid;
  padding: 16px;
  width: 400px;
  height: 94px;
  border-radius: 8px;
  background: #FFFFFF;
  border: 1px solid #E2E2E2;
  box-sizing: border-box;
}
.btn-custom-details{
  border: none !important;
}
</style>>
