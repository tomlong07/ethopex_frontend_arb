<script setup lang="ts">
import { useLocale } from '@/lang/messages'
const jsonConvert = useLocale(
  () => import('@/lang/vi/json_convert'),
  () => import('@/lang/en/json_convert')
)

import { ctr_tool } from '@/services/ctr_tool'

const isSubmitBtnLoading = ref<boolean>(false)

const isLoading = ref<boolean>(false)
const jsonConvertConfig = ref<any>({
  layout_id: '',
  search_page_id: '',
  related_search_id: '',
  shopping_style_id: '',
  json_example: '',
  json_result: '',
})
const json = ref<any>({
  related_search_page: '',
  related: '',
  search: '',
})
const data = ref<any>('')
const getFormattedName = (name: any) => {
  const nameMap: { [key: string]: string } = {
    related_search_page: 'Related Search Page',
    related: 'Related',
    search: 'Search',
  }
  return nameMap[name] || name
}
const jsonKeys = computed(() =>
  Object.keys(json.value).map((name) => ({
    name,
    value: getFormattedName(name),
  }))
)

const copyToClipBoard = (s: string) => {
  navigator.clipboard.writeText(s)
  window.message.success('Copied to clipboard!')
}

const beautifiedJson = (json: any) => {
  jsonConvertConfig.value.json_result = JSON.stringify(
    JSON.parse(json),
    null,
    2
  )
}

