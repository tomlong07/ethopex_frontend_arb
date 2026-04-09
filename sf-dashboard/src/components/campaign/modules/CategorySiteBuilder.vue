<script setup lang="ts">
import { ONOFF } from '@/enum/campaign'
import useCategorySite from '@/store/useCategorySite'
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

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

const name = 'Category Site Builder'

const isShow = computed<boolean>(() => {
  if (props.campaign.IsDemandBing1()) return false
  if (props.campaign.IsTrafficARBTraffic() && props.campaign.IsDemandArbCore()) return false
  return window.arb.isAdmin()
})
const isLoading = ref<boolean>(false)
const categorySiteStore = useCategorySite()

const getOptions = async () => {
  isLoading.value = true
  await categorySiteStore.getParentCategory()
  isLoading.value = false
}

onMounted(async () => {
  // để các TS cũ vẫn hoạt động
  if (isShow.value && props.campaign.category_site_builder === ONOFF.ON) {
    await getOptions()
  }
})

watch(
  () => props.statusData.IsTabCampaign(),
  async (v) => {
    if (
      isShow.value &&
      props.campaign.category_site_builder === ONOFF.ON &&
      v
    ) {
      await getOptions()
    }
  }
)

watch(
  () => props.campaign.category_site_builder,
  (v) => {
    if (v === ONOFF.ON) {
      props.campaign.keyword_set_id = 0

      if (!props.campaign.IsTrafficPocPoc()) {
        if (props.campaign.landing_pages) {
          props.campaign.landing_pages.id = null
        }
      }

      getOptions()
    } else {
      props.campaign.category_site_builder_id = null
    }
  }
)
</script>

<template>
  <div class="flex items-center gap-2" v-if="isShow">
    <CustomSwitch
      v-model="props.campaign.category_site_builder"
      type="onoff"
      true-label="On"
      false-label="Off"
      size="small"
      :disabled="props.FreezeData.isEditPage()"
    />
    <FloatingWrapper :name="name" rounded>
      <n-select
        v-model:value="props.campaign.category_site_builder_id"
        filterable
        clearable
        :loading="isLoading"
        :placeholder="name"
        :consistent-menu-width="true"
        value-field="id"
        :render-label="categorySiteStore.renderLabelCategorySite"
        :options="categorySiteStore.parentCategories"
        :disabled="
          props.FreezeData.isEditPage() ||
          props.campaign.category_site_builder !== ONOFF.ON
        "
        :filter="categorySiteStore.customFilterCategory"
      />
    </FloatingWrapper>
  </div>
</template>
