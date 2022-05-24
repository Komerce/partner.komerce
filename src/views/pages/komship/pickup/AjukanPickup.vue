<template>
  <b-card
    class="add-pickup-main-wrapper"
  >
    <add-pickup-input
      :class="currentView === 'input' ? '' : 'hide'"
      :profile="profile"
      :data-order="listOrder"
      @onSubmitInputForm="handleInputSubmitForm"
    />

    <add-pickup-details
      :class="currentView === 'details' ? '' : 'hide'"
      :profile="profile"
      :list-selected="listSelectedDetails"
      @onBoardingShow="handlePublishButton"
      @onBackButtonClicked="() => handleChangeCurrenView('input')"
    />

    <onboarding
      ref="onboardingElement"
      :current-stage="6"
    />
  </b-card>
</template>

<script>
import {
  BCard,
} from 'bootstrap-vue'
import AddPickupInput from './AddPickupInput.vue'
import AddPickupDetails from './AddPickupDetails.vue'
import Onboarding from '../onboarding/Onboarding.vue'

export default {
  components: {
    BCard,
    AddPickupInput,
    AddPickupDetails,
    Onboarding,
  },
  data() {
    return {
      currentView: 'input',
      profile: {},
      listOrder: [],
      listSelected: [],
      listSelectedId: [],
      listSelectedDetails: [],
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    handleInputSubmitForm(arrValue, arrValueId) {
      if (arrValue && arrValueId) {
        this.listSelected = arrValue
        this.listSelectedId = arrValueId
        this.triggerGetOrderDetails()
        this.handleChangeCurrenView('details')
      }
    },
    handleChangeCurrenView(values) {
      if (values) this.currentView = values
    },
    handlePublishButton() {
      if (this.profile.is_onboarding) this.$refs.onboardingElement.showModal()
    },
    async reload() {
      this.loading = true
      await this.getProfile()
      await this.getListOrderByPartner()
      this.loading = false
    },
    async triggerGetOrderDetails() {
      this.loading = true
      await this.getListOrderDetailsByPartner()
      this.loading = false
    },
    getProfile() {
      return this.$http_komship.post('v1/my-profile').then(response => {
        const { data } = response.data
        this.profile = data
      }).catch(() => {
        // handle error
      })
    },
    getListOrderByPartner() {
      const partnerId = this.profile.partner_id
      return this.$http_komship.get(`v1/order/${partnerId}`, {
        params: {
          is_komship: this.profile.is_komship,
          order_status: 0,
        },
      }).then(response => {
        const { data } = response.data.data
        this.listOrder = data
      }).catch(() => {
        // handle error
      })
    },
    getListOrderDetailsByPartner() {
      const partnerId = this.profile.partner_id
      return this.$http_komship.get(`v1/order/${partnerId}`, {
        params: {
          is_komship: this.profile.is_komship,
          order_status: 0,
          order_id: this.listSelectedId.toString(),
        },
      }).then(response => {
        const { data } = response.data.data
        this.listSelectedDetails = data
      }).catch(() => {
        // handle error
      })
    },
  },
}
</script>

<style lang="scss">
  @import '~@core/scss/vue/libs/vue-select.scss';
  @import 'add-pickup.scss';
</style>
