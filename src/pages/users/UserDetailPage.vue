<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsInfoRow from '@/components/cms/CmsInfoRow.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsStatCard from '@/components/cms/CmsStatCard.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsConfirmDialog from '@/components/cms/CmsConfirmDialog.vue';
import type { BreadcrumbType } from '@/types/common';
import type { UserRole, UserStatus } from '@/types/media';

const route = useRoute();
const toast = useToast();
const breadcrumbs: BreadcrumbType[] = [
  { title: 'Người dùng', href: '/users' },
  { title: 'Chi tiết', disabled: true }
];

const user = ref({
  id: route.params.id,
  name: 'Nguyễn Văn An',
  email: 'an@email.com',
  role: 'creator' as UserRole,
  status: 'active' as UserStatus,
  createdAt: '10/01/2024',
  totalVideos: 84,
  totalViews: 2840000,
  subscribers: 128400
});

const recentVideos = ref([
  { id: 1, title: 'Hướng dẫn Vue 3', views: 128400, createdAt: '01/08/2026' },
  { id: 2, title: 'Pinia Store', views: 53200, createdAt: '18/08/2026' }
]);

const fmt = (n: number) => n.toLocaleString('vi-VN');

const banDialog = ref(false);
const isBanned = computed(() => user.value.status === 'banned');

function confirmBan() {
  user.value.status = isBanned.value ? 'active' : 'banned';
  banDialog.value = false;
  toast.success(isBanned.value ? `Đã cấm ${user.value.name}.` : `Đã bỏ cấm ${user.value.name}.`);
}
</script>

<template>
  <BaseBreadcrumb :title="user.name" :breadcrumbs="breadcrumbs">
    <template #actions>
      <v-btn
        :color="isBanned ? 'success' : 'error'"
        variant="tonal"
        size="small"
        :prepend-icon="isBanned ? 'mdi-account-check' : 'mdi-cancel'"
        @click="banDialog = true"
      >
        {{ isBanned ? 'Bỏ cấm' : 'Cấm' }}
      </v-btn>
      <v-btn color="primary" size="small" prepend-icon="mdi-pencil" :to="`/users/${user.id}/edit`">Chỉnh sửa</v-btn>
    </template>
  </BaseBreadcrumb>

  <v-row>
    <v-col cols="12" md="4">
      <v-card variant="outlined" rounded="lg" elevation="0">
        <div class="pa-6 text-center d-flex flex-column align-center ga-2">
          <v-avatar color="lightprimary" size="72">
            <span class="text-h3 text-onLightprimary">{{ user.name[0] }}</span>
          </v-avatar>
          <span class="text-h5">{{ user.name }}</span>
          <span class="text-body-1 text-lightText">{{ user.email }}</span>
          <div class="d-flex justify-center ga-2 mt-1">
            <CmsStatusChip type="userRole" :value="user.role" size="sm" />
            <CmsStatusChip type="userStatus" :value="user.status" size="sm" />
          </div>
        </div>
        <div class="px-4 pb-2 border-t-thin">
          <CmsInfoRow label="Ngày tham gia" :value="user.createdAt" />
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="8" class="d-flex flex-column ga-5">
      <v-row dense>
        <v-col cols="12" sm="4">
          <CmsStatCard icon="mdi-movie-outline" label="Video" :value="fmt(user.totalVideos)" tone="primary" />
        </v-col>
        <v-col cols="12" sm="4">
          <CmsStatCard icon="mdi-account-multiple-outline" label="Người đăng ký" :value="fmt(user.subscribers)" tone="success" />
        </v-col>
        <v-col cols="12" sm="4">
          <CmsStatCard icon="mdi-eye" label="Tổng lượt xem" :value="fmt(user.totalViews)" tone="info" />
        </v-col>
      </v-row>

      <div>
        <div class="text-h5 mb-2">Video gần đây</div>
        <CmsTableCard :columns="3" :count="recentVideos.length" empty-title="Người dùng chưa đăng video nào">
          <template #head>
            <tr>
              <th>Tiêu đề</th>
              <th style="width: 110px" class="cms-num">Lượt xem</th>
              <th style="width: 110px">Ngày tạo</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="v in recentVideos" :key="v.id">
              <td><router-link :to="`/videos/${v.id}`" class="cms-table__title">{{ v.title }}</router-link></td>
              <td class="cms-num">{{ fmt(v.views) }}</td>
              <td class="text-lightText">{{ v.createdAt }}</td>
            </tr>
          </template>
        </CmsTableCard>
      </div>
    </v-col>
  </v-row>

  <CmsConfirmDialog
    v-model="banDialog"
    :title="isBanned ? 'Bỏ cấm người dùng' : 'Cấm người dùng'"
    :confirm-label="isBanned ? 'Bỏ cấm' : 'Cấm'"
    :color="isBanned ? 'success' : 'error'"
    :icon="isBanned ? 'mdi-account-check' : 'mdi-cancel'"
    :message="`Bạn có chắc muốn ${isBanned ? 'bỏ cấm' : 'cấm'} ${user.name}?`"
    @confirm="confirmBan"
  />
</template>
