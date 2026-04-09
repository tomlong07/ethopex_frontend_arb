<script setup lang="ts">
import Copy from '@/assets/icons/Copy.vue'

const leftText = ref('')
const rightText = ref('')

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const charDiff = (a: string, b: string) => {
  const n = a.length,
    m = b.length
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0)
  )

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const ops: { type: 'eq' | 'del' | 'ins'; ch: string }[] = []
  let i = 0,
    j = 0

  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: 'eq', ch: a[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'del', ch: a[i++] })
    } else {
      ops.push({ type: 'ins', ch: b[j++] })
    }
  }

  while (i < n) ops.push({ type: 'del', ch: a[i++] })
  while (j < m) ops.push({ type: 'ins', ch: b[j++] })

  return ops
}

const highlightCharDiff = (a: string, b: string) => {
  const ops = charDiff(a, b)
  let leftHtml = '',
    rightHtml = ''
  let delBuf = '',
    insBuf = ''

  const flush = () => {
    if (delBuf) {
      leftHtml += `<span class="tc-diff-remove">${escapeHtml(delBuf)}</span>`
      delBuf = ''
    }
    if (insBuf) {
      rightHtml += `<span class="tc-diff-add">${escapeHtml(insBuf)}</span>`
      insBuf = ''
    }
  }

  for (const op of ops) {
    if (op.type === 'eq') {
      flush()
      const x = escapeHtml(op.ch)
      leftHtml += x
      rightHtml += x
    } else if (op.type === 'del') {
      delBuf += op.ch
    } else {
      insBuf += op.ch
    }
  }
  flush()
  return { leftHtml, rightHtml }
}

const lineDiff = (a: string[], b: string[]) => {
  const n = a.length,
    m = b.length
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0)
  )

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const ops: { type: 'eq' | 'del' | 'ins'; left?: string; right?: string }[] =
    []
  let i = 0,
    j = 0

  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: 'eq', left: a[i], right: b[j] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'del', left: a[i++] })
    } else {
      ops.push({ type: 'ins', right: b[j++] })
    }
  }

  while (i < n) ops.push({ type: 'del', left: a[i++] })
  while (j < m) ops.push({ type: 'ins', right: b[j++] })

  return ops
}

const leftView = ref<
  { text: string; html: string; ln: number | null; type: string }[]
>([])
const rightView = ref<
  { text: string; html: string; ln: number | null; type: string }[]
>([])

const compare = () => {
  const A = leftText.value.replace(/\r/g, '').split('\n')
  const B = rightText.value.replace(/\r/g, '').split('\n')

  if (A.length === 1 && A[0] === '' && B.length === 1 && B[0] === '') {
    leftView.value = []
    rightView.value = []
    return
  }

  const ops = lineDiff(A, B)
  leftView.value = []
  rightView.value = []

  let li = 1,
    ri = 1
  let i = 0

  while (i < ops.length) {
    const op = ops[i]

    if (op.type === 'del' && i + 1 < ops.length && ops[i + 1].type === 'ins') {
      const aLine = op.left ?? ''
      const bLine = ops[i + 1].right ?? ''
      const { leftHtml, rightHtml } = highlightCharDiff(aLine, bLine)

      leftView.value.push({
        text: aLine,
        html: leftHtml,
        ln: li++,
        type: 'modified',
      })
      rightView.value.push({
        text: bLine,
        html: rightHtml,
        ln: ri++,
        type: 'modified',
      })
      i += 2
    } else if (op.type === 'eq') {
      const text = op.left ?? ''
      leftView.value.push({
        text,
        html: escapeHtml(text),
        ln: li++,
        type: 'equal',
      })
      rightView.value.push({
        text: op.right ?? '',
        html: escapeHtml(op.right ?? ''),
        ln: ri++,
        type: 'equal',
      })
      i++
    } else if (op.type === 'del') {
      const text = op.left ?? ''
      leftView.value.push({
        text,
        html: `<span class="tc-diff-remove">${escapeHtml(text)}</span>`,
        ln: li++,
        type: 'remove',
      })
      rightView.value.push({ text: '', html: '', ln: null, type: 'empty' })
      i++
    } else {
      const text = op.right ?? ''
      leftView.value.push({ text: '', html: '', ln: null, type: 'empty' })
      rightView.value.push({
        text,
        html: `<span class="tc-diff-add">${escapeHtml(text)}</span>`,
        ln: ri++,
        type: 'add',
      })
      i++
    }
  }
}

