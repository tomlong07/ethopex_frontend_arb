<script setup lang="ts">
import { NTooltip, SelectOption } from 'naive-ui'

import {
  AccountModeStyleManagerOptions,
  ModeStyleManagerOptions,
} from '@/options/style_manager'

//@ts-ignore
import createStyle from '@/components/html_template/create_style_v2.html-template'
import { AsyncSettings } from './base'
import { ctr_account } from '@/services/ctr_account'
import { ctr_adsense_style } from '@/services/ctr_adsense_style'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'

const isDebug = arb?.debug

const version = '1.7' + (isDebug ? ' (debug)' : '')

const showModal = ref<boolean>(false)
const dataConfig = ref<any>({
  name: 'Test Update Archived',
  originalAdsenseAccount: null,
  adsenseAccount: null,
  accountMode: 'same', //default là cùng account
  mode: 'update',
  totalStyle: 1,
  originalId: '',

  updateIds: [],
  ids: '',
  payload: '',
  skipShopping: 'off',
})

const adsenseAccountOptions = ref<SelectOption[]>([])
const styleByAccountOptions = ref<SelectOption[]>([])

const isLoading = ref<boolean>(false)

const updateIdsString = computed<string>(() => {
  if (isCreateMode.value) return JSON.stringify([])

  const stringArray = dataConfig.value.updateIds.map((num: number) =>
    num.toString()
  )

  return JSON.stringify(stringArray)
})

const isLoadingAdmInfo = ref(false)

const isCreateMode = computed<boolean>(() => {
  return dataConfig.value.mode === 'create'
})

const isUpdateMode = computed<boolean>(() => {
  return dataConfig.value.mode === 'update'
})

const isDifferentAccountMode = computed<boolean>(() => {
  return dataConfig.value.accountMode === 'different'
})

const generationSelectOptions = ref<SelectOption[]>([])

const name = `Style Manager`

const asyncSettings = ref<AsyncSettings>()

const getAsyncSettings = async () => {
  isLoadingAdmInfo.value = true

  const result = await ctr_permission_settings.PermissionAsync(
    window.route?.meta?.url as string
  )

  asyncSettings.value = new AsyncSettings(result?.data || {})

  isLoadingAdmInfo.value = false
}

const getAdsenseAccounts = async () => {
  const result = await ctr_account.GetByChannelStatus()

  if (!result?.status) return

  if (result.data?.length) {
    result.data.forEach((element: any) => {
      adsenseAccountOptions.value.push({
        label: element.show_name,
        value: element.pub_id,
      })
    })
  }
}

onMounted(async () => {
  getAsyncSettings()

  isLoading.value = true

  await getAdsenseAccounts()

  isLoading.value = false
})

const generateJSPayload = async () => {
  if (!dataConfig.value.originalAdsenseAccount) {
    window.message.error(
      `Generate failed: Invalid original adsense account, please check!`
    )
    return
  }

  if (!dataConfig.value.originalId) {
    window.message.error(`Generate failed: Invalid originalId, please check!`)
    return
  }

  navigator.clipboard.writeText(
    generateJSScript({ originalAdsenseAccount: true })
  )

  window.message.success('Copied code to clipboard!')
}

const generateJS = async () => {
  if (!dataConfig.value.adsenseAccount) {
    window.message.error(
      `Generate failed: Invalid adsense account, please check!`
    )
    return
  }

  if (!dataConfig.value.originalId) {
    window.message.error(`Generate failed: Invalid originalId, please check!`)
    return
  }

  if (isCreateMode.value && !dataConfig.value.totalStyle) {
    window.message.error(`Generate failed: Invalid totalStyle, please check!`)
    return
  }

  if (isUpdateMode.value && !dataConfig.value.updateIds.length) {
    window.message.error(`Generate failed: Invalid ids, please check!`)
    return
  }

  if (isDifferentAccountMode.value && !dataConfig.value.payload) {
    window.message.error(`Generate failed: Invalid payload, please check!`)
    return
  }

  navigator.clipboard.writeText(generateJSScript())

  window.message.success('Copied code to clipboard!')
}

function generateJSScript(opts: { [key: string]: any } = {}) {
  let dataCreateStyleJS = createStyle

  dataCreateStyleJS = dataCreateStyleJS
    .replaceAll('<script>', '')
    .replaceAll('</' + 'script>', '')

  let objCustom: { [key: string]: any } = {
    import_adsense_account: dataConfig.value.adsenseAccount,
    import_mode: dataConfig.value.mode,
    import_total_style: isCreateMode.value ? dataConfig.value.totalStyle : null,
    import_version: version,
    import_hlink: asyncSettings.value?.admInfo?.hLink,
    import_hname: asyncSettings.value?.admInfo?.hName,
    import_hvalue: asyncSettings.value?.admInfo?.hValue,
    import_original_id: dataConfig.value.originalId,
    import_update_ids: updateIdsString.value,
    import_debug: isDebug,
    import_payload: null,
    import_mode_copy: '',
    import_skip_shopping: dataConfig.value.skipShopping,
    import_generation: dataConfig.value.generation,
  }

  if (isDifferentAccountMode.value) {
    if (opts.originalAdsenseAccount) {
      objCustom.import_mode_copy = 'copy'
      objCustom.import_adsense_account = dataConfig.value.originalAdsenseAccount
    } else {
      objCustom.import_mode_copy = 'update_account'
      objCustom.import_payload = dataConfig.value.payload
    }
  }

  dataCreateStyleJS = helper.handleBarsCustom(dataCreateStyleJS, objCustom)

  return dataCreateStyleJS
}

