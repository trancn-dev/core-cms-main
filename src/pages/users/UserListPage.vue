<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsRowActions from '@/components/cms/CmsRowActions.vue';
import CmsConfirmDialog from '@/components/cms/CmsConfirmDialog.vue';
import type { BreadcrumbType } from '@/types/common';
import { userService } from '@/apis/media';
import type { User, UserRole, UserStatus } from '@/types/media';
import { statusFilterOptions } from '@/utils/statusMaps';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Người dùng', disabled: true }];

const loading = ref(false);
const error = ref<string | null>(null);
const users = ref<User[]>([]);
const total = ref(0);
const page = ref(1);
const itemsPerPage = 10;

const search = ref('');
const filterRole = ref<UserRole | ''>('');
const filterStatus = ref<UserStatus | ''>('');

const roleOpts = statusFilterOptions('userRole', 'Tất cả vai trò');
const statusOpts = statusFilterOptions('userStatus', 'Tất cả trạng thái');

async function fetchUsers() {
  loading.value = true;
  error.value = null;
  try {
    const res = await userService.getList({
      search: search.value,
      role: filterRole.value || undefined,
      status: filterStatus.value || undefined,
      page: page.value,
      limit: itemsPerPage
    });
    users.value = res.items;
    total.value = res.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Máy chủ không phản hồi.';
    users.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchUsers);

let timer: ReturnType<typeof setTimeout>;
watch([search, filterRole, filterStatus], () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    page.value = 1;
    fetchUsers();
  }, 300);
});
watch(page, fetchUsers);

const banDialog = ref(false);
const banning = ref(false);
const banUser = ref<User | null>(null);
const isUnban = computed(() => banUser.value?.status === 'banned');

function openBan(user: User) {
  banUser.value = user;
  banDialog.value = true;
}

async function confirmBan() {
  if (!banUser.value) return;
  banning.value = true;
  try {
    await userService.updateStatus(banUser.value.id, isUnban.value ? 'active' : 'banned');
    banDialog.value = false;
    fetchUsers();
  } finally {
    banning.value = false;
  }
}
</script>

<template>
  <BaseBreadcrumb title="Quản lý người dùng" :breadcrumbs="breadcrumbs" />

  <CmsTableCard
    :columns="6"
    :loading="loading"
    :error="error"
    :count="users.length"
    :total="total"
    :page="page"
    :items-per-page="itemsPerPage"
    unit="người dùng"
    :thumb-column="0"
    :chip-column="3"
    empty-title="Không tìm thấy người dùng nào"
    @update:page="page = $event"
    @retry="fetchUsers"
  >
    <template #toolbar>
      <v-text-field
        v-model="search"
        class="cms-toolbar__search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm tên, email…"
        variant="outlined"
        density="compact"
        hide-details
        single-line
        clearable
      />
      <v-select
        v-model="filterRole"
        :items="roleOpts"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 180px"
      />
      <v-select
        v-model="filterStatus"
        :items="statusOpts"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 180px"
      />
      <div class="cms-toolbar__spacer"></div>
      <v-btn color="primary" size="small" prepend-icon="mdi-plus" to="/users/create">Thêm người dùng</v-btn>
    </template>

    <template #head>
      <tr>
        <th>Người dùng</th>
        <th>Email</th>
        <th style="width: 140px">Vai trò</th>
        <th style="width: 140px">Trạng thái</th>
        <th style="width: 120px">Ngày tham gia</th>
        <th style="width: 140px" class="cms-num">Thao tác</th>
      </tr>
    </template>

    <template #body>
      <tr v-for="u in users" :key="u.id">
        <td>
          <div class="d-flex align-center ga-3" style="min-width: 0">
            <v-avatar color="lightprimary" size="32">
              <span class="text-onLightprimary text-body-2 font-weight-bold">{{ u.displayName[0] }}</span>
            </v-avatar>
            <div style="min-width: 0">
              <router-link :to="`/users/${u.id}`" class="cms-table__title">{{ u.displayName }}</router-link>
              <div class="cms-table__sub">@{{ u.username }}</div>
            </div>
          </div>
        </td>
        <td class="text-lightText">{{ u.email }}</td>
        <td><CmsStatusChip type="userRole" :value="u.role" /></td>
        <td><CmsStatusChip type="userStatus" :value="u.status" /></td>
        <td class="text-lightText">{{ new Date(u.createdAt).toLocaleDateString('vi-VN') }}</td>
        <td class="cms-table__actions">
          <CmsRowActions :view-to="`/users/${u.id}`" :edit-to="`/users/${u.id}/edit`" :deletable="false">
            <v-tooltip :text="u.status === 'banned' ? 'Bỏ cấm' : 'Cấm người dùng'">
              <template #activator="{ props: tip }">
                <v-btn
                  v-bind="tip"
                  class="cms-icon-btn"
                  :class="{ 'cms-icon-btn--danger': u.status !== 'banned' }"
                  variant="flat"
                  size="small"
                  :aria-label="u.status === 'banned' ? 'Bỏ cấm' : 'Cấm người dùng'"
                  @click.stop="openBan(u)"
                >
                  <v-icon size="17">{{ u.status === 'banned' ? 'mdi-account-check' : 'mdi-cancel' }}</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </CmsRowActions>
        </td>
      </tr>
    </template>
  </CmsTableCard>

  <CmsConfirmDialog
    v-model="banDialog"
    :title="isUnban ? 'Bỏ cấm người dùng' : 'Cấm người dùng'"
    :confirm-label="isUnban ? 'Bỏ cấm' : 'Cấm'"
    :color="isUnban ? 'success' : 'error'"
    :icon="isUnban ? 'mdi-account-check' : 'mdi-cancel'"
    :loading="banning"
    @confirm="confirmBan"
  >
    Bạn có chắc muốn {{ isUnban ? 'bỏ cấm' : 'cấm' }} <strong>{{ banUser?.displayName }}</strong>?
  </CmsConfirmDialog>
</template>
