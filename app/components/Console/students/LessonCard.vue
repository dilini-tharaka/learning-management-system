<template>
    <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-gray-300 dark:hover:border-zinc-600 cursor-pointer relative">
        <!-- Lesson Image -->
        <div class="h-48 w-full bg-gray-100 dark:bg-zinc-900 relative overflow-hidden">
            <img :src="imageUrl" :alt="`${title} thumbnail`" class="w-full h-full object-cover" />
        </div>
        
        <!-- Lesson Content -->
        <div class="p-4 pb-16 space-y-4">
            <h3 class="font-medium text-lg">{{ title }}</h3>
            <p class="text-gray-600 dark:text-zinc-400 text-sm line-clamp-2">
                {{ description }}
            </p>
        </div>

        <!-- Lesson Type Badge -->
        <div class="absolute -bottom-1 left-0 p-4">
            <span :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                typeStyles[type].bg,
                typeStyles[type].text,
                typeStyles[type].border
            ]">
                <component :is="typeStyles[type].icon" class="h-4 w-4 mr-1" />
                {{ type }}
            </span>
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
    type: {
        type: String,
        required: true,
        validator: (value) => ['Theory', 'Revision', 'Paper Class'].includes(value)
    }
})

// Lesson type badge styles and icons
const typeStyles = {
    'Theory': {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border border-blue-200 dark:border-blue-800/30',
        icon: defineComponent({
            template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>`
        })
    },
    'Revision': {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-400',
        border: 'border border-purple-200 dark:border-purple-800/30',
        icon: defineComponent({
            template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
            </svg>`
        })
    },
    'Paper Class': {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border border-orange-200 dark:border-orange-800/30',
        icon: defineComponent({
            template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>`
        })
    }
}
</script>
