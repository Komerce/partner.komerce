<template src="./UploadDokumen.html" />
<script>
import axioskomsipdev from '@/libs/axioskomsipdev'
import {
  // BRow,
  // BCol,
  BImg,
  BCard,
  BButton,
  BSpinner,
  BProgress,
  BCardBody,
  BCardHeader,
} from 'bootstrap-vue'

export default {
  components: {
    // BRow,
    // BCol,
    BImg,
    BCard,
    BButton,
    BSpinner,
    BProgress,
    BCardBody,
    BCardHeader,
  },
  filters: {
    //
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
  computed: {
    //
  },
  watch: {
    //
  },
  mounted() {
    this.loadDataAwal = false
    /*
      Determine if drag and drop functionality is capable in the browser
    */
    this.dragAndDropCapable = this.determineDragAndDropCapable()
    /*
      If drag and drop capable, then we continue to bind events to our elements.
    */
    if (this.dragAndDropCapable) {
      /*
        Listen to all of the drag events and bind an event listener to each
        for the dropuploadarea.
      */
      ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(evt => {
        /*
          For each event add an event listener that prevents the default action
          (opening the file in the browser) and stop the propagation of the event (so
          no other elements open the file in the browser)
        */
        this.$refs.dropuploadarea.addEventListener(evt, e => {
          e.preventDefault()
          e.stopPropagation()
        }, false)
      })

      /*
        Add an event listener for drop to the form
      */
      this.$refs.dropuploadarea.addEventListener('drop', e => {
      // Capture the files from the drop event and add them to our local files
      // array.
        for (let i = 0; i < e.dataTransfer.files.length; i + 1) {
          this.filesUploaded.push(e.dataTransfer.files[i])
        }
      })
    }

    // Set the initial number of items
  },
  created() {
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
    clickUploadButton() {
      this.$refs.filebuktitransfer.click()
    },
    previewFiles(event) {
      const data = event.target.files
      this.filesSettled = data
      this.handleFiles(data)
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
      const endpointUpload = '/v1/admin/no-cod/import';
      [...files].forEach(file => {
        const formData = new FormData()
        formData.append('file', file)
        axioskomsipdev.post(
          endpointUpload,
          formData,
          {
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
          },
        )
          .then(({ data }) => {
            this.filesUploaded.push(data)
          })
          .catch(() => {
            // handle error
          })
      })
    },
    batalkanUpload() {
      this.filesSettled = []
      this.filesUploaded = []
      this.fileUploadCount = 0
      const endpointDeleteUpload = '/v1/admin/no-cod/temp/delete'
      axioskomsipdev.delete(endpointDeleteUpload)
        .then(() => {
          this.$router.go(-1)
        })
        .catch(() => {
          // handle error
        })
    },
    handleKonfirmasi() {
      const endpointSaveUpload = '/v1/admin/no-cod/save'
      axioskomsipdev.post(endpointSaveUpload)
        .then(() => {
          this.$router.go(-1)
        })
        .catch(() => {
          // handle error
        })
    },
    calculateSizeFile(size) {
      const sizesUnit = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (size === 0) return '0 Byte'
      const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)), 10)
      return `${Math.round(size / (1024 ** i), 2)} ${sizesUnit[i]}`
    },
  },
}
</script>
<style lang="scss" src="./UploadDokumen.scss" scoped />
