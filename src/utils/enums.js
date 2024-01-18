export const Truthy = Object.freeze({
  NO: 0,
  YES: 1,
})

export const TruthyEnum = Object.freeze({
  [Truthy.NO]: 'Không',
  [Truthy.YES]: 'Có',
})

export const ColorRange = Object.freeze(['blue', 'green', 'purple', 'pink', 'orange', 'cyan', 'red'])

export const TextAlignEnum = Object.freeze({
  left: 'Trái',
  center: 'Giữa',
  right: 'Phải',
})

export const BlacklistRecipientUpsertModeEnum = Object.freeze({
  upsert: 'Thủ công',
  import: 'Import',
})

export const BroadcastMappingParamType = Object.freeze({
  RECIPIENT_INFO: 'recipient.info',
  END_USERS_ZALO: 'end_users_zalo',
  STATIC: 'static',
})

export const BroadcastStatus = Object.freeze({
  WAITING: 0,
  SENDING: 1,
  DONE: 2,
  ERROR: 3,
  CANCELED: 4,
})

export const BroadcastType = Object.freeze({
  PROACTIVE: 1,
  AUTOMATIC: 2,
})

export const DownloadType = Object.freeze({
  RECIPIENT: 'recipient',
  MESSAGE: 'message',
})

export const DownloadStatus = Object.freeze({
  WAITING: 0,
  PROCESSING: 1,
  DONE: 2,
  ERROR: 3,
})

export const MessageResultEnum = Object.freeze({
  [Truthy.NO]: 'Thất bại',
  [Truthy.YES]: 'Thành công',
})

export const RecipientCollectionStatus = Object.freeze({
  WAITING: 0,
  PROCESSING: 1,
  DONE: 2,
  ERROR: 3,
})

export const RecipientCollectionType = Object.freeze({
  IMPORT: 1,
  WEBHOOK_SEND_BULK: 2,
})

export const SenderPlatform = Object.freeze({
  ZALO_OA: 'Zalo/OA',
  FPT_SMS: 'FPT/SMS',
  INFOBIP_SMS: 'Infobip/SMS',
})

export const SenderType = Object.freeze({
  ZALO_OA: 1,
  SMS: 2,
})

export const SendMode = Object.freeze({
  ZMS: 1,
  ZNS: 2,
  SMS: 3,
})

export const ZMSType = Object.freeze({
  CS: 'cs',
  TRANSACTION: 'transaction',
  PROMOTION: 'promotion',
})

export const ZMSTypeEnum = Object.freeze({
  [ZMSType.CS]: 'Tư vấn',
  [ZMSType.TRANSACTION]: 'Giao dịch',
  [ZMSType.PROMOTION]: 'Truyền thông',
})

export const ZMSMessageType = Object.freeze({
  TEXT: 'text',
  LIST: 'list',
  REQUEST_USER_INFO: 'request_user_info',
  MEDIA_IMAGE: 'media/image',
  MEDIA_STICKER: 'media/sticker',
  FILE: 'file',

  TRANSACTION: 'transaction',
  PROMOTION: 'promotion',
})

export const ZMSMessageTypeCs = Object.freeze([
  ZMSMessageType.TEXT,
  ZMSMessageType.LIST,
  ZMSMessageType.REQUEST_USER_INFO,
  //ZMSMessageType.MEDIA_IMAGE,
  //ZMSMessageType.MEDIA_STICKER,
  //ZMSMessageType.FILE,
])

export const ZMSMessageAction = Object.freeze({
  NOTHING: '',
  OPEN_URL: 'oa.open.url',
  QUERY_SHOW: 'oa.query.show',
  QUERY_HIDE: 'oa.query.hide',
  OPEN_SMS: 'oa.open.sms',
  OPEN_PHONE: 'oa.open.phone',
})

export const ZMSMessageActionEnum = Object.freeze({
  [ZMSMessageAction.NOTHING]: 'Không làm gì cả',
  [ZMSMessageAction.OPEN_URL]: 'Mở trang web',
  [ZMSMessageAction.QUERY_SHOW]: 'Gửi tin nhắn văn bản tới OA',
  [ZMSMessageAction.QUERY_HIDE]: 'Gửi tin nhắn văn bản tới OA (ẩn)',
  [ZMSMessageAction.OPEN_SMS]: 'Gửi tin nhắn SMS tới Quản trị viên',
  [ZMSMessageAction.OPEN_PHONE]: 'Gọi điện cho Quản trị viên',
})

export const ZMSMessageElementsDefaults = Object.freeze({
  ListV2: [
    {
      title: '',
      subtitle: '',
      image_url: '',
      default_action: {},
    },
  ],
  List: [
    {
      type: 'banner',
      image_url: '',
    },
    {
      type: 'header',
      align: 'left',
      content: '',
    },
    {
      type: 'table',
      content: [
        {
          key: 'Mã khách hàng',
          value: '',
        },
        {
          key: 'Tên khách hàng',
          value: '',
        },
        {
          key: 'Trạng thái',
          style: 'green',
          value: '',
        },
      ],
    },
  ],
})

export const ZMSMessageTransactionTemplateTypeEnum = Object.freeze({
  transaction_billing: 'Hóa đơn',
  transaction_order: 'Đơn hàng',
  transaction_reward: 'Tích điểm',
  transaction_contract: 'Hợp đồng',
  transaction_booking: 'Lịch hẹn',
  transaction_membership: 'Thành viên',
  transaction_event: 'Sự kiện',
  transaction_transaction: 'Giao dịch',
  transaction_account: 'Tài khoản',
  transaction_internal: 'Nội bộ',
  transaction_partnership: 'Đối tác',
  transaction_education: 'Học vụ',
  transaction_rating: 'Đánh giá',
})

export const ZMSMessageButtonDefault = Object.freeze({
  title: null,
  image_icon: null,
  type: '',
  payload: null,
})

export const ZMSSelectImageType = Object.freeze({
  UPLOAD: 1,
  URL: 2,
})

export const ZMSSelectImageTypeEnum = Object.freeze({
  [ZMSSelectImageType.UPLOAD]: 'Tải lên ảnh',
  [ZMSSelectImageType.URL]: 'Nhập URL ảnh',
})

export const ZMSElementTableRowStatusColorEnum = Object.freeze({
  green: 'Xanh lá',
  blue: 'Xanh dương',
  yellow: 'Vàng',
  red: 'Đỏ',
  grey: 'Xám',
})

export const ZNSParamTypeEnum = Object.freeze({
  STRING: 'Chuỗi',
  NUMBER: 'Số',
  CURRENCY: 'Số tiền',
  DATE: 'Thời gian',
})

export const ZNSMessageTemplateTag = Object.freeze({
  OTP: 'OTP',
  IN_TRANSACTION: 'Xác nhận, cập nhật giao dịch',
  POST_TRANSACTION: 'Hỗ trợ dịch vụ liên quan sau giao dịch',
  ACCOUNT_UPDATE: 'Cập nhật thông tin tài khoản',
  GENERAL_UPDATE: 'Thay đổi thông tin dịch vụ',
  FOLLOW_UP: 'Thông báo ưu đãi đến khách hàng cũ',
})

export const ZNSQuality = Object.freeze({
  HIGH: 'Mức độ chất lượng tốt',
  MEDIUM: 'Mức độ chất lượng trung bình',
  LOW: 'Mức độ chất lượng kém',
  UNDEFINED:
    'Mức độ chất lượng OA chưa được xác định (trường hợp OA không gửi thông báo ZNS nào trong khung thời gian đánh giá)',
})
