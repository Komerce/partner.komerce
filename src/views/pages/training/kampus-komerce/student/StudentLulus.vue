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
                  <b-form-group
                    label="Nilai"
                  >
                    <b-form-input
                      v-model="scoreStudent"
                      type="number"
                      :min="0"
                      :max="100"
                      label="title"
                      @input="tableProvider"
                    />
                  </b-form-group>
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
          :empty-filtered-text="`Tidak ada hasil untuk kata kunci '${filter}'.`"

          :show-empty="!loading"
          :items="datatable"
          :fields="tableFields"
          :filter="filter"
          :filter-included-fields="filterOn"
          :busy.sync="loading"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-compare.sync="sortCompare"
        >
          <template #cell(student_user_id)="data">
            <span>{{ data.item.student_user_id }}</span>
          </template>

          <template #cell(student_name)="data">
            <b-row class="mt-1">
              <b-col cols="auto">
                <b-avatar
                  :src="data.item.student_image"
                />
              </b-col>
              <b-col cols="auto">
                <span>{{ data.value }}</span>
                <p>{{ data.item.student_email }}</p>
              </b-col>
            </b-row>
          </template>

          <template #cell(student_finish_at)="data">
            <span>{{ data.value }}</span>
          </template>

          <template #cell(action)="data">
            <b-button
              variant="flat-warning"
              class="btn-icon"
              tag="router-link"
              :to="{ name: $route.meta.routeEdit, params: { student_id: data.item.student_user_id } }"
              @click="test(data)"
            >
              <feather-icon
                icon="EditIcon"
              />
            </b-button>
          </template>
        </b-table>
      </b-overlay>
    </b-col>
  </b-row>
</template>

<script>
import { dateFormat } from '@core/mixins/ui/date'
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
import flatPickr from 'vue-flatpickr-component'

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
  },
  mixins: [dateFormat],
  data() {
    return {
      filterPositionId: 1,
      filterPositionItems: [],
      filterClassId: 'Customer Service',

      loading: false,
      datatable: [],
      fields: [
        {
          key: 'student_user_id',
          label: 'ID',
          sortKey: 'student_user_id',
          sortable: true,
          sortDirection: 'desc',
        },
        {
          key: 'student_name',
          label: 'Data Diri',
          sortable: true,
        },
        {
          key: 'student_score',
          label: 'Nilai',
          sortable: true,
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'student_finish_at',
          label: 'Tanggal Lulus',
          sortable: true,
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
            return this.dateFormat(newFormat.join(''), 'dd mmmm yyyy')
          },
        },
        {
          key: 'action',
          label: 'Aksi',
          class: 'col-action',
        },
      ],

      dataStudentFilter: null,
      filter: null,
      filterOn: [],
      totalStudent: 0,

      sortBy: '',
      sortDesc: false,
      startDate: null,
      endDate: null,
      scoreStudent: null,
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
    clearDate() {
      this.startDate = null
      this.endDate = null
    },
    tableProvider() {
      return this.$http.get('/lms/report/student', {
        params: {
          class_skill_join: this.filterClassId,
          search_finish: this.filter,
          dateFromFinish: this.startDate,
          dateToFinish: this.endDate,
          sort_by: this.sortBy,
          sort: this.sortDirection,
        },
      }).then(response => {
        const { data } = response.data
        data.finished.forEach(this.myArray)
        this.refreshTable()
        return this.dataStudentFilter
      }).catch(() => {
        this.datatable = []
        this.refreshTable()
        return this.datatable
      })
    },
    myArray(data) {
      if (this.scoreStudent) {
        this.dataStudentFilter = data.student.filter(item => item.student_score === Number(this.scoreStudent))
        this.datatable = this.dataStudentFilter
      } else {
        this.dataStudentFilter = data.student
        this.datatable = data.student
      }
      this.totalStudent = data.total_student_Finish
      return this.dataStudentFilter
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
    sortCompare(aRow, bRow, key, sortDesc, formatter, compareOptions, compareLocale) {
      if (key === 'student_finish_at') {
        return aRow[key].localeCompare(bRow[key], compareLocale, compareOptions)
      }
      return false
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
