<template>
  <ClientOnly>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="handleClose" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-3xl transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                <video 
                  ref="videoRef"
                  class="w-full rounded-lg" 
                  controls
                  autoplay
                  @loadeddata="videoLoaded = true"
                  @error="handleVideoError"
                >
                  <source :src="videoUrl" type="video/mp4">
                </video>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps<{
  videoUrl: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const videoLoaded = ref(false)
const error = ref('')

const handleClose = () => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
  emit('update:isOpen', false)
}

const handleVideoError = () => {
  error.value = 'Error loading video. Please make sure the video file exists.'
  console.error('Video error:', videoRef.value?.error)
}

onMounted(() => {
  console.log('VideoModal mounted, URL:', props.videoUrl)
})

watch(() => props.isOpen, (newVal) => {
  console.log('Modal open state changed:', newVal)
  if (newVal && videoRef.value) {
    videoRef.value.play()
  }
})
</script>
