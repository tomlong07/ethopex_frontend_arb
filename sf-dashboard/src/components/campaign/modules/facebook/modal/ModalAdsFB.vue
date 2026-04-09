<script setup lang="ts">
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import useFbManualAdsStore from '@/store/useFbManualAdsStore'
import {
  FBDataResponse,
  FanpageStatus,
  PostStatus,
} from '@/types/components/FBDataResponse'
import FacebookPost from '@/components/campaign/cell/facebook/FacebookPost.vue'
import { ctr_campaign } from '@/services/ctr_campaign'
import Close2 from '@/assets/icons/Close2.vue'
import { TType } from '@/enum/naiveui'
const fbManualAdsStore = useFbManualAdsStore()

const offModal = () => {
  fbManualAdsStore.changeShowModal(false)
}

const dataFB = ref<FBDataResponse>()

const fanpageIds = computed(() => {
  return [
    ...new Set(
      dataFB.value?.info_camp_facebook?.adsets?.data?.flatMap(
        (item) =>
          item.ads?.data
            ?.map((miniItem) =>
              fanpageId(miniItem.creative?.effective_object_story_id)
            )
            .filter(Boolean) || [] // Loại bỏ giá trị null hoặc undefined
      )
    ),
  ]
})

const effective_object_story_ids = computed(() => {
  return [
    ...new Set(
      dataFB.value?.info_camp_facebook?.adsets?.data?.flatMap(
        (item) =>
          item.ads?.data
            ?.map((miniItem) => miniItem.creative?.effective_object_story_id)
            .filter(Boolean) || [] // Loại bỏ giá trị null hoặc undefined
      )
    ),
  ]
})
const isLoading = ref(true)

const mapFanpage = ref<{ [key: string]: FanpageStatus }>({})
const mapPost = ref<{ [key: string]: PostStatus }>({})

const fetchFanpage = async (id?: string) => {
  if (!id) return
  const result = await ctr_traffic_source.GetFacebookFanpage(id)
  mapFanpage.value[id] = { ...result?.data, ready: true }
}

const fetchPost = async (effective_object_story_id?: string) => {
  if (!effective_object_story_id) return
  const post = postId(effective_object_story_id)
  const result = await ctr_traffic_source.GetFacebookPost({
    page_id: fanpageId(effective_object_story_id),
    search: post,
  })
  try {
    mapPost.value[post] = { ...result?.data[0], ready: true }
  } catch {}
}

watch(
  () => fbManualAdsStore.showModal,
  async (newValue, oldValue) => {
    if (newValue) {
      isLoading.value = true
      const result = await ctr_campaign.GetInFoCampaign(
        fbManualAdsStore.dataModal
      )

      dataFB.value = new FBDataResponse(result?.data || {})
      isLoading.value = false

      fetchFanpages()
      fetchPosts()
    }
  }
)

const fetchFanpages = () => {
  mapFanpage.value = {}
  fanpageIds.value.forEach(async (element) => {
    mapFanpage.value[element] = {
      ready: false,
    }
  })

  fanpageIds.value.forEach(async (element) => {
    await fetchFanpage(element)
  })
}

const fetchPosts = () => {
  mapPost.value = {}
  effective_object_story_ids.value.forEach(async (element) => {
    if (mapPost.value[postId(element)]) return

    mapPost.value[postId(element)] = { ready: false }
  })

  let postGet: string[] = []

  effective_object_story_ids.value.forEach(async (element) => {
    const post_id = postId(element)
    if (postGet.includes(post_id)) return
    await fetchPost(element)
  })
}

const fanpageId = (effective_object_story_id?: string) => {
  if (!effective_object_story_id) return ''
  return effective_object_story_id?.split('_')[0]
}

const postId = (effective_object_story_id?: string) => {
  if (!effective_object_story_id) return ''
  return effective_object_story_id?.split('_')[1]
}

const fanpageNow = (effective_object_story_id?: string) => {
  if (!effective_object_story_id) return

  return mapFanpage.value[fanpageId(effective_object_story_id)]
}

const postNow = (effective_object_story_id?: string) => {
  if (!effective_object_story_id) return

  return mapPost.value[postId(effective_object_story_id)]
}

const classNow = (status?: string) => {
  if (!status) return undefined
  return (helper.classRender(status.toLowerCase() || '') as TType) || undefined
}

const copyPostId = (id: string) => {
  helper.copyText(id)
  window.message.success('Copied!')
}

const params = (miniItem: any) => {
  return { data: postNow(miniItem.creative?.effective_object_story_id) } as any
}
</script>

