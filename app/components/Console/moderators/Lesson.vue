<template>
  <div class="min-h-screen space-y-8">
    <!-- Header with Stats -->
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Lesson Management
          </h1>
          <p class="mt-2 text-gray-600 dark:text-zinc-400">
            Create and manage course lessons and materials
          </p>
        </div>
        <UButton
          size="lg"
          color="primary"
          icon="i-heroicons-plus-circle"
          @click="showModal = true"
        >
          Create Lesson
        </UButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard
          v-for="stat in lessonStats"
          :key="stat.name"
          class="hover:shadow-lg transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-zinc-400">
                {{ stat.name }}
              </p>
              <p class="mt-2 text-3xl font-semibold">{{ stat.value }}</p>
              <p
                :class="[
                  'mt-2 text-sm',
                  stat.change > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400',
                ]"
              >
                <span
                  >{{ stat.change > 0 ? "↑" : "↓" }}
                  {{ Math.abs(stat.change) }}%</span
                >
                <span class="text-gray-600 dark:text-zinc-400 ml-1"
                  >vs last month</span
                >
              </p>
            </div>
            <div
              :class="`w-12 h-12 flex items-center justify-center rounded-lg border ${stat.bgColor} ${stat.borderColor}`"
            >
              <Icon :name="stat.icon" :class="`w-6 h-6 ${stat.iconColor}`" />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Search and Filters -->
    <LessonFilters
      @filter-change="handleFilterChange"
      @create="showModal = true"
    />

    <!-- Lesson Grid -->
    <div class="relative">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <LessonCard
          v-for="(lesson, index) in filteredLessons"
          :key="lesson.id"
          :lesson="lesson"
          :style="{ animationDelay: index * 50 + 'ms' }"
          @edit="handleEdit"
          @delete="openDeleteModal"
          @preview="handlePreview"
          @publish="handlePublish"
          @unpublish="handleUnpublish"
          @duplicate="handleDuplicate"
        />
      </div>

      <!-- Empty State -->
      <div
        v-if="!filteredLessons.length"
        class="text-center py-12 bg-white dark:bg-gray-800 rounded-xl"
      >
        <div class="flex flex-col items-center gap-4">
          <Icon
            name="i-heroicons-document-text"
            class="w-16 h-16 text-gray-400"
          />
          <div class="space-y-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              No lessons found
            </h3>
            <p class="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Try adjusting your search or filters, or create a new lesson to get started.
            </p>
          </div>
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            @click="showModal = true"
          >
            Create Your First Lesson
          </UButton>
        </div>
      </div>
    </div>

    <!-- Enhanced Pagination -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex flex-col sm:flex-row items-center gap-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Showing 
          <span class="font-medium text-gray-900 dark:text-white">
            {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, totalLessons) }}
          </span> 
          of 
          <span class="font-medium text-gray-900 dark:text-white">{{ totalLessons }}</span>
        </span>
      </div>

      <div class="flex items-center gap-4">
        <USelect
          v-model="itemsPerPage"
          :options="[
            { label: '6 per page', value: 6 },
            { label: '12 per page', value: 12 },
            { label: '24 per page', value: 24 },
          ]"
          size="sm"
        />
        
        <UPagination
          v-if="totalLessons > itemsPerPage"
          v-model="currentPage"
          :total="totalLessons"
          :per-page="itemsPerPage"
          :ui="{
            wrapper: 'gap-1',
            rounded: 'rounded-lg'
          }"
        />
      </div>
    </div>
    <!-- Create/Edit Modal -->
    <UModal v-model="showModal">
      <UCard :ui="{ base: 'w-full max-w-2xl' }">
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ editingLesson ? "Edit Lesson" : "Create Lesson" }}
          </h3>
        </template>

        <form @submit.prevent="handleSave" class="space-y-6">
          <UFormGroup label="Lesson Title" required>
            <UInput v-model="lessonForm.title" placeholder="Enter lesson title" />
          </UFormGroup>

          <UFormGroup label="Description" required>
            <UTextarea
              v-model="lessonForm.description"
              placeholder="Enter lesson description"
              rows="4"
            />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Duration (mins)" required>
              <UInput v-model="lessonForm.duration" type="number" min="1" />
            </UFormGroup>
            <UFormGroup label="Difficulty Level" required>
              <USelect
                v-model="lessonForm.level"
                :options="[
                  { label: 'Beginner', value: 'Beginner' },
                  { label: 'Intermediate', value: 'Intermediate' },
                  { label: 'Advanced', value: 'Advanced' },
                ]"
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Status" required>
            <USelect
              v-model="lessonForm.status"
              :options="[
                { label: 'Published', value: 'Published' },
                { label: 'Draft', value: 'Draft' },
              ]"
            />
          </UFormGroup>
        </form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="soft" @click="showModal = false"
              >Cancel</UButton
            >
            <UButton color="primary" :loading="saving" @click="handleSave">
              {{ editingLesson ? "Save Changes" : "Create Lesson" }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="deleteModalOpen">
      <UCard :ui="{ base: 'w-full' }">
        <template #header>
          <div class="flex items-center gap-3 text-red-600">
            <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6" />
            <h3 class="text-lg font-semibold">Delete Lesson</h3>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete "<span
              class="font-medium text-gray-900 dark:text-white"
              >{{ lessonToDelete?.title }}</span
            >"?
          </p>
          <p class="text-sm text-red-600 dark:text-red-400">
            This action cannot be undone and will remove all associated data.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="closeDeleteModal">
              Cancel
            </UButton>
            <UButton
              color="red"
              icon="i-heroicons-trash"
              :loading="deleting"
              @click="handleDelete"
            >
              Delete Lesson
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Lesson } from "~/types/lesson";
import LessonCard from "./LessonCard.vue";
import LessonFilters from "./LessonFilters.vue";

