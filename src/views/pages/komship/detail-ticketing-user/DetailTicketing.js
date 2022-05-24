/* eslint-disable import/no-unresolved */
import axios from 'axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {
  getMessaging,
  getToken,
  onMessage,
} from 'firebase/messaging'
import { initializeApp } from 'firebase/app'
import * as firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyCPYJYeP-9_G3S5MOV_-8QPDSmxF8dj84g',
  authDomain: 'komship-ticketing.firebaseapp.com',
  projectId: 'komship-ticketing',
  storageBucket: 'komship-ticketing.appspot.com',
  messagingSenderId: '669211426801',
  appId: '1:669211426801:web:55bca3d2dac7238b298e50',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
console.log(firebase)

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging()
console.log(messaging)

export default {
  components: {},
  data() {
    return {
      ticketId: this.$route.params.ticket_id,
      loadingDataDetail: true,

      ticketStatus: '',
      orderStatus: '',
      ticketNo: '',
      noResi: '',
      ekspedisi: '',
      seller: '',
      ticketType: '',
      customerName: '',
      description: '',
      files: [],

      // Chat
      loadingDataChat: false,
      messages: [],
      chatItem: '',
      fcmToken: '',
      fileChat: null,
      chatFileMode: false,
      imageFileChat: null,
      imageInitialFile: null,
    }
  },
  created() {
    this.receiveMessage()
  },
  mounted() {
    this.fetchDataFirebase()
    this.fetchDetailTicket()
  },
  methods: {
    fetchDetailTicket() {
      this.$http_komship.get(`v1/ticket-partner/detail/${this.ticketId}`)
        .then(response => {
          const { data } = response.data
          this.ticketStatus = data.ticket_status
          this.orderStatus = data.order_status
          this.ticketNo = data.ticket_no
          this.ticketType = data.ticket_type
          this.customerName = data.customer_name
          this.description = data.description
          this.seller = data.partner_name
          this.ekspedisi = data.shipping
          this.noResi = data.no_resi
          this.files = data.file
          this.messages = data.history_ticket
          this.loadingDataDetail = false
        })
        .catch(err => {
          console.log(err)
          this.loadingDataDetail = false
        })
    },
    storeChat() {
      this.fetchDataFirebase()
      // const formData = new FormData()
      // formData.append('message', this.chatItem)
      // formData.append('ticket_id', Number(this.ticketId))
      // const message = {
      //   token: this.fcmToken,
      // }
      // formData.append('token', this.fcmToken)
      // this.$http_komship.post('/v1/ticket-partner/store-chat', formData)
      //   .then(response => {
      //     const messageNotification = {
      //       data: {
      //         score: '850',
      //         time: '2:45',
      //       },
      //       token: this.fcmToken,
      //     }
      //     getMessaging().send(message)
      //       .then(response => {
      //         // Response is a message ID string.
      //         console.log('Successfully sent message:', response)
      //       })
      //       .catch(error => {
      //         console.log('Error sending message:', error)
      //       })
      //   }).catch(err => {
      //     console.log(err)
      //   })
    },
    statusTicketVariant(data) {
      let resultVariant = ''
      if (data === 'Belum diproses') {
        resultVariant = 'light-primary'
      } else if (data === 'Sedang diproses') {
        resultVariant = 'light-warning'
      } else if (data === 'Selesai') {
        resultVariant = 'light-success'
      } else if (data === 'Dikirim') {
        resultVariant = 'light-info'
      } else if (data === 'Dibatalkan') {
        resultVariant = 'light-secondary'
      }
      return resultVariant
    },
    orderStatusVariant(data) {
      let result = ''
      if (data === 'Diajukan') {
        result = 'light-primary'
      } else if (data === 'Dipacking') {
        result = 'light-info'
      } else if (data === 'Dikirim') {
        result = 'light-warning'
      } else if (data === 'Diterima') {
        result = 'light-success'
      } else if (data === 'Retur') {
        result = 'light-danger'
      } else if (data === 'Batal') {
        result = 'light-dark'
      }
      return result
    },
    fetchDataFirebase() {
      getToken(messaging, { vapidKey: 'BLZr38POWZ6vwjTUx4v2vlPHK-3fiI-DMPY18tAbu1dpchDiAYMyR7l2PE3WbH5hOM55X2zBR_C-5BLrpUA1-ZM' }).then(currentToken => {
        if (currentToken) {
          console.log('token', currentToken)
          this.fcmToken = currentToken
          console.log(getToken)
        } else {
          console.log('No registration token available. Request permission to generate one.')
        }
      }).catch(err => {
        console.log('An error occurred while retrieving token. ', err)
      })
    },
    putFileChat(event) {
      console.log(event)
      this.fileChat = event.target.files
      this.imageInitialFile = event.target.files[0].name
      this.chatFileMode = true
      const file = event.target.files[0]
      this.imageFileChat = URL.createObjectURL(file)
    },
    fileUrl: file => (file ? URL.createObjectURL(file) : null),
    receiveMessage() {
      try {
        onMessage(messaging, payload => {
          this.loadingDataChat = true
          console.log('Message received. ', payload)
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Message',
              icon: 'AlertCircleIcon',
              text: 'You have a message maung',
              variant: 'danger',
            },
          }, 2000)
          this.fetchDataFirebase()
          this.fetchDetailTicket()
          this.loadingDataChat = false
        })
      } catch (err) {
        console.log('err receive', err)
        this.loadingDataChat = false
      }
    },
  },
}
