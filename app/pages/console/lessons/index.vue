<template>
  <div>
    <NuxtLayout name="console">
      <ConsoleStudentsLesson v-if="user.role === 'STUDENT'" />
      <ConsoleModeratorsLesson v-else />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { user } = useAuth()
</script>