<template>
  <div v-if="fbManualAdsStore.showModal">
    <n-card title="Info Ads" :bordered="false">
      <template #header-extra>
        <n-icon
          @click="offModal"
          size="24"
          :component="Close2"
          class="button-close cursor-pointer"
      /></template>
      <n-spin :show="isLoading">
        <div
          style="min-height: 200px; max-height: 600px"
          class="overflow-y-auto flex gap-4 flex-col"
        >
          <div
            v-if="
              !dataFB?.info_camp_facebook?.adsets?.data?.length && !isLoading
            "
          >
            No Data
          </div>
          <div
            v-for="(item, index) in dataFB?.info_camp_facebook?.adsets?.data"
            :key="index"
            class="flex gap-2 flex-col"
          >
            <div v-for="(miniItem, miniIndex) in item.ads?.data">
              <div class="border p-4 relative shadow-md flex flex-col gap-2">
                <n-table
                  single-column
                  :single-line="false"
                  class="min-w-[800px]"
                >
                  <thead>
                    <tr>
                      <th class="w-3/12">Fanpage</th>
                      <th class="w-1/12">Post ID</th>
                      <th class="w-2/12">Name</th>
                      <th class="w-1/12">Status</th>
                      <th class="w-5/12">Post</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="w-3/12">
                        <span
                          v-if="!miniItem.creative?.effective_object_story_id"
                          >N/A</span
                        >

                        <span
                          v-else-if="
                            !fanpageId(
                              miniItem.creative?.effective_object_story_id
                            ) ||
                            !fanpageNow(
                              miniItem.creative?.effective_object_story_id
                            )
                          "
                          >Not Found</span
                        >
                        <n-spin
                          v-else
                          :show="
                            !fanpageNow(
                              miniItem.creative?.effective_object_story_id
                            )?.ready
                          "
                        >
                          <div class="flex flex-row gap-2 items-center">
                            <div style="width: 80px; height: 80px">
                              <n-image
                                width="80"
                                height="80"
                                v-if="
                                  fanpageNow(
                                    miniItem.creative?.effective_object_story_id
                                  )?.ready
                                "
                                :src="
                                  fanpageNow(
                                    miniItem.creative?.effective_object_story_id
                                  )?.picture
                                "
                                class="rounded-full"
                              />
                            </div>

                            <div class="flex flex-col">
                              <a
                                :href="
                                  fanpageNow(
                                    miniItem.creative?.effective_object_story_id
                                  )?.link
                                "
                                target="_blank"
                                class="text-blue-500"
                              >
                                {{
                                  fanpageNow(
                                    miniItem.creative?.effective_object_story_id
                                  )?.name
                                }}
                              </a>

                              {{
                                fanpageNow(
                                  miniItem.creative?.effective_object_story_id
                                )?.page_id
                              }}
                            </div>
                          </div>
                        </n-spin>
                      </td>
                      <td
                        class="w-1/12 cursor-copy"
                        @click="
                          copyPostId(
                            postId(miniItem.creative?.effective_object_story_id)
                          )
                        "
                      >
                        {{
                          postId(miniItem.creative?.effective_object_story_id)
                        }}
                      </td>
                      <td class="w-2/12">{{ miniItem.name }}</td>
                      <td class="w-1/12">
                        <n-tag
                          size="small"
                          round
                          :type="classNow(miniItem.status)"
                        >
                          {{ miniItem.status || '' }}
                        </n-tag>
                      </td>
                      <td class="w-5/12">
                        <span
                          v-if="!miniItem.creative?.effective_object_story_id"
                          >N/A</span
                        >

                        <span
                          v-else-if="
                            !postId(
                              miniItem.creative?.effective_object_story_id
                            ) ||
                            !postNow(
                              miniItem.creative?.effective_object_story_id
                            )
                          "
                          >Not Found</span
                        >
                        <n-spin
                          v-else
                          :show="
                            !postNow(
                              miniItem.creative?.effective_object_story_id
                            )?.ready
                          "
                        >
                          <div class="flex flex-col gap-2">
                            <a
                              :href="
                                postNow(
                                  miniItem.creative?.effective_object_story_id
                                )?.link
                              "
                              target="_blank"
                              class="text-blue-500"
                            >
                              {{
                                postNow(
                                  miniItem.creative?.effective_object_story_id
                                )?.name
                              }}
                            </a>

                            <FacebookPost
                              :params="params(miniItem)"
                              :flexCol="true"
                            />
                          </div>
                        </n-spin>
                      </td>
                    </tr>
                  </tbody>
                </n-table>
              </div>
            </div>
          </div>
        </div>
      </n-spin>
    </n-card>
  </div>
</template>
