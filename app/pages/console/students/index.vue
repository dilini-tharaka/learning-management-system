<template>
  <div>
    <NuxtLayout name="console">
      <div class="min-h-screen space-y-6 bg-gray-50/50 dark:bg-zinc-900 p-6 rounded-xl">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold">Student Management</h1>
            <p class="text-gray-600 dark:text-zinc-400">Manage student accounts and enrollments</p>
          </div>
          <UButton 
            icon="i-heroicons-user-plus" 
            @click="showInviteModal = true"
          >
            Add Student
          </UButton>
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-4">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Search students..."
            class="max-w-sm"
          />
          <USelect
            v-model="status"
            :options="['All Status', 'Active', 'Pending', 'Suspended']"
            class="max-w-[200px]"
          />
        </div>

        <!-- Users Table -->
        <UTable
          :rows="paginatedStudents"
          :columns="columns"
          :loading="refreshing"
          :ui="{
            wrapper: 'min-h-[450px]'
          }"
        >
          <template #name-data="{ row }">
            <div class="flex items-center gap-3">
              <img 
                :src="`https://ui-avatars.com/api/?name=${row.name || row.email}&background=146de0&color=fff`"
                :alt="row.name || row.email"
                class="w-8 h-8 rounded-full"
              />
              <div>
                <div class="font-medium">{{ row.name || '—' }}</div>
                <div class="text-sm text-gray-500 dark:text-zinc-400">
                  {{ row.email }}
                  <span v-if="row.grade" class="ml-2 text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    Grade {{ row.grade }}
                  </span>
                </div>
              </div>
            </div>
          </template>

          <template #status-data="{ row }">
            <UBadge
              :color="getStatusColor(row.status)"
              variant="soft"
              size="sm"
              class="capitalize"
            >
              {{ row.status.toLowerCase() }}
            </UBadge>
          </template>

          <template #invitedBy-data="{ row }">
            <span v-if="row.isPendingInvitation" class="text-sm text-gray-500">
              {{ row.invitedBy }}
            </span>
          </template>

          <template #actions-data="{ row }">
            <UDropdown
              :items="getUserActions(row)"
              :popper="{ placement: 'bottom-end' }"
            >
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-ellipsis-horizontal-20-solid"
              />
            </UDropdown>
          </template>
        </UTable>

        <!-- Pagination -->
        <div class="flex justify-center">
          <UPagination
            v-model="currentPage"
            :total="filteredStudents.length"
            :per-page="perPage"
            :ui="{
              wrapper: 'gap-1',
              rounded: 'rounded-lg'
            }"
          />
        </div>
      </div>

      <!-- Student Invite Modal -->
      <ConsoleStudentsStudentInviteModal
        v-model="showInviteModal"
        @invite="inviteStudent"
      />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { Student, StudentsResponse } from '~/types/student'

const refreshing = ref(false)
const showInviteModal = ref(false)
const toast = useToast()

// Filters
const search = ref('')
const status = ref('All Status')

// Students data
const students = ref<Student[]>([])

// Fetch students data
const fetchStudents = async () => {
  try {
    refreshing.value = true
    const response = await $apiFetch<StudentsResponse>('/api/students')
    students.value = response.students
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to load students',
      color: 'red'
    })
  } finally {
    refreshing.value = false
  }
}

// Load data on mount
onMounted(fetchStudents)

// Pagination
const currentPage = ref(1)
const perPage = ref(10)

// Computed
const filteredStudents = computed(() => {
  return students.value.filter(student => {
    const matchesSearch = search.value === '' || 
      student.email.toLowerCase().includes(search.value.toLowerCase()) ||
      (student.name?.toLowerCase()?.includes(search.value.toLowerCase()))
    const matchesStatus = status.value === 'All Status' || student.status === status.value
    return matchesSearch && matchesStatus
  })
})

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredStudents.value.slice(start, end)
})

// Updated columns definition
const columns = [
  {
    key: 'name',
    label: 'Student',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'invitedBy',
    label: 'Invited By',
  },
  {
    key: 'actions',
    label: '',
    sortable: false
  }
]

// Simulated actions
const simulateAction = async (action: string, student: Student) => {
  try {
    refreshing.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.add({
      title: 'Success',
      description: `Successfully ${action} student: ${student.email}`,
      color: 'green'
    })
    
    await fetchStudents() // Refresh list after action
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || `Failed to ${action} student`,
      color: 'red'
    })
  } finally {
    refreshing.value = false
  }
}

const getUserActions = (student: Student) => {
  const mainActions = []
  const dangerActions = []

  if (student.status === 'ACTIVE') {
    mainActions.push({
      label: 'Suspend Student',
      icon: 'i-heroicons-lock-closed',
      click: () => simulateAction('suspend', student)
    })
  } else if (student.status === 'SUSPENDED') {
    mainActions.push({
      label: 'Reactivate Student',
      icon: 'i-heroicons-lock-open',
      click: () => simulateAction('reactivate', student)
    })
  }

  if (student.isPendingInvitation) {
    mainActions.push({
      label: 'Resend Invitation',
      icon: 'i-heroicons-envelope',
      click: () => simulateAction('resend invitation to', student)
    })
  }

  dangerActions.push({
    label: 'Delete Student',
    icon: 'i-heroicons-trash',
    click: () => simulateAction('delete', student)
  })

  return [mainActions, dangerActions]
}

// Invite student handler
const inviteStudent = async () => {
  await fetchStudents() // Refresh list after new invitation
}

// Status color helper
const getStatusColor = (status: Student['status']) => {
  switch (status) {
    case 'ACTIVE': return 'green'
    case 'PENDING': return 'orange'
    case 'SUSPENDED': return 'red'
    default: return 'gray'
  }
}
</script>
