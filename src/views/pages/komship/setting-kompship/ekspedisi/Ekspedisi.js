/* eslint-disable global-require */
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  name: 'SettingEkspedisiKomship',
  data() {
    return {
      expedition: [],
      profile: JSON.parse(localStorage.getItem('userData')),
      address: [],
    }
  },
  created() {
    this.checkAddress()
    this.getExpedition()
  },
  methods: {
    async getExpedition() {
      const setDescription = name => {
        let desc
        if (name === 'IDEXPRESS') {
          desc = ({
            discount: [
              'Berat di atas 500 gram (STD), diskon <b>25%</b>',
              'Berat di bawah 500 gram (IDLite), <b>kurang lebih bayar 1/2-nya</b> ditambah diskon 15%',
            ],
            recomend: 'Diskon mantap paket ringan <b><1/2 kg</b> dan <b>antar kota besar retur rendah</b>',
          })
          return desc
        } if (name === 'JNE') {
          desc = ({
            discount: [
              'Reguler <b>25%</b>',
              'Belum tersedia layanan OKE dan YES di Komship',
            ],
            recomend: 'Cabang sangat banyak, retur lebih rendah kirim paket ke <b>daerah terpencil</b>',
          })
          return desc
        } if (name === 'SICEPAT') {
          desc = ({
            discount: [
              'Reguler (SIUNTUNG) <b>30%</b>',
              'Cargo (GOKIL) minimal 10kg, <b>mulai dari</b> Rp. 2.500,- / kg ditambah diskon 15%',
            ],
            recomend: 'Diskon mantap paket reguler >1kg  dan <b>antar kota besar</b> retur rendah',
          })
          return desc
        }
        return desc
      }
      await this.$http_komship.get('/v1/partner/shipment/not-active')
        .then(response => {
          const { data } = response.data
          this.expedition = data.map(items => ({
            id: items.id,
            shipping_name: items.shipping_name,
            image_path: items.image_path,
            is_active: items.is_active === 1,
            desc: setDescription(items.shipping_name),
            visible: false,
          }))
        })
        .catch(error => console.error(error))
    },
    collapseExpedition(id) {
      this.$root.$emit('bv::toggle::collapse', id)
    },
    async setExpedition(id) {
      if (this.address.length > 0) {
        const index = this.expedition.findIndex(items => items.id === id)
        if (!this.expedition[index].is_active) {
          this.expedition[index].is_active = true
        } else {
          this.expedition[index].is_active = false
        }
        await this.$http_komship.put(`/v1/partner/shipment/update/${id}`, {
          shipping_name: this.expedition[index].shipping_name,
          is_active: this.expedition[index].is_active ? 1 : 0,
          partner_id: this.profile.partner_detail.id,
          is_komship: 1,
        })
          .then(() => {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: 'Success update setting ekspedisi',
                variant: 'success',
              },
            }, 2000)
          })
          .catch(() => {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Gagal update setting ekspedisi, silahkan coba lagi',
                variant: 'danger',
              },
            }, 2000)
          })
      } else {
        this.$swal({
          title: '<span class="text-[18px]">Untuk dapat mengaktifkan ekspedisi ini, Kamu harus melengkapi bagian Kelurahan/Kecamatan pada Alamat Pickup</span>',
          imageUrl: require('@/assets/images/icons/warning.svg'),
          confirmButtonText: 'Lengkapi Alamat Pickup',
          confirmButtonClass: 'btn btn-primary rounded-lg',
          allowOutsideClick: false,
        }).then(res => {
          if (res.isConfirmed) {
            this.$router.push('setting-kompship/pickup')
          }
        })
      }
    },
    async checkAddress() {
      await this.$http_komship.get('/v1/address')
        .then(response => {
          const { data } = response.data
          this.address = data
        })
        .catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal load data, silahkan coba lagi',
              variant: 'danger',
            },
          }, 2000)
        })
    },
  },
}
