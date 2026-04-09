<script setup lang="ts">
import {
  creativeStruct,
  campaignTypeClass,
  SelectOptionsManager,
  FreezeClass,
} from '@/types/components/campaign-v2'
import { SelectOption, DropdownOption } from 'naive-ui'
import { NIcon } from 'naive-ui'
import {
  RenderLabel,
  fetchCreativeNew,
  renderTag,
} from '@/components/campaign/modules/Creative'

import { renderIcon } from '@/utils/utils'

import { debounceV2 } from '@/utils'
import Plus from '@/assets/icons/Plus.vue'

import useCreativeModal from '@/store/useCreativeModal'
import { ModalStateCreative } from '@/types/components/modal'
import { AD_SETUP } from '@/enum/campaign'
import WindowStack from '@/assets/icons/WindowStack.vue'
import ListStars from '@/assets/icons/ListStars.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

const creativeMenuModal = useCreativeModal()

const props = defineProps({
  adcreative: {
    type: Object as () => creativeStruct,
    required: true,
  },

  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  optionsManager: {
    type: Object as () => SelectOptionsManager,
    required: true,
  },

  offCreate: {
    type: Boolean,
    default: false,
  },

  isUpdateName: {
    type: Boolean,
    default: false,
  },
})
const isLoading = ref(false)

const renderCreativeLabel = (option: SelectOption) => {
  return RenderLabel(option, props.campaign.IsTrafficFacebook())
}

const creativeOptions = ref<SelectOption[]>([])

const creativeOptionsShow = computed<SelectOption[]>(() => {
  if (props.campaign.IsLeads()) {
    return creativeOptions.value.map((e) => ({
      ...e,
      disabled: e.ad_type === 'flexible',
    }))
  }
  return creativeOptions.value
})

const handleCreativeSearch = debounceV2(async (query?: string) => {
  fetchCreative(query)
}, 300)

const labelNow = (key: number) => {
  return creativeOptions.value.find((e) => e.id === key)?.name || key
}

const menuOptions = computed<DropdownOption[]>(() => {
  let options: DropdownOption[] = []

  if (!props.offCreate) {
    options.push({
      label: 'Create New Creative',
      key: '@create',
      icon: renderIcon(Plus),
    })
  }

  if (props.adcreative.creative_id) {
    options.push({
      label: labelNow(props.adcreative.creative_id),
      key: props.adcreative.creative_id,
      icon: renderIcon(WindowStack),
    })
  }

  return options
})

const handleMenu = (key: string) => {
  if (!key) return

  let newData: ModalStateCreative = {
    type: props.campaign.traffic_source,
    traffic_source: props.campaign.traffic_source,
    modalMenu: true,
  }
  switch (key) {
    case '@create':
      newData.id = 0
      break

    default:
      newData.id = Number(key)
      break
  }
  creativeMenuModal.changeDataModal(newData)
  creativeMenuModal.changeDataOriginalV2(props.adcreative, fetchCreative)

  creativeMenuModal.changeShowModal(true)
}

const fetchCreative = async (q?: string) => {
  isLoading.value = true

  const opts = {
    id: props.adcreative.creative_id
      ? props.adcreative.creative_id.toString()
      : '',
    q: q,
  }

  creativeOptions.value = await fetchCreativeNew(
    props.campaign.traffic_source || '',
    opts,
    'facebook'
  )

  isLoading.value = false
}

const renderLabelMenu = (option: DropdownOption) => {
  return h(
    'span',
    {
      style: {
        maxWidth: '250px', // Giới hạn chiều rộng của nhãn
      },

      class: [
        'overflow-hidden',
        'text-ellipsis',
        'inline-block',
        'whitespace-nowrap',
      ],
      title: option.label as string,
    },
    option.label as string
  )
}

watch(
  () => props.optionsManager.loadingCreative,
  async (newVal, oldVal) => {
    if (!newVal) {
      creativeOptions.value = helper.clone(props.optionsManager.creativeOptions)
    }
  }
)

onMounted(async () => {
  creativeOptions.value = helper.clone(props.optionsManager.creativeOptions)
})

const isShow = computed(() => {
  return props.adcreative?.ad_setup === AD_SETUP.CREATE_AD
})

const updateName = (value: number) => {
  props.adcreative.creative_id = value

  if (props.isUpdateName) {
    props.adcreative.name = labelNow(value) as string
  }

  //Đổi creative ở trường hợp duplicate thì xóa bỏ landing_page_id
  //creative 1 đằng mà landing 1 nẻo
  //tránh vi phạm chính sách GG
  if (
    props.FreezeData.isDuplicatePage() ||
    (props.FreezeData.isEditPage() && !props.adcreative.id)
  ) {
    if (props.adcreative.landing_page_id) {
      props.adcreative.landing_page_id = null
    }
  }
}

const name = 'Creative'
const isRequest = computed(() => {
  return props.optionsManager.loadingCreative || isLoading.value || false
})

watch(
  () => props.adcreative,
  (newVal) => {
    if (!newVal?.creative_id) {
      props.adcreative.creative_id = null
    }
  }
)
</script>

<template>
  <FloatingWrapper :name="name" rounded required v-if="isShow">
    <template #extra v-if="props.campaign.IsLeads()">
      <n-popover trigger="hover">
        <template #trigger>
          <n-button text>
            <n-icon :component="QuestionCircleRegular" size="12"></n-icon>
          </n-button>
        </template>
        <span>Objective with Leads cannot use flexible creatives.</span>
      </n-popover></template
    >
    <div class="flex gap-2 items-center">
      <n-select
        v-model:value="props.adcreative.creative_id"
        filterable
        remote
        value-field="id"
        label-field="name"
        :placeholder="name"
        :render-label="renderCreativeLabel"
        :render-tag="(props: any)=>renderTag(props, false)"
        :options="creativeOptionsShow"
        :loading="isRequest"
        :max-tag-count="1"
        @search="handleCreativeSearch"
        :on-update:value="updateName"
      />

      <n-dropdown
        class="custom-dropdown-adg-creative"
        trigger="hover"
        :options="menuOptions"
        :on-select="handleMenu"
        :render-label="renderLabelMenu"
      >
        <n-button color="#f43f5e" type="default" title="Creative Menu"
          ><n-icon size="20"><ListStars /></n-icon
        ></n-button>
      </n-dropdown>
    </div>
  </FloatingWrapper>
</template>
