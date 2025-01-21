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
            <ConsoleStudentsGradeSelector
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
import type { FormSubmitEvent } from "#ui/types"

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'invite'])
const loading = ref(false)
const toast = useToast()
const { handle } = useApiError()

const form = ref({
  email: "",
  name: "",
  grade: null as number | null,
})

const inviteStudentSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, 'Name is required'),
  grade: z.number({ required_error: 'Grade is required' }).int().min(6).max(11)
})

const closeModal = () => {
  form.value = {
    email: "",
    name: "",
    grade: null,
  }
  emit('update:modelValue', false)
}

const onSubmit = async (event: FormSubmitEvent<typeof form.value>) => {
  try {
    loading.value = true
    
    // Ensure grade is a number before sending
    const grade = Number(event.data.grade)
    
    await $apiFetch('/api/invitation', {
      method: 'POST',
      body: {
        email: event.data.email,
        role: 'STUDENT',
        metadata: {
          studentName: event.data.name,
          studentGrade: grade
        }
      }
    })

    toast.add({
      title: "Success",
      description: "Student invitation sent successfully",
      color: "green",
    })
    closeModal()
  } catch (error: any) {
    handle(error, { title: 'Error' })
  } finally {
    loading.value = false
  }
}
</script>
