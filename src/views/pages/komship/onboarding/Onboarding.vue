<template>
  <div class="container p-0">
    <b-modal
      id="modal-10"
      hide-footer
      hide-header
      centered
      no-close-on-backdrop
    >
      <div
        v-if="currentStages === 0"
        class="onboarding-popup-wrapper"
      >
        <div class="onboarding-popup-title">
          Halo, Selamat datang di Komship!
        </div>
        <div class="onboarding-popup-subtitle">
          Yuk coba lakukan transaksi pertamamu di Komship dengan 3 langkah dan dapatkan berbagai benefitnya
        </div>
        <div class="onboarding-popup-icon">
          <div class="grey-box-wrapper">
            <div class="grey-box-wrapper-small">
              <div class="grey-box" />
            </div>
            <div class="grey-box-text">
              Tambah Produk
            </div>
          </div>
          <div class="grey-box-arrow">
            <b-icon-chevron-right />
          </div>
          <div class="grey-box-wrapper">
            <div class="grey-box-wrapper-small">
              <div class="grey-box" />
            </div>
            <div class="grey-box-text">
              Tambah Order
            </div>
          </div>
          <div class="grey-box-arrow">
            <b-icon-chevron-right />
          </div>
          <div class="grey-box-wrapper">
            <div class="grey-box-wrapper-small">
              <div class="grey-box" />
            </div>
            <div class="grey-box-text">
              Ajukan Pickup
            </div>
          </div>
        </div>
        <div class="onboarding-popup-desc">
          Mari kita coba simulasi belajar menggunakan Komship dengan data percobaan
        </div>
      </div>

      <div
        v-if="currentStages === 1"
        class="onboarding-popup-wrapper"
      >
        <div class="onboarding-popup-title">
          Pertama, yuk kita coba masukan produk
        </div>
        <div class="onboarding-popup-subtitle">
          Kamu cukup memasukan setiap produk satu kali maka produk akan otomatis tersimpan. Kamu dapat memantau penjualan setiap produk dan melihat produk paling laris.
        </div>
        <div class="onboarding-popup-icon">
          <div class="grey-box-wrapper-full">
            <div class="grey-box" />
          </div>
        </div>
        <div class="onboarding-popup-desc">
          Selain itu kamu juga dapat mengatur stok produkmu dan akan mendapat peringatan jika stok produkmu menipis.
        </div>
      </div>

      <div
        v-if="currentStages === 2"
        class="onboarding-popup-wrapper"
      >
        <div class="onboarding-popup-title">
          Selamat! kamu telah berhasil menyimpan produk pertamamu di Komship
        </div>
        <div class="onboarding-popup-subtitle">
          Kamu dapat menambahkan produk yang lain dengan mobila yang sama
        </div>
        <div class="onboarding-popup-icon">
          <div class="grey-box-wrapper-full">
            <div class="grey-box" />
          </div>
        </div>
        <div class="onboarding-popup-desc">
          Langkah selanjutnya adalah masukan orderan yang kamu miliki.
        </div>
      </div>

      <div
        v-if="currentStages === 3"
        class="onboarding-popup-wrapper"
      >
        <div class="onboarding-popup-title">
          Sekarang mari kita coba tambahkan orderan
        </div>
        <div class="onboarding-popup-subtitle">
          Setelah menambahkan orderan kamu akan dapat melakukan penarikan saldo kapanpun, monitoring dan ekspor data penjualan hingga keuangan, megetahui customer loyal, persebaran lokasi customer, top order entry.
        </div>
        <div class="onboarding-popup-icon">
          <div class="grey-box-wrapper-full">
            <div class="grey-box" />
          </div>
        </div>
      </div>

      <div
        v-if="currentStages === 4"
        class="onboarding-popup-wrapper"
      >
        <div class="onboarding-popup-title">
          Yeay, berhasil menambahkan order
        </div>
        <div class="onboarding-popup-subtitle">
          Kamu dapat menambahkan banyak orderan dengan mobila yang sama.
        </div>
        <div class="onboarding-popup-icon">
          <div class="grey-box-wrapper-full">
            <div class="grey-box" />
          </div>
        </div>
        <div class="onboarding-popup-desc">
          Langkah selanjutnya adalah ajukan pickup agar paket orderanmu dijemout kurir.
        </div>
      </div>

      <div
        v-if="currentStages === 5"
        class="onboarding-popup-wrapper"
      >
        <div class="onboarding-popup-title">
          Satu langkah lagi, mari kita coba ajukan pickup
        </div>
        <div class="onboarding-popup-subtitle">
          Kamu cukup mengisi form ajukan pickup, nanti kurir akan datang ke alamat yang sudah kamu tentukan untuk menjemput paket orderan. Kamu juga dapat mencetak label sesuai keinginan kamu.
        </div>
        <div class="onboarding-popup-icon">
          <div class="grey-box-wrapper-full">
            <div class="grey-box" />
          </div>
        </div>
        <div class="onboarding-popup-desc">
          Pastikan semua paket sudah siap untuk dikirim yaa!
        </div>
      </div>

      <div
        v-if="currentStages === 6"
        class="onboarding-popup-wrapper"
      >
        <div class="onboarding-popup-title">
          Yeay!
        </div>
        <div class="onboarding-popup-icon">
          <div class="grey-box-wrapper-full">
            <div class="grey-box" />
          </div>
        </div>
        <div class="onboarding-popup-desc">
          Selamat kamu telah berhasil menyelesaikan latihan menggunakan Komship. Selanjutnya kamu dapat langsung menggunakan layanan Komship dan dapatkan segudang benefitnya.
        </div>
      </div>

      <div
        :class="`onboarding-popup-btn-wrapper ${currentStages === 6 ? 'mid-align' : ''}`"
      >
        <b-button
          v-if="currentStages === 6"
          class="white-button right-gap"
          @click="() => handleRedirectToProfile()"
        >
          Lengkapi Profil Dulu
        </b-button>
        <b-button
          v-if="currentStages === 6 || currentStages === 1"
          class="org-button"
          @click="() => handleRedirectToAddProduct()"
        >
          <span
            v-if="currentStages === 6"
          >
            Mulai Masukan Produk
          </span>
          <span
            v-if="currentStages === 1"
          >
            Tambah Produk Sekarang
          </span>
        </b-button>
        <b-button
          v-else
          class="org-button"
          @click="() => handleSubmitButtonClicked(currentStages)"
        >
          Lanjut
          <b-icon-chevron-right />
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal,
  BButton,
  BIconChevronRight,
} from 'bootstrap-vue'

