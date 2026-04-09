import { ctr_report } from '@/services/ctr_report'
import { defineStore } from 'pinia'

export default defineStore('useReportV2ModalFacebook', () => {
  const showModal = ref<boolean>(false)
  const id = ref<string>('')
  const url = ref<string>('')
  const listAds = ref<any[]>([])

  const adId = ref<string>('')

  const handleClick = async () => {
    const data = await ctr_report.GetLinkPreviewAds({
      id_campaign: Number(id.value),
      id_preview: adId.value,
    })
    const previewBox = document.querySelector('#previewBox')
    if (!previewBox) return
    try {
      previewBox.innerHTML = data.data[0].body
    } catch {}
  }

  return {
    showModal,
    id,
    url,
    adId,
    listAds,

    handleClick,
  }
})
