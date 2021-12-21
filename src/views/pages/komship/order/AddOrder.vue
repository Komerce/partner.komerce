<template>
  <b-card
    class="add-order-main-wrapper"
  >
    <add-order-input
      v-if="screens === 'input'"
      :date-text="dateText"
      :screens="screens"
      :list-product="listProduct"
      :list-selected="listSelected"
      :profile="profile"
      :disable-submit-button-status="disableSubmitButtonStatus"
      @onUpdateDate="updateDateText"
      @onUpdateScreenView="updateScreenView"
      @onUpdateSelectedItems="updateSelectedItems"
      @onUpdateSubmitButtonStatus="handleUpdateSubmitButtonStatus"
    />

    <add-order-detail
      v-if="screens === 'details'"
      :date-text="dateText"
      :screens="screens"
      :list-selected="listSelected"
      :profile="profile"
      @onBoardingShow="handlePublishButton"
      @onUpdateDate="updateDateText"
      @onUpdateScreenView="updateScreenView"
    />

    <onboarding
      ref="onboardingElement"
      :current-stage="4"
    />
  </b-card>
</template>

<script>
import {
  BCard,
} from 'bootstrap-vue'
import AddOrderInput from './AddOrderInput.vue'
import AddOrderDetail from './AddOrderDetail.vue'
import Onboarding from '../onboarding/Onboarding.vue'

export default {
  components: {
    BCard,
    AddOrderInput,
    AddOrderDetail,
    Onboarding,
  },
  data() {
    return {
      dateText: '',
      profile: {},
      test2: {},
      listSelected: [],
      screens: 'input',
      loading: false,
      disableSubmitButtonStatus: true,
      listProduct: [],
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    async reload() {
      this.loading = true
      await this.getProfile()
      await this.getListProductByPartner()
      this.loading = false
    },
    updateDateText(dateVal) {
      if (dateVal) this.dateText = dateVal
    },
    updateSelectedItems(newListSelected) {
      console.log('newListSelected')
      console.log(newListSelected)
      if (newListSelected) this.listSelected = newListSelected
    },
    updateScreenView(value) {
      if (value) this.screens = value
    },
    handlePublishButton() {
      if (this.profile.is_onboarding) this.$refs.onboardingElement.showModal()
    },
    handleUpdateSubmitButtonStatus(value) {
      this.disableSubmitButtonStatus = value
    },
    getProfile() {
      return this.$http_komship.post('v1/my-profile').then(response => {
        const { data } = response.data
        this.profile = data
      }).catch(() => {
        console.log('failed to get the profile data')
      })
    },
    getListProductByPartner() {
      const partnerId = this.profile.partner_id
      return this.$http_komship.get(`v1/partner-product/${partnerId}`).then(response => {
        const { data } = response.data
        this.listProduct = data
      }).catch(() => {
        console.log('failed to get the product data by partner')
      })
    },
  },
}
</script>

<style lang="scss">
  @import '~@core/scss/vue/libs/vue-select.scss';
  @import 'add-order.scss';
</style>
