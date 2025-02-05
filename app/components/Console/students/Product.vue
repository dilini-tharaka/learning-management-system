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
                    <UIcon name="i-heroicons-star-20-solid" class="h-5 w-5 text-blue-500" />
                    <span class="text-lg font-bold text-blue-700 dark:text-blue-400">{{ userPoints }} Points</span>
                </div>
            </div>
        </div>

        <!-- Search and Filter -->
        <div class="space-y-4">
            <h1 class="text-2xl font-semibold">Student Products</h1>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <UInput
                    v-model="searchQuery"
                    icon="i-heroicons-magnifying-glass-20-solid"
                    placeholder="Search products..."
                    class="w-full sm:col-span-2"
                    size="lg"
                    color="gray"
                />
                
                <USelect
                    v-model="pointsFilter"
                    :options="pointsRanges"
                    placeholder="Points range"
                    icon="i-heroicons-star-20-solid"
                    class="w-full"
                    size="lg"
                    color="gray"
                />
            </div>
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

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
            <UIcon
                name="i-heroicons-shopping-bag"
                class="h-12 w-12 mx-auto text-gray-400 dark:text-zinc-600 mb-4"
            />
            <h3 class="text-sm font-medium text-gray-900 dark:text-zinc-100">No products found</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                Try adjusting your search or filter to find what you're looking for.
            </p>
        </div>

        <!-- Redemption Modal -->
        <UModal v-model="showRedemptionModal">
            <div class="space-y-4">
                <h3 class="text-lg font-semibold">Confirm Redemption</h3>
                <p class="text-gray-600 dark:text-zinc-400">
                    Are you sure you want to redeem {{ selectedProduct?.title }} for {{ selectedProduct?.points }} points?
                </p>
                <div class="flex justify-end space-x-3">
                    <UButton
                        color="gray"
                        variant="soft"
                        @click="showRedemptionModal = false"
                    >
                        Cancel
                    </UButton>
                    <UButton
                        color="blue"
                        @click="confirmRedemption"
                    >
                        Confirm
                    </UButton>
                </div>
            </div>
        </UModal>
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

// Points range options
const pointsRanges = [
    { label: 'All Points Range', value: 'all' },
    { label: '0-500 Points', value: 'low' },
    { label: '501-1000 Points', value: 'medium' },
    { label: '1000+ Points', value: 'high' }
]

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

// Computed property for filtered products
const filteredProducts = computed(() => {
    let filtered = products

    // Apply search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        )
    }

    // Apply points filter
    if (pointsFilter.value !== 'all') {
        filtered = filtered.filter(product => {
            switch (pointsFilter.value) {
                case 'low':
                    return product.points <= 500
                case 'medium':
                    return product.points > 500 && product.points <= 1000
                case 'high':
                    return product.points > 1000
                default:
                    return true
            }
        })
    }

    return filtered
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
