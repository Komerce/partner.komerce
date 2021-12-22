<template>
  <div class="add-pickup-popup-print-wrapper">
    <b-modal
      id="modal-8"
      hide-footer
      hide-header
      centered
    >
      <b-icon-x-circle
        class="close-button-on-popup-pickup"
        @click="handleClosePopUp"
      />

      <div class="title-on-popup-pickup mt-2 mb-2">
        Pilih Bentuk Print Label
      </div>

      <section class="add-pickup-popup-print-options-wrapper">
        <add-pickup-print-panel
          :is-selected="selectedOptions === 1"
          :panel-amount="1"
          :title="'1 Label / Halaman'"
          :sub-title="'Direkomendasikan kertas A4'"
          @onChose="() => handleChosePrintOption(1)"
        />

        <add-pickup-print-panel
          :is-selected="selectedOptions === 2"
          :panel-amount="2"
          :title="'2 Label / Halaman'"
          :sub-title="'Direkomendasikan kertas A4'"
          @onChose="() => handleChosePrintOption(2)"
        />

        <add-pickup-print-panel
          :is-selected="selectedOptions === 4"
          :panel-amount="4"
          :title="'4 Label / Halaman'"
          :sub-title="'Direkomendasikan kertas A4'"
          @onChose="() => handleChosePrintOption(4)"
        />

        <add-pickup-print-panel
          :is-selected="selectedOptions === 100"
          :panel-amount="100"
          :title="'10 cm x 10cm'"
          :sub-title="'Printher Thermal'"
          @onChose="() => handleChosePrintOption(100)"
        />

        <add-pickup-print-panel
          :is-selected="selectedOptions === 150"
          :panel-amount="150"
          :title="'10 cm x 15cm'"
          :sub-title="'Printher Thermal'"
          @onChose="() => handleChosePrintOption(150)"
        />
      </section>

      <b-button
        class="submit-button-on-popup-pickup org-button"
        @click="handleSubmit"
      >
        Print
      </b-button>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal,
  BButton,
  BIconXCircle,
} from 'bootstrap-vue'
import AddPickupPrintPanel from './AddPickupPrintPanel.vue'

export default {
  components: {
    BModal,
    BButton,
    BIconXCircle,
    AddPickupPrintPanel,
  },
  props: {
    selectedOption: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectedOptions: this.selectedOption,
    }
  },
  methods: {
    showModal() {
      this.$root.$emit('bv::show::modal', 'modal-8')
    },
    handleClosePopUp() {
      this.handleHidePopup()
    },
    handleSubmit() {
      this.handleHidePopup()
      this.$emit('onSubmitOption', this.selectedOptions)
    },
    handleHidePopup() {
      this.$root.$emit('bv::hide::modal', 'modal-8')
    },
    handleChosePrintOption(value) {
      // console.log('handleChosePrintOption', value)
      if (value) this.selectedOptions = value
      this.$emit('onChangeOption', this.selectedOptions)
    },
  },
}
</script>

<style>
  #modal-8 .modal-dialog {
    max-width: 70vw;
  }
  .add-pickup-popup-print-options-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
