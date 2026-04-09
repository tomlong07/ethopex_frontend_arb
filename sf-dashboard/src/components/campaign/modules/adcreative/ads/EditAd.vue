<script setup lang="ts">
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import useAdDataStore from '@/store/adDataStore'
import { SelectOption } from 'naive-ui'
import { renderIcon } from '@/utils/utils'
import { AD_SETUP } from '@/enum/campaign'
import { NButton, NDropdown, NIcon } from 'naive-ui' //Import để dùng ở component ở report tabulator
import { ctr_campaign } from '@/services/ctr_campaign'
import Edit20Regular from '@/assets/icons/Edit20Regular.vue'
import ToggleOff from '@/assets/icons/ToggleOff.vue'
import ToggleOn from '@/assets/icons/ToggleOn.vue'
import EyeOutline from '@/assets/icons/EyeOutline.vue'
import CopyOutline from '@/assets/icons/CopyOutline.vue'

const adDataStore = useAdDataStore()

const props = defineProps({
  campaignId: {
    type: Number,
    required: false,
  },
  item: {
    type: Object as () => any,
    required: true,
  },
  isShowChangeAd: {
    type: Boolean,
    default: false,
  },

  fromReport: {
    type: Boolean,
    default: false,
  },

  classNow: {
    type: String,
    default: 'absolute left-2',
  },
})

const options = computed(() => {
  let opts: SelectOption[] = []

  if (props.item.ad_setup === AD_SETUP.USE_EXISTING_POST) {
    opts = [
      {
        label: 'View Ad',
        key: 'view_ad',
        icon: renderIcon(EyeOutline),
      },
    ]
  }
  if (props.isShowChangeAd) {
    opts = opts.concat([
      {
        label: 'Edit Creative Ad',
        key: 'edit_creative_ad',
        icon: renderIcon(Edit20Regular),
      },

      {
        label: 'Copy Creative ID',
        key: 'creative_id',
        icon: renderIcon(CopyOutline),
      },

      {
        label: 'Copy Ad ID',
        key: 'ad_id',
        icon: renderIcon(CopyOutline),
      },
    ])
  }

  if (props.item.ad_setup === AD_SETUP.CREATE_AD) {
    if (props.isShowChangeAd) {
      opts = opts.concat([
        {
          type: 'divider',
          key: 'd1',
        },
      ])
    }
    opts = opts.concat([
      {
        label: 'Fanpage',
        key: 'change_creative',
        icon: renderIcon(Edit20Regular),
      },
    ])
  }

  if (props.fromReport) {
    opts = opts.concat([
      {
        label: 'ON',
        key: 'on',
        color: 'red',
        icon: renderIcon(ToggleOn),
      },
      {
        label: 'OFF',
        key: 'off',
        icon: renderIcon(ToggleOff),
      },
    ])
  }

  return opts
})

const openModalAd = () => {
  adDataStore.adInfo = props.item

  adDataStore.campaignId = props.campaignId
  adDataStore.showModal = true
}

const openModalAdExist = () => {
  adDataStore.changeDataModal(props.item)
  adDataStore.showModalExist = true
}

const openModalAdCreate = () => {
  adDataStore.changeDataModal(props.item)
  adDataStore.showModalCreate = true
}

const handleSelect = async (key: string) => {
  if (!props.campaignId) {
    window.message.warning('Campaign ID not found!')
    return
  }

  switch (key) {
    case 'change_creative':
      openModalAdCreate()
      break

    case 'on':
    case 'off':
      const statusLoading = window.message.loading('Processing...')
      let payload: { [key: string]: any } = {
        campaign_id: props.campaignId,
        status: key,
      }

      if (props.fromReport) {
        payload.ad_id = props.item.id
      } else {
        payload.creative_submit_id = props.item.id
      }
      const result = await ctr_campaign.ChangeStatusAds(payload)

      if (result?.status) {
        window.message.success('Status changed successfully')
        if (!props.fromReport) {
          props.item.status = key
        }
      }

      statusLoading.destroy()
      break

    case 'edit_creative_ad':
      if (props.item.ad_setup === AD_SETUP.USE_EXISTING_POST) {
        openModalAdExist()
      } else {
        openModalAd()
      }

      break

    case 'creative_id':
      if (!props.item?.creative_id) {
        window.message.warning(`Creative ID not found!`)
        return
      }
      helper.copyText(props.item?.creative_id)
      window.message.success(`Copied!`)

      break

    case 'ad_id':
      if (!props.item?.ad_id) {
        window.message.warning(`Ad ID not found!`)
        return
      }
      helper.copyText(props.item?.ad_id)
      window.message.success(`Copied!`)
      break
    case 'view_ad':
      openModalAd()
      break
  }
}
</script>

<template>
  <div :class="props.classNow">
    <n-dropdown trigger="hover" :options="options" @select="handleSelect">
      <n-button text>
        <template #icon>
          <n-icon
            class="rounded-full"
            title="Edit"
            :component="Settings20Regular"
            size="22"
          /> </template
      ></n-button>
    </n-dropdown>
  </div>
</template>
