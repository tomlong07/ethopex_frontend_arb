<script setup lang="ts">
import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'

import Plus from '@/assets/icons/Plus.vue'
import Clone from '@/assets/icons/Clone.vue'

import { reCapchaConfigType, recapchaAPIType } from '@/types/components/types'

import { ctr_domain } from '@/services/ctr_domain'
import Minus from '@/assets/icons/Minus.vue'
import { ctr_recapcha_config } from '@/services/ctr_recapcha_config'

const isEdit = ref<boolean>(false)
const isLoading = ref(false)
const isSubmitBtnLoading = ref<boolean>(false)

const tabVersion = ref<string>('v2')

const newMiniData = () => {
  return {
    public_key: '',
    secret_key: '',
    domains: [],
    email: '',
  } as reCapchaConfigType
}

const dataConfig = ref<{ [key: string]: reCapchaConfigType[] }>({})
const dataAPI = ref<recapchaAPIType[]>([])

const loadingAPIData = ref<boolean>(true)

const payload = computed(() => {
  let payloadToAPI = [] as any[]

  for (const key in dataConfig.value) {
    if (Object.prototype.hasOwnProperty.call(dataConfig.value, key)) {
      //Chỉ save của tab hiện tại

      if (key != tabVersion.value) {
        continue
      }

      const element = dataConfig.value[key] as reCapchaConfigType[]

      element.forEach((e) => {
        if (!e.public_key && !e.secret_key && !e.email && !e.domains.length) {
          return
        }

        let copyElement = helper.clone(e)
        copyElement.disabled = undefined

        copyElement.version = key
        copyElement.domains = JSON.stringify(copyElement.domains)

        payloadToAPI.push(copyElement)
      })
    }
  }
  return payloadToAPI
})

const limitTimeByPublicKey = (publicKey: string) => {
  let text = 'Limit Time: '

  for (let index = 0; index < dataAPI.value.length; index++) {
    const element = dataAPI.value[index]

    if (element.publicKey == publicKey) {
      return (text += element.limitTime)
    }
  }

  return (text += 'No Data')
}

const domainOptions = ref<{ value: number; label: string }[]>([])

const getDomainOptions = async () => {
  const result = await ctr_domain.GetAllDomain()
  if (result?.status) {
    result.data.forEach((item: any) => {
      domainOptions.value.push({
        label: item.domain,
        value: item.id,
      })
    })
  }
}

const onDeleteMiniData = (i: number) => {
  dataConfig.value[tabVersion.value as keyof typeof dataConfig.value].splice(
    i,
    1
  )
}

const onAddMiniData = async () => {
  dataConfig.value[tabVersion.value as keyof typeof dataConfig.value].push(
    newMiniData()
  )
}

const onClone = async (miniData: reCapchaConfigType) => {
  let newData = helper.clone(miniData)
  newData.id = undefined
  dataConfig.value[tabVersion.value as keyof typeof dataConfig.value].push(
    newData
  )
}

const getSaveRecapchaConfig = async () => {
  let res = await ctr_recapcha_config.AllRecapchaConfig()

  dataConfig.value = {
    v2: [],
    v3: [],
  }

  if (res.status && res.data && res.data.length) {
    isEdit.value = true
    res.data.forEach((element: any) => {
      let copyElement = {
        id: element.id,
        public_key: element.public_key,
        secret_key: element.secret_key,
        email: element.email,
        domains: JSON.parse(element.domains),
        disabled: true,
      } as reCapchaConfigType

      if (element.version == 'v2') {
        dataConfig.value.v2.push(copyElement)
      }
      if (element.version == 'v3') {
        dataConfig.value.v3.push(copyElement)
      }
    })
  }

  if (!dataConfig.value.v2.length) {
    dataConfig.value.v2.push(newMiniData())
  }

  if (!dataConfig.value.v3.length) {
    dataConfig.value.v3.push(newMiniData())
  }
}

const getLimitTime = async () => {
  loadingAPIData.value = true
  let res = await ctr_recapcha_config.getLimitTime()

  if (res.status) {
    dataAPI.value = res.data
  }

  loadingAPIData.value = false
}

onMounted(async () => {
  isLoading.value = true

  getDomainOptions()

  getLimitTime()

  await getSaveRecapchaConfig()

  isLoading.value = false
})

const saveDataConfig = async () => {
  isSubmitBtnLoading.value = true
  let res = await ctr_recapcha_config.SaveRecapchaConfigConfig(payload.value)

  if (res.status) {
    window.message.success('Save success')
  }

  isSubmitBtnLoading.value = false
}

const changeVersion = (value: string) => {
  tabVersion.value = value
}

