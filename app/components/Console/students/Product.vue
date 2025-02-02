<template>
    <div class="space-y-6">
        <!-- Points Summary -->
        <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
            <div class="flex items-center justify-between">
                <div class="space-y-1">
                    <h2 class="text-xl font-semibold">Your Points</h2>
                    <p class="text-gray-600 dark:text-zinc-400">Redeem your points for awesome rewards!</p>
                </div>
                <div class="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="text-lg font-bold text-blue-700 dark:text-blue-400">{{ userPoints }} Points</span>
                </div>
            </div>
        </div>

        <!-- Search and Filter -->
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
                v-model="pointsFilter"
                class="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
                <option value="all">All Points Range</option>
                <option value="low">0-500 Points</option>
                <option value="medium">501-1000 Points</option>
                <option value="high">1000+ Points</option>
            </select>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
                v-for="product in filteredProducts"
                :key="product.id"
                v-bind="product"
                :canRedeem="userPoints >= product.points"
                @redeem="redeemProduct(product)"
            />
        </div>

        <!-- Redemption Modal -->
        <div v-if="showRedemptionModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full space-y-4">
                <h3 class="text-lg font-semibold">Confirm Redemption</h3>
                <p class="text-gray-600 dark:text-zinc-400">
                    Are you sure you want to redeem {{ selectedProduct?.title }} for {{ selectedProduct?.points }} points?
                </p>
                <div class="flex justify-end space-x-3">
                    <button 
                        @click="showRedemptionModal = false"
                        class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    >
                        Cancel
                    </button>
                    <button 
                        @click="confirmRedemption"
                        class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from './ProductCard.vue'

// Sample data - Replace with actual data from your API
const userPoints = ref(1500)
const searchQuery = ref('')
const pointsFilter = ref('all')
const showRedemptionModal = ref(false)
const selectedProduct = ref(null)

const products = [
    {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
        title: 'Premium Sneakers',
        description: 'High-quality sneakers perfect for sports and casual wear.',
        points: 500,
        stock: 5
    },
    {
        id: 2,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
        title: 'Smart Watch',
        description: 'Modern smartwatch with fitness tracking and notifications.',
        points: 1000,
        stock: 3
    },
    {
        id: 3,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
        title: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation.',
        points: 750,
        stock: 8
    }
]

const filteredProducts = computed(() => {
    return products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        
        const matchesPoints = pointsFilter.value === 'all' ||
                            (pointsFilter.value === 'low' && product.points <= 500) ||
                            (pointsFilter.value === 'medium' && product.points > 500 && product.points <= 1000) ||
                            (pointsFilter.value === 'high' && product.points > 1000)
        
        return matchesSearch && matchesPoints
    })
})

const redeemProduct = (product) => {
    selectedProduct.value = product
    showRedemptionModal.value = true
}

const confirmRedemption = () => {
    if (selectedProduct.value && userPoints.value >= selectedProduct.value.points) {
        // Implement redemption logic here
        userPoints.value -= selectedProduct.value.points
        // Update product stock
        const product = products.find(p => p.id === selectedProduct.value.id)
        if (product) {
            product.stock--
        }
        showRedemptionModal.value = false
        selectedProduct.value = null
    }
}
</script>
