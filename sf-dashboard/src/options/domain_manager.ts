export const StatusList = [
  { value: 'pending', label: 'Pending', type: '', color: 'text-gray-400' },

  {
    value: 'queue',
    label: 'Queue',
    colorTag: `{"color":"rgb(204 251 241 /1)"}`,
    color: 'text-teal-500',
  },

  {
    value: 'processing',
    label: 'Processing',
    disabled: true,
    colorTag: `{"color":"rgb(216 180 254 /1)"}`,
    color: 'text-purple-500	',
  },

  {
    value: 'submited',
    label: 'Submited',
    type: 'warning',
    disabled: true,
    color: 'text-yellow-500',
  },
  {
    value: 'approved',
    label: 'Approved',
    disabled: true,

    type: 'success',
    color: 'text-green-400',
  },

  {
    value: 'review',
    label: 'Review',
    disabled: true,

    type: 'info',
    color: 'text-blue-400',
  },

  {
    value: 'rejected',
    label: 'Rejected',
    disabled: true,

    type: 'error',
    color: 'text-red-500',
  },

  {
    value: 'delete',
    label: 'Delete',
    colorTag: `{"color":"#1f2937", "textColor":"white"}`,
    color: 'text-black font-bold',
  },
]

export const typeOptions = [
  { label: 'Search', value: 'search' },
  { label: 'Content', value: 'content' },
  { label: 'Prelanding', value: 'prelanding' },
]

// Tùy chọn trạng thái áp dụng (Whitelist/Blacklist)
// eslint-disable-next-line no-unused-vars
const statusApplyOptions = computed(() => [
  { label: 'Whitelist', value: 'whitelist' },
  { label: 'Blacklist', value: 'blacklist' },
])
