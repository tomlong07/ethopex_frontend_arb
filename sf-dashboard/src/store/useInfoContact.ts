import { GridApi } from 'ag-grid-community'
import { defineStore } from 'pinia'
import { ctr_info_contact } from '@/services/ctr_info_contact'
import { SelectOption } from 'naive-ui'
import { useTemplateV2 } from './templateV2Store'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'

export default defineStore('useInfoContact', () => {
  const isLoadingTable = ref(false)
  const showModal = ref(false)
  const gridApi = ref<GridApi | null>(null)

  const infoContactList = ref<any[]>([])
  const selectedContact = ref<any | null>(null)
  const selectedContactStatus = ref<any | null>(null)

  const noteContent = ref('')

  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalRecords = ref(0)

  const currentFilter = ref<Record<string, any>>({})

  const showDetailModal = ref(false)
  const isLoading = ref(false)

  const editIndex = ref<number | null>(null)
  const editContent = ref('')
  const isSavingNote = ref(false)

  const publisherOptions = ref<SelectOption[]>([])
  const isPublisherLoaded = ref(false)
  let fetchPromise: Promise<SelectOption[]> | null = null

  // Value là email
  const transformOptions = (data: any[]): SelectOption[] => 
    data.map(item => ({ label: item.label, value: item.label }))

  const fetchPublisherOptions = async () => {
    if (isPublisherLoaded.value) return publisherOptions.value
    if (fetchPromise) return fetchPromise

    fetchPromise = (async () => {
      try {
        const response = await ctr_filter_v2.FilterPublisher({})
        publisherOptions.value = transformOptions(response?.data || [])
        isPublisherLoaded.value = true
        return publisherOptions.value
      } finally {
        fetchPromise = null
      }
    })()

    return fetchPromise
  }

  const searchPublisher = async (params: { q?: string; f?: string }): Promise<SelectOption[]> => {
    try {
      const response = await ctr_filter_v2.FilterPublisher(params)
      return transformOptions(response?.data || [])
    } catch (error) {
      console.error('Error searching publisher:', error)
      return []
    }
  }

  const templateV2Store = useTemplateV2(helper.truePath())()

  // lấy options từ column config theo field
  const getColumnOptions = (field: string): SelectOption[] => {
    const column = templateV2Store.columnConfigs.columns?.find(
      (col) => col.field === field
    )
    
    if (!column?.options) return []

    return column.options.map((opt: any) => ({
      label: opt.label,
      value: opt.value,
      style: {
        color: opt.color,
      },
    }))
  }

  const statusOptions = computed(() => getColumnOptions('status'))
  const setupOptions = computed(() => getColumnOptions('set_up'))

  const submitAddNote = async () => {
    if (!selectedContact.value?.id) return
    isLoading.value = true
    try {
      const payload = { note: noteContent.value }
      const response = await ctr_info_contact.AddNote(
        payload,
        selectedContact.value.id
      )

      if (response.status) {
        const newNote = response?.data
        if (!selectedContact.value.notes) {
          selectedContact.value.notes = []
        }

        selectedContact.value.notes.unshift(newNote)

        window.message.success('Submit successfully!')
        noteContent.value = ''
        showModal.value = false
      }
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const changeStatus = async (
    id: number | string,
    status: string,
    changeStatusURL?: string
  ) => {
    if (!changeStatusURL || !id) return { success: false }

    try {
      const payload = { id, status }
      const result = await ctr_info_contact.ChangeStatus(
        changeStatusURL,
        payload
      )

      if (result?.status) {
        const contact = infoContactList.value.find((c) => c.id === id)
        if (contact) contact.status = status

        if (selectedContact.value?.id === id) {
          selectedContact.value.status = status
        }

        window.message.success('Change status successfully.')
        return { success: true }
      }

      return { success: false }
    } catch {
      window.message.error('Failed to change status.')
      return { success: false }
    }
  }

  const formatCurrency = (value: any) => {
    if (!value && value !== 0) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  function startEdit(index: number) {
    editIndex.value = index
    editContent.value = selectedContact.value?.notes[index]?.content ?? ''
  }

  function cancelEdit() {
    editIndex.value = null
    editContent.value = ''
  }

  async function updateNote(index: number) {
    const contactId = selectedContact.value?.id
    const note = selectedContact.value?.notes[index]

    if (!contactId || !note || !editContent.value.trim()) return

    try {
      isSavingNote.value = true

      // Gọi API update note
      const result = await ctr_info_contact.updateNote(
        { note: editContent.value.trim() },
        contactId, // formId
        note.id // noteId
      )

      if (result.status) {
        selectedContact.value.notes[index].content = editContent.value.trim()
        cancelEdit()
        window.message.success('Update note successfully!')
      }
    } catch (error) {
      console.error(error)
      window.message.error('Failed to update note!')
    } finally {
      isSavingNote.value = false
    }
  }

  async function deleteNote(index: number) {
    const contactId = selectedContact.value?.id
    const note = selectedContact.value?.notes[index]

    if (!contactId || !note) return

    try {
      await ctr_info_contact.deleteNote(contactId, note.id)
      // xóa khỏi danh sách local
      selectedContact.value.notes.splice(index, 1)
    } finally {
      window.message.success('Delete note successfully!')
    }
  }

  return {
    showModal,
    isLoadingTable,
    gridApi,
    selectedContact,
    selectedContactStatus,
    infoContactList,
    currentPage,
    pageSize,
    totalRecords,
    noteContent,
    currentFilter,
    showDetailModal,
    isLoading,
    statusOptions,
    editIndex,
    editContent,
    isSavingNote,
    setupOptions,
    publisherOptions,
    isPublisherLoaded,
    submitAddNote,
    changeStatus,
    formatCurrency,
    startEdit,
    updateNote,
    deleteNote,
    cancelEdit,
    fetchPublisherOptions,
    searchPublisher,
  }
})
