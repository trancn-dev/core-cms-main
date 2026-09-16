<template>
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
                    <div class="d-flex flex-column align-center ga-3 mb-2">
                      <div class="cms-login-logo"><v-icon size="22" color="white">mdi-play-circle</v-icon></div>
                      <h3 class="text-h3 mb-0">Đăng nhập</h3>
                      <span class="text-body-1 text-lightText">Core CMS · trang quản trị</span>
                    </div>
                    <Form v-slot="{ handleSubmit, isSubmitting }">
                      <v-form class="mt-7" @submit="handleSubmit($event, login)">
                        <div class="">
                          <label class="cms-field__label" for="login-phone">Số điện thoại</label>
                          <v-text-field
                            id="login-phone"
                            variant="outlined"
                            v-model="record.phone"
                            :error-messages="v$.phone.$error ? v$.phone.$errors[0].$message.toString() : ''"
                            placeholder="Nhập số điện thoại"
                            density="compact"
                            single-line
                            color="primary"
                            type="tel"
                            class="mt-2"
                          >
                          </v-text-field>
                        </div>
                        <div>
                          <label class="cms-field__label" for="login-password">Mật khẩu</label>
                          <v-text-field
                            id="login-password"
                            v-model="record.password"
                            placeholder="Nhập mật khẩu"
                            :error-messages="v$.password.$error ? v$.password.$errors[0].$message.toString() : ''"
                            required
                            variant="outlined"
                            density="compact"
                            color="primary"
                            :type="showPassword ? 'text' : 'password'"
                            class="mt-2"
                          >
                            <template v-slot:append-inner>
                              <v-btn
                                color="secondary"
                                :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                                icon
                                size="x-small"
                                variant="text"
                                @click="showPassword = !showPassword"
                              >
                                <SvgSprite :name="showPassword ? 'custom-eye' : 'custom-eye-invisible'" style="width: 18px; height: 18px" />
                              </v-btn>
                            </template>
                          </v-text-field>
                        </div>
                        <div class="d-flex justify-end mt-n2">
                          <router-link :to="{ name: 'forgotPassword' }" class="text-primary text-body-1 text-decoration-none">Quên mật khẩu?</router-link>
                        </div>
                        <v-btn
                          color="primary"
                          :disabled="disableButton"
                          :loading="isSubmitting"
                          block
                          class="mt-5"
                          variant="flat"
                          height="44"
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
// Type
type LoginType = {
  phone: string;
  password: string;
};
// Define
const toast = useToast();
const requireLength = 1;
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
.cms-login-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgb(var(--v-theme-primary));
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
  