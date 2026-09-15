<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';
const breadcrumbs: BreadcrumbType[] = [{ title: 'Lưu trữ', disabled: true }];
const form = ref({ provider: 's3', s3Bucket: 'mediahub-videos', s3Region: 'ap-southeast-1', s3AccessKey: '', s3SecretKey: '', cdnUrl: 'https://cdn.mediahub.vn', maxFileSizeMb: 2048 });
const saving = ref(false);
const showSecret = ref(false);
async function onSubmit() { saving.value = true; await new Promise(r => setTimeout(r, 600)); saving.value = false; }
</script>
<template>
  <BaseBreadcrumb title="Cài đặt lưu trữ" :breadcrumbs="breadcrumbs" />
  <v-form @submit.prevent="onSubmit" class="mt-4">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card rounded="lg" elevation="0" variant="outlined">
          <v-card-title class="pa-4 pb-2 text-h6">Cấu hình nhà cung cấp lưu trữ</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-select v-model="form.provider" :items="[{title:'Amazon S3',value:'s3'},{title:'Google Cloud Storage',value:'gcs'},{title:'Cloudflare R2',value:'r2'},{title:'Local Storage',value:'local'}]" item-title="title" item-value="value" label="Provider" variant="outlined" density="compact" class="mb-4" />
            <template v-if="form.provider === 's3' || form.provider === 'r2'">
              <v-text-field v-model="form.s3Bucket" label="Bucket Name" variant="outlined" density="compact" class="mb-3" />
              <v-text-field v-model="form.s3Region" label="Region" variant="outlined" density="compact" class="mb-3" />
              <v-text-field v-model="form.s3AccessKey" label="Access Key ID" variant="outlined" density="compact" class="mb-3" />
              <v-text-field v-model="form.s3SecretKey" label="Secret Access Key" variant="outlined" density="compact" :type="showSecret ? 'text' : 'password'" class="mb-3">
                <template #append-inner><v-btn icon size="x-small" variant="text" @click="showSecret = !showSecret"><v-icon>{{ showSecret ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon></v-btn></template>
              </v-text-field>
            </template>
            <v-text-field v-model="form.cdnUrl" label="CDN URL (phục vụ file)" variant="outlined" density="compact" class="mb-3" />
            <v-text-field v-model="form.maxFileSizeMb" label="Kích thước file tối đa (MB)" variant="outlined" density="compact" type="number" />
          </v-card-text>
          <v-card-actions class="pa-4 pt-0">
            <v-btn color="primary" type="submit" :loading="saving" prepend-icon="mdi-content-save">Lưu cài đặt</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>
