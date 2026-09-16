<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsField from '@/components/cms/CmsField.vue';
import CmsFormActions from '@/components/cms/CmsFormActions.vue';
import CmsPasswordField from '@/components/cms/CmsPasswordField.vue';
import type { BreadcrumbType } from '@/types/common';
import type { UserRole, UserStatus } from '@/types/media';
import { statusFilterOptions } from '@/utils/statusMaps';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const isEdit = computed(() => !!route.params.id);
const breadcrumbs: BreadcrumbType[] = [
  { title: 'Người dùng', href: '/users' },
  { title: isEdit.value ? 'Chỉnh sửa' : 'Thêm mới', disabled: true }
];

const roleOpts = statusFilterOptions('userRole', '').slice(1);
const statusOpts = statusFilterOptions('userStatus', '').slice(1);

const form = ref({ name: '', email: '', password: '', role: 'viewer' as UserRole, status: 'active' as UserStatus });
const saving = ref(false);
const submitted = ref(false);

if (isEdit.value) {
  form.value = { name: 'Nguyễn Văn An', email: 'an@email.com', password: '', role: 'creator', status: 'active' };
}

const errors = computed(() => ({
  name: submitted.value && !form.value.name.trim() ? 'Vui lòng nhập họ tên' : '',
  email: submitted.value && !/^\S+@\S+\.\S+$/.test(form.value.email) ? 'Email không hợp lệ' : '',
  password: submitted.value && !isEdit.value && form.value.password.length < 8 ? 'Mật khẩu tối thiểu 8 ký tự' : ''
}));

async function onSubmit() {
  submitted.value = true;
  if (Object.values(errors.value).some(Boolean)) return;
  saving.value = true;
  await new Promise((r) => setTimeout(r, 600));
  saving.value = false;
  toast.success(`Đã lưu tài khoản “${form.value.name}”.`);
  router.push('/users');
}
</script>

<template>
  <BaseBreadcrumb :title="isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'" :breadcrumbs="breadcrumbs" />

  <v-form @submit.prevent="onSubmit">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6" class="d-flex flex-column ga-4">
        <CmsFormCard title="Thông tin tài khoản">
          <CmsField v-slot="{ id }" label="Họ và tên" required :error="errors.name">
            <v-text-field :id="id" v-model="form.name" variant="outlined" density="compact" hide-details :error="!!errors.name" />
          </CmsField>
          <CmsField v-slot="{ id }" label="Email" required :error="errors.email">
            <v-text-field :id="id" v-model="form.email" type="email" variant="outlined" density="compact" hide-details :error="!!errors.email" />
          </CmsField>
          <CmsField
            v-slot="{ id }"
            :label="isEdit ? 'Mật khẩu mới' : 'Mật khẩu'"
            :required="!isEdit"
            :error="errors.password"
            :hint="isEdit ? 'Để trống nếu không đổi' : 'Tối thiểu 8 ký tự'"
          >
            <CmsPasswordField :id="id" v-model="form.password" autocomplete="new-password" :error="!!errors.password" />
          </CmsField>
          <v-row dense>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Vai trò">
                <v-select :id="id" v-model="form.role" :items="roleOpts" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Trạng thái">
                <v-select :id="id" v-model="form.status" :items="statusOpts" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
          </v-row>
        </CmsFormCard>

        <CmsFormActions cancel-to="/users" :submit-label="isEdit ? 'Lưu thay đổi' : 'Tạo tài khoản'" :loading="saving" />
      </v-col>
    </v-row>
  </v-form>
</template>
