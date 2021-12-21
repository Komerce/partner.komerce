<template src="./DaerahTanpaAksesCOD.html" />
<script>
import axioskomsipdev from '@/libs/axioskomsipdev'

import {
  BRow,
  BCol,
  BTable,
  BInputGroup,
  BInputGroupPrepend,
  BDropdown,
  BDropdownForm,
  BFormInput,
  BFormGroup,
  BModal,
  BButton,
  BCard,
  BPagination,
  BSpinner,
  BFormSelect,
  BCardBody,
} from 'bootstrap-vue'

export default {
  components: {
    BRow,
    BCol,
    BTable,
    BInputGroup,
    BInputGroupPrepend,
    BDropdown,
    BDropdownForm,
    BFormInput,
    BFormGroup,
    BModal,
    BButton,
    BCard,
    BSpinner,
    BPagination,
    BFormSelect,
    BCardBody,
  },
  data() {
    return {
      loadDataAwal: true,
      searchTerm: '',
      filterDropdown: {
        city_name: '',
        district_name: '',
        zip_code: '',
      },
      isLoadTable: false,
      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      items: [],
      fields: [
        // A virtual column made up from two fields
        {
          key: 'province',
          label: 'Provinsi',
          sortable: true,
        },
        {
          key: 'city_name',
          label: 'Kabupaten',
          sortable: true,
        },
        {
          key: 'district_name',
          label: 'Kecamatan',
          sortable: true,
        },
        {
          key: 'subdistrict_name',
          label: 'Kelurahan',
        },
        // {
        //   key: 'zip_code',
        //   label: 'Kodepos',
        // },
        {
          key: 'deleteDaerahTanpaAksesCOD',
          label: '',
        },
      ],
    }
  },
  computed: {
    //
  },
  watch: {
    // filterDropdown: {
    //   handler(val) {
    //     console.log(val)
    //   },
    // },
  },
  mounted() {
    this.getItemsData(this, x => { this.items = x })
  },
  created() {
    //
  },
  methods: {
    getItemsData(ctx, callback) {
      const vm = this
      const paramsData = {
        page: ctx.currentPage,
        per_page: ctx.perPage,
        ...ctx.filterDropdown,
      }
      const endpoint = '/v1/admin/no-cod'
      axioskomsipdev.get(endpoint, { params: { ...paramsData } })
        .then(({ data }) => {
          const parseData = JSON.parse(JSON.stringify(data.data))
          // console.log(parseData)
          vm.perPage = parseData.per_page
          vm.totalRows = parseData.total
          vm.currentPage = parseData.current_page
          callback(parseData.data)
        })
        .catch(e => {
          console.log('error', e)
        })
        .finally(() => {
          vm.loadDataAwal = false
        })
      return null
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    deleteDaerahTanpaAksesCOD(val) {
      console.log(val)
      this.$bvModal.show('modal-delete-daerah')
      // const endpoint = `/v1/admin/no-cod/delete/${val.zip_code}`
      // axioskomsipdev.get(endpoint)
      //   .then(({ data }) => {
      //     console.log(data)
      //   })
      //   .catch(e => {
      //     console.log('error', e)
      //   })
    },
    handleImportExcelDaerahCOD() {
      this.$router.push('/biaya-ekspedisi/daerah-tanpa-akses/upload')
    },
    onClickResetFilterDropdown() {
      this.filterDropdown = {
        city_name: '',
        district_name: '',
        zip_code: '',
      }
    },
    onClickTerapkanFilterDropdown() {
      this.getItemsData(this, x => { this.items = x })
      // Close the dropdown and (by passing true) return focus to the toggle button
      this.$refs.dropdownFilter.hide(true)
    },
    handleOkModal() {
      // calling api
      this.$bvModal.hide('modal-delete-daerah')
    },
    handleTidakModal() {
      this.$bvModal.hide('modal-delete-daerah')
    },
  },
}
</script>
<style lang="scss" src="./DaerahTanpaAksesCOD.scss" scoped />
