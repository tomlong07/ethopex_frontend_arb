<script setup lang="ts">
import QuestionMAds from '@/store/useQuestionManagementAds'
import { ModeClass } from '@/types/components/base'
import Minus from '@/assets/icons/Minus.vue'
import Plus from '@/assets/icons/Plus.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import CustomSwitch from '../common/CustomSwitch.vue'
const useQuestionManagementAds = QuestionMAds()
const modeData = helper.deepFreeze(new ModeClass(window.route)) as ModeClass

const aiAnswers = computed(() =>
  useQuestionManagementAds.QuestionConfig.answers.filter((a) => a.by === 'ai')
)

const insertAiAnswer = (index: number) => {
  const answers = useQuestionManagementAds.QuestionConfig.answers
  const AiIndexes = answers
    .map((a, i) => (a.by === 'ai' ? i : -1))
    .filter((i) => i >= 0)

  const insertAt = AiIndexes[index] + 1
  answers.splice(insertAt, 0, {
    id: 0,
    status: 'on',
    answer: '',
    by: 'ai',
  })
}

const deleteManualAnswer = (index: number) => {
  const all = useQuestionManagementAds.QuestionConfig.answers
  const AiIndexes = all
    .map((a, i) => (a.by === 'ai' ? i : -1))
    .filter((i) => i >= 0)
  if (AiIndexes.length <= 1) return // luôn giữ ít nhất 1 dòng
  const deleteAt = AiIndexes[index]
  all.splice(deleteAt, 1)
}
</script>
<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex items-center justify-between">
      <div class="font-bold">Answers By AI</div>
      <div class="flex gap-2" v-if="modeData.isEditPage()">
        <n-tag type="info">
          Total:
          {{
            useQuestionManagementAds.QuestionConfig?.answers?.filter(
              (a) => a.by === 'ai'
            ).length
          }}
        </n-tag>
        <n-tag type="success">
          On:
          {{
            useQuestionManagementAds.QuestionConfig?.answers?.filter(
              (a) => a.status === 'on' && a.by === 'ai'
            ).length || '0'
          }}
        </n-tag>
        <n-tag type="error">
          Off:
          {{
            useQuestionManagementAds.QuestionConfig?.answers?.filter(
              (a) => a.status === 'off' && a.by === 'ai'
            ).length || '0'
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
            <th
              :width="50"
              v-if="
                useQuestionManagementAds.isShowPlusMins || modeData.isAddPage()
              "
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ans, index) in aiAnswers" :key="index">
            <td>
              <FloatingWrapper name="Enter answer">
                <n-input
                  type="textarea"
                  v-model:value="ans.answer"
                  placeholder=""
                  rows="1"
                >
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
            <!-- Tạm thời bỏ thêm xóa câu trả lời ở edit, vì hiện tại đang dùng câu trả lời từ AI trả về -->
            <td
              v-if="
                useQuestionManagementAds.isShowPlusMins || modeData.isAddPage()
              "
            >
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
                  @click="insertAiAnswer(index)"
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
