import { PermissionSettings } from '@/class/permissions'
import { ONOFF } from '@/enum/campaign'
import { Input46Macro } from '@/interface/prompt'
import { StatusClass } from '@/types/components/base'
import { promptSelectOptions, promptType } from '@/types/components/prompt'
import { defineStore } from 'pinia'

interface TestData {
  model?: string | null
  web_source?: ONOFF
  landing_page?: number
  text?: string[]
  image?: string[]
  config: Record<string, string>
}

interface InputJsonMacro {
  creative_id?: string
  creative_content: string
  creative_content_type: string
}

export default defineStore('usePromtDetail', () => {
  const dataConfig = ref(new promptType())
  const statusData = ref(new StatusClass('prompt'))
  const selectData = ref(new promptSelectOptions())

  const showModal = ref(false)
  const permissionSettings = ref(new PermissionSettings())

  const transformPrompt = ref<string>('')
  const usedMacros: string[] = []
  const testMacros: Record<string, string | null> = {}
  const inputJsonMacros: InputJsonMacro = {
    creative_content: '',
    creative_content_type: '',
  }

  const input46Macros = ref<Input46Macro>({ contents: [{ content: '' }] })

  const tabNow = ref('prompt')

  const testData = ref<TestData>({ config: {} })

  const isTabPrompt = computed(() => tabNow.value === 'prompt')

  const configsNow = computed(() => {
    if (!dataConfig.value.model) return []

    const thisModel = selectData.value.models.find(
      (item) => item.value === dataConfig.value.model
    )

    return thisModel?.config || []
  })

  const isPrompt13 = computed(() => {
    return [13, 30, 31, 32, 34].includes(dataConfig.value.id as number)
  })

  const isPrompt46 = computed(() => {
    return [46].includes(dataConfig.value.id as number)
  })

  const isPrompt52Media = computed(() => {
    return [52].includes(dataConfig.value.id as number)
  })

  const isPerplexity = computed(() => {
    if (!dataConfig.value.model) return false
    const thisModel = selectData.value.models.find(
      (item) => item.value === dataConfig.value.model
    )

    return (thisModel?.source as string)?.toLowerCase() === 'chat'
  })

  const isPerplexityTest = computed(() => {
    if (!testData.value.model) return false
    const thisModel = selectData.value.models.find(
      (item) => item.value === testData.value.model
    )

    return (thisModel?.source as string)?.toLowerCase() === 'chat'
  })

  const copyMacro = (macro: string) => {
    helper.copyText(macro)
    window.message.success('Copied!')
  }

  const clearData = () => {
    dataConfig.value = new promptType()
  }

  const setPermissions = (data: any) => {
    permissionSettings.value = new PermissionSettings(data)
  }

  const resetTabNow = () => {
    tabNow.value = 'prompt'
  }

  const addContentInput46 = () => {
    input46Macros.value.contents.push({ content: '' })
  }

  const handleVersionOptions = () => {
    selectData.value.versionOptions = []
    if (!dataConfig.value.versions) return
    try {
      selectData.value.versionOptions = JSON.parse(dataConfig.value.versions)

      return
    } catch {
      const versions = dataConfig.value.versions?.split(',')

      selectData.value.versionOptions =
        versions?.map((ver) => ({
          label: ver,
          value: ver,
          prompt: dataConfig.value.prompt,
        })) || []
    }
  }

  const Payload = () => {
    let pl = helper.clone(dataConfig.value)
    pl.versions = JSON.stringify(selectData.value.versionOptions)
    return pl
  }
  return {
    dataConfig,
    statusData,
    selectData,
    permissionSettings,
    transformPrompt,
    usedMacros,
    testMacros,
    inputJsonMacros,
    tabNow,
    testData,
    input46Macros,
    showModal,

    isTabPrompt,
    isPrompt13,
    isPrompt46,
    isPrompt52Media,
    isPerplexity,
    isPerplexityTest,
    configsNow,

    copyMacro,
    clearData,
    setPermissions,
    resetTabNow,
    addContentInput46,
    handleVersionOptions,
    Payload,
  }
})