const summary = computed(() => {
  const A = leftText.value.replace(/\r/g, '').split('\n')
  const B = rightText.value.replace(/\r/g, '').split('\n')
  const ops = lineDiff(A, B)

  let add = 0,
    remove = 0,
    equal = 0
  ops.forEach((op) => {
    if (op.type === 'ins') add++
    else if (op.type === 'del') remove++
    else equal++
  })
  return { add, remove, equal }
})

const clearCompare = () => {
  leftText.value = ''
  rightText.value = ''
  leftView.value = []
  rightView.value = []
}

const getVisibleText = (side: 'A' | 'B'): string => {
  if (!leftView.value.length)
    return side === 'A' ? leftText.value : rightText.value
  const view = side === 'A' ? leftView.value : rightView.value
  return view
    .filter((r) => r.ln !== null)
    .map((r) => r.text)
    .join('\n')
}

const copyLeft = async () => {
  await navigator.clipboard.writeText(getVisibleText('A'))
  window.message?.success?.('Copied!')
}

const copyRight = async () => {
  await navigator.clipboard.writeText(getVisibleText('B'))
  window.message?.success?.('Copied!')
}
</script>

<template>
  <div>
    <div
      v-if="leftView.length"
      class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 mb-4"
    >
      <div class="border rounded-lg flex flex-col">
        <div
          class="bg-gray-100 px-3 py-2 font-semibold border-b flex items-center justify-between"
        >
          <span>A</span>
          <n-button size="small" text @click="copyLeft">
            <template #icon><Copy /></template>
          </n-button>
        </div>

        <div class="font-mono text-sm p-2">
          <div
            v-for="(row, idx) in leftView"
            :key="'LA' + idx"
            class="grid grid-cols-[auto_1fr] gap-2 px-2 py-0.5 items-start"
            :class="row.type === 'equal' ? 'opacity-85' : ''"
          >
            <div class="gutter">{{ row.ln ?? '' }}</div>
            <pre
              class="whitespace-pre-wrap break-words"
              v-html="row.html"
            ></pre>
          </div>
        </div>
      </div>

      <div class="border rounded-lg flex flex-col">
        <div
          class="bg-gray-100 px-3 py-2 font-semibold border-b flex items-center justify-between"
        >
          <span>B</span>
          <n-button size="small" text @click="copyRight">
            <template #icon><Copy /></template>
          </n-button>
        </div>

        <div class="font-mono text-sm p-2">
          <div
            v-for="(row, idx) in rightView"
            :key="'RB' + idx"
            class="grid grid-cols-[auto_1fr] gap-2 px-2 py-0.5 items-start"
            :class="row.type === 'equal' ? 'opacity-85' : ''"
          >
            <div class="gutter">{{ row.ln ?? '' }}</div>
            <pre
              class="whitespace-pre-wrap break-words"
              v-html="row.html"
            ></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="justify-center flex mb-4">
      <n-space class="mt-4">
        <n-button type="primary" @click="compare">Compare</n-button>
        <n-button tertiary @click="clearCompare">Clear</n-button>
        <n-tag :bordered="false" class="h-9">
          +{{ summary.add }} / -{{ summary.remove }} / ={{ summary.equal }}
          <span v-if="leftView.length">
            • A: {{ leftView.filter((r) => r.ln !== null).length }} • B:
            {{ rightView.filter((r) => r.ln !== null).length }}
          </span>
        </n-tag>
      </n-space>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <n-input
        v-model:value="leftText"
        type="textarea"
        :rows="12"
        placeholder="Text A"
      />
      <n-input
        v-model:value="rightText"
        type="textarea"
        :rows="12"
        placeholder="Text B"
      />
    </div>
  </div>
</template>

<style scoped>
.gutter {
  text-align: right;
  opacity: 0.6;
  user-select: none;
}

:deep(.tc-diff-add),
:deep(.tc-diff-remove) {
  white-space: inherit;
  background-color: rgba(254, 240, 138, 0.6);
  color: inherit;
}

:deep(.tc-diff-remove) {
  background-color: rgba(191, 225, 253, 0.6);
}
</style>
