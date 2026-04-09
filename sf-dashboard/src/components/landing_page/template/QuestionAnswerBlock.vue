<script setup lang="ts">
import { Question_Answer_Block } from '@/types/components/landing'

import Minus from '@/assets/icons/Minus.vue'
import Plus from '@/assets/icons/Plus.vue'

const props = defineProps<{
  questionBlocks?: Question_Answer_Block[]
}>()

const expandedItems = ref<number[]>([])

const questionBlockData = computed(() => {
  return props.questionBlocks || []
})

const questionBlockLength = computed(() => {
  return questionBlockData.value.length
})

const hasQuestionBlock = computed(() => {
  return props.questionBlocks && Array.isArray(props.questionBlocks)
})

const toggleItem = (index: number) => {
  const currentIndex = expandedItems.value.indexOf(index)
  if (currentIndex > -1) {
    expandedItems.value.splice(currentIndex, 1)
  } else {
    expandedItems.value.push(index)
  }
}
</script>

<template>
  <div class="app-card">
    <template v-if="hasQuestionBlock && questionBlockLength > 0">
      <div class="faq-container">
        <div
          v-for="(item, index) in questionBlockData"
          :key="index"
          class="faq-item"
          :class="{ 'faq-item--expanded': expandedItems.includes(index) }"
        >
          <!-- Header với icon và question -->
          <div class="faq-header" @click="toggleItem(index)">
            <div class="faq-icon">
              <Minus v-if="expandedItems.includes(index)" class="icon" />
              <Plus v-else class="icon" />
            </div>
            <div class="faq-question">
              {{ item.question }}
            </div>
          </div>

          <!-- Answer content -->
          <div v-if="expandedItems.includes(index)" class="faq-answer">
            <div class="answer-content">
              {{ item.answer }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="bg-red-600 text-white p-2">
        NO QUESTION BLOCKS FOUND!<br />
        Debug: hasQuestionBlock={{ hasQuestionBlock }}, length={{
          questionBlockLength
        }}
      </div>
    </template>
  </div>
</template>

<style scoped>
.app-card {
  background: #fff;
  padding: 5px;
  max-width: 800px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.faq-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.faq-item {
  transition: all 0.2s ease;
  margin-bottom: 10px;
}

.faq-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: rgb(248, 248, 248);
  border-radius: 5px;
}

.faq-header:hover {
  background-color: #f0f0f0;
}

.icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: color 0.2s ease;
}

.faq-question {
  flex: 1;
  font-size: 16px;
  color: #1f2937;
  line-height: 1.5;
}

.faq-answer {
  margin: 10px 0;
  padding: 0 20px;
  animation: slideDown 0.2s ease-out;
}

.answer-content {
  padding: 12px 16px;
  background-color: #fff;
  border-left: 3px solid #135219;

  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .app-card {
    padding: 16px;
  }

  .faq-header {
    padding: 14px 0;
  }

  .faq-question {
    font-size: 15px;
  }

  .answer-content {
    font-size: 13px;
    padding: 10px 12px;
  }

  .faq-answer {
    padding: 0 24px 14px 0;
  }
}
</style>
