/* eslint-disable no-plusplus */
import axioskomsipdev from '@/libs/axioskomsipdev'
import {
  BImg,
  BCard,
  BButton,
  BSpinner,
  BProgress,
  BCardBody,
  BCardHeader,
  BModal,
} from 'bootstrap-vue'

export default {
  components: {
    BImg,
    BCard,
    BButton,
    BSpinner,
    BProgress,
    BCardBody,
    BCardHeader,
    BModal,
  },
  data() {
    return {
      loadDataAwal: true,
      filesUploaded: [],
      filesSettled: [],
      fileUploadCount: 0,
      valueProgressUpload: 0,
      maxProgressUpload: 100,
      dragAndDropCapable: false,
    }
  },
  mounted() {
    this.loadDataAwal = false
    this.dragAndDropCapable = this.determineDragAndDropCapable()

    this.$nextTick(() => {
      if (this.dragAndDropCapable) {
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(evt => {
          this.$refs.fileform.addEventListener(evt, e => {
            e.preventDefault()
            e.stopPropagation()
          }, false)
        })

        this.$refs.fileform.addEventListener('drop', e => {
          const { files } = e.dataTransfer
          for (let index = 0; index < files.length; index++) {
            if (files.length > 3) {
              this.$refs.failUploadPopup.show()
            } else if (files[index].size > 1024 * 2048) {
              this.$refs.maxUploadPopup.show()
            } else {
              this.filesSettled.push(files[index])
            }
          }
          this.handleFiles(this.filesSettled)
        })
      }
    })
  },
  methods: {
    determineDragAndDropCapable() {
      const div = document.createElement('div')
      return (('draggable' in div)
              || ('ondragstart' in div && 'ondrop' in div))
              && 'FormData' in window
              && 'FileReader' in window
    },
    uploadFile() {
      const fileInputElement = this.$refs.filebuktitransfer
      fileInputElement.click()
    },
    previewFiles(event) {
      const data = event.target.files
      for (let index = 0; index < data.length; index++) {
        if (data.length > 3) {
          this.$refs.failUploadPopup.show()
        } else if (data[index].size > 1024 * 2048) {
          this.$refs.maxUploadPopup.show()
        } else {
          this.filesSettled.push(data[index])
        }
      }
      this.handleFiles(this.filesSettled)
    },
    preventDefaults(e) {
      e.preventDefault()
      e.stopPropagation()
    },
    handleDrop(e) {
      const { files } = e.dataTransfer
      this.handleFiles(files)
    },
    handleFiles(files) {
      const endpoint = `/v1/admin/withdrawal/update/${this.$route.params.slug}?status=${this.$store.state.pencairan.status}`
      const dataCopy = [...files]
      dataCopy.forEach(file => {
        const formData = new FormData()
        formData.append('file', file)
        axioskomsipdev.put(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: progressEvent => {
            const progressPercent = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100), 10)
            this.valueProgressUpload = progressPercent
            if (progressPercent === 100) {
              this.fileUploadCount += 1
            }
          },
        })
          .then(({ data }) => {
            this.filesUploaded.push(data)
          })
          .catch(e => {
            console.log('error', e)
          })
      })
    },
    handleKonfirmasi() {
      // caling api
      // this.$http.post(url,params,{})
      // back to rincian routes
      // this.$router.go(-1)
    },
    removeFileUpload(files) {
      const index = this.filesSettled.indexOf(files)
      if (index > -1) {
        this.filesSettled.splice(index, 1)
        this.fileUploadCount -= 1
      }
    },
    calculateSizeFile(size) {
      const sizesUnit = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (size === 0) return '0 Byte'
      const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)), 10)
      return `${Math.round(size / (1024 ** i), 2)} ${sizesUnit[i]}`
    },
  },
}
