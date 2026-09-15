<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';
import { userService } from '@/apis/media';
import type { User, UserRole, UserStatus } from '@/types/media';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Người dùng', disabled: true }];

const loading = ref(false);
const users = ref<User[]>([]);
const total = ref(0);
const page = ref(1);
const itemsPerPage = 10;

const search = ref('');
const filterRole = ref<UserRole | ''>('');
const filterStatus = ref<UserStatus | ''>('');

const roleColor: Record<string, string> = { admin: 'error', moderator: 'warning', creator: 'info', viewer: 'success' };

async function fetchUsers() {
  loading.value = true;
  const res = await userService.getList({ search: search.value, role: filterRole.value || undefined, status: filterStatus.value || undefined, page: page.value, limit: itemsPerPage });
  users.value = res.items;
  total.value = res.total;
  loading.value = false;
}

onMounted(fetchUsers);

let timer: ReturnType<typeof setTimeout>;
watch([search, filterRole, filterStatus], () => { clearTimeout(timer); timer = setTimeout(() => { page.value = 1; fetchUsers(); }, 300); });
watch(page, fetchUsers);

const totalPages = computed(() => Math.ceil(total.value / itemsPerPage));

const banDialog = ref(false);
const banUserId = ref<number | null>(null);
const banUser = computed(() => users.value.find(u => u.id === banUserId.value));

function openBan(id: number) { banUserId.value = id; banDialog.value = true; }
async function confirmBan() {
  if (!banUserId.value || !banUser.value) return;
  const newStatus: UserStatus = banUser.value.status === 'banned' ? 'active' : 'banned';
  await userService.updateStatus(banUserId.value, newStatus);
  banDialog.value = false;
  fetchUsers();
}

function fmt(n: number) { return n.toLocaleString('vi-VN'); }
</script>

<template>
  <BaseBreadcrumb title="Quản lý người dùng" :breadcrumbs="breadcrumbs" />

  <v-card rounded="lg" elevation="0" variant="outlined" class="mt-4">
    <v-card-text>
      <v-row align="center" class="mb-4">
        <v-col cols="12" sm="4">
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Tìm tên, email..." variant="outlined" density="compact" hide-details single-line clearable />
        </v-col>
        <v-col cols="6" sm="2">
          <v-select v-model="filterRole" :items="[{title:'Tất cả role',value:''},{title:'Admin',value:'admin'},{title:'Moderator',value:'moderator'},{title:'Creator',value:'creator'},{title:'Viewer',value:'viewer'}]" item-title="title" item-value="value" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col cols="6" sm="2">
          <v-select v-model="filterStatus" :items="[{title:'Tất cả',value:''},{title:'Hoạt động',value:'active'},{title:'Bị cấm',value:'banned'},{title:'Ẩn',value:'inactive'}]" item-title="title" item-value="value" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col class="text-right">
          <v-btn color="primary" prepend-icon="mdi-plus" size="small" to="/users/create">Thêm người dùng</v-btn>
        </v-col>
      </v-row>

      <template v-if="loading">
        <v-skeleton-loader v-for="i in 5" :key="i" type="table-row" />
      </template>

      <v-table v-else density="compact">
        <thead>
          <tr>
            <th>Người dùng</th><th>Email</th><th>Role</th>
            <th>Trạng thái</th><th>Ngày tham gia</th><th style="width:110px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>
              <div class="d-flex align-center gap-2">
                <v-avatar :color="roleColor[u.role]" size="34">
                  <span class="text-body-2 text-white font-weight-bold">{{ u.displayName[0] }}</span>
                </v-avatar>
                <div>
                  <router-link :to="'/users/' + u.id" class="text-primary text-decoration-none text-body-2 font-weight-medium d-block">{{ u.displayName }}</router-link>
                  <span class="text-caption text-medium-emphasis">@{{ u.username }}</span>
                </div>
              </div>
            </td>
            <td class="text-body-2 text-medium-emphasis">{{ u.email }}</td>
            <td><v-chip :color="roleColor[u.role]" size="x-small" variant="tonal" class="font-weight-medium">{{ u.role }}</v-chip></td>
            <td>
              <v-chip :color="u.status === 'active' ? 'success' : u.status === 'banned' ? 'error' : 'grey'" size="x-small" variant="tonal">
                {{ u.status === 'active' ? 'Hoạt động' : u.status === 'banned' ? 'Bị cấm' : 'Ẩn' }}
              </v-chip>
            </td>
            <td class="text-body-2 text-medium-emphasis">{{ new Date(u.createdAt).toLocaleDateString('vi-VN') }}</td>
            <td>
              <v-btn icon size="x-small" variant="text" :to="'/users/' + u.id"><v-icon>mdi-eye</v-icon></v-btn>
              <v-btn icon size="x-small" variant="text" :to="'/users/' + u.id + '/edit'"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon size="x-small" variant="text" :color="u.status === 'banned' ? 'success' : 'error'" @click="openBan(u.id)">
                <v-icon>{{ u.status === 'banned' ? 'mdi-account-check' : 'mdi-account-cancel' }}</v-icon>
              </v-btn>
            </td>
          </tr>
          <tr v-if="!users.length">
            <td colspan="6">
              <div class="text-center text-medium-emphasis py-10">
                <v-icon size="48" class="mb-2 text-grey-lighten-2">mdi-account-off</v-icon>
                <div class="text-body-2">Không tìm thấy người dùng nào</div>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="total > itemsPerPage" class="d-flex align-center justify-space-between mt-4">
        <span class="text-body-2 text-medium-emphasis">{{ fmt(total) }} người dùng</span>
        <v-pagination v-model="page" :length="totalPages" density="compact" :total-visible="5" />
      </div>
    </v-card-text>
  </v-card>

  <v-dialog v-model="banDialog" max-width="420">
    <v-card rounded="lg">
      <v-card-title class="pa-4 text-h6">{{ banUser?.status === 'banned' ? 'Bỏ cấm người dùng' : 'Cấm người dùng' }}</v-card-title>
      <v-card-text>Bạn có chắc muốn {{ banUser?.status === 'banned' ? 'bỏ cấm' : 'cấm' }} <strong>{{ banUser?.displayName }}</strong>?</v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="banDialog = false">Huỷ</v-btn>
        <v-btn :color="banUser?.status === 'banned' ? 'success' : 'error'" variant="tonal" :loading="loading" @click="confirmBan">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
