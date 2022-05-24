<template>
  <b-overlay
    variant="light"
    :show="loading"
    spinner-variant="primary"
    blur="0"
    opacity=".5"
    rounded="sm"
    class="p-2"
  >
    <div class="pb-1">
      <b-card-actions
        title="Edit Lesson"
        no-actions
        no-body
      >
        <b-row class="mt-2">
          <b-col
            md="11"
          >
            <!-- form -->
            <validation-observer ref="formRules">
              <b-form>
                <b-row>
                  <b-col md="12">
                    <b-col md="8">
                      <b-form-group
                        label="Module"
                        label-cols-md="4"
                        class="ml-2"
                      >
                        <validation-provider
                          #default="{ errors }"
                          name="Module"
                        >
                          <b-form-input
                            v-model="moduleTitle"
                            :state="errors.length > 0 ? false:null"
                            disabled
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                  </b-col>
                  <b-col md="12">
                    <b-col md="8">
                      <b-form-group
                        label="Judul"
                        label-cols-md="4"
                        class="ml-2"
                      >
                        <validation-provider
                          #default="{ errors }"
                          name="Judul"
                        >
                          <b-form-input
                            v-model="lessonTitle"
                            :state="errors.length > 0 ? false:null"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                  </b-col>
                  <b-col md="12">
                    <b-col md="8">
                      <b-form-group
                        label="Thumbanil"
                        label-cols-md="4"
                        class="ml-2"
                      >
                        <validation-provider
                          #default="{ errors }"
                          name="Thumbnail"
                        >
                          <b-form-file
                            v-model="lessonThumbnail"
                            :state="errors.length > 0 ? false:null"
                            :placeholder="imageInitialFile ?
                              imageInitialFile.split('/').pop()
                              : `Pilih atau drop file disini...`"
                            drop-placeholder="Drop file disini..."
                            accept="image/*"
                          />
                          <div v-if="lessonThumbnail !== null">
                            <small
                              v-if="lessonThumbnail.size > 1024 * 2048"
                              class="text-danger"
                            >
                              Ukuran File Tidak Bisa Lebih dari 2 MB
                            </small>
                          </div>
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                  </b-col>
                  <b-col md="12">
                    <b-col md="8">
                      <b-form-group
                        label="Deskripsi Video"
                        label-cols-md="4"
                        class="ml-2"
                      >
                        <validation-provider
                          #default="{ errors }"
                          name="Deskripsi Video"
                        >
                          <ckeditor
                            v-model="videoDescription"
                            :editor="editor"
                            :config="editorConfig"
                            :state="errors.length > 0 ? false:null"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                  </b-col>
                  <b-col md="12">
                    <b-col md="8">
                      <b-form-group
                        label="Video"
                        label-cols-md="4"
                        class="ml-2"
                      >
                        <validation-provider
                          #default="{ errors }"
                          name="Video"
                        >
                          <b-form-input
                            v-model="videoUrl"
                            :state="errors.length > 0 ? false:null"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                  </b-col>
                  <b-col md="12">
                    <b-col md="8">
                      <b-form-group
                        label="Status Lesson"
                        label-cols-md="4"
                        class="ml-2"
                      >
                        <validation-provider
                          #default="{ errors }"
                          name="Status Lesson"
                          rules="required"
                        >
                          <v-select
                            v-model="statusLesson"
                            :options="statusLessonOptions"
                            label="title"
                            :searchable="false"
                            :state="errors.length > 0 ? false:null"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                  </b-col>
                  <b-col
                    md="12"
                    class="mt-2 ml-2 mb-2"
                  >
                    <b-button
                      variant="primary"
                      type="submit"
                      class="mr-50"
                      :disabled="loadingSubmit"
                      @click="submit"
                    >
                      <b-spinner
                        v-if="loadingSubmit"
                        small
                      />
                      Lanjut
                    </b-button>
                  </b-col>
                </b-row>
              </b-form>
            </validation-observer>
          </b-col>
        </b-row>
      </b-card-actions>
    </div>
  </b-overlay>
