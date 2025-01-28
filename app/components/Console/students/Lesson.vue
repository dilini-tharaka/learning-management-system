<template>
    <div class="space-y-6">
        <div class="space-y-4">
            <h1 class="text-2xl font-semibold">Student Lessons</h1>
            
            <!-- Lessons Filter -->
            <div class="flex gap-4 items-center">
                <div class="flex-1 relative">
                    <input 
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search lessons..."
                        class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                </div>
                <select 
                    v-model="typeFilter"
                    class="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                    <option value="all">All Types</option>
                    <option value="Theory">Theory</option>
                    <option value="Revision">Revision</option>
                    <option value="Paper Class">Paper Class</option>
                </select>
            </div>
        </div>

        <!-- Lessons Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LessonCard
                v-for="lesson in filteredLessons"
                :key="lesson.id"
                v-bind="lesson"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LessonCard from './LessonCard.vue'

// Sample data - Replace with actual data from your API
const lessons = [
    {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60',
        title: 'Introduction to Mathematics',
        description: 'Learn the fundamentals of mathematics including algebra, geometry, and arithmetic operations.',
        type: 'Theory'
    },
    {
        id: 2,
        imageUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop&q=60',
        title: 'Chemistry Revision',
        description: 'Comprehensive revision of organic and inorganic chemistry concepts.',
        type: 'Revision'
    },
    {
        id: 3,
        imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=60',
        title: 'Physics Paper Class',
        description: 'Practice papers and exam preparation techniques for physics.',
        type: 'Paper Class'
    }
]

const searchQuery = ref('')
const typeFilter = ref('all')

// Filter lessons based on search query and type
const filteredLessons = computed(() => {
    return lessons.filter(lesson => {
        const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            lesson.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        
        const matchesType = typeFilter.value === 'all' || lesson.type === typeFilter.value
        
        return matchesSearch && matchesType
    })
})
</script>