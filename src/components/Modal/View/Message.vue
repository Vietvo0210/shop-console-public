<template>
  <modal title="Xem tin nhắn" :loading="loading" :footer="null" mask-closable>
    <div class="text-center">
      <component
        :is="ViewMessageComponent"
        :template="templateState"
        class="mx-auto"
        :class="{ 'w-[336px]': ViewMessageComponent !== ViewMessageZns }"
        v-bind="_.mapKeys(messageProps, (v, k) => _.camelCase(k))"
      />
    </div>
  </modal>
</template>

<script>
export default {
  name: 'ModalViewMessage',
}
</script>

<script setup>
import Modal from '@/components/Modal'
import notice from '@/utils/notice'
import { computed, reactive, ref, useAttrs, watch } from 'vue'
import { toggleState } from '@/utils/toggle'
import Template from '@/models/Template'
import { useStore } from 'vuex'
import { SendMode } from '@/utils/enums'
import _ from 'lodash'
import ViewMessageZms from '@/components/Page/View/Message/ZMS'
import ViewMessageZns from '@/components/Page/View/Message/ZNS'
import ViewMessageSms from '@/components/Page/View/Message/SMS'

const props = defineProps({
  template: {
    type: Object,
    default: () => ({}),
  },
  messageProps: {
    type: Object,
    default: () => ({}),
  },
})

const store = useStore()
const attrs = useAttrs()

const templateState = reactive(new Template())
const loading = ref(false)

const ViewMessageComponent = computed(() => {
  const mapping = {
    [SendMode.ZMS]: ViewMessageZms,
    [SendMode.ZNS]: ViewMessageZns,
    [SendMode.SMS]: ViewMessageSms,
  }
  return mapping[templateState.send_mode]
})

const fetchTemplate = () => {
  templateState.fill(props.template)

  if (templateState.id) {
    return store
      .dispatch('template/DETAIL', templateState.id)
      .then(item => templateState.fill(item))
      .catch(notice.error)
  }
}

watch(
  () => attrs.visible,
  visible => {
    if (visible) {
      toggleState(() => {
        return fetchTemplate()
      }, loading)
    }
  },
)
</script>
