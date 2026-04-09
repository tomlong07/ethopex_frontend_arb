<script setup lang="ts">
import QuestionMAds from '@/store/useQuestionManagementAds'
import { ModeClass } from '@/types/components/base'
import Minus from '@/assets/icons/Minus.vue'
import Plus from '@/assets/icons/Plus.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import CustomSwitch from '../common/CustomSwitch.vue'
const useQuestionManagementAds = QuestionMAds()
const modeData = helper.deepFreeze(new ModeClass(window.route)) as ModeClass

const manualAnswers = computed(() =>
  useQuestionManagementAds.QuestionConfig.answers.filter(
    (a) => a.by === 'manual'
  )
)
const insertManualAnswer = (index: number) => {
  const answers = useQuestionManagementAds.QuestionConfig.answers
  const manualIndexes = answers
    .map((a, i) => (a.by === 'manual' ? i : -1))
    .filter((i) => i >= 0)

  const insertAt = manualIndexes[index] + 1
  answers.splice(insertAt, 0, {
    id: 0,
    status: 'on',
    answer: '',
    by: 'manual',
  })
}

const deleteManualAnswer = (index: number) => {
  const all = useQuestionManagementAds.QuestionConfig.answers

  const manualIndexes = all
    .map((a, i) => (a.by === 'manual' ? i : -1))
    .filter((i) => i >= 0)

  if (manualIndexes.length <= 1) return // luôn giữ ít nhất 1 dòng

  const deleteAt = manualIndexes[index]
  all.splice(deleteAt, 1)
}
</script>
<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex items-center justify-between">
      <div class="font-bold">Answers By Manual</div>
      <div class="flex gap-2" v-if="modeData.isEditPage()">
        <n-tag type="info">
          Total:
          {{
            useQuestionManagementAds.QuestionConfig.answers.filter(
              (a) => a.by === 'manual'
            ).length
          }}
        </n-tag>
        <n-tag type="success">
          On:
          {{
            useQuestionManagementAds.QuestionConfig.answers.filter(
              (a) => a.by === 'manual' && a.status === 'on'
            ).length
          }}
        </n-tag>
        <n-tag type="error">
          Off:
          {{
            useQuestionManagementAds.QuestionConfig.answers.filter(
              (a) => a.by === 'manual' && a.status === 'off'
            ).length
          }}
        </n-tag>
      </div>
    </div>
    <div class="w-full">
      <n-table :single-line="false" class="w-full">
        <thead>
          <tr>
            <th>Answer</th>
            <th :width="50">Status</th>
            <th :width="50">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ans, index) in manualAnswers" :key="index">
            <td>
              <FloatingWrapper name="Enter answer">
                <n-input type="textarea" v-model:value="ans.answer" rows="1">
                  <template #suffix>
                    <span>{{ ans.answer.length }}</span>
                  </template>
                </n-input>
              </FloatingWrapper>
            </td>
            <td>
              <CustomSwitch
                v-model="ans.status"
                :disabled="
                  useQuestionManagementAds.isSubmitBtnLoading ||
                  useQuestionManagementAds.isLoading
                "
                true-label="On"
                false-label="Off"
                size="small"
              />
            </td>
            <td>
              <n-button-group>
                <n-button
                  ghost
                  class="dynamic-button"
                  :disabled="
                    useQuestionManagementAds.QuestionConfig.answers.length <= 1
                  "
                  @click="deleteManualAnswer(index)"
                >
                  <template #icon>
                    <n-icon size="12"><Minus /></n-icon>
                  </template>
                </n-button>
                <n-button
                  ghost
                  class="dynamic-button"
                  @click="insertManualAnswer(index)"
                >
                  <template #icon>
                    <n-icon size="12"><Plus /></n-icon>
                  </template>
                </n-button>
              </n-button-group>
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </div>
</template>
