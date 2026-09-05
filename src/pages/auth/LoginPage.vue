<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <!---Login Part-->
    <v-col cols="12" lg="12" class="d-flex align-center">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <v-card elevation="0" variant="outlined" rounded="lg" class="loginBox bg-surface">
                <v-card-text class="pa-sm-10 pa-6">
                  <div>
                    <div class="d-flex justify-space-between align-center mt-4">
                      <h3 class="text-h3 text-center mb-0">Đăng nhập</h3>
                    </div>
                    <Form v-slot="{ handleSubmit, isSubmitting }">
                      <v-form class="mt-7" @submit="handleSubmit($event, login)">
                        <div class="">
                          <v-label>Số điện thoại</v-label>
                          <v-text-field
                            variant="outlined"
                            v-model="record.phone"
                            :error-messages="v$.phone.$error ? v$.phone.$errors[0].$message.toString() : ''"
                            placeholder="Nhập số điện thoại"
                            density="default"
                            single-line
                            color="primary"
                            type="tel"
                            class="mt-2"
                          >
                          </v-text-field>
                        </div>
                        <div>
                          <v-label>Mật khẩu</v-label>
                          <v-text-field
                            aria-label="password"
                            v-model="record.password"
                            placeholder="Nhập mật khẩu"
                            :error-messages="v$.password.$error ? v$.password.$errors[0].$message.toString() : ''"
                            required
                            variant="outlined"
                            density="default"
                            color="primary"
                            :type="showPassword ? 'text' : 'password'"
                            class="mt-2"
                          >
                            <template v-slot:append-inner>
                              <v-btn color="secondary" aria-label="icon" icon rounded variant="text">
                                <SvgSprite
                                  name="custom-eye-invisible"
                                  style="width: 20px; height: 20px"
                                  v-if="showPassword == false"
                                  @click="showPassword = !showPassword"
                                />
                                <SvgSprite
                                  name="custom-eye"
                                  style="width: 20px; height: 20px"
                                  v-if="showPassword == true"
                                  @click="showPassword = !showPassword"
                                />
                              </v-btn>
                            </template>
                          </v-text-field>
                        </div>
                        <v-btn
                          color="primary"
                          :disabled="disableButton"
                          :loading="isSubmitting"
                          block
                          class="mt-5"
                          variant="flat"
                          size="large"
                          rounded="md"
                          type="submit"
                        >
                          Đăng nhập
                        </v-btn>
                      </v-form>
                    </Form>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <!---Login Part-->
  </v-row>
</template>
  
<script setup lang="ts">
// Core & Plugins
import { ref } from 'vue';
import { Form } from 'vee-validate';
import { useToast } from 'vue-toast-notification';
import { useVuelidate } from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
// Dev
import { phoneRegex } from '@/utils/validation';
import { router } from '@/router/index';
import { maxLength, minLength, requiredIf } from '@/utils/i18n-validators';
import type { BreadcrumbType } from '@/types/common';
// Type
type LoginType = {
  phone: string;
  password: string;
};
// Define
const toast = useToast();
const requireLength = 1;
const breadcrumbs: BreadcrumbType[] = [
  {
    title: 'Danh sách trung tâm',
    disabled: false,
    href: '/manager/center'
  },
  {
    title: 'Cập nhật trung tâm',
    disabled: true,
    href: '/manager/center'
  }
];
const showPassword = ref<boolean>(false);
const disableButton = ref<boolean>(false);
const record = ref<LoginType>({
  phone: '',
  password: ''
});
// Validate
const rules = {
  phone: {
    requiredIf: requiredIf('số điện thoại'),
    phoneRegex: helpers.withMessage('Không đúng định dạng số điện thoại', phoneRegex),
    maxLength: maxLength(10),
    minLength: minLength(10)
  },
  password: { requiredIf: requiredIf('mật khẩu'), maxLength: maxLength(10) }
};
const v$ = useVuelidate(rules, record);
// Methods
const login = async () => {
  v$.value.$touch();
  // 
};
</script>
  
  <style lang="scss">
  .loginBox {
    max-width: 475px;
    margin: 0 auto;
  }
  </style>
  