<template>
    <NuxtLayout name="console">
        <div class="max-w-7xl mx-auto py-6 space-y-6">
            <!-- Header -->
            <div class="">
                <div class="flex items-center justify-between">
                    <div class="space-y-1">
                        <h1 class="text-2xl font-semibold">My Quizzes</h1>
                        <p class="text-gray-600 dark:text-zinc-400">View and take your assigned quizzes</p>
                    </div>
                    
                </div>
            </div>

            <!-- Filters -->
            <div class="flex gap-4 items-center">
                <div class="flex-1 relative">
                    <input 
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search quizzes..."
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
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
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

            <!-- Quiz Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuizCard 
                    v-for="quiz in filteredQuizzes"
                    :key="quiz.id"
                    :quiz="quiz"
                />
            </div>

            <!-- Empty State -->
            <div v-if="filteredQuizzes.length === 0" class="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-zinc-100">No quizzes found</h3>
                <p class="mt-1 text-gray-500 dark:text-zinc-400">Try adjusting your search or filter criteria</p>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import QuizCard from '~/components/Console/students/QuizCard.vue'

// Mock data - replace with actual API call
const quizzes = ref([
    {
        id: 1,
        title: 'Introduction to Vue.js',
        description: 'Test your knowledge of Vue.js fundamentals including components, directives, and lifecycle hooks.',
        image: '/images/vue-quiz.jpg',
        duration: 30,
        points: 100,
        questionCount: 20,
        attempts: 3,
        status: 'not_started'
    },
    {
        id: 2,
        title: 'JavaScript Basics',
        description: 'A comprehensive quiz covering JavaScript fundamentals, ES6 features, and common programming patterns.',
        image: '/images/js-quiz.jpg',
        duration: 45,
        points: 150,
        questionCount: 30,
        attempts: 2,
        status: 'in_progress'
    },
    {
        id: 3,
        title: 'CSS Mastery',
        description: 'Test your CSS skills including flexbox, grid, animations, and responsive design principles.',
        image: '/images/css-quiz.jpg',
        duration: 25,
        points: 80,
        questionCount: 15,
        attempts: 0,
        status: 'completed'
    }
])

const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('date-desc')
const totalPoints = ref(330)

const filteredQuizzes = computed(() => {
    let filtered = quizzes.value

    // Apply search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(quiz => 
            quiz.title.toLowerCase().includes(query) ||
            quiz.description.toLowerCase().includes(query)
        )
    }

    // Apply status filter
    if (statusFilter.value !== 'all') {
        filtered = filtered.filter(quiz => quiz.status === statusFilter.value)
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
        switch (sortBy.value) {
            case 'points-desc':
                return b.points - a.points
            case 'points-asc':
                return a.points - b.points
            case 'date-asc':
                return a.id - b.id
            default: // date-desc
                return b.id - a.id
        }
    })

    return filtered
})
</script>