const handleNegativeClick = () => {
  window.message.info('Cancel!')
}
</script>
<template>
  <div
    class="wrapper flex flex-col bg-base px-3 flex-auto justify-self-auto pt-8"
  >
    <div class="flex justify-center my-6 items-center">
      <div class="w-full 5xl:w-1/2">
        <n-tabs type="line" animated :on-update:value="changeVersion">
          <n-tab-pane name="v2" tab="Version 2"> </n-tab-pane>
          <n-tab-pane name="v3" tab="Version 3"> </n-tab-pane>
        </n-tabs>
        <div v-show="isLoading">
          <Skeleton />
        </div>
        <div v-show="!isLoading" class="flex flex-wrap mt-6 gap-6">
          <n-card title="Recapcha Config">
            <div class="flex my-4">
              <div class="flex flex-col w-full">
                <div class="flex gap-2">
                  <div style="width: 24%" class="bold text-gray-500">
                    Public Key
                  </div>
                  <div style="width: 24%" class="bold text-gray-500">
                    Secret Key
                  </div>
                  <div style="width: 24%" class="bold text-gray-500">
                    Domain
                  </div>
                  <div style="width: 24%" class="bold text-gray-500">Email</div>

                  <n-button-group class="invisible">
                    <n-button>
                      <template #icon>
                        <n-icon size="12"></n-icon>
                      </template>
                    </n-button>
                    <n-button>
                      <template #icon>
                        <n-icon size="12"></n-icon>
                      </template>
                    </n-button>
                  </n-button-group>
                </div>
                <n-input-group
                  v-for="(miniData, ind) in dataConfig[tabVersion as keyof typeof dataConfig]"
                  :key="ind"
                  class="pb-8 pt-2 flex gap-2"
                  :title="miniData.disabled ? 'Double click to edit' : ''"
                >
                  <div style="width: 24%">
                    <n-input
                      v-model:value="miniData.public_key"
                      placeholder="Public Key"
                      :disabled="isLoading || miniData.disabled"
                      @dblclick="miniData.disabled = !miniData.disabled"
                    />

                    <n-spin
                      size="small"
                      v-if="loadingAPIData"
                      class="ml-3 spin-super-small"
                    />

                    <span class="ml-3 text-ssm text-gray-500" v-else>{{
                      limitTimeByPublicKey(miniData.public_key)
                    }}</span>
                  </div>

                  <div style="width: 24%">
                    <n-input
                      v-model:value="miniData.secret_key"
                      placeholder="Secret Key"
                      :disabled="isLoading || miniData.disabled"
                      @dblclick="miniData.disabled = !miniData.disabled"
                    />
                  </div>
                  <div style="width: 24%">
                    <n-select
                      placeholder="Domains"
                      v-model:value="miniData.domains"
                      filterable
                      multiple
                      :max-tag-count="1"
                      :disabled="isLoading || miniData.disabled"
                      @dblclick="miniData.disabled = !miniData.disabled"
                      :options="domainOptions"
                    />
                  </div>
                  <div style="width: 24%">
                    <n-input
                      v-model:value="miniData.email"
                      placeholder="Email"
                      :disabled="isLoading || miniData.disabled"
                      @dblclick="miniData.disabled = !miniData.disabled"
                    />
                  </div>

                  <n-button-group>
                    <n-popconfirm
                      @positive-click="onDeleteMiniData(ind)"
                      @negative-click="handleNegativeClick"
                    >
                      <template #trigger>
                        <n-button
                          ghost
                          class="dynamic-button"
                          :loading="isLoading"
                          :disabled="ind === 0 && dataConfig[tabVersion as keyof typeof dataConfig].length === 1"
                        >
                          <template #icon>
                            <n-icon size="12"><Minus /></n-icon>
                          </template>
                        </n-button>
                      </template>
                      Are you sure to delete it?
                    </n-popconfirm>

                    <n-button
                      ghost
                      class="dynamic-button"
                      :loading="isLoading"
                      @click="onAddMiniData"
                    >
                      <template #icon>
                        <n-icon size="12"><plus /></n-icon>
                      </template>
                    </n-button>

                    <n-icon
                      size="34"
                      class="clone-item-css flex items-center mx-2 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
                      title="Clone"
                      :component="Clone"
                      @click="onClone(miniData)"
                    />
                  </n-button-group>
                </n-input-group>
              </div>
            </div>
            <div class="absolute bottom-0 right-0 mb-4 mr-4">
              <n-popconfirm
                @positive-click="saveDataConfig"
                @negative-click="handleNegativeClick"
              >
                <template #trigger>
                  <n-button
                    color="#f43f5e"
                    size="medium"
                    type="success"
                    :loading="isSubmitBtnLoading"
                  >
                    Save
                  </n-button>
                </template>
                Are you sure to save it?
              </n-popconfirm>
            </div>
          </n-card>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.clone-item-css {
  opacity: 0.65;

  &:hover {
    opacity: 1;
  }
}

.text-ssm {
  font-size: 11px;
}

.spin-super-small {
  .n-spin {
    width: 12px;
    height: 12px;
  }
}
</style>
