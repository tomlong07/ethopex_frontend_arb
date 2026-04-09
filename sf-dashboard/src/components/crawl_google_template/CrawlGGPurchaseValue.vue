<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { PurchaseValueTypeOptions } from '@/options/campaign'
import { PURCHASE_VALUE_TYPE } from '@/enum/campaign'
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
const crawlGoogleTemplateStore = useCrawlGoogleTemplate()

const name = 'Purchase Value'

const nameValue = computed(() => {
  switch (true) {
    case crawlGoogleTemplateStore.crawlGGTemplate.purchase_value?.IsRPC():
      return 'RPC to day min x conversions'
    case crawlGoogleTemplateStore.crawlGGTemplate.purchase_value?.IsFixed():
      return 'RPC '

    default:
      return ''
  }
})

const updatePurchaseValue = (value: PURCHASE_VALUE_TYPE) => {
  crawlGoogleTemplateStore.crawlGGTemplate.purchase_value!.purchase_value_type =
    value

  switch (true) {
    case crawlGoogleTemplateStore.crawlGGTemplate.purchase_value!.IsRPC():
      crawlGoogleTemplateStore.crawlGGTemplate.purchase_value!.value = undefined
      crawlGoogleTemplateStore.crawlGGTemplate.purchase_value!.conversions = 10

      break

    case crawlGoogleTemplateStore.crawlGGTemplate.purchase_value!.IsFixed():
      crawlGoogleTemplateStore.crawlGGTemplate.purchase_value!.conversions =
        undefined
      crawlGoogleTemplateStore.crawlGGTemplate.purchase_value!.value = 0.01

      break

    default:
      crawlGoogleTemplateStore.crawlGGTemplate.purchase_value!.value = undefined
      crawlGoogleTemplateStore.crawlGGTemplate.purchase_value!.conversions =
        undefined

      break
  }
}
</script>

<template>
  <div
    class="flex gap-2"
    v-if="crawlGoogleTemplateStore.crawlGGTemplate.purchase_value"
  >
    <FloatingWrapper :name="name" rounded>
      <n-select
        v-model:value="
          crawlGoogleTemplateStore.crawlGGTemplate.purchase_value
            .purchase_value_type
        "
        clearable
        tag
        :placeholder="name"
        :options="PurchaseValueTypeOptions"
        :on-update:value="updatePurchaseValue"
      />
    </FloatingWrapper>

    <FloatingWrapper
      rounded
      v-if="crawlGoogleTemplateStore.crawlGGTemplate.purchase_value"
      :name="nameValue"
    >
      <n-input-number
        v-if="crawlGoogleTemplateStore.crawlGGTemplate.purchase_value?.IsRPC()"
        v-model:value="
          crawlGoogleTemplateStore.crawlGGTemplate.purchase_value.conversions
        "
      >
      </n-input-number>

      <n-input-number
        v-if="
          crawlGoogleTemplateStore.crawlGGTemplate.purchase_value?.IsFixed()
        "
        v-model:value="
          crawlGoogleTemplateStore.crawlGGTemplate.purchase_value.value
        "
      >
        <template #prefix>$</template>
      </n-input-number>
    </FloatingWrapper>
  </div>
</template>