// Mock data
const mockLessons = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Web Development Fundamentals - Lesson ${i + 1}`,
  description: `Learn the basics of web development in this comprehensive lesson.`,
  duration: 30 + i * 5,
  level: i % 3 === 0 ? "Beginner" : i % 3 === 1 ? "Intermediate" : "Advanced",
  status: i % 2 === 0 ? "Published" : "Draft",
  updatedDays: i,
}));

// State
const currentPage = ref(1);
const itemsPerPage = ref(6);
const showModal = ref(false);
const saving = ref(false);
const deleting = ref(false);
const editingLesson = ref<Lesson | null>(null);
const lessonToDelete = ref<Lesson | null>(null);
const deleteModalOpen = ref(false);
const filters = ref({
  search: "",
  status: "all",
  level: "all",
  sort: "newest",
});

// Lesson Form
const lessonForm = ref({
  title: "",
  description: "",
  duration: 30,
  level: "Beginner",
  status: "Draft" as const,
});

// Lesson statistics
const lessonStats = computed(() => [
  {
    name: "Total Lessons",
    value: mockLessons.length,
    change: 12.5,
    icon: "i-heroicons-book-open",
    bgColor: "bg-primary-100/80 dark:bg-primary-900/30",
    borderColor: "border-primary-200 dark:border-primary-800",
    iconColor: "text-primary-600 dark:text-primary-400",
  },
  {
    name: "Published Lessons",
    value: mockLessons.filter((l) => l.status === "Published").length,
    change: 18.2,
    icon: "i-heroicons-check-circle",
    bgColor: "bg-green-100/80 dark:bg-green-900/30",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    name: "Average Duration",
    value: `${Math.round(mockLessons.reduce((acc, curr) => acc + curr.duration, 0) / mockLessons.length)}m`,
    change: 5.3,
    icon: "i-heroicons-clock",
    bgColor: "bg-orange-100/80 dark:bg-orange-900/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
]);

// Computed properties
const totalLessons = computed(() => mockLessons.length);

const filteredLessons = computed(() => {
  let result = [...mockLessons];

  if (filters.value.search) {
    result = result.filter((lesson) =>
      lesson.title.toLowerCase().includes(filters.value.search.toLowerCase())
    );
  }

  if (filters.value.status !== 'all') {
    result = result.filter((lesson) => lesson.status === filters.value.status);
  }

  if (filters.value.level !== 'all') {
    result = result.filter((lesson) => lesson.level === filters.value.level);
  }

  switch (filters.value.sort) {
    case 'oldest':
      result.sort((a, b) => a.id - b.id);
      break;
    case 'duration':
      result.sort((a, b) => b.duration - a.duration);
      break;
    case 'alpha':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      result.sort((a, b) => b.id - a.id);
  }

  return result.slice(
    (currentPage.value - 1) * itemsPerPage.value,
    currentPage.value * itemsPerPage.value
  );
});

// Methods
function handleFilterChange(newFilters: {
  search: string;
  status: 'all' | 'Published' | 'Draft';
  level: 'all' | 'Beginner' | 'Intermediate' | 'Advanced';
  sort: 'newest' | 'oldest' | 'duration' | 'alpha';
}) {
  filters.value = newFilters;
  currentPage.value = 1;
}

function handleEdit(lesson: Lesson) {
  editingLesson.value = lesson;
  lessonForm.value = { ...lesson };
  showModal.value = true;
}

function openDeleteModal(lesson: Lesson) {
  lessonToDelete.value = lesson;
  deleteModalOpen.value = true;
}

function closeDeleteModal() {
  deleteModalOpen.value = false;
  setTimeout(() => {
    lessonToDelete.value = null;
  }, 300);
}

async function handleDelete() {
  if (!lessonToDelete.value) return;

  try {
    deleting.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const index = mockLessons.findIndex((l) => l.id === lessonToDelete.value?.id);
    if (index !== -1) {
      mockLessons.splice(index, 1);
    }
    closeDeleteModal();
  } finally {
    deleting.value = false;
  }
}

async function handleSave() {
  try {
    saving.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showModal.value = false;
    editingLesson.value = null;
    lessonForm.value = {
      title: "",
      description: "",
      duration: 30,
      level: "Beginner",
      status: "Draft",
    };
  } finally {
    saving.value = false;
  }
}

// Add watcher for itemsPerPage changes
watch(itemsPerPage, () => {
  // Reset to first page when changing items per page
  currentPage.value = 1;
});

async function handlePreview(lesson: Lesson) {
  // Here you would typically navigate to the lesson preview page
  navigateTo(`/lessons/${lesson.id}/preview`);
}

async function handlePublish(lesson: Lesson) {
  try {
    const index = mockLessons.findIndex(l => l.id === lesson.id);
    if (index !== -1) {
      mockLessons[index] = { ...lesson, status: 'Published' };
    }
  } catch (error) {
    console.error('Failed to publish lesson:', error);
  }
}

async function handleUnpublish(lesson: Lesson) {
  try {
    const index = mockLessons.findIndex(l => l.id === lesson.id);
    if (index !== -1) {
      mockLessons[index] = { ...lesson, status: 'Draft' };
    }
  } catch (error) {
    console.error('Failed to unpublish lesson:', error);
  }
}

async function handleDuplicate(lesson: Lesson) {
  try {
    const newLesson = {
      ...lesson,
      id: mockLessons.length + 1,
      title: `${lesson.title} (Copy)`,
      status: 'Draft',
      updatedDays: 0
    };
    mockLessons.unshift(newLesson);
  } catch (error) {
    console.error('Failed to duplicate lesson:', error);
  }
}
</script>

