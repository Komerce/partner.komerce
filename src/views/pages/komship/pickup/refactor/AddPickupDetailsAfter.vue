<template>
  <b-card>
    <b-row class="justify-content-end">
      <h4 class="mr-3">
        <strong>
          Detail orderan pickup
        </strong>
      </h4>
    </b-row>
    <b-row class="justify-content-end mr-3 mt-2 mb-5">
      <b-button
        :variant="disableButtonPrint === true ? 'dark' : 'primary'"
        :disabled="disableButtonPrint"
        :style="disableButtonPrint === true ? 'cursor: no-drop' : ''"
        @click="onShowModalPrint"
      >
        Print Label
      </b-button>
    </b-row>

    <b-overlay
      variant="light"
      :show="loading"
      spinner-variant="primary"
      blur="0"
      opacity=".5"
      rounded="sm"
    >
      <b-table
        ref="tableOrder"
        hover
        responsive
        class="position-relative"
        empty-text="Tidak ada data untuk ditampilkan."
        :fields="fields"
        :items="items"
      >
        <template #head(date_order)="data">
          <b-row class="align-items-center">
            <b-form-checkbox
              v-model="allSelectItemPrint"
              class="custom-control-primary"
              @change="getAllItemPrint"
            />
            <span>{{ data.label }}</span>
          </b-row>
        </template>
        <template #cell(date_order)="data">
          <b-row>
            <div>
              <b-form-checkbox
                v-model="data.item.printIsActive"
                class="custom-control-primary"
                @change="getItemPrint(data)"
              />
            </div>
            <div>
              <h5 class="text-black">
                <strong>
                  {{ convertDate(data.item.order_date) }}
                </strong>
              </h5>
              <p>
                {{ convertTime(data.item.order_date) }}
              </p>
              <p>
                {{ data.item.shipping }}
              </p>
            </div>
          </b-row>
        </template>
        <template #cell(pelanggan)="data">
          <h5 class="text-black text-top">
            <strong>
              {{ data.item.customer_name }}
            </strong>
          </h5>
        </template>
        <template #cell(product)="data">
          <div
            v-for="(itemsProduct, index) in data.item.product"
            :key="index+1"
          >
            <b-row>
              <b-container
                fluid
                class="d-flex"
              >
                <div>
                  <b-avatar
                    variant="light-primary"
                    square
                    size="50px"
                    :src="itemsProduct.product_image"
                  />
                </div>
                <div class="ml-1">
                  <p class="text-black">
                    <strong>
                      {{ itemsProduct.product_name }}
                    </strong>
                  </p>
                  <div v-if="itemsProduct.variant_name !== '' && itemsProduct.variant_name !== '0'">
                    <p class="text-primary">
                      <strong>
                        {{ itemsProduct.variant_name }}
                      </strong>
                    </p>
                  </div>
                  <div v-else>
                    <p class="text-primary">
                      Tidak ada variasi
                    </p>
                  </div>
                </div>
              </b-container>
            </b-row>
          </div>
        </template>
        <template #cell(address)="data">
          <h5 class="text-black">
            <strong>
              {{ data.item.customer_detail_address }}
            </strong>
          </h5>
          <p>
            {{ data.item.detail_address }}
          </p>
        </template>
        <template #cell(resi)="data">
          <b-row class="align-items-center">
            <span class="text-black">
              {{ data.item.airway_bill }}
            </span>
          </b-row>
        </template>
      </b-table>
    </b-overlay>

    <pickup-label-print
      ref="printLabelContent"
      :print-option="printOption"
      :profile="{profile}"
      :list-order="selectedOrder"
      @onAfterPrintLabel="handleAfterPrintLabel"
    />

    <vue-html2pdf
      ref="html2Pdf"
      :enable-download="false"
      :show-layout="false"
      :float-layout="true"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      filename="hee hee"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"

      pdf-content-width="100%"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
    >
      <section slot="pdf-content">
        <div v-if="valuesOption === 1">
          <div
            v-for="(itemsPrint, index) in fieldItemsPrint"
            :key="index+1"
          >
            <div
              class="container"
            >
              <div
                class="border-4 border-slate-900 px-50 mb-50"
              >

                <b-row>
                  <b-col
                    cols="4"
                    class="align-self-center text-center"
                  >
                    <h4 class="text-black mt-50">
                      <strong>
                        ORDER ID
                      </strong>
                    </h4>
                    <p class="text-black">
                      <strong>
                        {{ itemsPrint.order_no }}
                      </strong>
                    </p>
                  </b-col>
                  <b-col
                    cols="4"
                    class="d-flex align-items-center justify-content-center"
                  >
                    <b-img
                      src="@/assets/images/expedisi/logo-jne.png"
                      alt="ekspedisi"
                      style="max-width: 50%;"
                    />
                  </b-col>
                  <b-col
                    cols="4"
                    class="d-flex justify-content-center align-items-center"
                  >
                    <b-img
                      src="@/assets/images/logo.png"
                      alt=""
                      class="mt-2"
                      style="max-width: 60%;"
                    />
                  </b-col>
                </b-row>

                <b-row>
                  <b-col class="border-4 border-slate-900 ml-1 mr-50">
                    <h4 class="text-center text-black">
                      <strong>
                        PENGIRIM
                      </strong>
                    </h4>
                    <b-list-group>
                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="UserIcon"
                            size="16"
                          />
                        </span>
                        <span class="text-black">{{ profile.partner_business_name }}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="PhoneIcon"
                            size="17"
                          />
                        </span>
                        <span class="text-black">{{ profile.user_phone }}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="MapPinIcon"
                            size="16"
                          />
                        </span>
                        <span class="text-black">{{ idOrderFromHistory.district }}</span>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                  <b-col class="border-4 border-slate-900 mr-1">
                    <h4 class="text-center text-black">
                      <strong>
                        PENERIMA
                      </strong>
                    </h4>
                    <b-list-group>
                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="UserIcon"
                            size="16"
                          />
                        </span>
                        <span class="text-black">{{ itemsPrint.customer_name }}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="PhoneIcon"
                            size="17"
                          />
                        </span>
                        <span class="text-black">{{ getCustomerPhone(itemsPrint.customer_phone) }}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="MapPinIcon"
                            size="16"
                          />
                        </span>
                        <span class="text-black">{{ `${itemsPrint.detail_address}, ${itemsPrint.customer_detail_address}` }}</span>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                </b-row>

                <b-row class="mt-50 mx-50">
                  <b-col
                    cols="4"
                    class="d-flex justify-content-center align-items-center border-4 border-slate-900"
                  >
                    <div>
                      <b-row>
                        <h4 class="text-black">
                          <strong>
                            {{ itemsPrint.payment_method }}
                          </strong>
                        </h4>
                      </b-row>
                      <b-row v-if="itemsPrint.payment_method === 'COD'">
                        <h5 class="text-black">
                          <strong>
                            Rp. {{ formatPrice(itemsPrint.grand_total) }}
                          </strong>
                        </h5>
                      </b-row>
                    </div>
                  </b-col>
                  <b-col
                    cols="8"
                    class="border-4 border-slate-900"
                  >
                    <b-row class="d-flex justify-content-center">
                      <h4 class="text-black">
                        <strong>
                          Nomor Resi
                        </strong>
                      </h4>
                    </b-row>
                    <b-row class="d-flex justify-content-center">
                      <barcode
                        :value="itemsPrint.airway_bill"
                        height="33"
                      >
                        Show this if the rendering fails.
                      </barcode>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="mt-50 mx-50">
                  <b-col
                    cols="4"
                    class="border-4 border-slate-900"
                  >
                    <b-row v-if="itemsPrint.product.length === 1">
                      <h4 class="text-black">
                        <strong>
                          Kuantitas:
                        </strong>
                      </h4>
                      <div
                        v-for="(dataProduct, indexProduct) in itemsPrint.product"
                        :key="indexProduct+1"
                      >
                        <span class="ml-1 text-black">
                          {{ dataProduct.qty }}
                        </span>
                      </div>
                    </b-row>
                    <b-row v-else>
                      Kuantitas: <span class="text-black ml-50">{{ itemsPrint.qtyTotal }}</span>
                    </b-row>
                  </b-col>
                  <b-col
                    cols="8"
                    class="border-4 border-slate-900 d-flex"
                  >
                    <h4 class="text-black">
                      <strong>
                        ISI PAKET:
                      </strong>
                    </h4>
                    <b-list-group
                      v-for="(dataProduct, indexProduct) in itemsPrint.product"
                      :key="indexProduct+1"
                      class="ml-1"
                    >
                      <div v-if="dataProduct.variant_name !== '0' && dataProduct.variant_name !== ''">
                        <b-list-group-item class="border-0 px-0 pt-0 pb-50">
                          <span class="ml-1 text-black">
                            {{ dataProduct.product_name }},
                          </span>
                        </b-list-group-item>
                      </div>
                      <div v-else>
                        {{ dataProduct.product_name }} <span class="ml-1 text-black">{{ dataProduct.qty+'X' }}</span>
                      </div>
                    </b-list-group>
                  </b-col>
                </b-row>

              </div>
              <div class="html2pdf__page-break" />
            </div>
          </div>
        </div>

        <div v-if="valuesOption === 2">
          <div
            v-for="(itemsPrint, index) in fieldItemsPrint"
            :key="index+1"
          >
            <div
              class="border-4 border-slate-900 px-50 mb-50"
              style="height: 555px;"
            >

              <b-row>
                <b-col
                  cols="4"
                  class="align-self-center text-center"
                >
                  <h4 class="text-black mt-50">
                    <strong>
                      ORDER ID
                    </strong>
                  </h4>
                  <p class="text-black">
                    <strong>
                      {{ itemsPrint.order_no }}
                    </strong>
                  </p>
                </b-col>
                <b-col
                  cols="4"
                  class="d-flex align-items-center justify-content-center"
                >
                  <b-img
                    src="@/assets/images/expedisi/logo-jne.png"
                    alt="ekspedisi"
                    style="max-width: 50%;"
                  />
                </b-col>
                <b-col
                  cols="4"
                  class="d-flex justify-content-center align-items-center"
                >
                  <b-img
                    src="@/assets/images/logo.png"
                    alt=""
                    class="mt-2"
                    style="max-width: 60%;"
                  />
                </b-col>
              </b-row>

              <b-row>
                <b-col class="border-4 border-slate-900 ml-1 mr-50">
                  <h4 class="text-center text-black">
                    <strong>
                      PENGIRIM
                    </strong>
                  </h4>
                  <b-list-group>
                    <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                      <span class="mr-1 text-black">
                        <feather-icon
                          icon="UserIcon"
                          size="16"
                        />
                      </span>
                      <span class="text-black">{{ profile.partner_business_name }}</span>
                    </b-list-group-item>

                    <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                      <span class="mr-1 text-black">
                        <feather-icon
                          icon="PhoneIcon"
                          size="17"
                        />
                      </span>
                      <span class="text-black">{{ profile.user_phone }}</span>
                    </b-list-group-item>

                    <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                      <span class="mr-1 text-black">
                        <feather-icon
                          icon="MapPinIcon"
                          size="16"
                        />
                      </span>
                      <span class="text-black">{{ idOrderFromHistory.district }}</span>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
                <b-col class="border-4 border-slate-900 mr-1">
                  <h4 class="text-center text-black">
                    <strong>
                      PENERIMA
                    </strong>
                  </h4>
                  <b-list-group>
                    <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                      <span class="mr-1 text-black">
                        <feather-icon
                          icon="UserIcon"
                          size="16"
                        />
                      </span>
                      <span class="text-black">{{ itemsPrint.customer_name }}</span>
                    </b-list-group-item>

                    <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                      <span class="mr-1 text-black">
                        <feather-icon
                          icon="PhoneIcon"
                          size="17"
                        />
                      </span>
                      <span class="text-black">{{ itemsPrint.customer_phone }}</span>
                    </b-list-group-item>

                    <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                      <span class="mr-1 text-black">
                        <feather-icon
                          icon="MapPinIcon"
                          size="16"
                        />
                      </span>
                      <span class="text-black">{{ `${itemsPrint.detail_address}, ${itemsPrint.customer_detail_address}` }}</span>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>

              <b-row class="mt-50 mx-50">
                <b-col
                  cols="4"
                  class="d-flex justify-content-center align-items-center border-4 border-slate-900"
                >
                  <div>
                    <b-row>
                      <h4 class="text-black">
                        <strong>
                          {{ itemsPrint.payment_method }}
                        </strong>
                      </h4>
                    </b-row>
                    <b-row v-if="itemsPrint.payment_method === 'COD'">
                      <h5 class="text-black">
                        <strong>
                          Rp. {{ formatPrice(itemsPrint.grand_total) }}
                        </strong>
                      </h5>
                    </b-row>
                  </div>
                </b-col>
                <b-col
                  cols="8"
                  class="border-4 border-slate-900"
                >
                  <b-row class="d-flex justify-content-center">
                    <h4 class="text-black">
                      <strong>
                        Nomor Resi
                      </strong>
                    </h4>
                  </b-row>
                  <b-row class="d-flex justify-content-center">
                    <barcode
                      :value="itemsPrint.airway_bill"
                      height="33"
                    >
                      Show this if the rendering fails.
                    </barcode>
                  </b-row>
                </b-col>
              </b-row>

              <b-row class="mt-50 mx-50">
                <b-col
                  cols="4"
                  class="border-4 border-slate-900"
                >
                  <b-row v-if="itemsPrint.product.length === 1">
                    <h4 class="text-black">
                      <strong>
                        Kuantitas:
                      </strong>
                    </h4>
                    <div
                      v-for="(dataProduct, indexProduct) in itemsPrint.product"
                      :key="indexProduct+1"
                    >
                      <span class="ml-1 text-black">
                        {{ dataProduct.qty }}
                      </span>
                    </div>
                  </b-row>
                  <b-row v-else>
                    Kuantitas: <span class="text-black ml-50">{{ itemsPrint.qtyTotal }}</span>
                  </b-row>
                </b-col>
                <b-col
                  cols="8"
                  class="border-4 border-slate-900 d-flex"
                >
                  <h4 class="text-black">
                    <strong>
                      ISI PAKET:
                    </strong>
                  </h4>
                  <b-list-group
                    v-for="(dataProduct, indexProduct) in itemsPrint.product"
                    :key="indexProduct+1"
                    class="ml-1"
                  >
                    <div v-if="dataProduct.variant_name !== '0' && dataProduct.variant_name !== ''">
                      <b-list-group-item class="border-0 px-0 pt-0 pb-50">
                        <span class="ml-1 text-black">
                          {{ dataProduct.product_name }},
                        </span>
                      </b-list-group-item>
                    </div>
                    <div v-else>
                      {{ dataProduct.product_name }} <span class="ml-1 text-black">{{ dataProduct.qty+'X' }}</span>
                    </div>
                  </b-list-group>
                </b-col>
              </b-row>

            </div>
            <!-- <div
              v-if="index % 2 !== 0"
              class="html2pdf__page-break"
            /> -->
          </div>
        </div>

        <div v-if="valuesOption === 4">
          <div
            class="grid grid-cols-2"
          >
            <div
              v-for="(itemsPrint, index) in fieldItemsPrint"
              :key="index+1"
            >
              <div
                class="border-4 border-slate-900 px-50 mb-50"
              >
                <b-row>
                  <b-col
                    cols="4"
                    class="align-self-center text-center"
                  >
                    <span
                      class="text-black mt-50"
                      style="font-size: 10px"
                    >
                      <strong>
                        ORDER ID
                      </strong>
                    </span>
                    <p
                      class="text-black"
                      style="font-size: 10px"
                    >
                      <strong>
                        {{ itemsPrint.order_no }}
                      </strong>
                    </p>
                  </b-col>
                  <b-col
                    cols="4"
                    class="d-flex align-items-center justify-content-center"
                  >
                    <b-img
                      src="@/assets/images/expedisi/logo-jne.png"
                      alt="ekspedisi"
                      style="max-width: 50%;"
                    />
                  </b-col>
                  <b-col
                    cols="4"
                    class="d-flex justify-content-center align-items-center"
                  >
                    <b-img
                      src="@/assets/images/logo.png"
                      alt=""
                      class="mt-50"
                      style="max-width: 70%;"
                    />
                  </b-col>
                </b-row>

                <b-row>
                  <b-col class="border-4 border-slate-900 ml-1 mr-50">
                    <span
                      class="text-center text-black"
                      style="font-size: 12px;"
                    >
                      <strong>
                        PENGIRIM
                      </strong>
                    </span>
                    <b-list-group class="mt-1">
                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="UserIcon"
                            size="14"
                          />
                        </span>
                        <span
                          class="text-black"
                          style="font-size: 10px;"
                        >
                          {{ profile.partner_business_name }}
                        </span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="PhoneIcon"
                            size="15"
                          />
                        </span>
                        <span
                          class="text-black"
                          style="font-size: 10px;"
                        >
                          {{ profile.user_phone }}
                        </span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="MapPinIcon"
                            size="14"
                          />
                        </span>
                        <span
                          class="text-black"
                          style="font-size: 10px;"
                        >
                          {{ idOrderFromHistory.district }}
                        </span>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                  <b-col class="border-4 border-slate-900 mr-1">
                    <span
                      class="text-center text-black"
                      style="font-size: 10px;"
                    >
                      <strong>
                        PENERIMA
                      </strong>
                    </span>
                    <b-list-group class="mt-1">
                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="UserIcon"
                            size="14"
                          />
                        </span>
                        <span
                          class="text-black"
                          style="font-size: 10px;"
                        >
                          {{ itemsPrint.customer_name }}
                        </span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="PhoneIcon"
                            size="15"
                          />
                        </span>
                        <span
                          class="text-black"
                          style="font-size: 10px;"
                        >
                          {{ itemsPrint.customer_phone }}
                        </span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="MapPinIcon"
                            size="14"
                          />
                        </span>
                        <span
                          class="text-black"
                          style="font-size: 10px;"
                        >
                          {{ `${itemsPrint.detail_address}, ${itemsPrint.customer_detail_address}` }}
                        </span>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                </b-row>

                <b-row class="mt-50 mx-50">
                  <b-col
                    cols="4"
                    class="d-flex justify-content-center align-items-center border-4 border-slate-900"
                  >
                    <div>
                      <b-row class="d-flex justify-content-center align-items-center">
                        <span
                          class="text-black"
                          style="font-size: 12px;"
                        >
                          <strong>
                            {{ itemsPrint.payment_method }}
                          </strong>
                        </span>
                      </b-row>
                      <b-row
                        v-if="itemsPrint.payment_method === 'COD'"
                        class="d-flex justify-content-center align-items-center"
                      >
                        <span
                          class="text-black"
                          style="font-size: 10px;"
                        >
                          <strong>
                            Rp. {{ formatPrice(itemsPrint.grand_total) }}
                          </strong>
                        </span>
                      </b-row>
                    </div>
                  </b-col>
                  <b-col
                    cols="8"
                    class="border-4 border-slate-900 border-left-0"
                  >
                    <b-row class="d-flex justify-content-center mb-50">
                      <span
                        class="text-black"
                        style="font-size: 10px;"
                      >
                        <strong>
                          Nomor Resi
                        </strong>
                      </span>
                    </b-row>
                    <b-row class="d-flex justify-content-center">
                      <barcode
                        :value="itemsPrint.airway_bill"
                        height="25"
                        width="1"
                      >
                        Show this if the rendering fails.
                      </barcode>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="mt-50 mx-50 pb-50">
                  <b-col
                    cols="4"
                    class="border-4 border-slate-900"
                  >
                    <b-row
                      v-if="itemsPrint.product.length === 1"
                      class="align-items-center"
                    >
                      <span
                        class="text-black"
                        style="font-size: 12px;"
                      >
                        <strong>
                          Kuantitas:
                        </strong>
                      </span>
                      <div
                        v-for="(dataProduct, indexProduct) in itemsPrint.product"
                        :key="indexProduct+1"
                      >
                        <span
                          class="ml-1 text-black"
                          style="font-size: 10px;"
                        >
                          {{ dataProduct.qty }}
                          tes
                        </span>
                      </div>
                    </b-row>
                    <b-row v-else>
                      <span
                        class="text-black"
                        style="font-size: 12px;"
                      >
                        <strong>
                          Kuantitas:
                        </strong>
                      </span>
                      <span
                        class="text-black ml-50"
                        style="font-size: 10px;"
                      >
                        {{ itemsPrint.qtyTotal }}
                      </span>
                    </b-row>
                  </b-col>
                  <b-col
                    cols="8"
                    class="border-4 border-slate-900 d-flex border-left-0 align-items-start"
                  >
                    <span
                      class="text-black"
                      style="font-size: 12px;"
                    >
                      <strong>
                        ISI PAKET:
                      </strong>
                    </span>
                    <div>
                      <b-list-group
                        v-for="(dataProduct, indexProduct) in itemsPrint.product"
                        :key="indexProduct+1"
                        class="ml-1"
                      >
                        <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                          <div v-if="dataProduct.variant_name !== '0' && dataProduct.variant_name !== ''">
                            <span class="ml-1 text-black">
                              {{ dataProduct.product_name }},
                            </span>
                          </div>
                          <div v-else>
                            <span
                              class="ml-1 text-black mr-50"
                              style="font-size: 10px"
                            >
                              {{ dataProduct.qty }}
                            </span>
                            <span
                              class="text-black"
                              style="font-size: 10px;"
                            >
                              {{ `${ dataProduct.product_name } ${ dataProduct.variant_name }` }},
                            </span>
                          </div>
                        </b-list-group-item>
                      </b-list-group>
                    </div>
                  </b-col>
                </b-row>

              </div>
              <div
                v-if="index === 3 || index === 7 || index === 11 || index === 15 || index === 19 || index === 23 || index === 27 || index === 31 || index === 35 || index === 39 || index === 43 || index === 47 || index === 51 || index === 55 || index === 59 || index === 63 || index === 67 || index === 71 || index === 75 || index === 79 || index === 83 || index === 87 || index === 91 || index === 95 || index === 99"
                class="html2pdf__page-break"
              />
            </div>
          </div>
        </div>

        <div v-if="valuesOption === 100 || valuesOption === 150">
          <div
            v-for="(itemsPrint, index) in fieldItemsPrint"
            :key="index+1"
          >
            <div
              class="container"
            >
              <div
                class="border-4 border-slate-900 px-50 mb-50"
              >

                <b-row>
                  <b-col
                    cols="4"
                    class="align-self-center text-center"
                  >
                    <h4 class="text-black mt-50">
                      <strong>
                        ORDER ID
                      </strong>
                    </h4>
                    <p class="text-black">
                      <strong>
                        {{ itemsPrint.order_no }}
                      </strong>
                    </p>
                  </b-col>
                  <b-col
                    cols="4"
                    class="d-flex align-items-center justify-content-center"
                  >
                    <b-img
                      src="@/assets/images/expedisi/logo-jne.png"
                      alt="ekspedisi"
                      style="max-width: 50%;"
                    />
                  </b-col>
                  <b-col
                    cols="4"
                    class="d-flex justify-content-center align-items-center"
                  >
                    <b-img
                      src="@/assets/images/logo.png"
                      alt=""
                      class="mt-2"
                      style="max-width: 60%;"
                    />
                  </b-col>
                </b-row>

                <b-row>
                  <b-col class="border-4 border-slate-900 ml-1 mr-50">
                    <h4 class="text-center text-black">
                      <strong>
                        PENGIRIM
                      </strong>
                    </h4>
                    <b-list-group>
                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="UserIcon"
                            size="16"
                          />
                        </span>
                        <span class="text-black">{{ profile.partner_business_name }}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="PhoneIcon"
                            size="17"
                          />
                        </span>
                        <span class="text-black">{{ profile.user_phone }}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="MapPinIcon"
                            size="16"
                          />
                        </span>
                        <span class="text-black">{{ idOrderFromHistory.district }}</span>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                  <b-col class="border-4 border-slate-900 mr-1">
                    <h4 class="text-center text-black">
                      <strong>
                        PENERIMA
                      </strong>
                    </h4>
                    <b-list-group>
                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="UserIcon"
                            size="16"
                          />
                        </span>
                        <span class="text-black">{{ itemsPrint.customer_name }}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="PhoneIcon"
                            size="17"
                          />
                        </span>
                        <span class="text-black">{{ itemsPrint.customer_phone }}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="MapPinIcon"
                            size="16"
                          />
                        </span>
                        <span class="text-black">{{ `${itemsPrint.detail_address}, ${itemsPrint.customer_detail_address}` }}</span>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                </b-row>

                <b-row class="mt-50 mx-50">
                  <b-col
                    cols="4"
                    class="d-flex justify-content-center align-items-center border-4 border-slate-900"
                  >
                    <div>
                      <b-row>
                        <h4 class="text-black">
                          <strong>
                            {{ itemsPrint.payment_method }}
                          </strong>
                        </h4>
                      </b-row>
                      <b-row v-if="itemsPrint.payment_method === 'COD'">
                        <h5 class="text-black">
                          <strong>
                            Rp. {{ formatPrice(itemsPrint.grand_total) }}
                          </strong>
                        </h5>
                      </b-row>
                    </div>
                  </b-col>
                  <b-col
                    cols="8"
                    class="border-4 border-slate-900"
                  >
                    <b-row class="d-flex justify-content-center">
                      <h4 class="text-black">
                        <strong>
                          Nomor Resi
                        </strong>
                      </h4>
                    </b-row>
                    <b-row class="d-flex justify-content-center">
                      <barcode
                        :value="itemsPrint.airway_bill"
                        height="33"
                      >
                        Show this if the rendering fails.
                      </barcode>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="mt-50 mx-50">
                  <b-col
                    cols="4"
                    class="border-4 border-slate-900"
                  >
                    <b-row v-if="itemsPrint.product.length === 1">
                      <h4 class="text-black">
                        <strong>
                          Kuantitas:
                        </strong>
                      </h4>
                      <div
                        v-for="(dataProduct, indexProduct) in itemsPrint.product"
                        :key="indexProduct+1"
                      >
                        <span class="ml-1 text-black">
                          {{ dataProduct.qty }}
                        </span>
                      </div>
                    </b-row>
                    <b-row v-else>
                      Kuantitas: <span class="text-black ml-50">{{ itemsPrint.qtyTotal }}</span>
                    </b-row>
                  </b-col>
                  <b-col
                    cols="8"
                    class="border-4 border-slate-900 d-flex"
                  >
                    <h4 class="text-black">
                      <strong>
                        ISI PAKET:
                      </strong>
                    </h4>
                    <b-list-group
                      v-for="(dataProduct, indexProduct) in itemsPrint.product"
                      :key="indexProduct+1"
                      class="ml-1"
                    >
                      <div v-if="dataProduct.variant_name !== '0' && dataProduct.variant_name !== ''">
                        <b-list-group-item class="border-0 px-0 pt-0 pb-50">
                          <span class="ml-1 text-black">
                            {{ dataProduct.product_name }},
                          </span>
                        </b-list-group-item>
                      </div>
                      <div v-else>
                        {{ dataProduct.product_name }} <span class="ml-1 text-black">{{ dataProduct.qty+'X' }}</span>
                      </div>
                    </b-list-group>
                  </b-col>
                </b-row>

              </div>
            </div>
          </div>
        </div>

      </section>
    </vue-html2pdf>
    <AddPickupPopupPrint
      :selected-option="printOption"
      @onSubmitOption="onSubmitOptionPrint"
      @onChangeOption="handleChangeOption"
    />

    <!-- Modal validate print label -->
    <b-modal
      ref="modal-validate-print-label"
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success">
        <div class="image-wrapper">
          <img src="@/@core/assets/image/icon-popup-warning.png">
        </div>
        <div class="text-wrapper mb-3 px-1">
          Silahkan lengkapi detail profil Kamu terlebih dahulu sebelum melakukan print label
        </div>
        <b-button
          class="org-button"
          tag="router-link"
          :to="{ name: $route.meta.routeToProfile }"
        >
          Lengkapi Profil
        </b-button>
      </div>
    </b-modal>

  </b-card>
