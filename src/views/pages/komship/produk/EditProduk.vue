<template>
  <b-overlay
    :show="loading"
    opacity=".5"
    blur="0"
    variant="light"
    spinner-variant="primary"
    rounded="sm"
  >
    <b-card-actions
      ref="formCard"
      title="Edit Produk"
      no-actions
    >
      <validation-observer ref="formRules">
        <b-form
          class="mt-3"
          @submit.prevent
        >
          <b-row>
            <b-col cols="12">
              <b-form-group
                label="Nama Produk"
                label-cols-md="2"
              >
                <validation-provider
                  #default="{errors}"
                  name="Nama Produk"
                  rules="required"
                >
                  <b-form-input
                    v-model="productName"
                    placeholder="Masukan nama produk kamu"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-primary">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-form-group
                label="SKU Produk"
                label-cols-md="2"
              >
                <validation-provider
                  #default="{errors}"
                  name="SKU Produk"
                  rules="required"
                >
                  <b-form-input
                    v-model="skuName"
                    placeholder="Masukan SKU produk kamu"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-primary">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-form-group
                label="Upload Gambar"
                label-cols-md="2"
              >
                <validation-provider
                  #default="{errors}"
                  name="Upload Gambar"
                >
                  <transition name="fade">
                    <b-avatar
                      v-if="imageInitialFile !== null || imageFile !== null"
                      variant="light-primary"
                      size="50"
                      :src="imageFile ? fileUrl(imageFile) : imageInitialFile"
                      class="mr-50"
                    />
                  </transition>
                  <label
                    for="uploadImage"
                  >
                    <b-avatar
                      v-if="imageFile === null && imageInitialFile === null"
                      variant="light-dark"
                      size="50"
                      class="btn btn-flat-primary btn-icon"
                    >
                      <feather-icon
                        icon="PlusIcon"
                        size="35"
                      />
                    </b-avatar>
                  </label>

                  <label
                    v-if="imageInitialFile !== null || imageFile !== null"
                    for="uploadImage"
                    class="btn btn-flat-dark btn-icon"
                  >
                    <feather-icon
                      icon="EditIcon"
                      size="20"
                    />
                  </label>
                  <b-form-file
                    id="uploadImage"
                    v-model="imageFile"
                    :state="errors.length > 0 ? false : null"
                    :placeholder="
                      imageInitialFile
                        ? imageInitialFile.split('/').pop()
                        : `Pilih atau drop file disini...`
                    "
                    drop-placeholder="Drop file disini..."
                    accept="image/*"
                    class="d-none"
                  />
                  <small class="text-primary">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-form-group
                label="Masukan Deskripsi"
                label-cols-md="2"
              >
                <validation-provider
                  #default="{errors}"
                  name="Deskripsi"
                  rule="required"
                >
                  <b-form-textarea
                    id="textarea-default"
                    v-model="descriptionProduct"
                    placeholder="Masukan deskripsi produk kamu"
                    rows="3"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-form-group
                label="Variasi"
                label-cols-md="2"
              >
                <b-button
                  v-if="isVariation === false"
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  variant="outline-info"
                  @click="addVariation"
                >
                  <feather-icon
                    icon="PlusIcon"
                    class="mr-50"
                  />
                  <span class="align-middle">Tambahkan Variasi</span>
                </b-button>

                <transition name="fade">
                  <div
                    v-if="variationFields1 === true"
                  >
                    <b-form-group
                      v-if="isVariation === true"
                      label="Variasi 1"
                      label-cols-md="2"
                      class="mt-1"
                    >
                      <b-col cols="8">
                        <b-form-group
                          label="Nama"
                          label-cols-md="3"
                        >
                          <validation-provider
                            #default="{errors}"
                            name="Variasi 1"
                          >
                            <b-row class="d-flex align-items-center">
                              <b-col
                                cols="11"
                                class=""
                              >
                                <b-form-input
                                  v-model="variationName1"
                                  placeholder="Masukan nama variasi"
                                  :state="errors.length > 0 ? false:null"
                                />
                              </b-col>
                              <b-col
                                cols="1"
                                class="pr-0 pl-0 text-center"
                              >
                                <b-button
                                  class="btn-icon"
                                  variant="light-dark"
                                  size="sm"
                                  @click="removeVariant1"
                                >
                                  <feather-icon
                                    icon="Trash2Icon"
                                  />
                                </b-button>
                              </b-col>
                            </b-row>
                            <small class="text-danger">{{ errors[0] }}</small>
                          </validation-provider>
                        </b-form-group>
                      </b-col>

                      <b-col
                        cols="8"
                      >
                        <b-form-group
                          label="Pilihan"
                          label-cols-md="3"
                        >
                          <draggable v-model="myList1">
                            <transition-group name="fade">
                              <b-row
                                v-for="(data, indexs) in formChoices1"
                                :key="indexs + 1"
                                class="d-flex align-items-center justify-content-center"
                              >
                                <b-col
                                  class="pt-0 pr-0 pb-0 mb-1"
                                >
                                  <validation-provider
                                    #default="{errors}"
                                    name="Pilihan"
                                  >
                                    <b-input-group>
                                      <b-form-input
                                        v-model="data.choices"
                                        placeholder="Masukan Pilihan Variasi"
                                        :state="errors.length > 0 ? false:null"
                                      />
                                      <b-input-group-append is-text>
                                        <feather-icon
                                          icon="AlignJustifyIcon"
                                        />
                                      </b-input-group-append>
                                    </b-input-group>
                                    <small class="text-danger">{{ errors[0] }}</small>
                                  </validation-provider>
                                </b-col>
                                <b-col
                                  v-if="formChoices1.length > 1"
                                  md="auto"
                                  class="mb-1"
                                >
                                  <b-button
                                    class="btn-icon"
                                    variant="light-dark"
                                    size="sm"
                                    @click="removeChoices1(indexs)"
                                  >
                                    <feather-icon
                                      icon="Trash2Icon"
                                    />
                                  </b-button>
                                </b-col>
                              </b-row>
                            </transition-group>
                          </draggable>
                        </b-form-group>
                      </b-col>

                      <b-col
                        v-if="formChoices1.length < 5"
                        cols="8"
                      >
                        <b-form-group
                          label=""
                          label-cols-md="3"
                        >
                          <b-button
                            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                            variant="outline-info"
                            @click="addChoices1"
                          >
                            <feather-icon
                              icon="PlusIcon"
                              class="mr-50"
                            />
                            <span class="align-middle">Tambahkan Pilihan</span>
                          </b-button>
                        </b-form-group>
                      </b-col>
                    </b-form-group>
                  </div>
                </transition>

                <transition name="fade">
                  <div
                    v-if="variationFields2 === true"
                  >
                    <b-form-group
                      v-if="isVariation === true"
                      label="Variasi 2"
                      label-cols-md="2"
                      class="mt-1"
                    >
                      <b-col cols="8">
                        <b-form-group
                          label="Nama"
                          label-cols-md="3"
                        >
                          <validation-provider
                            #default="{errors}"
                            name="Variasi 2"
                          >
                            <b-row class="d-flex align-items-center">
                              <b-col
                                cols="11"
                                class=""
                              >
                                <b-form-input
                                  v-model="variationName2"
                                  placeholder="Masukan nama variasi"
                                  :state="errors.length > 0 ? false:null"
                                />
                              </b-col>
                              <b-col
                                cols="1"
                                class="pr-0 pl-0 text-center"
                              >
                                <b-button
                                  class="btn-icon"
                                  variant="light-dark"
                                  size="sm"
                                  @click="removeVariant2"
                                >
                                  <feather-icon
                                    icon="Trash2Icon"
                                  />
                                </b-button>
                              </b-col>
                            </b-row>
                          </validation-provider>
                        </b-form-group>
                      </b-col>

                      <b-col
                        cols="8"
                      >
                        <b-form-group
                          label="Pilihan"
                          label-cols-md="3"
                        >
                          <draggable v-model="myList2">
                            <transition-group name="fade">
                              <b-row
                                v-for="(data, indexs) in formChoices2"
                                :key="indexs + 1"
                                class="d-flex align-items-center justify-content-center"
                              >
                                <b-col
                                  class="pt-0 pr-0 pb-0 mb-1"
                                >
                                  <b-input-group>
                                    <b-form-input
                                      v-model="data.choices"
                                      placeholder="Masukan Pilihan Variasi"
                                    />
                                    <b-input-group-append is-text>
                                      <feather-icon
                                        icon="AlignJustifyIcon"
                                      />
                                    </b-input-group-append>
                                  </b-input-group>
                                </b-col>
                                <b-col
                                  v-if="formChoices2.length > 1"
                                  md="auto"
                                  class="mb-1"
                                >
                                  <b-button
                                    class="btn-icon"
                                    variant="light-dark"
                                    size="sm"
                                    @click="removeChoices2(indexs)"
                                  >
                                    <feather-icon
                                      icon="Trash2Icon"
                                    />
                                  </b-button>
                                </b-col>
                              </b-row>
                            </transition-group>
                          </draggable>
                        </b-form-group>
                      </b-col>

                      <b-col
                        v-if="formChoices2.length < 5"
                        cols="8"
                      >
                        <b-form-group
                          label=""
                          label-cols-md="3"
                        >
                          <b-button
                            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                            variant="outline-info"
                            @click="addChoices2"
                          >
                            <feather-icon
                              icon="PlusIcon"
                              class="mr-50"
                            />
                            <span class="align-middle">Tambahkan Pilihan</span>
                          </b-button>
                        </b-form-group>
                      </b-col>
                    </b-form-group>
                  </div>
                </transition>

                <transition name="fade">
                  <div
                    v-if="variationFields3 === true"
                  >
                    <b-form-group
                      v-if="isVariation === true"
                      label="Variasi 3"
                      label-cols-md="2"
                      class="mt-1"
                    >
                      <b-col cols="8">
                        <b-form-group
                          label="Nama"
                          label-cols-md="3"
                        >
                          <b-row class="d-flex align-items-center">
                            <b-col
                              cols="11"
                              class=""
                            >
                              <b-form-input
                                v-model="variationName3"
                                placeholder="Masukan nama variasi"
                              />
                            </b-col>
                            <b-col
                              cols="1"
                              class="pr-0 pl-0 text-center"
                            >
                              <b-button
                                class="btn-icon"
                                variant="light-dark"
                                size="sm"
                                @click="removeVariant3"
                              >
                                <feather-icon
                                  icon="Trash2Icon"
                                />
                              </b-button>
                            </b-col>
                          </b-row>
                        </b-form-group>
                      </b-col>

                      <b-col
                        cols="8"
                      >
                        <b-form-group
                          label="Pilihan"
                          label-cols-md="3"
                        >
                          <draggable v-model="myList3">
                            <transition-group name="fade">
                              <b-row
                                v-for="(data, indexs) in formChoices3"
                                :key="indexs + 1"
                                class="d-flex align-items-center justify-content-center"
                              >
                                <b-col
                                  class="pt-0 pr-0 pb-0 mb-1"
                                >
                                  <b-input-group>
                                    <b-form-input
                                      v-model="data.choices"
                                      placeholder="Masukan Pilihan Variasi"
                                    />
                                    <b-input-group-append is-text>
                                      <feather-icon
                                        icon="AlignJustifyIcon"
                                      />
                                    </b-input-group-append>
                                  </b-input-group>
                                </b-col>
                                <b-col
                                  v-if="formChoices3.length > 1"
                                  md="auto"
                                  class="mb-1"
                                >
                                  <b-button
                                    class="btn-icon"
                                    variant="light-dark"
                                    size="sm"
                                    @click="removeChoices3(indexs)"
                                  >
                                    <feather-icon
                                      icon="Trash2Icon"
                                    />
                                  </b-button>
                                </b-col>
                              </b-row>
                            </transition-group>
                          </draggable>
                        </b-form-group>
                      </b-col>

                      <b-col
                        v-if="formChoices3.length < 5"
                        cols="8"
                      >
                        <b-form-group
                          label=""
                          label-cols-md="3"
                        >
                          <b-button
                            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                            variant="outline-info"
                            @click="addChoices3"
                          >
                            <feather-icon
                              icon="PlusIcon"
                              class="mr-50"
                            />
                            <span class="align-middle">Tambahkan Pilihan</span>
                          </b-button>
                        </b-form-group>
                      </b-col>
                    </b-form-group>
                  </div>
                </transition>

                <transition name="fade">
                  <b-form-group
                    v-if="variationFields1 === true && activeAddChoices1 === true"
                    label="Tambah Variasi"
                    label-cols-md="2"
                    class="mt-1"
                  >
                    <b-button
                      v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                      variant="outline-info"
                      @click="addVariationItems2"
                    >
                      <feather-icon
                        icon="PlusIcon"
                        class="mr-50"
                      />
                      <span class="align-middle">Tambahkan Variasi</span>
                    </b-button>
                  </b-form-group>
                </transition>

                <transition name="fade">
                  <b-form-group
                    v-if="variationFields2 === true && activeAddChoices2 === true "
                    label="Tambah Variasi"
                    label-cols-md="2"
                    class="mt-1"
                  >
                    <b-button
                      v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                      variant="outline-info"
                      @click="addVariationItems3"
                    >
                      <feather-icon
                        icon="PlusIcon"
                        class="mr-50"
                      />
                      <span class="align-middle">Tambahkan Variasi</span>
                    </b-button>
                  </b-form-group>
                </transition>

                <transition name="fade">
                  <b-form-group
                    v-if="isVariation === true"
                    label="Info Variasi"
                    label-cols-md="2"
                    class="mt-2"
                  >
                    <b-row class="d-flex align-items-center">
                      <b-col
                        md="6"
                        class="d-flex align-items-center"
                      >
                        <div class="d-flex align-items-center">
                          <b-button
                            variant="primary"
                            class="d-flex align-items-center"
                            @click.prevent="updateVariation"
                          >
                            Terapkan Perubahan Variasi
                          </b-button>
                        </div>
                      </b-col>

                    </b-row>
                  </b-form-group>
                </transition>

                <transition name="fade">
                  <b-form-group
                    v-if="isVariation === true"
                    label="Daftar Variasi"
                    label-cols-md="2"
                    class="mt-2"
                  >
                    <b-table
                      responsive
                      class="border position-relative"
                      :fields="fields"
                      :items="variantItems"
                    >

                      <template #cell(variant1)="data">
                        <div v-if="editMode === true && indexRow === data.index">
                          <b-col
                            cols="12"
                            class="mb-50"
                          >
                            <b-form-input
                              v-model="data.item.val"
                              class="mb-50"
                            />
                          </b-col>
                        </div>
                        <div v-else>
                          {{ data.item.val }}
                        </div>
                      </template>

                      <template #cell(variant2)="data">
                        <div v-if="editMode === true && indexRow === data.index">
                          <div
                            v-for="(items, index) in data.item.option"
                            :key="index + 1"
                          >
                            <b-form-input
                              v-model="items.val"
                              class="mb-50"
                            />
                          </div>
                        </div>
                        <div v-else>
                          <div
                            v-for="(items, index) in data.item.option"
                            :key="index + 1"
                          >
                            {{ items.val }}
                          </div>
                        </div>
                      </template>

                      <template #cell(variant3)="data">
                        <div v-if="editMode === true && indexRow === data.index">
                          <div
                            v-for="(items, index) in data.item.option"
                            :key="index + 1"
                          >
                            <div
                              v-for="(itemsVariant, indexVariant) in items.option"
                              :key="indexVariant + 1"
                            >
                              <b-form-input
                                v-model="itemsVariant.val"
                                class="mb-50"
                              />
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <div
                            v-for="(items, index) in data.item.option"
                            :key="index + 1"
                          >
                            <div
                              v-for="(itemsVariant, indexVariant) in items.option"
                              :key="indexVariant + 1"
                            >
                              {{ itemsVariant.val }}
                            </div>
                          </div>
                        </div>
                      </template>

                      <template #cell(price)="data">
                        <div v-if="editMode === true && indexRow === data.index">
                          <div
                            v-if="variationName3 !== null"
                          >
                            <div
                              v-for="(items, index) in data.item.option"
                              :key="index + 1"
                            >
                              <div
                                v-for="(itemsVariant, indexVariant) in items.option"
                                :key="indexVariant + 1"
                              >
                                <b-form-input
                                  v-model="itemsVariant.price"
                                  type="number"
                                  class="mb-50"
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 !== null"
                          >
                            <div
                              v-for="(items, index) in data.item.option"
                              :key="index + 1"
                            >
                              <b-form-input
                                v-model="items.price"
                                type="number"
                                class="mb-50"
                              />
                            </div>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 === null && variationName1 !== null"
                          >
                            <b-form-input
                              v-model="data.item.price"
                              type="number"
                              class="mb-50"
                            />
                          </div>
                        </div>
                        <div v-else>
                          <div
                            v-if="variationName3 !== null"
                          >
                            <div
                              v-for="(items, index) in data.item.option"
                              :key="index + 1"
                            >
                              <div
                                v-for="(itemsVariant, indexVariant) in items.option"
                                :key="indexVariant + 1"
                              >
                                Rp. {{ formatPrice(itemsVariant.price) }}
                              </div>
                            </div>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 !== null"
                          >
                            <div
                              v-for="(items, index) in data.item.option"
                              :key="index + 1"
                            >
                              Rp. {{ formatPrice(items.price) }}
                            </div>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 === null && variationName1 !== null"
                          >
                            Rp. {{ formatPrice(data.item.price) }}
                          </div>
                        </div>
                      </template>

                      <template #cell(stock)="data">
                        <div v-if="editMode === true && indexRow === data.index">
                          <div
                            v-if="variationName3 !== null"
                          >
                            <div
                              v-for="(items, index) in data.item.option"
                              :key="index + 1"
                            >
                              <div
                                v-for="(itemsVariant, indexVariant) in items.option"
                                :key="indexVariant + 1"
                              >
                                <b-form-input
                                  v-model="itemsVariant.stock"
                                  type="number"
                                  class="mb-50"
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 !== null"
                          >
                            <div
                              v-for="(items, index) in data.item.option"
                              :key="index + 1"
                            >
                              <b-form-input
                                v-model="items.stock"
                                type="number"
                                class="mb-50"
                              />
                            </div>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 === null && variationName1 !== null"
                          >
                            <b-form-input
                              v-model="data.item.stock"
                              type="number"
                              class="mb-50"
                            />
                          </div>
                        </div>
                        <div v-else>
                          <div
                            v-if="variationName3 !== null"
                          >
                            <div
                              v-for="(items, index) in data.item.option"
                              :key="index + 1"
                            >
                              <div
                                v-for="(itemsVariant, indexVariant) in items.option"
                                :key="indexVariant + 1"
                              >
                                {{ itemsVariant.stock }}
                              </div>
                            </div>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 !== null"
                          >
                            <div
                              v-for="(items, index) in data.item.option"
                              :key="index + 1"
                            >
                              {{ items.stock }}
                            </div>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 === null && variationName1 !== null"
                          >
                            {{ data.item.stock }}
                          </div>
                        </div>
                      </template>

                      <template #cell(action)="data">
                        <b-button
                          variant="flat-secondary"
                          class="btn-icon"
                          @click="editTable(data)"
                        >
                          <feather-icon
                            icon="EditIcon"
                          />
                        </b-button>
                        <b-button
                          v-if="editMode === true && indexRow === data.index"
                          variant="flat-primary"
                          class="btn-icon"
                          @click="updateTable"
                        >
                          <b-spinner
                            v-if="loadingSubmitVariant"
                            small
                            variant="primary"
                          />
                          Simpan
                        </b-button>
                      </template>

                    </b-table>
                  </b-form-group>
                </transition>

              </b-form-group>
            </b-col>

            <b-col
              v-if="isVariation === false"
              cols="12"
            >
              <b-form-group
                label="Stok"
                label-cols-md="2"
              >
                <b-form-input
                  v-model="stockProduct"
                  placeholder="Masukan jumlah stok barang"
                  @keypress="onlyNumber"
                />
              </b-form-group>
            </b-col>

            <b-col
              v-if="isVariation === false"
              cols="12"
            >
              <b-form-group
                label="Harga"
                label-cols-md="2"
              >
                <b-form-input
                  v-model="priceProduct"
                  placeholder="Rp  |  Masukan harga barang"
                />
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-form-group
                label="Pengiriman"
                label-cols-md="2"
              />
            </b-col>

            <b-col md="4">
              <b-form-group
                label="Berat"
                label-cols-md="3"
                class="ml-5"
              >
                <b-col class="d-flex align-items-center">
                  <b-input-group class="input-group-merge">
                    <b-form-input
                      id="hi-first-name"
                      v-model="weightProduct"
                      type="number"
                      placeholder="1000"
                    />
                    <b-input-group-append is-text>
                      gram
                    </b-input-group-append>
                  </b-input-group>
                </b-col>
              </b-form-group>
            </b-col>

            <b-col md="12">
              <b-form-group
                label="Ukuran"
                label-cols-md="1"
                content-cols-md="5"
                class="ml-5"
              >
                <b-row
                  class="d-flex align-items-center"
                >
                  <b-col class="d-flex align-items-center">
                    <b-input-group class="input-group-merge">
                      <b-form-input
                        id="hi-first-name"
                        v-model="lengthProduct"
                        type="number"
                        placeholder="P"
                      />
                      <b-input-group-append is-text>
                        cm
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                  <b-col class="d-flex align-items-center">
                    <b-input-group class="input-group-merge">
                      <b-form-input
                        id="hi-first-name"
                        v-model="widthProduct"
                        type="number"
                        placeholder="L"
                      />
                      <b-input-group-append is-text>
                        cm
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                  <b-col class="d-flex align-items-center">
                    <b-input-group class="input-group-merge">
                      <b-form-input
                        id="hi-first-name"
                        v-model="heightProduct"
                        type="number"
                        placeholder="T"
                      />
                      <b-input-group-append is-text>
                        cm
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>

            <b-col
              cols="10"
              class="mt-2"
            >
              <b-form-group
                label="Pembayaran"
                label-cols-sm="2"
              >
                <div
                  class="demo-inline-spacing"
                >
                  <b-form-checkbox
                    v-model="cod"
                    class="custom-control-primary"
                  >
                    Bayar Ditempat (COD)
                  </b-form-checkbox>
                  <b-form-checkbox
                    v-model="transfer"
                    class="custom-control-primary"
                  >
                    Transfer Bank
                  </b-form-checkbox>
                </div>
              </b-form-group>
            </b-col>
            <b-col
              cols="12"
              class="d-flex justify-content-end pb-2 pr-2"
            >
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="outline-primary"
                class="mr-1"
                @click="submitDraft"
              >
                <b-spinner
                  v-if="loadingSubmitDraft"
                  small
                  variant="primary"
                />
                Simpan Draft
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="primary"
                @click.prevent="submitPublish"
              >
                <b-spinner
                  v-if="loadingSubmit"
                  small
                  variant="light"
                />
                Publish
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>

    </b-card-actions>
  </b-overlay>
