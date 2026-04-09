<script setup lang="ts">
import { ONOFF } from '@/enum/campaign'
import useCategorySite from '@/store/useCategorySite'
import { CampaignContext } from '@/types/components/campaign-v2'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const name = 'Category Site Builder'

const isShow = computed<boolean>(() => {
  if (props.data.campaign.IsDemandBing1()) return false
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
  if (isShow.value && props.data.campaign.category_site_builder === ONOFF.ON) {
    await getOptions()
  }
})

watch(
  () => props.data.statusData.IsTabCampaign(),
  async (v) => {
    if (
      isShow.value &&
      props.data.campaign.category_site_builder === ONOFF.ON &&
      v
    ) {
      await getOptions()
    }
  }
)

watch(
  () => props.data.campaign.category_site_builder,
  (v) => {
    if (v === ONOFF.ON) {
      props.data.campaign.keyword_set_id = 0

      if (props.data.campaign.landing_pages) {
        props.data.campaign.landing_pages.id = null
      }
      getOptions()
    } else {
      props.data.campaign.category_site_builder_id = null
    }
  }
)
</script>

<template>
  <div class="flex items-center gap-2" v-if="isShow">
    <CustomSwitch
      v-model="props.data.campaign.category_site_builder"
      type="onoff"
      true-label="On"
      false-label="Off"
      size="small"
      :disabled="props.data.FreezeData.isEditPage()"
    />
    <FloatingWrapper :name="name" rounded>
      <n-select
        v-model:value="props.data.campaign.category_site_builder_id"
        filterable
        clearable
        :loading="isLoading"
        :placeholder="name"
        :consistent-menu-width="false"
        value-field="id"
        :render-label="categorySiteStore.renderLabelCategorySite"
        :options="categorySiteStore.parentCategories"
        :disabled="
          props.data.FreezeData.isEditPage() ||
          props.data.campaign.category_site_builder !== ONOFF.ON
        "
        :filter="categorySiteStore.customFilterCategory"
      />
    </FloatingWrapper>
  </div>
</template>
