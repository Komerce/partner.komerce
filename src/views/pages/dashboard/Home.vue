<template>
  <div>
    <b-card title="Ribuan Partner Siap Bekerjasama 🚀">
      <b-card-text>
        Pastikan profilmu selalu terupdate dan menarik. <b-link :to="{name: 'talent-profile'}">
          Ubah Profil
        </b-link>
      </b-card-text>
      <b-card-text>Agar banyak partner komerce yang tertarik memilihmu!</b-card-text>
    </b-card>
  </div>
</template>

<script>
import { BCard, BCardText, BLink } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardText,
    BLink,
  },
}
</script>

<style>

</style>
