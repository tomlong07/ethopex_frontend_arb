<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
import BulkEntry from '@/components/common/BulkEntry.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const ruleStoreV3 = useRuleStoreV3()

const name = 'User'

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isNotDataFromLink() &&
    !ruleStoreV3.ruleV3.isDataFromListCampaign() &&
    ruleStoreV3.asyncConfigs.setGlobal &&
    ruleStoreV3.ruleV3.rule_global
  )
})

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      ruleStoreV3.getUserOptions()
    } else {
      ruleStoreV3.ruleV3.apply_user = []
    }
  }
)

onMounted(() => {
  if (isShow.value) {
    ruleStoreV3.getUserOptions()
  }
})

const initShowModal = (type: string) => {
  ruleStoreV3.typeModal = type

  switch (type) {
    case 'user':
      const labels = ruleStoreV3.ruleV3.apply_user
        ?.map((userValue) => {
          const option = ruleStoreV3.userOptions.find(
            (opt) => opt.id === userValue
          )
          return option?.email
        })
        .filter(Boolean) // loại bỏ undefined nếu không khớp
      ruleStoreV3.multipleEntries = labels?.join('\n') || ''
      break

    default:
      ruleStoreV3.multipleEntries = ''
      break
  }

  ruleStoreV3.showModal = true
}
</script>

<template>
  <div class="flex items-center gap-2 w-full" v-if="isShow">
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <div class="w-full">
        <FloatingWrapper :name="name">
          <n-select
            v-model:value="ruleStoreV3.ruleV3.apply_user"
            filterable
            multiple
            clearable
            value-field="id"
            label-field="email"
            max-tag-count="responsive"
            :placeholder="''"
            :loading="ruleStoreV3.loadingUser"
            :options="ruleStoreV3.userOptions"
            class="w-full min-w-0"
          />
        </FloatingWrapper>
      </div>

      <BulkEntry
        text="user"
        type="user"
        @click-action="initShowModal"
        class="w-32 shrink-0"
        round
        size="small"
      />
    </div>
  </div>
</template>
