<template>
  <div
    :class="`add-pickup-popup-print-content ${isSelected ? 'add-pickup-popup-print-content-selected' : ''}`"
    @click="handleChoseOption"
  >
    <div
      v-if="panelAmount !== 150"
      class="add-pickup-popup-print-options-frames"
    >
      <div
        v-if="panelAmount === 1"
        class="add-pickup-popup-print-options-item add-pickup-popup-print-options-item-1"
      >
        <div class="add-pickup-popup-print-options-item-content" />
      </div>
      <div
        v-if="panelAmount === 2"
        class="add-pickup-popup-print-options-item add-pickup-popup-print-options-item-2"
      >
        <div class="add-pickup-popup-print-options-item-content" />
        <div class="add-pickup-popup-print-options-item-content" />
      </div>
      <div
        v-if="panelAmount === 4"
        class="add-pickup-popup-print-options-item add-pickup-popup-print-options-item-4"
      >
        <div class="add-pickup-popup-print-options-item-content" />
        <div class="add-pickup-popup-print-options-item-content" />
        <div class="add-pickup-popup-print-options-item-content" />
        <div class="add-pickup-popup-print-options-item-content" />
      </div>
      <div
        v-if="panelAmount === 100"
        class="add-pickup-popup-print-options-item add-pickup-popup-print-options-item-100"
      >
        <div class="add-pickup-popup-print-options-item-content" />
      </div>
    </div>
    <div
      v-else
      class="add-pickup-popup-print-options-frames add-pickup-popup-print-options-frames-150"
    >
      <div
        v-if="panelAmount === 150"
        class="add-pickup-popup-print-options-item add-pickup-popup-print-options-item-150"
      >
        <div class="add-pickup-popup-print-options-item-content" />
      </div>
    </div>
    <div class="add-pickup-popup-print-options-dsc">
      <div class="add-pickup-popup-print-options-title">
        {{ title }}
      </div>
      <div class="add-pickup-popup-print-options-subtitle">
        {{ subTitle }}
      </div>
    </div>
  </div>
</template>

<script>
import {
} from 'bootstrap-vue'

export default {
  components: {
  },
  props: {
    panelAmount: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // selectedOptions: this.selectedOption,
    }
  },
  methods: {
    handleChoseOption() {
      this.$emit('onChose')
    },
  },
}
</script>

<style>
  .add-pickup-popup-print-content {
    width: 220px;
    height: 331px;
    border: 2px solid #E2E2E2;
    border-radius: 12px;
    padding: 20px 20px 0 20px;
    text-align: center;
    display: inline-block;
    vertical-align: top;
    margin: 2rem;
  }
  .add-pickup-popup-print-content:hover {
    cursor: pointer;
  }
  .add-pickup-popup-print-content-selected, .add-pickup-popup-print-content:hover {
    width: 220px;
    height: 331px;
    border: 2px solid #F95031;
    border-radius: 12px;
    padding: 20px 20px 0 20px;
  }
  .add-pickup-popup-print-options-frames {
    border: 1px solid #E2E2E2;
    border-radius: 12px;
    width: 180px;
    height: 180px;
    padding: 10px;
  }
  .add-pickup-popup-print-content-selected .add-pickup-popup-print-options-frames, .add-pickup-popup-print-content:hover .add-pickup-popup-print-options-frames {
    border: 1px solid #F95031;
    border-radius: 12px;
    width: 180px;
    height: 180px;
    padding: 10px;
  }
  .add-pickup-popup-print-options-frames-150, .add-pickup-popup-print-content-selected .add-pickup-popup-print-options-frames-150, .add-pickup-popup-print-content:hover .add-pickup-popup-print-options-frames-150 {
    width: 140px;
    height: 180px;
    margin: 0 auto;
  }

  .add-pickup-popup-print-options-item {
    display: grid;
  }
  .add-pickup-popup-print-options-item-1 div, .add-pickup-popup-print-options-item-2 div {
    width: 160px;
    height: 75px;
  }
  .add-pickup-popup-print-options-item-2 {
    grid-row-gap: 10px;
  }
  .add-pickup-popup-print-options-item-4 {
    grid-template-columns: auto auto;
    grid-gap: 10px;
  }
  .add-pickup-popup-print-options-item-4 div {
    height: 74px;
  }
  .add-pickup-popup-print-options-item-100, .add-pickup-popup-print-options-item-150 {
    display: unset;
  }
  .add-pickup-popup-print-options-item-100 div, .add-pickup-popup-print-options-item-150 div {
    width: 100%;
    height: 100%;
  }
  .add-pickup-popup-print-options-item-content {
    background-color: #E2E2E2;
    border-radius: 8px;
  }
  .add-pickup-popup-print-content-selected .add-pickup-popup-print-options-item-content, .add-pickup-popup-print-content:hover .add-pickup-popup-print-options-item-content {
    background-color: #FFECE9;
    border-radius: 8px;
  }
  .add-pickup-popup-print-options-dsc {
    text-align: left;
    font-size: 14px;
    margin-top: 20px;
  }
  .add-pickup-popup-print-options-title {
    color: #222222;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .add-pickup-popup-print-options-subtitle {
    color: #828282;
    font-weight: 500;
  }
</style>
