<template>
  <b-row>
    <b-col cols="12">
      <b-overlay
        variant="light"
        :show="loading"
        spinner-variant="primary"
        blur="0"
        opacity=".5"
        rounded="sm"
      >
        <div class="pb-1">
          <b-row>
            <b-col md="8">
              <b-card-actions
                ref="formCard"
                title="Quiz"
                no-actions
                no-body
              >
                <h4 class="ml-2">
                  {{ className }}
                </h4>
                <p class="ml-2">
                  {{ moduleName }} - ({{ moduleSubname }})
                </p>
                <b-table
                  ref="table"
                  striped
                  hover
                  responsive
                  class="position-relative"
                  empty-text="Tidak ada data untuk ditampilkan."

                  :fields="fields"
                  :items="tableProvider"
                  :show-empty="!loading"
                  :tbody-tr-class="rowClass"
                  :busy.sync="loading"
                >
                  <!-- A custom formatted column -->
                  <template #cell(question)="data">
                    <b-row>
                      <b-col
                        md="3"
                        class="pt-1"
                      >
                        <p>{{ data.item.question }}</p>
                      </b-col>
                      <b-col
                        md="9"
                        class="mt-50"
                      >
                        <b-dropdown
                          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                          variant="outline-secondary"
                          :text="data.item.question.length > 45 ? data.item.question.substr(0, 45)+'...' : data.item.question"
                        >
                          <b-dropdown-item
                            v-for="(dataAnswer, index) in data.item.answer"
                            :key="index + 1"
                          >
                            {{ dataAnswer.answer }}
                          </b-dropdown-item>
                        </b-dropdown>
                      </b-col>
                    </b-row>
                  </template>

                  <template #cell(aksi)="data">
                    <span
                      v-if="isDeleted(data.item.id)"
                      class="text-danger"
                    >Deleted</span>
                    <div v-else>
                      <b-button
                        variant="flat-danger"
                        class="btn-icon"
                        @click="confirmDelete(data)"
                      >
                        <feather-icon
                          icon="Trash2Icon"
                        />
                      </b-button>
                    </div>
                  </template>
                </b-table>
                <b-button
                  variant="danger"
                  pill
                  class="ml-2 mb-2"
                  tag="router-link"
                  :to="{ name: $route.meta.routeBack, params: { module_id: moduleId } }"
                >
                  Submit
                </b-button>
              </b-card-actions>
            </b-col>

            <!-- Form Create Questions -->
            <b-col
              md="4"
            >
              <b-card-actions
                ref="formCard"
                title="Add Question"
                no-actions
              >
                <validation-observer ref="formRules">
                  <b-form
                    class="mt-2"
                    @submit.prevent
                  >
                    <b-row>
                      <!-- question -->
                      <b-col cols="12">
                        <b-form-group
                          label="Question"
                        >
                          <validation-provider
                            #default="{ errors }"
                            name="Question"
                          >
                            <b-form-textarea
                              v-model="questions"
                              :state="errors.length > 0 ? false:null"
                            />
                            <small class="text-danger">{{ errors[0] }}</small>
                          </validation-provider>
                        </b-form-group>
                      </b-col>

                      <!-- Answer -->
                      <b-col
                        cols="12"
                        class="mt-1"
                      >
                        <b-form-group
                          label="Answer"
                        >
                          <b-row
                            v-for="(answers, index) in answer"
                            :key="`answers_${index}`"
                            :class="answer.length > 1 ? 'mt-1' : ''"
                          >
                            <b-col md="9">
                              <validation-provider
                                #default="{ errors }"
                                name="Answer"
                              >
                                <b-form-input
                                  v-model="answers.answer"
                                  :state="errors.length > 0 ? false:null"
                                />
                                <small class="text-danger">{{ errors[0] }}</small>
                              </validation-provider>
                            </b-col>
                            <b-col md="3">
                              <b-row>
                                <b-col
                                  md="4"
                                  class="d-flex justify-content-center align-items-center"
                                >
                                  <b-form-checkbox
                                    v-model="answers.correct_answer"
                                    class="ml-2"
                                  />
                                </b-col>
                                <b-col
                                  v-if="answer.length - 1"
                                  md="2"
                                >
                                  <b-button
                                    variant="flat-danger"
                                    class="btn-icon"
                                    @click="removeItem(index)"
                                  >
                                    <feather-icon
                                      icon="Trash2Icon"
                                    />
                                  </b-button>
                                </b-col>
                              </b-row>
                            </b-col>
                          </b-row>
                          <b-button
                            v-if="answer.length < 5"
                            class="mt-1"
                            variant="flat-success"
                            @click="addAnswer"
                          >
                            <feather-icon
                              icon="PlusIcon"
                            />
                          </b-button>
                        </b-form-group>
                      </b-col>
                      <b-col class="mt-1 ml-50">
                        <small class="text-danger">
                          Checklist satu untuk jawaban yang benar
                        </small>
                      </b-col>
                      <b-col class="text-right mt-3">
                        <b-button
                          variant="danger"
                          pill
                          :disabled="answer.filter(item => item.correct_answer).length === 0 || answer.filter(item => item.correct_answer === true).length > 1"
                          @click.prevent="submit"
                        >
                          <b-spinner
                            v-if="loadingSubmit"
                            small
                          />
                          Simpan
                        </b-button>
                      </b-col>
                    </b-row>
                  </b-form>
                </validation-observer>
              </b-card-actions>
            </b-col>
          </b-row>
        </div>
      </b-overlay>
    </b-col>
  </b-row>
