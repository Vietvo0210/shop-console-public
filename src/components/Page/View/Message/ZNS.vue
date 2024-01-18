<template>
  <iframe v-if="notBlank(srcdoc)" :srcdoc="srcdoc" class="border-0" @load="fitIframeWithContent($event.target)" />
</template>

<script>
export default {
  name: 'ViewMessageZns',
}
</script>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { ifBlank, notBlank } from '@/utils/variable'
import notice from '@/utils/notice'
import _ from 'lodash'

const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
  templateData: {
    type: Object,
    default: () => ({}),
  },
})

const store = useStore()

const originSrcdoc = ref('')
const srcdoc = ref('')

const fitIframeWithContent = iframe => {
  const frameDocument = iframe.contentDocument || iframe.contentWindow.document
  frameDocument.body.removeAttribute('style')
  frameDocument.body.style.padding = '12px 0'

  const previewContainer = frameDocument.querySelector('.preview-container')
  previewContainer.style.margin = 0

  if (previewContainer instanceof iframe.contentWindow.HTMLElement) {
    iframe.width = previewContainer.clientWidth
    iframe.height = frameDocument.body.clientHeight
  }
}

const replaceTemplateData = () => {
  srcdoc.value = originSrcdoc.value
  _.each(props.templateData, (v, k) => {
    srcdoc.value = srcdoc.value.replace(new RegExp(`(<|&lt;)${k}(>|&gt;)`, 'g'), ifBlank(v, 'null'))
  })
}

const fetchPreview = () => {
  srcdoc.value = null

  const { previewUrl } = props.template.message
  if (notBlank(previewUrl)) {
    store
      .dispatch('fetchHtml/GET', previewUrl)
      .then(html => {
        originSrcdoc.value = html
        replaceTemplateData()
      })
      .catch(notice.error)
  }
}

watch(() => props.templateData, replaceTemplateData)
watch(() => props.template.message, fetchPreview, { immediate: true })
</script>
