<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import CmsField from '@/components/cms/CmsField.vue';

const toast = useToast();
const email = ref('');
const sending = ref(false);
const sent = ref(false);

// No reset endpoint yet — the flow is shown but nothing is sent
async function submit() {
  if (!email.value) return;
  sending.value = true;
  await new Promise((r) => setTimeout(r, 600));
  sending.value = false;
  sent.value = true;
  toast.success('Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.');
}
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <v-col cols="12" class="d-flex align-center">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-card elevation="0" variant="outlined" rounded="lg" class="loginBox bg-surface w-100">
            <v-card-text class="pa-sm-10 pa-6 d-flex flex-column ga-4">
              <div class="d-flex justify-space-between align-center">
                <h3 class="text-h3 mb-0">Quên mật khẩu</h3>
                <router-link :to="{ name: 'login' }" class="text-primary text-body-1 text-decoration-none">
                  Quay lại đăng nhập
                </router-link>
              </div>

              <template v-if="!sent">
                <p class="text-body-1 text-lightText mb-0">Nhập email tài khoản, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.</p>
                <v-form class="d-flex flex-column ga-4" @submit.prevent="submit">
                  <CmsField v-slot="{ id }" label="Email" required>
                    <v-text-field :id="id" v-model="email" type="email" variant="outlined" density="compact" hide-details autofocus />
                  </CmsField>
                  <v-btn color="primary" type="submit" height="44" block :loading="sending" :disabled="!email">
                    Gửi liên kết đặt lại
                  </v-btn>
                </v-form>
              </template>

              <div v-else class="cms-state pa-4">
                <v-icon size="48" color="success">mdi-check-circle</v-icon>
                <div class="cms-state__title">Kiểm tra hộp thư của bạn</div>
                <div class="cms-state__desc">Liên kết đã được gửi tới {{ email }} nếu email này có tài khoản.</div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>
