<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';
const breadcrumbs: BreadcrumbType[] = [{ title: 'Cài đặt SEO', disabled: true }];
const form = ref({ metaTitle: 'MediaHub VN — Nền tảng video học tập', metaDescription: 'Xem hàng ngàn video học tập chất lượng cao về lập trình, thiết kế và nhiều chủ đề khác.', metaKeywords: 'video học tập, lập trình, thiết kế, devops', googleAnalyticsId: '', enableSitemap: true, enableOpenGraph: true });
const saving = ref(false);
async function onSubmit() { saving.value = true; await new Promise(r => setTimeout(r, 600)); saving.value = false; }
</script>
<template>
  <BaseBreadcrumb title="Cài đặt SEO" :breadcrumbs="breadcrumbs" />
  <v-form @submit.prevent="onSubmit" class="mt-4">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card rounded="lg" elevation="0" variant="outlined">
          <v-card-title class="pa-4 pb-2 text-h6">SEO mặc định</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-text-field v-model="form.metaTitle" label="Meta Title mặc định" variant="outlined" density="compact" class="mb-3" counter="60" />
            <v-textarea v-model="form.metaDescription" label="Meta Description mặc định" variant="outlined" density="compact" rows="2" class="mb-3" counter="160" />
            <v-text-field v-model="form.metaKeywords" label="Meta Keywords" variant="outlined" density="compact" class="mb-3" hint="Các từ khoá cách nhau bởi dấu phẩy" />
            <v-text-field v-model="form.googleAnalyticsId" label="Google Analytics ID (GA4)" variant="outlined" density="compact" class="mb-3" placeholder="G-XXXXXXXXXX" />
            <v-switch v-model="form.enableSitemap" label="Tự động tạo sitemap.xml" color="primary" hide-details density="compact" class="mb-2" />
            <v-switch v-model="form.enableOpenGraph" label="Bật Open Graph meta tags" color="primary" hide-details density="compact" />
          </v-card-text>
          <v-card-actions class="pa-4 pt-0">
            <v-btn color="primary" type="submit" :loading="saving" prepend-icon="mdi-content-save">Lưu cài đặt</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>
