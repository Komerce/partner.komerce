<template>
  <b-row>
    <b-col cols="12">
      <b-row>
        <b-col cols="6">
          <b-card-actions
            no-body
            no-actions
          >
            <div class="d-flex ml-2">
              <b-form-group
                class="mb-0"
              >
                <b-input-group
                  class="input-group-merge"
                  size="sm"
                >
                  <b-button
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    v-b-toggle.collapse-1
                    variant="primary"
                    size="sm"
                    class="mr-50"
                  >
                    <feather-icon
                      icon="FilterIcon"
                      class="mr-50"
                    />
                    Filter
                  </b-button>
                  <b-input-group-prepend is-text>
                    <feather-icon icon="SearchIcon" />
                  </b-input-group-prepend>
                  <b-form-input
                    id="filterInput"
                    v-model="filter"
                    type="search"
                    placeholder="Cari..."
                    debounce="500"
                  />
                </b-input-group>
              </b-form-group>
            </div>
          </b-card-actions>
        </b-col>
        <b-col
          cols="6"
          class="text-right"
        >
          <h4 class="mr-2">
            Total: {{ totalStudent }} Student
          </h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <b-collapse
            id="collapse-1"
            class="mb-2"
          >
            <b-card class="mb-0">
              <b-row>
                <b-col md="2">
                  <validation-provider
                    rules="min:20"
                  >
                    <b-form-group
                      label="Percentage"
                    >
                      <b-form-input
                        v-model="percentageStudent"
                        label="title"
                        type="number"
                        :min="0"
                        :max="100"
                        @input="filterPercent"
                      />
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col
                  cols="auto"
                  md="auto"
                  class="mt-2"
                >
                  <b-card
                    class="mb-0 mt-50"
                    no-body
                    title="Tanggal"
                  >
                    <flat-pickr
                      v-model="startDate"
                      class="form-control"
                      placeholder="Start Date"
                      :config="{ mode: 'single', altInput: true, altFormat: 'j/n/Y', dateFormat: 'Y-m-d',}"
                      @on-change="tableProvider"
                    />
                  </b-card>
                </b-col>
                <b-col
                  v-if="startDate"
                  cols="auto"
                  md="auto"
                  class="mt-2"
                >
                  <b-card
                    class="mb-0 mt-50"
                    no-body
                    title="Tanggal"
                  >
                    <flat-pickr
                      v-model="endDate"
                      class="form-control"
                      placeholder="End Date"
                      :config="{ mode: 'single', altInput: true, altFormat: 'j/n/Y', dateFormat: 'Y-m-d',}"
                      @on-change="tableProvider"
                    />
                  </b-card>
                </b-col>
                <b-col
                  cols="auto"
                  md="auto"
                  class="mt-2"
                >
                  <b-button
                    variant="primary"
                    size="sm"
                    class="mt-1"
                    @click="clearDate"
                  >
                    Clear Date
                  </b-button>
                </b-col>
              </b-row>
            </b-card>
          </b-collapse>
        </b-col>
      </b-row>

      <div class="mb-1 pl-2 d-flex overflow-x-scroll overflow-y-hidden">
        <div
          v-for="(item, index) in filterPositionItems"
          :key="`filter-position-${item.class_id}`"
          class="mr-50"
        >
          <b-form-group>
            <b-button
              v-model="classSkillJoin"
              :variant="filterPositionId === item.class_id ? 'primary' : 'flat-dark'"
              class="text-nowrap"
              :class="{'mr-2': index === (filterPositionItems.length - 1)}"
              :pressed="filterPositionId === item.class_name"
              pill
              size="sm"
              @click="selectPosition(item)"
            >
              {{ item.class_name }}
            </b-button>
          </b-form-group>
        </div>
      </div>

      <b-overlay
        variant="light"
        :show="loading"
        spinner-variant="primary"
        blur="0"
        opacity=".5"
        rounded="sm"
      >
        <b-table
          ref="table"
          striped
          hover
          responsive
          class="position-relative"
          empty-text="Tidak ada data untuk ditampilkan."
          :empty-filtered-text="`Tidak ada hasil untuk kata kunci ${filter}`"

          :show-empty="!loading"
          :items="datatable"
          :fields="tableFields"
          :filter="filter"
          :filter-included-fields="filterOn"
          :busy.sync="loading"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        >
          <template #cell(student_user_id)="data">
            <span>{{ data.value }}</span>
          </template>

          <template #cell(student_name)="data">
            <b-row class="mt-1">
              <b-col cols="auto">
                <b-avatar
                  class="mr-50"
                  :src="data.item.student_img"
                />
              </b-col>
              <b-col cols="auto">
                <span>{{ data.item.student_name }}</span>
                <p>{{ data.item.student_email }}</p>
              </b-col>
            </b-row>
          </template>

          <template #cell(student_percentage)="data">
            <span>{{ data.item.student_percentage+'%' }}</span>
          </template>

          <!-- <template #cell(student_join_at)="data">
            <span>{{ data.item.student_join_at }}</span>
            <b-button
              variant="primary"
              size="sm"
              @click="cek(data.item.student_join_at)"
            >
              cek
            </b-button>
          </template> -->

          <template #cell(action)="data">
            <b-button
              variant="flat-info"
              class="btn-icon"
              tag="router-link"
              :to="{ name: $route.meta.routeDetail, params: { student_id: data.item.student_user_id } }"
            >
              <feather-icon
                icon="EyeIcon"
              />
            </b-button>
          </template>
        </b-table>
      </b-overlay>
    </b-col>
  </b-row>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import { dateFormat } from '@core/mixins/ui/date'
