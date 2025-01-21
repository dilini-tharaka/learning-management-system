<template>
  <UModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Invite New Moderator</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="closeModal"
          />
        </div>
      </template>

      <UForm :schema="inviteModeratorSchema" :state="form" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup label="Email Address" name="email">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Enter moderator email"
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
import { z } from "zod";
import { $apiFetch } from "~~/app/composables/useApiFetch";
import { useApiError } from "~~/app/composables/useApiError";
import type { FormSubmitEvent } from "#ui/types";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue", "invite"]);
const loading = ref(false);
const toast = useToast();
const { handle } = useApiError();

const form = ref({
  email: "",
});

const inviteModeratorSchema = z.object({
  email: z.string().email("Valid email is required"),
});

const closeModal = () => {
  form.value = {
    email: "",
  };
  emit("update:modelValue", false);
};

const onSubmit = async (event: FormSubmitEvent<typeof form.value>) => {
  try {
    loading.value = true;

    await $apiFetch("/api/invitation", {
      method: "POST",
      body: {
        email: event.data.email,
        role: "MODERATOR",
      },
    });

    toast.add({
      title: "Success",
      description: "Moderator invitation sent successfully",
      color: "green",
    });
    closeModal();
    emit("invite", event.data);
  } catch (error: any) {
    handle(error, { title: "Error" });
  } finally {
    loading.value = false;
  }
};
</script>
