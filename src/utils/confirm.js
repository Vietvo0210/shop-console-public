import { h } from 'vue'
import { Modal } from 'ant-design-vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { notBlank } from '@/utils/variable'

export const showConfirm = (options = {}) => {
  return Modal.confirm({
    okText: 'OK',
    justOkText: 'OK',
    cancelText: 'Đóng',
    maskClosable: true,
    title: h('b', options.title),
    content: notBlank(options.content)
      ? h('p', {
        class: 'mt-4 mb-0',
        style: { whiteSpace: 'pre-line' },
      }, options.content)
      : null,
    ...options,
  })
}

export const showConfirmDelete = (modelName, name, options = {}) => {
  return showConfirm({
    title: 'Xác nhận xóa ' + modelName,
    icon: h(DeleteOutlined, { class: 'text-red-500' }),
    content: h('span', [`Bạn có chắc chắn muốn xóa ${modelName} `, h('b', name), ' không?']),
    okType: 'danger',
    okText: 'Xác nhận',
    ...options,
  })
}
