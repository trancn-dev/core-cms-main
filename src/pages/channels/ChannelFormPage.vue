<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);

const breadcrumbs: BreadcrumbType[] = [
  { title: 'Kênh', href: '/channels' },
  { title: isEdit.value ? 'Chỉnh sửa kênh' : 'Thêm kênh', disabled: true }
];

const form = ref({ name: '', slug: '', description: '', ownerId: '', status: 'active', avatarFile: null as File | null, coverFile: null as File | null });
const saving = ref(false);
const users = [{ id: 1, name: 'Nguyễn Văn An' }, { id: 2, name: 'Trần Minh Đức' }, { id: 3, name: 'Lê Thị Hoa' }];

if (isEdit.value) {
  form.value = { name: 'Dev Việt Nam', slug: 'dev-viet-nam', description: 'Kênh lập trình web.', ownerId: '1', status: 'active', avatarFile: null, coverFile: null };
}

function autoSlug() {
  form.value.slug = form.value.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
}

async function onSubmit() {
  saving.value = true;
  await new Promise(r => setTimeout(r, 600));
  saving.value = false;
  router.push('/channels');
}
</script>

<template>
  <BaseBreadcrumb :title="isEdit ? 'Chỉnh sửa kênh' : 'Thêm kênh mới'" :breadcrumbs="breadcrumbs" />
  <v-form @submit.prevent="onSubmit" class="mt-4">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card rounded="lg" elevation="0" variant="outlined">
          <v-card-title class="pa-4 pb-2 text-h6">Thông tin kênh</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-text-field v-model="form.name" label="Tên kênh *" variant="outlined" density="compact" class="mb-3" @update:model-value="autoSlug" />
            <v-text-field v-model="form.slug" label="Slug *" variant="outlined" density="compact" class="mb-3" hint="Dùng cho URL" persistent-hint />
            <v-textarea v-model="form.description" label="Mô tả kênh" variant="outlined" density="compact" rows="3" class="mb-3" />
            <v-select v-model="form.ownerId" :items="users" item-title="name" item-value="id" label="Chủ kênh *" variant="outlined" density="compact" class="mb-3" />
            <v-file-input v-model="form.avatarFile" label="Ảnh đại diện kênh" variant="outlined" density="compact" accept="image/*" prepend-icon="" prepend-inner-icon="mdi-account-circle" class="mb-3" />
            <v-file-input v-model="form.coverFile" label="Ảnh bìa kênh" variant="outlined" density="compact" accept="image/*" prepend-icon="" prepend-inner-icon="mdi-image" class="mb-3" />
            <v-select v-model="form.status" :items="[{title:'Hoạt động',value:'active'},{title:'Ẩn',value:'inactive'}]" item-title="title" item-value="value" label="Trạng thái" variant="outlined" density="compact" />
          </v-card-text>
          <v-card-actions class="pa-4 pt-0 d-flex gap-2">
            <v-btn variant="outlined" to="/channels" class="flex-grow-1">Huỷ</v-btn>
            <v-btn color="primary" type="submit" :loading="saving" class="flex-grow-1">{{ isEdit ? 'Lưu thay đổi' : 'Tạo kênh' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>
