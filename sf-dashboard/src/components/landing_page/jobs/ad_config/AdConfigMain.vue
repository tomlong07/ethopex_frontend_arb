<script lang="ts" setup>
import {
  adConfigs,
  AnchorAdFormats,
  prelanderConfigs,
} from '@/types/components/landing'
import { UnlockContentConfig } from '@/types/components/dialog'
import Dialog from '@/components/common/Dialog.vue'
import AdPosition from './AdPosition.vue'
import AdMode from './AdMode.vue'
import AdInsertType from './AdInsertType.vue'

const props = defineProps({
  prelander_configs: {
    type: {} as () => prelanderConfigs,
    required: true,
  },
})
const isInit = ref(false)
watch(
  () => props.prelander_configs?.IsShowAdConfig(),
  (isShow) => {
    if (isShow && !props.prelander_configs.ad_config) {
      if (!isInit.value) {
        props.prelander_configs.ad_config = new adConfigs()
        isInit.value = true
      }
    } else {
      props.prelander_configs.ad_config = new adConfigs(
        props.prelander_configs.ad_config
      )
    }
  },
  { immediate: true }
)

watch(
  () => props.prelander_configs?.IsShowAdConfig(),
  (isShow) => {
    if (!isShow || !props.prelander_configs) return

    const oldUnlockContent = props.prelander_configs.unlock_content
    const Anchor = props.prelander_configs.anchor
    const Interstitial = props.prelander_configs.interstitial

    props.prelander_configs.unlock_content = new UnlockContentConfig(
      oldUnlockContent
    )
    props.prelander_configs.anchor = new AnchorAdFormats(Anchor)
    props.prelander_configs.interstitial = new AnchorAdFormats(Interstitial)
  },
  { immediate: true }
)
const unlockConfig = computed(() => props.prelander_configs.unlock_content)
</script>
<template>
  <n-form
    :show-feedback="false"
    :model="props.prelander_configs.ad_config"
    class="flex flex-col space-y-4"
  >
    <AdPosition
      :prelander_configs="props.prelander_configs"
      v-if="!props.prelander_configs.IsLayout100()"
    />

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 !max-w-4xl"
    >
      <AdMode
        :prelander_configs="props.prelander_configs"
        v-if="!props.prelander_configs.IsLayout100()"
      />

      <AdConfigAdType
        :prelander_configs="props.prelander_configs"
        v-if="!props.prelander_configs.IsLayout100()"
      />

      <AdInsertType
        :prelander_configs="props.prelander_configs"
        v-if="!props.prelander_configs.IsLayout100()"
      />
    </div>

    <n-card>
      <div class="min-w-[750px]">
        <div class="flex items-center">
          <!-- &nbsp; -->
          <div class="w-40 font-bold flex-shrink-0">Placement</div>
          <div class="flex flex-row place-items-center gap-4 flex-1 min-w-0">
            <div class="w-16 font-bold flex-shrink-0">Status</div>
            <div class="w-36 font-bold flex-shrink-0"></div>
          </div>
        </div>
      </div>
      <div>
        <AdConfigAnchor :prelander_configs="props.prelander_configs" />
        <AdConfigInterstitial
          :prelander_configs="props.prelander_configs"
          v-if="props.prelander_configs.IsLayout100()"
        />
        <AdConfigUnlockContent :prelander_configs="props.prelander_configs" />
      </div>

      <div v-if="unlockConfig?.status === 'on' && unlockConfig?.type">
        <Dialog
          :landing="props.prelander_configs"
          :typeValue="unlockConfig?.type"
        />
      </div>
    </n-card>
  </n-form>
</template>
