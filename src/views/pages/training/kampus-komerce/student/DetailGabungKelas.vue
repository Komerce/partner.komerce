<template>
  <b-overlay
    variant="light"
    :show="loading"
    spinner-variant="primary"
    blur="0"
    opacity=".5"
    rounded="sm"
  >
    <b-row>
      <b-col cols="12">
        <b-card-actions
          no-actions
          no-body
        >
          <h3 class="mb-1 ml-3 mt-2">
            Detail
          </h3>
          <b-row>
            <b-avatar
              size="70px"
              class="mt-50 ml-4"
              :src="imageFile"
            />
            <b-col
              class="mt-2"
            >
              <h4>{{ fullname }}</h4>
              <span>{{ className }}</span>
            </b-col>
          </b-row>
          <b-row>
            <p class="mt-2 ml-5">
              Tanggal Gabung Kelas: {{ joinAt }}
            </p>
          </b-row>
          <b-table
            ref="table"
            striped
            hover
            responsive
            class="position-relative"
            empty-text="Tidak ada data untuk ditampilkan."

            :fields="tableFields"
            :items="tableProvider"
          >
            <template #cell(modules)="data">
              <h4>{{ data.item.module_title }}</h4>
              <p>{{ data.item.module_subtitle }}</p>
            </template>

            <template #cell(module_status)="data">
              <span>{{ data.value }}</span>
            </template>

            <template #cell(user_module_score)="data">
              <span>{{ data.value }}</span>
            </template>
          </b-table>
        </b-card-actions>
      </b-col>
    </b-row>
  </b-overlay>
</template>

<script>
import BCardActions from '@/@core/components/b-card-actions/BCardActions.vue'
import { dateFormat } from '@core/mixins/ui/date'
import {
  BRow,
  BOverlay,
  BCol,
  BAvatar,
  BTable,
} from 'bootstrap-vue'

export default {
  components: {
    BCardActions,
    BRow,
    BOverlay,
    BCol,
    BAvatar,
    BTable,
  },
  mixins: [dateFormat],
  data() {
    return {
      studentId: this.$route.params.student_id,
      fields: [
        { key: 'modules', label: 'Modul' },
        { key: 'module_status', label: 'Status' },
        { key: 'user_module_score', label: 'Nilai' },
      ],

      fullname: '',
      className: '',
      joinAt: '',
      imageFile: null,
      loading: false,
    }
  },
  computed: {
    tableFields() {
      const field = [...this.fields]
      return field
    },
  },
  mounted() {
    this.loadStudent()
  },
  methods: {
    tableProvider() {
      return this.$http.get(`/lms/module/moduleByStudent/${this.studentId}`).then(response => {
        const { data } = response.data
        return data.modules
      })
    },
    loadStudent() {
      return this.$http.get(`/lms/module/moduleByStudent/${this.studentId}`).then(response => {
        const { data } = response.data
        this.fullname = data.user_name
        this.className = data.class_skill
        this.joinAt = data.class_join_at
        this.imageFile = data.user_img
      })
    },
  },

}
</script>

<style>

</style>
