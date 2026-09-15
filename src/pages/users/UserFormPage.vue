<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
const breadcrumbs: BreadcrumbType[] = [
  { title: 'Người dùng', href: '/users' },
  { title: isEdit.value ? 'Chỉnh sửa' : 'Thêm mới', disabled: true }
];

const form = ref({ name: '', email: '', password: '', role: 'viewer', status: 'active' });
const saving = ref(false);
const showPwd = ref(false);

if (isEdit.value) {
  form.value = { name: 'Nguyễn Văn An', email: 'an@email.com', password: '', role: 'creator', status: 'active' };
}

async function onSubmit() {
  saving.value = true;
  await new Promise(r => setTimeout(r, 600));
  saving.value = false;
  router.push('/users');
}
</script>

<template>
  <BaseBreadcrumb :title="isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'" :breadcrumbs="breadcrumbs" />
  <v-form @submit.prevent="onSubmit" class="mt-4">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card rounded="lg" elevation="0" variant="outlined">
          <v-card-title class="pa-4 pb-2 text-h6">Thông tin tài khoản</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-text-field v-model="form.name" label="Họ và tên *" variant="outlined" density="compact" class="mb-3" />
            <v-text-field v-model="form.email" label="Email *" variant="outlined" density="compact" type="email" class="mb-3" />
            <v-text-field v-model="form.password" :label="isEdit ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu *'" variant="outlined" density="compact" :type="showPwd ? 'text' : 'password'" class="mb-3">
              <template #append-inner>
                <v-btn icon size="x-small" variant="text" @click="showPwd = !showPwd">
                  <v-icon>{{ showPwd ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                </v-btn>
              </template>
            </v-text-field>
            <v-select v-model="form.role" :items="[{title:'Admin',value:'admin'},{title:'Moderator',value:'moderator'},{title:'Creator',value:'creator'},{title:'Viewer',value:'viewer'}]" item-title="title" item-value="value" label="Role" variant="outlined" density="compact" class="mb-3" />
            <v-select v-model="form.status" :items="[{title:'Hoạt động',value:'active'},{title:'Ẩn',value:'inactive'},{title:'Bị cấm',value:'banned'}]" item-title="title" item-value="value" label="Trạng thái" variant="outlined" density="compact" />
          </v-card-text>
          <v-card-actions class="pa-4 pt-0 d-flex gap-2">
            <v-btn variant="outlined" to="/users" class="flex-grow-1">Huỷ</v-btn>
            <v-btn color="primary" type="submit" :loading="saving" class="flex-grow-1">{{ isEdit ? 'Lưu thay đổi' : 'Tạo tài khoản' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>
