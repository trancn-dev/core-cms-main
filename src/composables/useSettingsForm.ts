import { ref, computed, type Ref } from 'vue';
import { useToast } from 'vue-toast-notification';

/**
 * State for a settings page: the editable form, a snapshot of the last saved
 * values, "Huỷ" restores that snapshot, "Lưu" persists and re-snapshots.
 *
 * `persist` is where the API call goes once the backend exists.
 */
export function useSettingsForm<T extends object>(initial: T, persist: (values: T) => Promise<void> = () => new Promise((r) => setTimeout(r, 600))) {
  const clone = (v: T): T => JSON.parse(JSON.stringify(v));

  const saved = ref(clone(initial)) as Ref<T>;
  const form = ref(clone(initial)) as Ref<T>;
  const saving = ref(false);
  const toast = useToast();

  const dirty = computed(() => JSON.stringify(form.value) !== JSON.stringify(saved.value));

  function reset() {
    form.value = clone(saved.value);
  }

  async function save() {
    saving.value = true;
    try {
      await persist(form.value);
      saved.value = clone(form.value);
      toast.success('Đã lưu cài đặt.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Không lưu được cài đặt.');
    } finally {
      saving.value = false;
    }
  }

  return { form, saving, dirty, reset, save };
}
