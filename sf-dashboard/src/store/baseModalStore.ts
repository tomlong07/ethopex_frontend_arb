import { ref } from 'vue'

function baseStore() {
  const showModal = ref<boolean>(false)
  const resultModal = ref<any>({})
  const adGroupModalIndex = ref<number | null>(null)

  function changeShowModal(value: boolean) {
    showModal.value = value
  }

  function changeResult(value: any) {
    resultModal.value = value
  }

  function changeAdGroupIndex(value: any) {
    adGroupModalIndex.value = value
  }

  return {
    showModal,
    resultModal,
    adGroupModalIndex,
    changeShowModal,
    changeResult,
    changeAdGroupIndex,
  }
}

export default baseStore
