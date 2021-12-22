<template>
  <b-button
    v-b-popover.focus.bottom="text"
    tabindex="0"
    variant="transparent"
    class="ml-1"
  >
    <img
      src="@/assets/images/icons/info-circle.svg"
      alt="Info"
    >
  </b-button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
}
</script>
