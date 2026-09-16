<script setup lang="ts">
import { ref } from 'vue';

/** v-text-field with a show/hide toggle. Extra attrs pass through to the field. */
defineOptions({ inheritAttrs: false });
const model = defineModel<string>({ default: '' });
const visible = ref(false);
</script>

<template>
  <v-text-field
    v-bind="$attrs"
    v-model="model"
    :type="visible ? 'text' : 'password'"
    variant="outlined"
    density="compact"
    hide-details
  >
    <template #append-inner>
      <v-btn
        icon
        size="x-small"
        variant="text"
        :aria-label="visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
        @click="visible = !visible"
      >
        <SvgSprite :name="visible ? 'custom-eye-invisible' : 'custom-eye'" style="width: 18px; height: 18px" />
      </v-btn>
    </template>
  </v-text-field>
</template>
