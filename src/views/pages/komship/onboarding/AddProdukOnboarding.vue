<template>
  <b-card-actions
    ref="formCard"
    title="Tambah Produk"
    no-actions
  >
    <validation-observer ref="formRules">
      <b-form
        class="mt-3"
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

                <!-- Preview Image -->
                <transition name="fade">
                  <b-avatar
                    v-if="imageFile !== null"
                    variant="light-primary"
                    size="50"
                    :src="imageFile ? fileUrl(imageFile) : imageInitialFile"
                    class="mr-50"
                  />
                </transition>
                <!-- Button Upload Image -->
                <label
                  for="uploadImage"
                >
                  <b-avatar
                    v-if="imageFile === null"
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
                  v-if="imageFile !== null"
                  for="uploadImage"
                  class="btn btn-flat-dark btn-icon"
                >
                  <feather-icon
                    icon="EditIcon"
                    size="20"
                  />
                </label>

                <!-- Field Gambar -->
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
                <small class="text-primary">{{ errors[0] }}</small>
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
                          <small class="text-primary">{{ errors[0] }}</small>
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
                                  <small class="text-primary">{{ errors[0] }}</small>
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
                    <b-col md="4">
                      <b-form-input
                        v-model="price"
                        type="number"
                        placeholder="Rp | Harga"
                      />
                    </b-col>

                    <b-col md="2">
                      <b-form-input
                        v-model="stock"
                        type="number"
                        placeholder="Stok"
                      />
                    </b-col>

                    <b-col
                      md="6"
                      class="d-flex align-items-center"
                    >
                      <div class="d-flex align-items-center">
                        <b-button
                          variant="primary"
                          class="d-flex align-items-center"
                          @click="createListVariation"
                        >
                          Terapkan Kesemua
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
                  <b-overlay
                    :show="loading"
                    variant="light"
                    spinner-variant="primary"
                    rounded="sm"
                    opacity=".5"
                    blur="0"
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
                              v-model="data.item.variant1.val"
                              class="mb-50"
                            />
                          </b-col>
                        </div>
                        <div v-else>
                          <b-col
                            cols="12"
                            class="mb-50"
                          >
                            {{ data.item.variant1.val }}
                          </b-col>
                        </div>
                      </template>

                      <template #cell(variant2)="data">
                        <div v-if="editMode === true && indexRow === data.index">
                          <b-col
                            cols="12"
                            class="mb-50"
                          >
                            <div
                              v-for="(dataItem, index) in data.item.variant1.option"
                              :key="index+1"
                            >
                              <b-form-input
                                v-model="dataItem.variant2.val"
                                class="mb-50"
                              />
                            </div>
                          </b-col>
                        </div>
                        <div v-else>
                          <b-col
                            cols="12"
                            class="mb-50"
                          >
                            <div
                              v-for="(dataItem, index) in data.item.variant1.option"
                              :key="index+1"
                            >
                              {{ dataItem.variant2.val }}
                            </div>
                          </b-col>
                        </div>
                      </template>

                      <template #cell(variant3)="data">
                        <div v-if="editMode === true && indexRow === data.index">
                          <b-col
                            cols="12"
                            class="mb-50"
                          >
                            <div
                              v-for="(dataItem, index) in data.item.variant1.option"
                              :key="index+1"
                            >
                              <div
                                v-for="(dataVariant, indexVariant) in dataItem.variant2.option"
                                :key="indexVariant+1"
                              >
                                <b-form-input
                                  v-model="dataVariant.variant3.val"
                                  class="mb-50"
                                />
                              </div>
                            </div>
                          </b-col>
                        </div>
                        <div v-else>
                          <b-col
                            cols="12"
                            class="mb-50"
                          >
                            <div
                              v-for="(dataItem, index) in data.item.variant1.option"
                              :key="index+1"
                            >
                              <div
                                v-for="(dataVariant, indexVariant) in dataItem.variant2.option"
                                :key="indexVariant+1"
                              >
                                {{ dataVariant.variant3.val }}
                              </div>
                            </div>
                          </b-col>
                        </div>
                      </template>

                      <template #cell(price)="data">
                        <div v-if="editMode === true && indexRow === data.index">
                          <div
                            v-if="variationName3 !== null"
                          >
                            <b-col
                              v-for="(item, indexVariant) in data.item.variant1.option"
                              :key="indexVariant+1"
                              cols="12"
                            >
                              <div
                                v-for="(itemsVariant, indexVariantPrice) in item.variant2.option"
                                :key="indexVariantPrice+1"
                              >
                                <b-form-input
                                  v-model="itemsVariant.variant3.price"
                                  type="number"
                                />
                              </div>
                            </b-col>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 !== null"
                          >
                            <b-col
                              v-for="(item, indexVariant) in data.item.variant1.option"
                              :key="indexVariant+1"
                              cols="12"
                            >
                              <b-form-input
                                v-model="item.variant2.price"
                                type="number"
                              />
                            </b-col>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 === null && variationName1 !== null"
                          >
                            <b-form-input
                              v-model="data.item.variant1.price"
                              type="number"
                            />
                          </div>
                        </div>
                        <div v-else>
                          <div
                            v-if="variationName3 !== null"
                          >
                            <b-col
                              v-for="(item, indexVariant) in data.item.variant1.option"
                              :key="indexVariant+1"
                              cols="12"
                            >
                              <div
                                v-for="(itemsVariant, indexVariantPrice) in item.variant2.option"
                                :key="indexVariantPrice+1"
                              >
                                Rp. {{ formatPrice(itemsVariant.variant3.price) }}
                              </div>
                            </b-col>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 !== null"
                          >
                            <b-col
                              v-for="(item, indexVariant) in data.item.variant1.option"
                              :key="indexVariant+1"
                              cols="12"
                            >
                              Rp. {{ formatPrice(item.variant2.price) }}
                            </b-col>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 === null && variationName1 !== null"
                          >
                            Rp. {{ formatPrice(data.item.variant1.price) }}
                          </div>
                        </div>
                      </template>

                      <template #cell(stock)="data">
                        <div v-if="editMode === true && indexRow === data.index">
                          <div
                            v-if="variationName3 !== null"
                          >
                            <b-col
                              v-for="(item, indexVariant) in data.item.variant1.option"
                              :key="indexVariant+1"
                              cols="12"
                            >
                              <div
                                v-for="(itemsVariant, indexVariantPrice) in item.variant2.option"
                                :key="indexVariantPrice+1"
                              >
                                <b-form-input
                                  v-model="itemsVariant.variant3.stock"
                                  type="number"
                                />
                              </div>
                            </b-col>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 !== null"
                          >
                            <b-col
                              v-for="(item, indexVariant) in data.item.variant1.option"
                              :key="indexVariant+1"
                              cols="12"
                            >
                              <b-form-input
                                v-model="item.variant2.stock"
                                type="number"
                              />
                            </b-col>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 === null && variationName1 !== null"
                          >
                            <b-form-input
                              v-model="data.item.variant1.stock"
                              type="number"
                            />
                          </div>
                        </div>
                        <div v-else>
                          <div
                            v-if="variationName3 !== null"
                          >
                            <b-col
                              v-for="(item, indexVariant) in data.item.variant1.option"
                              :key="indexVariant+1"
                              cols="12"
                            >
                              <div
                                v-for="(itemsVariant, indexVariantPrice) in item.variant2.option"
                                :key="indexVariantPrice+1"
                              >
                                {{ itemsVariant.variant3.stock }}
                              </div>
                            </b-col>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 !== null"
                          >
                            <b-col
                              v-for="(item, indexVariant) in data.item.variant1.option"
                              :key="indexVariant+1"
                              cols="12"
                            >
                              {{ item.variant2.stock }}
                            </b-col>
                          </div>
                          <div
                            v-if="variationName3 === null && variationName2 === null && variationName1 !== null"
                          >
                            {{ data.item.variant1.stock }}
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
                          @click="updateTable(data)"
                        >
                          Simpan
                        </b-button>
                      </template>

                    </b-table>
                  </b-overlay>
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
              <validation-provider
                #default="{errors}"
                name="Stock"
                rules="required"
              >
                <b-form-input
                  v-model="stockNotVariation"
                  type="number"
                  placeholder="Masukan jumlah stok barang"
                  :state="errors.length > 0 ? false:null"
                />
                <small class="text-primary">{{ errors[0] }}</small>
              </validation-provider>
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
              <validation-provider
                #default="{errors}"
                name="Harga"
                rules="required"
              >
                <b-form-input
                  v-model="priceNotVariation"
                  type="number"
                  placeholder="Rp  |  Masukan harga barang"
                  :state="errors.length > 0 ? false:null"
                />
                <small class="text-primary">{{ errors[0] }}</small>
              </validation-provider>
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
                <validation-provider
                  #default="{errors}"
                  name="Berat"
                  rules="required"
                >
                  <b-input-group class="input-group-merge">
                    <b-form-input
                      id="hi-first-name"
                      v-model="weightProduct"
                      type="number"
                      placeholder="1000"
                      :state="errors.length > 0 ? false:null"
                    />
                    <b-input-group-append is-text>
                      gram
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-primary">{{ errors[0] }}</small>
                </validation-provider>
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
                  @change="validationPayment"
                >
                  Bayar Ditempat (COD)
                </b-form-checkbox>
                <b-form-checkbox
                  v-model="transfer"
                  class="custom-control-primary"
                  @change="validationPayment"
                >
                  Transfer Bank
                </b-form-checkbox>
              </div>
              <small class="text-primary">{{ validatePayment }}</small>
            </b-form-group>
          </b-col>

          <!-- submit and reset -->
          <b-col
            cols="12"
            class="d-flex justify-content-end pb-2 pr-2"
          >
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="reset"
              variant="primary"
              :disabled="validatePayment !== ''"
              @click.prevent="submitPublish"
            >
              <b-spinner
                v-if="loadingSubmitPublish"
                small
                variant="light"
              />
              Publish
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <onboarding
      ref="onboardingElement"
      :current-stage="2"
    />

    <b-modal
      ref="modal-validation-upload"
      body-class="modalUploadWarning__body"
      hide-header
      hide-footer
      hide-header-close
    >
      <div class="d-block text-center">
        <img
          :src="require('@/assets/images/icons/warning.svg')"
          alt="warning"
          width="142px"
          height="134.43px"
          class="modalUploadWarning__img"
        >
        <p class="modalUploadWarning__text">
          Maaf, maksimal file hanya 2 MB.
        </p>
        <b-button
          variant="danger"
          class="modalUploadWarning__btn"
          @click="handleOkModalValidationUpload"
        >Oke</b-button>
      </div>
    </b-modal>

  </b-card-actions>
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
import ToastificationContentVue from '@/@core/components/toastification/ToastificationContent.vue'
import BCardActions from '@/@core/components/b-card-actions/BCardActions.vue'
import useJwt from '@/auth/jwt/useJwt'
import Onboarding from './Onboarding.vue'
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
    Onboarding,
  },
  directives: {
    Ripple,
  },
  mixins: [heightTransition],
  data() {
    return {
      loadingSubmitPublish: false,
      loadingSubmitDraft: false,

      loading: false,
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
      stock: '',
      price: '',
      stockNotVariation: '',
      priceNotVariation: '',
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
      flavours: [],
      cod: true,
      transfer: true,
      variantStore: [],
      optionStore: [],

      // Validation
      required,
      fieldImage: [],
      fieldPreviewImage: [],
      tesStore: [],
      productId: '',

      validatePayment: '',
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
  watch: {
    imageFile: {
      handler(val) {
        if (val) {
          if (val.size > 2 * 1024 * 1024) {
            this.$refs['modal-validation-upload'].show()
          }
        }
      },
    },
  },
  mounted() {
    this.$http_komship.post('v1/my-profile', {
      headers: { Authorization: `Bearer ${useJwt.getToken()}` },
    }).then(response => {
      const { data } = response.data
      if (data) {
        this.profile = data
      }
    })
  },
  methods: {
    submitPublish() {
      setTimeout(() => {
        if (this.profile.is_onboarding) this.$refs.onboardingElement.showModal()
        this.loadingSubmitPublish = false
      }, 2000)
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
      this.loadingSubmitPublish = true
      this.$refs.formRules.validate().then(success => {
        if (success) {
          if (this.lengthProduct === null) {
            this.lengthProduct = 0
          }

          if (this.widthProduct === null) {
            this.widthProduct = 0
          }

          if (this.heightProduct === null) {
            this.heightProduct = 0
          }
          if (this.formChoices3[0] !== undefined) {
            console.log('Variant 3')
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
                  val: this.formChoices1[x].choices,
                  parent: 0,
                  stock: null,
                  price: null,
                  option: [],
                },
              )
              // eslint-disable-next-line no-plusplus
              for (let y = 0; y < this.variantItems[x].variant1.option.length; y++) {
                this.optionStore[x].option.push(
                  {
                    val: this.formChoices2[y].choices,
                    parent: 0,
                    stock: null,
                    price: null,
                    option: [],
                  },
                )
                // eslint-disable-next-line no-plusplus
                for (let z = 0; z < this.variantItems[x].variant1.option[y].variant2.option.length; z++) {
                  this.optionStore[x].option[y].option.push(
                    {
                      val: this.variantItems[x].variant1.option[y].variant2.option[z].variant3.val,
                      parent: 0,
                      stock: this.variantItems[x].variant1.option[y].variant2.option[z].variant3.stock,
                      price: this.variantItems[x].variant1.option[y].variant2.option[z].variant3.price,
                    },
                  )
                }
              }
            }
          } else if (this.formChoices2[0] !== undefined && this.formChoices3[0] === undefined) {
            console.log('variant 2')
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
                  val: this.formChoices1[x].choices,
                  parent: 0,
                  stock: null,
                  price: null,
                  option: [],
                },
              )
              // eslint-disable-next-line no-plusplus
              for (let y = 0; y < this.variantItems[x].variant1.option.length; y++) {
                this.optionStore[x].option.push(
                  {
                    val: this.variantItems[x].variant1.option[y].variant2.val,
                    parent: 0,
                    stock: this.variantItems[x].variant1.option[y].variant2.stock,
                    price: this.variantItems[x].variant1.option[y].variant2.price,
                  },
                )
              }
            }
          } else if (this.formChoices1[0] !== undefined && this.formChoices2[0] === undefined && this.formChoices3[0] === undefined) {
            console.log('varian 1')
            this.variantStore.push(
              {
                val: this.variationName1,
              },
            )
            // eslint-disable-next-line no-plusplus
            for (let x = 0; x < this.variantItems.length; x++) {
              this.optionStore.push(
                {
                  val: this.formChoices1[x].choices,
                  parent: 0,
                  stock: this.variantItems[x].variant1.stock,
                  price: this.variantItems[x].variant1.price,
                },
              )
            }
          }
          console.log('variantItems')
          console.log(this.variantItems)

          if (this.cod === true) {
            this.flavours.push('COD')
          } else {
            this.flavours = []
          }
          if (this.transfer === true) {
            this.flavours.push('BANK TRANSFER')
          } else {
            this.flavours = []
          }

          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < this.variantStore.length; i++) {
            if (this.variantStore[i].val === null) {
              this.variantStore.splice(i, 1)
            }
          }

          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < this.variantStore.length; i++) {
            if (this.variantStore[i].val === null) {
              this.variantStore.splice(i, 1)
            }
          }

          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < this.variantStore.length; i++) {
            if (this.variantStore[i].val === null) {
              this.variantStore.splice(i, 1)
            }
          }

          console.log('variantStore')
          console.log(this.variantStore)
          console.log('optionStore')
          console.log(this.optionStore)

          httpKomship.post('/v1/ob/product/create/1', {
            product_name: this.productName,
            sku: this.skuName,
            description: this.descriptionProduct,
            weight: this.weightProduct,
            length: this.lengthProduct,
            width: this.widthProduct,
            height: this.heightProduct,
            price: this.priceNotVariation,
            stock: this.stockNotVariation,
            flavours: this.flavours,
            variant_option: this.variantStore,
            option: this.optionStore,
          }, {
            headers: { Authorization: `Bearer ${useJwt.getToken()}` },
          }).then(response => {
            this.productId = response.data.data.product_id
            console.log(response.data.data)
            if (this.imageFile !== null) {
              // Store image
              const formData = new FormData()
              formData.append('product_id', response.data.data.product_id)
              formData.append('image_path', this.imageFile)
              httpKomship.post('/v1/ob/product/upload-image', formData,
                {
                  headers: { Authorization: `Bearer ${useJwt.getToken()}` },
                }).then(() => {
                this.$toast({
                  component: ToastificationContentVue,
                  props: {
                    title: 'Success',
                    icon: 'CheckIcon',
                    text: 'Success menambahkan produk',
                    variant: 'success',
                  },
                })
                this.loadingSubmitPublish = false
                setTimeout(() => {
                  if (this.profile.is_onboarding) this.$refs.onboardingElement.showModal()
                  this.loadingSubmitPublish = false
                }, 2000)
              }).catch(() => {
                this.loadingSubmit = false
                this.$toast({
                  component: ToastificationContentVue,
                  props: {
                    title: 'Gagal',
                    icon: 'AlertCircleIcon',
                    text: 'Gagal menambahkan produk, silahkan coba lagi!',
                    variant: 'danger',
                  },
                })
              })
            } else {
              this.loadingSubmitPublish = false
              setTimeout(() => {
                if (this.profile.is_onboarding) this.$refs.onboardingElement.showModal()
                this.loadingSubmitPublish = false
              }, 2000)
            }
          }).catch(() => {
            this.$toast({
              component: ToastificationContentVue,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Gagal menambahkan produk, silahkan coba lagi!',
                variant: 'danger',
              },
            })
            this.loadingSubmitPublish = false
          })
        } else {
          this.loadingSubmitPublish = false
        }
      })
    },
    createListVariation() {
      if (this.variantItems !== []) {
        this.variantItems = []
      }
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
      if (this.formChoices3[0] !== undefined) {
        console.log('variant 3')
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.formChoices1.length; i++) {
          this.variantItems.push({
            variant1: {
              val: this.formChoices1[i].choices,
              parent: null,
              stock: null,
              price: null,
              option: [],
            },
          })
          // eslint-disable-next-line no-plusplus
          for (let x = 0; x < this.formChoices2.length; x++) {
            this.variantItems[i].variant1.option.push({
              variant2: {
                val: this.formChoices2[x].choices,
                parent: 0,
                stock: null,
                price: null,
                option: [],
              },
            })
            // eslint-disable-next-line no-plusplus
            for (let y = 0; y < this.formChoices3.length; y++) {
              this.variantItems[i].variant1.option[x].variant2.option.push({
                variant3: {
                  val: this.formChoices3[y].choices,
                  parent: 0,
                  stock: this.stock,
                  price: this.price,
                },
              })
            }
          }
        }
      }
      if (this.formChoices3[0] === undefined && this.formChoices2[0] !== undefined) {
        console.log('variant 2')
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.formChoices1.length; i++) {
          this.variantItems.push({
            variant1: {
              val: this.formChoices1[i].choices,
              parent: null,
              stock: null,
              price: null,
              option: [],
            },
          })
          // eslint-disable-next-line no-plusplus
          for (let x = 0; x < this.formChoices2.length; x++) {
            this.variantItems[i].variant1.option.push({
              variant2: {
                val: this.formChoices2[x].choices,
                parent: 0,
                stock: this.stock,
                price: this.price,
              },
            })
          }
        }
      }
      if (this.formChoices3[0] === undefined && this.formChoices2[0] === undefined && this.formChoices1[0] !== undefined) {
        console.log('variant 1')
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.formChoices1.length; i++) {
          this.variantItems.push({
            variant1: {
              val: this.formChoices1[i].choices,
              parent: null,
              stock: this.stock,
              price: this.price,
            },
          })
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
      if (this.price !== null) {
        this.fields.push({
          key: 'price',
          label: 'Harga',
        })
      }
      if (this.stock !== null) {
        this.fields.push({
          key: 'stock',
          label: 'Stok',
        })
      }
      this.fields.push(
        {
          key: 'action',
          label: 'Aksi',
          class: 'col-action',
        },
      )
      console.log(this.variantItems)
      return this.variantItems
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
    },
    removeVariant2() {
      this.variationName2 = ''
      this.variationFields2 = false
      this.activeAddChoices1 = true
      if (this.variationFields1 === false && this.variationFields3 === false) {
        this.isVariation = false
      }
    },
    removeVariant3() {
      this.variationName3 = ''
      this.variationFields3 = false
      this.activeAddChoices2 = true
      if (this.variationFields1 === false && this.variationFields2 === false) {
        this.isVariation = false
      }
    },
    formatPrice(value) {
      const val = value
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    validationPayment() {
      if (this.cod === false && this.transfer === false) {
        this.validatePayment = 'Metode pembayaran harus dipilih salah satu!'
      } else {
        this.validatePayment = ''
      }
    },
    fileUrl: file => (file ? URL.createObjectURL(file) : null),
    handleOkModalValidationUpload() {
      this.imageFile = null
      this.$refs['modal-validation-upload'].hide()
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
* {
  font-family: Poppins;
}
.modalUploadWarning__body {
  padding: 0px;
}
.modalUploadWarning__text {
  font-weight: 600;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: 0.5px;
  color: #222222;
  margin: 27.79px 0px 40px;
}
.modalUploadWarning__img {
  margin-top: 47.79px;
}
.modalUploadWarning__btn {
  margin-bottom: 40px;
  width: 120px;
  height: 56px;
  background: #F95031 !important;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.5px;
  color: #FFFFFF;
}
</style>
