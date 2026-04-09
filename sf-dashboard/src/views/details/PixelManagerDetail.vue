<script setup lang="ts">
import {
  pixelManagerConfigType,
  pixelEvents,
} from '@/types/components/pixel_manager'

import BackPage from '@/components/common/BackPage.vue'
import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'

import Close from '@/assets/icons/Close.vue'

import Plus from '@/assets/icons/Plus.vue'

import { SelectOption } from 'naive-ui'
import Checkmark from '@/assets/icons/Checkmark.vue'
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import Minus from '@/assets/icons/Minus.vue'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { ctr_pixel } from '@/services/ctr_pixel'
import { ctr_filter } from '@/services/ctr_filter'
import { debounceV2 } from '@/utils'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import { EventPropOptions } from '@/options/pixel'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'

const id = Number(window.route.params.id || 0)

const name = `pixel manager`

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const isDisable = ref(false)
const isDisableTrafficSource = ref(false)
const isDisablePixelId = ref(false)
const isTrafficLoading = ref(false)
const isPublisherLoading = ref(false)

const isStepLoading = ref(false)
const isLoading = ref(false)
const isSubmitBtnLoading = ref<boolean>(false)

const trafficSource = ref<{ value: string; name: string }[]>([])
const publisherOptions = ref<SelectOption[]>([])
const duplicateId = computed<number>(() =>
  Number(window.route.query.duplicate || 0)
)

const newPixelEvent = () => {
  return {
    action: [],
    properties: [],
    event: null,
  } as pixelEvents
}
const pixelConfig = ref<pixelManagerConfigType>({
  name: '',
  status: 'on',
  traffic_source: null,
  pixel_id: '',
  pixel_token: '',
  pixel_events: [newPixelEvent()],
  publisher: null,
})

const pixelTriggers = ref<SelectOption[]>([])

const payload = computed(() => {
  const obj = helper.clone(pixelConfig.value)

  obj.pixel_triggers = undefined

  let temp = [] as pixelEvents[]

  obj.pixel_events.forEach((element: pixelEvents) => {
    if (
      element.action.length ||
      element.event ||
      element.properties.length > 0
    ) {
      temp.push(element)
    }
  })

  obj.pixel_events = temp
  return obj
})

const eventType = ref<{ value: string; name: string }[]>([])
const eventName = ref<{ value: string; name: string }[]>([])

const isAddPage = computed<boolean>(() => id === 0)
const isEditPage = computed<boolean>(() => {
  return !isAddPage.value
})

const textShow = computed<string>(() => {
  return isAddPage.value ? 'Add' : 'Edit'
})

const dblclick = (key: string) => {
  if (isAddPage.value) return
  switch (key) {
    case 'pixel_id':
      isDisablePixelId.value = true
      break

    case 'traffic_source':
      isDisableTrafficSource.value = true
      break
  }

  const divElement = document.querySelector('#pixel_id')
  const inputElement = divElement?.querySelector('input')
  inputElement?.removeAttribute('readonly')
}

const getListTrafficSource = async () => {
  isTrafficLoading.value = true
  let result = await ctr_traffic_source.GetAllTrafficSource()
  trafficSource.value = result?.data?.traffic_sources || []

  isTrafficLoading.value = false
}
const getListPublisher = async (q = '') => {
  isPublisherLoading.value = true
  const response = await ctr_filter.FilterPublisher({
    params: { q: q },
  })
  const temp = [] as SelectOption[]
  response?.data?.forEach((publisher: any) => {
    temp.push({
      label: publisher.email,
      value: publisher.id,
    })
  })
  publisherOptions.value = temp
  isPublisherLoading.value = false
}
const getListStep = async () => {
  isStepLoading.value = true
  eventType.value = []
  let data = await ctr_pixel.ListStep()

  if (data?.status && data?.data) {
    eventType.value = eventType.value.concat(data?.data || [])
  }

  isStepLoading.value = false
}

const onUpdateValueTrafficSource = async () => {
  eventName.value = []
  const trafficSource = pixelConfig.value.traffic_source
  if (trafficSource !== null && trafficSource !== '') {
    let listEventOnTrafficSource = await ctr_traffic_source.GetEvent(
      trafficSource
    )
    if (listEventOnTrafficSource?.status) {
      eventName.value = eventName.value.concat(
        listEventOnTrafficSource?.data.events || []
      )
    }
  }
  return
}

