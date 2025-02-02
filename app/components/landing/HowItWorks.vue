<template>
  <section class="py-24 overflow-hidden">
    <div class="container px-4 mx-auto">
      <!-- Header -->
      <div class="max-w-3xl mx-auto text-center mb-16">
        <h2 class="text-4xl font-bold font-recoleta mb-4">
          Your Learning Journey
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          Follow the path to success in 3 easy steps
        </p>
      </div>

      <!-- Timeline Area -->
      <div class="relative max-w-4xl mx-auto">
        <!-- Vertical Line -->
        <div class="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/50 transform -translate-x-1/2"></div>
        
        <div class="space-y-16">
          <!-- Step 1 (Content on Right) -->
          <div class="relative flex items-center">
            <!-- Left Side Placeholder -->
            <div class="w-3/4"></div>
            <!-- Timeline & Branch Line -->
            <div class="relative w-1/2 flex items-center">
              <!-- Horizontal Branch Line extending to right -->
              <div class="absolute hidden lg:block left-0 w-full h-[2px] bg-primary/20 border-t-2 border-dashed border-primary"></div>
              <!-- Icon aligned near branch line -->
              <div class="relative ml-auto">
                <div class="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white">
                  <Icon name="i-heroicons-finger-print-20-solid" class="text-3xl"/>
                </div>
              </div>
            </div>
            <!-- Right Side Content -->
            <div class="w-full lg:w-1/2 pl-8">
              <h3 class="text-2xl font-semibold mb-4">Sign In</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Use your class credentials to access your personalized learning dashboard.
              </p>
            </div>
          </div>

          <!-- Step 2 (Content on Left) -->
          <div class="relative flex items-center" data-aos="fade-up">
            <!-- Left Side Content -->
            <div class="w-full lg:w-1/2 pr-8 text-right">
              <h3 class="text-2xl font-semibold mb-4">Learn & Practice</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Dive into video lessons and strengthen your knowledge with chapter quizzes.
              </p>
            </div>
            <!-- Timeline & Branch Line -->
            <div class="relative w-1/2 flex items-center">
              <!-- Horizontal Branch Line extending to left -->
              <div class="absolute hidden lg:block right-0 w-full h-[2px] bg-primary/20 border-t-2 border-dashed border-primary"></div>
              <!-- Icon aligned near branch line -->
              <div class="relative mr-auto">
                <div class="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white">
                  <Icon name="i-heroicons-academic-cap-20-solid" class="text-3xl"/>
                </div>
              </div>
            </div>
            <!-- Right Side Placeholder -->
            <div class="w-3/4"></div>
          </div>

          <!-- Step 3 (Content on Right) -->
          <div class="relative flex items-center" data-aos="fade-up">
            <!-- Left Side Placeholder -->
            <div class="w-3/4"></div>
            <!-- Timeline & Branch Line -->
            <div class="relative w-1/2 flex items-center">
              <!-- Horizontal Branch Line extending to right -->
              <div class="absolute hidden lg:block left-0 w-full h-[2px] bg-primary/20 border-t-2 border-dashed border-primary"></div>
              <!-- Icon aligned near branch line -->
              <div class="relative ml-auto">
                <div class="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white">
                  <Icon name="i-heroicons-trophy-20-solid" class="text-3xl"/>
                </div>
              </div>
            </div>
            <!-- Right Side Content -->
            <div class="w-full lg:w-1/2 pl-8">
              <h3 class="text-2xl font-semibold mb-4">Earn & Enjoy</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Collect Science Stars, redeem exciting rewards, and track your progress!
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Call-to-Action Button -->
      <div class="mt-16 text-center">
        <UButton color="primary" size="lg" class="px-8">
          Join With Us
          <Icon name="i-heroicons-arrow-right-20-solid" />
        </UButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
[data-aos] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
[data-aos].aos-animate {
  opacity: 1;
  transform: translateY(0);
}
</style>

<script setup>
onMounted(() => {
  document.querySelectorAll('[data-aos]').forEach(el => el.classList.add('aos-animate'));
});
</script>
