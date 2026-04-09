<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import date2 from '@/utils/date2'

import {
  campaignTypeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import {
  creativeTypeClass,
  titlesStruct,
  defaultTitleItem,
} from '@/types/components/creative-v2'

import { copyCampaign } from '@/types/components/campaign'
import CreativeDetail3 from '@/views/details/CreativeDetail3.vue'
import { ctr_creative } from '@/services/ctr_creative'
import Close2 from '@/assets/icons/Close2.vue'
import { CreativeToCloneOptions } from '@/options/creative'
import { URL_UPLOAD } from '@/constants/urls'
import DateRanger from '@/components/common/DateRanger.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },

  sourceCopy: {
    type: String,
    required: false,
  },
  duplicateId: {
    type: Number,
    required: false,
  },
})

const data = ref<copyCampaign>({
  type: 'highest_ctr',
  start_date: date2.allTime(),
  end_date: date2.today(),
})

const sourceCreative = ref<{ id: number; ads?: number; name?: string }>({
  id: 0,
})

const isAllTime = computed<boolean>(() => {
  return (
    data.value.start_date === date2.allTime() &&
    data.value.end_date === date2.today()
  )
})

const isShowDate = computed<boolean>(() => {
  return ['highest_ctr', 'highest_cvr'].includes(data.value.type)
})

const creativeComponent = ref<InstanceType<typeof CreativeDetail3>>()

const showModalCreative = ref<boolean>(false)
const showConfirm = ref<boolean>(false)
const showCreative = ref<boolean>(false)
const isLoadingDivCreative = ref<boolean>(false)
const isCreatingCreative = ref<boolean>(false)

const changeSourceCreative = (value: {
  id: number
  ads?: number
  name?: string
}) => {
  sourceCreative.value = value
}

const changeShowModalCreative = (value: boolean) => {
  showModalCreative.value = value
}

const creativeToCloneOptions: SelectOption[] = CreativeToCloneOptions

const quitWithoutSaving = () => {
  showConfirm.value = false
  showCreative.value = false
  changeShowModalCreative(false)
}

const openConfirm = () => {
  showConfirm.value = true
}

const generateCreative = async () => {
  isLoadingDivCreative.value = true

  switch (data.value.type) {
    case 'all':
      if (!sourceCreative.value?.id) {
        window.message.error('Creative ID not found!')
        return
      }

      const result = await ctr_creative.GetByID({
        id: sourceCreative.value?.id,
      })

      if (result?.data) {
        showCreative.value = true

        await helper.sleep(1)

        let newData = new creativeTypeClass({})

        const data = result?.data
        newData.name = data.name ? data.name + ' - Copy - ' + Date.now() : ''

        if (props.campaign.IsTrafficGoogle()) {
          newData.images = data.images

          newData.ad_type = 'default'

          try {
            if (newData.images && newData.images.length) {
              if (newData.images[0].image.includes('.mp4')) {
                newData.ad_type = 'video'
              }
            }
          } catch {}

          newData.SetDemandGen()
          newData.SetIconDefault()

          if (
            new campaignTypeClass({
              traffic_source: props.sourceCopy,
            }).IsTrafficTaboola()
          ) {
            let nativeTitle = [] as string[]
            data.titles.forEach((element: any) => {
              nativeTitle.push(element.title)
            })

            newData.titles = [
              {
                //site name -> title, title -> description
                title: JSON.stringify([data.site_name || '']),
                description: JSON.stringify(nativeTitle),
              },
            ] as titlesStruct[]
          }
        }

        if (props.campaign.IsTrafficSnapchat()) {
          newData.site_name = data.site_name
          newData.SetSnapchat()

          newData.titles = [defaultTitleItem()]
          newData.info_image = []

          try {
            for (let index = 0; index < data.images.length; index++) {
              const element = data.images[index]

              for (let i = 0; i < data.titles.length; i++) {
                const e = data.titles[i]

                newData.info_image.push({
                  title: e.title,
                  description: e.description,
                  call_to_action: '',
                  image: element.image,
                })
              }
            }
          } catch {}
        }

        creativeComponent?.value?.changeDataByModal(
          newData as creativeTypeClass
        )
      }

      break

    case 'highest_ctr':
    case 'highest_cvr':
      if (!props.duplicateId) {
        window.message.error('Campaign ID not found!')
        return
      }

      const resultAd = await ctr_creative.GetAdByType({
        campaign_id: props.duplicateId,
        type: data.value.type,
        start_date: data.value.start_date,
        end_date: data.value.end_date,
      })

      if (resultAd?.status) {
        showCreative.value = true
        await helper.sleep(1)

        if (!resultAd?.data) {
          window.message.error(
            `No data found for creative! ${JSON.stringify(resultAd)}`
          )
          showCreative.value = false
          return
        }

        let newData = new creativeTypeClass({
          name: resultAd?.data?.name
            ? resultAd?.data?.name + ' - Copy - ' + Date.now()
            : '',
        })

        switch (true) {
          case props.campaign.IsTrafficSnapchat():
            newData.site_name = resultAd?.data?.site_name
            newData.titles = [{ title: resultAd?.data?.title } as titlesStruct]

            newData.info_image = [
              {
                title: resultAd?.data?.title,
                description: resultAd?.data?.description,
                image: (resultAd?.data?.thumbnail_url || '').replace(
                  URL_UPLOAD,
                  ''
                ),
              },
            ]
            newData.images = []

            newData.SetSnapchat()
            break

          case props.campaign.IsTrafficGoogle():
            newData.titles = [
              //site name -> title, title -> description

              {
                title: resultAd?.data?.site_name,
                description: resultAd?.data?.title,
              } as titlesStruct,
            ]

            newData.ad_type = 'default'

            try {
              if (resultAd?.data?.thumbnail_url.includes('video')) {
                newData.ad_type = 'video'
              }
            } catch {}

            newData.images = [
              {
                image: (resultAd?.data?.thumbnail_url || '').replace(
                  URL_UPLOAD,
                  ''
                ),
                image_ratio: resultAd?.data?.image_ratio,
              },
            ]
            newData.SetDemandGen()
            newData.SetIconDefault()
            break
          default:
            break
        }

        creativeComponent?.value?.changeDataByModal(
          newData as creativeTypeClass
        )
      }

      break
  }

  isLoadingDivCreative.value = false
}

