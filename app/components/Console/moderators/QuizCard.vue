<template>
  <UCard class="group border dark:border-gray-800 animate-fade-in" :class="{ 'opacity-75 scale-98': deleting }">
    <div class="relative overflow-hidden -m-4 mb-4">
      <div
        :class="`h-40 rounded-md bg-gradient-to-r ${gradient} group-hover:scale-105 transition-transform duration-300 flex items-center justify-center relative`">
        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Icon name="i-heroicons-document-text" class="w-20 h-20 text-white/90 relative" />
      </div>
      <UBadge :color="getStatusColor(quiz.status)" :variant="quiz.status === 'Active' ? 'solid' : 'soft'"
        class="absolute top-4 right-4 shadow-lg" size="lg">
        {{ quiz.status }}
      </UBadge>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-semibold group-hover:text-primary-500 transition-colors line-clamp-2">
        {{ quiz.title }}
      </h3>

      <div class="flex flex-wrap justify-between items-center">
        <div class="flex justify-center gap-3">
        <UBadge icon="i-heroicons-document-text" variant="subtle" class="px-3 py-1">
          {{ quiz.questions }} Questions
        </UBadge>
        <UBadge icon="i-heroicons-clock" variant="subtle" class="px-3 py-1">
          {{ quiz.timeLimit }} mins
        </UBadge>
        </div>
        <UDropdown :items="getActionItems" :popper="{
          placement: 'bottom-end',
          strategy: 'fixed'
        }">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal"
            class="hover:bg-gray-100 dark:hover:bg-zinc-800" />
        </UDropdown>
      </div>

      <div class="flex items-center justify-between pt-4 border-t dark:border-gray-700">
        <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Icon name="i-heroicons-clock" class="w-4 h-4" />
          <span>{{ formatDate(quiz.updatedDays) }}</span>
        </div>
        <div class="flex gap-2">
          <UTooltip text="Edit Quiz">
            <UButton color="primary" variant="ghost" icon="i-heroicons-pencil-square" @click="$emit('edit', quiz)" />
          </UTooltip>
          <UTooltip text="Delete Quiz">
            <UButton color="red" variant="ghost" icon="i-heroicons-trash" @click="$emit('delete', quiz)" />
          </UTooltip>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Quiz {
  id: number;
  title: string;
  questions: number;
  timeLimit: number;
  status: string;
  updatedDays: number;
}

const props = defineProps<{
  quiz: Quiz;
  gradient: string;
  deleting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'edit', quiz: Quiz): void;
  (e: 'delete', quiz: Quiz): void;
  (e: 'status-change', quiz: Quiz, status: 'Active' | 'Draft'): void;
}>();

function formatDate(days: number) {
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

const getActionItems = computed(() => {
  const mainActions = [
    {
      label: 'Set as Active',
      icon: 'i-heroicons-check-circle',
      click: () => emit('status-change', props.quiz, 'Active'),
      disabled: props.quiz.status === 'Active'
    },
    {
      label: 'Move to Draft',
      icon: 'i-heroicons-document-text',
      click: () => emit('status-change', props.quiz, 'Draft'),
      disabled: props.quiz.status === 'Draft'
    },
  ];

  const dangerousActions = [
    {
      label: 'Delete Quiz',
      icon: 'i-heroicons-trash',
      click: () => emit('delete', props.quiz),
      class: 'text-red-500 hover:text-red-600'
    }
  ];

  return [
    mainActions.filter(action => !action.disabled),
    dangerousActions
  ];
});

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'active': return 'green';
    case 'draft': return 'yellow';
    case 'archived': return 'gray';
    default: return 'primary';
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
  animation-fill-mode: both;
}
</style>
