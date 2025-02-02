<template>
  <section class="relative py-24 overflow-hidden">
    <!-- Background Image with Science Theme -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 dark:opacity-5"
      style="background-image: url('/images/CTA.webp')"
    ></div>
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>    
    <!-- Floating Science Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Animated Atoms and Molecules -->
      <div class="absolute top-10 left-10 animate-float-slow">
        <Icon name="i-heroicons-beaker" class="w-12 h-12 text-primary/20" />
      </div>
      <div class="absolute top-20 right-20 animate-float">
        <Icon name="i-heroicons-cube-transparent" class="w-16 h-16 text-primary/30" />
      </div>
      <div class="absolute bottom-10 left-1/4 animate-float-slow">
        <Icon name="i-heroicons-light-bulb" class="w-10 h-10 text-primary/20" />
      </div>
      <div class="absolute top-1/3 right-1/4 animate-float">
        <Icon name="i-heroicons-academic-cap" class="w-14 h-14 text-primary/25" />
      </div>
    </div>

    <div class="relative container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Content Card -->
        <div class="bg-background/50 backdrop-blur-lg rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
          <!-- Decorative Corner Elements -->
          <div class="absolute -top-6 -right-6 w-36 h-36 bg-primary/20 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-6 -left-6 w-36 h-36 bg-primary/20 rounded-full blur-2xl"></div>

          <div class="text-center">
            <h2 class="text-4xl md:text-5xl font-bold font-recoleta mb-6">
              Begin Your Science Journey Today!
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join hundreds of successful students who have transformed their understanding of science through our interactive platform.
            </p>

            <!-- Stats Section -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div class="text-center">
                <div class="text-3xl font-bold text-primary mb-1">500+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Active Students</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary mb-1">100+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Video Lessons</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary mb-1">1000+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Quiz Questions</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary mb-1">95%</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <UButton 
                size="xl"
                color="primary"
                class="min-w-[200px] transform transition hover:scale-105"
              >
                Start Learning Now
                <Icon name="i-heroicons-rocket-launch" class="ml-2"/>
              </UButton>
              <UButton
                size="xl"
                variant="ghost"
                class="min-w-[200px] group"
                @click="showDemoVideo = true"
              >
                Watch Demo Class
                <Icon name="i-heroicons-play-circle" 
                  class="ml-2 transform group-hover:scale-110 transition"
                />
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Video Modal -->
    <VideoModal
      v-model:isOpen="showDemoVideo"
      :video-url="demoVideoUrl"
    />
  </section>
</template>

<script setup lang="ts">
import VideoModal from '../common/VideoModal.vue'

const showDemoVideo = ref(false)
const demoVideoUrl = ref('https://archive.org/download/ScienceClassDemo/science-class-demo.mp4') // Replace with your actual demo video URL
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

/* Add subtle pattern animation */
@keyframes pattern-shift {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}

.bg-pattern-animate {
  animation: pattern-shift 30s linear infinite;
}
</style>