const validJSONString = (text: any) => {
  if (
    /^[\],:{}\s]*$/.test(
      text
        .replace(/\\["\\/bfnrtu]/g, '@')
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g,
          ']'
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
    )
  ) {
    return true
  } else {
    return false
  }
}

onMounted(async () => {
  isLoading.value = true
  //do something
  const result = await ctr_tool.GetGstyle()

  if (result?.status) {
    data.value = result.data
  }
  isLoading.value = false
})

const submitForm = async () => {
  isSubmitBtnLoading.value = true
  const result = await ctr_tool.SaveGstyle(data.value)
  if (result?.status) {
    window.message.success(`Submit success!`)
  }
  isSubmitBtnLoading.value = false
}

const submitConvert = async () => {
  let _jsonExample = jsonConvertConfig.value.json_example
  let _layoutId = jsonConvertConfig.value.layout_id
  let _searchPageId = jsonConvertConfig.value.search_page_id
  let _relatedSearchsId = jsonConvertConfig.value.related_search_id
  let _shoppingStyleId = jsonConvertConfig.value.shopping_style_id
  if (
    _layoutId == '' ||
    _searchPageId == '' ||
    _relatedSearchsId == '' ||
    _shoppingStyleId == ''
  ) {
    window.message.error(jsonConvert.value.valid_info)
    return
  }
  if (!validJSONString(_jsonExample)) {
    window.message.error(jsonConvert.value.valid_format)
    return
  }
  try {
    let _jsonExp = JSON.parse(jsonConvertConfig.value.json_example)
    let keypass = (_jsonExp['1'] && _jsonExp['1']['4']) || ''
    if (!keypass) {
      window.message.error(jsonConvert.value.valid_not_found)
      return
    }
    var flag = false
    var layoutName = ''
    switch (keypass) {
      case 'Related searches':
        _jsonExp['1']['1'] = _relatedSearchsId
        flag = true
        break
      case 'Shopping style':
        _jsonExp['1']['1'] = _shoppingStyleId
        flag = true
        break
      case 'Search Page':
        _jsonExp['1']['1'] = _searchPageId
        flag = true
        break
      default:
        if (keypass.toLowerCase().indexOf('layout') != -1) {
          _jsonExp['1']['1'] = _layoutId
          flag = true
          layoutName = keypass
        }
        break
    }
    if (!flag) {
      window.message.error('Không tìm thấy thông tin Config cần thay đổi')
      return
    }
    let jdata = JSON.stringify(_jsonExp['1'])
    //
    const regex2 = /"2":\s*{\s*"1":\s*"[^"]*",\s*"2":\s*"(Layout[^"]*)"/
    const matches = jdata.match(regex2)
    if (matches && matches[1]) {
      layoutName = matches[1]
    }
    let jsData: { [key: string]: string } = {
      'Related searches': _relatedSearchsId,
      'Shopping style': _shoppingStyleId,
      'Search Page': _searchPageId,
    }
    jsData[layoutName] = _layoutId
    for (const p in jsData) {
      var regex = new RegExp(`"1":\\s*"[^"]*",\\s*"2":\\s*"${p}"`)
      jdata = jdata.replace(regex, `"1": "${jsData[p]}", "2": "${p}"`)
    }

    _jsonExp['1'] = JSON.parse(jdata)
    jsonConvertConfig.value.json_result = JSON.stringify(_jsonExp)
  } catch (err) {
    console.error(err)
  }
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base flex-auto justify-self-auto">
    <h1>JSON Convert</h1>
    <div v-show="!isLoading" class="flex justify-center">
      <n-grid v-show="!isLoading" class="mt-4" x-gap="12" :cols="2">
        <n-gi>
          <n-card>
            <!-- Layout Id -->
            <div class="flex items-center my-4">
              <div class="w-1/4 font-bold">Layout ID</div>
              <div class="w-3/4">
                <n-input
                  v-model:value="jsonConvertConfig.layout_id"
                  placeholder="Layout ID"
                  class="w-full"
                />
              </div>
            </div>
            <!-- >Search Page ID -->
            <div class="flex items-center my-4">
              <div class="w-1/4 font-bold">Search Page ID</div>
              <div class="w-3/4">
                <n-input
                  v-model:value="jsonConvertConfig.search_page_id"
                  placeholder="Search Page ID"
                  class="w-full"
                />
              </div>
            </div>
            <!-- Related Searchs ID -->
            <div class="flex items-center my-4">
              <div class="w-1/4 font-bold">Related Searchs ID</div>
              <div class="w-3/4">
                <n-input
                  v-model:value="jsonConvertConfig.related_search_id"
                  placeholder="Related Searchs ID"
                  class="w-full"
                />
              </div>
            </div>
            <!-- Shopping Style ID -->
            <div class="flex items-center my-4">
              <div class="w-1/4 font-bold">Shopping Style ID</div>
              <div class="w-3/4">
                <n-input
                  v-model:value="jsonConvertConfig.shopping_style_id"
                  placeholder="Shopping Style ID"
                  class="w-full"
                />
              </div>
            </div>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card title="JSON Example">
            <n-input
              v-model:value="jsonConvertConfig.json_example"
              type="textarea"
              rows="7"
            />
          </n-card>
        </n-gi>
      </n-grid>
    </div>

    <div class="flex justify-center my-4">
      <div class="button-container">
        <n-button class="w-52 mr-8" color="#198754" @click="submitConvert"
          >Convert JSON</n-button
        >
        <n-button
          class="w-52 mr-8"
          color="#6C757D"
          @click="beautifiedJson(jsonConvertConfig.json_result)"
          >JSON Beautify</n-button
        >
        <n-button
          class="w-52"
          color="#0D6EFD "
          @click="copyToClipBoard(jsonConvertConfig.json_result)"
          >Copy Result</n-button
        >
      </div>
    </div>
    <n-card title="JSON Result">
      <n-input
        v-model:value="jsonConvertConfig.json_result"
        type="textarea"
        rows="7"
        round
      />
    </n-card>
    <n-card>
      <div class="w-full macro">
        <n-tabs type="card" tab-style="min-width: 80px;">
          <n-tab-pane
            v-for="(item, index) in jsonKeys"
            :key="index"
            class="tab-pane-macros"
            :name="item.value"
            :tab="item.value"
            :index="item"
          >
            <n-input v-model:value="data[item.name]" type="textarea" rows="5">
            </n-input>
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-card>
    <div class="flex flex-row-reverse sticky bottom-0 p-2">
      <n-button
        color="#f43f5e"
        size="medium"
        type="success"
        :loading="isSubmitBtnLoading"
        @click="submitForm"
      >
        Submit
      </n-button>
    </div>
  </div>
</template>
<style lang="scss">
body h1 {
  font-size: 16px;
  text-align: center;
  font-weight: 600;
  padding: 10px 0;
  background-color: #009688;
  color: #fff;
}

.tab-pane-macros {
  border-left: 1px solid rgb(239, 239, 245);
  border-right: 1px solid rgb(239, 239, 245);
  border-bottom: 1px solid rgb(239, 239, 245);
}
</style>
