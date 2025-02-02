<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
    <Header :links="headerLinks" />

    <main class="flex-1">
      <slot />
    </main>

    <Footer :links="footerLinks" />
  </div>
</template>

<script setup lang="ts">
const headerLinks = [
  { label: "Home", to: "#features" },
  { label: "About us", to: "#pricing" },
  { label: "Testimonials", to: "#docs" },
];

const footerLinks = [
  { label: "About", to: "/about" },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
];
</script>
