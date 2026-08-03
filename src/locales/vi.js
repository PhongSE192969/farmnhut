export default {
  "common": {
    "dashboard": "Dashboard",
    "logout": "Đăng xuất",
    "language": "Ngôn ngữ",
    "allFranchise": "Tất cả Đại lý"
  },
  "sidebar": {
    "Dashboard": "Tổng quan",
    "Manager Panel": "Quản lý Đại lý",
    "Admin Panel": "Quản trị Hệ thống",
    "Staff Portal": "Cổng Nhân viên",
    "Franchises": "Đại lý",
    "Identity": "Tài khoản",
    "Users": "Người dùng",
    "Roles & Permissions": "Vai trò & Quyền",
    "Catalog": "Danh mục",
    "Products": "Phân bón",
    "Categories": "Phân loại",
    "Promotions": "Ưu đãi",
    "Inventories": "Kho hàng",
    "Orders": "Đơn vật tư",
    "Customers & Loyalty": "Khách hàng & Thân thiết",
    "Customers": "Khách hàng",
    "Loyalty Programs": "CT Thân thiết",
    "Shift Manager": "Quản lý Ca",
    "Staff": "Nhân viên",
    "Shift Management": "Quản lý Ca",
    "Shift Schedule": "Lịch ca",
    "AI Settings": "Cài đặt AI",
    "My Schedule": "Lịch của tôi",
    "Order Management": "Quản lý đơn vật tư",
    "New Order": "Bán tại đại lý",
    "New Customer": "Khách mới",
    "Loyalty": "Thành viên",
    "Store Requests": "Yêu cầu Đại lý"
  },
  "orderManagement": {
    "title": "Quản lý Đơn vật tư Toàn hệ thống",
    "subtitle": "Theo dõi toàn bộ lịch sử và trạng thái quy trình vận hành chuỗi đại lý",
    "statTotal": "Tổng đơn vật tư",
    "statCompleted": "Đã hoàn tất",
    "statPending": "Chờ xử lý",
    "statCancelled": "Đã hủy",
    "searchPlaceholder": "Tìm theo mã Đơn vật tư (Order ID)...",
    "columns": [
      "Mã đơn vật tư",
      "Thời gian",
      "Đại lý",
      "Khách hàng",
      "Hình thức",
      "Tổng tiền",
      "Trạng thái",
      ""
    ],
    "loading": "Đang tải dữ liệu...",
    "empty": "Không có đơn vật tư nào",
    "guest": "Vãng lai (Guest)",
    "defaultType": "Mặc định",
    "page": "Trang",
    "prev": "Trước",
    "next": "Kế tiếp",
    "statusOptions": [
      {
        "value": "ALL",
        "label": "Tất cả đơn vật tư"
      },
      {
        "value": "WAITING_FOR_CONFIRMATION",
        "label": "Chờ xác nhận"
      },
      {
        "value": "PREPARING",
        "label": "Đang chuẩn bị xuất kho"
      },
      {
        "value": "SHIPPING",
        "label": "Đang giao"
      },
      {
        "value": "COMPLETED",
        "label": "Đơn hoàn tất"
      },
      {
        "value": "CANCELLED",
        "label": "Hủy"
      },
      {
        "value": "FAILED_ORDER",
        "label": "Đơn thất bại"
      },
      {
        "value": "REFUNDED",
        "label": "Hoàn trả"
      }
    ],
    "typeOptions": [
      {
        "value": "ALL",
        "label": "Tất cả hình thức"
      },
      {
        "value": "POS",
        "label": "Tại đại lý (POS)"
      },
      {
        "value": "ONLINE",
        "label": "Giao về nông trại"
      }
    ],
    "statusBadge": {
      "WAITING_FOR_CONFIRMATION": "Chờ xác nhận",
      "PREPARING": "Đang chuẩn bị xuất kho",
      "SHIPPING": "Đang giao",
      "COMPLETED": "Đơn hoàn tất",
      "CANCELLED": "Hủy",
      "FAILED_ORDER": "Đơn thất bại",
      "REFUNDED": "Hoàn trả"
    }
  },
  "admin": {
    "dashboard": {
      "title": "Tổng quan",
      "error": "Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.",
      "stats": {
        "totalRevenue": "Tổng Doanh Số",
        "totalOrders": "Tổng Đơn Vật Tư",
        "activeBranches": "Đại Lý Hoạt Động",
        "branchesUnit": "đại lý",
        "completedOrders": "đơn hoàn thành",
        "productsUnit": "Tổng phân bón:",
        "noData": "Chưa có dữ liệu"
      },
      "loading": {
        "title": "Đang tải dữ liệu...",
        "details": "Đã tải {count} đại lý",
        "connecting": "Đang kết nối đến services..."
      },
      "retry": "Thử lại",
      "revenueChart": {
        "title": "So Sánh Doanh Số Đại Lý",
        "periods": {
          "thisMonth": "Tháng này",
          "lastMonth": "Tháng trước",
          "thisQuarter": "Quý này",
          "thisYear": "Năm nay"
        },
        "metrics": {
          "revenue": "Doanh Số (Triệu đ)",
          "orders": "Đơn Vật Tư"
        }
      },
      "table": {
        "title": "Doanh Số Theo Đại Lý",
        "branchTitle": "Đại Lý",
        "revenueTitle": "Doanh Số",
        "ordersTitle": "Đơn Vật Tư",
        "shareTitle": "Tỷ Trọng",
        "noData": "Chưa có dữ liệu doanh số"
      },
      "charts": {
        "revenueTitle": "Biểu Đồ Doanh Số Theo Đại Lý",
        "noData": "Chưa có dữ liệu để hiển thị biểu đồ",
        "intervals": {
          "days7": "7 ngày qua",
          "days30": "30 ngày qua",
          "months3": "3 tháng qua",
          "years1": "1 năm qua"
        },
        "revenueByBranch": "Doanh số theo từng đại lý",
        "revenueDaily": "Doanh số hàng ngày - ",
        "revenueTrend": "Xu hướng doanh số theo thời gian",
        "millionVND": " triệu VNĐ"
      },
      "sidebar": {
        "topProducts": "Top 3 Phân Bón Bán Chạy",
        "soldUnit": "đã bán",
        "waitingProduct": "Đang chờ Dịch vụ phân bón...",
        "loyalCustomers": "Khách hàng Thân Thiết",
        "ordersUnit": "đơn vật tư",
        "waitingCustomer": "Đang chờ Dịch vụ khách hàng...",
        "noCustomerData": "Chưa có dữ liệu khách hàng",
        "unitDay": "ngày",
        "unitCustomer": "khách hàng"
      },
      "footer": {
        "lastUpdated": "Cập nhật lần cuối: "
      }
    },
    "customersManagement": {
      "title": "Quản lý Khách hàng",
      "subtitle": "Hiểu và tương tác với cộng đồng yêu vật tư nông nghiệp của bạn",
      "addCustomer": "Thêm Khách hàng mới",
      "stats": {
        "total": "Tổng Khách hàng",
        "registered": "Đã đăng ký hệ thống",
        "active": "Người dùng Hoạt động",
        "currentlyActive": "Hiện đang hoạt động",
        "inactive": "Người dùng Không hoạt động",
        "needAttention": "Cần chú ý",
        "engagement": "Tương tác",
        "activeRate": "Tỷ lệ hoạt động"
      },
      "searchPlaceholder": "Tìm theo tên, email hoặc SĐT...",
      "allStatus": "Tất cả trạng thái",
      "active": "Hoạt động",
      "inactive": "Không hoạt động",
      "exportData": "Xuất dữ liệu",
      "table": {
        "info": "Thông tin Khách hàng",
        "contact": "Liên hệ",
        "status": "Trạng thái",
        "loading": "Đang tải danh sách...",
        "noData": "Không tìm thấy khách hàng nào"
      },
      "confirmDelete": "Bạn có chắc chắn muốn xóa khách hàng này?",
      "deleteFailed": "Xóa khách hàng thất bại"
    },
    "categoryManagement": {
      "title": "Quản lý Danh mục",
      "subtitle": "Tổ chức phân bón theo nhóm hợp lý cho danh mục vật tư",
      "newCategory": "Danh mục mới",
      "stats": {
        "total": "Tổng Danh mục",
        "departments": "Phòng ban hệ thống",
        "active": "Hoạt động",
        "onMenu": "Hiện trên danh mục vật tư",
        "liveProducts": "Phân bón Live",
        "totalAcross": "Tổng trên các danh mục",
        "inactive": "Không hoạt động",
        "hidden": "Ẩn với khách hàng"
      },
      "searchPlaceholder": "Tìm kiếm danh mục...",
      "allStatus": "Tất cả trạng thái",
      "activeStatus": "Hoạt động",
      "inactiveStatus": "Không hoạt động",
      "table": {
        "name": "Tên Danh mục",
        "slug": "Slug",
        "products": "Phân bón",
        "updated": "Cập nhật cuối",
        "status": "Trạng thái",
        "viewProducts": "Xem phân bón",
        "noData": "Không tìm thấy danh mục nào"
      },
      "modals": {
        "productsTitle": "Phân bón trong danh mục",
        "noProducts": "Không có phân bón nào",
        "close": "Đóng"
      },
      "confirmDelete": "Xóa danh mục này?",
      "deleteFailed": "Xóa thất bại"
    },
    "productManagement": {
      "title": "Quản lý Phân bón",
      "subtitle": "Quản lý danh mục vật tư nông nghiệp",
      "addProduct": "Thêm Phân bón mới",
      "stats": {
        "total": "Tổng Phân bón",
        "unique": "Mặt hàng trong danh mục",
        "available": "Sẵn sàng",
        "ready": "Sẵn sàng bán",
        "lowStock": "Sắp hết hàng",
        "needRestock": "Mặt hàng cần nhập thêm",
        "value": "Giá trị Kho",
        "potential": "Doanh số tiềm năng"
      },
      "searchPlaceholder": "Tìm phân bón theo tên hoặc SKU...",
      "allCategories": "Tất cả danh mục",
      "allStatus": "Tất cả trạng thái",
      "table": {
        "info": "Thông tin Phân bón",
        "category": "Danh mục",
        "price": "Giá",
        "stock": "Kho",
        "status": "Trạng thái",
        "noData": "Không tìm thấy phân bón nào"
      }
    },
    "promotionManagement": {
      "title": "Quản lý Ưu đãi",
      "subtitle": "Quản lý ưu đãi và chiến dịch marketing",
      "newPromotion": "Ưu đãi mới",
      "stats": {
        "total": "Tổng Ưu đãi",
        "all": "Tất cả chiến dịch",
        "active": "Hoạt động",
        "running": "Hiện đang chạy",
        "inactive": "Không hoạt động",
        "expired": "Hết hạn"
      },
      "searchPlaceholder": "Tìm kiếm ưu đãi...",
      "allStatus": "Tất cả trạng thái",
      "allPermissions": "Tất cả Quyền hạn",
      "rank": {
        "all": "Tất cả hạng",
        "bronze": "Đồng",
        "silver": "Bạc",
        "gold": "Vàng",
        "platinum": "Bạch kim",
        "diamond": "Kim cương"
      },
      "table": {
        "name": "Tên Ưu đãi",
        "discount": "Ưu đãi",
        "rank": "Hạng",
        "status": "Trạng thái",
        "updated": "Cập nhật cuối",
        "generate": "Tạo Mã",
        "noData": "Không tìm thấy ưu đãi nào"
      },
      "confirmDelete": "Xóa ưu đãi này?",
      "deleteFailed": "Xóa thất bại"
    },
    "inventoryManagement": {
      "title": "Quản trị Kho hệ thống",
      "subtitle": "Giám sát, phê duyệt và điều phối hàng hóa cho toàn đại lý",
      "tabs": {
        "overview": "Tổng quan tồn kho",
        "requests": "Yêu cầu nhập hàng",
        "transfers": "Lệnh điều chuyển",
        "logs": "Nhật ký giao dịch"
      },
      "overview": {
        "searchPlaceholder": "Tìm kiếm phân bón...",
        "filterLowStock": "Lọc hàng sắp hết",
        "filterLowStockActive": "Đang lọc hàng thấp",
        "allLocations": "Tất cả địa điểm",
        "mainWarehouse": "Kho Tổng (Hệ thống)",
        "mainWarehouseShort": "Kho Tổng",
        "branchDefault": "Đại lý",
        "statusLow": "Sắp hết hàng",
        "statusSafe": "An toàn"
      },
      "table": {
        "product": "Phân bón",
        "location": "Địa điểm",
        "actual": "Thực tế",
        "reserved": "Giữ chỗ",
        "available": "Khả dụng",
        "status": "Trạng thái"
      },
      "requests": {
        "title": "Danh sách yêu cầu nhập hàng",
        "code": "Mã yêu cầu",
        "unit": "Đơn vị yêu cầu",
        "details": "Chi tiết",
        "notes": "Ghi chú",
        "actions": "Thao tác",
        "approve": "Duyệt",
        "reject": "Từ chối",
        "ship": "Xuất hàng",
        "insufficientStock": "Kho xuất không đủ hàng để xuất",
        "waitingFranchise": "CHI NHÁNH XỬ LÝ",
        "empty": "Không có yêu cầu nhập hàng nào",
        "warehouseInfo": "Kho xuất còn: {qty}",
        "productDefault": "Phân bón"
      },
      "transfers": {
        "title": "Danh sách lệnh điều chuyển",
        "code": "Lệnh điều chuyển",
        "route": "Lộ trình",
        "status": "Trạng thái",
        "details": "Chi tiết",
        "itemsCount": "{count} mặt hàng",
        "empty": "Không có lệnh điều chuyển nào"
      },
      "logs": {
        "title": "Lịch sử giao dịch",
        "subtitle": "Lọc khoảng ngày phát sinh",
        "from": "Từ",
        "to": "Đến",
        "clearFilter": "Xóa lọc",
        "time": "Thời gian",
        "branch": "Đại lý",
        "product": "Phân bón",
        "change": "Biến động",
        "balance": "Số dư (Trước/Sau)",
        "type": "Phân loại",
        "empty": "Không tìm thấy giao dịch nào",
        "size": "Size",
        "color": "Màu",
        "types": {
          "IMPORT": "Nhập kho",
          "EXPORT": "Xuất kho",
          "TRANSFER": "Điều chuyển",
          "ADJUST": "Điều chỉnh"
        }
      },
      "status": {
        "pending": "Chờ duyệt",
        "approved": "Đã duyệt",
        "shipping": "Đang giao",
        "shipped": "Đang giao",
        "received": "Đã nhận",
        "rejected": "Từ chối",
        "completed": "Hoàn tất"
      },
      "actions": {
        "importWarehouse": "Nhập kho tổng",
        "exportTransfer": "Xuất kho / Điều chuyển",
        "confirmImport": "Xác nhận nhập",
        "confirmExport": "Xác nhận xuất",
        "createRequest": "Tạo yêu cầu nhập hàng",
        "submitRequest": "Gửi yêu cầu"
      },
      "modals": {
        "approveTitle": "Phê duyệt Yêu cầu",
        "rejectTitle": "Từ chối Yêu cầu",
        "sourceLabel": "Chọn Nguồn cấp hàng",
        "reasonLabel": "Lý do từ chối (không bắt buộc)",
        "reasonPlaceholder": "Nhập lý do tại đây...",
        "cancel": "Hủy",
        "confirm": "Xác nhận",
        "importTitle": "Nhập kho hệ thống (Kho Tổng)",
        "transferTitle": "Xuất kho / Điều chuyển",
        "confirmReject": "Bạn có chắc chắn muốn từ chối lệnh điều chuyển này?"
      },
      "alerts": {
        "lowStockTitle": "Cảnh báo: Hàng sắp hết!",
        "lowStockDesc": "Có {count} mặt hàng ở mức báo động.",
        "pendingRequestsTitle": "Hành động: Duyệt yêu cầu!",
        "pendingRequestsDesc": "Có {count} yêu cầu mới phê duyệt.",
        "viewNow": "Xem ngay",
        "processNow": "Xử lý ngay",
        "loading": "Đang tải...",
        "shipError": "Lỗi xuất hàng: {error}"
      }
    },
    "catalogModal": {
      "selectProduct": "Chọn phân bón",
      "confirm": "Xác nhận",
      "successTitle": "Thao tác thành công!",
      "successDesc": "Hệ thống đang đồng bộ dữ liệu tự động...",
      "searchPlaceholder": "Tìm kiếm phân bón...",
      "noProducts": "Không tìm thấy phân bón nào trên trang này",
      "allCategories": "Tất cả danh mục",
      "filter": "Lọc",
      "needImport": "Cần nhập",
      "selected": "Đã chọn",
      "exportList": "Danh sách xuất",
      "importList": "Danh sách nhập",
      "itemsCount": "{count} mặt hàng",
      "receivingBranch": "Đại lý nhận hàng",
      "selectBranch": "-- Chọn đại lý nhận --",
      "notesPlaceholder": "Nhập ghi chú (VD: Giao nhanh cho sự kiện tuần này...)",
      "emptyList": "Danh sách đang trống",
      "cancel": "Hủy",
      "selectBranchAlert": "Vui lòng chọn đại lý nhận hàng!",
      "errorOccurred": "Có lỗi xảy ra: ",
      "loading": "Đang tải..."
    },
    "loyaltyManagement": {
      "title": "Quản lý Hạng thành viên",
      "subtitle": "Hệ thống điểm: 10,000 VNĐ = 1 điểm",
      "addTier": "Thêm Hạng mới",
      "table": {
        "name": "Tên Hạng",
        "points": "Điểm yêu cầu",
        "benefits": "Số quyền lợi",
        "actions": "Hành động",
        "loading": "Đang tải dữ liệu...",
        "noData": "Không có dữ liệu hạng thành viên",
        "view": "Chi tiết",
        "edit": "Sửa",
        "delete": "Xóa"
      },
      "modals": {
        "addTitle": "Thêm Hạng mới",
        "editTitle": "Sửa Hạng: {name}",
        "nameLabel": "Tên Hạng (VD: SILVER, GOLD)",
        "pointsLabel": "Điểm yêu cầu (Mốc)",
        "benefitsLabel": "Quyền lợi",
        "benefitPlaceholder": "VD: Giảm 5% cho tất cả đơn vật tư...",
        "addBenefit": "Thêm quyền lợi",
        "cancel": "Hủy",
        "create": "Tạo",
        "save": "Lưu thay đổi",
        "viewTitle": "Chi tiết Hạng",
        "spendLabel": "Số tiền đã chi tiêu:",
        "privileges": "Quyền lợi Hạng",
        "noBenefits": "Chưa có quyền lợi nào được tạo."
      },
      "alerts": {
        "confirmDelete": "Bạn có chắc chắn muốn xóa hạng này?",
        "deleteSuccess": "Xóa hạng thành công",
        "deleteFailed": "Xóa hạng thất bại",
        "deleteError": "Lỗi xảy ra khi xóa",
        "fillAll": "Vui lòng điền đầy đủ dữ liệu hợp lệ.",
        "pointsHigher": "Không hợp lệ: Điểm phải cao hơn hạng trước.",
        "pointsLower": "Không hợp lệ: Điểm phải thấp hơn hạng sau.",
        "duplicatePoints": "Xung đột: Hạng yêu cầu số điểm này đã tồn tại.",
        "saveSuccess": "Cấu hình hạng đã được lưu thành công",
        "saveFailed": "Lưu cấu hình thất bại",
        "saveError": "Lỗi xảy ra khi lưu"
      }
    },
    "franchiseManagement": {
      "title": "Quản lý Đại lý Nhượng quyền",
      "subtitle": "Giám sát và quản lý mạng lưới cà phê toàn cầu của bạn",
      "addFranchise": "Thêm Đại lý mới",
      "stats": {
        "total": "Tổng đại lý",
        "active": "Đang hoạt động",
        "inactive": "Ngừng hoạt động",
        "new": "Đại lý mới"
      },
      "searchPlaceholder": "Tìm theo tên đại lý...",
      "allStatus": "Tất cả trạng thái",
      "status": {
        "new": "Đại lý mới",
        "active": "Đang hoạt động",
        "inactive": "Ngừng hoạt động",
        "deleted": "Đã xóa"
      },
      "switch": {
        "active": "Hoạt động",
        "inactive": "Dừng hoạt",
        "activate": "Kích hoạt"
      },
      "table": {
        "name": "Tên đại lý",
        "address": "Địa chỉ",
        "status": "Trạng thái",
        "actions": "Hành động",
        "loading": "Đang tải danh sách...",
        "loadFailed": "Không thể tải danh sách đại lý",
        "loadHelp": "Kiểm tra: Backend service đã chạy chưa?",
        "retry": "Thử lại",
        "view": "Xem",
        "delete": "Xóa",
        "activate": "Kích hoạt",
        "deactivate": "Vô hiệu hóa",
        "noData": "Chưa có đại lý nào. Tạo đại lý đầu tiên để bắt đầu.",
        "noMatch": "Không tìm thấy đại lý phù hợp.",
        "noAddress": "Chưa có địa chỉ",
        "viewOnMap": "Xem trên bản đồ"
      },
      "alerts": {
        "createSuccess": "Đã thêm đại lý thành công",
        "updateSuccess": "Cập nhật đại lý thành công",
        "deleteSuccess": "Đã xóa đại lý (ẩn)",
        "deleteActiveError": "Không thể xóa đại lý đang hoạt động. Vui lòng dừng hoạt động trước.",
        "deleteConfirmTitle": "Xóa đại lý",
        "deleteConfirmMessage": "Bạn có chắc chắn muốn xóa đại lý \"{name}\"? Hành động này không thể hoàn tác.",
        "noAddress": "Không có địa chỉ để hiển thị bản đồ",
        "statusActive": "Đã chuyển sang Hoạt động",
        "statusInactive": "Đã chuyển sang Ngừng hoạt động",
        "statusNew": "Đã đặt về trạng thái Đại lý mới"
      }
    },
    "aiSettingsManagement": {
      "title": "Cài đặt AI",
      "subtitle": "Quản lý thông số Semantic Search & Recommendation System",
      "loading": "Đang tải Cài đặt AI...",
      "overview": {
        "systemStatus": "Trạng thái hệ thống",
        "detailedConfig": "Cấu hình chi tiết",
        "semanticWeights": "Trọng số Semantic",
        "core": "Core",
        "desc": "Desc",
        "active": "Đang Bật",
        "disabled": "Đã Tắt",
        "hours": "giờ",
        "none": "Không có",
        "loading": "Đang tải...",
        "syncVector": "Đồng bộ Kho tri thức AI"
      },
      "searchWeights": {
        "title": "Semantic Search Weights",
        "subtitle": "Điều chỉnh trọng số các thành phần cho Semantic Search",
        "info": "w_core — trọng số cho tên phân bón + danh mục.\n w_desc — cho mô tả phân bón. Tổng w_core + w_desc phải bằng 1.0.",
        "wCoreLabel": "w_core (tên + danh mục)",
        "wDescLabel": "w_desc (mô tả)",
        "sumLabel": "Tổng:",
        "updateBtn": "Cập nhật Weights"
      },
      "schedule": {
        "title": "Lịch Auto-Train Model Recommendation",
        "subtitle": "Tự động build lại model theo chu kỳ",
        "autoTrain": "Tự động train",
        "autoTrainDesc": "Model sẽ tự build lại theo chu kỳ dưới đây",
        "interval": "Chu kỳ (giờ)",
        "intervalLabel": "= {day} ngày {hour} giờ",
        "saveBtn": "Lưu lịch tự động"
      },
      "actions": {
        "title": "Actions & Status",
        "subtitle": "Build lại model thủ công hoặc cập nhật Kho tri thức AI",
        "status": {
          "model": "Model",
          "ready": "Sẵn sàng",
          "notTrained": "Chưa train",
          "training": "Training",
          "trainingActive": "Đang train...",
          "idle": "Nghỉ",
          "snapshot": "Snapshot"
        },
        "buttons": {
          "buildNow": "Build Recommendation Ngay",
          "updateVector": "Cập nhật Kho tri thức AI",
          "refresh": "Làm mới",
          "currentConfig": "Config hiện tại"
        }
      },
      "alerts": {
        "loadFailed": "Không thể tải config từ AI Service",
        "invalidWeight": "Giá trị weight không hợp lệ",
        "weightSum": "Tổng weights phải bằng 1.0",
        "updateWeightsSuccess": "Cập nhật weights thành công!",
        "updateScheduleSuccess": "Cập nhật lịch tự động thành công!",
        "trainStarted": "Đã bắt đầu train model!",
        "updateVectorSuccess": "Cập nhật Kho tri thức AI thành công!"
      }
    },
    "roleManagement": {
      "title": "Vai trò & Quyền hạn",
      "subtitle": "Xác định mức độ truy cập và chính sách bảo mật",
      "managePermissions": "Quản lý Quyền hạn",
      "createRole": "Tạo Vai trò mới",
      "stats": {
        "totalRoles": "Tổng số Vai trò",
        "permissions": "Quyền hạn",
        "avgAccess": "Truy cập Trung bình",
        "security": "Bảo mật",
        "unlocked": "Mở khóa"
      },
      "searchPlaceholder": "Tìm theo tên vai trò hoặc mô tả...",
      "filters": "Bộ lọc",
      "saveChanges": "Lưu thay đổi",
      "saveChangesCount": "Lưu thay đổi ({count})",
      "saved": "Đã lưu",
      "matrix": {
        "title": "Ma trận Truy cập",
        "subtitle": "Bản đồ quyền hạn cho các vai trò bằng cách chuyển đổi ô lưới",
        "header": "Vai trò \\ Quyền hạn"
      },
      "alerts": {
        "loadFailed": "Hệ thống gặp sự cố khi tải dữ liệu",
        "createPermissionSuccess": "Tạo quyền hạn thành công!",
        "updatePermissionSuccess": "Cập nhật quyền hạn thành công!",
        "deletePermissionSuccess": "Xóa quyền hạn thành công!",
        "createRoleSuccess": "Tạo vai trò thành công!",
        "updateRoleSuccess": "Cập nhật vai trò thành công!",
        "deleteRoleSuccess": "Xóa vai trò thành công!",
        "confirmDeleteRole": "Bạn có chắc chắn muốn xóa Vai trò này không?",
        "noChanges": "Không có thay đổi nào để lưu.",
        "updateMatrixSuccess": "Cập nhật ma trận truy cập thành công!",
        "updateMatrixFailed": "Lưu thay đổi ma trận thất bại."
      }
    },
    "shiftManagement": {
      "title": "Quản Lý Ca",
      "subtitle": "Quản lý và theo dõi thời gian làm việc của đội ngũ",
      "tabs": {
        "day": "Ngày",
        "week": "Tuần",
        "month": "Tháng"
      },
      "addShift": "Phân ca mới",
      "stats": {
        "total": "Tổng ca trực",
        "checkedIn": "Đang làm việc",
        "assigned": "Đã phân công",
        "absent": "Vắng mặt",
        "subtextDay": "Ngày {date}",
        "subtextWeek": "Tuần {range}",
        "subtextMonth": "Tháng {month}"
      },
      "filters": {
        "searchPlaceholder": "Tìm theo tên nhân viên...",
        "allShifts": "Tất cả ca",
        "allStatus": "Tất cả trạng thái",
        "shifts": {
          "morning": "Ca sáng",
          "afternoon": "Ca chiều",
          "evening": "Ca tối"
        }
      },
      "table": {
        "staff": "Nhân viên",
        "type": "Loại ca",
        "date": "Ngày trực",
        "time": "Thời gian",
        "status": "Trạng thái",
        "actions": "Thao tác",
        "loading": "Đang tải dữ liệu...",
        "noData": "Không tìm thấy ca trực nào.",
        "late": "· trễ {mins}p"
      },
      "status": {
        "ASSIGNED": "Đã phân công",
        "CHECKED_IN": "Đang làm việc",
        "CHECKED_OUT": "Đã kết thúc",
        "ABSENT": "Vắng mặt",
        "INCOMPLETE": "Quên check-out"
      },
      "duration": {
        "hour": "giờ",
        "hm": "{h}h{m}m"
      },
      "guide": {
        "title": "📋 Hướng dẫn quản lý ca làm việc",
        "canChange": "Có thể thay đổi trạng thái:",
        "cannotChange": "Không thể thay đổi:",
        "items": {
          "assigned": "Đã phân công → Chuyển sang làm việc / vắng mặt",
          "checkedIn": "Đang làm việc → Check-out hoặc đánh dấu vắng",
          "absent": "Vắng mặt → Có thể điều chỉnh nếu nhầm lẫn",
          "checkedOut": "Đã kết thúc → Ca đã hoàn thành",
          "incomplete": "Quên check-out → Tự động lúc 0h mỗi ngày"
        },
        "footer": "⏰ Hệ thống tự động chạy lúc 00:00 hàng ngày để chuyển các ca đang làm việc thành \"Quên check-out\"",
        "maxShifts": "Mỗi nhân viên tối đa 6 ca/tuần"
      },
      "alerts": {
        "confirmDelete": "Xóa ca \"{shift}\" của {staff}?",
        "updateStatusSuccess": "Đã cập nhật trạng thái",
        "updateStatusFailed": "Cập nhật thất bại"
      }
    },
    "userManagement": {
      "title": "Quản lý người dùng",
      "subtitle": "Quản lý quyền truy cập hệ thống và phân quyền nhân viên",
      "addUser": "Thêm người dùng",
      "stats": {
        "total": "Tổng người dùng",
        "active": "Đang hoạt động",
        "admins": "Quản trị viên",
        "staff": "Quản lý & Nhân viên"
      },
      "searchPlaceholder": "Tìm theo tên, email, sđt hoặc username...",
      "filters": {
        "allRoles": "TẤT CẢ",
        "allStatus": "Tất cả trạng thái",
        "reset": "Đặt lại"
      },
      "table": {
        "details": "Chi tiết",
        "role": "Vai trò",
        "contact": "Liên hệ",
        "status": "Trạng thái",
        "date": "Ngày tham gia",
        "empty": "Không tìm thấy người dùng nào phù hợp với bộ lọc."
      },
      "actions": {
        "view": "Xem chi tiết",
        "assignRole": "Gán vai trò",
        "suspend": "Tạm khóa",
        "unlock": "Mở khóa",
        "delete": "Xóa"
      },
      "status": {
        "ACTIVE": "Hoạt động",
        "SUSPENDED": "Tạm khóa",
        "DELETED": "Đã xóa",
        "INACTIVE": "Không hoạt động"
      },
      "modals": {
        "delete": {
          "title": "Xác nhận xóa",
          "message": "Bạn có chắc chắn muốn xóa vĩnh viễn người dùng {name}? Thao tác này không thể hoàn tác.",
          "cancel": "Hủy",
          "confirm": "Xóa"
        },
        "assign": {
          "title": "Gán vai trò",
          "message": "Chọn vai trò mới cho {name}.",
          "save": "Lưu"
        }
      },
      "alerts": {
        "deleteSuccess": "Xóa người dùng thành công",
        "deleteFailed": "Xóa người dùng thất bại",
        "assignSuccess": "Gán vai trò thành công",
        "assignFailed": "Gán vai trò thất bại"
      }
    },
    "storeRequestManagement": {
      "title": "Yêu cầu từ Đại lý",
      "subtitle": "Xem xét và quản lý yêu cầu nhập hàng từ quản lý đại lý",
      "viewMyRequests": "Yêu cầu Nhập hàng của tôi",
      "viewMyRequestsSubtitle": "Theo dõi các yêu cầu nhập hàng bạn đã gửi",
      "refresh": "Làm mới",
      "stats": {
        "total": "Tổng Yêu cầu",
        "pending": "Chờ Duyệt",
        "approved": "Đã Duyệt",
        "rejected": "Từ Chối"
      },
      "searchPlaceholder": "Tìm theo mã yêu cầu hoặc mã khách hàng...",
      "allStatus": "Tất cả trạng thái",
      "statusPending": "Chờ duyệt",
      "statusApproved": "Đã duyệt",
      "statusRejected": "Từ chối",
      "table": {
        "requestCode": "Mã Yêu cầu",
        "customer": "Khách hàng",
        "franchise": "Đại lý",
        "date": "Ngày gửi",
        "status": "Trạng thái",
        "actions": "Hành động",
        "view": "Xem",
        "approve": "Duyệt",
        "reject": "Từ chối",
        "noData": "Không tìm thấy yêu cầu nào."
      },
      "detail": {
        "title": "Chi tiết Yêu cầu",
        "customerId": "Mã Khách hàng",
        "franchiseId": "Mã Đại lý",
        "requestDate": "Ngày gửi",
        "status": "Trạng thái",
        "notes": "Ghi chú",
        "requestedItems": "Phân bón yêu cầu",
        "totalAmount": "Tổng số tiền",
        "adminNotes": "Ghi chú Quản trị",
        "reviewedAt": "Được duyệt lúc",
        "reviewedBy": "Duyệt bởi",
        "rejectedBy": "Từ chối bởi",
        "close": "Đóng"
      },
      "review": {
        "approveTitle": "Duyệt Yêu cầu",
        "rejectTitle": "Từ chối Yêu cầu",
        "rejectWarning": "Từ chối yêu cầu này sẽ thông báo cho quản lý đại lý. Vui lòng cung cấp lý do.",
        "notesLabel": "Ghi chú Quản trị",
        "notesRequired": "(bắt buộc)",
        "notesOptional": "(không bắt buộc)",
        "approvePlaceholder": "Đã duyệt. Kho sẽ được cập nhật theo yêu cầu.",
        "rejectPlaceholder": "Lý do từ chối...",
        "cancel": "Hủy",
        "confirmApprove": "Xác nhận Duyệt",
        "confirmReject": "Xác nhận Từ chối",
        "processing": "Đang xử lý..."
      },
      "sendRequest": {
        "title": "Gửi Yêu cầu Nhập hàng",
        "subtitle": "Tạo yêu cầu nhập hàng cho đại lý",
        "createTitle": "Thêm phân bón mới",
        "editTitle": "Sửa phân bón yêu cầu",
        "productDetailLabel": "Chi tiết phân bón nhập kho",
        "productName": "Tên phân bón",
        "productNamePlaceholder": "VD: Arabica Phân bón Beans...",
        "imageUrlLabel": "Đường dẫn hình ảnh",
        "productId": "Mã ID phân bón",
        "productIdPlaceholder": "UUID phân bón",
        "productCode": "Mã phân bón / SKU",
        "skuPlaceholder": "VD: SP001",
        "category": "Danh mục",
        "categoryPlaceholder": "VD: CLOTHING",
        "productType": "Loại phân bón",
        "productTypePlaceholder": "VD: MEN",
        "size": "Kích cỡ",
        "sizePlaceholder": "VD: L, XL",
        "color": "Màu sắc",
        "colorPlaceholder": "VD: Đen",
        "unit": "Đơn vị",
        "unitPlaceholder": "VD: Cái, Bộ",
        "qty": "Số lượng",
        "price": "Giá nhập",
        "pricePlaceholder": "0",
        "totalAmount": "Thành tiền",
        "cancel": "Hủy",
        "saveChanges": "Lưu thay đổi",
        "addItemToList": "Thêm vào danh sách",
        "branch": "Đại lý / Đại lý",
        "selectBranch": "Chọn đại lý...",
        "items": "Phân bón yêu cầu",
        "addItem": "Thêm phân bón",
        "noItemsAdded": "Chưa có phân bón",
        "notes": "Ghi chú nhập hàng",
        "notesPlaceholder": "Ghi chú thêm cho quản trị (lý do, mức độ khẩn cấp, v.v.)...",
        "send": "Gửi Yêu cầu",
        "sending": "Đang gửi...",
        "successTitle": "Đã gửi Yêu cầu!",
        "successMessage": "Yêu cầu nhập hàng của bạn đã được gửi cho quản trị duyệt.",
        "totalValueLabel": "TỔNG GIÁ TRỊ YÊU CẦU",
        "itemsCountSuffix": "phân bón",
        "dateCreatedLabel": "NGÀY TẠO",
        "sizeLabel": "Cỡ",
        "colorLabel": "Màu",
        "defaultSku": "MÃ-XXX",
        "unitSuffix": "đơn vị",
        "errorNoItems": "Vui lòng thêm ít nhất một phân bón với tên và số lượng.",
        "errorNoBranch": "Vui lòng chọn đại lý / đại lý.",
        "errorFailed": "Gửi yêu cầu thất bại. Vui lòng thử lại."
      }
    }
  },
  "staff": {
    "dashboard": {
      "welcome": "Chào buổi sáng,",
      "shiftStarts": "Ca làm việc bắt đầu {time}",
      "ordersToday": "Đơn vật tư hôm nay",
      "newOrder": "Đơn vật tư mới",
      "stats": {
        "pending": "Chờ duyệt",
        "preparing": "Đang làm",
        "ready": "Sẵn sàng"
      },
      "kanban": {
        "pending": "🔔 Chờ duyệt",
        "preparing": "⚡ Đang làm",
        "ready": "✅ Sẵn sàng",
        "noOrders": "Không có đơn vật tư",
        "accept": "Chấp nhận & Bắt đầu",
        "markReady": "Đánh dấu sẵn sàng",
        "complete": "Hoàn tất"
      },
      "performance": {
        "title": "Hiệu suất của tôi hôm nay",
        "completed": "Đơn vật tư hoàn tất",
        "avgPrepTime": "TG chuẩn bị TB",
        "queue": "Độ dài hàng chờ",
        "rating": "Đánh giá"
      }
    },
    "orderManagement": {
      "title": "Quản lý Đơn vật tư",
      "subtitle": "Xem và quản lý tất cả đơn vật tư",
      "refresh": "Làm mới",
      "stats": {
        "total": "Tổng đơn vật tư",
        "pending": "Chờ xử lý",
        "preparing": "Đang chuẩn bị",
        "ready": "Sẵn sàng",
        "completed": "Hoàn tất",
        "revenue": "Doanh số"
      },
      "searchPlaceholder": "Tìm theo Mã đơn vật tư hoặc Tên khách hàng...",
      "filters": {
        "all": "Tất cả",
        "pending": "Chờ xử lý",
        "preparing": "Đang chuẩn bị",
        "ready": "Sẵn sàng",
        "completed": "Hoàn tất"
      },
      "empty": {
        "title": "Không tìm thấy đơn vật tư",
        "subtitle": "Đơn vật tư sẽ xuất hiện ở đây sau khi thanh toán"
      },
      "table": {
        "orderId": "Mã Đơn",
        "customer": "Khách hàng",
        "items": "Phân bón",
        "total": "Tổng tiền",
        "status": "Trạng thái",
        "staff": "Nhân viên",
        "time": "Thời gian",
        "actions": "Thao tác",
        "assignStaff": "Gán nhân viên",
        "notAssigned": "Chưa có nhân viên xác nhận",
        "view": "Xem"
      },
      "modal": {
        "title": "Chi tiết Đơn vật tư",
        "items": "Phân bón trong đơn",
        "total": "Tổng tiền",
        "updateStatus": "Cập nhật trạng thái",
        "close": "Đóng",
        "deleteOrder": "Xóa Đơn vật tư",
        "generalInfo": "Thông tin chung",
        "deliveryInfo": "Thông tin giao hàng",
        "address": "Địa chỉ nhận hàng",
        "quantity": "Số lượng",
        "subtotal": "Tạm tính",
        "shipping": "Phí vận chuyển",
        "orderType": "Loại đơn vật tư",
        "paymentId": "Mã giao dịch",
        "notUpdated": "Chưa cập nhật",
        "branch": "Đại lý"
      }
    },
    "myShift": {
      "title": "Lịch làm việc",
      "loading": "Đang tải...",
      "quickInfo": {
        "currentShift": "Ca hiện tại",
        "status": "Trạng thái",
        "nextShift": "Ca tiếp theo",
        "noShift": "Không có ca",
        "outOfShift": "Ngoài ca",
        "viewingDate": "Đang xem lịch ngày: {date}"
      },
      "stats": {
        "totalShifts": "Tổng số ca",
        "completed": "Đã hoàn thành",
        "totalHours": "Tổng giờ làm",
        "absent": "Vắng mặt",
        "last30Days": "30 ngày qua",
        "completedRate": "{rate}% hoàn thành",
        "avgHours": "TB {hours}/ngày",
        "lateCount": "{count} lần đi trễ"
      },
      "controls": {
        "today": "Hôm nay",
        "monthView": "Lịch tháng",
        "listView": "Danh sách",
        "monthYear": "Tháng {month}, {year}"
      },
      "calendar": {
        "days": [
          "CN",
          "T2",
          "T3",
          "T4",
          "T5",
          "T6",
          "T7"
        ],
        "todayBadge": "Hôm nay"
      },
      "listView": {
        "title": "Danh sách tất cả ca làm việc",
        "empty": "Chưa có ca làm việc nào",
        "emptySub": "Bạn sẽ được phân công ca sớm thôi!",
        "monthYear": "Tháng {month}, {year}"
      },
      "detail": {
        "titleToday": "Ca trực hôm nay",
        "titleDate": "Ca trực ngày {day}",
        "shiftCount": "{count} ca trực",
        "emptyToday": "Hôm nay bạn được nghỉ",
        "emptyDate": "Ngày này không có ca",
        "emptySubToday": "Không có ca trực nào được phân công",
        "emptySubDate": "Không có lịch làm việc trong ngày này"
      },
      "status": {
        "ASSIGNED": "Chờ check-in",
        "CHECKED_IN": "Đang làm việc",
        "CHECKED_OUT": "Đã kết thúc",
        "ABSENT": "Vắng mặt",
        "INCOMPLETE": "Quên check-out"
      },
      "shifts": {
        "morning": "Ca sáng",
        "afternoon": "Ca chiều",
        "evening": "Ca tối"
      },
      "tips": {
        "title": "📋 Mẹo nhỏ",
        "checkIn": "đúng giờ để tránh bị tính đi trễ",
        "checkOut": "khi kết thúc ca",
        "viewSchedule": "Xem lịch để chuẩn bị cho các ca tiếp theo"
      }
    },
    "checkout": {
      "title": "Thanh toán",
      "back": "Quay lại",
      "orderItems": "Phân bón",
      "itemsCount": "{count} phân bón",
      "qty": "SL: {qty}",
      "summary": {
        "title": "Tóm tắt Đơn vật tư",
        "subtotal": "Tạm tính",
        "tax": "Thuế (10%)",
        "discount": "Ưu đãi ({discount}%)",
        "totalDue": "Tổng cộng"
      },
      "customer": {
        "title": "Thông tin Khách hàng",
        "phoneLabel": "Số điện thoại (Tùy chọn)",
        "placeholder": "Nhập số điện thoại...",
        "digitsNeed": "Cần thêm {count} số",
        "autoSearch": "Hệ thống sẽ tự động tìm kiếm khi bạn nhập",
        "notFound": "Không tìm thấy khách hàng",
        "suggestCreate": "Bạn có muốn tạo hồ sơ khách hàng mới không?",
        "createBtn": "Tạo hồ sơ mới"
      },
      "promo": {
        "title": "Mã ưu đãi",
        "selectLabel": "Chọn mức ưu đãi (Tùy chọn)",
        "placeholder": "Chọn mã ưu đãi...",
        "applied": "Đã áp dụng ưu đãi {discount}%"
      },
      "payment": {
        "title": "Thanh toán",
        "complete": "Đặt hàng",
        "processing": "Đang xử lý..."
      },
      "cancel": "Hủy và Quay lại"
    },
    "createCustomer": {
      "title": "Đăng ký Khách hàng mới",
      "subtitle": "Tạo hồ sơ khách hàng mới cho chương trình thành viên",
      "back": "Quay lại Đơn vật tư",
      "form": {
        "name": "Họ và tên",
        "namePlaceholder": "Nhập họ và tên khách hàng",
        "phone": "Số điện thoại",
        "phonePlaceholder": "Nhập số điện thoại",
        "phoneNote": "Ít nhất 10 số",
        "email": "Email (Tùy chọn)",
        "emailPlaceholder": "customer@example.com",
        "note": "💡 Lưu ý: Khách hàng mới sẽ tự động được tham gia chương trình thành viên với hạng Đồng."
      },
      "actions": {
        "cancel": "Hủy",
        "creating": "Đang tạo...",
        "submit": "Tạo khách hàng"
      },
      "alerts": {
        "fillAll": "Vui lòng điền đầy đủ các thông tin bắt buộc",
        "phoneLength": "Số điện thoại phải có ít nhất 10 chữ số",
        "success": "Tạo khách hàng thành công! 🎉",
        "error": "Lỗi khi tạo khách hàng. Vui lòng thử lại."
      }
    },
    "createOrder": {
      "tabs": {
        "orderPrefix": "Đơn #",
        "newOrder": "Đơn vật tư mới"
      },
      "search": "Tìm kiếm phân bón...",
      "categories": {
        "all": "Tất cả"
      },
      "empty": {
        "noProducts": "Không tìm thấy phân bón",
        "noItems": "Chưa có mặt hàng nào trong đơn vật tư",
        "addItem": "Chọn phân bón để thêm vào đơn"
      },
      "cart": {
        "title": "Đơn vật tư hiện tại",
        "itemsCount": "{count} mặt hàng",
        "summary": {
          "subtotal": "Tạm tính",
          "tax": "Thuế (10%)",
          "total": "Tổng cộng"
        },
        "actions": {
          "next": "Tiếp tục"
        }
      },
      "alerts": {
        "loadFailed": "Không thể tải dữ liệu",
        "orderCreated": "Đã tạo đơn vật tư mới",
        "closeLast": "Không thể đóng đơn vật tư duy nhất",
        "closeConfirm": "Đơn vật tư này đang có mặt hàng. Bạn có chắc muốn đóng không?",
        "closeCancel": "Hủy",
        "closeConfirmBtn": "Đóng đơn vật tư",
        "orderClosed": "Đã đóng đơn vật tư",
        "added": "Đã thêm {name} vào đơn vật tư",
        "removed": "Đã xóa mặt hàng ăn",
        "addFirst": "Vui lòng thêm phân bón vào đơn vật tư trước"
      }
    },
    "options": {
      "ice": {
        "Regular Ice": "Đá bình thường",
        "Less Ice": "Ít đá",
        "No Ice": "Không đá",
        "Extra Ice": "Nhiều đá"
      },
      "size": {
        "S": "Nhỏ",
        "M": "Vừa",
        "L": "Lớn"
      }
    },
    "customerManagement": {
      "title": "Cơ sở dữ liệu Khách hàng",
      "subtitle": "Quản lý hồ sơ thành viên và trạng thái chương trình lòng trung thành.",
      "totalCustomers": "{count} Tổng số khách hàng",
      "search": {
        "keywords": "Từ khóa tìm kiếm",
        "placeholder": "Nhập tên, email hoặc số điện thoại...",
        "status": "Trạng thái tài khoản",
        "allStatus": "Tất cả trạng thái",
        "submit": "Tìm kiếm"
      },
      "table": {
        "customerInfo": "Thông tin Khách hàng",
        "contact": "Liên hệ",
        "status": "Trạng thái",
        "actions": "Hành động",
        "empty": "Không có khách hàng nào khớp với tiêu chí tìm kiếm của bạn.",
        "details": "Chi tiết Hồ sơ"
      },
      "pagination": {
        "showing": "Hiển thị <span class='text-gray-900'>{count}</span> trên {total} thành viên"
      },
      "modal": {
        "title": "Hồ sơ Thành viên",
        "subtitle": "Thông tin tài khoản và lòng trung thành chi tiết",
        "loading": "Đang đồng bộ dữ liệu...",
        "personalInfo": "Thông tin Cá nhân",
        "labels": {
          "name": "Họ và tên",
          "phone": "Số điện thoại",
          "email": "Địa chỉ Email",
          "status": "Trạng thái tài khoản"
        },
        "loyalty": "Trạng thái Chương trình Lòng trung thành",
        "loyaltyLabels": {
          "membership": "Hạng thành viên",
          "member": "THÀNH VIÊN {tier}",
          "totalPoints": "Tổng số điểm tích lũy",
          "availablePoints": "Điểm có sẵn"
        },
        "emptyLoyalty": "Không tìm thấy tư cách thành viên lòng trung thành đang hoạt động cho khách hàng này.",
        "close": "Đóng Hồ sơ"
      }
    },
    "onlineOrder": {
      "title": "Đơn vật tư Trực tuyến",
      "subtitle": "Quản lý các đơn vật tư trực tuyến đến và phân công cho nhân viên",
      "stats": {
        "created": "Đã tạo",
        "assigned": "Đã phân công",
        "shipping": "Đang giao",
        "delivered": "Đã giao",
        "failed": "Thất bại"
      },
      "search": "Tìm kiếm theo mã đơn hoặc khách hàng...",
      "statusOptions": {
        "all": "Tất cả đơn",
        "created": "Đã tạo",
        "assigned": "Đã phân công",
        "shipping": "Đang giao",
        "delivered": "Đã giao",
        "failed": "Thất bại"
      },
      "table": {
        "orderId": "Mã Đơn vật tư",
        "customer": "Khách hàng",
        "items": "Phân bón",
        "total": "Tổng cộng",
        "status": "Trạng thái",
        "staff": "Nhân viên",
        "actions": "Hành động",
        "empty": "Không tìm thấy đơn vật tư",
        "emptySub": "Thử điều chỉnh bộ lọc của bạn",
        "more": "+{count} mặt hàng nữa",
        "notAssigned": "Chưa phân công",
        "nextStep": "Bước tiếp theo",
        "failedBtn": "Thất bại"
      }
    }
  },
  "manager": {
    "categoryManager": {
      "title": "Quản lý Danh mục",
      "subtitle": "Quản lý các danh mục phân bón",
      "addCategory": "Thêm Danh mục",
      "stats": {
        "total": "Tổng số danh mục",
        "active": "Đang hoạt động",
        "totalItems": "Tổng số mặt hàng",
        "inactive": "Ngừng hoạt động"
      },
      "search": {
        "placeholder": "Tìm kiếm danh mục...",
        "allStatus": "Tất cả trạng thái",
        "active": "Đang hoạt động",
        "inactive": "Ngừng hoạt động"
      },
      "table": {
        "category": "Danh mục",
        "slug": "Slug",
        "items": "Số mặt hàng",
        "status": "Trạng thái",
        "actions": "Hành động",
        "deleteConfirm": "Xóa danh mục này?"
      }
    },
    "customerManager": {
      "title": "Đại lý - Khách hàng",
      "subtitle": "Theo dõi thói quen mua sắm và chăm sóc khách hàng thân thiết",
      "addCustomer": "Thêm Khách hàng",
      "stats": {
        "total": "Khách tại quầy",
        "totalSub": "Dữ liệu tại đại lý",
        "vip": "Khách hàng VIP",
        "vipSub": "Hạng Gold & Platinum",
        "points": "Điểm tích lũy",
        "pointsSub": "Tổng điểm khả dụng",
        "avgValue": "Giá trị TB",
        "avgSub": "Trên mỗi hóa đơn"
      },
      "search": {
        "placeholder": "Tìm theo tên khách hàng hoặc số điện thoại...",
        "allStatus": "Tất cả thứ hạng"
      },
      "table": {
        "customer": "Khách hàng",
        "tier": "Hạng",
        "pointsSpent": "Điểm & Chi tiêu",
        "status": "Trạng thái",
        "empty": "Không tìm thấy khách hàng nào.",
        "spent": "đã tiêu",
        "unknown": "Không xác định",
        "deleteConfirm": "Bạn có chắc chắn muốn xóa khách hàng này?",
        "deleteFail": "Xóa thất bại!"
      },
      "modal": {
        "view": {
          "title": "Hồ sơ Khách hàng",
          "points": "Điểm hiện tại",
          "spent": "Tổng chi tiêu",
          "notUpdated": "Chưa cập nhật",
          "close": "Đóng hồ sơ"
        },
        "crud": {
          "editTitle": "Cập nhật thông tin",
          "createTitle": "Đăng ký khách hàng mới",
          "name": "Họ và tên",
          "phone": "Số điện thoại",
          "tier": "Hạng thành viên",
          "email": "Email",
          "cancel": "Hủy",
          "processing": "Đang xử lý...",
          "confirm": "Xác nhận",
          "required": "Họ tên và Số điện thoại là bắt buộc!",
          "saveFail": "Có lỗi xảy ra khi lưu!"
        }
      }
    },
    "inventoryManager": {
      "title": "Đại lý - Kho hàng",
      "subtitle": "Quản lý nguyên vật liệu và phụ liệu tại đại lý",
      "actions": {
        "history": "Lịch sử kho",
        "viewRequests": "Xem yêu cầu đã gửi",
        "restock": "Nhập hàng"
      },
      "stats": {
        "total": "Tổng mặt hàng",
        "totalSub": "SKUs đang quản lý",
        "lowStock": "Sắp hết hàng",
        "lowStockSub": "Dưới định mức tối thiểu",
        "outOfStock": "Đã hết hàng",
        "outOfStockSub": "Cần đặt hàng gấp",
        "status": "Tình trạng kho",
        "statusSub": "Đang hoạt động tốt"
      },
      "search": {
        "placeholder": "Tìm theo tên nguyên liệu...",
        "allStatus": "Tất cả trạng thái",
        "inStock": "Còn hàng",
        "lowStock": "Sắp hết",
        "outOfStock": "Đã hết"
      },
      "table": {
        "material": "Nguyên liệu",
        "branch": "Đại lý",
        "quantity": "Số lượng hiện tại",
        "minStock": "Định mức tối thiểu",
        "status": "Trạng thái",
        "adjustDist": "Điều chỉnh phân phối",
        "updateLow": "Cập nhật Lượng tối thiểu",
        "deleteConfirm": "Xóa mặt hàng này?"
      },
      "modal": {
        "view": {
          "title": "Chi tiết Phân bón",
          "stock": "Tồn kho hiện tại",
          "lastRestock": "Lần nhập cuối",
          "details": "Thông tin chi tiết",
          "category": "Phân loại",
          "safeLevel": "Định mức an toàn",
          "status": "Trạng thái",
          "close": "Đóng cửa sổ"
        },
        "crud": {
          "adjustTitle": "Điều chỉnh tồn kho",
          "restockTitle": "Nhập hàng mới",
          "name": "Tên nguyên liệu / Vật dụng",
          "sku": "Mã SKU",
          "unit": "Đơn vị tính",
          "quantity": "Số lượng {action}",
          "adjust": "điều chỉnh",
          "restock": "nhập",
          "minStock": "Định mức tối thiểu",
          "note": "Ghi chú nhập kho",
          "cancel": "Hủy",
          "confirm": "Xác nhận cập nhật"
        },
        "reorder": {
          "title": "Cập nhật Định mức Tối thiểu",
          "cancel": "Hủy",
          "update": "Cập nhật"
        }
      },
      "alerts": {
        "minReorder": "Định mức tối thiểu phải lớn hơn 0",
        "updateSuccess": "Cập nhật định mức thành công",
        "updateFail": "Cập nhật thất bại"
      }
    },
    "loyaltyReport": {
      "title": "Phân tích Khách hàng Thân thiết",
      "subtitle": "Báo cáo toàn diện về điểm ưu đãi, giao dịch và hạng thành viên.",
      "refresh": "Làm mới dữ liệu",
      "error": {
        "fetch": "Tải dữ liệu báo cáo thất bại.",
        "connect": "Không thể kết nối đến Dịch vụ Loyalty."
      },
      "stats": {
        "earned": "Tổng điểm đã tích",
        "earnedSub": "Tích lũy trọn đời",
        "redeemed": "Tổng điểm đã đổi",
        "redeemedSub": "Đã tiêu cho phần ưu đãi",
        "earnTxn": "Giao dịch Tích điểm",
        "earnTxnSub": "Tổng số lần phát sinh",
        "redeemTxn": "Giao dịch Đổi điểm",
        "redeemTxnSub": "Tổng số lần phát sinh"
      },
      "tierDist": {
        "title": "Phân phối Hạng Khách hàng",
        "subtitle": "Thống kê số lượng thành viên theo từng hạng",
        "empty": "Không có dữ liệu xếp hạng",
        "level": "Cấp độ",
        "members": "Thành viên"
      }
    },
    "managerDashboard": {
      "stats": {
        "revenue": "Doanh số hôm nay",
        "vsYesterday": "+8.2% so với hôm qua",
        "orders": "Đơn vật tư hôm nay",
        "completed": "Đã hoàn thành",
        "pending": "Đơn vật tư Chờ xử lý",
        "needsAttention": "Cần chú ý",
        "staff": "Nhân viên đang làm",
        "activeNow": "Đang hoạt động"
      },
      "liveQueue": {
        "title": "Hàng đợi Đơn vật tư Trực tiếp",
        "actions": {
          "start": "Bắt đầu",
          "ready": "Sẵn sàng",
          "complete": "Hoàn thành"
        }
      },
      "staffOverview": {
        "title": "Nhân viên Đang làm việc",
        "orders": "đơn vật tư",
        "since": "Từ",
        "status": {
          "active": "Hoạt động",
          "break": "Nghỉ ngơi"
        },
        "hourly": "Đơn vật tư theo Giờ hôm nay"
      },
      "inventoryAlerts": {
        "title": "Cảnh báo Tồn kho",
        "remaining": "còn lại",
        "orderAction": "Đặt hàng"
      }
    },
    "managerOrder": {
      "title": "Đại lý Quận 1 - Đơn vật tư",
      "subtitle": "Theo dõi và quản lý trạng thái các đơn vật tư tại đại lý",
      "refresh": "Làm mới",
      "stats": {
        "total": "Tổng đơn vật tư",
        "completed": "Đã hoàn thành",
        "pending": "Đang chờ xử lý",
        "cancelled": "Đã hủy"
      },
      "search": {
        "placeholder": "Tìm theo mã Đơn vật tư (Order ID)..."
      },
      "status": {
        "all": "Tất cả đơn vật tư",
        "created": "Đã tạo",
        "waiting_payment": "Chờ xác nhận",
        "paid": "Thanh toán thành công",
        "preparing": "Đang chuẩn bị xuất kho",
        "ready": "Đang giao",
        "completed": "Đơn hoàn tất",
        "cancelled": "Hủy",
        "failed_order": "Đơn thất bại",
        "failed_payment": "Thanh toán thất bại",
        "refunded": "Hoàn trả"
      },
      "table": {
        "id": "Mã đơn vật tư",
        "time": "Thời gian",
        "customer": "Khách hàng",
        "type": "Hình thức",
        "total": "Tổng tiền",
        "status": "Trạng thái",
        "empty": "Không có đơn vật tư nào",
        "loading": "Đang tải dữ liệu...",
        "guest": "Vãng lai (Guest)",
        "defaultType": "Mặc định"
      },
      "pagination": {
        "page": "Trang",
        "prev": "Trước",
        "next": "Kế tiếp"
      }
    },
    "productManager": {
      "title": "Đại lý Quận 1 - Phân bón",
      "subtitle": "Quản lý danh mục vật tư và lượng tồn kho tại đại lý",
      "addProduct": "Thêm Phân bón",
      "stats": {
        "total": "Tổng phân bón",
        "totalSub": "Trong danh mục vật tư đại lý",
        "active": "Đang kinh doanh",
        "activeSub": "Sẵn sàng phục vụ",
        "lowStock": "Sắp hết hàng",
        "lowStockSub": "Cần nhập hàng ngay",
        "outOfStock": "Hết hàng",
        "outOfStockSub": "Tạm ngưng phục vụ"
      },
      "search": {
        "placeholder": "Tìm theo tên phân bón hoặc mã SKU..."
      },
      "categories": {
        "all": "Tất cả danh mục",
        "coffee": "Phân bón NPK",
        "tea": "Phân bón hữu cơ",
        "bakery": "Phân bón lá",
        "merchandise": "Vật tư canh tác"
      },
      "status": {
        "all": "Tất cả trạng thái",
        "active": "Đang bán",
        "out_of_stock": "Hết hàng"
      },
      "table": {
        "product": "Thông tin phân bón",
        "category": "Danh mục",
        "price": "Giá bán",
        "stock": "Tồn kho",
        "status": "Trạng thái",
        "unit": "mặt hàng"
      },
      "modalView": {
        "title": "Chi tiết Phân bón",
        "price": "Giá bán",
        "stock": "Hiện có",
        "calories": "Dinh dưỡng",
        "description": "Mô tả phân bón",
        "updateStock": "Cập nhật kho hàng",
        "close": "Đóng"
      },
      "modalCrud": {
        "updateTitle": "Cập nhật Phân bón",
        "addTitle": "Thêm Phân bón mới",
        "name": "Tên phân bón",
        "sku": "Mã SKU",
        "category": "Danh mục",
        "price": "Giá bán ($)",
        "stock": "Số lượng nhập",
        "description": "Mô tả tóm tắt",
        "placeholders": {
          "name": "vd: Arabica Cold Brew",
          "sku": "COF-ACB-01",
          "description": "Thông tin về thành phần, hương vị..."
        },
        "cancel": "Hủy",
        "save": "Lưu thông tin"
      }
    },
    "promotionManager": {
      "title": "Quản lý Ưu đãi",
      "subtitle": "Quản lý các chương trình ưu đãi và chiến dịch marketing",
      "addPromotion": "Ưu đãi mới",
      "stats": {
        "total": "Tổng ưu đãi",
        "totalSub": "Tất cả chiến dịch",
        "active": "Đang hoạt động",
        "activeSub": "Đang chạy",
        "inactive": "Ngưng hoạt động",
        "inactiveSub": "Đã tắt"
      },
      "search": {
        "placeholder": "Tìm kiếm ưu đãi..."
      },
      "status": {
        "all": "Tất cả trạng thái",
        "active": "Đang hoạt động",
        "inactive": "Ngưng hoạt động",
        "expired": "Hết hạn"
      },
      "rank": {
        "all": "Tất cả hạng",
        "bronze": "Đồng",
        "silver": "Bạc",
        "gold": "Vàng",
        "platinum": "Bạch kim",
        "diamond": "Kim cương"
      },
      "table": {
        "name": "Tên ưu đãi",
        "discount": "Ưu đãi",
        "rank": "Hạng",
        "status": "Trạng thái",
        "lastUpdated": "Cập nhật cuối",
        "generateCodes": "Tạo mã",
        "empty": "Không tìm thấy ưu đãi nào"
      },
      "alerts": {
        "deleteConfirm": "Bạn có chắc chắn muốn xóa ưu đãi này?",
        "deleteFailed": "Xóa thất bại"
      }
    },
    "staffManager": {
      "title": "Đại lý - Nhân sự",
      "subtitle": "Quản lý đội ngũ nhân viên và ca làm việc tại đại lý",
      "addStaff": "Thêm Nhân viên",
      "stats": {
        "total": "Tổng nhân sự",
        "totalSub": "Nhân viên chính thức",
        "onDuty": "Đang làm việc",
        "onDutySub": "Có mặt tại đại lý",
        "onLeave": "Nghỉ phép",
        "onLeaveSub": "Vắng mặt có lý do",
        "performance": "Hiệu suất TB",
        "performanceSub": "Dựa trên đánh giá tháng"
      },
      "search": {
        "placeholder": "Tìm nhân viên theo tên hoặc mã số...",
        "allRoles": "Tất cả vị trí"
      },
      "table": {
        "staff": "Nhân viên",
        "role": "Vị trí",
        "shift": "Ca trực",
        "contact": "Liên hệ",
        "status": "Trạng thái"
      },
      "status": {
        "onDuty": "Đang trực",
        "leave": "Nghỉ phép",
        "offDuty": "Hết ca"
      },
      "modal": {
        "view": {
          "contactInfo": "Thông tin liên hệ",
          "joinedDate": "Ngày vào làm:",
          "performance": "Hiệu suất tháng này",
          "schedulePerms": "Lịch trực & Phân quyền",
          "currentShift": "Ca làm việc hiện tại",
          "access": "Quyền truy cập",
          "assignShift": "Giao ca mới",
          "close": "Đóng"
        },
        "crud": {
          "addTitle": "Đăng ký Nhân viên mới",
          "editTitle": "Cập nhật Nhân viên",
          "name": "Họ và tên",
          "phone": "Số điện thoại",
          "email": "Email công việc",
          "role": "Vị trí",
          "shift": "Ca làm việc",
          "shifts": {
            "morning": "Sáng (06:00 - 12:00)",
            "afternoon": "Chiều (12:00 - 18:00)",
            "evening": "Tối (18:00 - 23:00)",
            "fulltime": "Full-time"
          },
          "cancel": "Hủy",
          "confirm": "Xác nhận"
        }
      }
    },
    "dashboard": {
      "stats": {
        "revenue": "Tổng doanh số",
        "orders": "Tổng đơn vật tư",
        "branches": "Số đại lý"
      },
      "table": {
        "title": "Bảng Tổng Hợp Doanh Số",
        "branch": "Đại Lý",
        "revenue": "Doanh Số",
        "orders": "Đơn Vật Tư",
        "growth": "Tăng Trưởng"
      },
      "topProducts": {
        "title": "Top 3 Phân bón",
        "sold": "đã bán"
      },
      "customers": {
        "title": "Khách hàng Thân Thiết",
        "orders": "đơn vật tư"
      }
    },
    "shiftSchedule": {
      "title": "Lịch phân ca",
      "subtitle": "Quản lý và theo dõi thời gian làm việc của đội ngũ",
      "tabs": {
        "day": "Ngày",
        "week": "Tuần",
        "month": "Tháng"
      },
      "addShift": "Phân ca mới",
      "stats": {
        "total": "Tổng ca trực",
        "checkedIn": "Đang làm việc",
        "assigned": "Đã phân công",
        "absent": "Vắng mặt",
        "checkedInSub": "Nhân viên có mặt",
        "assignedSub": "Chờ check-in",
        "absentSub": "Cần kiểm tra"
      },
      "filters": {
        "placeholder": "Tìm theo tên nhân viên...",
        "allShifts": "Tất cả ca",
        "allStatus": "Tất cả trạng thái",
        "reset": "Reset",
        "morning": "Ca sáng",
        "afternoon": "Ca chiều",
        "evening": "Ca tối",
        "filteringBy": "📊 Đang lọc theo:"
      },
      "table": {
        "staff": "Nhân viên",
        "type": "Loại ca",
        "date": "Ngày trực",
        "time": "Thời gian",
        "status": "Trạng thái",
        "actions": "Thao tác",
        "loading": "Đang tải dữ liệu...",
        "noData": "Không tìm thấy ca trực nào.",
        "late": "· trễ {mins}p",
        "edit": "Chỉnh sửa",
        "delete": "Xóa"
      },
      "status": {
        "ASSIGNED": "Đã phân công",
        "CHECKED_IN": "Đang làm việc",
        "CHECKED_OUT": "Đã kết thúc",
        "ABSENT": "Vắng mặt",
        "INCOMPLETE": "Quên check-out"
      },
      "guide": {
        "title": "📋 Hướng dẫn quản lý ca làm việc",
        "canChange": "Có thể thay đổi trạng thái:",
        "cannotChange": "Không thể thay đổi:",
        "items": {
          "assigned": "Đã phân công → Chuyển sang làm việc / vắng mặt",
          "checkedIn": "Đang làm việc → Check-out hoặc đánh dấu vắng",
          "absent": "Vắng mặt → Có thể điều chỉnh nếu nhầm lẫn",
          "checkedOut": "Đã kết thúc → Ca đã hoàn thành",
          "incomplete": "Quên check-out → Tự động lúc 0h mỗi ngày"
        },
        "footer": "⏰ Hệ thống tự động chạy lúc 00:00 hàng ngày để chuyển các ca đang làm việc thành \"Quên check-out\"",
        "maxShifts": "Mỗi nhân viên tối đa 6 ca/tuần"
      },
      "modal": {
        "titleAdd": "Phân ca làm việc mới",
        "titleEdit": "Cập nhật Ca trực",
        "fields": {
          "date": "Ngày trực",
          "type": "Loại ca",
          "time": "Thời gian",
          "startTime": "Giờ bắt đầu",
          "endTime": "Giờ kết thúc",
          "branch": "Đại lý",
          "staff": "Nhân viên"
        },
        "placeholders": {
          "loading": "Đang tải...",
          "selectStaff": "— Chọn nhân viên —"
        },
        "warnings": {
          "noStaff": "Không có nhân viên ở đại lý này.",
          "selectStaff": "Vui lòng chọn nhân viên!",
          "selectDate": "Vui lòng chọn ngày trực!"
        },
        "guide": "Luồng tạo 2 bước: Tạo cấu hình ca → Phân công nhân viên. Trạng thái mặc định: Đã phân công.",
        "actions": {
          "cancel": "Hủy",
          "confirm": "Xác nhận",
          "update": "Cập nhật",
          "processing": "Đang xử lý..."
        }
      },
      "confirm": {
        "cancel": "Huỷ",
        "changeStatusTitle": "Xác nhận thay đổi trạng thái",
        "changeStatusMsg": "Chuyển ca này sang \"{status}\"?",
        "changeStatusBtn": "Đổi thành \"{status}\"",
        "deleteTitle": "Xác nhận xoá ca làm việc",
        "deleteMsg": "Bạn có chắc muốn xoá ca \"{shift}\" của {name}?\nHành động này không thể hoàn tác.",
        "deleteBtn": "Xoá ca",
        "successDelete": "Đã xoá ca thành công",
        "failDelete": "Xoá ca thất bại",
        "successStatus": "Đã cập nhật: {status}",
        "failStatus": "Cập nhật thất bại",
        "onlyToday": "Chỉ được đổi trạng thái trong ngày ca làm việc.",
        "notStartedYet": "Ca chưa bắt đầu! Còn {time} nữa mới tới giờ ({start}).",
        "shiftEnded": "Ca đã kết thúc lúc {end}. Không thể chuyển về \"{status}\".",
        "absentCannotReset": "Không thể hoàn tác trạng thái Vắng mặt. Ca này đã được ghi nhận là vắng.",
        "resetAbsent": "Đã hủy vắng mặt, chuyển về Đã phân công"
      }
    }
  },
  "customer": {
    "nav": {
      "menu": "Phân bón",
      "locations": "Đại lý",
      "about": "Về chúng tôi",
      "rewards": "Ưu đãi",
      "searchPlaceholder": "Tìm kiếm phân bón...",
      "cart": "Giỏ hàng",
      "signIn": "Đăng nhập",
      "joinUs": "Tham gia",
      "dashboard": "Bảng điều khiển",
      "logout": "Đăng xuất",
      "myProfile": "Hồ sơ của tôi",
      "signOut": "Đăng xuất"
    },
    "footer": {
      "brandDesc": "AgriFert giúp quản lý đại lý nông nghiệp, phân bón và vật tư canh tác từ danh mục, kho hàng đến đơn vật tư.",
      "reviews": "4.9 · Hơn 2,500 đơn vật tư",
      "company": "Công ty",
      "aboutUs": "Về chúng tôi",
      "franchise": "Hệ thống đại lý",
      "careers": "Hợp tác",
      "press": "Tin nông nghiệp",
      "support": "Hỗ trợ",
      "helpCenter": "Trung tâm trợ giúp",
      "contactUs": "Liên hệ",
      "privacyPolicy": "Chính sách bảo mật",
      "terms": "Điều khoản",
      "rights": "© 2026 AgriFert. Đã đăng ký bản quyền.",
      "staffPortal": "Cổng nhân viên"
    },
    "home": {
      "hero": {
        "newArrival": "Mùa vụ mới",
        "title": "Dinh dưỡng cây trồng<br/>chuẩn mùa vụ",
        "subtitle": "Quản lý danh mục phân bón, vật tư canh tác và đơn hàng cho từng đại lý nông nghiệp trong một trải nghiệm thống nhất.",
        "orderNow": "Đặt phân bón",
        "viewMenu": "Xem danh mục"
      },
      "stats": {
        "locations": "Đại lý toàn quốc",
        "menuItems": "Vật tư canh tác",
        "rating": "Khách hàng hài lòng"
      },
      "orderType": {
        "pickup": "Lấy tại đại lý",
        "delivery": "Giao tới nông trại"
      },
      "featured": {
        "subtitle": "Vật tư mới",
        "title": "Phân bón nổi bật",
        "viewAll": "Xem tất cả"
      },
      "whyUs": {
        "subtitle": "Tại sao chọn AgriFert",
        "title": "Quản lý vật tư nông nghiệp gọn và rõ",
        "flavors": {
          "title": "Danh mục đúng mùa vụ",
          "desc": "Theo dõi nhóm phân bón, quy cách đóng gói và tồn kho theo từng đại lý để tư vấn đúng nhu cầu canh tác."
        },
        "quick": {
          "title": "Xử lý đơn nhanh",
          "desc": "Đặt trước, giữ hàng và giao đến trang trại với trạng thái đơn hàng rõ ràng từ lúc xác nhận đến hoàn tất."
        },
        "rewards": {
          "title": "Ưu đãi đại lý",
          "desc": "Quản lý chương trình điểm thưởng, mã ưu đãi và quyền lợi khách hàng thân thiết trong mùa cao điểm."
        }
      },
      "bestsellers": {
        "subtitle": "Nhà vườn tin dùng",
        "title": "Phân bón bán chạy",
        "fullMenu": "Toàn bộ danh mục",
        "topSeller": "#1 bán chạy"
      },
      "members": {
        "title": "Trở thành khách hàng thân thiết",
        "desc": "Tích lũy điểm trên mỗi đơn vật tư, nhận ưu đãi theo mùa vụ và theo dõi lịch sử mua hàng cho trang trại của bạn.",
        "joinFree": "Đăng ký miễn phí",
        "signIn": "Đăng nhập"
      }
    },
    "products": {
      "title": "Danh mục Phân bón",
      "subtitle": "Lọc nhanh theo nhóm vật tư, quy cách đóng gói và khoảng giá để chọn đúng phân bón cho mùa vụ.",
      "searching": "Đang tìm kiếm phân bón...",
      "searchPlaceholder": "Tìm phân bón, thương hiệu, quy cách...",
      "sort": {
        "popular": "Phổ biến nhất",
        "rating": "Yêu thích nhất",
        "priceAsc": "Giá: Thấp đến Cao",
        "priceDesc": "Giá: Cao đến Thấp"
      },
      "results": "Tìm thấy {count} phân bón phù hợp cho \"{query}\"",
      "noItems": "Không tìm thấy phân bón phù hợp",
      "categories": {
        "all": "Tất cả phân bón",
        "signature-design": "Phân bón NPK",
        "freeze-tea": "Phân bón hữu cơ",
        "banh-mi-food": "Phân bón lá",
        "pastries": "Cải tạo đất"
      },
      "soldOut": "Hết hàng",
      "added": "Đã thêm vào giỏ!",
      "addToOrder": "Thêm vào giỏ vật tư",
      "toastAdded": "{name} đã được thêm vào giỏ vật tư!"
    },
    "cart": {
      "title": "Giỏ hàng của bạn",
      "clear": "Xóa tất cả",
      "itemsCount": "{count} phân bón",
      "empty": {
        "title": "Giỏ hàng của bạn đang trống",
        "subtitle": "Hãy thêm vài mặt hàng để bắt đầu ưu đãi thức",
        "browse": "Xem Danh mục"
      },
      "item": {
        "remove": "Xóa"
      },
      "summary": {
        "title": "Tóm tắt Đơn vật tư",
        "subtotal": "Tạm tính",
        "tax": "Thuế (8%)",
        "total": "Tổng cộng",
        "checkout": "Thanh toán"
      }
    },
    "checkout": {
      "title": "Giỏ hàng",
      "loading": "Đang tải giỏ hàng...",
      "loadingSub": "Vui lòng chờ trong giây lát",
      "header": {
        "product": "Phân bón",
        "price": "Giá",
        "quantity": "Số lượng",
        "total": "Tổng"
      },
      "actions": {
        "selectAll": "Chọn tất cả",
        "deleteSelected": "Xóa đã chọn",
        "checkout": "Thanh toán"
      },
      "summary": {
        "total": "Tổng cộng"
      },
      "toasts": {
        "selectItems": "Vui lòng chọn phân bón",
        "orderSuccess": "Đặt hàng thành công!"
      }
    },
    "checkoutInfo": {
      "title": "THÔNG TIN KHÁCH HÀNG",
      "form": {
        "name": "Họ và tên",
        "phone": "Số điện thoại",
        "email": "Email",
        "subscribe": "Nhận email thông báo và ưu đãi"
      },
      "orderSummary": {
        "title": "Phân bón",
        "total": "Tổng cộng"
      },
      "steps": {
        "info": "1. THÔNG TIN",
        "payment": "2. THANH TOÁN"
      },
      "actions": {
        "continue": "Tiếp tục"
      },
      "toasts": {
        "fillAll": "Vui lòng nhập đầy đủ thông tin",
        "invalidPhone": "Số điện thoại không hợp lệ",
        "shippingInfo": "Vui lòng nhập thông tin người nhận",
        "addressSelect": "Vui lòng chọn đầy đủ địa chỉ",
        "addressDetail": "Vui lòng nhập địa chỉ cụ thể",
        "orderSuccess": "Tạo đơn vật tư thành công",
        "orderFailed": "Tạo đơn vật tư thất bại"
      }
    },
    "checkoutPayment": {
      "steps": {
        "info": "1. THÔNG TIN",
        "payment": "2. THANH TOÁN"
      },
      "coupon": {
        "placeholder": "Nhập mã ưu đãi (chỉ áp dụng 1 lần)",
        "apply": "Áp dụng"
      },
      "summary": {
        "title": "Tóm tắt Đơn vật tư",
        "productCount": "Số lượng phân bón",
        "subtotal": "Tổng tiền hàng",
        "shipping": "Phí vận chuyển",
        "discount": "Ưu đãi trực tiếp",
        "total": "Tổng tiền",
        "vat": "Đã gồm VAT và được làm tròn"
      },
      "paymentInfo": {
        "title": "THÔNG TIN THANH TOÁN"
      },
      "delivery": {
        "customer": "Khách Hàng",
        "phone": "Số điện thoại",
        "email": "Email",
        "address": "Nhận Hàng Tại",
        "receiver": "Người nhận"
      },
      "terms": {
        "agree": "Tôi đồng ý với",
        "tos": "Điều khoản dịch vụ",
        "and": "và",
        "privacy": "Chính sách bảo mật"
      },
      "footer": {
        "total": "Tổng tiền:",
        "pay": "Thanh toán",
        "checkItems": "Kiểm tra danh sách phân bón ({count})"
      }
    },
    "profile": {
      "title": "Hồ sơ của tôi",
      "edit": "Chỉnh sửa",
      "save": "Lưu",
      "memberSince": "Thành viên từ",
      "points": "Điểm",
      "orders": "Đơn vật tư",
      "totalSpent": "Tổng chi tiêu",
      "attributes": {
        "fullName": "Họ và tên",
        "username": "Tên đăng nhập",
        "email": "Email",
        "phone": "Số điện thoại",
        "gender": "Giới tính"
      },
      "genderOptions": {
        "male": "Nam",
        "female": "Nữ"
      },
      "changePassword": {
        "button": "Đổi mật khẩu",
        "success": "Cập nhật mật khẩu thành công!",
        "failed": "Đổi mật khẩu thất bại!",
        "error": "Đã có lỗi xảy ra khi đổi mật khẩu!"
      },
      "tabs": {
        "orders": "Lịch sử đơn vật tư",
        "points": "Lịch sử điểm",
        "rewards": "Chương trình ưu đãi",
        "payments": "Phương thức thanh toán"
      },
      "ordersTab": {
        "filters": {
          "all": "Tất cả",
          "waiting_for_confirmation": "Chờ xác nhận",
          "preparing": "Đang chuẩn bị",
          "shipping": "Đang giao",
          "completed": "Hoàn thành",
          "cancelled": "Đã hủy",
          "failed_order": "Thất bại",
          "refunded": "Đã hoàn tiền"
        },
        "count": "{count} đơn vật tư",
        "viewDetails": "Xem chi tiết →"
      },
      "pointsTab": {
        "earn": "Tích lũy từ đơn vật tư",
        "redeem": "Đổi ưu đãi",
        "manual": "Điều chỉnh hệ thống",
        "fallback": "Giao dịch điểm",
        "empty": "Không tìm thấy lịch sử giao dịch."
      },
      "rewardsTab": {
        "title": "Thành viên {tier}",
        "benefitsTitle": "Quyền lợi của bạn:",
        "noBenefits": "Chưa có quyền lợi cụ thể",
        "availableRewards": "Ưu đãi có sẵn",
        "redeem": "{points} điểm",
        "redeeming": "Đang xử lý...",
        "empty": "Chưa có ưu đãi nào."
      },
      "toasts": {
        "successRedeem": "Đổi ưu đãi thành công!",
        "failedRedeem": "Đổi ưu đãi thất bại!",
        "successProfile": "Cập nhật hồ sơ thành công!"
      }
    },
    "productDetail": {
      "notFound": "Không tìm thấy phân bón",
      "backToMenu": "Quay lại Danh mục",
      "addedToCart": "Đã thêm {qty}x {name} vào giỏ hàng!",
      "reviews": "({count} đánh giá)",
      "options": {
        "size": "Kích cỡ",
        "ice": "Mức đá",
        "sugar": "Mức đường"
      },
      "addToCart": "Thêm vào giỏ hàng"
    },
    "orderResult": {
      "success": {
        "title": "Đặt hàng thành công!",
        "subtitle": "Cảm ơn bạn đã mua sắm tại AgriFert."
      },
      "failed": {
        "title": "Đặt hàng thất bại!",
        "subtitle": "Thanh toán của bạn không thành công."
      },
      "orderId": "Mã đơn vật tư của bạn:",
      "status": "Trạng thái thanh toán:",
      "viewOrder": "Xem chi tiết đơn vật tư",
      "continueShopping": "Tiếp tục mua sắm",
      "backToCheckout": "Thanh toán lại",
      "loading": "Đang tải..."
    },
    "orderDetail": {
      "loading": "Đang tải đơn vật tư...",
      "notFound": "Không tìm thấy đơn vật tư",
      "back": "Quay lại",
      "title": "Đơn vật tư #{id}",
      "detailsTitle": "Chi tiết đơn vật tư",
      "orderedAt": "Đặt lúc {date}",
      "cancelOrder": "Hủy đơn vật tư",
      "cancelConfirm": "Hủy đơn vật tư",
      "cancelConfirmDesc": "Bạn có chắc chắn muốn hủy đơn vật tư này không? Thao tác này không thể hoàn tác.",
      "close": "Đóng",
      "cancelButton": "Hủy đơn",
      "confirmReceipt": "Xác nhận đã nhận",
      "productList": "Danh sách phân bón",
      "quantity": "Số lượng: {count}",
      "orderStatus": "Trạng thái đơn vật tư",
      "steps": {
        "waiting_for_confirmation": "Chờ xác nhận",
        "preparing": "Đang chuẩn bị",
        "shipping": "Đang giao",
        "completed": "Hoàn thành",
        "cancelled": "Đã hủy",
        "failed_order": "Thất bại",
        "refunded": "Đã hoàn tiền"
      },
      "toasts": {
        "statusUpdate": "Trạng thái đơn vật tư: {status}",
        "confirmFailed": "Xác nhận thất bại!",
        "cancelFailed": "Hủy đơn thất bại!"
      },
      "customerInfo": {
        "title": "Thông tin Khách hàng",
        "name": "Tên khách hàng",
        "address": "Địa chỉ"
      },
      "paymentInfo": {
        "title": "Thông tin Thanh toán",
        "subtotal": "Tạm tính",
        "shipping": "Vận chuyển",
        "free": "Miễn phí",
        "total": "Tổng cộng"
      },
      "supportInfo": {
        "title": "Thông tin Hỗ trợ"
      }
    },
    "franchiseDetail": {
      "title": "Chi tiết Nhượng quyền",
      "subtitle": "Xem hoặc cập nhật thông tin cho đại lý này.",
      "form": {
        "name": "Tên Đại lý",
        "address": "Địa chỉ",
        "status": "Trạng thái",
        "statusActive": "Đang hoạt động",
        "statusInactive": "Ngừng hoạt động",
        "statusNew": "Mới",
        "phone": "Số điện thoại liên hệ",
        "email": "Email liên hệ",
        "noPhone": "Chưa có số điện thoại",
        "noEmail": "Chưa có email",
        "operatingDates": "Ngày hoạt động",
        "to": "đến",
        "createdAt": "Ngày tạo"
      },
      "actions": {
        "edit": "Chỉnh sửa Đại lý",
        "close": "Đóng"
      }
    },
    "franchiseForm": {
      "title": {
        "create": "Đăng ký Đối tác Mới",
        "edit": "Chỉnh sửa Hồ sơ Đại lý"
      },
      "subtitle": "Hệ thống quản lý thống nhất",
      "form": {
        "name": "Tên Đại lý",
        "namePlaceholder": "Ví dụ: Đại lý Quận 7",
        "nameRequired": "Tên đại lý là bắt buộc",
        "nameTooShort": "Tên phải có ít nhất 2 ký tự",
        "nameHint": "Tối thiểu 2 ký tự",
        "address": "Địa chỉ Vị trí",
        "addressPlaceholder": "Số nhà, tên đường, thành phố",
        "addressRequired": "Địa chỉ vị trí là bắt buộc",
        "googleMapsUrl": "URL Google Maps",
        "chooseOnMap": "Chọn trên bản đồ",
        "googleMapsPlaceholder": "https://www.google.com/maps?q=...",
        "googleMapsNote": "Dán URL Google Maps hoặc chọn trên bản đồ — địa chỉ sẽ tự động điền.",
        "phone": "Số điện thoại",
        "phonePlaceholder": "Ví dụ: 0901234567",
        "phoneRequired": "Số điện thoại là bắt buộc",
        "phoneInvalid": "Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10-11 chữ số",
        "phoneHint": "Bắt đầu bằng 0 hoặc +84, từ 10-11 chữ số",
        "email": "Địa chỉ Email",
        "emailPlaceholder": "quanly@chinhanh.com",
        "emailRequired": "Địa chỉ email là bắt buộc",
        "emailInvalid": "Email phải có @ và tên miền (VD: example@mail.com)",
        "emailHint": "Định dạng: example@mail.com",
        "status": "Trạng thái",
        "statusOptions": {
          "new": "Đối tác mới",
          "active": "Đại lý hoạt động",
          "inactive": "Hủy kích hoạt"
        },
        "openedDate": "Ngày mở",
        "closedDate": "Ngày đóng"
      },
      "actions": {
        "cancel": "Hủy bỏ",
        "create": "Xác nhận Đăng ký",
        "creating": "Đang xử lý...",
        "save": "Cập nhật Cơ sở dữ liệu",
        "saving": "Đang lưu..."
      }
    },
    "loyaltyProfile": {
      "title": "Chương trình Khách hàng thân thiết",
      "currentPoints": "Điểm hiện tại:",
      "yourBenefits": "Quyền lợi của bạn:",
      "rewards": "Phần ưu đãi",
      "ptsRequired": "điểm",
      "redeem": "Đổi điểm",
      "emptyRewards": "Hiện tại không có phần ưu đãi nào.",
      "pointsHistory": "Lịch sử điểm",
      "table": {
        "type": "Loại",
        "points": "Điểm",
        "description": "Mô tả",
        "date": "Ngày"
      },
      "emptyTransactions": "Không tìm thấy giao dịch nào."
    },
    "paymentMethods": {
      "MOMO": "Ví MoMo",
      "VNPAY": "VNPay",
      "COD": "Thanh toán khi nhận hàng (COD)"
    },
    "shippingInfo": {
      "title": "THÔNG TIN GIAO HÀNG",
      "types": {
        "store": "Nhận tại đại lý",
        "delivery": "Giao hàng tận nơi"
      },
      "store": {
        "city": "Hồ Chí Minh",
        "district": "Chọn quận / huyện",
        "address": "Chọn địa chỉ đại lý"
      },
      "delivery": {
        "name": "Tên người nhận",
        "phone": "Số điện thoại người nhận",
        "province": "Chọn Tỉnh / Thành phố",
        "district": "Chọn Quận / Huyện",
        "ward": "Chọn Phường / Xã",
        "address": "Số nhà / Tên đường"
      },
      "notes": "Ghi chú khác"
    }
  },
  "modals": {
    "addCustomer": {
      "title": "Đăng ký Khách hàng Mới",
      "subtitle": "Khách hàng thân thiết & Hồ sơ",
      "form": {
        "name": "Họ và tên",
        "phone": "Số điện thoại",
        "email": "Địa chỉ Email",
        "note": "* Lưu ý: Hệ thống sẽ tự động cấp 0 điểm tích lũy và xếp hạng ĐỒNG cho khách hàng mới."
      },
      "actions": {
        "cancel": "Hủy",
        "register": "Đăng ký Khách hàng",
        "registering": "Đang đăng ký..."
      },
      "errors": {
        "required": "Họ tên và Số điện thoại là bắt buộc!",
        "noFranchise": "Bạn không thuộc đại lý nào. Hành động bị từ chối.",
        "failed": "Tạo khách hàng thất bại. Số điện thoại/Email có thể đã tồn tại."
      }
    },
    "addEditProduct": {
      "title": {
        "update": "Cập nhật Phân bón",
        "add": "Thêm Phân bón Mới"
      },
      "subtitle": "Kho hàng",
      "form": {
        "name": "Tên phân bón",
        "namePlaceholder": "Ví dụ: Cold Brew Phân bón",
        "brand": "Thương hiệu",
        "brandPlaceholder": "Ví dụ: Nike, Adidas...",
        "sku": "Mã SKU",
        "skuPlaceholder": "SKU-001",
        "price": "Giá bán",
        "category": "Danh mục",
        "description": "Mô tả phân bón",
        "descriptionPlaceholder": "Mô tả chi tiết về phân bón...",
        "stock": "Tồn kho ban đầu",
        "image": "Hình ảnh phân bón",
        "imageDrop": "Thả ảnh hoặc duyệt",
        "imageSpec": "Kích thước khuyến nghị: 800x800px",
        "status": "Trạng thái",
        "statusActive": "Hoạt động",
        "statusInactive": "Ngưng hoạt động"
      },
      "actions": {
        "cancel": "Hủy",
        "save": "Lưu thay đổi",
        "create": "Tạo phân bón"
      }
    },
    "addFranchise": {
      "title": "Đối tác Nhượng quyền Mới",
      "form": {
        "branchName": "Tên đại lý",
        "branchNamePlaceholder": "Ví dụ: Đại lý Quận 7",
        "managerName": "Tên Quản lý",
        "managerNamePlaceholder": "Họ và tên",
        "address": "Địa chỉ Vị trí",
        "addressPlaceholder": "Số nhà, tên đường, thành phố",
        "email": "Địa chỉ Email",
        "emailPlaceholder": "manager@example.com",
        "phone": "Số điện thoại",
        "phonePlaceholder": "+84 ..."
      },
      "actions": {
        "cancel": "Hủy",
        "register": "Đăng ký Nhượng quyền"
      }
    },
    "addRole": {
      "title": "Định nghĩa Vai trò Mới",
      "form": {
        "name": "Tên Vai trò",
        "namePlaceholder": "Ví dụ: Chuyên viên Kho",
        "description": "Mô tả",
        "descriptionPlaceholder": "Mô tả ngắn gọn vai trò này có thể làm gì"
      },
      "actions": {
        "cancel": "Hủy",
        "initialize": "Khởi tạo Vai trò"
      }
    },
    "addUser": {
      "title": "Tạo Người dùng Mới",
      "subtitle": "Kiểm soát Truy cập",
      "form": {
        "name": "Họ và tên",
        "namePlaceholder": "John Doe",
        "phone": "Số điện thoại",
        "phonePlaceholder": "+84 ...",
        "email": "Địa chỉ Email",
        "emailPlaceholder": "email@capitalvật tư nông nghiệp.com",
        "username": "Tên đăng nhập",
        "usernamePlaceholder": "johndoe123",
        "generateUsername": "Tạo Tên đăng nhập Ngẫu nhiên",
        "gender": "Giới tính",
        "genderOptions": {
          "male": "Nam",
          "female": "Nữ"
        },
        "role": "Vai trò Hệ thống",
        "branch": "Gán Đại lý"
      },
      "actions": {
        "cancel": "Hủy",
        "create": "Tạo Tài khoản"
      }
    },
    "categoryAddUpdate": {
      "title": {
        "edit": "Chỉnh sửa Danh mục",
        "new": "Danh mục Mới"
      },
      "subtitle": "Quản lý Danh mục",
      "form": {
        "name": "Tên Danh mục",
        "namePlaceholder": "Ví dụ: Dòng Cold Brew",
        "slug": "Slug URL",
        "slugPlaceholder": "cold-brew-series",
        "description": "Mô tả",
        "descriptionPlaceholder": "Mô tả loại phân bón nào thuộc danh mục này...",
        "status": "Trạng thái Hiển thị",
        "statusActive": "Hoạt động",
        "statusInactive": "Ngưng hoạt động"
      },
      "actions": {
        "cancel": "Hủy",
        "saving": "Đang lưu...",
        "update": "Cập nhật Danh mục",
        "create": "Tạo Danh mục"
      },
      "alerts": {
        "required": "Tên danh mục là bắt buộc",
        "updated": "Cập nhật danh mục thành công",
        "created": "Tạo danh mục thành công",
        "failed": "Lưu danh mục thất bại"
      }
    },
    "categoryDetail": {
      "itemsLabel": "Tổng phân bón đang có",
      "itemsSuffix": "phân bón",
      "statusLabel": "Trạng thái Danh mục",
      "notesLabel": "Ghi chú danh mục",
      "close": "Đóng cửa sổ"
    },
    "changePassword": {
      "title": "Đổi Mật khẩu",
      "description": "Đảm bảo tài khoản của bạn đang sử dụng mật khẩu dài, ngẫu nhiên để an toàn.",
      "currentPassword": "Mật khẩu Hiện tại",
      "newPassword": "Mật khẩu Mới",
      "confirmPassword": "Xác nhận Mật khẩu Mới",
      "actions": {
        "cancel": "Hủy",
        "update": "Cập nhật Mật khẩu"
      }
    },
    "confirmDelete": {
      "title": "Xác nhận xóa",
      "message": {
        "before": "Bạn có chắc muốn xóa ca ",
        "after": "? Hành động này không thể hoàn tác."
      },
      "actions": {
        "cancel": "Hủy",
        "deleting": "Đang xóa...",
        "delete": "Xóa"
      }
    },
    "confirm": {
      "actions": {
        "cancel": "Hủy",
        "deleting": "Đang xóa...",
        "delete": "Xóa"
      }
    },
    "customerDetail": {
      "contactDetails": "Thông tin Liên hệ",
      "memberSince": "Thành viên từ",
      "loyaltySummary": "Tóm tắt Điểm ưu đãi",
      "points": "Điểm",
      "readyRedeem": "Sẵn sàng đổi ưu đãi",
      "spendingInsights": "Thống kê Chi tiêu",
      "lifetimeValue": "Tổng Chi tiêu",
      "ordersCount": "Số lượng Đơn vật tư",
      "nextTierProgress": "Tiến trình Hạng kế tiếp",
      "spendMore": "Chi tiêu thêm 150.000đ để đạt Bạch Kim",
      "actions": {
        "editProfile": "Chỉnh sửa Hồ sơ",
        "sendPromo": "Gửi Ưu đãi"
      }
    },
    "franchiseDetail": {
      "title": "Chi tiết Đại lý",
      "subtitle": "Hồ sơ Cơ sở Dữ liệu",
      "form": {
        "name": "Tên Đại lý",
        "address": "Địa chỉ",
        "status": "Trạng thái",
        "statusActive": "Hoạt động",
        "statusInactive": "Ngưng hoạt động",
        "statusNew": "Đại lý mới",
        "phone": "Số điện thoại",
        "email": "Email liên hệ",
        "noPhone": "Chưa có số điện thoại",
        "noEmail": "Chưa có email",
        "createdAt": "Ngày tạo"
      },
      "actions": {
        "edit": "Chỉnh sửa Đại lý",
        "close": "Đóng"
      }
    },
    "franchiseForm": {
      "title": {
        "create": "Đăng ký Đại lý Mới",
        "edit": "Chỉnh sửa Hồ sơ Đại lý"
      },
      "subtitle": "Hệ thống quản lý thống nhất",
      "form": {
        "name": "Tên Đại lý",
        "namePlaceholder": "Ví dụ: Đại lý Quận 7",
        "nameRequired": "Tên đại lý là bắt buộc",
        "nameTooShort": "Tên phải có ít nhất 2 ký tự",
        "nameHint": "Tối thiểu 2 ký tự",
        "address": "Địa chỉ Vị trí",
        "addressPlaceholder": "Số nhà, tên đường, thành phố",
        "addressRequired": "Địa chỉ vị trí là bắt buộc",
        "googleMapsUrl": "URL Google Maps",
        "chooseOnMap": "Chọn trên bản đồ",
        "googleMapsPlaceholder": "https://www.google.com/maps?q=...",
        "googleMapsNote": "Dán URL Google Maps hoặc chọn trên bản đồ — địa chỉ sẽ tự động điền.",
        "phone": "Số điện thoại",
        "phonePlaceholder": "Ví dụ: 0901234567",
        "phoneRequired": "Số điện thoại là bắt buộc",
        "phoneInvalid": "Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10-11 chữ số",
        "phoneHint": "Bắt đầu bằng 0 hoặc +84, từ 10-11 chữ số",
        "email": "Địa chỉ Email",
        "emailPlaceholder": "quanly@chinhanh.com",
        "emailRequired": "Địa chỉ email là bắt buộc",
        "emailInvalid": "Email phải có @ và tên miền (VD: example@mail.com)",
        "emailHint": "Định dạng: example@mail.com",
        "status": "Trạng thái",
        "statusActive": "Hoạt động",
        "statusInactive": "Ngưng hoạt động",
        "openedAt": "Ngày mở cửa",
        "closedAt": "Ngày đóng cửa"
      },
      "actions": {
        "cancel": "Hủy bỏ",
        "creating": "Đang xử lý...",
        "saving": "Đang lưu...",
        "create": "Xác nhận Đăng ký",
        "save": "Cập nhật Đại lý"
      }
    },
    "generateCoupon": {
      "title": "Tạo Mã Ưu đãi",
      "promotionLabel": "Chương trình:",
      "form": {
        "quantity": "Số lượng Mã",
        "usageLimit": "Lượt dùng mỗi Mã",
        "expiryDate": "Ngày hết hạn",
        "status": "Trạng thái",
        "statusActive": "Hoạt động",
        "statusInactive": "Ngưng hoạt động"
      },
      "actions": {
        "generate": "Tạo Mã"
      },
      "alerts": {
        "success": "Tạo mã ưu đãi thành công",
        "failed": "Tạo mã ưu đãi thất bại"
      }
    },
    "managePermission": {
      "title": "Quyền Hệ thống",
      "subtitle": "Điểm Truy cập Chức năng",
      "topBar": {
        "countBefore": "Đã định nghĩa ",
        "countAfter": " quyền",
        "add": "Thêm Quyền mới"
      },
      "empty": "Không tìm thấy quyền nào. Nhấn Thêm để tạo mới.",
      "actions": {
        "close": "Đóng"
      },
      "confirmDelete": {
        "title": "Xóa Quyền?",
        "message": {
          "before": "Bạn có chắc muốn xóa quyền ",
          "after": "? Hành động này không thể hoàn tác."
        }
      }
    },
    "permissionForm": {
      "title": {
        "create": "Tạo Quyền",
        "edit": "Chỉnh sửa Quyền"
      },
      "form": {
        "name": "Tên Quyền",
        "namePlaceholder": "Ví dụ: AUTH_MANAGE_USERS",
        "api": "API Endpoint",
        "apiPlaceholder": "Ví dụ: /api/auth/users/**",
        "method": "Phương thức HTTP",
        "description": "Mô tả",
        "descriptionPlaceholder": "Ví dụ: Cho phép xem chi tiết người dùng"
      },
      "actions": {
        "cancel": "Hủy",
        "create": "Tạo Quyền",
        "save": "Lưu Thay đổi"
      }
    },
    "promotionDetail": {
      "title": "Chi tiết Ưu đãi",
      "table": {
        "code": "Mã",
        "limit": "Giới hạn",
        "used": "Đã dùng",
        "expiry": "Hết hạn",
        "status": "Trạng thái",
        "empty": "Không tìm thấy mã ưu đãi nào"
      },
      "status": {
        "expired": "HẾT HẠN",
        "active": "HOẠT ĐỘNG",
        "inactive": "NGƯNG HOẠT ĐỘNG"
      },
      "actions": {
        "edit": "Sửa",
        "delete": "Xóa"
      },
      "editModal": {
        "title": "Sửa Mã ưu đãi",
        "usageLimit": "Giới hạn sử dụng",
        "expiryDate": "Ngày hết hạn",
        "status": "Trạng thái",
        "cancel": "Hủy",
        "save": "Lưu"
      },
      "alerts": {
        "updateSuccess": "Cập nhật mã ưu đãi thành công",
        "updateFailed": "Cập nhật thất bại",
        "deleteConfirm": "Xóa mã ưu đãi này?",
        "deleteSuccess": "Xóa mã ưu đãi thành công",
        "deleteFailed": "Xóa thất bại"
      }
    }
  },
  "auth": {
    "adminLogin": {
      "header": {
        "subtitle": "Cổng thông tin Nhân viên",
        "loginSystem": "Đăng nhập bằng hệ thống tài khoản"
      },
      "banner": {
        "verifiedSuccess": "Xác minh Email thành công!",
        "canSignIn": "Bây giờ bạn có thể đăng nhập vào tài khoản của mình."
      },
      "form": {
        "username": "Email hoặc Tên đăng nhập",
        "password": "Mật khẩu"
      },
      "placeholders": {
        "username": "Nhập email hoặc tên đăng nhập của bạn",
        "password": "••••••••"
      },
      "actions": {
        "signIn": "Đăng nhập",
        "backToSite": "← Trở lại trang Khách hàng"
      },
      "toasts": {
        "fillAll": "Vui lòng điền đầy đủ các trường",
        "invalid": "Thông tin đăng nhập không hợp lệ",
        "welcome": "Chào mừng trở lại, {name}! ",
        "verifyFirst": "Vui lòng xác minh email của bạn trước",
        "failed": "Đăng nhập thất bại"
      }
    },
    "login": {
      "banner": {
        "verifiedSuccess": "Xác minh Email thành công!",
        "canSignIn": "Bây giờ bạn có thể đăng nhập vào tài khoản của mình."
      },
      "welcome": {
        "title": "Chào mừng\nTrở lại",
        "subtitle": "Đăng nhập để truy cập đơn vật tư, phần ưu đãi và trải nghiệm cá nhân hóa của bạn.",
        "features": {
          "track": "Theo dõi đơn vật tư theo thời gian thực",
          "earn": "Tích lũy & đổi điểm ưu đãi",
          "save": "Lưu lịch sử tùy chỉnh yêu thích"
        }
      },
      "form": {
        "title": "Đăng nhập",
        "noAccount": "Chưa có tài khoản?",
        "joinFree": "Tham gia miễn phí",
        "username": "Tên đăng nhập hoặc Email",
        "password": "Mật khẩu",
        "forgotPassword": "Quên mật khẩu?"
      },
      "placeholders": {
        "username": "nhập tên đăng nhập hoặc email của bạn",
        "password": "••••••••"
      },
      "actions": {
        "signIn": "Đăng nhập",
        "loginGoogle": "Đăng nhập bằng Google"
      },
      "footer": {
        "isStaff": "Bạn là nhân viên?",
        "staffPortal": "Cổng thông tin Nhân viên →"
      }
    },
    "register": {
      "welcome": {
        "title": "Tham gia\nGia đình",
        "subtitle": "Tạo tài khoản miễn phí và bắt đầu tích lũy điểm ưu đãi ngay hôm nay.",
        "stats": {
          "points": "Điểm chào mừng",
          "membership": "Thành viên",
          "birthday": "Ưu đãi sinh nhật",
          "support": "Hỗ trợ"
        }
      },
      "toasts": {
        "fillAll": "Vui lòng điền đầy đủ các trường bắt buộc",
        "matchError": "Mật khẩu không khớp",
        "agreeTerms": "Vui lòng đồng ý với các điều khoản",
        "pwdSpaces": "Mật khẩu không được chứa khoảng trắng",
        "usernameFormat": "Tên đăng nhập chỉ cho phép chữ cái, chữ số và dấu gạch dưới",
        "pwdLength": "Mật khẩu phải từ 8 đến 64 ký tự",
        "usernameLength": "Tên đăng nhập phải từ 3 đến 64 ký tự",
        "success": "Đăng ký thành công! Vui lòng kiểm tra email để nhận mã xác thực. ",
        "fixErrors": "Vui lòng sửa các lỗi bên dưới",
        "failed": "Đăng ký thất bại"
      },
      "form": {
        "title": "Tạo tài khoản",
        "haveAccount": "Đã có tài khoản?",
        "signIn": "Đăng nhập",
        "username": "Tên đăng nhập",
        "fullName": "Họ và tên",
        "email": "Địa chỉ Email",
        "phone": "Số điện thoại",
        "gender": "Giới tính",
        "password": "Mật khẩu",
        "confirmPassword": "Xác nhận Mật khẩu",
        "genderOptions": {
          "none": "Không muốn tiết lộ",
          "male": "Nam",
          "female": "Nữ"
        },
        "strength": {
          "weak": "Yếu",
          "medium": "Trung bình",
          "strong": "Mạnh"
        },
        "terms": {
          "agree": "Tôi đồng ý với",
          "tos": "Điều khoản Dịch vụ",
          "and": "và",
          "privacy": "Chính sách Bảo mật"
        }
      },
      "actions": {
        "createAccount": "Tạo tài khoản"
      }
    },
    "forgotPassword": {
      "title": "Quên mật khẩu",
      "subtitle": "Đừng lo lắng! Nhập thông tin chi tiết của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.",
      "toasts": {
        "enterIdentifier": "Vui lòng nhập email hoặc tên đăng nhập",
        "sendOtpSuccess": "Mã OTP đã được gửi đến email của bạn",
        "sendOtpFailed": "Gửi mã OTP thất bại",
        "error": "Đã xảy ra lỗi khi gửi mã OTP"
      },
      "form": {
        "username": "Email hoặc Tên đăng nhập"
      },
      "placeholders": {
        "username": "Nhập email hoặc tên đăng nhập của bạn"
      },
      "actions": {
        "sendOtp": "Gửi mã OTP",
        "sending": "Đang gửi...",
        "backToSignIn": "Trở lại Đăng nhập"
      },
      "footer": {
        "needHelp": "Cần trợ giúp?",
        "contactSupport": "Liên hệ Hỗ trợ"
      }
    },
    "confirmPassword": {
      "title": "Đặt lại Mật khẩu",
      "subtitle": "Vui lòng nhập mã chúng tôi đã gửi đến email của bạn và chọn mật khẩu mới.",
      "toasts": {
        "matchError": "Mật khẩu xác nhận không khớp!",
        "enterOtp": "Vui lòng nhập mã OTP",
        "resetSuccess": "Đặt lại mật khẩu thành công",
        "resetFailed": "Đặt lại mật khẩu thất bại",
        "error": "Đã xảy ra lỗi khi đặt lại mật khẩu"
      },
      "form": {
        "code": "Mã xác thực",
        "newPassword": "Mật khẩu mới",
        "confirmPassword": "Xác nhận Mật khẩu mới"
      },
      "actions": {
        "resetPassword": "Đặt lại Mật khẩu",
        "resetting": "Đang đặt lại...",
        "resendCode": "Gửi lại mã",
        "backToSignIn": "Trở lại Đăng nhập"
      }
    },
    "verifyEmail": {
      "title": "Xác minh Email",
      "subtitle1": "Chúng tôi đã gửi mã xác thực 6 số đến",
      "subtitle2": "Nhập mã bên dưới để kích hoạt tài khoản của bạn.",
      "toasts": {
        "enterCode": "Vui lòng nhập đầy đủ mã 6 số",
        "verifySuccess": "Xác minh Email thành công! Chào mừng bạn đến với AgriFert ",
        "invalidCode": "Mã xác thực không hợp lệ",
        "newCodeSent": "Mã mới đã được gửi đến email của bạn",
        "resendFailed": "Gửi lại mã thất bại"
      },
      "actions": {
        "verifyEmail": "Xác minh Email",
        "backToRegister": "← Trở lại Đăng ký"
      },
      "resend": {
        "text": "Không nhận được mã?",
        "countdown": "Gửi lại sau"
      }
    }
  },
  "ui": {
    "pagination": {
      "page": "Trang",
      "firstPage": "Trang đầu",
      "lastPage": "Trang cuối"
    },
    "searchInput": {
      "placeholder": "Tìm kiếm..."
    },
    "table": {
      "emptyMessage": "Không có dữ liệu phù hợp.",
      "showHideCols": "Hiển thị/Ẩn cột",
      "customizeDisplay": "Tùy chỉnh hiển thị"
    }
  },
  "components": {
    "orderDetailDrawer": {
      "title": "Chi tiết Đơn vật tư",
      "generalInfo": "Thông tin chung",
      "orderId": "Mã Đơn vật tư:",
      "date": "Ngày tạo:",
      "branchId": "Mã Đại lý:",
      "staffId": "Mã Nhân viên:",
      "status": "Trạng thái:",
      "customer": "Khách hàng",
      "guest": "Khách lẻ",
      "loyaltyPoints": "Điểm ưu đãi:",
      "productList": "Danh sách phân bón",
      "colProduct": "Phân bón",
      "colQty": "SL",
      "colPrice": "Giá",
      "colTotal": "Tổng cộng",
      "payment": "Thanh toán",
      "totalDue": "Tổng tiền Cần thanh toán:",
      "shippingPrice": "Phí vận chuyển:",
      "discount": "Ưu đãi:",
      "finalAmount": "Thành tiền:",
      "paymentMethod": "Phương thức thanh toán:",
      "confirmOrder": "Xác nhận Đơn vật tư",
      "cancelOrder": "Hủy Đơn vật tư"
    },
    "orderTable": {
      "loading": "Đang tải...",
      "colOrderId": "Mã Đơn vật tư",
      "colDate": "Ngày tạo",
      "colBranch": "Đại lý",
      "colCustomer": "Khách hàng",
      "colTotal": "Tổng cộng",
      "colPayment": "Thanh toán",
      "colStatus": "Trạng thái",
      "colAction": "Thao tác",
      "guest": "Khách lẻ",
      "na": "N/A"
    }
  }
};
