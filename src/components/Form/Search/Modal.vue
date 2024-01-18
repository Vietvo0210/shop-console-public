<template>
  <a-form layout="vertical" class="form-search-modal flex gap-2" @finish="emit('search')">
    <a-collapse collapsible="disabled" class="flex-auto bg-transparent border-0" :active-key="activeKey">
      <a-collapse-panel :show-arrow="false" key="1" class="border-0">
        <template #header>
          <div class="flex items-center w-full grid grid-cols-2 gap-2">
            <slot />
          </div>
        </template>

        <div v-if="$slots.detail" class="flex w-full grid grid-cols-2 gap-2">
          <slot name="detail" />
        </div>
      </a-collapse-panel>
    </a-collapse>

    <div class="flex-none flex items-end gap-x-2">
      <btn
        v-if="$slots.detail"
        theme="info"
        :icon="`chevron-${activeKey ? 'up' : 'down'}`"
        :tooltip="activeKey ? 'Thu gọn' : 'Tìm kiếm nâng cao'"
        :class="{ 'bg-sky-600 border-sky-700': activeKey }"
        only-icon
        @click="activeKey = cast.toNumber(!activeKey)"
      />
      <btn-search type="submit" />
      <btn-cancel @click="emit('reset')" />
    </div>
  </a-form>
</template>

<script>
export default {
  name: 'FormSearchModal',
}
</script>

<script setup>
import { ref } from 'vue'
import cast from '@/utils/cast'
import Btn from '@/components/Button'
import BtnSearch from '@/components/Button/Search'
import BtnCancel from '@/components/Button/Cancel'

const emit = defineEmits(['search', 'reset'])

const activeKey = ref(0)
</script>
