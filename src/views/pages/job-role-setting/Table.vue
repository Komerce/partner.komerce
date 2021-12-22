<template>
  <div class="pb-1">
    <b-overlay
      variant="light"
      :show="loading"
      spinner-variant="primary"
      blur="0"
      opacity=".5"
      rounded="sm"
    >
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
            v-for="tab in tabs"
            :key="tab.id"
            :title="`${tab.application_name} (${tab.platform_type})`"
            lazy
          >
            <Collapse
              v-for="(item, index) in items"
              :key="index"
              :index="`${tabIndex}-${index}`"
              :item="item"
            />
            <b-row v-if="items.length < 1">
              <b-col>
                <p class="text-center">
                  No Menu Available
                </p>
              </b-col>
            </b-row>
          </b-tab>
        </b-tabs>
      </b-card-actions>
    </b-overlay>
  </div>
</template>

<script>
import {
  BTabs, BTab, BOverlay, BRow, BCol,
} from 'bootstrap-vue'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import Collapse from './Collapse.vue'

export default {
  components: {
    BCardActions,
    BTabs,
    BTab,

    BOverlay,
    BRow,
    BCol,
    Collapse,
  },
  data() {
    const tabs = []
    return {
      tabIndex: 0,
      tabs,
      loading: false,
      fields: [
        {
          key: 'name',
          label: 'Root Menu',
        },
        {
          key: 'id',
          label: 'Manage',
        },
      ],
      items: [],
    }
  },
  watch: {
    tabIndex(newValue) {
      const komereApplicationId = newValue >= 0 ? this.tabs[newValue].id : null
      this.getAllMenu(komereApplicationId)
    },
  },
  async created() {
    this.loading = true

    return this.$http
      .get('komerceApplication')
      .then(response => {
        const { data } = response.data
        this.tabs = data
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    getAllMenu(komereApplicationId) {
      this.loading = true
      this.items = []
      this.$http
        .get(
          `menu/getMenuWithChildrens?&komerce_application_id=${komereApplicationId}`,
        )
        .then(({ data }) => {
          this.items = data.data
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
