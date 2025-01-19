<template>
  <UModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Invite New Student</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="closeModal"
          />
        </div>
      </template>

      <UForm :schema="inviteStudentSchema" :state="form" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup label="Email Address" name="email">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Enter student email"
            />
          </UFormGroup>

          <UFormGroup label="Full Name" name="name">
            <UInput
              v-model="form.name"
              placeholder="Enter student name"
            />
          </UFormGroup>

          <UFormGroup label="Grade" name="grade">
            <GradeSelector
              v-model="form.grade"
              placeholder="Select grade"
            />
          </UFormGroup>
        </div>

        <div class="flex justify-end gap-3 mt-5">
          <UButton type="button" color="gray" @click="closeModal">
            Cancel
          </UButton>
          <UButton type="submit" color="primary" :loading="loading">
            Send Invitation
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import GradeSelector from './GradeSelector.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'invite'])

const loading = ref(false)
const toast = useToast()

const form = ref({
  email: "",
  name: "",
  grade: "",
})

const inviteStudentSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, 'Name is required'),
  grade: z.string().min(1, 'Grade is required'),
})

const closeModal = () => {
  form.value = {
    email: "",
    name: "",
    grade: "",
  }
  emit('update:modelValue', false)
}

const onSubmit = async (event: any) => {
  try {
    loading.value = true
    // TODO: Implement API call
    emit('invite', event.data)
    toast.add({
      title: "Success",
      description: "Student invitation sent successfully",
      color: "green",
    })
    closeModal()
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "red",
    })
  } finally {
    loading.value = false
  }
}
</script>
