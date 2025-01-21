<template>
  <USelect
    v-model="localValue"
    :options="formattedGrades"
    :placeholder="placeholder"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number | null;
  placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  // Convert the string value from USelect to number
  set: (value) => emit("update:modelValue", value ? Number(value) : null),
});

const grades = [6, 7, 8, 9, 10, 11];

const formattedGrades = computed(() => 
  grades.map(grade => ({
    label: `Grade ${grade}`,
    value: grade.toString(), // Convert to string for USelect
  }))
);
</script>
