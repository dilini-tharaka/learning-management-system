<template>
  <UCard class="group relative border dark:border-gray-800 animate-fade-in hover:shadow-lg transition-all duration-300" 
        :class="{'opacity-75 scale-98': deleting}">
    <!-- Image Section with Status -->
    <div class="relative overflow-hidden -m-4 mb-4">
      <img
        :src="product.image || '/placeholder-product.jpg'"
        :alt="product.name"
        class="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <UBadge
        :color="getStatusColor(product.status)"
        :variant="product.status === 'active' ? 'solid' : 'soft'"
        class="absolute top-4 right-4 shadow-lg"
        size="lg"
      >
        {{ formatStatus(product.status) }}
      </UBadge>
    </div>
    
    <!-- Content Section -->
    <div class="space-y-4">
      <!-- Category and Title -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <UBadge
            variant="subtle"
            class="text-xs"
          >
            {{ product.category }}
          </UBadge>
          <!-- Move dropdown here to fix z-index issue -->
          <UDropdown
            :items="getActionItems"
            :popper="{ 
              placement: 'bottom-end',
              strategy: 'fixed'
            }"
          >
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal"
              class="hover:bg-gray-100 dark:hover:bg-zinc-800"
            />
          </UDropdown>
        </div>
        <h3 class="text-lg font-semibold group-hover:text-primary-500 transition-colors line-clamp-2">
          {{ product.name }}
        </h3>
      </div>
      
      <!-- Price and Stock Info -->
      <div class="flex items-end justify-between">
        <div>
          <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            ${{ product.price.toFixed(2) }}
          </span>
        </div>
        <div class="text-sm text-gray-500">
          Last updated: {{ formatDate(product.updatedAt) }}
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-2 pt-4 border-t dark:border-gray-700">
        <UTooltip text="Edit Product">
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            @click="$emit('edit', product)"
          />
        </UTooltip>
        <UTooltip text="Delete Product">
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="$emit('delete', product)"
          />
        </UTooltip>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
  product: Product;
  deleting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'edit', product: Product): void;
  (e: 'delete', product: Product): void;
  (e: 'status-change', product: Product, status: string): void;
}>();

const getActionItems = computed(() => {
  const mainActions = [
    {
      label: 'Set as Active',
      icon: 'i-heroicons-check-circle',
      click: () => emit('status-change', props.product, 'active'),
      disabled: props.product.status === 'active'
    },
    {
      label: 'Move to Draft',
      icon: 'i-heroicons-document-text',
      click: () => emit('status-change', props.product, 'draft'),
      disabled: props.product.status === 'draft'
    },
    {
      label: 'Archive Product',
      icon: 'i-heroicons-archive-box',
      click: () => emit('status-change', props.product, 'archived'),
      disabled: props.product.status === 'archived'
    },
    {
      label: 'Edit Product',
      icon: 'i-heroicons-pencil-square',
      click: () => emit('edit', props.product)
    }
  ];

  const dangerousActions = [
    {
      label: 'Delete Product',
      icon: 'i-heroicons-trash',
      click: () => emit('delete', props.product),
      class: 'text-red-500 hover:text-red-600'
    }
  ];

  return [
    mainActions.filter(action => !action.disabled),
    dangerousActions
  ];
});

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'green';
    case 'draft': return 'yellow';
    case 'archived': return 'gray';
    default: return 'primary';
  }
}

function formatStatus(status: string) {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
  animation-fill-mode: both;
}

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
</style>
