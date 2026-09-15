<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
const breadcrumbs: BreadcrumbType[] = [
  { title: 'Quảng cáo', href: '/ads' },
  { title: isEdit.value ? 'Chỉnh sửa' : 'Thêm mới', disabled: true }
];

const form = ref({ title: '', type: 'pre_roll', creativeUrl: '', targetUrl: '', skipAfter: null as number | null, startDate: '', endDate: '', status: 'active' });
const saving = ref(false);

if (isEdit.value) {
  form.value = { title: 'Khoá học Vue 3 Pro', type: 'pre_roll', creativeUrl: 'https://cdn.example.com/ad1.mp4', targetUrl: 'https://course.example.com', skipAfter: 5, startDate: '2026-09-01', endDate: '2026-09-30', status: 'active' };
}

async function onSubmit() {
  saving.value = true;
  await new Promise(r => setTimeout(r, 600));
  saving.value = false;
  router.push('/ads');
}
</script>

<template>
  <BaseBreadcrumb :title="isEdit ? 'Chỉnh sửa quảng cáo' : 'Thêm quảng cáo mới'" :breadcrumbs="breadcrumbs" />
  <v-form @submit.prevent="onSubmit" class="mt-4">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card rounded="lg" elevation="0" variant="outlined">
          <v-card-title class="pa-4 pb-2 text-h6">Thông tin chiến dịch</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-text-field v-model="form.title" label="Tên chiến dịch *" variant="outlined" density="compact" class="mb-3" />
            <v-select v-model="form.type" :items="[{title:'Pre-roll (trước video)',value:'pre_roll'},{title:'Mid-roll (giữa video)',value:'mid_roll'},{title:'Banner',value:'banner'},{title:'Overlay',value:'overlay'}]" item-title="title" item-value="value" label="Loại quảng cáo *" variant="outlined" density="compact" class="mb-3" />
            <v-text-field v-model="form.creativeUrl" label="URL file quảng cáo (video/hình)" variant="outlined" density="compact" class="mb-3" />
            <v-text-field v-model="form.targetUrl" label="URL đích (khi người dùng click)" variant="outlined" density="compact" class="mb-3" />
            <v-text-field v-if="form.type === 'pre_roll' || form.type === 'mid_roll'" v-model="form.skipAfter" label="Bỏ qua sau (giây, để trống = không thể bỏ qua)" variant="outlined" density="compact" type="number" class="mb-3" />
            <v-row>
              <v-col cols="6"><v-text-field v-model="form.startDate" label="Ngày bắt đầu" variant="outlined" density="compact" type="date" /></v-col>
              <v-col cols="6"><v-text-field v-model="form.endDate" label="Ngày kết thúc" variant="outlined" density="compact" type="date" /></v-col>
            </v-row>
            <v-select v-model="form.status" :items="[{title:'Đang chạy',value:'active'},{title:'Tạm dừng',value:'paused'}]" item-title="title" item-value="value" label="Trạng thái" variant="outlined" density="compact" class="mt-3" />
          </v-card-text>
          <v-card-actions class="pa-4 pt-0 d-flex gap-2">
            <v-btn variant="outlined" to="/ads" class="flex-grow-1">Huỷ</v-btn>
            <v-btn color="primary" type="submit" :loading="saving" class="flex-grow-1">{{ isEdit ? 'Lưu thay đổi' : 'Tạo chiến dịch' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>
