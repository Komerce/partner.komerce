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
    /*
      Determine if drag and drop functionality is capable in the browser
    */
    this.dragAndDropCapable = this.determineDragAndDropCapable()

    this.$nextTick(() => {
      if (this.dragAndDropCapable) {
      /*
          Listen to all of the drag events and bind an event listener to each
          for the fileform.
        */
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(evt => {
        /*
            For each event add an event listener that prevents the default action
            (opening the file in the browser) and stop the propagation of the event (so
            no other elements open the file in the browser)
          */
          this.$refs.fileform.addEventListener(evt, e => {
            e.preventDefault()
            e.stopPropagation()
          }, false)
        })

        /*
          Add an event listener for drop to the form
        */
        this.$refs.fileform.addEventListener('drop', e => {
          const { files } = e.dataTransfer
          for (let index = 0; index < files.length; index++) {
            if (files.length > 3) {
              this.$refs.failUploadPopup.show()
            }
          }
          this.handleFiles(files)
        })
      }
    })
    /*
        If drag and drop capable, then we continue to bind events to our elements.
      */

    // Set the initial number of items
  },
  methods: {
    /*
      Determines if the drag and drop functionality is in the
      window
    */
    determineDragAndDropCapable() {
      /*
        Create a test element to see if certain events
        are present that let us do drag and drop.
      */
      const div = document.createElement('div')

      /*
        Check to see if the `draggable` event is in the element
        or the `ondragstart` and `ondrop` events are in the element. If
        they are, then we have what we need for dragging and dropping files.

        We also check to see if the window has `FormData` and `FileReader` objects
        present so we can do our AJAX uploading
      */
      return (('draggable' in div)
              || ('ondragstart' in div && 'ondrop' in div))
              && 'FormData' in window
              && 'FileReader' in window
    },
    uploadFile() {
      // this.$refs.filebuktitransfer.click()
      const fileInputElement = this.$refs.filebuktitransfer
      fileInputElement.click()
    },
    previewFiles(event) {
      const data = event.target.files
      this.handleFiles(data)
    },
    preventDefaults(e) {
      e.preventDefault()
      e.stopPropagation()
    },
    handleFiles(files) {
      const endpoint = `/v1/admin/withdrawal/update/${this.$route.params.slug}`
      const dataCopy = [...files]
      dataCopy.forEach(file => {
        this.filesSettled = [...this.filesSettled, file]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('withdrawal_id', this.$route.params.slug)
        formData.append('status', this.$store.state.pencairan.status)
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
            // console.log(this.file)
            this.filesUploaded.push(data)
          })
          .catch(e => {
            console.log('error', e)
          })
        // this.$http.post(
        //   'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        //   formData,
        //   {
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     },
        //     onUploadProgress: progressEvent => {
        //       const progressPercent = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100), 10)
        //       this.valueProgressUpload = progressPercent
        //       if (progressPercent === 100) {
        //         this.fileUploadCount += 1
        //       }
        //     },
        //   },
        // )
        //   .then(({ data }) => {
        //     this.filesUploaded.push(data)
        //   })
        //   .catch(err => console.log(err))
      })
    },
    handleBatalDataUpload(file) {
      const fileListArr = Array.from(this.filesSettled)
      // notes: ketika nama file sama dan ada bnyak akan ke filter(hapus) semua
      const filteredFiles = fileListArr.filter(x => (x.name !== file.name && x.lastModified !== file.lastModified))
      this.filesSettled = filteredFiles
      this.fileUploadCount = filteredFiles.length
      this.filesUploaded = filteredFiles
      // this.$nextTick(() => {
      //   console.log(this.filesSettled)
      // })
    },
    handleKonfirmasi() {
      // back to rincian routes
      this.$router.go(-1)
    },
    calculateSizeFile(size) {
      const sizesUnit = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (size === 0) return '0 Byte'
      const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)), 10)
      return `${Math.round(size / (1024 ** i), 2)} ${sizesUnit[i]}`
    },
  },
}
