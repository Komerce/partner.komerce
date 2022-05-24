<template>
  <b-card>
    <!-- Riwayat pengajuan pickup -->
    <div v-if="printLabelIsActive === false">
      <b-row class="justify-content-between mx-2 wrapper__content__detail__pickup">
        <b-button
          variant="primary"
          tag="router-link"
          :to="{ name: $route.meta.routeToHistory }"
        >
          <feather-icon
            icon="ChevronLeftIcon"
          />
        </b-button>
        <h3 class="text-black">
          <strong>
            Riwayat Pengajuan Pickup
          </strong>
        </h3>
      </b-row>
      <b-row class="mt-3 justify-content-center">
        <b-col
          cols="11"
          class="d-flex justify-content-between"
        >
          <h4 class="text-black">
            <strong>
              Penjemputan
            </strong>
          </h4>
          <b-button
            :disabled="labelIsActive"
            variant="primary"
            @click="handlePrintLabel"
          >
            <b-row>
              <span class="align-middle">
                Label Pengiriman
              </span>
              <feather-icon
                icon="ChevronRightIcon"
              />
            </b-row>
          </b-button>
        </b-col>
        <b-col cols="11">
          <hr style="height:1px;border-width:0;color:#C2C2C2;background-color:#C2C2C2">
        </b-col>
      </b-row>
      <b-overlay
        variant="light"
        :show="loading"
        spinner-variant="primary"
        blur="0"
        opacity=".5"
        rounded="sm"
      >
        <b-form @submit.prevent>
          <b-row class="justify-content-center">
            <b-col cols="11">
              <b-form-group
                label="Alamat"
                label-for="h-first-name"
                label-cols-md="2"
                label-class="text-black font-weight-bold"
              >
                <b-row class="mt-50">
                  <b-col md="10">
                    <h5 class="text-black">
                      <strong>
                        {{ addressName }}
                      </strong>
                    </h5>
                    <p>
                      {{ addressDetail }}
                    </p>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
            <b-col cols="11">
              <b-form-group
                label="Tanggal"
                label-for="h-email"
                label-cols-md="2"
                label-class="text-black font-weight-bold"
              >
                <div class="add-pickup-input-date-label mt-50">
                  {{ dateLabel }}
                </div>
              </b-form-group>
            </b-col>
            <b-col cols="11">
              <b-form-group
                label="Waktu Jemput"
                label-for="h-number"
                label-cols-md="2"
                label-class="text-black font-weight-bold"
              >
                <p class="mt-50">
                  {{ timeValueText }}
                </p>
              </b-form-group>
            </b-col>
            <b-col cols="11">
              <b-form-group
                label="Kendaraan"
                label-for="h-password"
                label-cols-md="2"
                label-class="text-black font-weight-bold"
              >
                <div
                  id="input-pickup-vehicle"
                  class="add-pickup-input-vehicle-btn-wrapper"
                >
                  <b-button
                    v-if="profile && profile.vehicle && profile.vehicle.indexOf('MOTOR') > -1"
                    :class="`vehicle-button-content ${chosenVehicle === 'MOTOR' ? 'vehicle-selected white-button mr-1' : 'vehicle-button mr-1 d-none'}`"
                  >
                    <img src="@/assets/images/icons/motor.png">
                    <span>Motor</span>
                  </b-button>
                  <b-button
                    v-if="profile && profile.vehicle && profile.vehicle.indexOf('MOBIL') > -1"
                    :class="`vehicle-button-content ${chosenVehicle === 'MOBIL' ? 'vehicle-selected white-button mr-1' : 'vehicle-button mr-1 d-none'}`"
                  >
                    <img src="@/assets/images/icons/mobil.png">
                    <span>Mobil</span>
                  </b-button>
                  <b-button
                    v-if="profile && profile.vehicle && profile.vehicle.indexOf('TRUCK') > -1"
                    :class="`vehicle-button-content vehicle-button-content-truk ${chosenVehicle === 'TRUCK' ? 'vehicle-selected white-button' : 'vehicle-button d-none'}`"
                  >
                    <img src="@/assets/images/icons/truk.png">
                    <span>Truk</span>
                  </b-button>
                </div>
              </b-form-group>
            </b-col>
            <b-col
              class="mt-1"
              cols="11"
            >
              <b-form-group
                label="Orderan"
                label-for="h-password"
                label-cols-md="2"
                label-class="text-black font-weight-bold"
              />
            </b-col>
          </b-row>

          <div v-if="selectedOrderToStore === []">
            <b-row class="justify-content-center">
              <b-col
                cols="11"
                class="d-flex justify-content-between"
              >
                <div>
                  <h5>
                    <strong>
                      Produk
                    </strong>
                  </h5>
                </div>
                <div>
                  <h5>
                    <strong>
                      Jumlah
                    </strong>
                  </h5>
                </div>
              </b-col>
              <b-col cols="11">
                <hr style="height:1px;border-width:0;color:#C2C2C2;background-color:#C2C2C2">
              </b-col>
            </b-row>
          </div>

          <b-row class="justify-content-center mt-1">
            <b-col cols="11">
              <b-table
                :fields="fieldsPreviewProductOrder"
                :items="itemsPreviewProductOrder"
              >
                <template #cell(product)="data">
                  <b-row class="">
                    <div
                      fluid
                      class="d-flex"
                    >
                      <div>
                        <b-avatar
                          variant="light-primary"
                          square
                          size="50px"
                          :src="data.item.product_image"
                        />
                      </div>
                      <div class="ml-1">
                        <h5 class="text-black">
                          <strong>
                            {{ data.item.product_name }}
                          </strong>
                        </h5>
                        <div v-if="data.item.product_variant_name !== ''">
                          <span class="text-black">
                            <strong>
                              {{ data.item.product_variant_name }}
                            </strong>
                          </span>
                        </div>
                        <div v-else>
                          <span class="text-black">
                            <strong>
                              Tidak ada variasi
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </b-row>
                </template>

                <template #cell(total)="data">
                  <h5 class="text-black">
                    <strong>
                      {{ data.item.qty }}
                    </strong>
                  </h5>
                </template>
              </b-table>
            </b-col>
          </b-row>

          <b-row class="justify-content-center mb-1">
            <b-col
              class="mb-1"
              cols="11"
            >
              <hr style="height:2px;border-width:0;color:#ebe9f1;background-color:#ebe9f1">
            </b-col>
            <b-col
              cols="11"
              class="d-flex justify-content-end pl-0"
            >
              <div>
                <span class="text-black">
                  <strong>
                    Total: {{ itemsPreviewProductOrder ? `Total: ${itemsPreviewProductOrder.length}` : 'Total: 0' }}
                  </strong>
                </span>
              </div>
            </b-col>
          </b-row>
        </b-form>
      </b-overlay>
    </div>

    <!-- Print label pengiriman -->
    <div v-else>
      <b-row class="justify-content-between">
        <b-button
          variant="primary"
          class="ml-3"
          @click="handleBackHistoryPickup"
        >
          <feather-icon
            icon="ChevronLeftIcon"
          />
        </b-button>
        <h4 class="mr-3">
          <strong>
            Detail orderan pickup
          </strong>
        </h4>
      </b-row>
      <b-row class="justify-content-end mr-3 mt-2 mb-5">
        <b-col cols="3">
          <v-select
            v-model="shipmentValue"
            :options="itemsShipment"
            label="shipping_name"
            class="mr-1"
            :reduce="items => items.shipping_name"
            @input="filterPickup"
          />
        </b-col>
        <b-button
          :variant="disableButtonPrint === true ? 'dark' : 'primary'"
          :disabled="disableButtonPrint"
          :style="disableButtonPrint === true ? 'cursor: no-drop' : ''"
          @click="onShowModalPrint"
        >
          {{ totalLabel === 0 ? 'Print Label' : `Print Label (${totalLabel})` }}
        </b-button>
      </b-row>

      <b-overlay
        variant="light"
        :show="loadingPrintLabel"
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
          show-empty
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
              </div>
            </b-row>
          </template>
          <template #cell(pelanggan)="data">
            <h5 class="text-black text-top">
              <strong>
                {{ data.item.customer_name }}
              </strong>
            </h5>
            <b-row
              v-if="data.item.shipping === 'JNE'"
              class="align-items-center"
            >
              <b-img
                src="@/assets/images/expedisi/logo-jne.png"
                width="40"
                class="ml-1"
              />
              <span class="text-black ml-50">
                <strong>
                  Reguler
                </strong>
              </span>
            </b-row>
            <b-row
              v-if="data.item.shipping === 'SICEPAT'"
              class="align-items-center"
            >
              <b-img
                src="@/@core/assets/image/icons/logo__sicepat.svg"
                width="60"
                class="ml-1"
              />
              <span class="text-black ml-50">
                <strong>
                  {{ data.item.shipping_type }}
                </strong>
              </span>
            </b-row>
            <b-row
              v-if="data.item.shipping === 'IDEXPRESS'"
              class="align-items-center"
            >
              <b-img
                src="@/@core/assets/image/icons/logo-idexpress.svg"
                width="40"
                class="ml-1"
              />
              <span class="text-black ml-50">
                <strong>
                  {{ data.item.shipping_type }}
                </strong>
              </span>
            </b-row>
          </template>
          <template #cell(product)="data">
            <div v-if="data.item.product.length > 1">
              <div
                v-for="(itemsProduct, index) in data.item.product.slice(0, 1)"
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
              <div
                v-for="(itemsProduct, index) in data.item.product.slice(1, data.item.product.length)"
                :key="index+2"
              >
                <b-collapse
                  :id="`collapse${data.index}`"
                  class="mt-2"
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
                </b-collapse>
              </div>
            </div>
            <div v-else>
              <div
                v-for="(itemsProduct, index) in data.item.product.slice(0, 1)"
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
            </div>
            <b-button
              v-if="data.item.product.length > 1"
              class="expand-button-variation btn-icon"
              variant="flat-dark"
              @click="handleExpand(data)"
            >
              <b-col class="d-flex">
                {{ data.item.isExpand === true ? 'Tutup' : `${data.item.product.length - 1} Produk Lainnya` }}
                <feather-icon
                  :icon="data.item.isExpand === true ? 'ChevronUpIcon' : 'ChevronDownIcon'"
                />
              </b-col>
            </b-button>
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
            <b-row class="align-items-center justify-content-start">
              <span class="text-black">
                {{ data.item.airway_bill }}
              </span>
            </b-row>
            <b-button
              v-if="data.item.product.length > 1"
              class="expand-button-variation-mobile btn-icon"
              variant="flat-dark"
              @click="handleExpand(data)"
            >
              <b-col class="d-flex">
                {{ data.item.isExpand === true ? 'Tutup' : `${data.item.product.length - 1} Produk Lainnya` }}
                <feather-icon
                  :icon="data.item.isExpand === true ? 'ChevronUpIcon' : 'ChevronDownIcon'"
                />
              </b-col>
            </b-button>
          </template>
        </b-table>
      </b-overlay>

      <!-- Modal Print -->
      <b-modal
        ref="print"
        hide-footer
        hide-header
        scrollable
        size="xl"
      >
        <b-icon-x-circle
          class="close-button-on-popup-pickup"
          @click="handleClosePopUp"
        />

        <div class="title-on-popup-pickup mt-2 mb-2">
          Pilih Bentuk Print Label
        </div>

        <section class="add-pickup-popup-print-options-wrapper">
          <add-pickup-print-panel
            :is-selected="selectedOptions === 1"
            :panel-amount="1"
            :title="'1 Label / Halaman'"
            :sub-title="'Direkomendasikan kertas A4'"
            @onChose="() => handleChosePrintOption(1)"
          />

          <add-pickup-print-panel
            :is-selected="selectedOptions === 2"
            :panel-amount="2"
            :title="'2 Label / Halaman'"
            :sub-title="'Direkomendasikan kertas A4'"
            @onChose="() => handleChosePrintOption(2)"
          />

          <add-pickup-print-panel
            :is-selected="selectedOptions === 4"
            :panel-amount="4"
            :title="'4 Label / Halaman'"
            :sub-title="'Direkomendasikan kertas A4'"
            @onChose="() => handleChosePrintOption(4)"
          />

          <add-pickup-print-panel
            :is-selected="selectedOptions === 100"
            :panel-amount="100"
            :title="'10 cm x 10cm'"
            :sub-title="'Printer Thermal'"
            @onChose="() => handleChosePrintOption(100)"
          />

          <add-pickup-print-panel
            :is-selected="selectedOptions === 150"
            :panel-amount="150"
            :title="'10 cm x 15cm'"
            :sub-title="'Printer Thermal'"
            @onChose="() => handleChosePrintOption(150)"
          />
        </section>

        <b-row class="justify-content-end pb-2 wrapper__handle__print__label">
          <b-button
            variant="primary"
            class="mr-3 py-1 px-3"
            @click="onSubmitOptionPrint(selectedOptions)"
          >
            <b-spinner
              v-if="loadingButtonPrintLabel"
              small
            />
            Print
          </b-button>
        </b-row>

        <b-row class="justify-content-end pb-2 wrapper__handle__print__label__mobile">
          <b-button
            variant="primary"
            class="mr-3 py-1 px-3"
            @click="onSubmitOptionPrintMobile(selectedOptions)"
          >
            <b-spinner
              v-if="loadingButtonPrintLabel"
              small
            />
            Print
          </b-button>
        </b-row>
      </b-modal>

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

      <b-row class="wrapper__pagination__print__mobile">
        <b-col
          cols="12"
          class="mb-1"
        >
          <div
            class="bg-light d-flex justify-content-center align-items-center p-50 rounded"
          >
            <span class="text-black mr-50">
              List per halaman:
            </span>
            <b-button
              v-for="page in optionsPage"
              :key="page"
              class="btn-icon"
              size="sm"
              :variant="totalPerPage === page ? 'primary' : 'flat-dark'"
              @click="setPerPage(page)"
            >
              {{ page }}
            </b-button>
          </div>
        </b-col>
        <b-col
          cols="12"
          class="d-flex justify-content-end"
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="totalPerPage"
            first-number
            last-number
            class="pagination-primary"
          >
            <template #prev-text>
              <feather-icon
                size="18"
                icon="ChevronLeftIcon"
              />
            </template>
            <template #next-text>
              <feather-icon
                size="18"
                icon="ChevronRightIcon"
              />
            </template>
          </b-pagination>
        </b-col>
      </b-row>

      <b-row class="wrapper__pagination__print">
        <b-col
          cols="12"
          class="d-flex justify-content-between"
        >
          <div
            class="bg-light d-flex justify-content-center align-items-center p-50 rounded"
          >
            <span class="text-black mr-50">
              List per halaman:
            </span>
            <b-button
              v-for="page in optionsPage"
              :key="page"
              class="btn-icon"
              size="sm"
              :variant="totalPerPage === page ? 'primary' : 'flat-dark'"
              @click="setPerPage(page)"
            >
              {{ page }}
            </b-button>
          </div>

          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="totalPerPage"
            first-number
            last-number
            class="pagination-primary"
          >
            <template #prev-text>
              <feather-icon
                size="18"
                icon="ChevronLeftIcon"
              />
            </template>
            <template #next-text>
              <feather-icon
                size="18"
                icon="ChevronRightIcon"
              />
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </div>

    <vue-html2pdf
      ref="html2Pdf"
      :enable-download="computedDownloadPdf"
      :show-layout="false"
      :float-layout="true"
      :preview-modal="computePreviewModalPdf"
      :paginate-elements-by-height="1400"
      :filename="labelformobile"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"

      pdf-content-width="100%"
      @hasStartedGeneration="hasStartedGeneration()"
    >
      <section
        slot="pdf-content"
      >
        <div v-if="valuesOption === 1">
          <div
            v-for="(itemsPrint, index) in fieldItemsPrint"
            :key="index+1"
          >
            <div
              class="container pt-1"
            >
              <div
                class="border-4 border-black px-50 mb-50"
              >
                <b-row>
                  <b-col
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
                    class="d-flex align-items-center justify-content-center"
                  >
                    <b-img
                      v-if="itemsPrint.shipping === 'JNE'"
                      src="@/assets/images/expedisi/logo-jne.png"
                      alt="ekspedisi"
                      style="max-width: 50%;"
                    />
                    <b-img
                      v-if="itemsPrint.shipping === 'SICEPAT'"
                      src="@/@core/assets/image/icons/logo__sicepat.svg"
                      alt="ekspedisi"
                      style="max-width: 50%;"
                    />
                    <b-img
                      v-if="itemsPrint.shipping === 'IDEXPRESS'"
                      src="@/@core/assets/image/icons/logo-idexpress.svg"
                      alt="ekspedisi"
                      style="max-width: 50%;"
                    />
                  </b-col>
                  <b-col
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

                <b-row class="mx-50">
                  <b-col class="border-4 border-black mr-50">
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
                        <span class="text-black">{{ itemsPrint.custom_label_id === 0 ? profile.partner_business_name : itemsPrint.custom_label.name_label }}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="PhoneIcon"
                            size="17"
                          />
                        </span>
                        <span class="text-black">{{ itemsPrint.custom_label_id === 0 ? profile.partner_no_hp_business : itemsPrint.custom_label.no_hp }}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex border-0 align-items-center px-0 pt-0 pb-50">
                        <span class="mr-1 text-black">
                          <feather-icon
                            icon="MapPinIcon"
                            size="16"
                          />
                        </span>
                        <span class="text-black">{{ getValueDistrict(idOrderFromHistory.district) }}</span>
                      </b-list-group-item>
                    </b-list-group>
                  </b-col>
                  <b-col class="border-4 border-black">
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
                    class="d-flex justify-content-center align-items-center border-4 border-black"
                  >
                    <b-row>
                      <b-col
                        cols="12"
                        class="text-center"
                      >
                        <h4 class="text-black">
                          <strong>
                            {{ itemsPrint.payment_method === 'COD' ? 'COD' : 'Non-COD' }}
                          </strong>
                        </h4>
                      </b-col>
                      <b-col
                        v-if="itemsPrint.payment_method === 'COD'"
                        cols="12"
                        class="text-center"
                      >
                        <h5 class="text-black">
                          <strong>
                            Rp. {{ formatPrice(itemsPrint.grand_total) }}
                          </strong>
                        </h5>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    cols="8"
                    class="border-4 border-black border-l-0"
                  >
                    <b-row class="d-flex justify-content-center">
                      <h4 class="text-black">
                        <strong>
                          Nomor Resi
                        </strong>
                      </h4>
                    </b-row>
                    <b-row class="d-flex mt-1 justify-content-center">
                      <barcode
                        :value="itemsPrint.airway_bill"
                        height="60"
                        width="3"
                      >
                        Show this if the rendering fails.
                      </barcode>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="px-2 mt-50">
                  <b-col
                    cols="12"
                    class="border-4 border-black pb-1 text-center"
                  >
                    <span class="text-black">
                      <strong>
                        Jenis layanan: {{ getService(itemsPrint.shipping_type) }}
                      </strong>
                    </span>
                  </b-col>
                </b-row>

                <b-row class="mt-50 px-2">
                  <b-col
                    cols="4"
                    class="border-4 border-black pb-1"
                  >
                    <span class="text-black">
                      <strong>
                        Asuransi : Tidak Ada
                      </strong>
                    </span>
                  </b-col>
                  <b-col
                    cols="8"
                    class="border-4 border-black pb-1"
                  >
                    <span
                      v-if="itemsPrint.product[1] === undefined"
                      class="text-black"
                    >
                      <strong>
                        Berat : <span>
                          {{ (itemsPrint.product[0].weight/1000).toFixed(2) }} Kg
                        </span>
                      </strong>
                    </span>
                    <span
                      v-if="itemsPrint.product[1] !== undefined"
                      class="text-black"
                    >
                      <strong>
                        Berat : <span>
                          {{ (itemsPrint.product.reduce((x,y) => x+y.weight,0)/1000).toFixed(2) }} Kg
                        </span>
                      </strong>
                    </span>
                  </b-col>
                </b-row>

                <b-row class="mt-50 mx-50 pb-50">
                  <b-col
                    cols="4"
                    class="border-4 border-black pb-1"
                  >
                    <span class="text-black">
                      <strong>
                        Kuantitas:
                      </strong>
                      {{ sumAll(itemsPrint.product) }}
                    </span>
                  </b-col>
                  <b-col
                    cols="8"
                    class="border-4 border-black d-flex pb-1 align-items-start border-l-0"
                  >
                    <span class="text-black">
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
                        <b-list-group-item class="d-flex border-0 align-items-center pt-0 pb-50">
                          <div
                            v-if="dataProduct.variant_name !== '0' && dataProduct.variant_name !== ''"
                            class="d-flex align-items-start"
                          >
                            <span
                              class="text-black"
                            >
                              <strong>
                                {{ dataProduct.qty }} {{ dataProduct.product_name }} {{ dataProduct.variant_name }},
                              </strong>
                            </span>
                          </div>
                          <div v-else>
                            <span
                              class="ml-1 text-black mr-50"
                            >
                              <strong>
                                {{ dataProduct.qty }}
                              </strong>
                            </span>
                            <span
                              class="text-black"
                            >
                              <strong>
                                {{ `${ dataProduct.product_name } ${ dataProduct.variant_name }` }},
                              </strong>
                            </span>
                          </div>
                        </b-list-group-item>
                      </b-list-group>
                    </div>
                  </b-col>
                </b-row>

                <b-row class="px-2 mt-50 pb-50">
                  <b-col
                    cols="12"
                    class="border-4 border-black pb-1"
                  >
                    <span class="text-black">
                      <strong>
                        Catatan: Mohon hubungi nomor pembeli untuk konfirmasi pengiriman
                      </strong>
                    </span>
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
            class="p-50"
          >
            <div
              class="border-4 border-black mt-1"
              style="width: 100%; height:35rem;"
            >
              <b-row>
                <b-col
                  cols="4"
                  class="text-center"
                >
                  <span
                    class="text-black"
                    style="font-size: 9px; margin-top: -10px;"
                  >
                    <strong>
                      Order ID
                    </strong>
                  </span>
                  <p
                    class="text-black mt-0"
                    style="font-size: 9px; line-height: 1px;"
                  >
                    <strong>
                      {{ itemsPrint.order_no }}
                    </strong>
                  </p>
                </b-col>
                <b-col
                  cols="4"
                  class="d-flex justify-content-center"
                >
                  <b-img
                    v-if="itemsPrint.shipping === 'JNE'"
                    src="@/assets/images/expedisi/logo-jne.png"
                    alt="ekspedisi"
                    style="margin:auto;"
                    class="mt-50"
                    width="50"
                  />
                  <b-img
                    v-if="itemsPrint.shipping === 'SICEPAT'"
                    src="@/@core/assets/image/icons/logo__sicepat.svg"
                    alt="ekspedisi"
                    style="margin:auto;"
                    class="mt-50"
                    width="70"
                  />
                  <b-img
                    v-if="itemsPrint.shipping === 'IDEXPRESS'"
                    src="@/@core/assets/image/icons/logo-idexpress.svg"
                    alt="ekspedisi"
                    style="margin:auto;"
                    class="mt-50"
                    width="50"
                  />
                </b-col>
                <b-col
                  cols="4"
                  class="d-flex"
                >
                  <b-img
                    src="@/assets/images/logo/komship-bw.png"
                    alt="komship"
                    style="margin:auto;"
                    class="mt-1 mr-50"
                    width="60"
                  />
                </b-col>
              </b-row>

              <b-row class="mx-50 mb-50">
                <b-col
                  cols="6"
                  class="p-0"
                >
                  <div
                    class="border-4 border-black"
                    style="width: 100%; height: 150px;"
                  >
                    <b-row class="justify-content-center">
                      <span
                        class="text-black"
                        style="font-size: 10px;"
                      >
                        <strong>
                          Pengirim
                        </strong>
                      </span>
                    </b-row>
                    <b-row class="ml-50">
                      <ul>
                        <li
                          class="text-black d-flex align-items-center"
                          style="line-height: 9px; margin-bottom: 1px;"
                        >
                          <span>
                            <feather-icon icon="UserIcon" />
                          </span>
                          <span
                            style="font-size: 9px;"
                            class="ml-50"
                          >
                            <strong>
                              {{ itemsPrint.custom_label_id === 0 ? profile.partner_business_name : itemsPrint.custom_label.name_label }}
                            </strong>
                          </span>
                        </li>
                        <li
                          class="text-black d-flex align-items-center"
                          style="line-height: 8px; margin-bottom: 1px;"
                        >
                          <span>
                            <feather-icon icon="PhoneIcon" />
                          </span>
                          <span
                            style="font-size: 9px;"
                            class="ml-50"
                          >
                            <strong>
                              {{ itemsPrint.custom_label_id === 0 ? profile.partner_no_hp_business : itemsPrint.custom_label.no_hp }}
                            </strong>
                          </span>
                        </li>
                        <li
                          class="text-black d-flex"
                          style="line-height: 9px;"
                        >
                          <span>
                            <feather-icon icon="MapPinIcon" />
                          </span>
                          <span
                            style="font-size: 9px;"
                            class="ml-50"
                          >
                            <strong>
                              {{ getValueDistrict(idOrderFromHistory.district) }}
                            </strong>
                          </span>
                        </li>
                      </ul>
                    </b-row>
                  </div>
                </b-col>
                <b-col
                  cols="6"
                  class="p-0 pr-50"
                >
                  <div
                    class="border-4 border-black ml-50"
                    style="width: 100%; height: 150px;"
                  >
                    <b-row class="justify-content-center">
                      <span
                        class="text-black"
                        style="font-size: 10px;"
                      >
                        <strong>
                          Penerima
                        </strong>
                      </span>
                    </b-row>
                    <b-row class="ml-50">
                      <ul>
                        <li
                          class="text-black d-flex align-items-center"
                          style="line-height: 8px; margin-bottom: 1px;"
                        >
                          <span>
                            <feather-icon icon="UserIcon" />
                          </span>
                          <span
                            style="font-size: 9px;"
                            class="ml-50"
                          >
                            <strong>
                              {{ itemsPrint.customer_name }}
                            </strong>
                          </span>
                        </li>
                        <li
                          class="text-black d-flex align-items-center"
                          style="line-height: 8px; margin-bottom: 1px;"
                        >
                          <span>
                            <feather-icon icon="PhoneIcon" />
                          </span>
                          <span
                            style="font-size: 9px;"
                            class="ml-50"
                          >
                            <strong>
                              {{ getCustomerPhone(itemsPrint.customer_phone) }}
                            </strong>
                          </span>
                        </li>
                        <li
                          class="text-black d-flex align-items-center pr-1 pb-5"
                          style="line-height: 9px;"
                        >
                          <span>
                            <feather-icon icon="MapPinIcon" />
                          </span>
                          <span
                            style="font-size: 9px;"
                            class="ml-50"
                          >
                            <strong>
                              {{ `${itemsPrint.detail_address}, ${itemsPrint.customer_detail_address}` }}
                            </strong>
                          </span>
                        </li>
                      </ul>
                    </b-row>
                  </div>
                </b-col>
              </b-row>

              <b-row class="border-4 border-black mx-50 mb-50">
                <b-col
                  cols="4"
                  style="border-right: 1px solid black"
                >
                  <b-row
                    class="justify-content-center text-center align-items-center"
                  >
                    <h5
                      class="text-black text-center"
                      style="font-size: 14px; margin-top: 10px;"
                    >
                      <strong>
                        {{ itemsPrint.payment_method === 'COD' ? 'COD' : 'Non-COD' }}
                        <br>
                        {{ itemsPrint.payment_method !== 'COD' ? '' : `Rp. ${ formatPrice(itemsPrint.grand_total) }` }}
                      </strong>
                    </h5>
                  </b-row>
                </b-col>
                <b-col
                  cols="8"
                  class="d-flex justify-content-center align-items-center"
                >
                  <barcode
                    :value="itemsPrint.airway_bill"
                    height="35"
                    font-size="8"
                    font-options="bold"
                    width="3"
                  >
                    Show this if the rendering fails.
                  </barcode>
                </b-col>
              </b-row>

              <b-row
                class="border-4 border-black justify-content-center mx-50 mb-50"
                style="height: 20px;"
              >
                <span
                  class="text-black"
                  style="font-size: 9px; line-height: 5px;"
                >
                  <strong>
                    Jenis Layanan: {{ getService(itemsPrint.shipping_type) }}
                  </strong>
                </span>
              </b-row>

              <b-row class="mx-50 mb-50">
                <b-col
                  cols="4"
                >
                  <b-row
                    class="border-4 border-black"
                    style="border-right: 0px!important; height: 20px;"
                  >
                    <span
                      class="text-black ml-50"
                      style="font-size: 9px; line-height: 5px;"
                    >
                      <strong>
                        Asuransi: tidak ada
                      </strong>
                    </span>
                  </b-row>
                </b-col>
                <b-col
                  cols="8"
                >
                  <b-row
                    class="border-4 border-black"
                    style="height: 20px;"
                  >
                    <span
                      class="text-black ml-50"
                      style="font-size: 9px; line-height: 5px;"
                    >
                      <strong>
                        Berat: {{ itemsPrint.product[1] === undefined ? (itemsPrint.product[0].weight/1000).toFixed(2) : (itemsPrint.product.reduce((x,y) => x+y.weight,0)/1000).toFixed(2) }} Kg
                      </strong>
                    </span>
                  </b-row>
                </b-col>
              </b-row>

              <b-row class="mx-50 mb-50">
                <b-col
                  cols="4"
                >
                  <b-row
                    class="border-4 border-black"
                    style="border-right: 0px!important; height: 100px;"
                  >
                    <span
                      class="text-black ml-50"
                      style="font-size: 9px; line-height: 5px;"
                    >
                      <strong>
                        Kuantitas: {{ sumAll(itemsPrint.product) }}
                      </strong>
                    </span>
                  </b-row>
                </b-col>
                <b-col
                  cols="8"
                >
                  <b-row
                    class="border-4 border-black"
                    style="height: 100px;"
                  >
                    <span
                      class="text-black mx-50"
                      style="font-size: 9px;"
                    >
                      <strong>
                        ISI PAKET: <span
                          v-for="(dataProduct, indexProduct) in itemsPrint.product"
                          :key="indexProduct+1"
                          class="text-black ml-50"
                          style="font-size: 9px;"
                        >
                          <strong
                            v-if="dataProduct.variant_name !== '0' && dataProduct.variant_name !== ''"
                          >
                            {{ dataProduct.qty }} {{ dataProduct.product_name }} {{ dataProduct.variant_name }},
                          </strong>
                          <strong v-else>
                            {{ dataProduct.qty }} {{ `${ dataProduct.product_name } ${ dataProduct.variant_name }` }},
                          </strong>
                        </span>
                      </strong>
                    </span>
                  </b-row>
                </b-col>
              </b-row>

              <b-row
                :class="itemsPrint.shipping === 'IDEXPRESS' ? 'border-4 border-black mx-50 mb-50' : 'border-4 border-black mx-50' "
                style="height: 20px;"
              >
                <span
                  class="text-black ml-50"
                  style="font-size: 9px; line-height: 5px;"
                >
                  <strong>
                    Catatan: Mohon hubungi nomor pembeli untuk konfirmasi pengiriman
                  </strong>
                </span>
              </b-row>
            </div>
            <div
              v-if="index % 2 !== 0"
              class="html2pdf__page-break"
            />
          </div>
        </div>
      </section>
    </vue-html2pdf>

    <vue-html2pdf
      ref="html2PdfThermalSquare"
      :show-layout="false"
      :float-layout="true"
      :enable-download="computedDownloadPdf"
      :preview-modal="computePreviewModalPdf"
      :filename="labelformobile"
      :pdf-quality="2"
      pdf-format="a6"
      pdf-content-width="100%"
      pdf-orientation="portrait"
      :manual-pagination="false"
      :paginate-elements-by-height="400"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
    >
      <section
        v-for="(itemsPrint, index) in fieldItemsPrint"
        slot="pdf-content"
        :key="index+1"
        class="px-50 pt-50 pt-0"
      >
        <div
          class="border-4 border-black"
          style="width: 100%; height:25rem;"
        >
          <b-row>
            <b-col
              cols="4"
              class="text-center"
            >
              <span
                class="text-black"
                style="font-size: 8px; margin-top: -10px;"
              >
                <strong>
                  Order ID
                </strong>
              </span>
              <p
                class="text-black mt-0"
                style="font-size: 8px; line-height: 1px;"
              >
                <strong>
                  {{ itemsPrint.order_no }}
                </strong>
              </p>
            </b-col>
            <b-col
              cols="4"
              class="d-flex justify-content-center"
            >
              <b-img
                v-if="itemsPrint.shipping === 'JNE'"
                src="@/assets/images/logo/jne-bw.png"
                alt="ekspedisi"
                style="margin:auto;"
                class="mt-50"
                width="50"
              />
              <b-img
                v-if="itemsPrint.shipping === 'SICEPAT'"
                src="@/@core/assets/image/icons/logo__sicepat.svg"
                alt="ekspedisi"
                style="margin:auto;"
                class="mt-50"
                width="60"
              />
              <b-img
                v-if="itemsPrint.shipping === 'IDEXPRESS'"
                src="@/@core/assets/image/icons/logo-idexpress.svg"
                alt="ekspedisi"
                style="margin:auto;"
                class="mt-50"
                width="45"
              />
            </b-col>
            <b-col
              cols="4"
              class="d-flex"
            >
              <b-img
                src="@/assets/images/logo/komship-bw.png"
                alt="komship"
                style="margin:auto;"
                class="mt-1 mr-50"
                width="60"
              />
            </b-col>
          </b-row>

          <b-row class="mx-50 mb-50">
            <b-col
              cols="6"
              class="p-0"
            >
              <div
                class="border-4 border-black"
                style="width: 100%; height: 100px;"
              >
                <b-row class="justify-content-center">
                  <span
                    class="text-black"
                    style="font-size: 9px;"
                  >
                    <strong>
                      Pengirim
                    </strong>
                  </span>
                </b-row>
                <b-row class="ml-50">
                  <ul>
                    <li
                      class="text-black d-flex align-items-center"
                      style="line-height: 7px; margin-bottom: 1px;"
                    >
                      <span>
                        <feather-icon icon="UserIcon" />
                      </span>
                      <span
                        style="font-size: 7px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ itemsPrint.custom_label_id === 0 ? profile.partner_business_name : itemsPrint.custom_label.name_label }}
                        </strong>
                      </span>
                    </li>
                    <li
                      class="text-black d-flex align-items-center"
                      style="line-height: 7px; margin-bottom: 1px;"
                    >
                      <span>
                        <feather-icon icon="PhoneIcon" />
                      </span>
                      <span
                        style="font-size: 7px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ itemsPrint.custom_label_id === 0 ? profile.partner_no_hp_business : itemsPrint.custom_label.no_hp }}
                        </strong>
                      </span>
                    </li>
                    <li
                      class="text-black d-flex"
                      style="line-height: 8px;"
                    >
                      <span>
                        <feather-icon icon="MapPinIcon" />
                      </span>
                      <span
                        style="font-size: 7px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ getValueDistrict(idOrderFromHistory.district) }}
                        </strong>
                      </span>
                    </li>
                  </ul>
                </b-row>
              </div>
            </b-col>
            <b-col
              cols="6"
              class="p-0 pr-50"
            >
              <div
                class="border-4 border-black ml-50"
                style="width: 100%; height: 100px;"
              >
                <b-row class="justify-content-center">
                  <span
                    class="text-black"
                    style="font-size: 9px;"
                  >
                    <strong>
                      Penerima
                    </strong>
                  </span>
                </b-row>
                <b-row class="ml-50">
                  <ul>
                    <li
                      class="text-black d-flex align-items-center"
                      style="line-height: 7px; margin-bottom: 1px;"
                    >
                      <span>
                        <feather-icon icon="UserIcon" />
                      </span>
                      <span
                        style="font-size: 7px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ itemsPrint.customer_name }}
                        </strong>
                      </span>
                    </li>
                    <li
                      class="text-black d-flex align-items-center"
                      style="line-height: 7px; margin-bottom: 1px;"
                    >
                      <span>
                        <feather-icon icon="PhoneIcon" />
                      </span>
                      <span
                        style="font-size: 7px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ getCustomerPhone(itemsPrint.customer_phone) }}
                        </strong>
                      </span>
                    </li>
                    <li
                      class="text-black d-flex align-items-center pr-1 pb-5"
                      style="line-height: 8px;"
                    >
                      <span>
                        <feather-icon icon="MapPinIcon" />
                      </span>
                      <span
                        style="font-size: 7px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ `${itemsPrint.detail_address}, ${itemsPrint.customer_detail_address}` }}
                        </strong>
                      </span>
                    </li>
                  </ul>
                </b-row>
              </div>
            </b-col>
          </b-row>

          <b-row class="border-4 border-black mx-50 mb-50">
            <b-col
              cols="12"
            >
              <b-row
                class="justify-content-center text-center align-items-center"
              >
                <h5
                  class="text-black text-center"
                  style="font-size: 9px;"
                >
                  <strong>
                    {{ itemsPrint.payment_method === 'COD' ? 'COD' : 'Non-COD' }}
                    <br>
                    {{ itemsPrint.payment_method !== 'COD' ? '' : `Rp. ${ formatPrice(itemsPrint.grand_total) }` }}
                  </strong>
                </h5>
              </b-row>
            </b-col>
            <b-col
              cols="12"
              class="d-flex justify-content-center align-items-center"
            >
              <barcode
                :value="itemsPrint.airway_bill"
                height="35"
                font-size="10"
                font-options="bold"
                width="2"
              >
                Show this if the rendering fails.
              </barcode>
            </b-col>
          </b-row>

          <b-row
            class="border-4 border-black mx-50 mb-50"
            style="height: 14px;"
          >
            <b-col
              cols="4"
              class="d-flex pl-0"
              style="border-right: 1px solid black;"
            >
              <span
                class="text-black"
                style="font-size: 7px; line-height: 4px; margin-left: 3px;"
              >
                <strong>
                  Jenis Layanan: {{ getService(itemsPrint.shipping_type) }}
                </strong>
              </span>
            </b-col>
            <b-col
              cols="4"
              class="d-flex pl-0"
              style="border-right: 1px solid black;"
            >
              <span
                class="text-black"
                style="font-size: 7px; line-height: 4px; margin-left: 3px;"
              >
                <strong>
                  Asuransi: tidak ada
                </strong>
              </span>
            </b-col>
            <b-col
              cols="4"
              class="d-flex pl-0"
            >
              <span
                class="text-black ml-50"
                style="font-size: 7px; line-height: 4px; margin-left: 2px;"
              >
                <strong>
                  Berat: {{ itemsPrint.product[1] === undefined ? (itemsPrint.product[0].weight/1000).toFixed(2) : (itemsPrint.product.reduce((x,y) => x+y.weight,0)/1000).toFixed(2) }} Kg
                </strong>
              </span>
            </b-col>
          </b-row>

          <b-row
            class="mx-50 mb-50 border-4 border-black"
            style="height: 55px;"
          >
            <b-col
              cols="12"
              class="p-0 d-flex"
            >
              <span
                class="text-black ml-50"
                style="font-size: 7px;"
              >
                <strong>
                  Kuantitas: {{ sumAll(itemsPrint.product) }}
                </strong>
              </span>
            </b-col>
            <b-col
              cols="12"
              class="pl-0 d-flex"
            >
              <span
                class="text-black ml-50"
                style="font-size: 7px;"
              >
                <strong>
                  ISI PAKET: <span
                    v-for="(dataProduct, indexProduct) in itemsPrint.product"
                    :key="indexProduct+1"
                    class="text-black ml-50 p-0"
                    style="font-size: 7px; line-height: 9px; margin-top: 1px;"
                  >
                    <strong
                      v-if="dataProduct.variant_name !== '0' && dataProduct.variant_name !== ''"
                    >
                      {{ dataProduct.qty }} {{ dataProduct.product_name }} {{ dataProduct.variant_name }},
                    </strong>
                    <strong v-else>
                      {{ dataProduct.qty }} {{ `${ dataProduct.product_name } ${ dataProduct.variant_name }` }},
                    </strong>
                  </span>
                </strong>
              </span>
            </b-col>
          </b-row>

          <b-row
            :class="itemsPrint.shipping === 'IDEXPRESS' ? 'border-4 border-black mx-50 mb-50' : 'border-4 border-black mx-50' "
            style="height: 14px;"
          >
            <span
              class="text-black ml-50"
              style="font-size: 7px; line-height: 4px;"
            >
              <strong>
                Catatan: Mohon hubungi nomor pembeli untuk konfirmasi pengiriman
              </strong>
            </span>
          </b-row>
        </div>
        <div class="html2pdf__page-break" />
      </section>
    </vue-html2pdf>
    <vue-html2pdf
      ref="html2PdfThermal"
      :show-layout="false"
      :float-layout="true"
      :enable-download="computedDownloadPdf"
      :preview-modal="computePreviewModalPdf"
      :filename="labelformobile"
      :paginate-elements-by-height="1400"
      :pdf-quality="2"
      pdf-format="a6"
      pdf-content-width="100%"
      pdf-orientation="portrait"
      :manual-pagination="false"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
    >
      <section
        v-for="(itemsPrint, index) in fieldItemsPrint"
        slot="pdf-content"
        :key="index+1"
        class="px-50 pt-0"
      >
        <div
          class="border-4 border-black mt-1"
          style="width: 100%; height:35rem;"
        >
          <b-row>
            <b-col
              cols="4"
              class="text-center"
            >
              <span
                class="text-black"
                style="font-size: 8px; margin-top: -10px;"
              >
                <strong>
                  Order ID
                </strong>
              </span>
              <p
                class="text-black mt-0"
                style="font-size: 8px; line-height: 1px;"
              >
                <strong>
                  {{ itemsPrint.order_no }}
                </strong>
              </p>
            </b-col>
            <b-col
              cols="4"
              class="d-flex justify-content-center"
            >
              <b-img
                v-if="itemsPrint.shipping === 'JNE'"
                src="@/assets/images/logo/jne-bw.png"
                alt="ekspedisi"
                style="margin:auto;"
                class="mt-50"
                width="50"
              />
              <b-img
                v-if="itemsPrint.shipping === 'SICEPAT'"
                src="@/@core/assets/image/icons/logo__sicepat.svg"
                alt="ekspedisi"
                style="margin:auto;"
                class="mt-50"
                width="70"
              />
              <b-img
                v-if="itemsPrint.shipping === 'IDEXPRESS'"
                src="@/@core/assets/image/icons/logo-idexpress.svg"
                alt="ekspedisi"
                style="margin:auto;"
                class="mt-50"
                width="50"
              />
            </b-col>
            <b-col
              cols="4"
              class="d-flex"
            >
              <b-img
                src="@/assets/images/logo/komship-bw.png"
                alt="komship"
                style="margin:auto;"
                class="mt-1 mr-50"
                width="60"
              />
            </b-col>
          </b-row>

          <b-row class="mx-50 mb-50">
            <b-col
              cols="6"
              class="p-0"
            >
              <div
                class="border-4 border-black"
                style="width: 100%; height: 150px;"
              >
                <b-row class="justify-content-center">
                  <span
                    class="text-black"
                    style="font-size: 9px;"
                  >
                    <strong>
                      Pengirim
                    </strong>
                  </span>
                </b-row>
                <b-row class="ml-50">
                  <ul>
                    <li
                      class="text-black d-flex align-items-center"
                      style="line-height: 8px; margin-bottom: 1px;"
                    >
                      <span>
                        <feather-icon icon="UserIcon" />
                      </span>
                      <span
                        style="font-size: 8px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ itemsPrint.custom_label_id === 0 ? profile.partner_business_name : itemsPrint.custom_label.name_label }}
                        </strong>
                      </span>
                    </li>
                    <li
                      class="text-black d-flex align-items-center"
                      style="line-height: 8px; margin-bottom: 1px;"
                    >
                      <span>
                        <feather-icon icon="PhoneIcon" />
                      </span>
                      <span
                        style="font-size: 8px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ itemsPrint.custom_label_id === 0 ? profile.partner_no_hp_business : itemsPrint.custom_label.no_hp }}
                        </strong>
                      </span>
                    </li>
                    <li
                      class="text-black d-flex"
                      style="line-height: 9px;"
                    >
                      <span>
                        <feather-icon icon="MapPinIcon" />
                      </span>
                      <span
                        style="font-size: 8px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ getValueDistrict(idOrderFromHistory.district) }}
                        </strong>
                      </span>
                    </li>
                  </ul>
                </b-row>
              </div>
            </b-col>
            <b-col
              cols="6"
              class="p-0 pr-50"
            >
              <div
                class="border-4 border-black ml-50"
                style="width: 100%; height: 150px;"
              >
                <b-row class="justify-content-center">
                  <span
                    class="text-black"
                    style="font-size: 9px;"
                  >
                    <strong>
                      Penerima
                    </strong>
                  </span>
                </b-row>
                <b-row class="ml-50">
                  <ul>
                    <li
                      class="text-black d-flex align-items-center"
                      style="line-height: 8px; margin-bottom: 1px;"
                    >
                      <span>
                        <feather-icon icon="UserIcon" />
                      </span>
                      <span
                        style="font-size: 8px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ itemsPrint.customer_name }}
                        </strong>
                      </span>
                    </li>
                    <li
                      class="text-black d-flex align-items-center"
                      style="line-height: 8px; margin-bottom: 1px;"
                    >
                      <span>
                        <feather-icon icon="PhoneIcon" />
                      </span>
                      <span
                        style="font-size: 8px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ getCustomerPhone(itemsPrint.customer_phone) }}
                        </strong>
                      </span>
                    </li>
                    <li
                      class="text-black d-flex align-items-center pr-1 pb-5"
                      style="line-height: 9px;"
                    >
                      <span>
                        <feather-icon icon="MapPinIcon" />
                      </span>
                      <span
                        style="font-size: 8px;"
                        class="ml-50"
                      >
                        <strong>
                          {{ `${itemsPrint.detail_address}, ${itemsPrint.customer_detail_address}` }}
                        </strong>
                      </span>
                    </li>
                  </ul>
                </b-row>
              </div>
            </b-col>
          </b-row>

          <b-row class="border-4 border-black mx-50 mb-50">
            <b-col
              cols="12"
            >
              <b-row
                class="justify-content-center text-center align-items-center"
              >
                <h5
                  class="text-black text-center"
                  style="font-size: 14px;"
                >
                  <strong>
                    {{ itemsPrint.payment_method === 'COD' ? 'COD' : 'Non-COD' }}
                    <br>
                    {{ itemsPrint.payment_method !== 'COD' ? '' : `Rp. ${ formatPrice(itemsPrint.grand_total) }` }}
                  </strong>
                </h5>
              </b-row>
            </b-col>
            <b-col
              cols="12"
              class="d-flex justify-content-center align-items-center"
            >
              <barcode
                :value="itemsPrint.airway_bill"
                height="35"
                font-size="10"
                font-options="bold"
                width="2"
              >
                Show this if the rendering fails.
              </barcode>
            </b-col>
          </b-row>

          <b-row
            class="border-4 border-black mx-50 mb-50"
            style="height: 20px;"
          >
            <b-col
              cols="4"
              class="d-flex pl-0"
              style="border-right: 1px solid black;"
            >
              <span
                class="text-black"
                style="font-size: 8px; line-height: 5px; margin-left: 3px;"
              >
                <strong>
                  Jenis Layanan: {{ getService(itemsPrint.shipping_type) }}
                </strong>
              </span>
            </b-col>
            <b-col
              cols="4"
              class="d-flex pl-0"
              style="border-right: 1px solid black;"
            >
              <span
                class="text-black"
                style="font-size: 8px; line-height: 5px; margin-left: 3px;"
              >
                <strong>
                  Asuransi: tidak ada
                </strong>
              </span>
            </b-col>
            <b-col
              cols="4"
              class="d-flex pl-0"
            >
              <span
                class="text-black ml-50"
                style="font-size: 8px; line-height: 5px; margin-left: 2px;"
              >
                <strong>
                  Berat: {{ itemsPrint.product[1] === undefined ? (itemsPrint.product[0].weight/1000).toFixed(2) : (itemsPrint.product.reduce((x,y) => x+y.weight,0)/1000).toFixed(2) }} Kg
                </strong>
              </span>
            </b-col>
          </b-row>

          <b-row
            class="mx-50 mb-50 border-4 border-black"
            style="height: 100px;"
          >
            <b-col
              cols="12"
              class="p-0 d-flex"
            >
              <span
                class="text-black ml-50"
                style="font-size: 8px;"
              >
                <strong>
                  Kuantitas: {{ sumAll(itemsPrint.product) }}
                </strong>
              </span>
            </b-col>
            <b-col
              cols="12"
              class="pl-0 d-flex"
            >
              <span
                class="text-black ml-50"
                style="font-size: 8px;"
              >
                <strong>
                  ISI PAKET: <span
                    v-for="(dataProduct, indexProduct) in itemsPrint.product"
                    :key="indexProduct+1"
                    class="text-black ml-50 p-0"
                    style="font-size: 8px; line-height: 9px;"
                  >
                    <strong
                      v-if="dataProduct.variant_name !== '0' && dataProduct.variant_name !== ''"
                    >
                      {{ dataProduct.qty }} {{ dataProduct.product_name }} {{ dataProduct.variant_name }},
                    </strong>
                    <strong v-else>
                      {{ dataProduct.qty }} {{ `${ dataProduct.product_name } ${ dataProduct.variant_name }` }},
                    </strong>
                  </span>
                </strong>
              </span>
            </b-col>
          </b-row>

          <b-row
            :class="itemsPrint.shipping === 'IDEXPRESS' ? 'border-4 border-black mx-50 mb-50' : 'border-4 border-black mx-50' "
            style="height: 20px;"
          >
            <span
              class="text-black ml-50"
              style="font-size: 8px; line-height: 5px;"
            >
              <strong>
                Catatan: Mohon hubungi nomor pembeli untuk konfirmasi pengiriman
              </strong>
            </span>
          </b-row>
        </div>
        <div class="html2pdf__page-break" />
      </section>
    </vue-html2pdf>
  </b-card>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BForm,
  BButton,
  BTable,
  BAvatar,
  BOverlay,
  BContainer,
  BImg,
  BFormCheckbox,
  VBModal,
  BPagination,
  BCollapse,
  BSpinner,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import useJwt from '@/auth/jwt/useJwt'
