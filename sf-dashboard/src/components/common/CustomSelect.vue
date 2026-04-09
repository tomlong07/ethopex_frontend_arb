<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, toRefs, computed, watch } from "vue";
import CustomInput from "./CustomInput.vue";
import Close from "@/assets/icons/Close.vue";
import ChevronDownSelect from "@/assets/icons/ChevronDownSelect.vue";
import CheckSelected from "@/assets/icons/CheckSelected.vue";
import CheckIcon from "@/assets/icons/CheckIcon.vue";
import { sizeClasses } from "@/utils/sizeClass";

interface IOption {
  [key: string]: string | number;
}

interface ISelectItem {
  name: string | number;
  value: string | number | undefined;
  removable: boolean;
}

interface IMultiSelectProps {
  options: IOption[];
  label?: string;
  modelValue?: (string | number)[] | string | number | null;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  multiple?: boolean;
  filterable?: boolean;
  fields?: [string, string];
  disabled?: boolean;
}

type SelectedType = (string | number)[] | string | number | null;

// !! Props & Emit
const props = withDefaults(defineProps<IMultiSelectProps>(), {
  label: "",
  modelValue: () => [],
  placeholder: "",
  size: "sm",
  multiple: false,
  filterable: false,
  fields: () => ["name", "value"],
  disabled: false,
});

const {
  options,
  modelValue,
  placeholder,
  size,
  multiple,
  filterable,
  fields,
  disabled,
} = toRefs(props);

const emit = defineEmits<{
  (e: "update:modelValue", value: (string | number)[] | string | number | null): void;
}>();

// !! State
const selectEventBus = window as any;
const isOpen = ref(false);
const isHovered = ref(false);
const multiSelectRef = ref<HTMLElement | null>(null);
const isAllSelect = ref(false);
const searchQuery = ref("");

const selectedItems = ref<SelectedType>(
  multiple.value
    ? Array.isArray(modelValue.value)
      ? [...(modelValue.value as (string | number)[])]
      : []
    : (modelValue.value as string | number | null)
);

// !! Lifecycle hook
const labelKey = computed(() => fields.value[0]);
const valueKey = computed(() => fields.value[1]);

watch(modelValue, (val) => {
  selectedItems.value = multiple.value
    ? Array.isArray(val)
      ? [...(val as (string | number)[])]
      : []
    : (val as string | number | null);
});

const filteredOptions = computed(() =>
  options.value.filter((item) =>
    String(item[labelKey.value]).toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  updateIsAllSelect();
});

onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));

// !! Func
const toggleDropdown = () => {
  if (disabled.value) return;
  if (!isOpen.value) {
    selectEventBus.dispatchEvent(new CustomEvent("close-all-select"));
  }
  isOpen.value = !isOpen.value;
};

const toggleItem = (item: IOption | { [key: string]: any }) => {
  const itemValue = item[valueKey.value];

  if (itemValue === "__all__") {
    if (isAllSelect.value) {
      selectedItems.value = [];
    } else {
      selectedItems.value = options.value.map((opt) => opt[valueKey.value]);
    }
  } else {
    if (multiple.value) {
      const arr = selectedItems.value as (string | number)[];
      const index = arr.indexOf(itemValue);
      if (index === -1) {
        arr.push(itemValue);
      } else {
        arr.splice(index, 1);
      }
    } else {
      selectedItems.value = itemValue;
      isOpen.value = false;
    }
  }

  updateIsAllSelect();

  emit(
    "update:modelValue",
    multiple.value
      ? [...(selectedItems.value as (string | number)[])]
      : selectedItems.value
  );
};

const updateIsAllSelect = () => {
  isAllSelect.value =
    multiple.value &&
    Array.isArray(selectedItems.value) &&
    selectedItems.value.length === options.value.length;
};

const removeItem = (val?: string | number) => {
  if (multiple.value) {
    const arr = selectedItems.value as (string | number)[];
    if (!arr.length) return;
    const targetValue = val ?? arr[0];
    selectedItems.value = arr.filter((item) => item !== targetValue);
  } else {
    selectedItems.value = null;
  }

  updateIsAllSelect();

  emit(
    "update:modelValue",
    multiple.value
      ? [...(selectedItems.value as (string | number)[])]
      : selectedItems.value
  );
};

const clearAll = () => {
  if (multiple.value) {
    selectedItems.value = [];
    emit("update:modelValue", []);
  } else {
    selectedItems.value = null;
    emit("update:modelValue", null);
  }

  updateIsAllSelect();
};

const isSelected = (item: IOption) =>
  multiple.value
    ? (selectedItems.value as (string | number)[]).includes(item[valueKey.value])
    : selectedItems.value === item[valueKey.value];

const getLabel = (val: string | number) => {
  return (
    options.value.find((opt) => opt[valueKey.value] === val)?.[labelKey.value] ?? val
  );
};