const fetchDuplicate = async () => {
  if (duplicateId.value) {
    const pixelmanagerResult = await ctr_pixel.GetByID(duplicateId.value)
    if (pixelmanagerResult?.status) {
      pixelConfig.value = pixelmanagerResult.data
      if (pixelConfig.value.pixel_events.length === 0) {
        pixelConfig.value.pixel_events.push(newPixelEvent())
      }
      isDisable.value = false
    } else {
      isDisable.value = true
    }
  }
}
const handleSearch = debounceV2(async (q: string = '') => {
  getListPublisher(q)
}, 300)
onMounted(async () => {
  isLoading.value = true
  isDisable.value = true

  try {
    if (isEditPage.value) {
      //get demand config by id
      const result = await ctr_pixel.GetByID(id)
      if (result?.status) {
        pixelConfig.value = result?.data
        pixelTriggers.value = result?.data.pixel_triggers || []
        if (pixelConfig.value.pixel_events.length === 0) {
          pixelConfig.value.pixel_events.push(newPixelEvent())
        }
        isDisable.value = false
      } else {
        window.message.error(
          `Config Pixel failed: ${result?.errors[0].message}`
        )
        isDisable.value = true
      }
    }
    // fetch list traffic source
    getListTrafficSource()
    getListPublisher()
    getListStep()
    await fetchDuplicate()
    onUpdateValueTrafficSource()
  } finally {
    if (!pixelConfig.value.publisher) pixelConfig.value.publisher = null
    isDisable.value = false
    isLoading.value = false
  }
})

const submitForm = async () => {
  if (pixelConfig.value.name == '') {
    window.message.error(`Submit failed: Name is required`)
    isSubmitBtnLoading.value = false
    return
  }

  isSubmitBtnLoading.value = true
  if (isAddPage.value) {
    const result = await ctr_pixel.Add(payload.value)
    if (result?.status) {
      window.message.success(`Add ${name} successfully`)
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    }
  }

  if (isEditPage.value) {
    const result = await ctr_pixel.Edit(id, payload.value)
    if (result?.status) {
      window.message.success(`Update ${name} successfully`)
    }
  }

  isSubmitBtnLoading.value = false
}
const onDeletePixel = (i: number) => {
  pixelConfig.value.pixel_events.splice(i, 1)
}

const onAddPixel = () => {
  pixelConfig.value.pixel_events.push(newPixelEvent())
}

const copyEvent = (event: string) => {
  if (!event) return
  helper.copyText(event)
  window.message.success('Copied!')
}
</script>

