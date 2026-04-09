import { defineStore } from 'pinia'

export default defineStore('useReportV2Section', () => {
  const sections = ref<any[]>([])

  const sectionIds = computed(() => {
    return sections.value
      .map((s) => s.id) // Lấy danh sách id
      .filter((id, index, self) => id && self.indexOf(id) === index) // Lọc trùng và loại bỏ giá trị rỗng
  })

  const sectionNames = computed(() => {
    return sections.value
      .map((s) => s.name) // Lấy danh sách id
      .filter((name, index, self) => name && self.indexOf(name) === index) // Lọc trùng và loại bỏ giá trị rỗng
  })

  const sectionReferers = computed(() => {
    return sections.value
      .map((s) => s.referer) // Lấy danh sách id
      .filter(
        (referer, index, self) => referer && self.indexOf(referer) === index
      ) // Lọc trùng và loại bỏ giá trị rỗng
  })

  const addSection = (section: any) => {
    const exists = sections.value.some((s) => s.id === section.id)
    if (!exists) {
      sections.value.push(section)
    }
  }

  const removeSection = (section: any) => {
    const index = sections.value.findIndex((s) => s.id === section.id)
    if (index !== -1) {
      sections.value.splice(index, 1)
    }
  }

  const deselectSection = () => {
    sections.value = []
  }
  return {
    sections,
    sectionIds,
    sectionNames,
    sectionReferers,
    addSection,
    removeSection,
    deselectSection,
  }
})