import vSelect from 'vue-select'
import { dateFormat } from '@core/mixins/ui/date'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import VueHtml2pdf from 'vue-html2pdf'
import VueBarcode from 'vue-barcode'
import AddPickupPrintPanel from '../AddPickupPrintPanel.vue'
// import httpKomship from '../../setting-kompship/http_komship'

export default {

  components: {
    BCard,
    BRow,
    BCol,
    BFormGroup,
    BForm,
    BButton,
    BTable,
    BAvatar,
    BOverlay,
    BContainer,
    BImg,
    BFormCheckbox,
    BPagination,
    BCollapse,
    BSpinner,
    // AddPickupPopupPrint,
    AddPickupPrintPanel,
    vSelect,
    VueHtml2pdf,
    barcode: VueBarcode,
  },
  directives: {
    Ripple,
    VBModal,
  },
  mixins: [dateFormat],
  props: {
    selectedOption: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // Riwayat pengajuan pickup
      loading: false,
      addressName: '',
      addressDetail: '',
      dateValue: new Date(),
      dateLabel: '',
      timeValueText: '09 : 00',
      timeValue: '09:00',
      profile: null,
      chosenVehicle: '',
      itemsAddress: [],
      selectedOrderToStore: [],
      selectedAddress: '',
      fieldsPreviewProductOrder: [
        {
          key: 'product',
          label: 'Produk',
          thClass: 'bg-white text-black text-start pl-0 ml-0 border-top-0',
          tdClass: 'text-start pl-1 border-top-0',
        },
        {
          key: 'total',
          label: 'Jumlah',
          tdClass: 'text-center border-top-0',
          thClass: 'text-center text-black bg-white border-top-0',
          class: 'col-action',
        },
      ],
      itemsPreviewProductOrder: [],
      selectedOrdersId: [],
      namePic: '',
      picPhone: '',
      addressId: '',
      id: this.$route.params.order_data_id,
      itemsDataOrder: [],
      labelIsActive: true,

      // Print label pengiriman
      selectedOptions: this.selectedOption,
      printLabelIsActive: false,
      loadingPrintLabel: false,
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
      printOption: 1,
      valuePrint: [],
      idOrderFromHistory: null,
      idOrder: [],
      selectItemPrint: false,
      allSelectItemPrint: false,
      fieldItemsPrint: [],
      disableButtonPrint: true,
      qtyLabel: [],
      countQty: 0,
      valuesOption: 1,
      totalLabel: 0,
      currentPage: 1,
      totalRows: 0,
      totalPerPage: 50,
      optionsPage: [50, 100, 200],
      itemsWeightProduct: 0,
      handlePreviewModalPrint: true,
      orderIdBase64: [],
      loadingButtonPrintLabel: false,
      itemsShipment: [],
      shipmentValue: 'Semua Ekspedisi',
      shippingName: '',
      paramsBase64: '',
    }
  },
  computed: {
    labelformobile() {
      let result = null
      if (this.idOrderFromHistory) {
        const date = `${this.idOrderFromHistory.pickup_date}T${this.idOrderFromHistory.pickup_time}`
        result = `label-${this.$moment(date).format('YYYY-MM-DD-HH-mm-ss')}`
      }
      return result
    },
    computePreviewModalPdf() {
      return !(window.screen.width <= 600)
    },
    computedDownloadPdf() {
      return !(window.screen.width >= 600)
    },
  },
  watch: {
    currentPage: {
      handler() {
        this.getOrder()
      },
    },
  },
  mounted() {
    this.getProfile()
    this.getShipment()
  },
  methods: {
    // Riwayat pengajuan pickup
    getProfile() {
      this.loading = true
      this.$http_komship.post('v1/my-profile', {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.userData = response.data.data
        this.profile = response.data.data
        this.getDetailPickup()
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
        this.loading = false
        this.labelIsActive = false
      })
    },
    getDetailPickup() {
      this.$http_komship.get(`/v1/pickup/history/detail/${this.id}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        if (data) {
          this.itemsDataOrder = data
          this.addressName = data.address_name
          this.addressDetail = data.address_detail
          this.timeValueText = data.pickup_time
          this.dateLabel = data.pickup_date
          this.chosenVehicle = data.vehicle
          this.itemsPreviewProductOrder = data.data_order
        }
        this.loading = false
        this.labelIsActive = false
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
        this.loading = false
        this.labelIsActive = false
      })
    },

    // Print label pengiriman
    getOrder() {
      this.loadingPrintLabel = true
      this.idOrderFromHistory.data_order.map(items => this.idOrder.push(items.id))
      const params = {
        order_id: this.idOrder.toString(),
        page: this.currentPage,
        total_per_page: this.totalPerPage,
      }
      if (this.shipmentValue !== 'Semua Ekspedisi') Object.assign(params, { shipping_name: this.shipmentValue })
      this.$http_komship.get(`/v1/order/${this.profile.partner_id}`, {
        params,
      }).then(response => {
        this.totalRows = response.data.data.total
        const { data } = response.data.data
        this.items = data
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.items.length; x++) {
          Object.assign(this.items[x], {
            printIsActive: false,
            isExpand: false,
          })
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
        this.loadingPrintLabel = false
        this.allSelectItemPrint = false
        this.fieldItemsPrint = []
        this.totalLabel = 0
        this.disableButtonPrint = true
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
        this.loadingPrintLabel = false
      })
    },
    onShowModalPrint() {
      if (this.profile.user_phone === '' || this.profile.user_fullname === '') {
        this.$refs['modal-validate-print-label'].show()
      } else {
        this.$refs.print.show()
      }
    },
    getPrintLabelBase64() {
      this.loadingButtonPrintLabel = true
      this.$http_komship.get('v1/generate/print-label', {
        params: {
          order_id: this.orderIdBase64.join(),
          page: this.paramsBase64,
        },
      }).then(response => {
        this.base64Label = response.data
        const binary = atob(this.base64Label.replace(/\s/g, ''))
        const len = binary.length
        const buffer = new ArrayBuffer(len)
        const view = new Uint8Array(buffer)
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < len; i++) {
          view[i] = binary.charCodeAt(i)
        }
        const file = new Blob([view], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(file)
        window.open(fileURL)
        this.loadingButtonPrintLabel = false
      }).catch(() => {
        this.loadingButtonPrintLabel = false
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Failure',
            icon: 'AlertCircleIcon',
            text: 'Gagal print label, silahkan coba lagi!',
            variant: 'danger',
          },
        })
      })
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
      if (values === 1) {
        this.$refs.html2Pdf.generatePdf()
      } else if (values === 2) {
        this.$refs.html2Pdf.generatePdf()
      } else if (values === 4) {
        this.paramsBase64 = 'page_4'
        this.getPrintLabelBase64(values)
      } else if (values === 100) {
        this.$refs.html2PdfThermalSquare.generatePdf()
      } else {
        this.$refs.html2PdfThermal.generatePdf()
      }
      this.handlePreviewModalPrint = true
      this.valuesOption = values
      // Insert a link that allows the user to download the PDF file
      // const link = document.createElement('a')
      // link.innerHTML = 'Download PDF file'
      // link.download = 'file.pdf'
      // link.href = `data:application/octet-stream;base64,${b64}`
    },
    onSubmitOptionPrintMobile(values) {
      this.valuesOption = values
      // this.$refs.html2Pdf.generatePdf()
      if (values === 150) {
        this.$refs.html2PdfThermal.generatePdf()
      } else if (values === 100) {
        this.$refs.html2PdfThermalSquare.generatePdf()
      } else {
        this.$refs.html2Pdf.generatePdf()
      }
    },
    handleAfterPrintLabel() {
      if (this.profile.is_onboarding) {
        this.$emit('onBoardingShow')
      } else {
        this.$router.push('history-pickup')
      }
    },
    getItemPrint(data) {
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
        this.orderIdBase64.push(data.item.order_id)
      }
      if (data.item.printIsActive === false) {
        this.fieldItemsPrint.splice(data.index, 1)
        this.orderIdBase64.splice(data.index, 1)
      }
      if (this.fieldItemsPrint[0] === undefined) this.disableButtonPrint = true
      this.totalLabel = this.fieldItemsPrint.length
    },
    getAllItemPrint() {
      if (this.allSelectItemPrint === true) {
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.items.length; x++) {
          this.items[x].printIsActive = true
          this.fieldItemsPrint.push(this.items[x])
          this.orderIdBase64.push(this.items[x].order_id)
        }
        this.disableButtonPrint = false
      }
      if (this.allSelectItemPrint === false) {
        this.fieldItemsPrint = []
        this.orderIdBase64 = []
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.items.length; x++) {
          this.items[x].printIsActive = false
        }
        this.disableButtonPrint = true
      }
      this.totalLabel = this.fieldItemsPrint.length
      this.$refs.tableOrder.refresh()
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
    sumAll(product) {
      let total = 0
      product.forEach(item => {
        total += item.qty
      })
      return total
    },
    setPerPage(page) {
      this.totalPerPage = page
      this.getOrder()
    },
    handleExpand(data) {
      // eslint-disable-next-line no-param-reassign
      if (data.item.isExpand === false) {
        // eslint-disable-next-line no-param-reassign
        data.item.isExpand = true
      } else {
        // eslint-disable-next-line no-param-reassign
        data.item.isExpand = false
      }
      this.$root.$emit('bv::toggle::collapse', `collapse${data.index}`)
      this.$refs.tableOrder.refresh()
    },
    getService(data) {
      let result = ''
      if (data === 'REG19' || data === 'CTC') {
        result = 'Reguler'
      } else if (data === 'GOKIL' || data === 'SIUNTUNG') {
        result = data
      } else {
        result = data
      }
      return result
    },
    getWeightProduct(data) {
      if (data[1] === undefined) {
        this.itemsWeightProduct = data[0].weight
      } else {
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < data.length; x++) {
          this.itemsWeightProduct += data[x].weight
        }
      }
      return this.itemsWeightProduct
    },
    getShipment() {
      this.$http_komship.get('/v1/shipments')
        .then(response => {
          this.itemsShipment = response.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    filterPickup() {
      this.getOrder()
    },
    handlePrintLabel() {
      this.idOrderFromHistory = this.itemsDataOrder
      this.printLabelIsActive = true
      this.getOrder()
    },
    handleBackHistoryPickup() {
      this.printLabelIsActive = false
    },
    handleClosePopUp() {
      this.$refs.print.hide()
    },
    handleChosePrintOption(value) {
      if (value) this.selectedOptions = value
      this.$emit('onChangeOption', this.selectedOptions)
    },
  },
}
</script>

<style>

</style>
<style lang="scss">
  @import '~@core/scss/vue/libs/vue-select.scss';
  @import '../add-pickup.scss';
  @import '../add-pickup-detail.scss';

  [dir] .expand-button-variation {
    text-align: right;
    position: absolute;
    right: 2rem;
    margin-top: -1.72rem;
  }

  [dir] .expand-button-variation-mobile {
      display: none!important;
  }

  @media only screen and (max-width: 922px) {

    /* History Pickup */
    [dir] .expand-button-variation {
        display: none!important;
    }
    [dir] .expand-button-variation-mobile {
        display: inline-block!important;
    }
  }
  @media only screen and (max-width: 990px) {
    [dir] .wrapper__content__detail__pickup {
      margin: 0px !important;
    }
  }
  @media only screen and (min-width: 579px) {
    [dir] .wrapper__pagination__print__mobile {
        display: none!important;
    }
  }
  @media only screen and (max-width: 578px) {
    [dir] .wrapper__pagination__print {
        display: none!important;
    }
  }
</style>
