<script setup lang="ts">
import Facebook from '@/assets/icons/Facebook.vue'
import Clone from '@/assets/icons/Clone.vue'

import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'

import useGeneralStore from '@/store/useGeneralStore'
import { campaignType } from '@/types/components/campaign'
import {
  campaignTypeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import ActivityModal from '@/components/modal/ActivityModal.vue'
import campaignIs from '@/composables/campaign-action'
import useActivityStore from '@/store/useActivityStore'

import { useLogCampFB } from '@/store/logCampFBStore'
import { useGroupFilterStore } from '@/store/activity/groupFilter'

import useCampaign2Store from '@/store/useCampaign2Store'
import AILog from '@/assets/icons/activity/AILog.vue'
import { NIcon } from 'naive-ui'
import MenuIcon from '@/assets/icons/MenuIcon.vue'
import BarCharLine from '@/assets/icons/BarCharLine.vue'
import CC_Circle from '@/assets/icons/CC_Circle.vue'
import { DUPLICATE_TYPE, TS } from '@/enum/campaign'
import Journals from '@/assets/icons/Journals.vue'
import Logging from '@/assets/icons/Logging.vue'
import { FeSettings } from '@/class/fe_settings'
import { ctr_report } from '@/services/ctr_report'
const ModalAiLog = defineAsyncComponent(
  () => import('@/components/campaign/modal/ModalAiLog.vue')
)
const ModalFBLog = defineAsyncComponent(
  () => import('@/components/campaign/modal/ModalFBLog.vue')
)

const logCampFBStore = useLogCampFB()
const campaignStore = useCampaign2Store()
const generalStore = useGeneralStore()
const groupFilterStore = useGroupFilterStore()

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const feSettings = ref<FeSettings>(new FeSettings({}))

onMounted(async () => {
  const result = await ctr_report.ReportCampaignSettings()
  feSettings.value = new FeSettings(result?.data || {})
})

const addUrl = computed(() => {
  return feSettings.value.AddURL(props.campaign.traffic_source as string)
})

const urlDuplicate = computed(() => {
  let url = `${addUrl.value}?duplicate=${props.campaign.id}`

  if (hasCloneV2()) {
    url += `&mode=${DUPLICATE_TYPE.DUPLICATE}`
  }

  return url
})

const hasClone = () => {
  return feSettings.value.TrafficHasClone(
    props.campaign.traffic_source as string
  )
}

const isComp = window.arb.isCompany()

const hasCloneV2 = () => {
  return feSettings.value.TrafficHasCloneV2(
    props.campaign.traffic_source as string
  )
}

const hasCopy = () => {
  return feSettings.value.TrafficHasCopy(
    props.campaign.traffic_source as string
  )
}

const onClone = async () => {
  if (!props.campaign.id) return
  campaignIs.cloneAction(props.campaign.id as number, window.message, '')
}

const onCopy = () => {
  if (
    !props.campaign.id ||
    !props.campaign.traffic_source ||
    !props.campaign.creative?.id
  ) {
    return
  }
  generalStore.changeModalCopyCampaign(true, {
    id: props.campaign.id,
    traffic_source: props.campaign.traffic_source,
    creative_id: props.campaign.creative?.id,
  } as campaignType)
}
const openLink = (link: string) => {
  window.open(link, '_blank')
}

const objStore = useActivityStore()
const openModal = () => {
  objStore.showModal = true

  if (props.campaign.id) {
    groupFilterStore.payload.filter.campaign = props.campaign.id?.toString()

    objStore.isDefaultAllTime = true
  }
}
const openModalLogInFB = () => {
  logCampFBStore.showModal = true
  logCampFBStore.idCampaign = props.campaign.id
}

const openModalAiLog = () => {
  campaignStore.showModalAiLog = true
  campaignStore.idCampaign = props.campaign.id
}

onBeforeUnmount(() => {
  groupFilterStore.payload.filter.campaign = 'all'
  objStore.isDefaultAllTime = false
})

const isShowLogFB = computed(() => {
  return props.campaign.traffic_source === TS.FACEBOOK
})

const isShowAiLog = computed(() => {
  return props.campaign.IsLabelAI()
})

const renderIcon = (icon: any) => {
  return () => h(NIcon, null, { default: () => h(icon, { size: 20 }) })
}

const menuOptions = computed(() => {
  const options = []

  if (isShowLogFB.value) {
    options.push({
      label: 'Facebook Logs',
      key: 'facebookLogs',
      icon: renderIcon(Facebook),
    })
  }

  if (isShowAiLog.value) {
    options.push({
      label: 'AI Log',
      key: 'aiLog',
      icon: renderIcon(AILog),
    })
  }

  if (isComp) {
    options.push({
      label: 'Log',
      key: 'log',
      icon: renderIcon(Logging),
    })
  }

  options.push({
    label: 'Report',
    key: 'report',
    icon: renderIcon(BarCharLine),
  })

  if (urlDuplicate.value) {
    options.push({
      label: 'Duplicate',
      key: 'duplicate',
      icon: renderIcon(DuplicateOutline),
    })
  }

  if (hasCloneV2()) {
    options.push({
      label: 'Duplicate keep link',
      key: 'duplicateKeepLink',
      icon: renderIcon(Journals),
    })
  }

  if (hasClone()) {
    options.push({
      label: 'Clone by API',
      key: 'clone',
      icon: renderIcon(Clone),
    })
  }

  if (hasCopy()) {
    options.push({
      label: 'Copy To Other Traffic Source',
      key: 'copy',
      icon: renderIcon(CC_Circle),
    })
  }

  return options
})
const handleMenuOptionSelect = (key: any) => {
  switch (key) {
    case 'facebookLogs':
      openModalLogInFB()
      break
    case 'aiLog':
      openModalAiLog()
      break
    case 'log':
      openModal()
      break
    case 'report':
      openLink(`/?campaigns=${props.campaign.id}`)
      break
    case 'duplicate':
      openLink(urlDuplicate.value)
      break
    case 'duplicateKeepLink':
      openLink(
        `${addUrl.value}?duplicate=${props.campaign.id}&mode=${DUPLICATE_TYPE.DUPLICATE_KEEP_LINK}`
      )
      break
    case 'clone':
      onClone()
      break
    case 'copy':
      onCopy()
      break
  }
}
</script>

<template>
  <!-- trường hợp các options > 1 thì sẽ là dropdown -->
  <div v-if="menuOptions && menuOptions.length > 1">
    <n-dropdown
      class="custom-user-action-dropdown action-btn-dark"
      trigger="click"
      :options="menuOptions"
      @select="handleMenuOptionSelect"
    >
      <n-button strong secondary class="bg-button-second">
        <div class="flex items-center gap-2">
          <n-icon :component="MenuIcon" size="24" />
          Actions
        </div>
      </n-button>
    </n-dropdown>
  </div>
  <!-- trường hợp các options === 1 -->
  <div v-else class="flex items-center gap-2">
    <n-button
      v-if="isShowLogFB"
      strong
      secondary
      @click="openModalLogInFB"
      class="bg-button-second"
      title="Log in Facebook"
    >
      <div class="flex items-center gap-2">
        <n-icon :component="Facebook" size="24" /> Facebook Logs
      </div>
    </n-button>
    <n-button
      v-if="isShowAiLog"
      strong
      secondary
      @click="openModalAiLog"
      class="bg-button-second"
      title="AI Log"
    >
      <div class="flex items-center gap-2">
        <n-icon :component="AILog" size="24" /> AI Log
      </div>
    </n-button>

    <n-button
      v-if="isComp"
      strong
      secondary
      @click="openModal"
      class="bg-button-second"
      title="Log"
    >
      <a
        :href="`/?campaigns=${props.campaign.id}`"
        @click.prevent
        class="flex items-center gap-2"
      >
        <n-icon :component="Logging" size="24" />
        Log
      </a>
    </n-button>

    <n-button
      strong
      secondary
      @click="openLink(`/?campaigns=${props.campaign.id}`)"
      class="bg-button-second"
      title="Report"
    >
      <a
        :href="`/?campaigns=${props.campaign.id}`"
        @click.prevent
        class="flex items-center gap-2"
      >
        <n-icon :component="BarCharLine" size="24" />
        Report
      </a>
    </n-button>

    <n-button
      strong
      secondary
      class="bg-button-second"
      v-if="urlDuplicate"
      @click="openLink(urlDuplicate)"
      title="Duplicate"
    >
      <a :href="urlDuplicate" @click.prevent class="flex items-center gap-2">
        <n-icon :component="DuplicateOutline" size="24" />
        Duplicate
      </a>
    </n-button>

    <n-button
      strong
      secondary
      class="bg-button-second"
      v-if="hasCloneV2()"
      @click="
        openLink(
          `${addUrl}?duplicate=${props.campaign.id}&mode=${DUPLICATE_TYPE.DUPLICATE_KEEP_LINK}`
        )
      "
      title="Duplicate keep link"
    >
      <a
        :href="`${addUrl}?duplicate=${props.campaign.id}&mode=${DUPLICATE_TYPE.DUPLICATE_KEEP_LINK}`"
        @click.prevent
        class="flex items-center gap-2"
      >
        <n-icon size="24" :component="Journals" @click.prevent class="mr-2" />
        Duplicate keep link
      </a>
    </n-button>

    <n-button
      strong
      secondary
      class="bg-button-second"
      v-if="hasClone()"
      @click="onClone"
      title="Clone by API"
    >
      <n-icon size="24" :component="Clone" @click.prevent class="mr-2" />
      Clone
    </n-button>

    <n-popover trigger="hover" v-if="hasCopy()">
      <template #trigger>
        <n-button strong secondary class="bg-button-second" @click="onCopy">
          <n-icon
            size="24"
            :component="CC_Circle"
            @click.prevent
            class="mr-2"
          />
          Copy
        </n-button>
      </template>
      Copy To Other Traffic Source
    </n-popover>
  </div>

  <ActivityModal />
  <ModalFBLog v-if="isShowLogFB" />
  <ModalAiLog v-if="isShowAiLog" />
</template>

<style scoped lang="scss">
.bg-button-second {
  background-color: #fecaca;

  &:hover {
    background-color: #fca5a5;
  }
}
</style>

<style>
#logCampaign .n-card__content {
  padding-top: 0;
  /* overflow: scroll; */
}
</style>
