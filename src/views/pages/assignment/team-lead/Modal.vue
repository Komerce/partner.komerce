<template>
  <b-modal
    id="confirmation-modal"
    ref="confirmationModal"
    title="Check Detail"
    :ok-title="loadingSubmit ? 'Submitting..' : 'Submit'"
    :ok-disabled="loadingSubmit"
    ok-variant="primary"
    cancel-variant="light"
    size="xl"
    centered
    @ok="save"
  >
    <div class="alert alert-danger p-2">
      *Silahkan cek kembali detail assignment yang kamu buat. Pastikan semua
      sudah benar. Data yang sudah dikirim
      <b class="text-danger">tidak bisa di edit</b> kembali.
    </div>
    <b-row>
      <b-col md="6">
        <b-row class="mb-1">
          <b-col md="6">
            No SK
          </b-col>
          <b-col md="6">
            <b>{{ skNumbers }}</b>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col md="6">
            Dokumen
          </b-col>
          <b-col md="6">
            <a
              :href="documentsUrl"
              target="_blank"
            ><b>{{ documentsUrl }}</b></a>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col md="6">
            Tanggal
          </b-col>
          <b-col md="6">
            <b>{{ releaseDates | date }}</b>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="1">
        <b>List Talent</b>
      </b-col>
      <b-col md="2">
        <b>Nama</b>
      </b-col>
      <b-col md="2">
        <b>Team Lead</b>
      </b-col>
      <b-col md="2">
        <b>Kantor</b>
      </b-col>
    </b-row>
    <b-row
      v-for="(assignment, index) in assignments"
      :key="index"
      class="mt-1"
    >
      <b-col
        md="2"
        offset-md="1"
      >
        {{ assignment.talent ? assignment.talent.full_name : '-' }}
      </b-col>
      <b-col md="2">
        {{ assignment.staff ? assignment.staff.full_name : '-' }}
      </b-col>
      <b-col md="2">
        {{ assignment.office ? assignment.office.office_name : '-' }}
      </b-col>
      <b-col md="1" />
      <b-col md="12">
        <hr>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { BRow, BCol, BModal } from 'bootstrap-vue'

export default {
  components: { BRow, BCol, BModal },
  props: {
    skNumbers: {
      type: String,
      default: '',
    },
    documentsUrl: {
      type: String,
      default: '',
    },
    releaseDates: {
      type: String,
      default: '',
    },
    loadingSubmit: {
      type: Boolean,
    },
    save: {
      type: Function,
      default: null,
    },
    assignments: {
      type: Array,
      default: null,
    },
  },
  methods: {
    show() {
      this.$refs.confirmationModal.show()
    },
  },
}
</script>

<style>
</style>