const initShowModal = () => {
  dataConfig.value.ids = dataConfig.value.updateIds.join('\n')
  showModal.value = true
}

const submitBulkIds = () => {
  if (!dataConfig.value.ids) {
    window.message.error(`Submit failed: Invalid ids, please check!`)
    return
  }
  dataConfig.value.updateIds = dataConfig.value.ids
    .replace(/\n/g, ',') // Thay thế tất cả các xuống dòng bằng dấu phẩy
    .split(',') // Tách theo dấu phẩy
    .map((key: any) => key.trim()) // Loại bỏ khoảng trắng xung quanh mỗi keyword
    .filter((key: any) => key) // Loại bỏ các keyword trống
  dataConfig.value.ids = Object.values(dataConfig.value.updateIds).join(',')
  showModal.value = false
}

const clearUpdateIds = (value: string) => {
  dataConfig.value.mode = value
  clear()
}

const clear = () => {
  dataConfig.value.updateIds = []
  dataConfig.value.ids = ''
}

const updateAdsenseAccount = (value: any) => {
  dataConfig.value.adsenseAccount = value
  clear()
  getGenerationByAdsense()
}

const getGenerationByAdsense = async () => {
  const result = await ctr_adsense_style.GetGenerationOfStyleByPubID(
    dataConfig.value.adsenseAccount
  )

  if (result?.status) {
    generationSelectOptions.value = []
    ;(result?.data || []).forEach(
      (element: { generation: string; is_used: boolean }) => {
        generationSelectOptions.value.push({
          value: element.generation,
          label: element.generation,
          disabled: element.is_used, // Disable option nếu is_used = true
        })
      }
    )
  }
}
const renderLabel = (option: any) => {
  if (option.disabled) {
    return h('div', { class: 'flex w-full' }, [
      h(NTooltip, null, {
        trigger: () =>
          h('span', { style: { 'max-width': '80%' } }, option.label),
        default: () => 'This generation has been used',
      }),
    ])
  }
  return h('span', option.label)
}
const updateGeneration = (value: string) => {
  dataConfig.value.generation = value
  clear()

  updateChildStyles(dataConfig.value.adsenseAccount)
}

