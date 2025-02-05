<template>
  <div class="min-h-screen space-y-8">
    <!-- Responsive Header -->
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Product Management
          </h1>
          <p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-zinc-400">
            Manage your product catalog and inventory
          </p>
        </div>
        <UButton size="lg" color="primary" icon="i-heroicons-plus-circle" to="/console/products/new"
          class="self-start sm:self-center">
          Add Product
        </UButton>
      </div>

      <!-- Responsive Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <UCard v-for="stat in productStats" :key="stat.name" class="hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-zinc-400">
                {{ stat.name }}
              </p>
              <p class="mt-2 text-3xl font-semibold">{{ stat.value }}</p>
              <p :class="[
                'mt-2 text-sm',
                stat.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              ]">
                <span>{{ stat.change > 0 ? '↑' : '↓' }} {{ Math.abs(stat.change) }}%</span>
                <span class="text-gray-600 dark:text-zinc-400 ml-1">vs last month</span>
              </p>
            </div>
            <div
              :class="`w-12 h-12 flex items-center justify-center rounded-lg border ${stat.bgColor} ${stat.borderColor}`">
              <Icon :name="stat.icon" :class="`w-6 h-6 ${stat.iconColor}`" />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Responsive Filters -->
    <ProductFilters @filter-change="handleFilterChange" />

    <!-- Responsive Product Grid -->
    <div class="relative space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <ProductCard v-for="(product, index) in paginatedProducts" :key="product.id" :product="product"
          :style="{ animationDelay: `${index * 50}ms` }" class="h-full" @edit="handleEdit" @delete="openDeleteModal"
          @status-change="handleStatusChange" />
      </div>

      <!-- Empty State -->
      <div v-if="!filteredProducts.length" class="text-center py-12 px-4 sm:px-6 bg-white dark:bg-zinc-800 rounded-xl">
        <div class="flex flex-col items-center gap-4">
          <Icon name="i-heroicons-cube" class="w-12 h-12 text-gray-400" />
          <div class="space-y-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              No products found
            </h3>
            <p class="text-sm text-gray-500 max-w-sm mx-auto">
              Try adjusting your filters or add a new product to get started.
            </p>
          </div>
          <UButton color="primary" icon="i-heroicons-plus" @click="showModal = true">
            Add Your First Product
          </UButton>
        </div>
      </div>

      <!-- Responsive Pagination -->
      <div
        class="bg-white dark:bg-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-sm text-gray-600 dark:text-gray-400 w-full sm:w-auto text-center sm:text-left">
          Showing
          <span class="font-medium text-gray-900 dark:text-white">
            {{ paginationStart }}-{{ paginationEnd }}
          </span>
          of
          <span class="font-medium text-gray-900 dark:text-white">
            {{ totalFilteredProducts }}
          </span>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <USelect v-model="itemsPerPage" :options="[
            { label: '6 per page', value: 6 },
            { label: '12 per page', value: 12 },
            { label: '24 per page', value: 24 },
          ]" size="sm" class="w-full sm:w-auto" />

          <UPagination v-if="totalFilteredProducts > itemsPerPage" v-model="currentPage" :total="totalFilteredProducts"
            :per-page="itemsPerPage" :ui="{
              wrapper: 'gap-1',
              rounded: 'rounded-lg'
            }" class="w-full sm:w-auto justify-center" />
        </div>
      </div>
    </div>

    <!-- Responsive Modal -->
    <UModal v-model="showModal">
      <UCard :ui="{ base: 'w-full max-w-2xl mx-4 sm:mx-auto' }">
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ editingProduct ? "Edit Product" : "Add Product" }}
          </h3>
        </template>

        <form @submit.prevent="handleSave" class="space-y-6">
          <UFormGroup label="Product Name" required>
            <UInput v-model="productForm.name" placeholder="Enter product name" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Price" required>
              <UInput v-model="productForm.price" type="number" min="0" step="0.01" :ui="{ input: 'pl-8' }">
                <template #leading>
                  <span class="text-gray-500">$</span>
                </template>
              </UInput>
            </UFormGroup>
            <UFormGroup label="Category" required>
              <USelect v-model="productForm.category" :options="categories" />
            </UFormGroup>
          </div>

          <UFormGroup label="Description">
            <UTextarea v-model="productForm.description" :rows="3" placeholder="Product description" />
          </UFormGroup>

          <UFormGroup label="Status">
            <USelect v-model="productForm.status" :options="[
              { label: 'Active', value: 'active' },
              { label: 'Draft', value: 'draft' },
              { label: 'Archived', value: 'archived' }
            ]" />
          </UFormGroup>
        </form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="soft" @click="showModal = false">Cancel</UButton>
            <UButton color="primary" :loading="saving" @click="handleSave">
              {{ editingProduct ? "Save Changes" : "Add Product" }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Product } from "~/types/product";
import ProductCard from "./ProductCard.vue";
import ProductFilters from "./ProductFilters.vue";

