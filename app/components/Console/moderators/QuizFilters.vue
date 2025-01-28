<template>
    <div class="flex flex-col sm:flex-row justify-between gap-4">
      <div class="flex flex-wrap gap-3">
        <UInput
          v-model="filters.search"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Search quizzes..."
          class="min-w-[200px] sm:w-64"
          @input="updateFilters"
        />
        <USelect
          v-model="filters.status"
          :options="statusOptions"
          placeholder="Filter by status"
          icon="i-heroicons-flag"
          class="min-w-[150px]"
          @change="updateFilters"
        />
        <USelect
          v-model="filters.sort"
          :options="sortOptions"
          icon="i-heroicons-arrows-up-down"
          placeholder="Sort by"
          class="min-w-[150px]"
          @change="updateFilters"
        />
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' }
];

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Most Questions', value: 'questions' },
  { label: 'Alphabetical', value: 'alpha' }
];

const filters = reactive({
  search: '',
  status: 'all',
  sort: 'newest'
});

const emit = defineEmits<{
  (e: 'filter-change', filters: {
    search: string;
    status: string;
    sort: string;
  }): void;
  (e: 'create'): void;
}>();

const updateFilters = () => {
  emit('filter-change', { ...filters });
};
</script>