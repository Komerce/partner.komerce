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
          title="Gabung Kelas"
          lazy
        >
          <gabung-kelas />
        </b-tab>
        <b-tab
          title="Student Lulus"
          lazy
        >
          <student-lulus />
        </b-tab>
      </b-tabs>
    </b-card-actions>
  </div>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import GabungKelas from './GabungKelas.vue'
import StudentLulus from './StudentLulus.vue'

export default {
  components: {
    BCardActions,
    BTabs,
    BTab,
    GabungKelas,
    StudentLulus,
  },
  data() {
    const tabs = ['gabung-kelas', 'student-lulus']
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
