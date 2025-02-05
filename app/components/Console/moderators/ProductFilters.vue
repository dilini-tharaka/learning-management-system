<template>
  <div class="flex flex-col sm:flex-row justify-between gap-4">
    <div class="flex flex-wrap gap-3">
      <UInput
        v-model="filters.search"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search products..."
        size="lg"
      />

      <USelect
        v-model="filters.category"
        :options="[
          { label: 'All Categories', value: 'all' },
          { label: 'Electronics', value: 'electronics' },
          { label: 'Clothing', value: 'clothing' },
          { label: 'Books', value: 'books' },
          { label: 'Home & Garden', value: 'home' },
          { label: 'Sports', value: 'sports' }
        ]"
        placeholder="Category"
        icon="i-heroicons-squares-2x2"
        size="lg"
      />

      <USelect
        v-model="filters.status"
        :options="[
          { label: 'All Status', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Draft', value: 'draft' },
          { label: 'Archived', value: 'archived' }
        ]"
        placeholder="Status"
        icon="i-heroicons-tag"
        size="lg"
      />

      <USelect
        v-model="filters.sort"
        :options="[
          { label: 'Newest First', value: 'newest' },
          { label: 'Price: Low to High', value: 'price_asc' },
          { label: 'Price: High to Low', value: 'price_desc' },
          { label: 'Name: A-Z', value: 'name_asc' }
        ]"
        placeholder="Sort by"
        icon="i-heroicons-arrows-up-down"
        size="lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ProductStatus } from '~/types/product'

interface Filters {
  search: string;
  category: string;
  status: 'all' | ProductStatus;
  sort: string;
}

const filters = ref<Filters>({
  search: '',
  category: 'all',
  status: 'all',
  sort: 'newest'
});

const emit = defineEmits<{
  (e: "filter-change", filters: Filters): void;
}>();

watch(
  filters,
  (newFilters) => {
    emit("filter-change", newFilters);
  },
  { deep: true }
);
</script>