<template>
  <div class="wrapper flex flex-col px-3 flex-1 bg-base py-6">
    <BackPage
      :url="feSettings?.page_list"
      :name="name"
      v-if="feSettings?.page_list"
    />
    <div class="flex justify-center items-start">
      <div class="w-full max-w-[923px]">
        <Skeleton v-if="isLoading" />
        <div v-else class="flex flex-col gap-4">
          <n-card class="card-flex-gap-4 rounded-xl">
            <template #header>{{ `${textShow} ${name}` }}</template>
            <template #header-extra v-if="pixelConfig.link_test_pixel">
              <n-button
                size="small"
                tag="a"
                :href="pixelConfig.link_test_pixel"
                target="_blank"
              >
                Test Pixel
              </n-button>
            </template>
            <FloatingWrapper name="Name">
              <n-input
                v-model:value="pixelConfig.name"
                :loading="isLoading"
                :disabled="isLoading || isDisable"
                :placeholder="`Name of ${name}`"
                class="mb-2"
              />
            </FloatingWrapper>
            <div class="flex items-center gap-5">
              <div class="font-bold text-xs">Status</div>
              <CustomSwitch
                v-model="pixelConfig.status"
                type="onoff"
                true-label="On"
                false-label="Off"
                size="small"
              />
            </div>

            <div class="w-full" title="Double click to edit">
              <FloatingWrapper name="Traffic Source">
                <n-select
                  v-model:value="pixelConfig.traffic_source"
                  filterable
                  :disabled="
                    isLoading ||
                    isDisable ||
                    (!isDisableTrafficSource && isEditPage)
                  "
                  value-field="value"
                  label-field="name"
                  placeholder=""
                  :loading="isTrafficLoading"
                  :options="trafficSource"
                  readonly
                  @update:value="onUpdateValueTrafficSource"
                  @dblclick="dblclick('traffic_source')"
                />
              </FloatingWrapper>
            </div>

            <FloatingWrapper name="Publisher">
              <n-select
                v-model:value="pixelConfig.publisher"
                filterable
                placeholder=""
                :loading="isPublisherLoading"
                :options="publisherOptions"
                readonly
                @search="handleSearch"
              />
            </FloatingWrapper>

            <div class="w-full flex flex-col" title="Double click to edit">
              <FloatingWrapper name="Pixel ID">
                <n-input
                  v-model:value="pixelConfig.pixel_id"
                  :loading="isLoading"
                  :disabled="
                    isLoading || isDisable || (!isDisablePixelId && isEditPage)
                  "
                  placeholder="Pixel ID"
                  :readonly="!isAddPage"
                  class="mb-2"
                  @dblclick="dblclick('pixel_id')"
                />
              </FloatingWrapper>
            </div>
            <div class="w-full flex flex-col" title="Double click to edit">
              <FloatingWrapper name="Pixel Token">
                <n-input
                  v-model:value="pixelConfig.pixel_token"
                  :loading="isLoading"
                  :disabled="isLoading || isDisable"
                  placeholder="Pixel Token"
                  class="mb-2"
                  type="password"
                  show-password-on="click"
                  :input-props="{ autocomplete: 'new-password' }"
                />
              </FloatingWrapper>
            </div>
            <!-- Pixels -->
            <n-divider />

            <div class="flex">
              <div class="w-full flex flex-col gap-6">
                <n-input-group
                  v-for="(pixel, ind) in pixelConfig.pixel_events"
                  :key="ind"
                  class="flex items-center gap-2"
                >
                  <FloatingWrapper name="Event">
                    <n-select
                      v-model:value="pixel.event"
                      clearable
                      tag
                      filterable
                      value-field="value"
                      label-field="name"
                      :disabled="isDisable"
                      placeholder=""
                      :options="eventName"
                    />
                  </FloatingWrapper>

                  <n-button
                    text
                    @click="copyEvent(pixel.event as string)"
                    :disabled="!pixel.event"
                  >
                    <n-icon :component="CopyOutline" />
                  </n-button>

                  <FloatingWrapper name="Event Properties">
                    <n-select
                      v-model:value="pixel.properties"
                      multiple
                      clearable
                      filterable
                      value-field="value"
                      label-field="name"
                      :disabled="isDisable"
                      placeholder=""
                      :options="EventPropOptions"
                    />
                  </FloatingWrapper>

                  <FloatingWrapper name="Action">
                    <n-select
                      v-model:value="pixel.action"
                      multiple
                      clearable
                      filterable
                      value-field="value"
                      label-field="show_name"
                      :disabled="isDisable"
                      placeholder=""
                      :options="eventType"
                      :max-tag-count="1"
                    />
                  </FloatingWrapper>

                  <n-button-group>
                    <n-button
                      ghost
                      class="dynamic-button"
                      :disabled="
                        (ind === 0 && pixelConfig.pixel_events.length === 1) ||
                        isDisable
                      "
                      @click="onDeletePixel(ind)"
                    >
                      <template #icon>
                        <n-icon size="12">
                          <Minus />
                        </n-icon>
                      </template>
                    </n-button>
                    <n-button
                      ghost
                      class="dynamic-button"
                      :disabled="isDisable"
                      @click="onAddPixel"
                    >
                      <template #icon>
                        <n-icon size="12">
                          <Plus />
                        </n-icon>
                      </template>
                    </n-button>
                  </n-button-group>
                </n-input-group>
              </div>
            </div>
          </n-card>

          <n-card
            title="Pixel Triggers Used"
            v-if="isEditPage"
            class="rounded-xl"
          >
            <div class="flex flex-col">
              <n-table :single-line="false" v-if="pixelTriggers.length">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in pixelTriggers" :key="index">
                    <td>
                      <a
                        :href="`/pixel_triggers/edit/${item.id}`"
                        target="_blank"
                        class="text-blue-500"
                        >{{ item.id }}</a
                      >
                    </td>
                    <td>
                      <a
                        :href="`/pixel_triggers/edit/${item.id}`"
                        target="_blank"
                        class="text-blue-500"
                        >{{ item.name }}</a
                      >
                    </td>
                    <td>
                      <div class="flex h-full items-center">
                        <n-switch
                          :value="(item.status as string)"
                          disabled
                          checked-value="on"
                          unchecked-value="off"
                        >
                          <template #checked-icon>
                            <n-icon :component="Checkmark" color="#121212" />
                          </template>
                          <template #unchecked-icon>
                            <n-icon :component="Close" />
                          </template>
                        </n-switch>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </n-table>

              <div v-else class="text-center text-xs">No Data</div>
            </div>
          </n-card>
        </div>
        <div class="flex flex-row-reverse sticky bottom-0 py-2">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :disabled="isDisable"
            :loading="isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tab-pane-pixels {
  border-left: 1px solid rgb(239, 239, 245);
  border-right: 1px solid rgb(239, 239, 245);
  border-bottom: 1px solid rgb(239, 239, 245);
}

.pixel-elm {
  .n-input:not(.n-input--autosize) {
    width: 25%;
  }

  .dynamic-button {
    padding: 0 0.5rem;
  }
}
</style>