</template>

<script>
import {
  BCard,
  BRow,
  BTable,
  BContainer,
  BAvatar,
  BButton,
  BImg,
  BListGroup,
  BListGroupItem,
  BOverlay,
  BCol,
  BFormCheckbox,
} from 'bootstrap-vue'
import VueHtml2pdf from 'vue-html2pdf'
import VueBarcode from 'vue-barcode'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import { dateFormat } from '@core/mixins/ui/date'
import AddPickupPopupPrint from '../AddPickupPopupPrint.vue'
import PickupLabelPrint from '../PickupLabelPrint.vue'

export default {
  components: {
    BCard,
    BRow,
    BTable,
    BContainer,
    BAvatar,
    BButton,
    VueHtml2pdf,
    barcode: VueBarcode,
    AddPickupPopupPrint,
    PickupLabelPrint,
    // BImg,
    BListGroup,
    BListGroupItem,
    BOverlay,
    // BCol,
    BFormCheckbox,
  },
  mixins: [dateFormat],
  data() {
    return {
      loading: false,
      selectedOrder: this.$route.params.selected_order,

      items: [],
      fields: [
        {
          key: 'date_order',
          label: 'Tanggal Order',
          thClass: 'bg-white border-top-0 border-bottom-0 text-black',
          tdClass: 'border-bottom-0 align-top',
          formatter: value => this.dateFormat(value, 'dd mmm yyyy'),
        },
        {
          key: 'pelanggan',
          label: 'Pelanggan',
          thClass: 'bg-white border-top-0 border-bottom-0 text-black',
          tdClass: 'border-bottom-0 align-top',
        },
        {
          key: 'product',
          label: 'Produk',
          thClass: 'bg-white border-top-0 border-bottom-0 text-black',
          tdClass: 'border-bottom-0 align-top',
        },
        {
          key: 'address',
          label: 'Alamat',
          thClass: 'bg-white border-top-0 border-bottom-0 text-black',
          tdClass: 'border-bottom-0 align-top',
        },
        {
          key: 'resi',
          label: 'resi',
          thClass: 'bg-white border-top-0 border-bottom-0 text-black',
          tdClass: 'border-bottom-0 align-top',
          formatter(value) {
            return value === null ? '-' : value
          },
        },
      ],

      profile: [],
      printOption: 1,

      valuePrint: [],

      idOrderFromHistory: this.$route.params.selected_order_from_history,
      idOrder: [],

      selectItemPrint: false,
      allSelectItemPrint: false,

      fieldItemsPrint: [],
      disableButtonPrint: true,
      qtyLabel: [],
      countQty: 0,
      valuesOption: 1,
    }
  },
  mounted() {
    this.items = this.selectedOrder
    console.log('selectedOrder', this.selectedOrder)
    console.log('idOrderFromHistory', this.idOrderFromHistory)
    console.log(this.items)
    this.getProfile()
  },
  methods: {
    getOrder() {
      this.idOrderFromHistory.data_order.map(items => this.idOrder.push(items.id))
      this.$http_komship.get(`/v1/order/${this.profile.partner_id}`, {
        params: {
          order_id: this.idOrder.toString(),
        },
      }).then(response => {
        const { data } = response.data.data
        this.items = data
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.items.length; x++) {
          Object.assign(this.items[x], { printIsActive: false })
        }
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.idOrderFromHistory.data_order.length; x++) {
          // eslint-disable-next-line no-plusplus
          for (let y = 0; y < this.items.length; y++) {
            if (this.idOrderFromHistory.data_order[x].id === this.items[y].order_id) {
              Object.assign(this.items[y], { customer_phone: this.idOrderFromHistory.data_order[x].customer_phone })
              Object.assign(this.items[y], { customer_detail_address: this.idOrderFromHistory.data_order[x].address_with_destination })
            }
          }
        }
        console.log('itemsOrder', this.items)
        this.loading = false
        return this.items
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal meload data, silahkan coba lagi!',
            variant: 'danger',
          },
        })
        this.loading = false
      })
    },
    onShowModalPrint() {
      if (this.profile.user_phone === '' || this.profile.user_fullname === '') {
        this.$refs['modal-validate-print-label'].show()
      } else {
        console.log('fieldItemsPrint', this.fieldItemsPrint)
        this.$bvModal.show('modal-8')
      }
      // this.$refs.addPickupPopUpPrint.showModal()
      // this.$refs.html2Pdf.generatePdf()
    },
    onUpdateScreenViewParent() {
      this.$emit('onBackButtonClicked')
    },
    handleChangeOption(values) {
      if (values) {
        this.printOption = values
        this.$refs.printLabelContent.changePrintOption(this.printOption)
      }
    },
    onSubmitOptionPrint(values) {
      console.log('opttion print view', values)
      this.valuesOption = values
      this.$refs.html2Pdf.generatePdf()
    },
    onSubmitPrint(values) {
      // if (values) this.$refs.printLabelContent.printContent()

      this.$refs.html2Pdf.generatePdf()
    },
    handleAfterPrintLabel() {
      if (this.profile.is_onboarding) {
        this.$emit('onBoardingShow')
      } else {
        this.$router.push('history-pickup')
      }
    },
    getProfile() {
      this.loading = true
      this.$http_komship.post('v1/my-profile', {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.profile = response.data.data
        console.log('profile', this.profile.partner_id)
        this.getOrder()
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal meload data, silahkan refresh halaman!',
            variant: 'danger',
          },
        })
      })
    },
    getItemPrint(data) {
      console.log('qtyLabel', this.qtyLabel)
      if (data.item.printIsActive === true) {
        this.disableButtonPrint = false
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < data.item.product.length; x++) {
          this.qtyLabel.push(data.item.product[x].qty)
        }
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.qtyLabel.length; i++) {
          this.countQty += this.qtyLabel[i]
        }
        Object.assign(data.item, { qtyTotal: this.countQty })
        this.fieldItemsPrint.push(data.item)
      }
      if (data.item.printIsActive === false) this.fieldItemsPrint.splice(data.index, 1)
      if (this.fieldItemsPrint[0] === undefined) this.disableButtonPrint = true
      console.log('fieldItemsPrint', this.fieldItemsPrint)
      console.log('items', this.items)
    },
    getAllItemPrint() {
      if (this.allSelectItemPrint === true) {
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.items.length; x++) {
          this.items[x].printIsActive = true
          this.fieldItemsPrint.push(this.items[x])
        }
        this.disableButtonPrint = false
      }
      if (this.allSelectItemPrint === false) {
        this.fieldItemsPrint = []
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.items.length; x++) {
          this.items[x].printIsActive = false
        }
        this.disableButtonPrint = true
      }
      this.$refs.tableOrder.refresh()
      console.log('fieldItemsPrint', this.fieldItemsPrint)
    },
    formatPrice(value) {
      const val = value
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    convertDate(value) {
      let result = value
      if (value !== '0000-00-00 00:00:00') {
        result = this.dateFormat(value, 'dd-mm-yyyy')
      }
      return result
    },
    convertTime(value) {
      let result = ''
      if (value !== '0000-00-00 00:00:00') {
        result = this.dateFormat(value, 'HH:MM')
      }
      return result
    },
    getValueDistrict(values) {
      const value = values
      return value.replace(',', ', ')
    },
    getCustomerPhone(value) {
      let result = ''
      if (result.charAt(0) !== '0') {
        result = `0${value}`
      } else if (result.charAt(0) === '6') {
        result = `+${value}`
      }
      return result
    },
  },
}
</script>

<style lang="scss">
  @import '../../order/data-order.scss';
  @import '../add-pickup-detail.scss';
</style>
