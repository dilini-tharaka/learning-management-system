<template>
    <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-600 cursor-pointer relative">
        <!-- Product Image -->
        <div class="h-48 w-full bg-gray-100 dark:bg-zinc-900 relative overflow-hidden">
            <img :src="imageUrl" :alt="`${title} thumbnail`" class="w-full h-full object-cover" />
            <!-- Points Badge -->
            <div class="absolute top-3 right-3">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/95 text-blue-700 dark:bg-blue-900/90 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30 shadow-sm backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {{ points }} Points
                </span>
            </div>
        </div>
        
        <!-- Product Content -->
        <div class="p-4 space-y-4">
            <h3 class="font-medium text-lg">{{ title }}</h3>
            <p class="text-gray-600 dark:text-zinc-400 text-sm line-clamp-2">
                {{ description }}
            </p>
            
            <!-- Stock Status -->
            <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-zinc-400">
                    {{ stock }} in stock
                </span>
                <button 
                    @click="$emit('redeem')"
                    :disabled="!canRedeem"
                    :class="[
                        'px-4 py-2 rounded-lg text-sm font-medium',
                        canRedeem 
                            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500'
                    ]"
                >
                    Redeem Now
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    canRedeem: {
        type: Boolean,
        default: true
    }
})

defineEmits(['redeem'])
</script>
