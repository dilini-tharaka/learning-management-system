<template>
  <section class="relative py-24 -mb-24 overflow-visible">
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
    </div>

    <div class="container px-4 mx-auto relative">
      <div class="max-w-6xl mx-auto">
        <!-- Main Content Card with Enhanced Styling -->
        <div class="bg-white dark:bg-background rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div class="grid md:grid-cols-2 gap-12 items-center ">
            <!-- Left Column - Form -->
            <div class="relative ">
              <div class="max-w-xl p-8 md:p-12">
                <!-- Header -->
                <div class="mb-12">
                  <h2 class="text-4xl font-bold font-recoleta mb-4">Join Our Learning Community</h2>
                  <p class="text-lg text-gray-600 dark:text-gray-400">
                    Take the first step towards academic excellence. Fill out the form below and we'll get back to you shortly.
                  </p>
                </div>

                <!-- Form -->
                <form @submit.prevent="handleSubmit" class="space-y-6 relative">
                  <!-- Decorative Elements -->
                  <div class="absolute -top-12 -left-12 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
                  <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>

                  <!-- Full Width Name Input -->
                  <div class="w-full">
                    <UFormGroup label="Full Name" name="name" class="mb-1">
                      <UInput
                        v-model="form.name"
                        placeholder="Enter your full name"
                        :error="errors.name"
                        color="primary"
                        
                      />
                    </UFormGroup>
                  </div>

                  <!-- Two Column Layout for Grade and Phone -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Grade Selection -->
                    <div>
                      <UFormGroup label="Current Grade" name="grade" class="mb-1">
                        <USelectMenu
                          v-model="form.grade"
                          :options="gradeOptions"
                          placeholder="Select your grade"
                          :error="errors.grade"
                           color="primary"
                        />
                      </UFormGroup>
                    </div>

                    <!-- Phone Input -->
                    <div>
                      <UFormGroup label="Phone Number" name="phone" class="mb-1">
                        <UInput
                          v-model="form.phone"
                          placeholder="Enter your phone number"
                          :error="errors.phone"
                           color="primary"
                        />
                      </UFormGroup>
                    </div>
                  </div>

                  <!-- Full Width Email Input -->
                  <div class="w-full">
                    <UFormGroup label="Email Address" name="email" class="mb-1">
                      <UInput
                        v-model="form.email"
                        type="email"
                        placeholder="Enter your email address"
                        :error="errors.email"
                         color="primary"
                      />
                    </UFormGroup>
                  </div>

                  <!-- Submit Button with modified styling -->
                  <div class="pt-4">
                    <UButton
                      type="submit"
                      color="primary"
                      size="xl"
                      block
                      :loading="isSubmitting"
                      class="relative overflow-hidden group"
                    >
                      <span class="relative z-10 flex items-center justify-center">
                        Submit Application
                        <Icon name="i-heroicons-paper-airplane" 
                          class="ml-2 transform group-hover:translate-x-1 transition-transform"
                        />
                      </span>
                    </UButton>
                  </div>
                </form>
              </div>
            </div>

            <!-- Right Column - Image -->
            <div class="relative hidden md:block">
              <div class="relative h-[650px] rounded-r-2xl overflow-hidden">
                <img 
                  src="/images/join-with-us.jpg" 
                  alt="Student Learning"
                  class="w-full h-full object-cover"
                />
                <!-- Overlay gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              <!-- Decorative Elements -->
              
              <div class="absolute top-2 left-2 bg-white dark:bg-background p-2 rounded-xl shadow-lg">
                <Icon name="i-heroicons-light-bulb-20-solid" class="text-4xl text-primary"/>
              </div>

              <!-- Stats Card -->
              <div class="absolute bottom-8 right-8 bg-white dark:bg-background/95 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div class="flex items-center gap-3">
                  <Icon name="i-heroicons-users-20-solid" class="text-2xl text-primary"/>
                  <div class="text-sm">
                    <div class="font-bold">500+ Students</div>
                    <div class="text-gray-600 dark:text-gray-400">Already joined</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Decorative Wave -->
          <!-- <div class="absolute -bottom-px left-0 right-0 h-8 bg-background-secondary dark:bg-background-dark">
            <svg class="absolute bottom-0 w-full h-8" preserveAspectRatio="none" viewBox="0 0 1200 120">
              <path 
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                class="fill-background-secondary dark:fill-background-dark"
              ></path>
            </svg>
          </div> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const form = ref({
  name: '',
  grade: '',
  email: '',
  phone: ''
})

const errors = ref({
  name: '',
  grade: '',
  email: '',
  phone: ''
})

const isSubmitting = ref(false)

const gradeOptions = [
  { label: 'Grade 6', value: '6' },
  { label: 'Grade 7', value: '7' },
  { label: 'Grade 8', value: '8' },
  { label: 'Grade 9', value: '9' },
  { label: 'Grade 10', value: '10' },
  { label: 'Grade 11', value: '11' }
]

const validateForm = () => {
  errors.value = {
    name: !form.value.name ? 'Name is required' : '',
    grade: !form.value.grade ? 'Grade is required' : '',
    email: !form.value.email ? 'Email is required' : '',
    phone: !form.value.phone ? 'Phone number is required' : ''
  }

  return !Object.values(errors.value).some(error => error)
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    // Add your form submission logic here
    console.log('Form submitted:', form.value)
    // Reset form after successful submission
    form.value = {
      name: '',
      grade: '',
      email: '',
      phone: ''
    }
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15);
}
</style>
