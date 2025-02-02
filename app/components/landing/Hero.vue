<template>
  <section class="relative overflow-hidden">
    <div class="container px-4 mx-auto">
      <div class="flex flex-wrap items-center -m-8">
        <div class="w-full md:w-1/2 p-8">
          <h1 class="font-bold text-5xl md:text-6xl tracking-tight mb-8 font-recoleta">
            Welcome to
            <span class="text-primary font-recoleta">
              <TypeWriter text="Science Lab LMS" :speed="150" />
            </span>
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join Mr. Chathura Nellampitiya's innovative science classes. Watch videos, take quizzes, earn points, and redeem exciting gifts!
          </p>
          <div class="flex flex-wrap gap-4">
            <UButton size="lg" color="primary">
              Join Now
              <Icon name="i-heroicons-arrow-right-20-solid" />
            </UButton>
            <UButton size="lg" variant="ghost" @click="showVideo = true">
              How We Work
              <Icon name="i-heroicons-play-circle-20-solid" class="text-2xl"/>
            </UButton>
          </div>
        </div>
        <div class="w-full md:w-1/2 p-8">
          <img src="/CN-profile-img.png" alt="Science Lab Hero" class="w-full" />
        </div>
      </div>
    </div>

    <VideoModal
      v-model:isOpen="showVideo"
      :video-url="videoUrl"
    />
  </section>
</template>

<script setup lang="ts">
import TypeWriter from '../common/TypeWriter.vue'
import VideoModal from '../common/VideoModal.vue'

const showVideo = ref(false)
const videoUrl = ref('https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4')

watch(showVideo, (newVal) => {
  console.log('Show video changed:', newVal)
})
</script>