import flatPickr from 'vue-flatpickr-component'
import { kFormatter } from '@core/utils/filter'
import {
  BButton,
  BRow,
  BCol,
  BFormGroup,
  BInputGroup,
  BInputGroupPrepend,
  BFormInput,
  VBTooltip,
  BTable,
  BAvatar,
  BOverlay,
  BCollapse,
  VBToggle,
  BCard,
} from 'bootstrap-vue'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import Ripple from 'vue-ripple-directive'
import { min } from '@validations'

export default {
  directives: {
    'b-tooltip': VBTooltip,
    'b-toggle': VBToggle,
    Ripple,
  },
  components: {
    BButton,
    BRow,
    BCol,
    BFormGroup,
    BInputGroup,
    BInputGroupPrepend,
    BFormInput,
    BCardActions,
    BTable,
    BAvatar,
    BOverlay,
    BCollapse,
    BCard,
    flatPickr,
    ValidationProvider,
  },
  mixins: [dateFormat],
  data() {
    return {
      min,
      loading: false,

      filterPositionId: 1,
      filterClassId: 'Customer Service',
      filterPositionItems: [],

      classSkillJoin: '',

      datatable: [],
      fields: [
        {
          key: 'student_user_id',
          sortKey: 'student_user_id',
          sortable: true,
          label: 'ID',
        },
        {
          key: 'student_name',
          sortable: true,
          label: 'Data Diri',
        },
        {
          key: 'student_percentage',
          sortable: true,
          label: 'Percentage',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'student_join_at',
          sortable: true,
          label: 'Tanggal Gabung Kelas',
          thClass: 'text-center',
          tdClass: 'text-center',
          formatter: value => {
            if (!value || value === '00-00-0000') return '-'
            value.split('')
            const newFormat = []
            newFormat.push(value[6])
            newFormat.push(value[7])
            newFormat.push(value[8])
            newFormat.push(value[9])
            newFormat.push(value[2])
            newFormat.push(value[3])
            newFormat.push(value[4])
            newFormat.push(value[5])
            newFormat.push(value[0])
            newFormat.push(value[1])
            newFormat.join('')
            return this.dateFormat(String(newFormat.join('')), 'dd mmmm yyyy')
          },
        },
        {
          key: 'action',
          label: 'Aksi',
          class: 'col-action',
        },
      ],

      filter: '',
      filterOn: [],
      totalStudent: 0,

      sortBy: '',
      sortDesc: false,
      startDate: null,
      endDate: null,
      percent: '',
      percentageStudent: null,
    }
  },
  computed: {
    tableFields() {
      const fields = [...this.fields]
      return fields
    },
    sortDirection() {
      return this.sortDesc ? 'desc' : 'asc'
    },
  },
  watch: {
    filterPositionId() {
      this.refreshTable()
    },
  },
  mounted() {
    this.loadFilterPositions()
  },
  created() {
    this.tableProvider()
  },
  methods: {
    tes() {
      this.tableProvider()
    },
    clearDate() {
      this.startDate = null
      this.endDate = null
    },
    filterPercent() {
      this.tableProvider()
    },
    tableProvider() {
      return this.$http.get('/lms/report/student', {
        params: {
          class_skill_join: this.filterClassId,
          search_join: this.filter,
          dateFrom: this.startDate,
          dateTo: this.endDate,
          sort_by: this.sortBy,
          sort: this.sortDirection,
        },
      }).then(response => {
        const { data } = response.data
        data.joined.forEach(this.myArray)
        this.refreshTable()
        return this.datatable
      }).catch(() => {
        this.refreshTable()
        this.datatable = []
        return this.datatable
      })
    },
    myArray(data) {
      if (this.percentageStudent) {
        this.datatable = data.student.filter(item => item.student_percentage === Number(this.percentageStudent))
      } else {
        this.datatable = data.student
      }
      this.totalStudent = data.total_student_join
      return this.datatable
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    loadFilterPositions() {
      return this.$http.get('/lms/class/list', {}, {
        params: {
          is_division_external: 1,
          sort: 'name',
          direction: 'asc',
        },
      })
        .then(async response => {
          const { data } = response.data
          this.filterPositionItems = Object.keys(data).map(key => data[key])
        })
    },
    selectPosition(data) {
      this.filterPositionId = data.class_id
      this.filterClassId = data.class_name
      this.tableProvider()
      return data
    },
    kFormatter,
    getIsoDate(date) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = (date.getDate()).toString().padStart(2, '0')

      return `${date.getFullYear()}-${month}-${day}`
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
