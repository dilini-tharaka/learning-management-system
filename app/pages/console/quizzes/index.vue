<template>
  <div>
    <NuxtLayout name="console">
      <ConsoleStudentsQuiz v-if="user.role === 'STUDENT'" />
      <ConsoleModeratorsQuiz v-else />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { user } = useAuth()
</script>