<template>
  <div class="min-h-screen flex items-center bg-gray-50 dark:bg-zinc-950">
    <div class="container max-w-2xl mx-auto py-16 px-4 sm:px-6">
      <div class="space-y-8">
        <!-- Header -->
        <div class="text-center space-y-2">
          <h1 class="text-3xl font-bold">Complete Your Profile</h1>
          <p class="text-gray-600 dark:text-zinc-400">
            Let's get started with your learning journey
          </p>
        </div>

        <!-- Progress -->
        <div class="relative">
          <div class="flex justify-between mb-4">
            <div
              v-for="(step, index) in steps"
              :key="step.title"
              class="text-center flex-1"
            >
              <div
                class="text-sm mb-2"
                :class="
                  currentStep >= index ? 'text-primary-500' : 'text-gray-500'
                "
              >
                Step {{ index + 1 }}
              </div>
              <div
                class="text-sm font-medium"
                :class="
                  currentStep >= index
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500'
                "
              >
                {{ step.title }}
              </div>
            </div>
          </div>
          <div
            class="overflow-hidden h-2 mb-4 flex rounded bg-gray-200 dark:bg-zinc-800"
          >
            <div
              class="transition-all duration-500 bg-primary-500"
              :style="{ width: `${(currentStep / (steps.length - 1)) * 100}%` }"
            />
          </div>
        </div>

        <!-- Setup Form -->
        <UCard>
          <UForm
            :schema="currentSchema"
            :state="form"
            class="space-y-6"
            @submit="handleNext"
          >
            <!-- Personal Information Step -->
            <div v-if="currentStep === 0" class="space-y-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <UFormGroup label="First Name" name="firstName">
                  <UInput
                    v-model="form.firstName"
                    placeholder="Enter your first name"
                  />
                </UFormGroup>

                <UFormGroup label="Last Name" name="lastName">
                  <UInput
                    v-model="form.lastName"
                    placeholder="Enter your last name"
                  />
                </UFormGroup>
              </div>

              <UFormGroup label="Date of Birth" name="dateOfBirth">
                <UInput v-model="form.dateOfBirth" type="date" />
              </UFormGroup>
            </div>

            <!-- Contact Information Step -->
            <div v-if="currentStep === 1" class="space-y-4">
              <UFormGroup label="Phone Number" name="phone">
                <UInput v-model="form.phone" placeholder="+1 (555) 000-0000" />
              </UFormGroup>

              <UFormGroup label="Parent/Guardian Phone" name="guardianPhone">
                <UInput
                  v-model="form.guardianPhone"
                  placeholder="+1 (555) 000-0000"
                />
              </UFormGroup>

              <UFormGroup label="Address" name="address">
                <UTextarea
                  v-model="form.address"
                  :rows="3"
                  placeholder="Enter your address"
                />
              </UFormGroup>
            </div>

            <!-- Educational Background Step -->
            <div v-if="currentStep === 2" class="space-y-4">
              <UFormGroup label="Current School" name="school">
                <UInput
                  v-model="form.school"
                  placeholder="Enter your school name"
                />
              </UFormGroup>

              <UFormGroup label="Current Grade" name="grade">
                <ConsoleStudentsGradeSelector
                  v-model="form.grade"
                  placeholder="Select your grade"
                />
              </UFormGroup>
            </div>

            <!-- Form Navigation -->
            <div class="flex justify-between">
              <UButton
                v-if="currentStep > 0"
                type="button"
                color="gray"
                @click="currentStep--"
              >
                Previous
              </UButton>
              <div class="flex-1" />
              <UButton type="submit" color="primary" :loading="loading">
                {{ isLastStep ? "Complete Setup" : "Next" }}
              </UButton>
            </div>
          </UForm>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const loading = ref(false);
const toast = useToast();
const currentStep = ref(0);

const steps = [
  { title: "Personal Information" },
  { title: "Contact Details" },
  { title: "Education Details" },
];

const form = ref({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  phone: "",
  guardianPhone: "",
  address: "",
  school: "",
  grade: "",
});

// Step-specific validation schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

const contactInfoSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  guardianPhone: z.string().min(1, "Guardian phone is required"),
  address: z.string().min(1, "Address is required"),
});

const educationSchema = z.object({
  school: z.string().min(1, "School name is required"),
  grade: z.string().min(1, "Grade is required"),
});

const schemas = [personalInfoSchema, contactInfoSchema, educationSchema];
const currentSchema = computed(() => schemas[currentStep.value]);
const isLastStep = computed(() => currentStep.value === steps.length - 1);

const handleNext = async () => {
  if (isLastStep.value) {
    await submitForm();
  } else {
    currentStep.value++;
  }
};

const submitForm = async () => {
  try {
    loading.value = true;
    // TODO: Implement API call to save profile
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.add({
      title: "Success",
      description: "Your profile has been set up successfully",
      color: "green",
    });

    navigateTo("/console/dashboard");
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Something went wrong",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};
</script>
