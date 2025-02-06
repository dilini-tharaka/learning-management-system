<template>
    <div class="min-h-screen bg-gray-50 dark:bg-zinc-900">
        <!-- Quiz Timer -->
        <QuizTimer 
            :duration="quiz.duration * 60"
            :onTimeUp="handleTimeUp"
        />

        <!-- Main Content -->
        <div class="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <!-- Quiz Questions -->
                    <div class="lg:col-span-3">
                        <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                            <QuizQuestion
                                :question="currentQuestion"
                                :currentNumber="currentQuestionIndex + 1"
                                :totalQuestions="quiz.questions.length"
                                :savedAnswer="userAnswers[currentQuestionIndex]"
                                @previous="previousQuestion"
                                @next="nextQuestion"
                                @answer="saveAnswer"
                            />
                        </div>
                    </div>

                    <!-- Quiz Progress -->
                    <div class="lg:col-span-1">
                        <QuizProgress
                            :currentQuestion="currentQuestionIndex + 1"
                            :totalQuestions="quiz.questions.length"
                            :answeredQuestions="answeredQuestionIndexes"
                            @jump="jumpToQuestion"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Import components
const QuizTimer = defineAsyncComponent(() => 
    import('~/components/Console/students/QuizTimer.vue')
)
const QuizQuestion = defineAsyncComponent(() => 
    import('~/components/Console/students/QuizQuestion.vue')
)
const QuizProgress = defineAsyncComponent(() => 
    import('~/components/Console/students/QuizProgress.vue')
)

const route = useRoute()
const router = useRouter()

// Mock quiz data - replace with actual API call
const quiz = ref({
    id: route.params.id,
    title: 'Sample Quiz',
    duration: 30, // in minutes
    questions: [
        {
            id: 1,
            text: 'What is Vue.js?',
            options: [
                { id: 'a', text: 'A backend framework' },
                { id: 'b', text: 'A progressive JavaScript framework for building user interfaces' },
                { id: 'c', text: 'A database management system' },
                { id: 'd', text: 'A testing framework' }
            ]
        },
        {
            id: 2,
            text: 'Which directive is used for two-way data binding in Vue?',
            options: [
                { id: 'a', text: 'v-bind' },
                { id: 'b', text: 'v-model' },
                { id: 'c', text: 'v-on' },
                { id: 'd', text: 'v-for' }
            ]
        },
        {
            id: 3,
            text: 'What is Vuex used for?',
            options: [
                { id: 'a', text: 'State management' },
                { id: 'b', text: 'Routing' },
                { id: 'c', text: 'Form validation' },
                { id: 'd', text: 'API calls' }
            ]
        },
        {
            id: 4,
            text: 'Which lifecycle hook is called after the component is mounted?',
            options: [
                { id: 'a', text: 'created' },
                { id: 'b', text: 'beforeMount' },
                { id: 'c', text: 'mounted' },
                { id: 'd', text: 'updated' }
            ]
        },
        {
            id: 5,
            text: 'What is the composition API?',
            options: [
                { id: 'a', text: 'A way to compose music in Vue' },
                { id: 'b', text: 'A new way to organize component logic in Vue 3' },
                { id: 'c', text: 'A routing system' },
                { id: 'd', text: 'A testing framework' }
            ]
        },
        {
            id: 6,
            text: 'Which of these is NOT a Vue directive?',
            options: [
                { id: 'a', text: 'v-if' },
                { id: 'b', text: 'v-show' },
                { id: 'c', text: 'v-loop' },
                { id: 'd', text: 'v-else' }
            ]
        },
        {
            id: 7,
            text: 'What is the purpose of Vue Router?',
            options: [
                { id: 'a', text: 'To manage state' },
                { id: 'b', text: 'To handle routing in Vue applications' },
                { id: 'c', text: 'To make API calls' },
                { id: 'd', text: 'To validate forms' }
            ]
        },
        {
            id: 8,
            text: 'Which method is used to create a new Vue application?',
            options: [
                { id: 'a', text: 'new Vue()' },
                { id: 'b', text: 'createApp()' },
                { id: 'c', text: 'Vue.create()' },
                { id: 'd', text: 'makeVue()' }
            ]
        },
        {
            id: 9,
            text: 'What is the purpose of computed properties in Vue?',
            options: [
                { id: 'a', text: 'To compute mathematical calculations' },
                { id: 'b', text: 'To cache and update values based on their dependencies' },
                { id: 'c', text: 'To style components' },
                { id: 'd', text: 'To make API calls' }
            ]
        },
        {
            id: 10,
            text: 'Which of these is a valid way to emit an event in Vue?',
            options: [
                { id: 'a', text: 'this.emit("event")' },
                { id: 'b', text: 'emit.event()' },
                { id: 'c', text: '$emit("event")' },
                { id: 'd', text: 'event.emit()' }
            ]
        }
    ]
})

// Current question index and user answers
const currentQuestionIndex = ref(0)
const userAnswers = ref([])

// Computed properties
const currentQuestion = computed(() => quiz.value.questions[currentQuestionIndex.value])
const answeredQuestionIndexes = computed(() => {
    return userAnswers.value.map((answer, index) => answer ? index : null).filter(index => index !== null)
})

// Navigation functions
const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--
    }
}

const nextQuestion = () => {
    if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
        currentQuestionIndex.value++
    } else {
        submitQuiz()
    }
}

const jumpToQuestion = (index) => {
    if (index >= 0 && index < quiz.value.questions.length) {
        currentQuestionIndex.value = index
    }
}

const saveAnswer = (answer) => {
    userAnswers.value[currentQuestionIndex.value] = answer
}

const handleTimeUp = () => {
    submitQuiz()
}

const submitQuiz = () => {
    // Check if all questions are answered
    const unansweredQuestions = userAnswers.value.findIndex(answer => answer === null)
    
    if (unansweredQuestions !== -1) {
        // Show warning about unanswered questions
        alert(`You have ${userAnswers.value.filter(a => a === null).length} unanswered questions. Please answer all questions before submitting.`)
        // Jump to first unanswered question
        currentQuestionIndex.value = unansweredQuestions
        return
    }

    // Process quiz submission
    console.log('Quiz submitted:', userAnswers.value)
    // Here you would typically make an API call to submit the answers
    
    // Navigate to results page or show results modal
    router.push('/console/quizzes')
}

onMounted(() => {
    // Initialize userAnswers array with null values
    userAnswers.value = new Array(quiz.value.questions.length).fill(null)
})
</script>

<style>
/* Remove default layout padding since we're managing it ourselves */
.page-wrapper {
    padding: 0 !important;
}
</style>
