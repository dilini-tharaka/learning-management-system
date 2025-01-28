<template>
  <div class="min-h-screen space-y-8">
    <!-- Header with Stats -->
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Quiz Management
          </h1>
          <p class="mt-2 text-gray-600 dark:text-zinc-400">
            Create and manage interactive course quizzes
          </p>
        </div>
        <UButton
          size="lg"
          color="primary"
          icon="i-heroicons-plus-circle"
          to="/console/quizzes/new"
        >
          Create Quiz
        </UButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard
          v-for="stat in quizStats"
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
    <QuizFilters
      @filter-change="handleFilterChange"
      @create="showModal = true"
    />

    <!-- Quiz Grid -->
    <div class="relative">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuizCard
          v-for="(quiz, index) in filteredQuizzes"
          :key="quiz.id"
          :quiz="quiz"
          :style="{ animationDelay: index * 50 + 'ms' }"
          :gradient="getGradient(quiz.id)"
          :deleting="false"
          @edit="handleEdit"
          @delete="openDeleteModal"
        />
      </div>

      <!-- Empty State -->
      <div
        v-if="!filteredQuizzes.length"
        class="text-center py-12 bg-white dark:bg-gray-800 rounded-xl"
      >
        <div class="flex flex-col items-center gap-4">
          <Icon
            name="i-heroicons-document-search"
            class="w-16 h-16 text-gray-400"
          />
          <div class="space-y-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              No quizzes found
            </h3>
            <p class="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Try adjusting your search or filters, or create a new quiz to get
              started.
            </p>
          </div>
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            @click="showModal = true"
          >
            Create Your First Quiz
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
            {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, totalQuizzes) }}
          </span> 
          of 
          <span class="font-medium text-gray-900 dark:text-white">{{ totalQuizzes }}</span>
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
          v-if="totalQuizzes > itemsPerPage"
          v-model="currentPage"
          :total="totalQuizzes"
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
            {{ editingQuiz ? "Edit Quiz" : "Create Quiz" }}
          </h3>
        </template>

        <form @submit.prevent="handleSave" class="space-y-6">
          <UFormGroup label="Quiz Title" required>
            <UInput v-model="quizForm.title" placeholder="Enter quiz title" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Questions" required>
              <UInput v-model="quizForm.questions" type="number" min="1" />
            </UFormGroup>
            <UFormGroup label="Time (mins)" required>
              <UInput v-model="quizForm.timeLimit" type="number" min="1" />
            </UFormGroup>
          </div>

          <UFormGroup label="Status" required>
            <USelect
              v-model="quizForm.status"
              :options="[
                { label: 'Active', value: 'Active' },
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
              {{ editingQuiz ? "Save Changes" : "Create Quiz" }}
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
            <h3 class="text-lg font-semibold">Delete Quiz</h3>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete "<span
              class="font-medium text-gray-900 dark:text-white"
              >{{ quizToDelete?.title }}</span
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
              Delete Quiz
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Quiz } from "~/types/quiz";
import QuizCard from "./QuizCard.vue";
import QuizFilters from "./QuizFilters.vue";

// Mock data - Define this first
const mockQuizzes = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Introduction to JavaScript - Quiz ${i + 1}`,
  questions: 5 + i,
  timeLimit: 30,
  status: i % 2 === 0 ? "Active" : "Draft",
  updatedDays: i,
}));

// State
const currentPage = ref(1);
const itemsPerPage = ref(6);
const showModal = ref(false);
const saving = ref(false);
const deleting = ref(false);
const editingQuiz = ref<Quiz | null>(null);
const quizToDelete = ref<Quiz | null>(null);
const deleteModalOpen = ref(false);
const filters = ref({
  search: "",
  status: "all",
  sort: "newest",
});

// Quiz Form
const quizForm = ref({
  title: "",
  questions: 1,
  timeLimit: 30,
  status: "Draft" as const,
});

// Quiz statistics
const quizStats = computed(() => [
  {
    name: "Total Quizzes",
    value: mockQuizzes.length,
    change: 12.5,
    icon: "i-heroicons-document-text",
    bgColor: "bg-primary-100/80 dark:bg-primary-900/30",
    borderColor: "border-primary-200 dark:border-primary-800",
    iconColor: "text-primary-600 dark:text-primary-400",
  },
  {
    name: "Active Quizzes",
    value: mockQuizzes.filter((q) => q.status === "Active").length,
    change: 18.2,
    icon: "i-heroicons-check-circle",
    bgColor: "bg-green-100/80 dark:bg-green-900/30",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    name: "Average Score",
    value: "76%",
    change: -4.3,
    icon: "i-heroicons-chart-bar",
    bgColor: "bg-orange-100/80 dark:bg-orange-900/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
]);

// Computed properties
const totalQuizzes = computed(() => mockQuizzes.length);

const filteredQuizzes = computed(() => {
  let result = [...mockQuizzes];

  if (filters.value.search) {
    result = result.filter((quiz) =>
      quiz.title.toLowerCase().includes(filters.value.search.toLowerCase())
    );
  }

  if (filters.value.status !== "all") {
    result = result.filter(
      (quiz) => quiz.status.toLowerCase() === filters.value.status
    );
  }

  switch (filters.value.sort) {
    case "oldest":
      result.sort((a, b) => a.id - b.id);
      break;
    case "questions":
      result.sort((a, b) => b.questions - a.questions);
      break;
    case "alpha":
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
  status: string;
  sort: string;
}) {
  filters.value = newFilters;
  currentPage.value = 1;
}

function handleEdit(quiz: Quiz) {
  editingQuiz.value = quiz;
  quizForm.value = { ...quiz };
  showModal.value = true;
}

function openDeleteModal(quiz: Quiz) {
  quizToDelete.value = quiz;
  deleteModalOpen.value = true;
}

function closeDeleteModal() {
  deleteModalOpen.value = false;
  setTimeout(() => {
    quizToDelete.value = null;
  }, 300);
}

async function handleDelete() {
  if (!quizToDelete.value) return;

  try {
    deleting.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const index = mockQuizzes.findIndex((q) => q.id === quizToDelete.value?.id);
    if (index !== -1) {
      mockQuizzes.splice(index, 1);
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
    editingQuiz.value = null;
    quizForm.value = {
      title: "",
      questions: 1,
      timeLimit: 30,
      status: "Draft",
    };
  } finally {
    saving.value = false;
  }
}

const getGradient = (index: number): string => {
  const gradients = [
    "from-blue-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-indigo-500 to-violet-600",
    "from-cyan-500 to-blue-600",
  ];
  return gradients[index % gradients.length] || gradients[0];
};

// Add watcher for itemsPerPage changes
watch(itemsPerPage, () => {
  // Reset to first page when changing items per page
  currentPage.value = 1;
});
</script>

