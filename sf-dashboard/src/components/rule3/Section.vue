<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import BulkEntry from '@/components/common/BulkEntry.vue'
import { INEX } from '@/enum/campaign'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import CustomSwitch from '../common/CustomSwitch.vue'

const ruleStoreV3 = useRuleStoreV3()

const isShow = computed(() => {
  if (!ruleStoreV3.ruleV3?.rule_type || !ruleStoreV3.ruleTypeOption?.length) {
    return false
  }

  const ruleType = ruleStoreV3.ruleTypeOption.find(
    (item) => item.value === ruleStoreV3.ruleV3?.rule_type
  )

  if (!ruleType?.section) {
    return false
  }

  return (
    ruleStoreV3.ruleV3.isNotDataFromLink() &&
    !ruleStoreV3.ruleV3.isDataFromListCampaign()
  )
})

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      if (!ruleStoreV3.ruleV3.apply_section_type) {
        ruleStoreV3.ruleV3.apply_section_type = INEX.INCLUDE
      }
    } else {
      ruleStoreV3.ruleV3.apply_sections = []
      ruleStoreV3.ruleV3.apply_section_type = null
    }
  }
)

const name = `Section`

const initShowModal = () => {
  ruleStoreV3.typeModal = 'section'

  ruleStoreV3.multipleEntries =
    ruleStoreV3.ruleV3.apply_sections?.join('\n') || ''

  ruleStoreV3.showModal = true
}
</script>

<template>
  <div v-if="isShow" class="flex items-center gap-2">
    <div class="flex flex-1 min-w-0 items-center gap-2">
      <div class="flex-1 min-w-0">
        <FloatingWrapper :name="name">
          <n-select
            v-model:value="ruleStoreV3.ruleV3.apply_sections"
            placeholder="Input, press enter to sections"
            tag
            multiple
            filterable
            clearable
            :show="false"
            max-tag-count="responsive"
            :show-arrow="false"
          />
        </FloatingWrapper>
      </div>

      <div class="">
        <CustomSwitch
          v-model="ruleStoreV3.ruleV3.apply_section_type"
          type="onoff"
          true-label="Include"
          false-label="Exclude"
          size="small"
        />
      </div>

      <BulkEntry
        text="section"
        @click-action="initShowModal"
        class="w-32 shrink-0"
        round
        size="small"
      />
    </div>
  </div>
</template>
