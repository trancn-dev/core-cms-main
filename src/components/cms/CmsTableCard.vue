<script setup lang="ts">
import { computed } from 'vue';
import CmsTableSkeleton from './CmsTableSkeleton.vue';
import CmsEmptyState from './CmsEmptyState.vue';

/**
 * Shell for every list page: toolbar, full-bleed table, load states, footer.
 *
 * The table deliberately sits outside `v-card-text` — inside it, the 24px
 * padding squeezes the 140px action column onto a second line.
 */
const props = withDefaults(
  defineProps<{
    /** Column count, used for the skeleton and the empty-state colspan. */
    columns: number;
    loading?: boolean;
    error?: string | null;
    /** Rows currently rendered; drives the empty state. */
    count: number;
    total?: number;
    page?: number;
    itemsPerPage?: number;
    /** Noun for the footer count, e.g. "video" → "Hiển thị 1–8 / 128 video". */
    unit?: string;
    thumbColumn?: number;
    chipColumn?: number;
    emptyTitle?: string;
    emptyDescription?: string;
  }>(),
  {
    total: 0,
    page: 1,
    itemsPerPage: 10,
    unit: 'mục',
    emptyTitle: 'Không tìm thấy dữ liệu',
    emptyDescription: 'Thử xoá bộ lọc hoặc thêm mục đầu tiên.'
  }
);

const emit = defineEmits<{ 'update:page': [value: number]; retry: [] }>();

const isEmpty = computed(() => !props.loading && !props.error && props.count === 0);
const showRows = computed(() => !props.loading && !props.error && props.count > 0);
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.itemsPerPage)));
const rangeStart = computed(() => (props.page - 1) * props.itemsPerPage + 1);
const rangeEnd = computed(() => Math.min(props.page * props.itemsPerPage, props.total));

const fmt = (n: number) => n.toLocaleString('vi-VN');
</script>

<template>
  <v-card variant="outlined" rounded="lg" elevation="0" class="cms-table-card">
    <div v-if="$slots.toolbar" class="cms-toolbar">
      <slot name="toolbar" />
    </div>

    <div class="cms-table-wrap">
      <table class="cms-table">
        <thead>
          <slot name="head" />
        </thead>

        <CmsTableSkeleton
          v-if="loading"
          :columns="columns"
          :thumb-column="thumbColumn"
          :chip-column="chipColumn"
        />

        <tbody v-else-if="error">
          <tr style="cursor: default">
            <td :colspan="columns" class="border-0">
              <CmsEmptyState
                icon="mdi-cloud-off-outline"
                tone="error"
                title="Không tải được dữ liệu"
                :description="error"
              >
                <template #actions>
                  <v-btn color="primary" size="small" prepend-icon="mdi-refresh" @click="emit('retry')">
                    Thử lại
                  </v-btn>
                </template>
              </CmsEmptyState>
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="isEmpty">
          <tr style="cursor: default">
            <td :colspan="columns" class="border-0">
              <slot name="empty">
                <CmsEmptyState :title="emptyTitle" :description="emptyDescription">
                  <template v-if="$slots['empty-actions']" #actions>
                    <slot name="empty-actions" />
                  </template>
                </CmsEmptyState>
              </slot>
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="showRows">
          <slot name="body" />
        </tbody>
      </table>
    </div>

    <div v-if="showRows && total > 0" class="cms-table-footer">
      <span>Hiển thị {{ fmt(rangeStart) }}–{{ fmt(rangeEnd) }} / {{ fmt(total) }} {{ unit }}</span>
      <v-pagination
        v-if="totalPages > 1"
        :model-value="page"
        :length="totalPages"
        :total-visible="5"
        density="compact"
        @update:model-value="emit('update:page', $event)"
      />
    </div>
  </v-card>
</template>
