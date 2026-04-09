<script setup lang="ts">
import CardImage from '@/assets/icons/CardImage.vue'
import { CDN_IMAGE } from '@/constants/urls'

const props = defineProps({
  params: {
    type: Object as () => any,
    default: () => {},
    required: false,
  },
  flexCol: {
    type: Boolean,
    default: false,
  },
})
const linkImage = `${CDN_IMAGE}/s3-pw/arb/images/nR_hSCo-8tH.png`

const stylePostion = (backgroundPosition: string) => {
  return {
    backgroundImage: `url(${linkImage})`,
    backgroundPosition: backgroundPosition,
    backgroundSize: '265px 2000px',
    width: '16px',
    height: '16px',
    backgroundRepeat: 'no-repeat',
    display: 'inline-block',
  }
}
</script>
<template>
  <div class="flex items-center gap-2" :class="{ 'flex-col': props.flexCol }">
    <div class="flex justify-center items-center w-24 h-24 border">
      <img
        :src="props.params.data.media"
        v-if="props.params.data.media"
        class="h-full w-full"
      />
      <n-icon v-else :component="CardImage" />
    </div>

    <div class="flex flex-col gap-2 p-4" style="width: calc(100% - 6rem)">
      <div class="overflow-hidden text-ellipsis text-nowrap max-w-[350px]">
        {{ props.params.value || '' }}
      </div>

      <div class="flex gap-8">
        <div class="flex gap-2 items-center whitespace-nowrap">
          <i
            height="12"
            width="12"
            alt=""
            data-visualcompletion="css-img"
            class="img"
            :style="stylePostion('-17px -1968px')"
          ></i>

          {{ props.params.data.likes || '0' }}
        </div>

        <div class="flex gap-2 items-center whitespace-nowrap">
          <i
            height="12"
            width="12"
            alt=""
            data-visualcompletion="css-img"
            class="img"
            :style="stylePostion('-188px -1919px')"
          ></i>
          {{ props.params.data.comments || '0' }}
        </div>
        <div class="flex gap-2 items-center whitespace-nowrap">
          <i
            height="12"
            width="12"
            alt=""
            data-visualcompletion="css-img"
            class="img"
            :style="stylePostion('-102px -1968px')"
          ></i>
          {{ props.params.data.shares || '0' }}
        </div>
      </div>
    </div>
  </div>
</template>
