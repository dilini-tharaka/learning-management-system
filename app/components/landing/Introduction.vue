<template>
  <section class="py-24 bg-background-secondary">
    <div class="container px-4 mx-auto">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- Left Column - Image -->
        <div class="relative">
          <div class="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="/images/about.avif" 
              alt="Interactive Science Class"
              class="w-full h-full object-cover"
            />
            <!-- Overlay gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
          </div>
          <!-- Top Left Icon - Replace image with icon -->
          <div class="absolute -top-6 -left-6 bg-white dark:bg-background p-4 rounded-xl shadow-lg">
            <Icon name="i-heroicons-light-bulb-20-solid" class="text-4xl text-primary"/>
          </div>
          <!-- Bottom Right Image -->
          <div class="absolute -bottom-6 -right-6 bg-white dark:bg-background p-1 rounded-xl shadow-lg bg-gradient-to-t from-primary/40 to-transparent">
            <img src="/images/bottom-right.jpg" alt="Bottom Right Image" class="w-52 h-36  rounded-xl shadow-lg" />
          </div>
          <!-- Floating elements
          <div class="absolute -top-6 -right-6 bg-white dark:bg-background p-4 rounded-xl shadow-lg">
            <Icon name="i-heroicons-beaker-20-solid" class="text-4xl text-primary"/>
          </div>
          <div class="absolute -bottom-6 -left-6 bg-white dark:bg-background p-4 rounded-xl shadow-lg">
            <Icon name="i-heroicons-light-bulb-20-solid" class="text-4xl text-primary"/>
          </div> -->
        </div>

        <!-- Right Column - Content -->
        <div class="space-y-10">
          <div>
            <h2 class="text-4xl font-bold font-recoleta mb-6">
              What is Science Lab LMS?
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              Your gateway to interactive science education in Sri Lanka, designed to make learning engaging and rewarding.
            </p>
          </div>

          <div class="space-y-8">
            <div class="relative pl-16">
              <div class="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon name="i-heroicons-play-circle-20-solid" class="text-2xl text-primary"/>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Video Lessons</h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Access high-quality recorded lessons by Mr. Chathura Nellampitiya, covering the complete science curriculum.
                </p>
              </div>
            </div>

            <div class="relative pl-16">
              <div class="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon name="i-heroicons-puzzle-piece-20-solid" class="text-2xl text-primary"/>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Interactive Learning</h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Engage with quizzes, assignments, and practice tests to reinforce your understanding of scientific concepts.
                </p>
              </div>
            </div>

            <div class="relative pl-16">
              <div class="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon name="i-heroicons-star-20-solid" class="text-2xl text-primary"/>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Rewards System</h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Earn points through active participation and high quiz scores, redeemable for exciting educational gifts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Introduction'
}
</script>

<style scoped>
.bg-background-secondary {
  background-color: #f0f4f8;
}
</style>
