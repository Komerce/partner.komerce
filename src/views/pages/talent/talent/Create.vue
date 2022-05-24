<template>
  <div>
    <form-wizard
      ref="formWizard"
      :title="null"
      :subtitle="null"
      shape="square"
      finish-button-text="Submit"
      back-button-text="Previous"
      class="mb-3"
      :start-index="tabIndex"
      @on-change="updateIndex"
    >
      <!-- accoint details tab -->
      <tab-content
        title="Detail Profil"
        lazy
      >
        <div class="m-n2">
          <form-content
            v-if="tabIndex === 0"
            @on-submit="next"
          />
        </div>
      </tab-content>

      <!-- personal details tab -->
      <tab-content
        title="Kuesioner"
        lazy
      >
        <form-questionnaire v-if="tabIndex === 1" />
      </tab-content>

      <template slot="footer">
        <div class="wizard-footer-left" />
        <div class="wizard-footer-right" />
      </template>
    </form-wizard>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import FormContent from './Form.vue'
import FormQuestionnaire from './questionnaire/Form.vue'

export default {
  components: {
    FormWizard,
    TabContent,
    FormQuestionnaire,
    FormContent,
  },
  data() {
    return {
      id: this.$route.query.id,
      tabIndex: this.$route.query.tab === 'questionnaire' ? 1 : 0,
    }
  },
  mounted() {
    if (this.id) this.$refs.formWizard.activateAll()
  },
  methods: {
    formSubmitted() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Form Submitted',
          icon: 'EditIcon',
          variant: 'success',
        },
      })
    },
    validationForm() {
      return new Promise((resolve, reject) => {
        this.$refs.accountRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.infoRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormAddress() {
      return new Promise((resolve, reject) => {
        this.$refs.addressRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormSocial() {
      return new Promise((resolve, reject) => {
        this.$refs.socialRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    updateIndex(oldIndex, newIndex) {
      this.tabIndex = newIndex

      const tab = this.tabIndex === 1 ? 'questionnaire' : 'profile'
      const { id } = this

      this.$router.replace({ query: { id, tab } }).catch(() => {})
    },
    next(data) {
      this.id = data.data.talent.id

      this.$refs.formWizard.nextTab()
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-wizard.scss';
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
