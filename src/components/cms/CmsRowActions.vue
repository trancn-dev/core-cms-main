<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

withDefaults(
  defineProps<{
    viewTo?: RouteLocationRaw;
    editTo?: RouteLocationRaw;
    /** Lists without a detail page hide the eye. */
    viewable?: boolean;
    editable?: boolean;
    /** Hide the delete button for rows that must not be removed. */
    deletable?: boolean;
  }>(),
  { viewable: true, editable: true, deletable: true }
);

defineEmits<{ view: []; edit: []; delete: [] }>();
</script>

<template>
  <!-- Every icon-only control carries a tooltip and an aria-label: the icon is
       never the only carrier of meaning. -->
  <div class="d-flex ga-2 justify-end">
    <v-tooltip v-if="viewable" text="Xem chi tiết">
      <template #activator="{ props: tip }">
        <v-btn
          v-bind="tip"
          class="cms-icon-btn"
          variant="flat"
          size="small"
          aria-label="Xem chi tiết"
          :to="viewTo"
          @click.stop="$emit('view')"
        >
          <v-icon size="17">mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip v-if="editable" text="Chỉnh sửa">
      <template #activator="{ props: tip }">
        <v-btn
          v-bind="tip"
          class="cms-icon-btn"
          variant="flat"
          size="small"
          aria-label="Chỉnh sửa"
          :to="editTo"
          @click.stop="$emit('edit')"
        >
          <v-icon size="17">mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <!-- Page-specific actions (ban, approve…) — use .cms-icon-btn to match -->
    <slot />

    <v-tooltip v-if="deletable" text="Xoá">
      <template #activator="{ props: tip }">
        <v-btn
          v-bind="tip"
          class="cms-icon-btn cms-icon-btn--danger"
          variant="flat"
          size="small"
          aria-label="Xoá"
          @click.stop="$emit('delete')"
        >
          <v-icon size="17">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </div>
</template>
