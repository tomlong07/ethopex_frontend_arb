<script setup lang="ts">
import { useStyleExperimentStore } from '@/store/adsense/styleExperimentStore'
const StyleExperimentStore = useStyleExperimentStore()
//@ts-ignore
import ExpImport from '@/components/style_experiments/experiments/experiments_import.html-template'
//@ts-ignore
import ExpHelpers from '@/components/style_experiments/experiments/experiments_helpers.html-template'
//@ts-ignore
import Preload from '@/components/style_experiments/experiments/preload.html-template'
//@ts-ignore
import capturePayload from '@/components/style_experiments/experiments/capturePayload.html-template'
//@ts-ignore
import Main from '@/components/style_experiments/experiments/main.html-template'
//@ts-ignore
import CreateSearchAdStyleExperiment from '@/components/style_experiments/experiments/CreateSearchAdStyleExperiment.html-template'

const isError = () => {
  if (!StyleExperimentStore.dataConfig.adsenseAccount) {
    return `Invalid Adsense Account, please check!`
  }

  if (!StyleExperimentStore.dataConfig.updateStyles?.length) {
    return `Invalid Update Style Ids, please check!`
  }

  return
}
const generateJS = async () => {
  const error = isError()
  if (error) {
    window.message.error(error)
    return
  }

  navigator.clipboard.writeText(generateJSScript())

  window.message.success('Copied code to clipboard!')
}

const updateIdsString = computed<string>(() => {
  const stringArray = StyleExperimentStore.dataConfig.updateStyles?.map(
    (num: any) => num.toString()
  )

  return JSON.stringify(stringArray)
})

function generateJSScript() {
  let dataImport = ExpImport

  dataImport = dataImport
    .replaceAll('<script>', '')
    .replaceAll('</' + 'script>', '')

  let objCustom: Record<string, any> = {
    adsenseAccount: StyleExperimentStore.dataConfig.adsenseAccount,
    version: StyleExperimentStore.version,
    updateIdsString: updateIdsString.value,
  }

  dataImport = helper.handleBarsCustom(dataImport, objCustom)

  const dataHelp = ExpHelpers.replaceAll('<script>', '').replaceAll(
    '</' + 'script>',
    ''
  )
  const preloadData = Preload.replaceAll('<script>', '').replaceAll(
    '</' + 'script>',
    ''
  )

  const captureData = capturePayload
    .replaceAll('<script>', '')
    .replaceAll('</' + 'script>', '')

  const mainData = Main.replaceAll('<script>', '').replaceAll(
    '</' + 'script>',
    ''
  )

  const createData = CreateSearchAdStyleExperiment.replaceAll(
    '<script>',
    ''
  ).replaceAll('</' + 'script>', '')

  return (
    dataImport + dataHelp + preloadData + captureData + mainData + createData
  )
}
</script>

<template>
  <div class="flex flex-row-reverse sticky bottom-0 gap-2">
    <n-button
      color="#0D6EFD"
      size="medium"
      type="success"
      class="mt-4"
      @click="generateJS"
    >
      Copy JS
    </n-button>
  </div>
</template>
