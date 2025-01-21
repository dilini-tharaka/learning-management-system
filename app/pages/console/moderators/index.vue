<template>
  <div>
    <NuxtLayout name="console">
      <div class="min-h-screen space-y-6 bg-gray-50/50 dark:bg-zinc-900 p-6 rounded-xl">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold">Moderator Management</h1>
            <p class="text-gray-600 dark:text-zinc-400">Manage system moderators and their permissions</p>
          </div>
          <UButton 
            icon="i-heroicons-user-plus" 
            @click="showInviteModal = true"
          >
            Add Moderator
          </UButton>
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-4">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Search moderators..."
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
          :rows="paginatedModerators"
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
                <div class="text-sm text-gray-500 dark:text-zinc-400">{{ row.email }}</div>
              </div>
            </div>
          </template>

          <template #role-data="{ row }">
            <UBadge
              :color="row.role === 'ADMIN' ? 'primary' : 'gray'"
              variant="soft"
              size="sm"
              class="capitalize"
            >
              {{ row.role.toLowerCase() }}
            </UBadge>
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

          <template #lastActive-data="{ row }">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500 dark:text-zinc-400">
                {{ row.lastActive || 'Never' }}
              </span>
              <UButton 
                v-if="row.status === 'Pending'"
                variant="link" 
                color="primary" 
                size="xs"
                @click="resendInvitation(row)"
              >
                Resend
              </UButton>
            </div>
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
            :total="filteredModerators.length"
            :per-page="perPage"
            :ui="{
              wrapper: 'gap-1',
              rounded: 'rounded-lg'
            }"
          />
        </div>
      </div>

      <!-- Moderator Invite Modal -->
      <ConsoleModeratorsModeratorInviteModal
        v-model="showInviteModal"
        @invite="inviteModerator"
      />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { Moderator, ModeratorsResponse } from '~/types/moderator'

const refreshing = ref(false)
const showInviteModal = ref(false)
const toast = useToast()

// Filters
const search = ref('')
const status = ref('All Status')

// Moderators data
const moderators = ref<Moderator[]>([])

// Add pagination
const currentPage = ref(1)
const perPage = ref(10)

// Fetch moderators data
const fetchModerators = async () => {
  try {
    refreshing.value = true
    const response = await $apiFetch<ModeratorsResponse>('/api/moderators')
    moderators.value = response.moderators
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to load moderators',
      color: 'red'
    })
  } finally {
    refreshing.value = false
  }
}

// Load data on mount
onMounted(fetchModerators)

// Computed
const filteredModerators = computed(() => {
  return moderators.value.filter(moderator => {
    const matchesSearch = search.value === '' || 
      moderator.email.toLowerCase().includes(search.value.toLowerCase()) ||
      (moderator.name?.toLowerCase()?.includes(search.value.toLowerCase()))
    const matchesStatus = status.value === 'All Status' || moderator.status === status.value
    return matchesSearch && matchesStatus
  })
})

const paginatedModerators = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredModerators.value.slice(start, end)
})

// Updated columns definition
const columns = [
  {
    key: 'name',
    label: 'Moderator',
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
const simulateAction = async (action: string, moderator: Moderator) => {
  try {
    refreshing.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.add({
      title: 'Success',
      description: `Successfully ${action} moderator: ${moderator.email}`,
      color: 'green'
    })
    
    await fetchModerators()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || `Failed to ${action} moderator`,
      color: 'red'
    })
  } finally {
    refreshing.value = false
  }
}

const getUserActions = (moderator: Moderator) => {
  const mainActions = []
  const dangerActions = []

  if (moderator.status === 'ACTIVE') {
    mainActions.push({
      label: 'Suspend Moderator',
      icon: 'i-heroicons-lock-closed',
      click: () => simulateAction('suspend', moderator)
    })
  } else if (moderator.status === 'SUSPENDED') {
    mainActions.push({
      label: 'Reactivate Moderator',
      icon: 'i-heroicons-lock-open',
      click: () => simulateAction('reactivate', moderator)
    })
  }

  if (moderator.isPendingInvitation) {
    mainActions.push({
      label: 'Resend Invitation',
      icon: 'i-heroicons-envelope',
      click: () => simulateAction('resend invitation to', moderator)
    })
  }

  dangerActions.push({
    label: 'Delete Moderator',
    icon: 'i-heroicons-trash',
    click: () => simulateAction('delete', moderator)
  })

  return [mainActions, dangerActions]
}

// Invite moderator handler
const inviteModerator = async () => {
  await fetchModerators() // Refresh list after new invitation
}

// Status color helper
const getStatusColor = (status: Moderator['status']) => {
  switch (status) {
    case 'ACTIVE': return 'green'
    case 'PENDING': return 'orange'
    case 'SUSPENDED': return 'red'
    default: return 'gray'
  }
}
</script>
