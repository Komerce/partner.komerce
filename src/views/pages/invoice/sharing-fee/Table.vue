<template>
  <b-row>
    <b-col cols="12">
      <b-card no-body>
        <div class="card-header">
          <b-card-title>{{ $route.meta.name.plural }}</b-card-title>

          <!-- Card Actions -->
          <b-card-actions-container
            :available-actions="['refresh']"
            @refresh="loadData"
          />
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
            striped
            hover
            :fields="fields"
            :items="items"
            show-empty
          >
            <template #cell(minimum_income)="data">
              {{ data.value | rupiah }}
            </template>
            <template #cell(sharing_fee_type)="data">
              <b-badge
                v-if="data.value == 'rp'"
                variant="success"
              >
                Nominal Rupiah
              </b-badge>
              <b-badge
                v-else
                variant="primary"
              >
                Presentase %
              </b-badge>
            </template>
            <template #cell(sharing_fee_value)="data">
              <span v-if="data.item.sharing_fee_type == 'rp'">{{
                data.value | rupiah
              }}</span>
              <span v-else>{{ data.value }}</span>
            </template>
            <template #cell(max_nominal_sharing_fee)="data">
              <!-- <span v-if="data.item.sharing_fee_type == 'rp'">{{
                data.value | rupiah
              }}</span> -->
              <span>{{ data.value | rupiah }}</span>
            </template>
            <template #cell(action)="data">
              <div>
                <b-button
                  tag="router-link"
                  :to="{
                    name: $route.meta.routeEdit,
                    params: { id: data.item.id },
                  }"
                  class="btn-icon mr-50"
                  size="sm"
                  variant="flat-warning"
                >
                  <feather-icon icon="EditIcon" />
                </b-button>
                <b-button
                  class="btn-icon"
                  size="sm"
                  variant="flat-danger"
                  @click="confirmDelete(data)"
                >
                  <feather-icon icon="Trash2Icon" />
                </b-button>
              </div>
            </template>
          </b-table>
        </b-overlay>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import BCardActionsContainer from '@core/components/b-card-actions/BCardActionsContainer.vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {
  BRow,
  BCol,
  BCard,
  BCardTitle,
  BTable,
  BOverlay,
  BBadge,
  BButton,
} from 'bootstrap-vue'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardTitle,
    BTable,
    BOverlay,
    BBadge,
    BButton,

    BCardActionsContainer,
  },
  data() {
    return {
      loading: false,
      items: [],
      fields: [
        {
          key: 'minimum_income',
          label: 'Pendapatan Minumum',
        },
        {
          key: 'sharing_fee_type',
          label: 'Jenis Sharing Fee',
        },
        {
          key: 'sharing_fee_value',
          label: 'Nilai Sharing Fee',
        },
        {
          key: 'max_nominal_sharing_fee',
          label: 'Nilai Maksimal Sharing Fee',
        },
        {
          key: 'action',
          label: 'Aksi',
        },
      ],
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true

      return this.$http
        .get('talentSharingFee')
        .then(async response => {
          const { data } = response.data

          this.items = data
        })
        .finally(() => {
          this.loading = false
        })
    },
    getId(item) {
      return item.id
    },
    confirmDelete(data) {
      this.$swal({
        title: 'Anda yakin?',
        text: `Hapus satu ${this.$route.meta.name.singular} dari tabel. Aksi ini tidak dapat dibatalkan.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.delete(data)
        }
      })
    },
    delete(data) {
      this.loading = true
      const endpoint = `talentSharingFee/${this.getId(data.item)}`

      this.$http({
        method: 'delete',
        url: endpoint,
      })
        .then(response => {
          if (response.data.status !== undefined && !response.data.status) {
            this.$toast(
              {
                component: ToastificationContent,
                props: {
                  title: 'Failed',
                  text: response.data.message,
                  variant: 'danger',
                  icon: 'AlertCircleIcon',
                },
              },
              { timeout: 2500 },
            )

            return
          }

          this.loadData()
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
