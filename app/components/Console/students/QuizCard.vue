<template>
    <div 
        @click="startQuiz"
        class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-600 cursor-pointer relative p-4 space-y-4"
    >
        <!-- Quiz Header -->
        <div class="flex items-center justify-between">
            <h3 class="font-medium text-lg">{{ quiz.title }}</h3>
            <!-- Points Badge -->
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/95 text-blue-700 dark:bg-blue-900/90 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {{ quiz.points }} Points
            </span>
        </div>
        
        <!-- Quiz Description -->
        <p class="text-gray-600 dark:text-zinc-400 text-sm line-clamp-2">
            {{ quiz.description }}
        </p>
        
        <!-- Quiz Info -->
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <!-- Duration -->
                <span class="inline-flex items-center text-sm text-gray-500 dark:text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    {{ quiz.duration }} mins
                </span>
                <!-- Questions Count -->
                <span class="inline-flex items-center text-sm text-gray-500 dark:text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                    </svg>
                    {{ quiz.questionCount }}
                </span>
                <!-- Attempts -->
                <span class="inline-flex items-center text-sm text-gray-500 dark:text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    {{ quiz.attempts }} Left
                </span>
            </div>
            <span 
                :class="[
                    'px-2.5 py-0.5 rounded-full text-xs font-medium',
                    quiz.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' :
                    quiz.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500'
                ]"
            >
                {{ formatStatus(quiz.status) }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    quiz: {
        type: Object,
        required: true
    }
})

const formatStatus = (status) => {
    return {
        'not_started': 'Not Started',
        'in_progress': 'In Progress',
        'completed': 'Completed'
    }[status] || status
}

const startQuiz = () => {
    // Only allow starting if quiz is not completed
    if (props.quiz.status !== 'completed' && props.quiz.attempts > 0) {
        router.push(`/console/quizzes/${props.quiz.id}`)
    }
}
</script>
