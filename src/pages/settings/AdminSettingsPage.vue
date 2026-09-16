<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsRowActions from '@/components/cms/CmsRowActions.vue';
import CmsConfirmDialog from '@/components/cms/CmsConfirmDialog.vue';
import CmsField from '@/components/cms/CmsField.vue';
import type { BreadcrumbType } from '@/types/common';
import type { UserRole } from '@/types/media';
import { userRoleMap } from '@/utils/statusMaps';

const breadcrumbs: BreadcrumbType[] = [
  { title: 'Cài đặt', disabled: true },
  { title: 'Quản trị viên', disabled: true }
];

const toast = useToast();

type Admin = { id: number; name: string; email: string; role: UserRole; createdAt: string };

const admins = ref<Admin[]>([
  { id: 1, name: 'Đặng Thu Hương', email: 'huong@mediahub.vn', role: 'admin', createdAt: '01/12/2023' },
  { id: 2, name: 'Phạm Văn Hùng', email: 'hung@mediahub.vn', role: 'moderator', createdAt: '20/01/2024' }
]);

const roleOpts = (['admin', 'moderator'] as const).map((value) => ({ value, title: userRoleMap[value].label }));

// ─── Invite (short form → dialog, 720px max per artboard 04) ────────────────
const inviteDialog = ref(false);
const inviteForm = ref({ email: '', role: 'moderator' as UserRole });
const inviting = ref(false);

async function sendInvite() {
  if (!inviteForm.value.email) return;
  inviting.value = true;
  await new Promise((r) => setTimeout(r, 600));
  inviting.value = false;
  inviteDialog.value = false;
  toast.success(`Đã gửi lời mời tới ${inviteForm.value.email}.`);
  inviteForm.value = { email: '', role: 'moderator' };
}

// ─── Remove ─────────────────────────────────────────────────────────────────
const removeDialog = ref(false);
const pending = ref<Admin | null>(null);

function askRemove(admin: Admin) {
  pending.value = admin;
  removeDialog.value = true;
}

function confirmRemove() {
  admins.value = admins.value.filter((a) => a.id !== pending.value?.id);
  removeDialog.value = false;
}
</script>

<template>
  <BaseBreadcrumb title="Quản lý quản trị viên" :breadcrumbs="breadcrumbs">
    <template #actions>
      <v-btn color="primary" size="small" prepend-icon="mdi-plus" @click="inviteDialog = true">Mời quản trị viên</v-btn>
    </template>
  </BaseBreadcrumb>

  <CmsTableCard :columns="5" :count="admins.length" empty-title="Chưa có quản trị viên nào">
    <template #head>
      <tr>
        <th>Họ tên</th>
        <th>Email</th>
        <th style="width: 150px">Vai trò</th>
        <th style="width: 120px">Ngày thêm</th>
        <th style="width: 80px" class="cms-num">Thao tác</th>
      </tr>
    </template>
    <template #body>
      <tr v-for="admin in admins" :key="admin.id">
        <td>
          <div class="d-flex align-center ga-3">
            <v-avatar color="lightprimary" size="32">
              <span class="text-onLightprimary text-body-2 font-weight-bold">{{ admin.name[0] }}</span>
            </v-avatar>
            <span class="font-weight-medium">{{ admin.name }}</span>
          </div>
        </td>
        <td class="text-lightText">{{ admin.email }}</td>
        <td><CmsStatusChip type="userRole" :value="admin.role" /></td>
        <td class="text-lightText">{{ admin.createdAt }}</td>
        <td class="cms-table__actions" style="width: 80px">
          <CmsRowActions :viewable="false" :editable="false" @delete="askRemove(admin)" />
        </td>
      </tr>
    </template>
  </CmsTableCard>

  <v-dialog v-model="inviteDialog" max-width="480">
    <v-card rounded="lg">
      <v-form @submit.prevent="sendInvite">
        <div class="pa-4 d-flex align-start ga-3 border-b-thin">
          <div class="flex-grow-1">
            <div class="text-h5">Mời quản trị viên</div>
            <div class="text-caption text-lightText">Người được mời nhận email kèm liên kết kích hoạt.</div>
          </div>
          <v-btn class="cms-icon-btn" variant="flat" size="small" aria-label="Đóng" @click="inviteDialog = false">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="pa-4 d-flex flex-column ga-3">
          <CmsField v-slot="{ id }" label="Email" required>
            <v-text-field :id="id" v-model="inviteForm.email" type="email" variant="outlined" density="compact" hide-details autofocus />
          </CmsField>
          <CmsField v-slot="{ id }" label="Vai trò">
            <v-select :id="id" v-model="inviteForm.role" :items="roleOpts" variant="outlined" density="compact" hide-details />
          </CmsField>
        </div>
        <div class="pa-3 px-4 d-flex justify-end ga-2 border-t-thin">
          <v-btn variant="text" size="small" @click="inviteDialog = false">Huỷ</v-btn>
          <v-btn color="primary" size="small" type="submit" :loading="inviting" :disabled="!inviteForm.email">Gửi lời mời</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>

  <CmsConfirmDialog
    v-model="removeDialog"
    title="Gỡ quyền quản trị"
    confirm-label="Gỡ quyền"
    :message="`Gỡ quyền quản trị của ${pending?.name}? Tài khoản vẫn còn nhưng không vào được trang quản trị.`"
    @confirm="confirmRemove"
  />
</template>
