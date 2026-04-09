<script lang="ts" setup>
import { displayType, ENROLL_STATUS } from '@/enum/creative'
import TagTooltip from './TagTooltip.vue'
import { CreativeFeatureCard } from '../modal/CreativeFeatureCards'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { creativeStruct, FreezeClass } from '@/types/components/campaign-v2'

const vModel = defineModel<ENROLL_STATUS>()
const emit = defineEmits(['change'])
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  card: {
    type: Object as PropType<CreativeFeatureCard>,
    required: true,
  },
  adcreative: {
    type: Object as () => creativeStruct,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})
</script>

<template>
  <div class="rounded-lg shadow p-5 bg-white max-w-[260px]">
    <div class="space-y-2 mb-2">
      <div class="flex items-center gap-2">
        <CustomSwitch
          v-model="vModel"
          type="enroll"
          true-label="On"
          false-label="Off"
          size="small"
          :disabled="
            props.FreezeData.isEditPage() &&
            props.adcreative.id != null &&
            props.adcreative.id > 0
          "
          @change="emit('change')"
        />
        <span class="font-semibold text-sm truncate">
          {{ props.title }}
        </span>

        <n-tooltip v-if="props.card.tooltip" trigger="hover">
          <template #trigger>
            <n-icon size="16" class="text-gray-500 cursor-pointer">
              <i class="i-heroicons-information-circle"></i>
            </n-icon>
          </template>
          {{ props.card.tooltip }}
        </n-tooltip>
      </div>
      <div>
        <TagTooltip :type="props.card.type_status" />
      </div>
    </div>

    <div class="h-[400px]">
      <div
        class="flex items-center justify-center bg-gray-100 rounded-lg h-[350px]"
      >
        <img
          v-if="props.card.display_type === displayType.STATIC"
          :src="props.card.url"
          alt=""
          class="max-h-[280px] object-contain rounded"
        />

        <div
          v-else-if="props.card.display_type === displayType.SPRITE"
          class="sprite"
          :style="{
            backgroundImage: `url(${props.card.url})`,
            backgroundPosition: props.card.bg.position,
            backgroundSize: props.card.bg.size,
            width: '170px',
            height: '300px',
            backgroundRepeat: 'no-repeat',
          }"
        ></div>
        <div v-else class="relative">
          <video
            :src="props.card.url"
            autoplay
            loop
            muted
            :style="{
              width: '170px',
              height: '280px',
            }"
          ></video>
        </div>
      </div>
      <div class="text-center text-xs mt-2">{{ props.card.message }}</div>
    </div>
  </div>
</template>

<style scoped></style>
