<script setup lang="ts">
import Shared from '@/components/campaign/Shared'
import { campaignMenu } from '@/plugins/reuseable'

import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { debounce } from '@/utils'
import ListStars from '@/assets/icons/ListStars.vue'
import { usePresetCampaign } from '@/store/campaign/usePresetCampaign'
import ModalCampaign from '@/components/campaign/modal/ModalCampaign.vue'

import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
const store = usePresetCampaign()

const menuOptions = Shared.optionsMenu()

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const accountSelected = computed(() =>
  props.statusData.getAccountSelected(props.campaign.account_supply_id)
)
const accountCategoryIdNow = computed(() =>
  props.statusData.getAccountCategoryIdNow(props.campaign.account_supply_id)
)
watch(
  () => accountCategoryIdNow.value,
  async (newValue, oldValue) => {
    props.campaign.account = accountCategoryIdNow.value
  }
)
const isLoading = ref<boolean>(false)
const showName = computed<string>(() => {
  const propsName = props.campaign.traffic_source
  if (props.campaign.IsTrafficSmartNews()) {
    return 'Smart News Account'
  }
  return helper.capitalizeFirstLetter(propsName || '') + ' Account'
})

const accountIdNow = computed<string>(() => {
  if (helper.isEmpty(accountSelected.value)) {
    return ''
  }

  return accountSelected.value.detail_id != null
    ? accountSelected.value.detail_id.toString()
    : ''
})

const handleMenu = (key: string) => {
  campaignMenu(key, {
    accountIdNow: accountIdNow.value,
    accountCategoryIdNow: accountCategoryIdNow.value,
  })
}

const handleSearchAccounts = debounce(async (query: string) => {
  await fetchAccounts(query)
}, 500) // 2000ms tương đương với 2 giây

const fetchAccounts = async (query?: string) => {
  isLoading.value = true

  const result = await ctr_traffic_source.GetAccountV2({
    object: props.campaign.traffic_source,
    id: props.campaign.account_supply_id || undefined,
    q: query || '',
    limit: 100,
  })

  if (props.campaign.IsTrafficNewsbreak()) {
    props.statusData.accountOptions = (result?.data?.accounts || []).map(
      (account: any) => ({
        ...account,
        name: `${account.name} (${account.ads_current}/${account.ads_limit})`,
        disabled: account.is_disable === true,
      })
    )
  } else {
    props.statusData.accountOptions = result?.data?.accounts || []
  }

  isLoading.value = false
}

//Define ra biến riêng để ko bị trường hợp on off nó computed -> có thể đổi đc
let disableForever = !props.campaign.IsNotPushToAPI()

const isDisabled = computed<boolean>(() => {
  if (!props.campaign.account_supply_id) return false
  if (props.campaign.traffic_source) {
    //Manual change account supply id Tuan 05/06/25

    if (props.FreezeData.isEditPage() && props.campaign.IsManual()) {
      return false
    }

    //Cho đổi tài khoản với fb //Quyền 26/12/24
    if (
      props.campaign.IsTrafficFacebook() &&
      props.FreezeData.isDuplicatePageV2()
    ) {
      return false
    }

    //đổi account_supply_id cho api edit với status = off và chưa có traffic_source_id
    if (props.FreezeData.isEditPage()) {
      return disableForever
    }

    switch (true) {
      case props.FreezeData.isEditPage() && props.campaign.IsAPI():
        return true
      case props.FreezeData.isEditPage() && props.campaign.IsOnlyAPI():
        return true
      case props.FreezeData.isDuplicatePageV2() &&
        props.campaign.IsCloneCampaign():
        //2 cái này giống hệt nhau, chỉ khác chỗ bot là đc đổi account
        if (props.campaign.IsByBot()) return false //By bot đc đổi account
        return true
      default:
        return false
    }
  }

  return true
})

const isShow = computed<boolean>(() => {
  return props.campaign.traffic_source ? true : false
})

watch(
  () => props.campaign.traffic_source,
  async (newValue, oldValue) => {
    //edit không cho edit traffic source nên ko cần watch
    if (props.FreezeData.isEditPage()) {
      return
    }
    fetchAccounts()
  }
)

// preset_default = on
// theo dõi account được cập nhật để fetch api
watch(
  () => props.campaign.account_supply_id,
  async (newValue, oldValue) => {
    fetchAccounts()
  }
)
const refetchAccounts = async () => {
  await helper.sleep(0) //đợi 1 tick để clear value
  fetchAccounts()
}

watch(
  () => props.statusData.IsTabCampaign(),
  async (v) => {
    if (v && isShow.value) {
      await fetchAccounts()
    }
  },
  { deep: true }
)
</script>

<template>
  <FloatingWrapper
    v-if="!campaign.IsAPIPublic()"
    :name="showName"
    rounded
    required
  >
    <div class="flex gap-2 items-center">
      <n-select
        v-model:value="props.campaign.account_supply_id"
        filterable
        remote
        value-field="id"
        label-field="name"
        :disabled="isDisabled"
        :loading="isLoading"
        :placeholder="showName"
        :options="props.statusData.accountOptions"
        clearable
        :on-clear="refetchAccounts"
        @search="handleSearchAccounts"
      />
      <n-dropdown
        v-if="props.campaign.account_supply_id && accountIdNow"
        trigger="hover"
        :options="menuOptions"
        @select="handleMenu"
        class="custom-dropdown-adg-creative"
      >
        <n-button color="#f43f5e" type="default"><ListStars /></n-button>
      </n-dropdown>
      <n-button
        v-if="props.campaign.IsTrafficFacebook()"
        @click="store.openModal"
        >Preset
      </n-button>
    </div>
  </FloatingWrapper>

  <!-- <div class="flex items-center gap-2">
    <div class="w-40 font-bold flex gap-2">{{ showName }}<RedDot /></div>
    <div class="flex-1 min-w-0 flex gap-2">
      <n-select
        v-model:value="props.campaign.account_supply_id"
        filterable
        remote
        value-field="id"
        label-field="name"
        :disabled="isDisabled"
        :loading="isLoading"
        :placeholder="showName"
        :options="props.statusData.accountOptions"
        clearable
        :on-clear="refetchAccounts"
        @search="handleSearchAccounts"
      />
      <n-dropdown
        v-if="props.campaign.account_supply_id"
        trigger="click"
        :options="menuOptions"
        @select="handleMenu"
      >
        <n-button color="#f43f5e" type="default"><ListStars /></n-button>
      </n-dropdown>
      <n-button
        v-if="props.campaign.IsTrafficFacebook()"
        @click="store.openModal"
        >Preset
      </n-button>
    </div>
  </div> -->

  <ModalCampaign
    v-if="props.campaign.IsTrafficFacebook()"
    :campaign="campaign"
  />
</template>
