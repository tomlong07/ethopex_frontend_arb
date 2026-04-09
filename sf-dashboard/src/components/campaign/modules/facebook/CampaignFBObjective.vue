<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  campaignTypeClass,
  FreezeClass,
  typeObjectOptionsFB,
} from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { CDN_IMAGE } from '@/constants/urls'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
  isCrawlFb: {
    type: Boolean,
    default: false,
  },
})

const showFull = ref(true)
const hoverDiv = ref<string>('')

const typeObjectOptions: SelectOption[] = typeObjectOptionsFB

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.type = 'OUTCOME_SALES'
    } else {
      props.campaign.type = undefined
    }
  }
)

const name = 'Objective'

const isDisabled = computed(() => {
  if (props.FreezeData.isEditPage()) {
    return true
  }

  return false
})

const onClickObjective = (value: string) => {
  let thisValue = typeObjectOptions.find((o) => o.value === value)

  if (thisValue?.disabled) {
    window.message.warning('This objective is not available yet')

    return
  }
  if (isDisabled.value) return
  props.campaign.type = value

  try {
    props.campaign.ad_groups?.forEach((group) => {
      group.creatives?.forEach((ad) => {
        ad.creative_id = null
      })
    })
  } catch (error) {
    console.error(error)
  }
}

const anh1 = `${CDN_IMAGE}/s3-pw/arb/images/3kig_tKz8BP.png`
const anh2 = `${CDN_IMAGE}/s3-pw/arb/images/y9VaqZ6iTwt.png`
const anh3 = `${CDN_IMAGE}/s3-pw/arb/images/GT8ZpifDqUK.png`

const objectiveObj: {
  [key: string]: {
    text: string
    mask: string
    url: string
    thumb?: { mask: string; url: string }
    goodFor?: string[]
  }
} = {
  BRAND_AWARENESS: {
    text: 'Show your ads to people who are most likely to remember them.',
    mask: '-65px -218px',
    thumb: {
      mask: '0px -171px',
      url: anh3,
    },
    url: anh1,
    goodFor: [
      'Reach',
      'Brand awareness',
      'Video views',
      'Store location awareness',
    ],
  },
  OUTCOME_TRAFFIC: {
    text: 'Send people to a destination, like your website, app, Instagram profile or Facebook event.',
    mask: '-292px -177px',
    thumb: {
      mask: '0px -855px',
      url: anh3,
    },
    url: anh1,

    goodFor: [
      'Link clicks',
      'Landing page views',
      'Instagram profile visits',
      'Messenger, Instagram and Whatsapp',
      'Calls',
    ],
  },
  OUTCOME_ENGAGEMENT: {
    text: 'Get more messages, purchases through messaging, video views, post engagement, Page likes or event responses.',
    mask: '0px -301px',
    thumb: {
      mask: '0px -1026px',
      url: anh3,
    },
    url: anh2,
    goodFor: [
      'Messenger, Instagram and Whatsapp',
      'Video views',
      'Post engagement',
      'Conversions',
      'Calls',
    ],
  },
  OUTCOME_LEADS: {
    text: 'Collect leads for your business or brand.',
    mask: '-334px -177px',
    thumb: {
      mask: '0px -513px',
      url: anh3,
    },
    url: anh1,
    goodFor: [
      'Instant forms',
      'Messenger, Instagram and Whatsapp',
      'Conversions',
      'Calls',
    ],
  },
  OUTCOME_APP_PROMOTION: {
    text: 'Find new people to install your app and continue using it. ',
    mask: '0px -280px',
    thumb: {
      mask: '0px 0px',
      url: anh3,
    },
    url: anh2,
    goodFor: ['App installs', 'App events'],
  },
  OUTCOME_SALES: {
    text: 'Find people likely to purchase your product or service.',
    mask: '-128px -218px',
    thumb: {
      mask: '0px -684px',
      url: anh3,
    },
    url: anh1,

    goodFor: [
      'Conversions',
      'Catalog sales',
      'Messenger, Instagram and Whatsapp',
      'Calls',
    ],
  },
}