const createCreative = async () => {
  isCreatingCreative.value = true
  const result = await creativeComponent?.value?.submitForm()

  isCreatingCreative.value = false

  if (result?.status && result?.data) {
    if (props.campaign?.creative) {
      if (props.campaign.IsTrafficGoogle()) {
        props.campaign.ad_groups = [
          {
            name: 'Ad Group 1',
            creatives: [{ creative_id: result?.data }],
            status: 'on',
          },
        ]
      } else {
        props.campaign.creative = { id: result?.data }
      }

      props.statusData.refreshCreative()
    }

    changeShowModalCreative(false)
  }
}

const updateDate = (date: string[]) => {
  if (!date || date.length != 2) {
    console.error('GroupBy->updateDate: date is not correct', date)
  }

  data.value.start_date = date[0]
  data.value.end_date = date[1]
}

defineExpose({
  changeShowModalCreative,
  changeSourceCreative,
})

const isShow = computed<boolean>(() => {
  return (
    (props.campaign?.traffic_source &&
      props.campaign?.demand_source &&
      props.campaign?.creative &&
      props.campaign.IsAPI()) ||
    false
  )
})
</script>
<template>
  <div>
    <n-modal
      v-if="isShow"
      v-model:show="showModalCreative"
      style="height: 95vh; width: 95vw"
      class="p-2"
      :mask-closable="false"
      :close-on-esc="false"
      @mask-click="openConfirm"
      @esc="openConfirm"
    >
      <n-card
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        content-style="padding: 12px;display:flex;flex-direction: column;gap:1rem"
      >
        <n-card :bordered="false" content-style="padding: 0px" class="h-9"
          ><div class="flex">
            <div class="font-medium text-lg">
              {{ `Clone Creative ${sourceCreative?.name}` }}

              <a :href="`/creative/${sourceCreative?.id}`" target="_blank">
                {{ ` (ID: ${sourceCreative?.id})` }}</a
              >
            </div>
            <n-icon
              size="26"
              class="ml-auto button-close cursor-pointer"
              @click="openConfirm"
              ><Close2
            /></n-icon></div
        ></n-card>
        <n-card
          :bordered="false"
          content-style="padding: 0px;overflow:auto"
          style="height: calc(95vh - 11rem)"
        >
          <!-- 2 * h-9 + 2 *p-2 + 2* padding 12 + gap: 2rem *2-->
          <div class="flex gap-4 flex-col">
            <div class="flex items-center">
              <div class="w-1/12 font-bold">Creative to Clone</div>
              <div class="w-11/12 flex flex-row items-center gap-4">
                <n-select
                  :options="creativeToCloneOptions"
                  v-model:value="data.type"
                ></n-select>
              </div>
            </div>

            <div class="flex items-center h-10" v-if="isShowDate">
              <div class="w-1/12 font-bold">Time</div>
              <div class="w-11/12 flex flex-row items-center gap-4">
                <DateRanger
                  :status="{ isFetching: false }"
                  classLabel="hidden"
                  :defaultDate="[data.start_date as string, data.end_date as string]"
                  :teleport="true"
                  @updateDate="updateDate"
                />

                <n-tag type="success" v-if="isAllTime" size="large">
                  All Time
                </n-tag>
              </div>
            </div>

            <div>
              <n-button
                dashed
                type="info"
                @click="generateCreative"
                :loading="isLoadingDivCreative"
              >
                Generate Creative</n-button
              >
            </div>
          </div>

          <n-card v-if="showCreative" class="mt-4">
            <n-spin :show="isLoadingDivCreative">
              <CreativeDetail3
                :dataModal="{ id: 0 }"
                ref="creativeComponent"
                :disabledType="true"
                :traffic_source="props.campaign?.traffic_source"
                :sourceCopy="props.sourceCopy"
              />
            </n-spin>
          </n-card>
        </n-card>
        <n-card class="h-9" :bordered="false">
          <div class="flex">
            <div class="ml-auto flex flex-row gap-4 items-center">
              <n-button
                color="#f43f5e"
                size="medium"
                type="success"
                :loading="isCreatingCreative"
                :disabled="isLoadingDivCreative || !showCreative"
                @click="createCreative"
                >Create Creative
              </n-button>
            </div>
          </div>
        </n-card>
      </n-card>
    </n-modal>

    <n-modal
      v-model:show="showConfirm"
      preset="dialog"
      content="Please note that the changes that were made will not be saved."
      positive-text="Continue"
      negative-text="Quit without saving"
      :show-icon="false"
      :closable="false"
      @negative-click="quitWithoutSaving"
    />
  </div>
</template>