const updateChildStyles = async (value: string) => {
  if (!value) return

  if (!dataConfig.value.generation) {
    window.message.warning(`Please select generation!`)
    return
  }

  dataConfig.value.adsenseAccount = value

  const result = await ctr_adsense_style.GetStyleByPubID(
    dataConfig.value.adsenseAccount,
    { generation: dataConfig.value.generation }
  )

  if (!result?.status) return

  styleByAccountOptions.value = []
  dataConfig.value.updateIds = []

  if (result?.data?.length) {
    result.data.forEach((element: any) => {
      styleByAccountOptions.value.push({
        label: element.name,
        value: element.style_id,
      })

      dataConfig.value.updateIds.push(element.style_id)
    })
  }
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center items-start">
      <div class="w-full max-w-[923px]">
        <n-spin :show="isLoading">
          <div class="flex justify-center mt-6 items-center">
            <div class="w-full 5xl:w-1/2">
              <div class="flex flex-wrap gap-4 mt-6">
                <n-modal
                  v-model:show="showModal"
                  preset="dialog"
                  :closable="false"
                  type="success"
                  :show-icon="false"
                  style="width: 60vw"
                >
                  <template #header>
                    <div class="flex-row">
                      <div>Ids bulk entry</div>
                      <span class="text-sm font-normal"
                        >Entries should be on separate commas or lines.</span
                      >
                    </div>
                  </template>
                  <div>
                    <n-input
                      v-model:value="dataConfig.ids"
                      type="textarea"
                      placeholder="Eg. id 1, id 2...."
                      rows="10"
                    />
                  </div>
                  <template #action>
                    <n-button @click="showModal = false"> Cancel</n-button>
                    <n-button type="error" @click="submitBulkIds">
                      Save</n-button
                    >
                  </template>
                </n-modal>
                <n-card :title="name">
                  <template #header-extra>
                    <n-popover trigger="hover">
                      <template #trigger>
                        <span class="custom-text-style-manager">
                          Version {{ version }}
                        </span>
                      </template>
                      <span
                        >Version of js code create / update adsense style</span
                      >
                    </n-popover>
                  </template>
                  <div class="flex my-4" v-if="false">
                    <div class="w-1/6 font-bold">Name</div>
                    <div class="w-5/6 flex flex-col">
                      <n-input
                        v-model:value="dataConfig.name"
                        :placeholder="`Name of ${name}`"
                        class="mb-2"
                      />
                    </div>
                  </div>

                  <div class="flex my-4">
                    <div class="w-full flex flex-col">
                      <FloatingWrapper name="Account Mode">
                        <n-select
                          v-model:value="dataConfig.accountMode"
                          tag
                          :options="AccountModeStyleManagerOptions"
                        />
                      </FloatingWrapper>
                    </div>
                  </div>
                  <div class="flex my-4">
                    <div class="w-full flex flex-col">
                      <FloatingWrapper name="Mode">
                        <n-select
                          v-model:value="dataConfig.mode"
                          tag
                          :options="ModeStyleManagerOptions"
                          :on-update:value="clearUpdateIds"
                        />
                      </FloatingWrapper>
                    </div>
                  </div>

                  <div class="flex my-4" v-show="isDifferentAccountMode">
                    <div class="w-full flex flex-row">
                      <FloatingWrapper name="Original Adsense Account">
                        <n-select
                          v-model:value="dataConfig.originalAdsenseAccount"
                          tag
                          :options="adsenseAccountOptions"
                        />
                      </FloatingWrapper>
                    </div>
                  </div>
                  <div class="flex my-4">
                    <div class="w-full flex flex-row">
                      <FloatingWrapper name="Adsense Account">
                        <n-select
                          v-model:value="dataConfig.adsenseAccount"
                          tag
                          placeholder=""
                          :options="adsenseAccountOptions"
                          :on-update:value="updateAdsenseAccount"
                        />
                      </FloatingWrapper>
                    </div>
                  </div>

                  <div class="flex my-4" v-if="isUpdateMode">
                    <div class="w-full flex flex-col">
                      <FloatingWrapper name="Generation">
                        <n-select
                          v-model:value="dataConfig.generation"
                          tag
                          placeholder=""
                          :options="generationSelectOptions"
                          :on-update:value="updateGeneration"
                          :render-label="renderLabel"
                        />
                      </FloatingWrapper>
                    </div>
                  </div>

                  <div class="flex my-4">
                    <div class="w-full flex flex-row">
                      <FloatingWrapper name="Original Id">
                        <n-input v-model:value="dataConfig.originalId" />
                      </FloatingWrapper>
                    </div>
                  </div>

                  <div class="flex my-4" v-show="isCreateMode">
                    <div class="w-full flex flex-col">
                      <FloatingWrapper name="Total of style create">
                        <n-input-number
                          v-model:value="dataConfig.totalStyle"
                          min="1"
                          max="1000"
                          class="mb-2"
                        />
                      </FloatingWrapper>
                    </div>
                  </div>

                  <div class="flex my-4" v-show="isUpdateMode">
                    <div class="w-full flex flex-row items-center">
                      <FloatingWrapper name="Update Ids">
                        <n-select
                          v-model:value="dataConfig.updateIds"
                          filterable
                          multiple
                          clearable
                          tag
                          placeholder=""
                          :max-tag-count="10"
                          :options="styleByAccountOptions"
                        />
                      </FloatingWrapper>
                      <n-tooltip trigger="hover">
                        <template #trigger>
                          <n-button
                            class="ml-2"
                            color="#f43f5e"
                            @click="initShowModal"
                          >
                            Bulk Entry
                          </n-button>
                        </template>
                        <span
                          >Enter multiple ids separated by commas or
                          lines.</span
                        >
                      </n-tooltip>
                    </div>
                  </div>

                  <div
                    class="flex items-center my-4 gap-5"
                    v-show="isUpdateMode"
                  >
                    <div class="font-bold text-xs">Skip Shopping Ads</div>
                    <div>
                      <CustomSwitch
                        v-model:value="dataConfig.skipShopping"
                        type="onoff"
                        true-label="On"
                        false-label="Off"
                        size="small"
                      />
                    </div>
                  </div>

                  <div class="flex my-4" v-show="isDifferentAccountMode">
                    <div class="w-1/6 font-bold">
                      Payload (copy to other account)
                    </div>
                    <div class="w-full flex flex-col">
                      <n-input
                        type="textarea"
                        v-model:value="dataConfig.payload"
                        rows="7"
                        class="mb-2"
                      />
                    </div>
                  </div>

                  <div class="flex flex-row-reverse sticky bottom-0 gap-2">
                    <n-button
                      color="#0D6EFD"
                      size="medium"
                      type="success"
                      class="mt-4"
                      :disabled="isLoadingAdmInfo"
                      @click="generateJS"
                    >
                      Copy JS
                    </n-button>

                    <n-button
                      v-show="isDifferentAccountMode"
                      color="#0a7d8a"
                      size="medium"
                      type="success"
                      class="mt-4"
                      :disabled="isLoadingAdmInfo"
                      @click="generateJSPayload"
                    >
                      Copy JS To Get Payload
                    </n-button>
                  </div>
                </n-card>
              </div>
            </div>
          </div>
        </n-spin>
      </div>
    </div>
  </div>
</template>
