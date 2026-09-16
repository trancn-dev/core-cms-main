<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsField from '@/components/cms/CmsField.vue';
import CmsSwitchRow from '@/components/cms/CmsSwitchRow.vue';
import CmsPasswordField from '@/components/cms/CmsPasswordField.vue';
import CmsFormActions from '@/components/cms/CmsFormActions.vue';
import type { BreadcrumbType } from '@/types/common';
import { useSettingsForm } from '@/composables/useSettingsForm';

const breadcrumbs: BreadcrumbType[] = [
  { title: 'Cài đặt', disabled: true },
  { title: 'Email', disabled: true }
];

const toast = useToast();

const { form, saving, dirty, reset, save } = useSettingsForm({
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: '',
  smtpPass: '',
  fromName: 'MediaHub VN',
  fromEmail: 'no-reply@mediahub.vn',
  enableTls: true
});

const testing = ref(false);
const testEmail = ref('');

async function sendTest() {
  if (!testEmail.value) return;
  testing.value = true;
  await new Promise((r) => setTimeout(r, 1000));
  testing.value = false;
  toast.success(`Đã gửi email kiểm tra tới ${testEmail.value}.`);
}
</script>

<template>
  <BaseBreadcrumb title="Cài đặt email" :breadcrumbs="breadcrumbs" />

  <v-form @submit.prevent="save">
    <v-row justify="center">
      <v-col cols="12" md="8" class="d-flex flex-column ga-4">
        <CmsFormCard title="Cấu hình SMTP">
          <v-row dense>
            <v-col cols="8">
              <CmsField v-slot="{ id }" label="SMTP host">
                <v-text-field :id="id" v-model="form.smtpHost" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
            <v-col cols="4">
              <CmsField v-slot="{ id }" label="Cổng">
                <v-text-field :id="id" v-model.number="form.smtpPort" type="number" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Tên đăng nhập">
                <v-text-field :id="id" v-model="form.smtpUser" variant="outlined" density="compact" hide-details autocomplete="off" />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Mật khẩu">
                <CmsPasswordField :id="id" v-model="form.smtpPass" autocomplete="new-password" />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Tên người gửi">
                <v-text-field :id="id" v-model="form.fromName" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Email người gửi">
                <v-text-field :id="id" v-model="form.fromEmail" type="email" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
          </v-row>
          <CmsSwitchRow v-model="form.enableTls" label="Bật TLS/SSL" />
        </CmsFormCard>

        <CmsFormCard title="Gửi email kiểm tra">
          <div class="d-flex ga-2 align-center">
            <v-text-field
              v-model="testEmail"
              type="email"
              variant="outlined"
              density="compact"
              hide-details
              placeholder="Nhập email nhận thử…"
              aria-label="Email nhận thử"
              class="flex-grow-1"
            />
            <v-btn variant="outlined" :loading="testing" :disabled="!testEmail" @click="sendTest">Gửi thử</v-btn>
          </div>
          <div class="text-caption text-lightText">Dùng cấu hình đã lưu, không phải giá trị đang sửa.</div>
        </CmsFormCard>

        <CmsFormActions submit-label="Lưu cài đặt" :loading="saving" :disabled="!dirty" @cancel="reset" />
      </v-col>
    </v-row>
  </v-form>
</template>
