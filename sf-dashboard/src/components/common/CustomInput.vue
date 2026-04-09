<script setup lang="ts">
import { sizeClasses } from "@/utils/sizeClass";
import { toRefs } from "vue";

interface IInputProps {
  modelValue?: string | number;
  label?: string;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}

const props = withDefaults(defineProps<IInputProps>(), {
  modelValue: "",
  label: "",
  size: "sm",
  placeholder: "",
  disabled: false,
  type: "text",
});

const { label, disabled, type, modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="relative w-full font-inter">
    <input
      :id="label"
      :disabled="disabled"
      :type="type"
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
      :class="[
        'peer w-full rounded-md border bg-transparent transition px-4',
        sizeClasses[size],
      ]"
    />
    <label
      v-if="label"
      :for="label"
      class="absolute left-3 -top-2.5 text-xs text-gray-400 bg-white px-1 transition-all peer-focus:-top-3"
    >
      {{ label }}
      <span class="text-red-500 text-sm">*</span>
    </label>
  </div>
</template>
