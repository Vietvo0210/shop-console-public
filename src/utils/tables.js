import { PAGE_SIZE } from '@/utils/consts'
import format from '@/utils/format'

export const paginationOptions = (list, extra = {}) => ({
  current: list.current_page ?? 1,
  pageSize: list.per_page ?? PAGE_SIZE,
  pageSizeOptions: ['10', '25', '50', '100'],
  total: list.total,
  showTotal: (total, range) =>
    `Hiển thị từ ${range[0]} đến ${range[1]}, trong tổng số ${format.toNumber(total)} dữ liệu`,
  showLessItems: true,
  ...extra,
})
