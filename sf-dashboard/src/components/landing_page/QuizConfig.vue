<script setup lang="ts">
import Plus from '@/assets/icons/Plus.vue'
import Minus from '@/assets/icons/Minus.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

import {
  defaultNewAnswer,
  defaultNewQuestion,
  defaultQuizConfig,
} from '@/types/components/campaign'
import { landingTypeClass } from '@/types/components/landing'
import { useLocale } from '@/lang/messages'
const Quiz = useLocale(
  () => import('@/lang/vi/quiz'),
  () => import('@/lang/en/quiz')
)

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const removeChildAnswer = (index: number, miniIndex: number) => {
  props.landing.quizConfig?.question_quiz[index].answers?.splice(miniIndex, 1)
}

const removeChildQuestion = (index: number) => {
  props.landing.quizConfig?.question_quiz.splice(index, 1)
}

const addAnswer = (index: number) => {
  props.landing.quizConfig?.question_quiz[index].answers?.push(
    defaultNewAnswer()
  )
}

const addQuestion = () => {
  props.landing.quizConfig?.question_quiz.push(defaultNewQuestion())
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.landing.IsShowQuizConfig(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.landing.quizConfig = defaultQuizConfig()
    } else {
      props.landing.quizConfig = undefined
    }
  }
)
</script>

<template>
  <n-card
    title="Quiz Configs"
    v-if="props.landing.IsShowQuizConfig() && props.landing.quizConfig"
  >
    <n-card title="Colors"
      ><n-table :single-line="false" class="mt-4">
        <thead>
          <tr>
            <th class="w-1/7">
              <span class="flex items-center gap-2">
                Background Color

                <n-popover trigger="hover">
                  <template #trigger>
                    <n-icon size="14" :component="QuestionCircleRegular" />
                  </template>
                  <span>{{ Quiz.quiz_page_color }}</span>
                </n-popover>
              </span>
            </th>
            <th class="w-1/7">
              <span class="flex items-center gap-2">
                Background Quiz Color
                <n-popover trigger="hover">
                  <template #trigger>
                    <n-icon size="14" :component="QuestionCircleRegular" />
                  </template>
                  <span>{{ Quiz.quiz_cell_color }}</span>
                </n-popover>
              </span>
            </th>
            <th class="w-1/7">
              <span class="flex items-center gap-2">
                Text Color
                <n-popover trigger="hover">
                  <template #trigger>
                    <n-icon size="14" :component="QuestionCircleRegular" />
                  </template>
                  <span>{{ Quiz.quiz_text_color }}</span>
                </n-popover>
              </span>
            </th>
            <th class="w-1/7">
              <span class="flex items-center gap-2">
                Answer Background Color
                <n-popover trigger="hover">
                  <template #trigger>
                    <n-icon size="14" :component="QuestionCircleRegular" />
                  </template>
                  <span>{{ Quiz.quiz_bg_color }}</span>
                </n-popover>
              </span>
            </th>
            <th class="w-1/7">
              <span class="flex items-center gap-2">
                Hover Answser Color
                <n-popover trigger="hover">
                  <template #trigger>
                    <n-icon size="14" :component="QuestionCircleRegular" />
                  </template>
                  <span>{{ Quiz.quiz_hover_color }}</span>
                </n-popover>
              </span>
            </th>
            <th class="w-1/7">
              <span class="flex items-center gap-2">
                Line Step 1 Color
                <n-popover trigger="hover">
                  <template #trigger>
                    <n-icon size="14" :component="QuestionCircleRegular" />
                  </template>
                  <span>{{ Quiz.quiz_line1_color }}</span>
                </n-popover>
              </span>
            </th>
            <th class="w-1/7">
              <span class="flex items-center gap-2">
                Line Step 2 Color
                <n-popover trigger="hover">
                  <template #trigger>
                    <n-icon size="14" :component="QuestionCircleRegular" />
                  </template>
                  <span>{{ Quiz.quiz_line2_color }}</span>
                </n-popover>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="w-1/7">
              <n-color-picker
                v-model:value="props.landing.quizConfig.bgColor"
              />
            </td>

            <td class="w-1/7">
              <n-color-picker
                v-model:value="props.landing.quizConfig.bgQuizColor"
              />
            </td>

            <td class="w-1/7">
              <n-color-picker
                v-model:value="props.landing.quizConfig.txtColor"
              />
            </td>
            <td class="w-1/7">
              <n-color-picker
                v-model:value="props.landing.quizConfig.answerBgColor"
              />
            </td>
            <td class="w-1/7">
              <n-color-picker
                v-model:value="props.landing.quizConfig.hoverAnswerColor"
              />
            </td>
            <td class="w-1/7">
              <n-color-picker
                v-model:value="props.landing.quizConfig.lineStep1Color"
              />
            </td>
            <td class="w-1/7">
              <n-color-picker
                v-model:value="props.landing.quizConfig.lineStep2Color"
              />
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-card>

    <n-card title="Info" class="mt-4">
      <n-card
        :title="
          props.landing.quizConfig.question_quiz.length > 1
            ? 'Question ' + (index + 1)
            : 'Question'
        "
        :class="index > 0 ? 'mt-4' : ''"
        v-for="(question, index) in props.landing.quizConfig.question_quiz"
        :key="index"
      >
        <template #header-extra>
          <span class="flex gap-2">
            <n-button @click="removeChildQuestion(index)"
              ><n-icon size="12"><Minus /></n-icon
            ></n-button>
            <n-button @click="addQuestion"
              ><n-icon size="12" class="cursor-pointer"><Plus /></n-icon
            ></n-button>
          </span>
        </template>
        <div class="flex flex-row">
          <div class="w-150-px font-bold">Question</div>
          <div class="w-calc-150-px">
            <n-input v-model:value="question.title" />
          </div>
        </div>

        <div v-if="question.answers" class="mt-4 flex flex-col gap-2">
          <div class="flex flex-row">
            <div class="w-150-px font-bold">Answers</div>
            <div class="w-calc-150-px flex flex-col gap-2">
              <div class="flex flex-row gap-2">
                <div class="w-full">Title</div>

                <div class="w-20 flex items-center gap-1">
                  Result
                  <n-popover trigger="hover">
                    <template #trigger>
                      <n-icon size="14" :component="QuestionCircleRegular" />
                    </template>
                    <span>{{ Quiz.quiz_value }}</span>
                  </n-popover>
                </div>

                <n-button class="opacity-0"
                  ><n-icon size="12"><Minus /></n-icon
                ></n-button>
                <n-button class="opacity-0"
                  ><n-icon size="12" class="cursor-pointer"><Plus /></n-icon
                ></n-button>
              </div>
            </div>
          </div>
          <div class="flex flex-row">
            <div class="w-150-px">&nbsp</div>
            <div class="w-calc-150-px flex flex-col gap-2">
              <div
                v-for="(miniItem, miniIndex) in question.answers"
                :key="index"
                class="flex flex-row gap-2"
              >
                <div class="w-full">
                  <n-input v-model:value="miniItem.title" />
                </div>
                <div class="w-20">
                  <n-switch v-model:value="miniItem.result" />
                </div>
                <n-button @click="removeChildAnswer(index, miniIndex)"
                  ><n-icon size="12"><Minus /></n-icon
                ></n-button>
                <n-button @click="addAnswer(index)"
                  ><n-icon size="12" class="cursor-pointer"><Plus /></n-icon
                ></n-button>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </n-card>
  </n-card>
</template>
