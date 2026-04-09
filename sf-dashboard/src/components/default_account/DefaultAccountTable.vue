<script setup lang="ts">
import TrashAltRegular from '@/assets/icons/TrashAltRegular.vue'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'
import { ONOFF } from '@/enum/campaign'
import ctr_default_account from '@/services/ctr_default_account'
import { useDefaultAccount } from '@/store/details/defaultAccount'
import { NButton, NIcon, NTag } from 'naive-ui'

const defaultAccountStore = useDefaultAccount()

interface TableData {
  key: number
  name: string
  status: string
  showName: string
  category?: string
}

onMounted(() => {
  // Chỉ cần gọi khi là trang chỉnh sửa
  if (defaultAccountStore.isEditPage) {
    defaultAccountStore.fetchTableData()
  }
})

const deletingKeys = ref<Set<number | string>>(new Set())

const deleteThisAccount = async (row: TableData) => {
  const ok = confirm(
    `Are you sure you want to delete the account: ${row.name}?`
  )
  if (!ok) return

  deletingKeys.value.add(row.key) // ✅ set loading = true

  try {
    const result = await ctr_default_account.RemoveAccountDefault({
      id: defaultAccountStore.id,
      account: row.name,
    })

    if (result) {
      // Xoá trên UI hoặc refetch
      defaultAccountStore.tableData = defaultAccountStore.tableData.filter(
        (item) => item.key !== row.key
      )
    }
  } catch (err) {
    console.error('Delete error:', err)
  } finally {
    deletingKeys.value.delete(row.key) // ✅ set loading = false
  }
}

const columns = computed(() => {
  let cols = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_row: any, index: number) => index + 1,
    },
    {
      title: 'Show Name',
      key: 'show_name',
    },
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Status',
      key: 'status',
      render: (row: TableData) => {
        const colorMap: Record<string, string> = {
          ENABLED: 'success',
          SUSPENDED: 'error',
        }
        const statusKey = row.status?.toUpperCase() || 'UNKNOWN'
        const tagType = (colorMap[statusKey] || 'default') as any
        return h(NTag, { type: tagType }, { default: () => statusKey })
      },
    },
  ]

  if (defaultAccountStore.initCategoryAllocation === ONOFF.ON) {
    cols = cols.concat([
      {
        title: 'Category',
        key: 'category',
      },

      {
        title: 'Count Campaign',
        key: 'count_campaign',
      },
    ])
  }

  cols.push({
    title: 'Action',
    key: 'action',
    width: 100,
    render: (row: TableData) => {
      const isDeleting = deletingKeys.value.has(row.key)

      return h(
        NButton,
        {
          size: 'small',
          text: true,
          loading: isDeleting, // Hiển thị trạng thái loading nếu đang xoá
          disabled: isDeleting, // Disable nút trong lúc xoá
          onClick: () => deleteThisAccount(row),
        },
        {
          icon: () =>
            h(NIcon, null, {
              default: () => h(TrashAltRegular),
            }),
        }
      )
    },
  } as any)

  return cols
})

const copyCategories = () => {
  const cats = Array.from(
    new Set(
      defaultAccountStore.tableData
        ?.map((item: any) => item.category)
        .filter((category) => !!category) // lọc bỏ null, undefined, ''
    )
  )

  helper.copyText(cats.join('\n'))

  window.message.success('Copied')
}
</script>

<template>
  <n-card
    title="Accounts List"
    class="my-6"
    v-if="defaultAccountStore.isEditPage"
  >
    <div v-if="defaultAccountStore.loadingTable">
      <Skeleton />
    </div>

    <template #header-extra>
      <n-button @click="copyCategories">Copy Categories</n-button>
    </template>

    <n-data-table
      :columns="columns"
      :data="defaultAccountStore.tableData"
      :bordered="true"
      :row-key="(row: any) => row.key"
    />
  </n-card>
</template>
