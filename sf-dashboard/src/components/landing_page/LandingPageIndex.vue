<script setup lang="ts">
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { landingTypeClass } from '@/types/components/landing'
import { debounceV2 } from '@/utils'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const isLoading = ref(true)
const landingOptions = ref<SelectOption[]>([])

const name = 'Landing Page'

const isShow = computed(
  () =>
    props.landing.demand_source === 'adsense' &&
    props.landing.prelander === 'on'
)

const fetchLandingPageByDemand = async (q = '') => {
  isLoading.value = true

  // const res = await ctr_landing_page.GetLandingPages({
  //   q,
  //   demand_source: 'adsense',
  //   prelander: 'off',
  // })

  const res = await ctr_filter_v2.FilterLandingPage(
    {
      q: q,
      f: props.landing.prelander_id
        ? String(props.landing.prelander_id)
        : undefined,
    },

    {
      filter: { demand_source: 'adsense', prelander: 'off' },
    }
  )

  landingOptions.value = res?.data || []

  isLoading.value = false
}

const handleLandingSearch = debounceV2(async (q: string = '') => {
  fetchLandingPageByDemand(q)
}, 300)

const renderLandingLabel = (option: SelectOption) => {
  const name =
    typeof option.label === 'string' ? option.label : String(option?.value)

  const label = /^\d/.test(name) ? name : `${option?.value ?? ''}: ${name}`

  return option
    ? h('div', { class: 'flex justify-between w-full' }, [
        h('div', {
          innerHTML: label,
          style:
            'width: 80%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;',
        }),
        h('div', {
          innerHTML: `${((option.cvr as number) ?? 0).toFixed(2)}%`,
        }),
      ])
    : name
}

watch(isShow, (visible) => {
  if (visible) {
    fetchLandingPageByDemand()
  } else {
    props.landing.prelander_id = undefined
  }
})

onMounted(() => {
  if (isShow.value) fetchLandingPageByDemand()
})
</script>

<template>
  <div v-if="isShow" class="flex items-center gap-2">
    <div class="w-150-px font-bold">{{ name }}</div>
    <div class="w-calc-150-px">
      <n-select
        v-model:value="props.landing.prelander_id"
        filterable
        remote
        clearable
        :placeholder="name"
        :loading="isLoading"
        :render-label="renderLandingLabel"
        :options="landingOptions"
        @search="handleLandingSearch"
      />
    </div>
  </div>
</template>