</template>

<script>
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormFile,
  BForm,
  BButton,
  BFormTextarea,
  BTable,
  BFormCheckbox,
  BInputGroupAppend,
  BInputGroup,
  BAvatar,
  BSpinner,
  BOverlay,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import draggable from 'vuedraggable'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { required } from '@validations'
import { heightTransition } from '@core/mixins/ui/transition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import BCardActions from '@/@core/components/b-card-actions/BCardActions.vue'
import useJwt from '@/auth/jwt/useJwt'
import httpKomship from '../setting-kompship/http_komship'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormFile,
    BForm,
    BButton,
    BCardActions,
    BFormTextarea,
    BTable,
    BFormCheckbox,
    BInputGroupAppend,
    BInputGroup,
    draggable,
    ValidationObserver,
    ValidationProvider,
    BAvatar,
    BSpinner,
    BOverlay,
  },
  directives: {
    Ripple,
  },
  mixins: [heightTransition],
  data() {
    return {

      productId: this.$route.params.product_id,

      loading: false,
      loadingSubmit: false,
      loadingSubmitDraft: false,
      loadingSubmitVariant: false,
      partnerId: JSON.parse(localStorage.getItem('userData')),

      isVariation: false,
      formChoices1: [{ choices: null }],
      formChoices2: [{ choices: null }],
      formChoices3: [{ choices: null }],

      variationFields1: false,
      variationFields2: false,
      variationFields3: false,

      activeAddChoices1: false,
      activeAddChoices2: false,
      activeAddChoices3: false,

      variationName1: null,
      variationName2: null,
      variationName3: null,

      variantChoices1: null,

      // Table
      fields: [],
      variantItems: [],
      stock: null,
      price: null,

      fieldEditData: '',

      imageFile: null,
      imageInitialFile: null,

      editMode: false,

      indexRow: null,

      // Data Store
      productName: '',
      skuName: '',
      descriptionProduct: '',
      weightProduct: null,
      lengthProduct: null,
      widthProduct: null,
      heightProduct: null,
      cod: false,
      transfer: false,
      stockProduct: 0,
      priceProduct: 0,
      variantStore: [],
      optionStore: [],

      flavours: [],

      // Validation
      required,
      fieldImage: [],

      fieldPreviewImage: [],
      fieldEditVariation: [],

    }
  },
  computed: {
    myList1: {
      get() {
        return this.$store.state.myList1
      },
      set(value) {
        this.$store.commit('updateList', value)
      },
    },
    myList2: {
      get() {
        return this.$store.state.myList2
      },
      set(value) {
        this.$store.commit('updateList', value)
      },
    },
    myList3: {
      get() {
        return this.$store.state.myList3
      },
      set(value) {
        this.$store.commit('updateList', value)
      },
    },
    myList4: {
      get() {
        return this.$store.state.myList4
      },
      set(value) {
        this.$store.commit('updateList', value)
      },
    },
    myList5: {
      get() {
        return this.$store.state.myList5
      },
      set(value) {
        this.$store.commit('updateList', value)
      },
    },
    itemsProvider() {
      const fields = [...this.fields]
      return fields
    },
  },
  mounted() {
    this.loadProduct()
  },
  methods: {
    onlyNumber($event) {
      const keyCode = ($event.keyCode ? $event.keyCode : $event.which)
      if (keyCode < 48 || keyCode > 57) {
        $event.preventDefault()
      }
    },
    loadProduct() {
      this.loading = true
      if (this.variantItems !== []) {
        this.variantItems = []
      }
      httpKomship.get(`/v1/product/detail/${this.productId}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        this.fieldEditVariation = data
        this.productName = data.product_name
        this.skuName = data.product_sku
        this.descriptionProduct = data.product_description
        if (data.product_image[0] !== undefined) {
          this.imageInitialFile = data.product_image[0].images_path
        }
        this.stockProduct = data.product_stock
        this.priceProduct = data.product_price
        this.weightProduct = data.product_weight
        this.lengthProduct = data.product_length
        this.widthProduct = data.product_width
        this.heightProduct = data.product_height

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.flavors.length; i++) {
          if (data.flavors[i] === 'COD') {
            this.cod = true
          }
          if (data.flavors[i] === 'BANK TRANSFER') {
            this.transfer = true
          }
        }

        if (data.product_is_variant === '1') {
          this.isVariation = true
          this.stockProduct = 0
          this.priceProduct = 0
        }

        if (data.variants[0] !== undefined) {
          this.variationFields1 = true
          this.variationName1 = data.variants[0].variant_name
        }

        if (data.variants[1] !== undefined) {
          this.variationFields2 = true
          this.variationName2 = data.variants[1].variant_name
        }

        if (data.variants[2] !== undefined) {
          this.variationFields3 = true
          this.variationName3 = data.variants[2].variant_name
        }

        if (this.variationName1 !== null) {
          this.addVariation()
        }

        if (this.variationName2 !== null) {
          this.addVariationItems2()
        }

        if (this.variationName3 !== null) {
          this.addVariationItems3()
        }

        // Create Table
        if (data.options !== undefined) {
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < data.options.length; i++) {
            this.formChoices1.push({ choices: '' })
            this.formChoices1[i].choices = data.options[i].option_name
            this.variantItems.push({
              val: data.options[i].option_name,
              parent: 0,
              sold: data.options[i].sold,
              stock: data.options[i].variant_stock,
              price: data.options[i].option_price,
              option: [],
            })
            if (data.options[i].options[0] !== undefined) {
              // eslint-disable-next-line no-plusplus
              for (let j = 0; j < data.options[i].options.length; j++) {
                this.formChoices2.push({ choices: '' })
                this.formChoices2[j].choices = data.options[i].options[j].option_name
                this.variantItems[i].option.push({
                  val: data.options[i].options[j].option_name,
                  parent: 0,
                  sold: data.options[i].options[j].sold,
                  stock: data.options[i].options[j].variant_stock,
                  price: data.options[i].options[j].option_price,
                  option: [],
                })
                if (data.options[i].options[j].options[0] !== undefined) {
                  // eslint-disable-next-line no-plusplus
                  for (let k = 0; k < data.options[i].options[j].options.length; k++) {
                    this.formChoices3.push({ choices: '' })
                    this.formChoices3[k].choices = data.options[i].options[j].options[k].option_name
                    this.variantItems[i].option[j].option.push({
                      val: data.options[i].options[j].options[k].option_name,
                      parent: 0,
                      sold: data.options[i].options[j].options[k].sold,
                      stock: data.options[i].options[j].options[k].variant_stock,
                      price: data.options[i].options[j].options[k].option_price,
                    })
                  }
                }
              }
            }
          }
        }

        // Delete empty choices
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.formChoices1.length; x++) {
          if (this.formChoices1[x].choices === '') {
            this.formChoices1.splice(x, 1)
          }
          // eslint-disable-next-line no-plusplus
          for (let y = 0; y < this.formChoices2.length; y++) {
            if (this.formChoices2[y].choices === '') {
              this.formChoices2.splice(y, 1)
            }
            // eslint-disable-next-line no-plusplus
            for (let z = 0; z < this.formChoices3.length; z++) {
              if (this.formChoices3[z].choices === '') {
                this.formChoices3.splice(z, 1)
              }
            }
          }
        }

        if (this.variationName1 !== null) {
          this.fields.push({
            key: 'variant1',
            label: String(this.variationName1),
          })
        }
        if (this.variationName2 !== null) {
          this.fields.push({
            key: 'variant2',
            label: String(this.variationName2),
          })
        }
        if (this.variationName3 !== null) {
          this.fields.push({
            key: 'variant3',
            label: String(this.variationName3),
          })
        }
        this.fields.push({
          key: 'price',
          label: 'Harga',
        })
        this.fields.push({
          key: 'stock',
          label: 'Stok',
        })
        this.fields.push(
          {
            key: 'action',
            label: 'Aksi',
            class: 'col-action',
          },
        )

        // Delete Null Data
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.formChoices1.length; x++) {
          if (this.formChoices1[x].choices === null) {
            this.formChoices1.splice(x, 1)
          }
        }
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.formChoices2.length; x++) {
          if (this.formChoices2[x].choices === null) {
            this.formChoices2.splice(x, 1)
          }
        }
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.formChoices3.length; x++) {
          if (this.formChoices3[x].choices === null) {
            this.formChoices3.splice(x, 1)
          }
        }

        this.loading = false
      })
    },
    updateVariation() {
      this.variantItems = []
      this.fields = []

      if (this.variationName3 !== null) {
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.formChoices1.length; x++) {
          this.variantItems.push({
            val: this.formChoices1[x].choices,
            parent: 0,
            sold: 0,
            stock: 0,
            price: 0,
            option: [],
          })
          // eslint-disable-next-line no-plusplus
          for (let y = 0; y < this.formChoices2.length; y++) {
            this.variantItems[x].option.push({
              val: this.formChoices2[y].choices,
              parent: 0,
              sold: 0,
              stock: 0,
              price: 0,
              option: [],
            })
            // eslint-disable-next-line no-plusplus
            for (let z = 0; z < this.formChoices3.length; z++) {
              if (this.fieldEditVariation.options[x] !== undefined) {
                if (this.fieldEditVariation.options[x].options[y] !== undefined) {
                  if (this.fieldEditVariation.options[x].options[y].options[z] !== undefined) {
                    this.variantItems[x].option[y].option.push({
                      val: this.formChoices3[z].choices,
                      parent: 0,
                      sold: this.fieldEditVariation.options[x].options[y].options[z].sold,
                      stock: this.fieldEditVariation.options[x].options[y].options[z].variant_stock,
                      price: this.fieldEditVariation.options[x].options[y].options[z].option_price,
                    })
                  } else {
                    this.variantItems[x].option[y].option.push({
                      val: this.formChoices3[z].choices,
                      parent: 0,
                      sold: 0,
                      stock: 0,
                      price: 0,
                    })
                  }
                } else {
                  this.variantItems[x].option[y].option.push({
                    val: this.formChoices3[z].choices,
                    parent: 0,
                    sold: 0,
                    stock: 0,
                    price: 0,
                  })
                }
              } else {
                this.variantItems[x].option[y].option.push({
                  val: this.formChoices3[z].choices,
                  parent: 0,
                  sold: 0,
                  stock: 0,
                  price: 0,
                })
              }
            }
          }
        }
      } else if (this.variationName3 === null && this.variationName2 !== null) {
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.formChoices1.length; x++) {
          this.variantItems.push({
            val: this.formChoices1[x].choices,
            parent: 0,
            sold: 0,
            stock: 0,
            price: 0,
            option: [],
          })
          // eslint-disable-next-line no-plusplus
          for (let y = 0; y < this.formChoices2.length; y++) {
            if (this.fieldEditVariation.options[x] !== undefined) {
              if (this.fieldEditVariation.options[x].options[y] !== undefined) {
                this.variantItems[x].option.push({
                  val: this.formChoices2[y].choices,
                  parent: 0,
                  sold: this.fieldEditVariation.options[x].options[y].sold,
                  stock: this.fieldEditVariation.options[x].options[y].variant_stock,
                  price: this.fieldEditVariation.options[x].options[y].option_price,
                })
              } else {
                this.variantItems[x].option.push({
                  val: this.formChoices2[y].choices,
                  parent: 0,
                  sold: 0,
                  stock: 0,
                  price: 0,
                })
              }
            } else {
              this.variantItems[x].option.push({
                val: this.formChoices2[y].choices,
                parent: 0,
                sold: 0,
                stock: 0,
                price: 0,
              })
            }
          }
        }
      } else if (this.variationName3 === null && this.variationName2 === null && this.variationName1 !== null) {
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.formChoices1.length; x++) {
          if (this.fieldEditVariation.options[x] !== undefined) {
            this.variantItems.push({
              val: this.formChoices1[x].choices,
              parent: 0,
              sold: this.fieldEditVariation.options[x].sold,
              stock: this.fieldEditVariation.options[x].variant_stock,
              price: this.fieldEditVariation.options[x].option_price,
            })
          } else {
            this.variantItems.push({
              val: this.formChoices1[x].choices,
              parent: 0,
              sold: 0,
              stock: 0,
              price: 0,
            })
          }
        }
      }

      // Delete empty choices
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < this.formChoices1.length; x++) {
        if (this.formChoices1[x].choices === '') {
          this.formChoices1.splice(x, 1)
        }
        // eslint-disable-next-line no-plusplus
        for (let y = 0; y < this.formChoices2.length; y++) {
          if (this.formChoices2[y].choices === '') {
            this.formChoices2.splice(y, 1)
          }
          // eslint-disable-next-line no-plusplus
          for (let z = 0; z < this.formChoices3.length; z++) {
            if (this.formChoices3[z].choices === '') {
              this.formChoices3.splice(z, 1)
            }
          }
        }
      }

      if (this.variationName1 !== null) {
        this.fields.push({
          key: 'variant1',
          label: String(this.variationName1),
        })
      }
      if (this.variationName2 !== null) {
        this.fields.push({
          key: 'variant2',
          label: String(this.variationName2),
        })
      }
      if (this.variationName3 !== null) {
        this.fields.push({
          key: 'variant3',
          label: String(this.variationName3),
        })
      }
      this.fields.push({
        key: 'price',
        label: 'Harga',
      })
      this.fields.push({
        key: 'stock',
        label: 'Stok',
      })
      this.fields.push(
        {
          key: 'action',
          label: 'Aksi',
          class: 'col-action',
        },
      )
    },
    submitPublish() {
      this.loadingSubmit = true

      this.$refs.formRules.validate().then(success => {
        if (success) {
          if (this.variationName3 !== null) {
            this.variantStore.push(
              {
                val: this.variationName1,
              },
              {
                val: this.variationName2,
              },
              {
                val: this.variationName3,
              },
            )

            // eslint-disable-next-line no-plusplus
            for (let x = 0; x < this.variantItems.length; x++) {
              this.optionStore.push(
                {
                  val: this.variantItems[x].val,
                  parent: 0,
                  stock: null,
                  price: null,
                  sold: this.variantItems[x].sold,
                  option: [],
                },
              )
              // eslint-disable-next-line no-plusplus
              for (let y = 0; y < this.variantItems[x].option.length; y++) {
                this.optionStore[x].option.push(
                  {
                    val: this.variantItems[x].option[y].val,
                    parent: 0,
                    stock: null,
                    price: null,
                    sold: this.variantItems[x].option[y].sold,
                    option: [],
                  },
                )
                // eslint-disable-next-line no-plusplus
                for (let z = 0; z < this.variantItems[x].option[y].option.length; z++) {
                  this.optionStore[x].option[y].option.push(
                    {
                      val: this.variantItems[x].option[y].option[z].val,
                      parent: 0,
                      stock: this.variantItems[x].option[y].option[z].stock,
                      price: this.variantItems[x].option[y].option[z].price,
                      sold: this.variantItems[x].option[y].option[z].sold,
                    },
                  )
                }
              }
            }
          } else if (this.variationName3 === null && this.variationName2 !== null) {
            this.variantStore.push(
              {
                val: this.variationName1,
              },
              {
                val: this.variationName2,
              },
            )
            // eslint-disable-next-line no-plusplus
            for (let x = 0; x < this.variantItems.length; x++) {
              this.optionStore.push(
                {
                  val: this.variantItems[x].val,
                  parent: 0,
                  stock: null,
                  price: null,
                  sold: this.variantItems[x].sold,
                  option: [],
                },
              )
              // eslint-disable-next-line no-plusplus
              for (let y = 0; y < this.variantItems[x].option.length; y++) {
                this.optionStore[x].option.push(
                  {
                    val: this.variantItems[x].option[y].val,
                    parent: 0,
                    stock: this.variantItems[x].option[y].stock,
                    price: this.variantItems[x].option[y].price,
                    sold: this.variantItems[x].option[y].sold,
                  },
                )
              }
            }
          } else if (this.variationName3 === null && this.variationName2 === null && this.variationName1 !== null) {
            this.variantStore.push(
              {
                val: this.variationName1,
              },
            )
            // eslint-disable-next-line no-plusplus
            for (let x = 0; x < this.variantItems.length; x++) {
              this.optionStore.push(
                {
                  val: this.variantItems[x].val,
                  parent: 0,
                  stock: this.variantItems[x].stock,
                  price: this.variantItems[x].price,
                  sold: this.variantItems[x].sold,
                },
              )
            }
          }

          if (this.cod === true) {
            this.flavours.push('COD')
          }
          if (this.transfer === true) {
            this.flavours.push('BANK TRANSFER')
          }

          const params = {
            product_name: this.productName,
            sku: this.skuName,
            description: this.descriptionProduct,
            weight: this.weightProduct,
            length: this.lengthProduct,
            width: this.widthProduct,
            height: this.heightProduct,
            price: this.priceProduct !== 0 ? this.priceProduct : this.price,
            stock: this.stockProduct !== 0 ? this.stockProduct : this.stock,
            status: 1,
            flavours: this.flavours,
            variant_option: this.variantStore,
            option: this.optionStore,
          }

          console.log(params)

          httpKomship.put(`/v1/product/update/${this.productId}`, params, {
            headers: { Authorization: `Bearer ${useJwt.getToken()}` },
          }).then(() => {
            if (this.imageFile) {
              // Update Image
              const formData = new FormData()
              formData.append('product_id', this.productId)
              formData.append('image_path', this.imageFile)
              httpKomship.post('/v1/product/update-upload-img-product', formData, {
                headers: { Authorization: `Bearer ${useJwt.getToken()}` },
              }).then(() => {
                this.loadingSubmit = false
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Success',
                    icon: 'CheckIcon',
                    text: 'Success update produk',
                    variant: 'success',
                  },
                })
                this.$router.push({ name: this.$route.meta.routeAllProduk, query: { tab: 'semua' } })
              }).catch(() => {
                this.loadingSubmit = false
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Failed',
                    icon: 'AlertCircleIcon',
                    text: 'Gagal update gambar produk, silahkan coba lagi!',
                    variant: 'danger',
                  },
                })
              })
            } else {
              this.loadingSubmit = false
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: 'Success update produk',
                  variant: 'success',
                },
              })
              this.$router.push({ name: this.$route.meta.routeAllProduk, query: { tab: 'semua' } })
            }
          }).catch(() => {
            this.loadingSubmit = false
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Failed',
                icon: 'AlertCircleIcon',
                text: 'Failed update produk',
                variant: 'danger',
              },
            })
          })
        } else {
          this.loadingSubmit = false
        }
      })
    },
    submitDraft() {
      this.loadingSubmitDraft = true

      this.$refs.formRules.validate().then(success => {
        if (success) {
          if (this.variationName3 !== null) {
            this.variantStore.push(
              {
                val: this.variationName1,
              },
              {
                val: this.variationName2,
              },
              {
                val: this.variationName3,
              },
            )

            // eslint-disable-next-line no-plusplus
            for (let x = 0; x < this.variantItems.length; x++) {
              this.optionStore.push(
                {
                  val: this.variantItems[x].val,
                  parent: 0,
                  stock: null,
                  price: null,
                  sold: this.variantItems[x].sold,
                  option: [],
                },
              )
              // eslint-disable-next-line no-plusplus
              for (let y = 0; y < this.variantItems[x].option.length; y++) {
                this.optionStore[x].option.push(
                  {
                    val: this.variantItems[x].option[y].val,
                    parent: 0,
                    stock: null,
                    price: null,
                    sold: this.variantItems[x].option[y].sold,
                    option: [],
                  },
                )
                // eslint-disable-next-line no-plusplus
                for (let z = 0; z < this.variantItems[x].option[y].option.length; z++) {
                  this.optionStore[x].option[y].option.push(
                    {
                      val: this.variantItems[x].option[y].option[z].val,
                      parent: 0,
                      stock: this.variantItems[x].option[y].option[z].stock,
                      price: this.variantItems[x].option[y].option[z].price,
                      sold: this.variantItems[x].option[y].option[z].sold,
                    },
                  )
                }
              }
            }
          } else if (this.variationName3 === null && this.variationName2 !== null) {
            this.variantStore.push(
              {
                val: this.variationName1,
              },
              {
                val: this.variationName2,
              },
            )
            // eslint-disable-next-line no-plusplus
            for (let x = 0; x < this.variantItems.length; x++) {
              this.optionStore.push(
                {
                  val: this.variantItems[x].val,
                  parent: 0,
                  stock: null,
                  price: null,
                  sold: this.variantItems[x].sold,
                  option: [],
                },
              )
              // eslint-disable-next-line no-plusplus
              for (let y = 0; y < this.variantItems[x].option.length; y++) {
                this.optionStore[x].option.push(
                  {
                    val: this.variantItems[x].option[y].val,
                    parent: 0,
                    stock: this.variantItems[x].option[y].stock,
                    price: this.variantItems[x].option[y].price,
                    sold: this.variantItems[x].option[y].sold,
                  },
                )
              }
            }
          } else if (this.variationName3 === null && this.variationName2 === null && this.variationName1 !== null) {
            this.variantStore.push(
              {
                val: this.variationName1,
              },
            )
            // eslint-disable-next-line no-plusplus
            for (let x = 0; x < this.variantItems.length; x++) {
              this.optionStore.push(
                {
                  val: this.variantItems[x].val,
                  parent: 0,
                  stock: this.variantItems[x].stock,
                  price: this.variantItems[x].price,
                  sold: this.variantItems[x].sold,
                },
              )
            }
          }

          if (this.cod === true) {
            this.flavours.push('COD')
          }
          if (this.transfer === true) {
            this.flavours.push('BANK TRANSFER')
          }

          const params = {
            product_name: this.productName,
            sku: this.skuName,
            description: this.descriptionProduct,
            weight: this.weightProduct,
            length: this.lengthProduct,
            width: this.widthProduct,
            height: this.heightProduct,
            price: this.priceProduct !== 0 ? this.priceProduct : this.price,
            stock: this.stockProduct !== 0 ? this.stockProduct : this.stock,
            status: 0,
            flavours: this.flavours,
            variant_option: this.variantStore,
            option: this.optionStore,
          }

          httpKomship.put(`/v1/product/update/${this.productId}`, params, {
            headers: { Authorization: `Bearer ${useJwt.getToken()}` },
          }).then(() => {
            // Update Image
            const formData = new FormData()
            formData.append('product_id', this.productId)
            formData.append('image_path', this.imageFile)
            httpKomship.post('/v1/product/update-upload-img-product', formData, {
              headers: { Authorization: `Bearer ${useJwt.getToken()}` },
            }).then(() => {
              this.loadingSubmitDraft = false
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: 'Success update produk',
                  variant: 'success',
                },
              })
              this.$router.push({ name: this.$route.meta.routeAllProduk, query: { tab: 'semua' } })
            }).catch(() => {
              this.loadingSubmitDraft = false
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Failed',
                  icon: 'AlertCircleIcon',
                  text: 'Gagal update gambar produk, silahkan coba lagi!',
                  variant: 'danger',
                },
              })
            })
          }).catch(() => {
            this.loadingSubmitDraft = false
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Failed',
                icon: 'AlertCircleIcon',
                text: 'Failed update produk',
                variant: 'danger',
              },
            })
          })
        } else {
          this.loadingSubmitDraft = false
        }
      })
    },
    addVariation() {
      this.isVariation = true
      this.variationFields1 = true
      this.activeAddChoices1 = true
    },
    addVariationItems2() {
      this.variationFields2 = true
      this.activeAddChoices2 = true
      this.activeAddChoices1 = false
    },
    addVariationItems3() {
      this.variationFields3 = true
      this.activeAddChoices3 = true
      this.activeAddChoices2 = false
    },
    addChoices1() {
      this.formChoices1.push({ choices: null })
    },
    addChoices2() {
      this.formChoices2.push({ choices: null })
    },
    addChoices3() {
      this.formChoices3.push({ choices: null })
    },
    removeChoices1(index) {
      this.formChoices1.splice(index, 1)
    },
    removeChoices2(index) {
      this.formChoices2.splice(index, 1)
    },
    removeChoices3(index) {
      this.formChoices3.splice(index, 1)
    },
    editTable(data) {
      this.indexRow = data.index
      this.rowSelected = data.rowSelected
      this.rowSelected = true
      this.editMode = true
    },
    updateTable() {
      this.editMode = false
    },
    removeVariant1() {
      this.variationName1 = ''
      this.variationFields1 = false
      if (this.variationFields2 === false && this.variationFields3 === false) {
        this.isVariation = false
      }
      this.formChoices1 = [{ choices: null }]
    },
    removeVariant2() {
      this.variationName2 = ''
      this.variationFields2 = false
      this.activeAddChoices1 = true
      if (this.variationFields1 === false && this.variationFields3 === false) {
        this.isVariation = false
      }
      this.formChoices2 = [{ choices: null }]
    },
    removeVariant3() {
      this.variationName3 = ''
      this.variationFields3 = false
      this.activeAddChoices2 = true
      if (this.variationFields1 === false && this.variationFields2 === false) {
        this.isVariation = false
      }
      this.formChoices3 = [{ choices: null }]
    },
    formatPrice(value) {
      const val = value
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    fileUrl: file => (file ? URL.createObjectURL(file) : null),
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
* {
  font-family: Poppins;
}
</style>
