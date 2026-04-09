<template>
  <n-spin :show="dataConfig.isGetting">
    <div class="pb-5">
      <div>
        <label class="font-bold text-xs">Section</label>
      </div>
      <!-- <div class="flex flex-wrap sm:flex-row sm:w-3/4"> -->
      <div class="grid grid-cols-3 gap-3 w-full">
        <div class="grow">
          <NInput
            v-model:value="dataConfig.sectionData.section"
            type="textarea"
            class="sectionTextArea h-full"
            placeholder=""
            :autosize="{ minRows: 5 }"
            :disabled="dataConfig.isSubmitBtnLoading"
          />
          <div class="totalSection absolute">
            Total Section: {{ dataConfig.sectionData.total_section }}
          </div>
        </div>
        <div class="grow">
          <NInput
            v-model:value="dataConfig.sectionData.section_remove_network"
            disabled
            type="textarea"
            class="sectionTextArea h-full"
            placeholder=""
            :autosize="{ minRows: 5 }"
          />
          <div class="totalSection absolute">
            Total Section Remove Network:
            {{ dataConfig.sectionData.total_section_remove_network }}
          </div>
        </div>
        <div class="grow">
          <NInput
            v-model:value="dataConfig.sectionData.section_network"
            disabled
            type="textarea"
            class="sectionTextArea h-full"
            placeholder=""
            :autosize="{ minRows: 5 }"
          />
          <div class="totalSection absolute">
            Total Section Network:
            {{ dataConfig.sectionData.total_section_network }}
          </div>
        </div>
      </div>
    </div>
  </n-spin>
</template>
<script setup lang="ts">
import useBlockSection from '@/store/details/useBlockSection'
const dataConfig = useBlockSection()
</script>
