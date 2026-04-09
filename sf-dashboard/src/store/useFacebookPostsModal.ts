import { defineStore } from 'pinia'
import baseModalStore from './baseModalStore'
import { SelectOption } from 'naive-ui'
import { creativeStruct } from '@/types/components/campaign-v2'

export interface PostInfo {
  AdCreative?: creativeStruct
  post_id?: string
}

export default defineStore('useFacebookPostsModal', () => {
  const baseStore = baseModalStore()

  const dataModal = ref<PostInfo>()
  const fanpage = ref<string>('')

  const storePost = ref<{ [key: string]: SelectOption }>({})

  const getInfoPostByPostID = (post_id: string) => {
    return storePost.value[post_id] || {}
  }

  return {
    ...baseStore,
    dataModal,
    fanpage,
    storePost,

    changeDataModal(info: PostInfo) {
      dataModal.value = info
    },

    savePost(post: SelectOption) {
      storePost.value[post.post_id as string] = helper.clone(post)
    },

    getInfoPostByPostID,
  }
})
