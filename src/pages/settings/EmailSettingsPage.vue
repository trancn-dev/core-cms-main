<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';
const breadcrumbs: BreadcrumbType[] = [{ title: 'Cài đặt Email', disabled: true }];
const form = ref({ smtpHost: 'smtp.gmail.com', smtpPort: 587, smtpUser: '', smtpPass: '', fromName: 'MediaHub VN', fromEmail: 'no-reply@mediahub.vn', enableTls: true });
const saving = ref(false);
const showPass = ref(false);
const testing = ref(false);
const testEmail = ref('');
async function onSubmit() { saving.value = true; await new Promise(r => setTimeout(r, 600)); saving.value = false; }
async function sendTest() { testing.value = true; await new Promise(r => setTimeout(r, 1000)); testing.value = false; }
</script>
<template>
  <BaseBreadcrumb title="Cài đặt Email" :breadcrumbs="breadcrumbs" />
  <v-form @submit.prevent="onSubmit" class="mt-4">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card rounded="lg" elevation="0" variant="outlined" class="mb-4">
          <v-card-title class="pa-4 pb-2 text-h6">Cấu hình SMTP</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="8"><v-text-field v-model="form.smtpHost" label="SMTP Host" variant="outlined" density="compact" /></v-col>
              <v-col cols="4"><v-text-field v-model="form.smtpPort" label="Port" variant="outlined" density="compact" type="number" /></v-col>
            </v-row>
            <v-text-field v-model="form.smtpUser" label="Username" variant="outlined" density="compact" class="mt-3 mb-3" />
            <v-text-field v-model="form.smtpPass" label="Password" variant="outlined" density="compact" :type="showPass ? 'text' : 'password'" class="mb-3">
              <template #append-inner><v-btn icon size="x-small" variant="text" @click="showPass = !showPass"><v-icon>{{ showPass ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon></v-btn></template>
            </v-text-field>
            <v-text-field v-model="form.fromName" label="Tên hiển thị người gửi" variant="outlined" density="compact" class="mb-3" />
            <v-text-field v-model="form.fromEmail" label="Email người gửi" variant="outlined" density="compact" class="mb-3" />
            <v-switch v-model="form.enableTls" label="Bật TLS/SSL" color="primary" hide-details density="compact" />
          </v-card-text>
          <v-card-actions class="pa-4 pt-0">
            <v-btn color="primary" type="submit" :loading="saving" prepend-icon="mdi-content-save">Lưu cài đặt</v-btn>
          </v-card-actions>
        </v-card>
        <v-card rounded="lg" elevation="0" variant="outlined">
          <v-card-title class="pa-4 pb-2 text-h6">Gửi email kiểm tra</v-card-title>
          <v-divider />
          <v-card-text class="pa-4 d-flex gap-2">
            <v-text-field v-model="testEmail" label="Gửi tới email" variant="outlined" density="compact" type="email" hide-details class="flex-grow-1" />
            <v-btn color="secondary" variant="tonal" :loading="testing" @click="sendTest">Gửi test</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>
