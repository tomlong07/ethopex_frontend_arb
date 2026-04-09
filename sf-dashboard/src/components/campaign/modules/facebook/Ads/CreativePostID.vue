<script setup lang="ts">
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import {
  creativeStruct,
  SelectOptionsManager,
} from '@/types/components/campaign-v2'

import useFacebookPostsModal, { PostInfo } from '@/store/useFacebookPostsModal'
import { AD_SETUP } from '@/enum/campaign'
import CardImage from '@/assets/icons/CardImage.vue'
import RefreshIcon from '@/assets/icons/RefreshIcon.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const fbPostModal = useFacebookPostsModal()

const props = defineProps({
  adcreative: {
    type: Object as () => creativeStruct,
    required: true,
  },

  optionsManager: {
    type: Object as () => SelectOptionsManager,
    required: true,
  },
})

const postInfoNow = ref<PostInfo>({})

const assignPostInfo = () => {
  postInfoNow.value.post_id = props.adcreative.post_id || ''
  postInfoNow.value.AdCreative = props.adcreative
}

const isGetting = ref(false)

const handleChoosePost = async () => {
  if (!props.adcreative.fanpage) return

  assignPostInfo()

  fbPostModal.showModal = true
  fbPostModal.fanpage = props.adcreative.fanpage
  fbPostModal.changeDataModal(postInfoNow.value)
}

const syncInfoPost = async () => {
  isGetting.value = true
  const result = await ctr_traffic_source.GetFacebookPost({
    page_id: props.adcreative.fanpage,
    search: props.adcreative.post_id || '',
  })

  if (result?.data) {
    postInfoNow.value.post_id = result.data[0].post_id || ''
    fbPostModal.savePost(result.data[0])
  }

  isGetting.value = false
}

const isShow = computed(() => {
  return props.adcreative?.ad_setup === AD_SETUP.USE_EXISTING_POST
})

watch(
  () => props.adcreative?.fanpage,
  (newValue, oldValue) => {
    if (newValue) {
      postInfoNow.value.post_id = undefined
    }
  }
)

const postInfoShow = () => {
  return fbPostModal.getInfoPostByPostID(postInfoNow.value.post_id || '')
}

onMounted(() => {
  assignPostInfo()
})

watch(
  () => props.adcreative,
  (newVal) => {
    assignPostInfo()
    if (!newVal?.post_id) {
      props.adcreative.post_id = null
    }
  }
)
const name = 'Post'
</script>

<template>
  <div class="flex flex-col gap-2" v-if="isShow">
    <FloatingWrapper :name="name">
      <div class="flex flex-col gap-2 p-3 border rounded-md">
        <div v-if="props.adcreative.post_id" class="flex items-center gap-2">
          <div class="flex justify-center items-center w-20 h-16 border">
            <img
              :src="postInfoShow()?.media as string"
              v-if="postInfoShow()?.media"
              class="w-full h-full"
            />
            <n-icon v-else :component="CardImage" />
          </div>

          <div style="width: calc(100% - 4rem)" class="flex items-center gap-2">
            <div class="flex flex-col gap-2">
              <div>
                {{ postInfoShow()?.name || 'N/A' }}
              </div>
              <div class="text-xs text-gray-500">
                Post ID:
                {{ postInfoNow.post_id || '' }}
              </div>
              <div class="text-xs text-gray-500">
                Date created:
                {{ postInfoShow()?.created_at || 'N/A' }}
              </div>
            </div>

            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-button
                  quaternary
                  :disabled="isGetting"
                  @click="syncInfoPost"
                >
                  <template #icon>
                    <n-icon :component="RefreshIcon" size="24" /> </template
                ></n-button>
              </template>
              Refresh Info
            </n-popover>
          </div>
        </div>

        <div class="flex gap-2">
          <n-button
            @click="handleChoosePost"
            :disabled="!props.adcreative.fanpage"
            >Change post</n-button
          >
        </div>
      </div>
    </FloatingWrapper>
  </div>
</template>
