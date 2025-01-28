<template>
    <div class="space-y-6">
        <!-- Header and Search -->
        <div class="space-y-4">
            <h1 class="text-2xl font-semibold">Student Quizzes</h1>
            
            <!-- Search and Filter -->
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
                    <option value="all">All Quizzes</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Not Completed</option>
                </select>
            </div>
        </div>

        <!-- Quizzes Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
                v-for="quiz in filteredQuizzes" 
                :key="quiz.id"
                class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-gray-300 dark:hover:border-zinc-600 cursor-pointer relative p-6"
            >
                <!-- Quiz Title and Status Badge -->
                <div class="flex justify-between items-start mb-4">
                    <h3 class="font-medium text-lg">{{ quiz.title }}</h3>
                    <span 
                        :class="[
                            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                            quiz.completed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        ]"
                    >
                        {{ quiz.completed ? 'Completed' : 'Not Completed' }}
                    </span>
                </div>

                <!-- Description -->
                <p class="text-gray-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                    {{ quiz.description }}
                </p>

                <!-- Date and Score -->
                <div class="flex flex-wrap gap-2 mt-auto">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-zinc-700/50 dark:text-zinc-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                        </svg>
                        {{ formatDate(quiz.date) }}
                    </span>
                    <span 
                        v-if="quiz.completed"
                        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Score: {{ quiz.score }}%
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sample data - Replace with actual data from your API
const quizzes = [
    {
        id: 1,
        title: 'Mathematics Quiz 1',
        description: 'Test your knowledge of basic algebra and arithmetic operations.',
        date: '2025-01-28T14:30:00',
        completed: true,
        score: 85
    },
    {
        id: 2,
        title: 'Chemistry Mid-Term',
        description: 'Comprehensive quiz covering organic chemistry and chemical bonding.',
        date: '2025-01-29T10:00:00',
        completed: false
    },
    {
        id: 3,
        title: 'Physics Final Exam',
        description: 'Final assessment covering mechanics, waves, and thermodynamics.',
        date: '2025-01-30T15:00:00',
        completed: true,
        score: 92
    }
]

const searchQuery = ref('')
const statusFilter = ref('all')

// Filter quizzes based on search query and status
const filteredQuizzes = computed(() => {
    return quizzes
        .filter(quiz => {
            const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                                quiz.description.toLowerCase().includes(searchQuery.value.toLowerCase())
            
            const matchesStatus = statusFilter.value === 'all' ||
                                (statusFilter.value === 'completed' && quiz.completed) ||
                                (statusFilter.value === 'pending' && !quiz.completed)
            
            return matchesSearch && matchesStatus
        })
})

// Format date to a more readable format
const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(date)
}
</script>