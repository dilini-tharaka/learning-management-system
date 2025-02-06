<template>
    <div class="space-y-6">
        <div class="space-y-4">
            <h1 class="text-2xl font-semibold">Student Lessons</h1>
            
            <!-- Lessons Filter -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <UInput
                    v-model="searchQuery"
                    icon="i-heroicons-magnifying-glass-20-solid"
                    placeholder="Search lessons..."
                    class="w-full sm:col-span-2"
                    size="lg"
                    color="gray"
                />
                
                <USelect
                    v-model="typeFilter"
                    :options="lessonTypes"
                    placeholder="Filter by type"
                    icon="i-heroicons-funnel"
                    class="w-full"
                    size="lg"
                    color="gray"
                />
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

        <!-- Empty State -->
        <div v-if="filteredLessons.length === 0" class="text-center py-12">
            <UIcon
                name="i-heroicons-document-magnifying-glass"
                class="h-12 w-12 mx-auto text-gray-400 dark:text-zinc-600 mb-4"
            />
            <h3 class="text-sm font-medium text-gray-900 dark:text-zinc-100">No lessons found</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                Try adjusting your search or filter to find what you're looking for.
            </p>
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

// Lesson type options
const lessonTypes = [
    { label: 'All Types', value: 'all' },
    { label: 'Theory', value: 'Theory' },
    { label: 'Revision', value: 'Revision' },
    { label: 'Paper Class', value: 'Paper Class' }
]

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