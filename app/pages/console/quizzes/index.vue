<template>
  <NuxtLayout name="console">
    <template v-if="user.role === 'STUDENT'">
      <ConsoleStudentsQuiz />
    </template>
    <template v-else>
      <Quiz />
    </template>
  </NuxtLayout>
</template>

<script setup>
const { user } = useAuth()
import Quiz from '~/components/Console/moderators/Quiz.vue'
</script>