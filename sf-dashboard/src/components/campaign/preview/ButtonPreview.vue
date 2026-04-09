<script setup lang="ts">
import { buildQueryStringEncodeURI } from '@/utils'

const props = defineProps<{
  terms: string
  slug: string
}>()

const _terms = computed(() => props.terms)
const _slug = computed(() => props.slug)

const urlPreviewAd = ref<string>('')

onMounted(async () => {
  rebuildLinkPreviewAd()
})
watch(_slug, () => {
  rebuildLinkPreviewAd()
})
watch(_terms, () => {
  rebuildLinkPreviewAd()
})

const rebuildLinkPreviewAd = () => {
  let urlPreview = 'https://preview.cumaps.net/post/'
  let slugPost = _slug.value
  let params = {
    __preview: 'true',
    adtest: 'on',
    cfgKey: 'demo',
    layout: '9',
    terms: _terms.value,
    styleID: '1229397136',
  }
  let queryString = buildQueryStringEncodeURI(params)
  urlPreviewAd.value = urlPreview.concat('', slugPost, '?', queryString)
}
const previewAd = () => {
  if (urlPreviewAd.value == '') {
    return
  }
  window.open(urlPreviewAd.value, '_blank')
}
</script>
<template>
  <n-space class="absolute top-6 right-6">
    <n-button color="#f43f5e" size="medium" type="default" @click="previewAd">
      Preview
    </n-button>
  </n-space>
</template>