const handleClickOutside = (event: MouseEvent) => {
  if (multiSelectRef.value && !multiSelectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const displaySelected = computed<ISelectItem[]>(() => {
  if (multiple.value) {
    const arr = selectedItems.value as (string | number)[];
    const count = arr.length;
    if (!count) return [];

    const firstItem: ISelectItem = {
      name: getLabel(arr[0]),
      value: arr[0],
      removable: true,
    };

    if (count === 1) {
      return [firstItem];
    }

    const moreItem: ISelectItem = {
      name: `+${count - 1}`,
      value: undefined,
      removable: false,
    };

    return [firstItem, moreItem];
  } else {
    if (!selectedItems.value) return [];
    return [
      {
        name: getLabel(selectedItems.value as string | number),
        value: selectedItems.value as string | number,
        removable: true,
      },
    ];
  }
});
</script>
<template>
  <div class="space-y-6">
    <div class="relative" ref="multiSelectRef">
      <div
        tabindex="0"
        @click="toggleDropdown"
        @mouseenter="!disabled && (isHovered = true)"
        @mouseleave="!disabled && (isHovered = false)"
        :class="[
          'pl-4 pr-2 flex peer items-center w-full rounded-lg border shadow-theme-xs placeholder:text-gray-400',
          sizeClasses[size],
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-transparent cursor-text',
          isOpen ? 'text-gray-800' : '',
        ]"
      >
        <label
          v-if="label"
          :for="label"
          :class="[
            'absolute left-4 text-xs text-gray-400 px-1 transition-all bg-white',
            isOpen ? '-top-3.5 text-xs text-gray-600' : '-top-3 text-gray-400',
          ]"
        >
          {{ label }}
          <span class="!text-red-500 text-sm">*</span>
        </label>

        <span v-if="displaySelected.length === 0" class="text-gray-400">
          {{ placeholder }}
        </span>

        <div class="flex flex-wrap items-center flex-auto gap-2">
          <template v-if="multiple">
            <div
              v-for="(item, idx) in displaySelected"
              :key="idx"
              class="group flex items-center justify-center h-[22px] rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:border-gray-200"
            >
              <span>{{ item.name }}</span>
              <button
                v-if="item.removable"
                @click.stop="removeItem(item.value as string | number)"
                class="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-400"
                aria-label="Remove item"
              >
                <Close />
              </button>
            </div>
          </template>

          <template v-else>
            <span v-if="displaySelected.length" class="text-gray-800">
              {{ displaySelected[0]?.name }}
            </span>
          </template>
        </div>

        <div
          class="ml-auto flex items-center justify-center w-8 h-8 rounded-full border border-transparent"
          :class="{
            'pointer-events-none opacity-50': disabled,
            'border-gray-300 bg-gray-100':
              !disabled && isHovered && displaySelected.length > 0,
          }"
          @click.stop="
            !disabled &&
              (isHovered && displaySelected.length > 0 ? clearAll() : toggleDropdown())
          "
        >
          <template v-if="isHovered && displaySelected.length > 0">
            <Close class="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </template>
          <template v-else>
            <ChevronDownSelect
              class="w-5 h-5 text-gray-800 transition-transform duration-300"
              :class="{ 'transform rotate-180': isOpen }"
            />
          </template>
        </div>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isOpen"
          class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-xl"
        >
          <div v-if="filterable" class="p-2 border-b border-gray-200">
            <CustomInput v-model="searchQuery" placeholder="Search..." size="sm" />
          </div>

          <ul
            class="overflow-y-auto custom-scrollbar max-h-60"
            role="listbox"
            :aria-multiselectable="multiple"
          >
            <li
              v-if="multiple && filteredOptions.length > 0"
              class="relative flex items-center w-full px-3 py-2 border-b border-gray-200 first:rounded-t-lg hover:bg-gray-100"
              :class="{ 'bg-gray-50': isAllSelect }"
              role="option"
              :aria-selected="isAllSelect"
            >
              <label class="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  :checked="isAllSelect"
                  @change.stop="
                    () => toggleItem({ [fields[0]]: 'All', [fields[1]]: '__all__' })
                  "
                  class="hidden peer"
                />
                <span
                  class="w-5 h-5 mr-2 flex items-center justify-center rounded-md border border-gray-300 peer-checked:bg-black peer-checked:border-brand-500 hover:border-brand-500 peer-checked:hover:border-brand-500 transition-colors"
                >
                  <CheckIcon v-if="isAllSelect" />
                </span>
                <span class="grow">All</span>
              </label>
            </li>

            <li
              v-for="item in filteredOptions"
              :key="item[fields[1]]"
              @click="toggleItem(item)"
              class="relative flex items-center w-full px-3 py-2 border-b border-gray-200 cursor-pointer last:rounded-b-lg last:border-b-0 hover:bg-gray-100"
              :class="{ 'bg-gray-50': isSelected(item) }"
              role="option"
              :aria-selected="isSelected(item)"
            >
              <span class="grow">{{ item[fields[0]] }}</span>
              <CheckSelected v-if="isSelected(item)" class="w-5 h-5 text-gray-400" />
            </li>

            <li
              v-if="filteredOptions.length === 0"
              class="flex items-center justify-center px-3 py-6 text-sm text-gray-500"
            >
              No data
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
