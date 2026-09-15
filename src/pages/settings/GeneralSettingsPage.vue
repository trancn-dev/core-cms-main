<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Cài đặt chung', disabled: true }];
const form = ref({
  siteName: 'MediaHub VN',
  siteDescription: 'Nền tảng xem video học tập hàng đầu Việt Nam',
  siteUrl: 'https://mediahub.vn',
  contactEmail: 'admin@mediahub.vn',
  defaultLanguage: 'vi',
  allowRegistration: true,
  requireEmailVerification: true,
  maintenanceMode: false,
  videosPerPage: 24
});
const saving = ref(false);
async function onSubmit() { saving.value = true; await new Promise(r => setTimeout(r, 600)); saving.value = false; }
</script>
<template>
  <BaseBreadcrumb title="Cài đặt chung" :breadcrumbs="breadcrumbs" />
  <v-form @submit.prevent="onSubmit" class="mt-4">
    <v-row>
      <v-col cols="12" md="8">
        <v-card rounded="lg" elevation="0" variant="outlined" class="mb-4">
          <v-card-title class="pa-4 pb-2 text-h6">Thông tin trang web</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-text-field v-model="form.siteName" label="Tên trang web" variant="outlined" density="compact" class="mb-3" />
            <v-textarea v-model="form.siteDescription" label="Mô tả trang web" variant="outlined" density="compact" rows="2" class="mb-3" />
            <v-text-field v-model="form.siteUrl" label="URL trang web" variant="outlined" density="compact" class="mb-3" />
            <v-text-field v-model="form.contactEmail" label="Email liên hệ" variant="outlined" density="compact" type="email" class="mb-3" />
            <v-select v-model="form.defaultLanguage" :items="[{title:'Tiếng Việt',value:'vi'},{title:'English',value:'en'}]" item-title="title" item-value="value" label="Ngôn ngữ mặc định" variant="outlined" density="compact" class="mb-3" />
            <v-text-field v-model="form.videosPerPage" label="Số video mỗi trang" variant="outlined" density="compact" type="number" />
          </v-card-text>
        </v-card>
        <v-card rounded="lg" elevation="0" variant="outlined">
          <v-card-title class="pa-4 pb-2 text-h6">Tính năng hệ thống</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-switch v-model="form.allowRegistration" label="Cho phép đăng ký tài khoản mới" color="primary" hide-details density="compact" class="mb-2" />
            <v-switch v-model="form.requireEmailVerification" label="Yêu cầu xác thực email" color="primary" hide-details density="compact" class="mb-2" />
            <v-switch v-model="form.maintenanceMode" label="Chế độ bảo trì (trang public sẽ hiện thông báo)" color="warning" hide-details density="compact" />
          </v-card-text>
          <v-card-actions class="pa-4 pt-0">
            <v-btn color="primary" type="submit" :loading="saving" prepend-icon="mdi-content-save">Lưu cài đặt</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card rounded="lg" elevation="0" variant="outlined">
          <v-card-title class="pa-4 pb-2 text-h6">Điều hướng nhanh</v-card-title>
          <v-divider />
          <v-list density="compact">
            <v-list-item to="/settings/storage" prepend-icon="mdi-cloud" title="Lưu trữ (Storage)" append-icon="mdi-chevron-right" />
            <v-list-item to="/settings/seo" prepend-icon="mdi-magnify" title="SEO" append-icon="mdi-chevron-right" />
            <v-list-item to="/settings/email" prepend-icon="mdi-email" title="Email" append-icon="mdi-chevron-right" />
            <v-list-item to="/settings/admins" prepend-icon="mdi-account-key" title="Quản trị viên" append-icon="mdi-chevron-right" />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>
