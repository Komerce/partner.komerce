<template>
  <div class="pb-1">
    <b-card-actions
      ref="formCard"
      :title="$route.meta.name.singular"
      no-actions
      no-body
    >
      <b-tabs
        v-model="tabIndex"
        fill
      >
        <b-tab
          title="Aktif"
          lazy
        >
          <active />
        </b-tab>
        <b-tab
          title="Riwayat"
          lazy
        >
          <history />
        </b-tab>
      </b-tabs>
    </b-card-actions>
  </div>
</template>

<script>
import { BTabs, BTab } from 'bootstrap-vue'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import Active from './Active.vue'
import History from './History.vue'

export default {
  components: {
    BCardActions,
    BTabs,
    BTab,

    Active,
    History,
  },
  data() {
    const tabs = ['active', 'history']
    return {
      tabIndex: tabs.indexOf(this.$route.query.tab),
      tabs,
    }
  },
  watch: {
    tabIndex(newValue) {
      const tab = this.tabs[newValue]
      this.$router.replace({ query: { tab } }).catch(() => {})
    },
  },
}
</script>
