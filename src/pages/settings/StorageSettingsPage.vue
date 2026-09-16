<script setup lang="ts">
import { computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsField from '@/components/cms/CmsField.vue';
import CmsPasswordField from '@/components/cms/CmsPasswordField.vue';
import CmsFormActions from '@/components/cms/CmsFormActions.vue';
import type { BreadcrumbType } from '@/types/common';
import { useSettingsForm } from '@/composables/useSettingsForm';

const breadcrumbs: BreadcrumbType[] = [
  { title: 'Cài đặt', disabled: true },
  { title: 'Lưu trữ', disabled: true }
];

const { form, saving, dirty, reset, save } = useSettingsForm({
  provider: 'local',
  localPath: 'D:/media',
  bucket: 'cms-media',
  region: 'ap-southeast-1',
  endpoint: '',
  accessKey: '',
  secretKey: '',
  cdnUrl: '',
  maxFileSizeMb: 5120
});

const providers = [
  { title: 'Ổ đĩa local', value: 'local' },
  { title: 'MinIO', value: 'minio' },
  { title: 'Amazon S3', value: 's3' },
  { title: 'Cloudflare R2', value: 'r2' }
];

// MinIO, S3 and R2 all speak the S3 API and share the same fields
const isS3Compatible = computed(() => form.value.provider !== 'local');
const needsEndpoint = computed(() => form.value.provider === 'minio' || form.value.provider === 'r2');
</script>

<template>
  <BaseBreadcrumb title="Cài đặt lưu trữ" :breadcrumbs="breadcrumbs" />

  <v-form @submit.prevent="save">
    <v-row justify="center">
      <v-col cols="12" md="8" class="d-flex flex-column ga-4">
        <CmsFormCard title="Nơi lưu tệp media">
          <CmsField v-slot="{ id }" label="Nhà cung cấp">
            <v-select :id="id" v-model="form.provider" :items="providers" variant="outlined" density="compact" hide-details />
          </CmsField>

          <CmsField v-if="!isS3Compatible" v-slot="{ id }" label="Thư mục gốc" hint="Đường dẫn trên máy chủ chạy backend">
            <v-text-field :id="id" v-model="form.localPath" variant="outlined" density="compact" hide-details />
          </CmsField>

          <template v-else>
            <CmsField v-if="needsEndpoint" v-slot="{ id }" label="Endpoint" hint="Ví dụ: http://localhost:9000">
              <v-text-field :id="id" v-model="form.endpoint" variant="outlined" density="compact" hide-details placeholder="https://…" />
            </CmsField>
            <v-row dense>
              <v-col cols="12" sm="6">
                <CmsField v-slot="{ id }" label="Bucket">
                  <v-text-field :id="id" v-model="form.bucket" variant="outlined" density="compact" hide-details />
                </CmsField>
              </v-col>
              <v-col cols="12" sm="6">
                <CmsField v-slot="{ id }" label="Region">
                  <v-text-field :id="id" v-model="form.region" variant="outlined" density="compact" hide-details />
                </CmsField>
              </v-col>
              <v-col cols="12" sm="6">
                <CmsField v-slot="{ id }" label="Access key">
                  <v-text-field :id="id" v-model="form.accessKey" variant="outlined" density="compact" hide-details autocomplete="off" />
                </CmsField>
              </v-col>
              <v-col cols="12" sm="6">
                <CmsField v-slot="{ id }" label="Secret key">
                  <CmsPasswordField :id="id" v-model="form.secretKey" autocomplete="new-password" />
                </CmsField>
              </v-col>
            </v-row>
          </template>
        </CmsFormCard>

        <CmsFormCard title="Phân phối & giới hạn">
          <CmsField v-slot="{ id }" label="CDN URL" hint="Để trống để phục vụ tệp trực tiếp từ nơi lưu">
            <v-text-field :id="id" v-model="form.cdnUrl" variant="outlined" density="compact" hide-details placeholder="https://…" />
          </CmsField>
          <CmsField v-slot="{ id }" label="Kích thước tệp tối đa (MB)">
            <v-text-field :id="id" v-model.number="form.maxFileSizeMb" type="number" min="1" variant="outlined" density="compact" hide-details />
          </CmsField>
        </CmsFormCard>

        <CmsFormActions submit-label="Lưu cài đặt" :loading="saving" :disabled="!dirty" @cancel="reset" />
      </v-col>
    </v-row>
  </v-form>
</template>
