<template>
<div class="flex flex-col sm:flex-row justify-between gap-4">
  <div class="flex flex-wrap gap-3">
      <UInput
        v-model="filters.search"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search lessons..."
        size="lg"
      />
      
      <USelect
        v-model="filters.status"
        :options="[
          { label: 'All Status', value: 'all' },
          { label: 'Published', value: 'Published' },
          { label: 'Draft', value: 'Draft' },
        ]"
        placeholder="Filter by status"
        icon="i-heroicons-flag"
        size="lg"
      />

      <USelect
        v-model="filters.level"
        :options="[
          { label: 'All Levels', value: 'all' },
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Advanced', value: 'Advanced' },
        ]"
        placeholder="Filter by level"
        icon="i-heroicons-signal"
        size="lg"
      />

      <USelect
        v-model="filters.sort"
        :options="[
          { label: 'Newest First', value: 'newest', icon: 'i-heroicons-arrow-down' },
          { label: 'Oldest First', value: 'oldest', icon: 'i-heroicons-arrow-up' },
          { label: 'Duration', value: 'duration', icon: 'i-heroicons-clock' },
          { label: 'Alphabetical', value: 'alpha', icon: 'i-heroicons-bars-arrow-down' },
        ]"
        placeholder="Sort by"
        icon="i-heroicons-arrows-up-down"
        size="lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Filters {
  search: string;
  status: 'all' | 'Published' | 'Draft';
  level: 'all' | 'Beginner' | 'Intermediate' | 'Advanced';
  sort: 'newest' | 'oldest' | 'duration' | 'alpha';
}

const filters = ref<Filters>({
  search: '',
  status: 'all',
  level: 'all',
  sort: 'newest',
});

const emit = defineEmits<{
  (e: 'filter-change', filters: Filters): void;
}>();

watch(filters, (newFilters) => {
  emit('filter-change', newFilters);
}, { deep: true });
</script>