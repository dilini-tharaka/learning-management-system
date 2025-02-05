<template>
  <div>
    <NuxtLayout name="console">
      <div class="min-h-screen space-y-6 bg-gray-50 dark:bg-zinc-900 p-6 rounded-xl">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold">Order Management</h1>
            <p class="text-gray-600 dark:text-zinc-400">
              Manage your orders and transactions
            </p>
          </div>
          <UButton icon="i-heroicons-plus" @click="openOrderModal">
            Add Order
          </UButton>
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-4">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search orders..."
            class="max-w-sm"
          />
          <USelect
            v-model="statusFilter"
            :options="['All', 'Pending', 'Completed', 'Cancelled']"
            class="max-w-[200px]"
          />
        </div>

        <!-- Orders Table -->
        <UTable
          :rows="paginatedOrders"
          :columns="columns"
          :loading="loading"
          :ui="{ wrapper: 'min-h-[450px]' }"
        >
          <template #id-data="{ row }">
            <span class="font-medium">{{ row.id }}</span>
          </template>
          <template #customer-data="{ row }">
            <div class="flex items-center gap-3">
              <img 
                :src="`https://ui-avatars.com/api/?name=${row.customer}&background=146de0&color=fff`"
                :alt="row.customer"
                class="w-8 h-8 rounded-full"
              />
              <span>{{ row.customer }}</span>
            </div>
          </template>
          <template #amount-data="{ row }">
            <span>{{ row.amount }}</span>
          </template>
          <template #status-data="{ row }">
            <UBadge
              :color="getStatusColor(row.status)"
              variant="soft"
              size="sm"
              class="capitalize"
            >
              {{ row.status.toLowerCase() }}
            </UBadge>
          </template>
          <template #actions-data="{ row }">
            <UDropdown :items="getOrderActions(row)" :popper="{ placement: 'bottom-end' }">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" />
            </UDropdown>
          </template>
        </UTable>

        <!-- Pagination -->
        <div class="flex justify-center">
          <UPagination
            v-model="currentPage"
            :total="filteredOrders.length"
            :per-page="perPage"
            :ui="{ wrapper: 'gap-1', rounded: 'rounded-lg' }"
          />
        </div>

        <!-- Order Modal (Placeholder) -->
        <OrderModal v-if="orderModalOpen" @close="orderModalOpen = false" />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Define the Order type
interface Order {
  id: string
  customer: string
  amount: string
  status: 'Pending' | 'Completed' | 'Cancelled'
}

// Mock orders data
const orders = ref<Order[]>([
  { id: 'ORD-1001', customer: 'John Doe', amount: '$150', status: 'Pending' },
  { id: 'ORD-1002', customer: 'Jane Smith', amount: '$200', status: 'Completed' },
  { id: 'ORD-1003', customer: 'Alice Brown', amount: '$125', status: 'Cancelled' },
  // ...more orders
])

// Filters and state
const search = ref('')
const statusFilter = ref('All')
const currentPage = ref(1)
const perPage = ref(10)
const loading = ref(false)
const orderModalOpen = ref(false)

// Computed filtered and paginated orders
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(search.value.toLowerCase()) ||
                          order.customer.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'All' || order.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredOrders.value.slice(start, start + perPage.value)
})

// Table columns
const columns = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions', sortable: false }
]

// Helper for status badge colors
const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'Pending': return 'yellow'
    case 'Completed': return 'green'
    case 'Cancelled': return 'red'
    default: return 'gray'
  }
}

// Define actions for each order
const getOrderActions = (order: Order) => {
  return [
    [
      {
        label: 'View Order',
        icon: 'i-heroicons-eye',
        click: () => viewOrder(order)
      },
      {
        label: 'Edit Order',
        icon: 'i-heroicons-pencil',
        click: () => editOrder(order)
      }
    ],
    [
      {
        label: 'Delete Order',
        icon: 'i-heroicons-trash',
        click: () => deleteOrder(order)
      }
    ]
  ]
}

const viewOrder = (order: Order) => {
  // Implement order details view logic
}

const editOrder = (order: Order) => {
  // Implement edit logic (reuse OrderModal if needed)
  orderModalOpen.value = true
}

const deleteOrder = (order: Order) => {
  // Implement deletion logic
}

const openOrderModal = () => {
  orderModalOpen.value = true
}
</script>