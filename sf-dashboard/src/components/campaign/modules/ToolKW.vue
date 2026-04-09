<script setup lang="ts">
import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const demo = `https://pr.reverse-mortgagesca.com/?backfill=0&KW1=Reverse+Mortgage+Canada+Pros+And+Cons&KW2=Chip+Reverse+Mortgage+Reviews&KW3=Reverse+Mortgage+Calculator+Canada&KW4=What+Is+A+Reverse+Mortgage&KW5=Reverse+Mortgage+Canada&KW6=Chip+Reverse+Mortgage&domainname=0&searchbox=0&dpco=1&network=taboola&subid1=81dbec80e2cb7cf25a06da7ac397fa268e26ed1abdf2cab973318ca8239918a1&track_id=81dbec80e2cb7cf25a06da7ac397fa268e26ed1abdf2cab973318ca8239918a1&kcoptimize=1&theme=DoriPlus&vertical=Finance&offer=Reverse+Mortgage+PR&kw=Disadvantages+of+A+Reverse+Mortgage+Might+Surprise+You#tblciGiCaAoN9f-hdkUjXGBLWdagXgMspDFUmLu_oMnZ85K-bhiCNyVgo_9-HitPGzaTCAQ`
const linkLanding = ref<string>('')
const listKeyByTool = ref<string[]>([])

const onGetKey = () => {
  // get query from link
  listKeyByTool.value = []
  let s = linkLanding.value
  const query = s.split('?')[1]
  if (query) {
    const params = query.split('&')
    params.forEach((item) => {
      const key = item.split('=')[0]
      const value = item.split('=')[1]
      if (key.startsWith('KW')) {
        listKeyByTool.value.push(`${key}: ${value}`)
      }
    })
  }

  if (listKeyByTool.value.length == 0) {
    window.message.error('Keywords not found!')
  }
}

const copyKeyword = (keyword: string) => {
  helper.copyText(keyword)
  window.message.success('Copied!')
}
</script>

<template>
  <FloatingWrapper rounded placeholder>
    <div class="flex flex-col gap-4">
      <n-input-group>
        <n-input
          v-model:value="linkLanding"
          placeholder="Enter link of landing page on anstrex.com"
        >
          <template #suffix>
            <n-popover trigger="hover">
              <template #trigger>
                <n-icon size="16" class="cursor-help" @click="copyKeyword(demo)"
                  ><InformationCircleOutline
                /></n-icon>
              </template>
              <span>Click to copy demo</span>
            </n-popover>
          </template>
        </n-input>
        <n-button type="info" color="#f43f5e" ghost @click="onGetKey">
          Get
        </n-button>
      </n-input-group>
      <div class="flex flex-col gap-2">
        <div v-for="(k, index) in listKeyByTool" :key="index" class="pb-2">
          <n-tag @click="copyKeyword(k)" class="cursor-copy">
            {{ k }}
          </n-tag>
        </div>
      </div>
    </div>
  </FloatingWrapper>
</template>