</template>

<script>
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BFormInput,
  BFormGroup,
  BForm,
  BRow,
  BCol,
  BButton,
  BOverlay,
  BFormTextarea,
  BTable,
  BFormCheckbox,
  BSpinner,
  BDropdown,
  BDropdownItem,
} from 'bootstrap-vue'
import { required, min, minValue } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.id'
import Ripple from 'vue-ripple-directive'
import { heightTransition } from '@core/mixins/ui/transition'

export default {
  directives: {
    Ripple,
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    BFormInput,
    BFormGroup,
    BFormTextarea,
    BForm,
    BRow,
    BCol,
    BButton,
    BOverlay,
    BCardActions,
    BTable,
    BFormCheckbox,
    BSpinner,
    BDropdown,
    BDropdownItem,
  },
  mixins: [heightTransition],
  data() {
    return {
      loading: false,
      loadingSubmit: false,
      submitErrors: '',
      lessonId: this.$route.params.lesson_id,
      moduleId2: this.$route.params.module_id,
      classId: null,

      endpointDelete: '/lms/lesson/quiz/delete/:question_id',

      deletedIds: [],

      className: '',
      moduleName: '',
      moduleSubname: '',

      required,
      min,
      minValue,
      fields: [
        { key: 'question', label: 'Question' },
        { key: 'aksi' },
      ],

      rows: [{ row: '' }],

      dataLocal: [],

      itemQuestion: [],

      edumoLessonId: '',

      tableItem: [{}],
      newTable: null,

      questions: '',

      answer: [],
      answerItem: [],

      selected: 'yes',

      test: [{ status: false }],

      checked: [],
      moduleId: 0,

      trueAnswer: [],

    }
  },
  computed: {
    successText() {
      return `Satu ${this.$route.meta.name} berhasil ditambah`
    },
    tableFileds() {
      const fields = [...this.fields]
      return fields
    },
  },
  mounted() {
    this.loadQuiz()
  },
  methods: {
    confirmDelete(data) {
      this.$swal({
        title: 'Anda yakin?',
        text: 'Hapus satu question dari tabel. Aksi ini tidak dapat di batalkan',
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
      const endpoint = this.endpointDelete.replace(/:question_id/g, data.item.id)

      this.$http.delete(endpoint).then(() => {
        this.deletedIds.push(data.item.id)
      }).finally(() => {
        this.loading = false
      })
    },
    isDeleted(id) {
      return this.deletedIds.includes(id)
    },
    rowClass(item, type) {
      const colorClass = 'table-danger'
      if (!item || type !== 'row') { return }

      // eslint-disable-next-line consistent-return
      if (this.isDeleted(item.id)) { return colorClass }
    },
    submit() {
      const formData = new FormData()
      formData.append('type', 'module')
      formData.append('ref_id', this.edumoLessonId)
      formData.append('question', this.questions)
      formData.append('questions_type', 'text')
      formData.append('answers', this.answer)
      formData.append('answer_type', 'choices')

      const formDatas = {
        type: 'module',
        ref_id: this.edumoLessonId,
        question: this.questions,
        questions_type: 'text',
        answers: this.answer,
        answer_type: 'choices',
      }

      this.$refs.formRules.validate().then(success => {
        if (success) {
          this.submitErrors = ''
          this.loadingSubmit = true

          this.$http.post('/lms/lesson/quiz/store', formDatas)
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
              this.refreshTable()
              this.loadingSubmit = false
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
    tableProvider() {
      return this.$http.get(`/lms/lesson/quiz/${this.lessonId}`).then(response => {
        const { data } = response.data
        return data.question
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Failure',
            icon: 'AlertCircleIcon',
            text: 'Tidak ada Quiz untuk Lesson ini',
            variant: 'danger',
          },
        })
        return []
      })
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    loadQuiz() {
      this.$http.get(`/lms/lesson/${this.lessonId}`).then(response => {
        const { data } = response.data
        this.lessonId = data.lesson_id
        this.getEdumoId()
      })
    },
    getEdumoId() {
      this.$http.get(`/lms/lesson/${this.lessonId}`).then(response => {
        const { data } = response.data
        this.edumoLessonId = data.edumo_lesson_id
        this.moduleId = data.lesson_module_id
        this.getModule()
      })
    },
    getModule() {
      this.$http.get(`/lms/lesson/list/filter/${this.moduleId}`).then(response => {
        const { data } = response.data
        this.moduleName = data.module_title
        this.moduleSubname = data.module_subtitle
        this.moduleId = data.module_id
        this.getIdClass()
      })
    },
    getIdClass() {
      return this.$http.get(`/lms/module/${this.moduleId}`).then(response => {
        const { data } = response.data
        this.classId = data.module_class_id
        this.loadClass()
      })
    },
    loadClass() {
      return this.$http.get(`/lms/class/${this.classId}`).then(response => {
        const { data } = response.data
        this.className = data.class_name
      })
    },
    addAnswer() {
      this.position += 1
      this.answer.push({
        answer: '', correct_answer: this.test[0].status, position: this.position,
      })
      this.test.push({ status: true })
    },

    removeItem(index) {
      this.answer.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
