<template>
  <div>
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
              v-for="(row, index) in rows"
              :key="row"
              cols="12"
              class="mt-1"
            >
              <b-form-group
                label="Answer"
              >
                <b-row>
                  <b-col md="9">
                    <validation-provider
                      #default="{ errors }"
                      name="Answer"
                    >
                      <b-form-input
                        v-model="answer"
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
                          v-model="selected"
                          class="ml-2"
                        />
                      </b-col>
                      <b-col md="2">
                        <b-button
                          variant="flat-success"
                          class="btn-icon"
                          @click="addRow"
                        >
                          <feather-icon
                            icon="PlusIcon"
                          />
                        </b-button>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-button
                    size="sm"
                    variant="danger"
                    @click="removeItem(index)"
                  >
                    X
                  </b-button>
                </b-row>
              </b-form-group>
            </b-col>
            <b-col class="text-right mt-3">
              <b-button
                variant="danger"
                pill
                @click="emitToParent"
              >
                Simpan
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </b-card-actions>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, min } from '@validations'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import {
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BButton,
  BFormCheckbox,
  BFormInput,
  BFormTextarea,
} from 'bootstrap-vue'

export default {
  components: {
    BRow,
    BCol,
    BForm,
    BFormGroup,
    BButton,
    BFormCheckbox,
    BFormInput,
    BCardActions,
    BFormTextarea,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      required,
      min,

      rows: [{ row: '' }],

      fieldQuestion: [],
    }
  },
  methods: {
    addRow() {
      this.rows.push({ row: '' })
    },
    removeItem(index) {
      this.rows.splice(index, 1)
    },
    remove() {
      this.$emit('remove')
    },
    simpan() {
      this.$emit('simpan')
    },
    emitToParent() {
      this.$emit('emitToParent')
      this.$emit('childToParent', this.fieldQuestion)
    },
  },

}
</script>

<style>

</style>
