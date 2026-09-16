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
import type { ChannelStatus, VideoStatus } from '@/types/media';

const route = useRoute();
const toast = useToast();
const id = route.params.id;
const breadcrumbs: BreadcrumbType[] = [
  { title: 'Kênh', href: '/channels' },
  { title: 'Chi tiết', disabled: true }
];

const channel = ref({
  id,
  name: 'Dev Việt Nam',
  slug: 'dev-viet-nam',
  description: 'Kênh chia sẻ kiến thức lập trình web, framework hiện đại và công nghệ mới nhất.',
  owner: 'Nguyễn Văn An',
  email: 'an@devvn.com',
  subscribers: 128400,
  totalViews: 2840000,
  videos: 84,
  status: 'active' as ChannelStatus,
  verified: true,
  createdAt: '15/03/2024'
});

const recentVideos = ref<{ id: number; title: string; views: number; status: VideoStatus; createdAt: string }[]>([
  { id: 1, title: 'Hướng dẫn Vue 3 từ A đến Z', views: 128400, status: 'published', createdAt: '01/08/2026' },
  { id: 2, title: 'Pinia — Quản lý state trong Vue', views: 53200, status: 'published', createdAt: '18/08/2026' },
  { id: 3, title: 'Vue Router 4 nâng cao', views: 38100, status: 'draft', createdAt: '25/08/2026' }
]);

const fmt = (n: number) => n.toLocaleString('vi-VN');

const suspendDialog = ref(false);
const isSuspended = computed(() => channel.value.status === 'suspended');

function confirmSuspend() {
  channel.value.status = isSuspended.value ? 'active' : 'suspended';
  suspendDialog.value = false;
  toast.success(isSuspended.value ? 'Đã đình chỉ kênh.' : 'Đã khôi phục kênh.');
}
</script>

<template>
  <BaseBreadcrumb :title="channel.name" :breadcrumbs="breadcrumbs">
    <template #actions>
      <v-btn
        :color="isSuspended ? 'success' : 'error'"
        variant="tonal"
        size="small"
        :prepend-icon="isSuspended ? 'mdi-check' : 'mdi-cancel'"
        @click="suspendDialog = true"
      >
        {{ isSuspended ? 'Khôi phục' : 'Đình chỉ' }}
      </v-btn>
      <v-btn color="primary" size="small" prepend-icon="mdi-pencil" :to="`/channels/${id}/edit`">Chỉnh sửa</v-btn>
    </template>
  </BaseBreadcrumb>

  <v-row>
    <v-col cols="12" lg="4">
      <v-card variant="outlined" rounded="lg" elevation="0">
        <div class="pa-6 text-center d-flex flex-column align-center ga-2">
          <v-avatar color="lightprimary" size="72" rounded="lg">
            <span class="text-h3 text-onLightprimary">{{ channel.name[0] }}</span>
          </v-avatar>
          <div class="d-flex align-center ga-1">
            <span class="text-h5">{{ channel.name }}</span>
            <v-tooltip v-if="channel.verified" text="Kênh đã xác thực">
              <template #activator="{ props: tip }">
                <v-icon v-bind="tip" size="18" color="info">mdi-check-decagram</v-icon>
              </template>
            </v-tooltip>
          </div>
          <span class="text-caption text-lightText">/{{ channel.slug }}</span>
          <p class="text-body-1 text-lightText mb-0">{{ channel.description }}</p>
        </div>
        <div class="px-4 pb-2 border-t-thin">
          <CmsInfoRow label="Trạng thái"><CmsStatusChip type="channel" :value="channel.status" /></CmsInfoRow>
          <CmsInfoRow label="Chủ kênh" :value="channel.owner" />
          <CmsInfoRow label="Email" :value="channel.email" />
          <CmsInfoRow label="Ngày tạo" :value="channel.createdAt" />
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" lg="8" class="d-flex flex-column ga-5">
      <v-row dense>
        <v-col cols="12" sm="4">
          <CmsStatCard icon="mdi-movie-outline" label="Video" :value="fmt(channel.videos)" tone="primary" />
        </v-col>
        <v-col cols="12" sm="4">
          <CmsStatCard icon="mdi-account-multiple-outline" label="Người đăng ký" :value="fmt(channel.subscribers)" tone="success" />
        </v-col>
        <v-col cols="12" sm="4">
          <CmsStatCard icon="mdi-eye" label="Tổng lượt xem" :value="fmt(channel.totalViews)" tone="info" />
        </v-col>
      </v-row>

      <div>
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="text-h5">Video gần đây</span>
          <v-btn variant="text" color="primary" size="small" to="/videos">Xem tất cả →</v-btn>
        </div>
        <CmsTableCard :columns="4" :count="recentVideos.length" empty-title="Kênh chưa có video nào">
          <template #head>
            <tr>
              <th>Tiêu đề</th>
              <th style="width: 110px" class="cms-num">Lượt xem</th>
              <th style="width: 130px">Trạng thái</th>
              <th style="width: 110px">Ngày tạo</th>
            </tr>
          </template>
          <template #body>
            <tr v-for="v in recentVideos" :key="v.id">
              <td><router-link :to="`/videos/${v.id}`" class="cms-table__title">{{ v.title }}</router-link></td>
              <td class="cms-num">{{ fmt(v.views) }}</td>
              <td><CmsStatusChip type="video" :value="v.status" /></td>
              <td class="text-lightText">{{ v.createdAt }}</td>
            </tr>
          </template>
        </CmsTableCard>
      </div>
    </v-col>
  </v-row>

  <CmsConfirmDialog
    v-model="suspendDialog"
    :title="isSuspended ? 'Khôi phục kênh' : 'Đình chỉ kênh'"
    :confirm-label="isSuspended ? 'Khôi phục' : 'Đình chỉ'"
    :color="isSuspended ? 'success' : 'error'"
    :icon="isSuspended ? 'mdi-check' : 'mdi-cancel'"
    :message="
      isSuspended
        ? `Khôi phục kênh “${channel.name}”? Video của kênh sẽ hiển thị trở lại.`
        : `Đình chỉ kênh “${channel.name}”? Toàn bộ video của kênh sẽ bị ẩn khỏi người xem.`
    "
    @confirm="confirmSuspend"
  />
</template>
