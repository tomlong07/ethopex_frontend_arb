<script setup lang="ts">
import {
  creativeTypeClass,
  // images as imgType,
  StatusCreativeManager,
} from '@/types/components/creative-v2'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },

  label: {
    type: String,
    default: '',
  },
})

const dataLinks = ref<string>('')

const addLinkYoutube = async () => {
  const list = helper.stringToArray(dataLinks.value)

  if (list.length > 5) {
    window.message.warning('You can add up to 5 YouTube videos only')
    return
  }

  const youtubeList = helper.removeDuplicateYouTubeLinks(list)

  for (let index = 0; index < youtubeList.length; index++) {
    const element = youtubeList[index]
    const videoId = helper.youtubeVideoID(element)
    if (!videoId) {
      window.message.warning(`Invalid YouTube video URL: ${element}`)
      continue
    }
    const isDuplicate = props.cre.images.some((img) => img.image === element)
    if (!isDuplicate) {
      props.cre.images.push({
        image: element,
        status: 'approved',
      })
    }
  }

  props.status.previewItem = helper.clone(
    props.cre.images[props.cre.images.length - 1]
  )
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-if="props.label" class="font-bold">{{ props.label }}</div>
    <div class="flex items-center gap-2">
      <n-input
        maxlength="1000"
        type="textarea"
        :autosize="{
          minRows: 5,
          maxRows: 5,
        }"
        placeholder="Enter multiple youtube links separated by commas or lines."
        v-model:value="dataLinks"
      />
      <n-button type="info" @click="addLinkYoutube">Add</n-button>
    </div>
  </div>
</template>
