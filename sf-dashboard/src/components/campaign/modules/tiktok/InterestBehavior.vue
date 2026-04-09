<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import ctr_category_site from '@/services/ctr_category_site'
import { adGroups, campaignTypeClass } from '@/types/components/campaign-v2'
import { TreeSelectOption } from 'naive-ui'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const categoryOptions = ref<TreeSelectOption[]>([])

const categoryOptionsComp = computed<TreeSelectOption[]>(() => {
  if (categoryOptions.value.length === 0) return []

  return buildCategoryTree(categoryOptions.value)
})

const buildCategoryTree = (categories: any[]) => {
  // Tìm tất cả root categories (parent_id = 0)
  const rootCategories = categories.filter((cat) => cat.parent_id === 0)

  return rootCategories.map((root) => buildTreeNode(root, categories))
}

const buildTreeNode = (
  category: any,
  allCategories: any[]
): TreeSelectOption => {
  const children = allCategories.filter((cat) => cat.parent_id === category.id)

  const node: TreeSelectOption = {
    key: String(category.id),
    label: category.label,
    value: String(category.id),
  }

  // Nếu có children, đệ quy build children
  if (children.length > 0) {
    node.children = children.map((child) => buildTreeNode(child, allCategories))
    // Optional: Disable parent nodes nếu chỉ muốn select leaf nodes
    // node.disabled = true
  }

  return node
}

const fetchCategoryOptions = async () => {
  const result = await ctr_category_site.GetCategoryByTrafficSource('tiktok')
  if (result.status) {
    categoryOptions.value = result.data.categories.map((cat: any) => ({
      id: cat.id,
      label: cat.name,
      parent_id: cat.parent_id,
    }))
  }
}

onMounted(() => {
  fetchCategoryOptions()
})
watch(
  () => props.campaign.IsSmart(),
  (newValue, oldValue) => {
    if (newValue) {
      props.adgroup.categories = undefined
    }
  }
)
</script>

<template>
  <div class="flex items-center gap-2" v-if="!props.campaign.IsSmart()">
    <FloatingWrapper name="Interests & behaviors" rounded>
      <div class="flex-1 min-w-0">
        <n-tree-select
          v-model:value="props.adgroup.categories"
          :options="categoryOptionsComp"
          filterable
          clearable
          multiple
          cascade
          checkable
          placeholder="Interests & behaviors"
          :show-path="true"
          separator=" > "
          :default-expand-all="false"
          :disabled="props.campaign.IsSmart()"
          :max-tag-count="1"
        />
      </div>
    </FloatingWrapper>
  </div>
</template>
