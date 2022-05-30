<template>
  <b-modal
    id="access-modal"
    ref="accessModal"
    title="Pilih Hak Akses"
    size="sm"
    hide-footer
  >
    <b-row
      v-for="access in listAccess"
      :key="access.id"
      class="mb-1"
    >
      <b-col md="6">
        <b>{{ access.access_name }}</b>
      </b-col>
      <b-col md="6">
        <b-form-checkbox
          name="check-button"
          :checked="isChecked(access)"
          @change="e => updateCheckBox(e, access)"
        />
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import {
  BModal, BFormCheckbox, BRow, BCol,
} from 'bootstrap-vue'

export default {
  components: {
    BModal,
    BFormCheckbox,
    BRow,
    BCol,
  },
  props: {
    listAccess: {
      type: Array,
      default: null,
    },
    selectedPosition: {
      type: Object,
      default: null,
    },
    refreshMethod: {
      type: Function,
      default: null,
    },
  },
  methods: {
    show() {
      this.$refs.accessModal.show()
    },
    isChecked(access) {
      const filtered = this.selectedPosition?.accesses?.some(
        val => val.id === access.id,
      )
      return filtered
    },
    updateCheckBox(isAccessed, access) {
      const endpoint = isAccessed ? 'menu/assignAccess' : 'menu/releaseAccess'
      return this.$http
        .post(
          endpoint,
          {},
          {
            params: {
              menu_position_id: this.selectedPosition.pivot.id,
              access_id: access.id,
            },
          },
        )
        .finally(() => {
          this.refreshMethod()
        })
    },
  },
}
</script>

<style>
</style>
