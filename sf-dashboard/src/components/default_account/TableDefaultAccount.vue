<script lang="ts" setup>
import { useDefaultAccount } from '@/store/details/defaultAccount'
import { NButton, NIcon, NPopover, NTag, NTooltip } from 'naive-ui'
import { ONOFF } from '@/enum/campaign'
import TrashAltRegular from '@/assets/icons/TrashAltRegular.vue'
import { TableData } from './dataTable'
import { Type } from './enum'

import ctr_default_account from '@/services/ctr_default_account'
import ModalCategory from '@/components/default_account/ModalCategory.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

const defaultAccountStore = useDefaultAccount()

const columns = computed(() => {
  let cols = [
    {
      type: 'selection' as const,
      multiple: true,
      onUpdateCheckedRowKeys: (keys: (string | number)[]) => {
        defaultAccountStore.selectedRows = new Set(keys)
      },
    },
    {
      title: 'ID',
      key: 'id',
      width: 60,
    },
    {
      title: 'Account Name',
      width: 120,
      key: 'show_name',
    },
    {
      title: 'Account ID',
      key: 'name',
      width: 180,
    },

    {
      title: 'Status',
      width: 120,
      key: 'status',
      render: (row: TableData) => {
        const statusText = row.status?.toUpperCase() || 'UNKNOWN'

        const tagType = helper.classRender(row.status) || 'default'

        return h(NTag, { type: tagType }, { default: () => statusText })
      },
    },
  ]

  if (defaultAccountStore.initCategoryAllocation === ONOFF.ON) {
    cols = cols.concat([
      {
        title: 'Category',
        width: 120,
        key: 'category',
      },

      {
        title: 'Count Campaign',
        key: 'count_campaign',
        width: 190,
      },
    ] as any)
  }

  cols.push({
    title: 'Cost Yesterday',
    width: 120,
    key: 'cost_yesterday',
    render: (row: TableData) => {
      return h(
        'span',
        helper.currencyFormatterAuto2(row.cost_yesterday || 0, 2)
      )
    },
  } as any)

  if (defaultAccountStore.isGoogleAdsense) {
    cols.push({
      title: 'Label',
      key: 'label',
      width: 150,
      render: (row: TableData) => {
        if (!row.label || !Array.isArray(row.label) || row.label.length === 0) {
          return h('span', { style: { color: '#999' } }, 'No labels')
        }
        return h(
          'div',
          {
            style: {
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap',
              maxWidth: '140px',
            },
          },
          row.label.map((labelText: string, index: number) =>
            h(
              NTag,
              {
                key: index,
                size: 'small',
                type: 'info',
                style: { fontSize: '11px' },
              },
              { default: () => labelText }
            )
          )
        )
      },
    } as any)

    cols.push({
      title: 'List Exclude',
      width: 120,
      key: 'list_exclude',
      render: (row: TableData) => {
        return h('span', helper.capitalizeFirstLetter(row.list_exclude))
      },
    } as any)
  }

  cols.push({
    title: 'Domain Config',
    key: 'domain_config',
    width: 220,
    render: (row: TableData) => {
      const domains = row.domain_config
      if (!domains || !Array.isArray(domains) || domains.length === 0) {
        return h('span', { style: { color: '#999' } }, 'No domains')
      }

      const previewItems = domains.slice(0, 3)
      const hasMore = domains.length > previewItems.length
      const previewText = previewItems.join(', ') + (hasMore ? ' ...' : '')

      return h(
        NPopover,
        {
          trigger: 'hover',
          placement: 'top',
        },
        {
          trigger: () =>
            h(
              'span',
              {
                style: {
                  cursor: 'pointer',
                  display: 'inline-block',
                  maxWidth: '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                title: previewText, // native tooltip
              },
              previewText
            ),
          default: () =>
            h(
              'div',
              { style: { maxWidth: '320px', padding: '6px 8px' } },
              domains.map((d: string, i: number) =>
                h(
                  'div',
                  {
                    key: i,
                    style: {
                      whiteSpace: 'normal',
                      padding: '2px 0',
                    },
                  },
                  d
                )
              )
            ),
        }
      )
    },
  } as any)

  if (defaultAccountStore.isFacebook) {
    cols.push({
      title: () =>
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
          [
            h('span', 'Location'),
            h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(QuestionCircleRegular, {
                    style: {
                      cursor: 'pointer',
                      width: '12px',
                      height: '12px',
                      color: '#666',
                    },
                  }),
                default: () =>
                  'Click on a row (global is off) to edit Location',
              }
            ),
          ]
        ),
      width: 120,
      key: 'location',
      render: (row: TableData) => {
        let displayValue = row.location
        if (row.location) {
          const selectedOption = defaultAccountStore.locationOptions.find(
            (opt) => opt.value === row.location
          )
          displayValue =
            typeof selectedOption?.label === 'string'
              ? selectedOption.label
              : row.location || '--'
        }
        if (row.category && !row.location) {
          displayValue = 'Click to set'
        } else if (!row.category && !row.location) {
          displayValue = 'Click to set'
        }

        return h(
          'span',
          {
            style: {
              cursor: 'pointer',
              color: '#333',
              opacity:
                displayValue === '--' || displayValue === 'Click to set'
                  ? 0.5
                  : 1,
            },
            onClick: () => {
              if (
                row.category &&
                defaultAccountStore.defaultAccountData.global === ONOFF.ON
              )
                return
              defaultAccountStore.openFanpageModal(row, Type.LOCATION)
            },
          },
          displayValue
        )
      },
    } as any)

    cols.push({
      title: () =>
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
          [
            h('span', 'Pixel'),
            h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(QuestionCircleRegular, {
                    style: {
                      cursor: 'pointer',
                      width: '12px',
                      height: '12px',
                      color: '#666',
                    },
                  }),
                default: () => 'Click a row (with a category) to edit Pixel',
              }
            ),
          ]
        ),
      width: 120,
      key: 'pixelName',
      render: (row: TableData) => {
        let displayValue = row.pixelName
        if (row.category && !row.pixelName) {
          displayValue = 'Click to set'
        } else if (!row.category && !row.pixelName) {
          displayValue = 'Click to set'
        }

        return h(
          'span',
          {
            style: {
              cursor: 'pointer',
              color: '#333',
              opacity:
                displayValue === '--' || displayValue === 'Click to set'
                  ? 0.5
                  : 1,
            },
            onClick: () => {
              defaultAccountStore.openFanpageModal(row, Type.PIXEL)
            },
          },
          displayValue
        )
      },
    } as any)

    cols.push({
      title: () =>
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
          [
            h('span', 'Fanpage'),
            h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(QuestionCircleRegular, {
                    style: {
                      cursor: 'pointer',
                      width: '12px',
                      height: '12px',
                      color: '#666',
                    },
                  }),
                default: () => 'Click a row (with a category) to edit Fanpage',
              }
            ),
          ]
        ),
      width: 120,
      key: 'fanpage_id',
      render: (row: TableData) => {
        let displayValue = row.fanpage_id
        if (row.fanpage_id) {
          const selectedOption = defaultAccountStore.fanpageOptions.find(
            (opt) => opt.post_id === row.fanpage_id
          )
          displayValue =
            typeof selectedOption?.name === 'string'
              ? selectedOption.name
              : row.fanpage_id || '--'
        }
        if (row.category && !row.fanpage_id) {
          displayValue = 'Click to set'
        } else if (!row.category && !row.fanpage_id) {
          displayValue = 'Click to set'
        }

        return h(
          'span',
          {
            style: {
              cursor: 'pointer',
              color: '#333',
              opacity:
                displayValue === '--' || displayValue === 'Click to set'
                  ? 0.5
                  : 1,
            },
            onClick: () => {
              defaultAccountStore.openFanpageModal(row, Type.FANPAGE)
            },
          },
          displayValue
        )
      },
    } as any)
  }

  cols.push({
    title: 'Action',
    key: 'action',
    width: 100,
    render: (row: TableData) => {
      const isDeleting = defaultAccountStore.deletingKeys.has(row.key)

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

const totalPages = computed(() => {
  const totalRecords = defaultAccountStore.totalRecord || 0
  const pageSize = defaultAccountStore.pageSize || 50

  const pages = Math.ceil(totalRecords / pageSize)

  return pages
})
const handlePageChange = async (page: number) => {
  defaultAccountStore.currentPage = page
  await defaultAccountStore.fetchTableData()
}

const handlePageSizeChange = async (pageSize: number) => {
  defaultAccountStore.pageSize = pageSize
  defaultAccountStore.currentPage = 1

  await defaultAccountStore.fetchTableData()
}

const pageSizeOptions = computed(() => {
  const base = [5, 10, 20, 50, 100]
  const total = Number(defaultAccountStore.totalRecord || 0)

  const opts = base.map((s) => ({ label: `${s} / page`, value: s }))

  if (total > 0) {
    const already = base.includes(total)
    if (!already) {
      opts.push({ label: `All (${total})`, value: total })
    } else {
      opts.push({ label: `All (${total})`, value: total })
    }
  }

  return opts
})

const deleteThisAccount = async (row: TableData) => {
  const ok = confirm(
    `Are you sure you want to delete the account: ${row.name}?`
  )
  if (!ok) return

  defaultAccountStore.deletingKeys.add(row.key) // ✅ set loading = true

  try {
    const result = await ctr_default_account.RemoveAccountDefault({
      id: defaultAccountStore.id,
      accounts: [row.name],
    })

    if (result.status) {
      // Xoá trên UI hoặc refetch
      defaultAccountStore.tableData = defaultAccountStore.tableData.filter(
        (item: any) => item.key !== row.key
      )
      defaultAccountStore.deleteTableItems([row.key])
    }
  } catch (err) {
    console.error('Delete error:', err)
  } finally {
    defaultAccountStore.deletingKeys.delete(row.key) // ✅ set loading = false
  }
}

// Row class name function to highlight rows that have a category
const getRowClassName = (row: any) => {
  const is =
    row?.category && (!row?.fanpage_id || !row?.pixelName)
      ? 'has-category-row'
      : ''
  try {
    return defaultAccountStore.isFacebook ? is : ''
  } catch {
    return ''
  }
}
onMounted(() => {
  defaultAccountStore.fetchLocationOptions()
  defaultAccountStore.fetchFanpageOptions()
})
</script>

<template>
  <div>
    <n-data-table
      :columns="columns"
      :data="defaultAccountStore.tableData"
      :bordered="true"
      :row-key="(row: any) => row.key"
      :pagination="false"
      v-model:checked-row-keys="defaultAccountStore.selectedRowKeys"
      :scroll-x="1200"
      :row-class-name="getRowClassName"
      class="pb-4 default-account-table"
    />

    <!-- Simple Pagination -->
    <div class="flex justify-end items-center gap-2">
      <n-pagination
        v-model:page="defaultAccountStore.currentPage"
        :page-count="totalPages"
        :page-size="defaultAccountStore.pageSize"
        @update:page="handlePageChange"
      />

      <n-select
        v-model:value="defaultAccountStore.pageSize"
        :options="pageSizeOptions"
        :consistent-menu-width="false"
        size="small"
        style="width: 111px"
        @update:value="handlePageSizeChange"
      />
    </div>
  </div>
  <ModalCategory />
</template>

<style scoped>
.default-account-table :deep(.n-data-table-tbody > tr.has-category-row),
.default-account-table :deep(.n-data-table-tbody > tr.has-category-row) > td {
  background-color: #fff7e6 !important; /* soft highlight */
}
</style>
