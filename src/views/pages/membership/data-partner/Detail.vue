<template>
  <section id="cod-data-partner-detail">
    <div v-if="!loadDataAwal">
      <b-card no-body>
        <b-card-body>
          <div class="d-flex align-items-center">
            <b-button
              variant="primary"
              size="sm"
              class="mr-2 btn-custom"
              @click="$router.go(-1)"
            >
              <feather-icon
                size="2x"
                icon="ChevronLeftIcon"
              />
            </b-button>
            <h4
              class="text-24-bold"
              style="color: #222222;"
            >
              Rincian Penarikan Saldo
            </h4>
          </div>
          <div class="d-flex justify-content-end">
            <b-button
              v-if="enableForm"
              key="enableFormKey"
              variant="primary"
              size="sm"
              class="mr-50 btn-custom btn-custom--edit"
              @click="toogleFormEdit"
            >
              Edit
            </b-button>
            <div
              v-else
              key="enableFormKey"
              class="d-flex"
            >
              <b-button
                variant="outline-primary"
                size="sm"
                class="mr-1 btn-custom btn-custom--edit"
                @click="toogleFormEdit"
              >
                Batal
              </b-button>
              <b-button
                variant="primary"
                size="sm"
                class="btn-custom btn-custom--edit"
                @click="simpanFormEdit"
              >
                Simpan
              </b-button>
            </div>
          </div>

          <div>
            <h3
              class="font-weight-bolder"
              style="font-size:20px;color:#222222;"
            >
              Informasi Pengguna
            </h3>
            <b-form @submit.prevent="submitData()">
              <b-row>
                <b-col cols="9">
                  <b-form-group
                    label="Nama"
                    label-for="name"
                    label-cols-md="3"
                  >
                    <b-form-input
                      id="name"
                      v-model="name"
                      :readonly="enableForm"
                      placeholder="Masukkan Nama"
                    />
                  </b-form-group>
                </b-col>
                <b-col cols="9">
                  <b-form-group
                    label="Email"
                    label-for="email"
                    label-cols-md="3"
                  >
                    <b-form-input
                      id="email"
                      type="email"
                      :readonly="enableForm"
                      placeholder="Masukkan Email"
                    />
                  </b-form-group>
                </b-col>
                <b-col cols="9">
                  <b-form-group
                    label="Username"
                    label-for="h-username"
                    label-cols-md="3"
                  >
                    <b-form-input
                      id="h-username"
                      :readonly="enableForm"
                      placeholder="Username"
                    />
                  </b-form-group>
                </b-col>
                <b-col cols="9">
                  <b-form-group
                    label="No Handphone"
                    label-for="nohp"
                    label-cols-md="3"
                  >
                    <b-form-input
                      id="nohp"
                      type="number"
                      :readonly="enableForm"
                      placeholder="No Handphone"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
            </b-form>
          </div>

          <div class="mt-1">
            <h4
              class="font-weight-bolder"
              style="font-size: 20px;color: #222222;"
            >
              Informasi Membership Pengguna
            </h4>
            <b-row>
              <b-col
                md="3"
              >
                <span
                  class="text-18-normal"
                  style="color: #222222;"
                >
                  Layanan yang digunakan
                </span>
              </b-col>
              <b-col
                md="6"
              >
                <div
                  style="display: grid;grid-row-gap:1rem;"
                >
                  <b-list-group>
                    <b-list-group-item class="d-flex justify-content-between align-items-center">
                      <div
                        class="d-flex align-items-center"
                      >
                        <span class="mr-1">
                          <img
                            :src="require('@/assets/images/logo/logo.png')"
                            :title="'komerce'"
                            alt="logo"
                            width="29px"
                            height="29px"
                            style="border-radius: 15px;"
                          >
                        </span>
                        <span>Hiring</span>
                      </div>
                      <span
                        class="text-16-normal"
                      >
                        03 September 2021
                      </span>
                    </b-list-group-item>
                  </b-list-group>
                  <b-button
                    v-b-modal.modal-edit-akseslayanan
                    block
                    variant="outline-primary"
                    class="btn-custom--editakseslayanan"
                  >
                    Edit Akses Layanan
                  </b-button>
                </div>
              </b-col>
            </b-row>
            <b-row
              class="mt-1 align-items-center"
            >
              <b-col
                md="3"
              >
                <span
                  class="text-18-normal"
                  style="color: #222222;"
                >
                  Riwayat Penarikan Saldo
                </span>
              </b-col>
              <b-col
                md="3"
              >
                <b-button
                  block
                  variant="outline-primary"
                  class="btn-custom--editakseslayanan"
                  @click="$router.push(`/data-partner/${$route.params.id}/detail/riwayat-penarikan`)"
                >
                  Lihat Riwayat
                </b-button>
              </b-col>
            </b-row>
          </div>
        </b-card-body>
      </b-card>
      <b-modal
        id="modal-edit-akseslayanan"
        ref="modal-edit-akseslayanan"
        centered
        hide-header
        hide-header-close
        hide-footer
        size="md"
        @show="checkAksesLayanan"
      >
        <div
          style="display: grid; grid-row-gap: 1rem;"
        >
          <h3
            class="text-24-bold"
            style="color: #222222;"
          >
            Menambahkan Akses Layanan
          </h3>
          <b-form-group>
            <b-form-checkbox
              v-for="option in listCheckBox"
              :key="option.value"
              v-model="selectedCheckbox"
              :value="option.value"
              name="checkboxAksesLayanan"
            >
              {{ option.text }}
            </b-form-checkbox>
          </b-form-group>
          <div
            class="d-flex mt-1 justify-content-end"
          >
            <b-button
              variant="outline-primary"
              class="mr-1 btn-custom--editakseslayananbtn"
              @click="hideModalAksesLayanan"
            >
              Batal
            </b-button>
            <b-button
              variant="primary"
              class="btn-custom--editakseslayananbtn"
              @click="simpanDataAksesLayanan"
            >
              Simpan
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
  BForm,
  BModal,
  BFormInput,
  BFormGroup,
  BFormCheckbox,
  BListGroup,
  BListGroupItem,
  BButton,
  BCard,
  BSpinner,
  BCardBody,
} from 'bootstrap-vue'

export default {
  components: {
    BRow,
    BCol,
    BForm,
    BModal,
    BFormInput,
    BFormGroup,
    BFormCheckbox,
    BListGroup,
    BListGroupItem,
    BButton,
    BCard,
    BSpinner,
    BCardBody,
  },
  data() {
    return {
      loadDataAwal: true,
      enableForm: true,
      name: '',
      listCheckBox: [
        { text: 'Hiring', value: 'hiring' },
        { text: 'COD', value: 'cod' },
        { text: 'Hiring dan COD', value: 'hiringncod' },
        { text: 'Lainnya', value: 'lainny' },
      ],
      selectedCheckbox: [],
    }
  },
  computed: {
    //
  },
  watch: {
    //
  },
  mounted() {
    //
  },
  created() {
    setTimeout(() => {
      this.loadDataAwal = false
    }, 1000)
  },
  methods: {
    submitData() {

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
    simpanFormEdit() {
      // calling api for simpan data
    },
    toogleFormEdit() {
      this.enableForm = !this.enableForm
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-custom{
  border-radius: 16px;
  width: 56px;
  height: 56px;

  &--edit{
    width: 178px;
    height: 56px;
    border-radius: 12px;
  }
  &--editakseslayanan{
    height: 56px;

    &btn{
      width: 178px;
      height: 56px;
    }
  }
}
</style>
