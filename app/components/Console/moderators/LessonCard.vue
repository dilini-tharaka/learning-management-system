<template>
  <UCard class="group border dark:border-gray-800 animate-fade-in">
    <!-- Card Header -->
    <div class="flex items-center justify-between mb-4 pb-4 border-b dark:border-gray-800">
      <div class="flex items-center gap-3">
        <div :class="`w-10 h-10 rounded-lg flex items-center justify-center ${getLevelBg(lesson.level)}`">
          <Icon :name="getLevelIcon(lesson.level)" class="w-5 h-5 text-white" />
        </div>
        <div>
          <UBadge
            :color="lesson.status === 'Published' ? 'green' : 'yellow'"
            :variant="lesson.status === 'Published' ? 'solid' : 'soft'"
            size="sm"
            class="mb-1"
          >
            <div class="flex items-center gap-1">
              <Icon 
                :name="lesson.status === 'Published' ? 'i-heroicons-globe-americas' : 'i-heroicons-pencil-square'" 
                class="w-3 h-3" 
              />
              {{ lesson.status }}
            </div>
          </UBadge>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDate(lesson.updatedDays) }}
          </p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex items-center gap-2">
        <UTooltip :text="lesson.status === 'Published' ? 'View Lesson' : 'Continue Editing'">
          <UButton
            :color="lesson.status === 'Published' ? 'gray' : 'primary'"
            variant="ghost"
            :icon="lesson.status === 'Published' ? 'i-heroicons-eye' : 'i-heroicons-pencil-square'"
            size="xs"
            @click="$emit(lesson.status === 'Published' ? 'preview' : 'edit', lesson)"
          />
        </UTooltip>
        <UDropdown
          :items="getActionItems"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal"
            size="xs"
          />
        </UDropdown>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-4">
      <div>
        <h3 class="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
          {{ lesson.title }}
        </h3>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {{ lesson.description }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <div class="flex items-center gap-2 mb-1">
            <Icon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Duration</span>
          </div>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ formatDuration(lesson.duration) }}
          </p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <div class="flex items-center gap-2 mb-1">
            <Icon :name="getCategoryIcon(lesson)" class="w-4 h-4 text-gray-400" />
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Category</span>
          </div>
          <p class="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
            Web Development
          </p>
        </div>
      </div>

      <!-- Progress or Actions -->
      <div class="mt-4 pt-4 border-t dark:border-gray-800">
        <div v-if="lesson.status === 'Published'" class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex -space-x-2">
              <div v-for="i in 3" :key="i" class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800">
                <Icon name="i-heroicons-user" class="w-full h-full p-1 text-gray-500" />
              </div>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">12 enrolled</span>
          </div>
          <UButton
            color="primary"
            variant="solid"
            icon="i-heroicons-play-circle"
            size="sm"
            @click="$emit('preview', lesson)"
          >
            Start
          </UButton>
        </div>
        <div v-else class="flex justify-between items-center">
          <span class="text-sm text-gray-500 dark:text-gray-400">Draft • Not published yet</span>
          <UButton
            color="primary"
            variant="solid"
            icon="i-heroicons-arrow-up-circle"
            size="sm"
            @click="$emit('publish', lesson)"
          >
            Publish
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Lesson } from '@/types/lesson';

const props = defineProps<{
  lesson: Lesson;
}>();

const emit = defineEmits<{
  (e: 'edit', lesson: Lesson): void;
  (e: 'delete', lesson: Lesson): void;
  (e: 'preview', lesson: Lesson): void;
  (e: 'publish', lesson: Lesson): void;
  (e: 'unpublish', lesson: Lesson): void;
  (e: 'duplicate', lesson: Lesson): void;
}>();

const getActionItems = computed(() => {
  const mainActions = [
    {
      label: 'Duplicate',
      icon: 'i-heroicons-document-duplicate',
      click: () => emit('duplicate', props.lesson)
    }
  ];

  if (props.lesson.status === 'Published') {
    mainActions.unshift(
      {
        label: 'Edit',
        icon: 'i-heroicons-pencil-square',
        click: () => emit('edit', props.lesson)
      },
      {
        label: 'Unpublish',
        icon: 'i-heroicons-arrow-down-circle',
        click: () => emit('unpublish', props.lesson)
      }
    );
  } else {
    mainActions.unshift({
      label: 'Publish',
      icon: 'i-heroicons-arrow-up-circle',
      click: () => emit('publish', props.lesson),
      class: 'text-primary-500'
    });
  }

  const dangerActions = [
    {
      label: 'Delete',
      icon: 'i-heroicons-trash',
      click: () => emit('delete', props.lesson),
      class: 'text-red-500 hover:text-red-600'
    }
  ];

  return [mainActions, dangerActions];
});

function getLevelIcon(level: string): string {
  switch (level) {
    case 'Beginner': return 'i-heroicons-sparkles';
    case 'Intermediate': return 'i-heroicons-trophy';
    case 'Advanced': return 'i-heroicons-fire';
    default: return 'i-heroicons-sparkles';
  }
}

function getLevelColor(level: string): string {
  switch (level) {
    case 'Beginner': return 'text-green-500';
    case 'Intermediate': return 'text-yellow-500';
    case 'Advanced': return 'text-red-500';
    default: return 'text-gray-500';
  }
}

function formatDate(days: number): string {
  if (days === 0) return 'Updated today';
  if (days === 1) return 'Updated yesterday';
  if (days < 7) return `Updated ${days} days ago`;
  if (days < 30) return `Updated ${Math.floor(days / 7)} weeks ago`;
  return `Updated ${Math.floor(days / 30)} months ago`;
}

function getLevelBg(level: string): string {
  switch (level) {
    case 'Beginner': return 'bg-gradient-to-br from-green-400 to-green-600';
    case 'Intermediate': return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
    case 'Advanced': return 'bg-gradient-to-br from-red-400 to-red-600';
    default: return 'bg-gradient-to-br from-gray-400 to-gray-600';
  }
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function getCategoryIcon(lesson: Lesson): string {
  // You can add more categories and icons
  return 'i-heroicons-code-bracket-square';
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