export default {
  components: {
    BModal,
    BButton,
    BIconChevronRight,
  },
  props: {
    currentStage: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      currentStages: this.currentStage,
    }
  },
  methods: {
    showModal() {
      this.$root.$emit('bv::show::modal', 'modal-10')
    },
    handleSubmitButtonClicked(currentStages) {
      if (this.currentStages === 6) {
        this.handleRedirectToAddProduct()
      } else if (typeof currentStages !== 'undefined') {
        if (currentStages === 3) {
          this.$router.push('add-order')
        } else if (currentStages === 5) {
          this.$router.push('ajukan-pickup')
        } else {
          this.currentStages += 1
        }
      }
    },
    handleRedirectToAddProduct() {
      this.triggerUpdateOnBoardingStatus('add-produk-onboarding')
    },
    handleRedirectToProfile() {
      this.triggerUpdateOnBoardingStatus('partner/profile')
    },
    async triggerUpdateOnBoardingStatus(nextUrl) {
      await this.updateOnboardingStatus(nextUrl)
    },
    updateOnboardingStatus(nextUrl) {
      return this.$http_komship.put('v1/partner/onboarding/update').then(response => {
        console.log(response)
        if (response && response.data && response.data.code && response.data.code === 200) {
          this.$router.push(nextUrl)
        }
      }).catch(() => {
        console.log('failed to update onboarding status on profile')
      })
    },
  },
}
</script>

<style lang="scss">
  @import './onboarding.scss';
</style>