const onHover = (value: string) => {
  hoverDiv.value = value
}
const onLeave = () => {}

const moreInfo = computed<{
  text: string
  mask: string
  url: string
  thumb?: { mask: string; url: string }
  goodFor?: string[]
}>(() => {
  if (hoverDiv.value) return objectiveObj[hoverDiv.value]

  if (props.campaign.type) {
    return objectiveObj[optionNow.value?.value as string]
  }

  return objectiveObj['']
})

const optionNow = computed(() => {
  const findValue = hoverDiv.value || props.campaign.type
  if (findValue) {
    const indexNow = typeObjectOptions.findIndex((o) => o.value === findValue)
    return typeObjectOptions[indexNow]
  }

  return {}
})
</script>

<template>
  <FloatingWrapper :name="name" rounded required v-if="props.campaign.IsAPI()">
    <div
      class="flex-1 min-w-0 flex gap-4 border rounded-md pt-4 p-2"
      v-if="showFull"
    >
      <n-button
        @click="showFull = false"
        size="small"
        type="info"
        class="absolute right-6"
        >Hide</n-button
      >
      <div class="flex flex-col gap-4">
        <template
          v-for="(option, ind) in typeObjectOptions"
          :key="option.value + ind"
        >
          <div
            :class="[
              'border-exclude w-40 flex gap-2 flex-shrink-0 items-center text-center cursor-pointer px-4 py-2 border-2 rounded-lg hover:border-green-300',
              {
                'border-green-500': props.campaign.type === option.value,
                'opacity-50': option.disabled,
              },
            ]"
            @click="onClickObjective(`${option.value}`)"
            @mouseenter="onHover(option.value as string)"
            @mouseleave="onLeave"
          >
            <div
              class="custom-bg-camp-setting"
              style="background-color: black; width: 20px; height: 20px"
              :style="{
                  maskPosition:objectiveObj[option.value as string]?.mask || '',
                  maskImage: `url(${objectiveObj[option.value as string]?.url || ''})`,
                }"
            ></div>
            {{ option.label }}
          </div>
        </template>
      </div>

      <div class="w-full">
        <div class="flex justify-center flex-shrink-0">
          <div class="overflow-hidden inline-block justify-end">
            <i
              style="
                background-size: auto;
                width: 170px;
                height: 170px;
                transform-origin: top left;
                background-repeat: no-repeat;
                display: inline-block;
              "
              :style="{
                backgroundImage: `url(${moreInfo?.thumb?.url || ''})`,
                backgroundPosition: moreInfo?.thumb?.mask || '',
              }"
            ></i>
          </div>
        </div>

        <div class="flex flex-col gap-2 text-xs">
          <b>{{ optionNow.label }}</b>
          {{ moreInfo?.text || '' }}

          <b>Good For:</b>
          <div v-if="moreInfo?.goodFor" class="flex gap-2 flex-wrap">
            <n-tag
              size="small"
              v-for="(o, index) in moreInfo?.goodFor"
              :key="index"
              >{{ o }}</n-tag
            >
          </div>
        </div>
      </div>
    </div>

    <div class="w-5/6 flex gap-4 items-center" v-else>
      <div
        :class="[
          'w-40 flex gap-2 flex-shrink-0 items-center text-center cursor-pointer px-4 py-2 border-2 rounded-lg hover:border-green-300 border-green-500',
        ]"
      >
        <div
          style="background-color: black; width: 20px; height: 20px"
          :style="{
                  maskPosition:objectiveObj[optionNow.value as string]?.mask || '',
                  maskImage: `url(${objectiveObj[optionNow.value as string]?.url || ''})`,
                }"
        ></div>
        {{ optionNow.label }}
      </div>
      <n-button
        @click="showFull = true"
        size="small"
        type="info"
        class="ml-auto"
        >More</n-button
      >
    </div>
  </FloatingWrapper>
</template>
