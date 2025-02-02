<template>
  <div>
    <NuxtLayout name="web">
      <main>
        <LandingHero />
        <LandingIntroduction />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingCTASection />
        <LandingJoinForm />
      </main>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const headerLinks = [
  { label: "Features", to: "#features" },
  { label: "Pricing", to: "#pricing" },
  { label: "Documentation", to: "#docs" },
];
</script>
