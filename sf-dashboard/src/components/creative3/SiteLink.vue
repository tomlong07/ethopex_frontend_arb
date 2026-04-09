<script setup lang="ts">
import {
  CreativeStateManager,
  creativeTypeClass,
} from '@/types/components/creative-v2'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },
})

const isShow = computed(() => {
  return props.cre.IsGoogleSearch() || props.cre.IsPMax()
})

onMounted(() => {
  if (isShow.value) {
    if (!props.cre.site_link) {
      props.cre.SetDefaultSitelink()
    }
  }
})

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (props.stateManager.isDisableType()) {
      return
    }
    if (newValue) {
      props.cre.SetDefaultSitelink()
    } else {
      props.cre.site_link = undefined
    }
  }
)

const name = 'Site Link'
const MAX_CHARACTERS = 25

const countCharacters = (value: string) => {
  return helper.countCharactersV2(value)
}
</script>

<template>
  <n-card v-if="isShow && props.cre.site_link" :title="name">
    <div class="flex flex-col gap-6">
      <div class="flex flex-row" v-for="(link, index) in props.cre.site_link">
        <FloatingWrapper :name="`${name} ${index + 1}`" small rounded>
          <div class="flex flex-row gap-2">
            <n-input
              v-model:value="props.cre.site_link[index]"
              type="text"
              :placeholder="name"
              :status="
                props.cre.ai_verify?.isInvalid(props.cre.site_link[index])
                  ? 'error'
                  : undefined
              "
            >
              <template #suffix
                ><span
                  >{{ countCharacters(props.cre.site_link[index]) }}/{{
                    MAX_CHARACTERS
                  }}</span
                >
              </template>
            </n-input>
          </div>
          <span
            class="text-red-500 text-xs font-medium text-error-noti absolute"
            >{{
              countCharacters(props.cre.site_link[index]) > MAX_CHARACTERS
                ? 'Value too long'
                : ''
            }}</span
          >
        </FloatingWrapper>
      </div>
    </div>
  </n-card>
</template>
