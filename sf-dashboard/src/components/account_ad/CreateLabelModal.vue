<script setup lang="ts">
import { LabelModal } from '@/types/components/account-ad'
import useAccountAd from '@/store/useAccountAd'

import { colorList, Color } from '@/components/account_ad/color'
import PrevDay from '@/assets/icons/PrevDay.vue'
import Close from '@/assets/icons/Close.vue'

import { useLocale } from '@/lang/messages'
const Facebook = useLocale(
  () => import('@/lang/vi/facebook'),
  () => import('@/lang/en/facebook')
)

const accountAdStore = useAccountAd()

const props = defineProps({
  dataModalInfo: {
    type: Object as () => LabelModal,
    required: true,
  },
})

const selectThisColor = (color: string) => {
  props.dataModalInfo.color = color
}

const colorNow = (color?: string): Color => {
  if (!color) return {}
  return colorList[color]
}
const saveLabel = async () => {
  if (!props.dataModalInfo.labels) props.dataModalInfo.labels = []

  if (!props.dataModalInfo.label || !props.dataModalInfo.color) return

  for (let index = 0; index < props.dataModalInfo.labels.length; index++) {
    const element = props.dataModalInfo.labels[index]
    if (element.label === props.dataModalInfo.label) {
      if (props.dataModalInfo.isUpdate) {
        props.dataModalInfo.labels[index] = {
          label: props.dataModalInfo.label,
          color: props.dataModalInfo.color,
        }
        break
      } else {
        window.message.warning(Facebook.value.exists)
        return
      }
    }
  }

  for (
    let index = 0;
    index < props.dataModalInfo.labelOptions.length;
    index++
  ) {
    const element = props.dataModalInfo.labelOptions[index]
    if (element.label === props.dataModalInfo.label) {
      if (props.dataModalInfo.isUpdate) {
        props.dataModalInfo.labelOptions[index] = {
          label: props.dataModalInfo.label,
          value: props.dataModalInfo.label,
          color: props.dataModalInfo.color,
        }
        break
      } else {
        window.message.warning(Facebook.value.exists)
        return
      }
    }
  }

  if (props.dataModalInfo.isUpdate) {
    accountAdStore.showModalCreateLabel = false
    return
  }

  if (!props.dataModalInfo.labels) props.dataModalInfo.labels = []
  props.dataModalInfo.labels.push({
    label: props.dataModalInfo.label,
    color: props.dataModalInfo.color,
  })

  props.dataModalInfo.labelOptions.push({
    label: props.dataModalInfo.label,
    value: props.dataModalInfo.label,
    color: props.dataModalInfo.color,
  })

  accountAdStore.showModalCreateLabel = false

  await helper.sleep(0)
  gotoLastLabel()
}

const gotoLastLabel = () => {
  const lastTag = document.querySelector('.label-tag-element:last-of-type')
  if (lastTag) {
    lastTag.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const textShow = computed(() => {
  return props.dataModalInfo.isUpdate ? 'Update' : 'Create'
})

const offModal = () => {
  accountAdStore.showModalCreateLabel = false
  accountAdStore.showModal = false
}
</script>

<template>
  <n-modal v-model:show="accountAdStore.showModalCreateLabel">
    <n-card
      style="width: 600px; height: 720px"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <n-icon
            :component="PrevDay"
            size="24"
            class="cursor-pointer"
            @click="accountAdStore.showModalCreateLabel = false"
          />
          {{ textShow }} label

          <n-icon
            :component="Close"
            size="20"
            class="cursor-pointer"
            @click="offModal()"
          />
        </div>
      </template>

      <div class="flex flex-col gap-4">
        <div
          class="flex flex-col gap-4 p-8"
          style="background-color: rgb(247, 248, 249)"
        >
          <n-tag
            class="n-tag-exclude"
            :color="{
              color: colorNow(dataModalInfo.color).color,
              textColor: colorNow(dataModalInfo.color).textColor,
            }"
            :bordered="false"
            :title="`Color: ${props.dataModalInfo.color}, title: ${
              props.dataModalInfo.label || 'none'
            }`"
            >{{ props.dataModalInfo.label }}</n-tag
          >
        </div>

        <div>
          Title
          <n-input
            v-model:value="props.dataModalInfo.label"
            placeholder=""
            :disabled="props.dataModalInfo.isUpdate"
          ></n-input>
        </div>

        <n-grid x-gap="12" y-gap="12" :cols="5">
          <n-gi
            v-for="(item, name) in colorList"
            :key="name"
            @click="selectThisColor(name as string)"
          >
            <div
              :style="{
                border:
                  name === props.dataModalInfo.color
                    ? '3px solid rgb(87, 157, 255)'
                    : '3px solid transparent',
              }"
              class="rounded"
            >
              <n-tag
                v-if="name !== 'none'"
                :title="name"
                :color="{ color: item.color }"
                size="large"
                class="cursor-pointer w-full rounded hover:brightness-150 transition duration-200 n-tag-exclude"
              >
              </n-tag>
            </div>
          </n-gi>
        </n-grid>

        <n-button @click="selectThisColor('none')">
          <template #icon>
            <n-icon :component="Close" size="16" />
          </template>
          Remove color
        </n-button>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <n-button class="button-apply" color="#f43f5e" @click="saveLabel()">
            {{ textShow }}
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
