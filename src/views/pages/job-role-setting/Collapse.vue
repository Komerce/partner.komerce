<template>
  <b-row class="py-1 pl-2 pr-1">
    <b-col
      v-b-toggle="[`collapse-${index}`]"
      md="8"
    >
      <b>{{ item.name }}</b>
    </b-col>
    <b-col
      md="4"
      class="text-right"
    >
      <b-button
        tag="router-link"
        :to="{
          name: $route.meta.routeShow,
          params: { id: item.id },
        }"
        variant="outline-info"
        size="sm"
      >
        <feather-icon
          icon="SettingsIcon"
          class="mr-50"
        />
        <span class="align-middle">Manage</span>
      </b-button>
      <feather-icon
        v-b-toggle="[`collapse-${index}`]"
        icon="ChevronDownIcon"
        class="ml-2 mr-50"
      />
    </b-col>
    <b-col
      v-if="item.childrens.length > 0"
      md="12"
    >
      <b-collapse
        :id="`collapse-${index}`"
        class="mt-2"
      >
        <Collapse
          v-for="(items, index2) in item.childrens"
          :key="index2"
          :index="`${index}-${index2}`"
          :item="items"
        />
      </b-collapse>
    </b-col>
    <b-col md="12">
      <hr>
    </b-col>
  </b-row>
</template>

<script>
import {
  BRow, BCol, BCollapse, VBToggle, BButton,
} from 'bootstrap-vue'

export default {
  directives: {
    'b-toggle': VBToggle,
  },
  components: {
    BRow,
    BCol,
    BCollapse,
    BButton,
    Collapse: () => import('./Collapse.vue'),
  },
  props: {
    index: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: null,
    },
  },
}
</script>

<style>
</style>
