<script lang="ts" setup>
import { MediaVerifyClass } from '@/types/components/creative-class'
import {
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import ActionButton from '@/components/ai_verify/ActionButton.vue'
import TrashOutline from '@/assets/icons/TrashOutline.vue'
import { URL_UPLOAD } from '@/constants/urls'
const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})

const handleActionImage = (item: MediaVerifyClass) => {
  const itemNow = item.url || item.video
  if (!itemNow) return
  try {
    const urlImage = helper.removeDomainAndParams(itemNow)
    const found = props.cre.images?.some(
      (image) => helper.removeDomainAndParams(image.image) === urlImage
    )

    if (found) {
      item.is_action = true
      props.cre.images = props.cre.images?.filter(
        (image) => helper.removeDomainAndParams(image.image) !== urlImage
      )

      if (props.cre.images?.length) {
        props.status.previewItem = props.cre.images?.[0]
      } else {
        props.status.previewItem = undefined
      }

      // window.message.success(`Media deleted`)
    } else {
      window.message.warning(`Media not found`)
    }
  } catch (e) {
    console.error(e)
  }
}

const src = (path: string | undefined) => {
  if (path?.includes('http') || path?.includes('https')) {
    return path
  }
  return `${URL_UPLOAD}${path ? path : ''}`
}
</script>

<template>
  <div v-if="props.cre.ai_verify?.media_data_show?.length">
    <n-table :single-line="false" striped class="table-fixed">
      <thead>
        <tr>
          <th class="w-48">Media</th>
          <th class="w-24">Compliant</th>

          <th class="w-[calc(100%-22rem)]">Explanation</th>
          <th class="w-16">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in props.cre.ai_verify?.media_data_show"
          :key="index"
        >
          <td class="w-32">
            <video
              v-if="item.video"
              :key="src(item.url)"
              class="flex items-center w-auto h-full rounded-md"
              controls
            >
              <source type="video/mp4" :src="src(item.video)" />
            </video>
            <n-image
              v-else-if="item.url"
              width="150"
              class="flex items-center justify-center shadow-md media-cr"
              :src="src(item.url)"
              object-fit="contain"
            />
            <span v-else>No URL</span>
          </td>

          <td class="w-24">
            {{ item?.compliance_status }}
          </td>

          <td class="w-[calc(100%-22rem)]">
            {{ item?.explanation }}
          </td>
          <td class="w-16">
            <ActionButton
              @handleAction="handleActionImage(item)"
              v-show="item.is_show_delete_image"
              class="text-red-500"
              size="20"
              ><TrashOutline
            /></ActionButton>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
