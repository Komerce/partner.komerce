import moment from 'moment'
import { getField, updateField } from 'vuex-map-fields'
import axiosIns from '@/libs/axios'
import {
  axiosKomship, hideAccount, today, formatYmd, last30,
} from '../helpers'

export default {
  namespaced: true,
  state: {
    saldo: 0,
    saldoPending: 0,
    rekenings: [],
    table: {
      perPage: 5,
      currentPage: 1,
      totalRows: 0,
    },
    riwayatPenarikans: [],
    dateRange: {
      startDate: last30,
      endDate: today,
    },
    nominalTopUp: '',
    selectedRekTujuan: '',
    nominal: '',
    pin: '',
  },
  getters: {
    getField,
    rekening(state) {
      const rekening = state.rekenings[0]
      if (!rekening) return {}
      return {
        ...rekening,
        noRek: hideAccount(rekening.noRek),
      }
    },
    rekenings(state) {
      return state.rekenings.map(rekening => ({
        ...rekening,
        noRek: hideAccount(rekening.noRek),
      }))
    },
    rekTujuanOptions(state) {
      return state.rekenings.map(rekening => ({
        value: rekening.id,
        text: `${rekening.bank} - ${rekening.noRek}`,
      }))
    },
    rincianPenarikan(state) {
      return {
        ...state.rincianPenarikan,
        totalSaldo: state.saldo,
        sisaSaldo: state.saldo - state.rincianPenarikan.jumlahPenarikan,
      }
    },
    nominalTopUp(state) {
      return Number(state.nominalTopUp.replace(/[^0-9,-]+/g, ''))
    },
    nominal(state) {
      return Number(state.nominal.replace(/[^0-9,-]+/g, ''))
    },
    selectedRekTujuan(state) {
      return (
        state.rekenings.find(
          rekening => rekening.id === state.selectedRekTujuan,
        ) || {}
      )
    },
  },
  mutations: {
    updateField,
    UPDATE_ِِBALANCE_SUMMARY(state, balanceSummary) {
      state.saldo = balanceSummary.balance
      state.saldoPending = balanceSummary.pending_balance
    },
    UPDATE_REKENINGS(state, bankAccounts) {
      state.rekenings = bankAccounts.map(account => ({
        id: account.bank_account_id,
        nama: account.account_name,
        bank: account.bank_name,
        noRek: account.account_no,
      }))
    },
    UPDATE_TOTAL_ROWS(state, totalRows) {
      state.table.totalRows = totalRows
    },
    UPDATE_CURRENT_PAGE(state, currentPage) {
      state.table.currentPage = currentPage
    },
    UPDATE_RIWAYAT_PENARIKAN(state, withdrawalRequest) {
      state.riwayatPenarikans = withdrawalRequest.map(request => ({
        id: request.id,
        tanggal: moment(new Date(request.created_at)).format('DD-MM-YYYY'),
        jam: moment(new Date(request.created_at)).format('HH:mm'),
        tujuan: {
          nama: request.bank_owner_name,
          bank: request.bank_name,
          noRek: request.bank_no,
        },
        status: request.status,
        jumlahPenarikan: request.nominal,
      }))
    },
    UPDATE_NOMINAL(state, nominal) {
      state.nominalTopUp = nominal
    },
  },
  actions: {
    async init({ dispatch }) {
      dispatch('getBalanceSummary')
      dispatch('getBankAccount')
      dispatch('getWithdrawalRequest')
    },
    async getBalanceSummary({ commit, rootState }) {
      try {
        const partnerId = rootState.auth.userData.partner_detail.id
        const response = await axiosKomship(partnerId).get(
          'v1/dashboard/partner/balanceSummary',
        )
        commit('UPDATE_ِِBALANCE_SUMMARY', response.data.data)
      } catch (e) {
        console.error(e)
      }
    },
    async getBankAccount({ commit }) {
      try {
        const response = await axiosKomship().get('v1/bank-account')
        commit('UPDATE_REKENINGS', response.data.data)
      } catch (e) {
        console.error(e)
      }
    },
    async getWithdrawalRequest({ commit, state }) {
      try {
        const response = await axiosIns.get('kmpoin/kmPoinWithdrawalRequest', {
          params: {
            page: state.table.currentPage,
            limit: state.table.perPage,
            start_date: formatYmd(state.dateRange.startDate),
            end_date: formatYmd(state.dateRange.endDate),
          },
        })
        commit('UPDATE_RIWAYAT_PENARIKAN', response.data.data.data)
        commit('UPDATE_TOTAL_ROWS', response.data.data.total)
      } catch (e) {
        console.error(e)
      }
    },
    topUpSaldo({ getters, rootState }) {
      return axiosIns.post('invoice/topUpKmPoin', {
        user_id: rootState.auth.userData.id,
        amount: getters.nominalTopUp,
      })
    },
    withdrawalRequest({ getters, rootState }) {
      return axiosIns.post('kmpoin/kmPoinWithdrawalRequest', {
        user_id: rootState.auth.userData.id,
        transaction_type: 'withdraw_to_me',
        nominal: getters.nominal,
        bank_name: getters.selectedRekTujuan.bank,
        bank_no: getters.selectedRekTujuan.noRek,
        bank_owner_name: getters.selectedRekTujuan.nama,
        notes: '-',
      })
    },
    checkPin({ state, rootState }) {
      const partnerId = rootState.auth.userData.partner_detail.id
      return axiosKomship(partnerId).post('v1/pin/auth', {
        pin: state.pin,
      })
    },
    async exportSaldo({ rootState, state }) {
      const response = await axiosIns.get(
        'kmpoin/kmPoinWithdrawalRequestReport/export',
        {
          responseType: 'blob',
          params: {
            user_id: rootState.auth.userData.id,
            start_date: formatYmd(state.dateRange.startDate),
            end_date: formatYmd(state.dateRange.endDate),
          },
        },
      )
      const fileName = 'Komerce_KmPoin_Withdrawal_Request.xlsx'
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(
          new Blob([response.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          fileName,
        )
      } else {
        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        )
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      }
    },
  },
}
