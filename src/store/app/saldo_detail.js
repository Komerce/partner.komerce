import moment from 'moment'
import { getField, updateField } from 'vuex-map-fields'
import axiosIns from '@/libs/axios'
import { axiosKomship, formatYmd, ranges } from '../helpers'

export default {
  namespaced: true,
  state: {
    id: '',
    dateStart: '',
    dateEnd: '',
    totalSaldo: 0,
    nominalPenarikan: 0,
    statusPenerimaan: '',
    rincianSaldos: [],
    optionsSaldo: ['7 Hari Terakhir', '1 Bulan Terakhir', '3 Bulan Terakhir'],
    selectedSaldo: '7 Hari Terakhir',
  },
  getters: {
    getField,
    sisaSaldo(state) {
      return state.totalSaldo - state.nominalPenarikan
    },
    selectedSaldo(state) {
      return ranges[state.selectedSaldo]
    },
  },
  mutations: {
    updateField,
    UPDATE_ID(state, id) {
      state.id = id
    },
    UPDATE_TOTAL_SALDO(state, totalSaldo) {
      state.totalSaldo = totalSaldo
    },
    UPDATE_RINCIAN_SALDO(state, rincianSaldos) {
      state.rincianSaldos = rincianSaldos.map(item => ({
        tanggal: moment(new Date(item.order_date)).format('DD-MM-YYYY'),
        jenisOrder: item.order_type || '-',
        retur: false,
        nilaiOrder: item.grand_total,
        ongkir: item.shipping_cost,
        ongkirTambahan: null,
        biayaCod: item.service_fee,
        saldo: item.amount.substring(1),
        negative: item.amount < 0,
      }))
    },
  },
  actions: {
    async init({ dispatch }) {
      dispatch('getTotalSaldo')
      await dispatch('getRincianSaldo')
    },
    async getTotalSaldo({ commit }) {
      try {
        const response = await axiosIns.get('user/partner/get-saldo')
        commit('UPDATE_TOTAL_SALDO', response.data.data.saldo)
      } catch (e) {
        console.error(e)
      }
    },
    async getRincianSaldo({ commit, getters, rootState }) {
      try {
        const partnerId = rootState.auth.userData.partner_detail.id
        const response = await axiosKomship(partnerId).get(
          'v1/partner/order-transaction-balance',
          {
            params: {
              start_date: formatYmd(getters.selectedSaldo[0]),
              end_date: formatYmd(getters.selectedSaldo[1]),
            },
          },
        )
        commit('UPDATE_RINCIAN_SALDO', response.data.data)
      } catch (e) {
        console.error(e)
      }
    },
  },
}