</template>

<script>
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import {
  BFormInput,
  BFormGroup,
  BForm,
  BRow,
  BCol,
  BButton,
  BSpinner,
  BFormFile,
  BOverlay,
} from 'bootstrap-vue'
import { required, min, minValue } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import vSelect from 'vue-select'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.id'
import Vue from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

Vue.use(CKEditor)

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BFormInput,
    BFormGroup,
    BForm,
    BRow,
    BCol,
    BButton,
    BSpinner,
    BFormFile,
    BOverlay,
    BCardActions,
    vSelect,
  },
  data() {
    return {
      lessonId: this.$route.params.lesson_id,
      moduleId: null,

      loading: false,
      loadingSubmit: false,
      submitErrors: '',

      required,
      min,
      minValue,

      lessonTitle: '',
      moduleTitle: '',
      videoDescription: '',
      videoUrl: '',

      lessonThumbnail: null,
      imageInitialFile: null,

      statusKelasOptions: [
        { title: 'Private', value: 'draft' },
        { title: 'Publish', value: 'publish' },
      ],

      statusLesson: '',

      idLessonToQuiz: null,

      statusLessonOptions: [
        { title: 'Private', value: 'draft' },
        { title: 'Publish', value: 'publish' },
      ],

      editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
      },

    }
  },
  computed: {
    successText() {
      return 'Satu lesson berhasil diperbaharui'
    },
  },
  mounted() {
    this.loadForm()
    this.getId()
  },
  methods: {
    submit() {
      this.$refs.formRules.validate().then(success => {
        if (success) {
          this.submitErrors = ''
          this.loadingSubmit = true

          const formData = new FormData()
          formData.append('_method', 'put')
          formData.append('lesson_title', this.lessonTitle)
          if (this.lessonThumbnail) formData.append('lesson_thumbnail', this.lessonThumbnail)
          formData.append('lesson_video_description', this.videoDescription)
          formData.append('lesson_video_url', this.videoUrl)
          formData.append('lesson_module_id', this.moduleId)
          if (this.statusLesson.value) formData.append('lesson_status', this.statusLesson.value)

          this.$http.post(`/lms/lesson/update/${this.lessonId}`, formData)
            .then(() => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  text: this.successText,
                  variant: 'success',
                  icon: 'CheckIcon',
                },
              }, { timeout: 2500 })
              this.$router.push({ name: this.$route.meta.routeEditQuiz, params: { lesson_id: this.idLessonToQuiz, module_id: this.moduleId } })
            })
            .catch(error => {
              this.loadingSubmit = false

              if (error.response.status === 422) {
                this.submitErrors = Object.fromEntries(
                  Object.entries(error.response.data.data).map(
                    ([key, value]) => [key, value[0]],
                  ),
                )
              }
            })
        }
      })
    },
    loadForm() {
      return this.$http.get(`/lms/lesson/${this.lessonId}`).then(response => {
        const { data } = response.data
        this.lessonTitle = data.lesson_title
        this.videoDescription = data.lesson_video_description
        this.videoUrl = data.lesson_video_url
        if (data.lesson_thumbnail) this.imageInitialFile = data.lesson_thumbnail
        if (data.lesson_status === 'draft') {
          this.statusLesson = 'Private'
        } else {
          this.statusLesson = 'Publish'
        }
      })
    },
    getId() {
      return this.$http.get(`/lms/lesson/${this.lessonId}`).then(response => {
        const { data } = response.data
        this.moduleId = data.lesson_module_id
        this.idLessonToQuiz = this.lessonId
        this.loadModul()
      })
    },
    loadModul() {
      return this.$http.get(`/lms/module/${this.moduleId}`).then(response => {
        const { data } = response.data
        this.moduleTitle = `${data.module_title} - ${data.module_subtitle}`
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