// Mock data - Define this first
const mockProducts = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Product ${i + 1}`,
  price: (i + 1) * 10,
  category: i % 2 === 0 ? "electronics" : "clothing",
  status: i % 2 === 0 ? "active" : "draft",
  description: `Description for product ${i + 1}`,
  image: `/placeholder-product.jpg`,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
  publishedAt: i % 2 === 0 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
  archivedAt: undefined
}));

// State
const currentStatus = ref<'all' | 'active' | 'draft' | 'archived'>('all');
const currentPage = ref(1);
const itemsPerPage = ref(6);
const showModal = ref(false);
const saving = ref(false);
const deleting = ref(false);
const editingProduct = ref<Product | null>(null);
const productToDelete = ref<Product | null>(null);
const deleteModalOpen = ref(false);
const filters = ref({
  search: "",
  category: "all",
  sort: "newest",
});

// Product Form
const productForm = ref({
  name: "",
  price: 0,
  category: "",
  description: "",
  status: "draft" as const,
  image: "",
});

// Product statistics
const productStats = computed(() => [
  {
    name: 'Total Products',
    value: mockProducts.length,
    change: 12.5,
    icon: 'i-heroicons-cube',
    bgColor: 'bg-primary-100/80 dark:bg-primary-900/30',
    borderColor: 'border-primary-200 dark:border-primary-800',
    iconColor: 'text-primary-600 dark:text-primary-400'
  },
  {
    name: 'Total Revenue',
    value: '$12,456',
    change: 18.2,
    icon: 'i-heroicons-currency-dollar',
    bgColor: 'bg-green-100/80 dark:bg-green-900/30',
    borderColor: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    name: 'Out of Stock',
    value: '3',
    change: -4.3,
    icon: 'i-heroicons-exclamation-circle',
    bgColor: 'bg-red-100/80 dark:bg-red-900/30',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400'
  }
]);

const categories = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Books', value: 'books' },
  { label: 'Home & Garden', value: 'home' },
  { label: 'Sports', value: 'sports' }
];

// Computed properties
const totalProducts = computed(() => mockProducts.length);

const filteredProducts = computed(() => {
  let result = [...mockProducts];

  // Status filtering
  if (currentStatus.value !== 'all') {
    result = result.filter(product => product.status === currentStatus.value);
  }

  if (filters.value.search) {
    result = result.filter((product) =>
      product.name.toLowerCase().includes(filters.value.search.toLowerCase())
    );
  }

  if (filters.value.category !== "all") {
    result = result.filter(
      (product) => product.category.toLowerCase() === filters.value.category
    );
  }

  switch (filters.value.sort) {
    case "oldest":
      result.sort((a, b) => a.id - b.id);
      break;
    case "price":
      result.sort((a, b) => b.price - a.price);
      break;
    case "alpha":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      result.sort((a, b) => b.id - a.id);
  }

  return result;
});

const totalFilteredProducts = computed(() => filteredProducts.value.length);
const totalPages = computed(() => Math.ceil(totalFilteredProducts.value / itemsPerPage.value));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

const paginationStart = computed(() => {
  return totalFilteredProducts.value === 0
    ? 0
    : (currentPage.value - 1) * itemsPerPage.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalFilteredProducts.value);
});

// Methods
function handleFilterChange(newFilters: {
  search: string;
  category: string;
  sort: string;
}) {
  filters.value = newFilters;
  currentPage.value = 1;
}

function handleEdit(product: Product) {
  editingProduct.value = product;
  productForm.value = { ...product };
  showModal.value = true;
}

function openDeleteModal(product: Product) {
  productToDelete.value = product;
  deleteModalOpen.value = true;
}

function closeDeleteModal() {
  deleteModalOpen.value = false;
  setTimeout(() => {
    productToDelete.value = null;
  }, 300);
}

async function handleDelete() {
  if (!productToDelete.value) return;

  try {
    deleting.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const index = mockProducts.findIndex((p) => p.id === productToDelete.value?.id);
    if (index !== -1) {
      mockProducts.splice(index, 1);
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
    editingProduct.value = null;
    productForm.value = {
      name: "",
      price: 0,
      category: "",
      description: "",
      status: "in_stock",
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

// Status management methods
function getStatusCount(status: string) {
  if (status === 'all') return mockProducts.length;
  return mockProducts.filter(p => p.status === status).length;
}

async function handleStatusChange(product: Product, newStatus: string) {
  try {
    const index = mockProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      const now = new Date().toISOString();
      mockProducts[index] = {
        ...mockProducts[index],
        status: newStatus,
        updatedAt: now,
        publishedAt: newStatus === 'active' ? now : mockProducts[index].publishedAt,
        archivedAt: newStatus === 'archived' ? now : undefined
      };
    }
  } catch (error) {
    console.error('Failed to update status:', error);
  }
}

// Add watcher for itemsPerPage changes
watch(itemsPerPage, () => {
  // Reset to first page when changing items per page
  currentPage.value = 1;
});

// Reset page when filters change
watch([currentStatus, filters, itemsPerPage], () => {
  currentPage.value = 1;
});

// Add this watcher to handle edge cases
watch(totalFilteredProducts, (newTotal) => {
  const maxPage = Math.ceil(newTotal / itemsPerPage.value);
  if (currentPage.value > maxPage) {
    currentPage.value = Math.max(1, maxPage);
  }
});
</script>
