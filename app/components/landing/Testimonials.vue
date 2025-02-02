<template>
  <section class="py-24 bg-background-secondary">
    <div class="container px-4 mx-auto">
      <div class="max-w-3xl mx-auto text-center mb-16">
        <h2 class="text-4xl font-bold font-recoleta mb-4">
          What Our Students Say
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          Real feedback from our community.
        </p>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        <!-- Featured Testimonial (Large) -->
        <div class="md:col-span-2 md:row-span-2 p-8 bg-white dark:bg-background rounded-2xl shadow-lg">
          <div class="flex items-center mb-6">
            <img :src="generateAvatar('yasiru')" alt="Yasiru" class="w-16 h-16 rounded-full mr-4"/>
            <div>
              <h4 class="font-bold text-xl">Yasiru Ravishan</h4>
              <p class="text-sm text-gray-500">Top Performer 2023</p>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-lg mb-6">
            "The Science Lab LMS has completely transformed my learning experience. The detailed video lessons and interactive quizzes have helped me master complex concepts. I've improved my grades significantly, and the reward system keeps me motivated. It's not just a learning platform; it's a complete game-changer!"
          </p>
          
        </div>

        <!-- Regular Testimonial -->
        <div class="md:col-span-2 p-6 bg-white dark:bg-background rounded-2xl shadow-lg">
          <div class="flex items-center mb-4">
            <img :src="generateAvatar('kavinda')" alt="Kavinda" class="w-12 h-12 rounded-full mr-3"/>
            <div>
              <h4 class="font-bold text-lg">Kavinda</h4>
              <p class="text-sm text-gray-500">Biology Enthusiast</p>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            "The video lessons are incredibly clear and easy to follow. Love how everything is explained step by step!"
          </p>
        </div>

        <!-- Compact Testimonial -->
        <div class="p-6 bg-white dark:bg-background rounded-2xl shadow-lg">
          <div class="flex items-center mb-4">
            <img :src="generateAvatar('kokila')" alt="Kokila" class="w-12 h-12 rounded-full mr-3"/>
            <div>
              <h4 class="font-bold text-lg">Kokila</h4>
              <p class="text-sm text-gray-500">Chemistry Fan</p>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            "Earning rewards while learning makes it so much more engaging!"
          </p>
        </div>

        <!-- New Vertical Testimonial -->
        <div class="md:row-span-2 p-6 bg-white dark:bg-background rounded-2xl shadow-lg">
          <div class="flex items-center mb-4">
            <img :src="generateAvatar('tharushi')" alt="Tharushi" class="w-12 h-12 rounded-full mr-3"/>
            <div>
              <h4 class="font-bold text-lg">Tharushi</h4>
              <p class="text-sm text-gray-500">Science Scholar</p>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            "Having access to past papers and detailed solutions has been invaluable. The way concepts are broken down makes even complex topics easy to understand. Plus, the mobile-friendly interface lets me study anywhere!"
          </p>
          
        </div>

        <!-- Medium Testimonial -->
        <div class="md:col-span-2 p-6 bg-white dark:bg-background rounded-2xl shadow-lg">
          <div class="flex items-center mb-4">
            <img :src="generateAvatar('chamod')" alt="Chamod" class="w-12 h-12 rounded-full mr-3"/>
            <div>
              <h4 class="font-bold text-lg">Chamod</h4>
              <p class="text-sm text-gray-500">Physics Enthusiast</p>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            "The practice quizzes helped me identify my weak areas and focus on improvement. Great learning experience!"
          </p>
        </div>

        <!-- New Small Testimonial -->
        <div class="p-6 bg-white dark:bg-background rounded-2xl shadow-lg">
          <div class="flex items-center mb-4">
            <img :src="generateAvatar('dulaj')" alt="Dulaj" class="w-12 h-12 rounded-full mr-3"/>
            <div>
              <h4 class="font-bold text-lg">Dulaj</h4>
              <p class="text-sm text-gray-500">Quick Learner</p>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            "The instant feedback on quizzes helps me learn from my mistakes right away!"
          </p>
        </div>

        <!-- New Medium Testimonial -->
        <div class="md:col-span-2 p-6 bg-white dark:bg-background rounded-2xl shadow-lg">
          <div class="flex items-center mb-4">
            <img :src="generateAvatar('sithumi')" alt="Sithumi" class="w-12 h-12 rounded-full mr-3"/>
            <div>
              <h4 class="font-bold text-lg">Sithumi</h4>
              <p class="text-sm text-gray-500">Dedicated Learner</p>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            "The weekly live Q&A sessions are fantastic! Being able to ask questions directly has helped clear up many doubts."
          </p>
        </div>
        <div class="md:col-span-2 p-6 bg-white dark:bg-background rounded-2xl shadow-lg">
          <div class="flex items-center mb-4">
            <img :src="generateAvatar('nadeesha')" alt="Nadeesha" class="w-12 h-12 rounded-full mr-3"/>
            <div>
              <h4 class="font-bold text-lg">Nadeesha</h4>
              <p class="text-sm text-gray-500">Dedicated Learner</p>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            "Mr. Chathura’s videos helped me score an A in O/L Science! The quizzes are super fun!"
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const generateAvatar = (username: string) => {
  // Using DiceBear API with 'micah' style
  return `https://api.dicebear.com/7.x/micah/svg?seed=${username}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}

// List of testimonials for easier management
const testimonials = [
  { name: 'Yasiru Ravishan', role: 'Top Performer 2023', seed: 'yasiru' },
  { name: 'Kavinda', role: 'Biology Enthusiast', seed: 'kavinda' },
  { name: 'Kokila', role: 'Chemistry Fan', seed: 'kokila' },
  { name: 'Tharushi', role: 'Science Scholar', seed: 'tharushi' },
  { name: 'Chamod', role: 'Physics Enthusiast', seed: 'chamod' },
  { name: 'Dulaj', role: 'Quick Learner', seed: 'dulaj' },
  { name: 'Sithumi', role: 'Dedicated Learner', seed: 'sithumi' },
  { name: 'Nadeesha', role: 'Dedicated Learner', seed: 'nadeesha' }
]
</script>
