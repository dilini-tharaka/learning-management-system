<template>
    <NuxtLayout name="console">
        <div class="max-w-7xl mx-auto py-6 space-y-6">
            <!-- Header -->
            <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                <div class="flex items-center justify-between">
                    <div class="space-y-1">
                        <h1 class="text-2xl font-semibold">Points Withdrawal History</h1>
                        <p class="text-gray-600 dark:text-zinc-400">Track your points redemption and product orders</p>
                    </div>
                    <div class="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span class="text-lg font-bold text-blue-700 dark:text-blue-400">{{ totalPoints }} Points</span>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="flex gap-4 items-center">
                <div class="flex-1 relative">
                    <input 
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search products..."
                        class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                </div>
                <select 
                    v-model="statusFilter"
                    class="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select 
                    v-model="sortBy"
                    class="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="points-desc">Highest Points</option>
                    <option value="points-asc">Lowest Points</option>
                </select>
            </div>

            <!-- Withdrawals Table -->
            <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead class="bg-gray-50 dark:bg-zinc-900/50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Product</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Points</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-zinc-700">
                            <tr v-for="withdrawal in filteredWithdrawals" :key="withdrawal.id" class="hover:bg-gray-50 dark:hover:bg-zinc-700/50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <img :src="withdrawal.productImage" class="h-10 w-10 rounded-lg object-cover" :alt="withdrawal.productName">
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900 dark:text-zinc-100">{{ withdrawal.productName }}</div>
                                            <div class="text-sm text-gray-500 dark:text-zinc-400">Order #{{ withdrawal.id }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center space-x-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span class="text-sm text-gray-900 dark:text-zinc-100">{{ withdrawal.points }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-zinc-100">{{ formatDate(withdrawal.date) }}</div>
                                    <div class="text-sm text-gray-500 dark:text-zinc-400">{{ formatTime(withdrawal.date) }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="[
                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                        {
                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500': withdrawal.status === 'pending',
                                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500': withdrawal.status === 'completed',
                                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500': withdrawal.status === 'cancelled'
                                        }
                                    ]">
                                        {{ withdrawal.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                                    <button 
                                        v-if="withdrawal.status === 'pending'"
                                        @click="cancelWithdrawal(withdrawal.id)"
                                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        v-if="withdrawal.status === 'completed'"
                                        @click="viewDetails(withdrawal.id)"
                                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sample data - Replace with actual data from your API
const totalPoints = ref(1500)
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('date-desc')

const withdrawals = [
    {
        id: '1001',
        productName: 'Premium Sneakers',
        productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
        points: 500,
        date: new Date('2024-02-01T10:30:00'),
        status: 'completed'
    },
    {
        id: '1002',
        productName: 'Smart Watch',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
        points: 1000,
        date: new Date('2024-02-02T15:45:00'),
        status: 'pending'
    },
    {
        id: '1003',
        productName: 'Wireless Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
        points: 750,
        date: new Date('2024-01-30T09:15:00'),
        status: 'cancelled'
    }
]

const filteredWithdrawals = computed(() => {
    let result = withdrawals

    // Apply search filter
    if (searchQuery.value) {
        result = result.filter(w => 
            w.productName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            w.id.includes(searchQuery.value)
        )
    }

    // Apply status filter
    if (statusFilter.value !== 'all') {
        result = result.filter(w => w.status === statusFilter.value)
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
        switch (sortBy.value) {
            case 'date-desc':
                return b.date - a.date
            case 'date-asc':
                return a.date - b.date
            case 'points-desc':
                return b.points - a.points
            case 'points-asc':
                return a.points - b.points
            default:
                return 0
        }
    })

    return result
})

const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    }).format(date)
}

const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    }).format(date)
}

const cancelWithdrawal = (id) => {
    // Implement cancellation logic here
    console.log('Cancelling withdrawal:', id)
}

const viewDetails = (id) => {
    // Implement view details logic here
    console.log('Viewing details for:', id)
}
</script>
