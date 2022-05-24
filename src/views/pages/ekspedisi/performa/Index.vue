<template>
  <section id="cod-pendapatan">
    <div v-if="!loadDataAwal">
      <b-card no-body>
        <b-card-body>
          <h3
            class="text-24-bold"
            style="color: #222222;"
          >
            Performa Ekspedisi
          </h3>
          <div class="mb-1 d-flex justify-content-end">
            <v-select
              v-model="selected"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="option"
              style="width: 180px;"
            />
          </div>
          <!-- wrapper expedisi -->
          <div
            class="wrapper"
          >
            <div
              style="display: grid;"
            >
              <span
                class="textcustom textcustom__20 textcustom__600"
              >
                JNE
              </span>
              <div
                class="wrapper__box"
                style="display: grid;"
              >
                <span
                  class="textcustom textcustom__16 textcustom__500"
                >
                  Lama pengiriman :
                </span>
                <div
                  class="wrapper__statistic"
                >
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      4
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      COD
                    </span>
                  </div>
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      4
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      Non-COD
                    </span>
                  </div>
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      26%
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      RTS COD
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              style="display: grid;"
            >
              <span
                class="textcustom textcustom__20 textcustom__600"
              >
                JNT
              </span>
              <div
                class="wrapper__box"
                style="display: grid;"
              >
                <span
                  class="textcustom textcustom__16 textcustom__500"
                >
                  Lama pengiriman :
                </span>
                <div
                  class="wrapper__statistic"
                >
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      4
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      COD
                    </span>
                  </div>
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      4
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      Non-COD
                    </span>
                  </div>
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      26%
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      RTS COD
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              style="display: grid;"
            >
              <span
                class="textcustom textcustom__20 textcustom__600"
              >
                SiCepat
              </span>
              <div
                class="wrapper__box"
                style="display: grid;"
              >
                <span
                  class="textcustom textcustom__16 textcustom__500"
                >
                  Lama pengiriman :
                </span>
                <div
                  class="wrapper__statistic"
                >
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      4
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      COD
                    </span>
                  </div>
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      4
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      Non-COD
                    </span>
                  </div>
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      26%
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      RTS COD
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              style="display: grid;"
            >
              <span
                class="textcustom textcustom__20 textcustom__600"
              >
                Pos Indonesia
              </span>
              <div
                class="wrapper__box"
                style="display: grid;"
              >
                <span
                  class="textcustom textcustom__16 textcustom__500"
                >
                  Lama pengiriman :
                </span>
                <div
                  class="wrapper__statistic"
                >
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      4
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      COD
                    </span>
                  </div>
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      4
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      Non-COD
                    </span>
                  </div>
                  <div
                    class="text-center wrapper__statistic--detail"
                  >
                    <span
                      class="textcustom textcustom__32 textcustom__500"
                    >
                      26%
                    </span>
                    <span
                      class="textcustom textcustom__16 textcustom__600"
                    >
                      RTS COD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </div>

    <div
      v-else
      class="text-center"
    >
      <b-spinner
        variant="primary"
        label="Text Centered"
      />
    </div>
  </section>
</template>

<script>
import {
  BCard,
  BSpinner,
  BCardBody,
} from 'bootstrap-vue'
import vSelect from 'vue-select'

export default {
  components: {
    BCard,
    BSpinner,
    BCardBody,
    vSelect,
  },
  data() {
    return {
      loadDataAwal: true,
      selected: 'Januari',
      option: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    }
  },
  computed: {
    //
  },
  watch: {
    selected: {
      immediate: true,
      handler() {
        // calling api
      },
    },
  },
  mounted() {
    //
  },
  created() {
    setTimeout(() => {
      this.loadDataAwal = false
    }, 1000)
  },
  methods: {
    // calling api this.selected =
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>

<style lang="scss" scoped>
.wrapper{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem 1rem;
}
.textcustom{
  font-style: normal;
  line-height: 150%;
  letter-spacing: 0.5px;
  color: #222222;

  &__500{
    font-weight: 500;
  }
  &__600{
    font-weight: 600;
  }
  &__32{
    font-size: 32px;
  }
  &__20{
    font-size: 20px;
  }
  &__16{
    font-size: 16px;
  }
}
.wrapper__box{
  background: #F1F2F6;
  border-radius: 12px;
  padding: 1rem;
}
.wrapper__statistic{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
}
.wrapper__statistic--detail{
  width: 95px;
  height: 112px;
  background: #FFFFFF;
  border: 1px solid #C2C2C2;
  border-radius: 12px;
  display: grid;
}

@media screen and (max-width: 900px) {
  .wrapper{
    grid-template-columns: 1fr;
  }
  .wrapper__statistic{
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 1rem;
    justify-items: center;
  }
}
@media screen and (max-width: 500px) {
  .wrapper__statistic{
    grid-template-columns: 1fr;
    grid-row-gap: 1rem;
    justify-items: center;
  }
}
</style>
