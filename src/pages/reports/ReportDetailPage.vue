<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsInfoRow from '@/components/cms/CmsInfoRow.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsConfirmDialog from '@/components/cms/CmsConfirmDialog.vue';
import type { BreadcrumbType } from '@/types/common';
import type { ReportReason, ReportStatus, ReportType } from '@/types/media';

const route = useRoute();
const toast = useToast();
const breadcrumbs: BreadcrumbType[] = [
  { title: 'Báo cáo vi phạm', href: '/reports' },
  { title: 'Chi tiết', disabled: true }
];

const report = ref({
  id: route.params.id,
  type: 'video' as ReportType,
  content: 'Hướng dẫn Vue 3 từ A đến Z',
  contentId: 1,
  reporter: 'Nguyễn Văn A',
  reporterEmail: 'a@email.com',
  reason: 'spam' as ReportReason,
  description: 'Video này có chứa nội dung quảng cáo sản phẩm không liên quan đến nội dung chính.',
  status: 'pending' as ReportStatus,
  createdAt: '04/09/2026 09:30'
});

// Comments have no detail page — link to the video they belong to instead
const contentLink = computed(() => (report.value.type === 'video' ? `/videos/${report.value.contentId}` : '/comments'));
const isOpen = computed(() => report.value.status === 'pending' || report.value.status === 'reviewed');

function setStatus(status: ReportStatus, message: string) {
  report.value.status = status;
  toast.success(message);
}

const lockDialog = ref(false);

function confirmLock() {
  lockDialog.value = false;
  setStatus('resolved', 'Đã khoá nội dung và đóng báo cáo.');
}
</script>

<template>
  <BaseBreadcrumb title="Chi tiết báo cáo" :breadcrumbs="breadcrumbs">
    <template v-if="isOpen" #actions>
      <v-btn variant="outlined" size="small" @click="setStatus('dismissed', 'Đã bỏ qua báo cáo.')">Bỏ qua</v-btn>
      <v-btn color="success" variant="tonal" size="small" prepend-icon="mdi-check" @click="setStatus('resolved', 'Đã đánh dấu đã xử lý.')">
        Đã xử lý
      </v-btn>
      <v-btn color="error" variant="tonal" size="small" prepend-icon="mdi-cancel" @click="lockDialog = true">
        Khoá nội dung
      </v-btn>
    </template>
  </BaseBreadcrumb>

  <v-row justify="center">
    <v-col cols="12" md="8" class="d-flex flex-column ga-4">
      <CmsFormCard title="Thông tin báo cáo">
        <div>
          <CmsInfoRow label="Trạng thái"><CmsStatusChip type="report" :value="report.status" /></CmsInfoRow>
          <CmsInfoRow label="Loại nội dung"><CmsStatusChip type="reportType" :value="report.type" /></CmsInfoRow>
          <CmsInfoRow label="Nội dung bị báo cáo">
            <router-link :to="contentLink" class="text-primary text-decoration-none">{{ report.content }}</router-link>
          </CmsInfoRow>
          <CmsInfoRow label="Lý do"><CmsStatusChip type="reportReason" :value="report.reason" /></CmsInfoRow>
          <CmsInfoRow label="Người báo cáo" :value="`${report.reporter} (${report.reporterEmail})`" />
          <CmsInfoRow label="Thời gian" :value="report.createdAt" />
        </div>
      </CmsFormCard>

      <CmsFormCard title="Mô tả chi tiết">
        <p class="text-body-1 mb-0">{{ report.description }}</p>
      </CmsFormCard>
    </v-col>
  </v-row>

  <CmsConfirmDialog
    v-model="lockDialog"
    title="Khoá nội dung"
    confirm-label="Khoá"
    icon="mdi-cancel"
    :message="`Khoá “${report.content}”? Người xem sẽ không truy cập được nội dung này.`"
    @confirm="confirmLock"
  />
</template>
