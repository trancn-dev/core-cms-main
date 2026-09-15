<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';
const breadcrumbs: BreadcrumbType[] = [{ title: 'Quản trị viên', disabled: true }];
const admins = ref([
  { id: 1, name: 'Đặng Thu Hương', email: 'huong@mediahub.vn', role: 'admin', createdAt: '01/12/2023' },
  { id: 2, name: 'Phạm Văn Hùng', email: 'hung@mediahub.vn', role: 'moderator', createdAt: '20/01/2024' }
]);
const inviteDialog = ref(false);
const inviteForm = ref({ email: '', role: 'moderator' });
const inviting = ref(false);
async function sendInvite() { inviting.value = true; await new Promise(r => setTimeout(r, 600)); inviting.value = false; inviteDialog.value = false; inviteForm.value = { email: '', role: 'moderator' }; }
const roleColor: Record<string, string> = { admin: 'error', moderator: 'warning' };
</script>
<template>
  <BaseBreadcrumb title="Quản lý quản trị viên" :breadcrumbs="breadcrumbs" />
  <v-card rounded="lg" elevation="0" variant="outlined" class="mt-4">
    <v-card-title class="pa-4 d-flex align-center">
      <span class="text-h6">Danh sách quản trị viên</span>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-account-plus" size="small" @click="inviteDialog = true">Mời thêm</v-btn>
    </v-card-title>
    <v-divider />
    <v-table density="compact">
      <thead><tr><th>Họ tên</th><th>Email</th><th>Role</th><th>Ngày thêm</th><th style="width:60px"></th></tr></thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin.id">
          <td><div class="d-flex align-center gap-2"><v-avatar :color="roleColor[admin.role]" size="32">{{ admin.name[0] }}</v-avatar><span class="font-weight-medium text-body-2">{{ admin.name }}</span></div></td>
          <td class="text-body-2 text-medium-emphasis">{{ admin.email }}</td>
          <td><v-chip :color="roleColor[admin.role]" size="x-small" variant="tonal">{{ admin.role }}</v-chip></td>
          <td class="text-body-2 text-medium-emphasis">{{ admin.createdAt }}</td>
          <td><v-btn icon size="x-small" variant="text" color="error" @click="admins = admins.filter(a => a.id !== admin.id)"><v-icon>mdi-delete</v-icon></v-btn></td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
  <v-dialog v-model="inviteDialog" max-width="440">
    <v-card rounded="lg">
      <v-card-title class="pa-4 text-h6">Mời quản trị viên mới</v-card-title>
      <v-card-text>
        <v-text-field v-model="inviteForm.email" label="Email *" variant="outlined" density="compact" type="email" class="mb-3" />
        <v-select v-model="inviteForm.role" :items="[{title:'Admin',value:'admin'},{title:'Moderator',value:'moderator'}]" item-title="title" item-value="value" label="Role" variant="outlined" density="compact" />
      </v-card-text>
      <v-card-actions class="pa-4 pt-0"><v-spacer />
        <v-btn variant="text" @click="inviteDialog = false">Huỷ</v-btn>
        <v-btn color="primary" variant="tonal" :loading="inviting" @click="sendInvite">Gửi lời mời</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
