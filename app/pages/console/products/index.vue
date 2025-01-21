<template>
  <div>
    <NuxtLayout name="console">
      <ConsoleStudentsProduct v-if="user.role === 'STUDENT'" />
      <ConsoleModeratorsProduct v-else />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { user } = useAuth()
</script>