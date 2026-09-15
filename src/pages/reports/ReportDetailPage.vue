<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const route = useRoute();
const breadcrumbs: BreadcrumbType[] = [{ title: 'Báo cáo vi phạm', href: '/reports' }, { title: 'Chi tiết', disabled: true }];

const report = ref({
  id: route.params.id, type: 'video',
  content: 'Hướng dẫn Vue 3 từ A đến Z', contentId: 1,
  reporter: 'Nguyễn Văn A', reporterEmail: 'a@email.com',
  reason: 'spam',
  description: 'Video này có chứa nội dung quảng cáo sản phẩm không liên quan đến nội dung chính.',
  status: 'pending', createdAt: '04/09/2026 09:30'
});

const statusColor: Record<string, string> = { pending: 'warning', reviewed: 'info', resolved: 'success', dismissed: 'grey' };
const reasonLabel: Record<string, string> = { spam: 'Spam', violence: 'Bạo lực', copyright: 'Bản quyền', sexual: 'Nhạy cảm', other: 'Khác' };

function resolve() { report.value.status = 'resolved'; }
function dismiss() { report.value.status = 'dismissed'; }
</script>

<template>
  <BaseBreadcrumb title="Chi tiết báo cáo" :breadcrumbs="breadcrumbs" />
  <v-row class="mt-4" justify="center">
    <v-col cols="12" md="8">
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-title class="pa-4 pb-2 text-h6">Thông tin báo cáo</v-card-title>
        <v-divider />
        <v-list density="compact" class="pa-2">
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Loại nội dung</v-list-item-title>
            <template #append><v-chip :color="report.type === 'video' ? 'primary' : 'secondary'" size="x-small" variant="tonal">{{ report.type }}</v-chip></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Nội dung bị báo cáo</v-list-item-title>
            <template #append><router-link :to="`/\${report.type}s/\${report.contentId}`" class="text-primary text-decoration-none text-body-2">{{ report.content }}</router-link></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Người báo cáo</v-list-item-title>
            <template #append><span class="text-body-2">{{ report.reporter }} ({{ report.reporterEmail }})</span></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Lý do</v-list-item-title>
            <template #append><v-chip color="warning" size="x-small" variant="tonal">{{ reasonLabel[report.reason] }}</v-chip></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Trạng thái</v-list-item-title>
            <template #append><v-chip :color="statusColor[report.status]" size="x-small" variant="tonal">{{ report.status }}</v-chip></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Thời gian</v-list-item-title>
            <template #append><span class="text-body-2">{{ report.createdAt }}</span></template>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-card-text>
          <div class="text-body-2 text-medium-emphasis mb-1 font-weight-medium">Mô tả chi tiết:</div>
          <p class="text-body-2">{{ report.description }}</p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 d-flex gap-2" v-if="report.status === 'pending' || report.status === 'reviewed'">
          <v-btn color="success" variant="tonal" prepend-icon="mdi-check-circle" @click="resolve">Đã xử lý</v-btn>
          <v-btn color="grey" variant="tonal" prepend-icon="mdi-close-circle" @click="dismiss">Bỏ qua</v-btn>
          <v-spacer />
          <v-btn color="error" variant="tonal" prepend-icon="mdi-lock">Khoá nội dung</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
