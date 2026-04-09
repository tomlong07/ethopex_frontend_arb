<script setup lang="ts">
import Minus from '@/assets/icons/Minus.vue'
import Plus from '@/assets/icons/Plus.vue'
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import CollapseSection from '../common/CollapseSection.vue'

const ruleStoreV3 = useRuleStoreV3()

const addLink = () => {
  ruleStoreV3.ruleV3.add_campaign.list_link?.push('')
}

const removeLink = (index: number) => {
  ruleStoreV3.ruleV3.add_campaign.list_link?.splice(index, 1)
}

watch(
  () => ruleStoreV3.ruleV3.isDataFromLink(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.list_link = ['']
    } else {
      ruleStoreV3.ruleV3.add_campaign.list_link = undefined
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (ruleStoreV3.ruleV3.isDataFromLink()) {
    if (
      !ruleStoreV3.ruleV3.add_campaign.list_link ||
      !ruleStoreV3.ruleV3.add_campaign.list_link?.length
    ) {
      ruleStoreV3.ruleV3.add_campaign.list_link = ['']
    }
  }
})
</script>

<template>
  <CollapseSection
    name="list_link"
    header="List Link"
    v-if="
      ruleStoreV3.ruleV3.isDataFromLink() &&
      ruleStoreV3.ruleV3.add_campaign.list_link
    "
  >
    <div
      v-for="(item, index) in ruleStoreV3.ruleV3.add_campaign.list_link"
      :key="index"
      class="py-2"
    >
      czxcxczxczxc
      <div class="flex flex-row gap-2">
        <FloatingWrapper :name="'List Link'">
          <n-input
            v-model:value="ruleStoreV3.ruleV3.add_campaign.list_link[index]"
            placeholder=""
          />
        </FloatingWrapper>

        <n-button
          class="mt-1"
          round
          size="small"
          @click="removeLink(index)"
          :disabled="ruleStoreV3.ruleV3.add_campaign.list_link.length <= 1"
          ><n-icon size="12"><Minus /></n-icon
        ></n-button>

        <n-button @click="addLink" class="mt-1" round size="small"
          ><n-icon size="12" class="cursor-pointer"><Plus /></n-icon
        ></n-button>
      </div>
    </div>
  </CollapseSection>
</template>
