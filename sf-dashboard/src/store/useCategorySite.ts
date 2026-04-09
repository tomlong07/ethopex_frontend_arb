import { ctr_filter_v2 } from '@/services/ctr_filter_v2'

import ctr_category_site from '@/services/ctr_category_site'
import {
  categorySiteCls,
  categorySiteType,
} from '@/types/components/category_site'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'
import { ctr_tool } from '@/services/ctr_tool'

export default defineStore('useCategorySiteStore', () => {
  const categorySite = ref<categorySiteCls>(new categorySiteCls())
  const parentCategories = ref<SelectOption[]>([])
  const listLandingOrder = ref<SelectOption[]>([])
  const landingOptions = ref<SelectOption[]>([])
  const isLoading = ref(false)
  const isLoadingPage = ref(false)

  const id_route = computed(() => {
    return Number(window.route.params.id || 0)
  })

  const isAddPage = computed<boolean>(() => id_route.value === 0)
  const isEditPage = computed<boolean>(() => {
    return !isAddPage.value
  })

  const sortedCategoryOptions = (categories: any[]) => {
    if (!categories) return []
    return [...categories].sort((a, b) => {
      const ancestorA = (a as { ancestor?: string }).ancestor || ''
      const ancestorB = (b as { ancestor?: string }).ancestor || ''
      const nameA = (a as { name?: string }).name || ''
      const nameB = (b as { name?: string }).name || ''

      const ancestorCompare = ancestorA.localeCompare(ancestorB)
      if (ancestorCompare !== 0) return ancestorCompare

      return nameA.localeCompare(nameB)
    })
  }

  const renderLabelCategorySite = (option: SelectOption) => {
    const displayName =
      typeof option.name === 'string' && option.name.trim()
        ? option.name.trim()
        : ''

    const renderType = () =>
      option.type && typeof option.type === 'string'
        ? h(
            'div',
            { class: 'ml-auto text-xs text-gray-500 whitespace-nowrap' },
            helper.capitalizeFirstLetter(option.type)
          )
        : null

    const ancestor =
      typeof option.ancestor === 'string' ? option.ancestor.trim() : ''
    if (!ancestor) {
      return h(
        'div',
        { class: 'flex justify-between gap-1 items-center w-full py-0.5' },
        [
          h('strong', { class: 'text-sm' }, displayName || 'Unnamed category'),
          renderType(),
        ]
      )
    }

    const parts = ancestor
      .replace(/^\[|\]$/g, '')
      .split('>')
      .map((p) => p.trim())
      .filter(Boolean)

    if (displayName && parts[parts.length - 1] !== displayName) {
      parts.push(displayName)
    }

    const pathNodes = parts.map((part, i) =>
      h(
        i < parts.length - 1 ? 'span' : 'strong',
        {
          class: i < parts.length - 1 ? 'text-gray-400' : undefined,
        },
        part
      )
    )

    // thêm ký tự phân cách ` > `
    const content = pathNodes.flatMap((node, i) =>
      i > 0 ? [h('span', { class: 'text-gray-400' }, ' > '), node] : [node]
    )

    return h(
      'div',
      { class: 'flex justify-between gap-1 items-center w-full py-0.5' },
      [h('div', { class: 'text-sm' }, content), renderType()]
    )
  }

  const customFilterCategory = (pattern: string, option: any) => {
    const name = option.name?.toLowerCase() || ''
    const ancestor = option.ancestor?.toLowerCase() || ''
    const lowerPattern = pattern.toLowerCase()

    return name.includes(lowerPattern) || ancestor.includes(lowerPattern)
  }

  const getParentCategory = async () => {
    const result = await ctr_category_site.GetParentCategory(id_route.value)

    if (result.status) {
      parentCategories.value = sortedCategoryOptions(result.data)
    }
    return
  }

  const getCategoryById = async () => {
    const result = await ctr_category_site.GetById(id_route.value)

    if (result.status) {
      categorySite.value = new categorySiteCls(result.data)
    }
  }

  const create = async (payload: categorySiteType) => {
    isLoading.value = true
    const result = await ctr_category_site.Create(payload)
    isLoading.value = false
    return result
  }

  const update = async (payload: categorySiteType) => {
    isLoading.value = true
    const result = await ctr_category_site.Update(payload)
    isLoading.value = false
    return result
  }

  const generateImage = async (payload: any) => {
    const result = await ctr_tool.GenerateImgLandingByPrompt(payload)
    return result
  }

  const fetchLandingPageByDemand = async (q = '') => {
    const result = await ctr_filter_v2.FilterLandingPage(
      {
        q: q,
        f: categorySite.value.posts
          ? categorySite.value.posts.join(',')
          : undefined,
      },

      {
        filter: { demand_source: 'adsense' },
      }
    )

    landingOptions.value = result?.data || []
  }

  return {
    categorySite,
    isLoadingPage,
    id_route,
    isAddPage,
    isEditPage,
    getParentCategory,
    getCategoryById,
    parentCategories,
    create,
    isLoading,
    listLandingOrder,
    update,
    generateImage,
    fetchLandingPageByDemand,
    landingOptions,
    renderLabelCategorySite,
    customFilterCategory,
  }
})
