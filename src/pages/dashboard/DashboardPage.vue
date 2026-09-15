<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';
import { dashboardService } from '@/apis/media';
import type { DashboardStats } from '@/types/media';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Dashboard', disabled: true }];

const loading = ref(true);
const stats = ref<DashboardStats | null>(null);

onMounted(async () => {
  stats.value = await dashboardService.getStats();
  loading.value = false;
});

const statCards = [
  { key: 'totalVideos', label: 'Tổng số video', icon: 'mdi-video', color: 'primary', suffix: '' },
  { key: 'totalViews', label: 'Tổng lượt xem', icon: 'mdi-eye', color: 'success', suffix: '' },
  { key: 'newUsersToday', label: 'Người dùng mới hôm nay', icon: 'mdi-account-plus', color: 'warning', suffix: '' },
  { key: 'pendingReports', label: 'Báo cáo chờ xử lý', icon: 'mdi-flag-outline', color: 'error', suffix: '' }
];

const statusColor: Record<string, string> = { published: 'success', draft: 'grey', processing: 'warning', blocked: 'error' };
const statusLabel: Record<string, string> = { published: 'Đã xuất bản', draft: 'Bản nháp', processing: 'Đang xử lý', blocked: 'Bị khoá' };

function fmt(n: number) { return n.toLocaleString('vi-VN'); }
function growth(val: number) { return val >= 0 ? `+${val.toFixed(1)}%` : `${val.toFixed(1)}%`; }
</script>

<template>
  <BaseBreadcrumb title="Dashboard" :breadcrumbs="breadcrumbs" />

  <!-- Stat cards skeleton -->
  <v-row class="mt-2">
    <v-col v-for="card in statCards" :key="card.key" cols="12" sm="6" lg="3">
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-text>
          <v-skeleton-loader v-if="loading" type="text, text" />
          <div v-else class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis mb-1">{{ card.label }}</div>
              <div class="text-h4 font-weight-bold">
                {{ stats ? fmt((stats as any)[card.key]) : '—' }}
              </div>
              <div v-if="card.key === 'totalViews'" class="text-caption mt-1 text-success">
                {{ stats ? growth(stats.viewsGrowth) : '' }} so với hôm qua
              </div>
              <div v-else-if="card.key === 'newUsersToday'" class="text-caption mt-1 text-warning">
                {{ stats ? growth(stats.usersGrowth) : '' }} so với hôm qua
              </div>
            </div>
            <v-avatar :color="card.color" size="52" rounded="lg">
              <v-icon :icon="card.icon" size="28" color="white" />
            </v-avatar>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row class="mt-2">
    <!-- Top Videos -->
    <v-col cols="12" lg="8">
      <v-card rounded="lg" elevation="0" variant="outlined" min-height="280">
        <v-card-title class="pa-4 pb-2">
          <span class="text-h6">Top video xem nhiều nhất</span>
          <v-spacer />
          <v-btn variant="text" color="primary" size="small" to="/analytics/videos">Xem thống kê →</v-btn>
        </v-card-title>
        <v-divider />
        <div v-if="loading">
          <v-skeleton-loader v-for="i in 5" :key="i" type="list-item-two-line" class="mx-2" />
        </div>
        <v-table v-else density="compact">
          <thead>
            <tr>
              <th style="width:32px">#</th>
              <th>Tiêu đề</th>
              <th>Kênh</th>
              <th class="text-right">Lượt xem</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, i) in stats?.topVideos" :key="v.id">
              <td class="text-medium-emphasis text-body-2">{{ i + 1 }}</td>
              <td>
                <router-link :to="'/videos/' + v.id" class="text-primary text-decoration-none text-body-2 font-weight-medium">
                  {{ v.title }}
                </router-link>
              </td>
              <td class="text-body-2 text-medium-emphasis">{{ v.channel?.name }}</td>
              <td class="text-right text-body-2 font-weight-medium">{{ fmt(v.viewsCount) }}</td>
              <td>
                <v-chip :color="statusColor[v.status]" size="x-small" variant="tonal">
                  {{ statusLabel[v.status] }}
                </v-chip>
              </td>
            </tr>
            <tr v-if="!stats?.topVideos?.length">
              <td colspan="5" class="text-center text-medium-emphasis py-6">Chưa có dữ liệu</td>
            </tr>
          </tbody>
        </v-table>
        <v-card-actions class="px-4">
          <v-btn variant="text" color="primary" size="small" to="/videos">Xem tất cả video →</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <!-- Quick actions + reports -->
    <v-col cols="12" lg="4">
      <!-- Quick actions -->
      <v-card rounded="lg" elevation="0" variant="outlined" class="mb-3">
        <v-card-title class="pa-4 pb-2 text-h6">Thao tác nhanh</v-card-title>
        <v-divider />
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="6">
              <v-btn variant="tonal" color="primary" block size="small" to="/videos/create" prepend-icon="mdi-video-plus">
                Thêm video
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn variant="tonal" color="info" block size="small" to="/channels/create" prepend-icon="mdi-account-plus">
                Tạo kênh
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn variant="tonal" color="warning" block size="small" to="/reports" prepend-icon="mdi-flag">
                Xem báo cáo
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn variant="tonal" color="success" block size="small" to="/ads/create" prepend-icon="mdi-plus">
                Tạo quảng cáo
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Pending reports -->
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-title class="pa-4 pb-2 text-h6">
          Báo cáo chờ xử lý
          <v-chip v-if="stats?.pendingReports" color="error" size="x-small" class="ml-2">{{ stats.pendingReports }}</v-chip>
        </v-card-title>
        <v-divider />
        <v-list lines="two" density="compact">
          <v-list-item to="/reports/1">
            <template #prepend>
              <v-avatar color="warning" size="36" rounded="lg">
                <v-icon icon="mdi-flag" size="18" color="white" />
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-2">Video spam — ID #234</v-list-item-title>
            <v-list-item-subtitle class="text-caption">5 phút trước</v-list-item-subtitle>
          </v-list-item>
          <v-list-item to="/reports/2">
            <template #prepend>
              <v-avatar color="error" size="36" rounded="lg">
                <v-icon icon="mdi-flag" size="18" color="white" />
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-2">Bình luận tục tĩu</v-list-item-title>
            <v-list-item-subtitle class="text-caption">20 phút trước</v-list-item-subtitle>
          </v-list-item>
          <v-list-item to="/reports/3">
            <template #prepend>
              <v-avatar color="info" size="36" rounded="lg">
                <v-icon icon="mdi-flag" size="18" color="white" />
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-2">Vi phạm bản quyền — ID #198</v-list-item-title>
            <v-list-item-subtitle class="text-caption">1 giờ trước</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn variant="text" color="primary" size="small" to="/reports">Xem tất cả →</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
