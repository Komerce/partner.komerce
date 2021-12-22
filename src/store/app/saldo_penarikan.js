import moment from 'moment'
import axiosIns from '@/libs/axios'
import { axiosKomship, formatYmd } from '../helpers'

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
  },
  getters: {
    sisaSaldo(state) {
      return state.totalSaldo - state.nominalPenarikan
    },
  },
  mutations: {
    UPDATE_ID(state, id) {
      state.id = id
    },
    UPDATE_TOTAL_SALDO(state, totalSaldo) {
      state.totalSaldo = totalSaldo
    },
    UPDATE_DETAIL_SALDO(state, detailSaldo) {
      state.dateStart = moment(
        detailSaldo.previous_request_withdrawal_date,
      ).format('DD MMMM YYYY')
      // state.dateStart = '2021-10-5'
      state.dateEnd = moment(detailSaldo.created_at).format('DD MMMM YYYY')
      state.nominalPenarikan = detailSaldo.nominal
      state.statusPenerimaan = detailSaldo.status
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
      await dispatch('getDetailSaldo')
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
    async getDetailSaldo({ commit, state }) {
      try {
        const response = await axiosIns.get(
          `kmpoin/kmPoinWithdrawalRequest/${state.id}`,
        )
        commit('UPDATE_DETAIL_SALDO', response.data.data)
      } catch (e) {
        console.error(e)
      }
    },
    async getRincianSaldo({ commit, state, rootState }) {
      try {
        const partnerId = rootState.auth.userData.partner_detail.id
        const response = await axiosKomship(partnerId).get(
          'v1/partner/order-transaction-balance',
          {
            params: {
              start_date: formatYmd(state.dateStart),
              end_date: formatYmd(state.dateEnd),
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
