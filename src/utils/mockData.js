import { USE_MOCK_API } from "@/mocks/mockConfig";

export const MOCK_PRODUCTS = [
  {
    id: '11111111-aaaa-1111-1111-111111111111', name: 'NPK 20-20-15 Bag 25kg', category: 'npk-fertilizer', price: 3.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6BoQGUPM6LWw6U3G9j7PZHPmxY_FlVt-KjioiaZCNPg2mO4Te3Gix7LkwOHEMXmZjIji3_POQnk3mdjT4v8wmK97ulbAFvPeemnex7_pvCBq7WeYy4aH3Ip_9s1IfY10eEOv-oo6CfnRfx0v9--AUrZwPoe6I7M1_2xz8IJ3hSq_ZMjiQbEqi4PoDcmkJ2JggJK_itjAosRgJjXC0jqfGuXSMbdTTr4kpP9dhEbdHY_VxU-lNOKlmsSNuL2nStQ_0BQQY2GAO52Un',
    description: 'Balanced NPK fertilizer for strong crop growth.',
    badge: 'Top Supply', rating: 4.9, reviews: 324, available: true,
    details: 'Our signature NPK 20-20-15 Bag 25kg uses premium Robusta beans slow-dripped through a traditional Vietnamese phin filter. Served over ice with a generous pour of sweetened condensed milk for a rich, indulgent experience.',
  },
  {
    id: '22222222-bbbb-2222-2222-222222222222', name: 'Organic Microbial Fertilizer', category: 'npk-fertilizer', price: 4.25,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzLxp31GUX7qsRljNVCsdzT80h51nVXnsDF3y33laS61rw2V4Y1k8ilBuZYexkMW1JYF5ndl2Vqd21H-H5NeTWsj4jy0lQFV0ivA05V6s-1Egj6F5yEanHiYRFSsYlp3j0_XeOT4LfYVmg3ticMx0jwXUUcc4zR7fMU4JJGIyxiJiZLuWl0hsgd4rMdQ_sjs898S0wyaDBfG7JZTaqLBPnyVZHK9nmzpa7UaccNA6EzRrNcn78HBxl3cutSCs1We-UpUc2Ch9Taaqk',
    description: 'Organic microbial fertilizer for healthier soil biology.', badge: null, rating: 4.7, reviews: 218, available: true,
    details: 'Double shot espresso blended with velvety steamed whole milk. Our baristas craft each latte with meticulous latte art for a beautiful presentation.',
  },
  {
    id: '33333333-cccc-3333-3333-333333333333', name: 'DAP 18-46-0', category: 'npk-fertilizer', price: 3.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6PH-xGxLdxp6esk9skZLjlDflptijcbVtHWHYKJKXBKIgiyTz4e8bavcgjppMIzWZQXv2ox0ipwZ1GoyGpLc4tlV7ZXX_nSlO4swVU30g-1dA87lWoeHoTRj_IgBeDtTyO57vaVk-68rBJfOeXX45fpUfUq9I6IsMHg_0LCy_lcQtqYVR6LzA7XHuy_R788eUNkyExi6zgmRLlQPsY1--lUP0muZWIfhQFA2BT4QBbmixOLqARjtflnvJPap5B-ygPVB7WnDI7bBU',
    description: 'High-phosphate DAP fertilizer for root and flowering stages.', badge: null, rating: 4.8, reviews: 189, available: true,
    details: 'High-phosphate DAP fertilizer supports root development and flowering during key crop stages.',
  },
  {
    id: '44444444-dddd-4444-4444-444444444444', name: 'Foliar Fertilizer Amino', category: 'organic-fertilizer', price: 4.75,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    description: 'Amino foliar fertilizer for fast nutrient absorption.', badge: 'New', rating: 4.6, reviews: 94, available: true,
    details: 'Premium ceremonial grade matcha blended with milk and ice, topped with our signature milk foam and a dusting of matcha powder.',
  },
  {
    id: '55555555-eeee-5555-5555-555555555555', name: 'Humic Acid Soil Booster', category: 'organic-fertilizer', price: 3.75,
    image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400',
    description: 'Humic acid blend for soil structure and nutrient uptake.', badge: null, rating: 4.5, reviews: 156, available: true,
    details: 'Fresh passion fruit infused with our house-blend jasmine tea, served with chewy tapioca pearls and a splash of lemon.',
  },
  {
    id: '6', name: 'Calcium Boron Foliar Pack', category: 'foliar-fertilizer', price: 5.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtfgRfIzONemvTqliTr5PF7SFDrtkllu41sbedM8aKHTaUqIpvfvqszj_xsM04bYQPQVNHvJluj6Ken3s9NtUy8jqJHtXX5XI2jIv12F5BK6ZEt2Jujs1MpM489uKeRV-G8CBqHe624w_iMupqvovSATjXyOAeQCL7kGFG1pyT8CvdfYeyuwAsV3O72aC3BFyinJkIltProNiFwQj1N3Q2xgcURu21CCi7FPlj-sCO64sXCHVg53TIWRndZVRWKrdEZbPPHGp8nzAA',
    description: 'Crispy baguette filled with ham, pâté, pickled vegetables, and cilantro.', badge: 'Popular', rating: 4.9, reviews: 412, available: true,
    details: 'Our signature banh mi features a freshly baked baguette filled with Vietnamese cold cuts, house-made pâté, daikon-carrot pickles, fresh cucumber, cilantro, jalapeño, and sriracha mayo.',
  },
  {
    id: '7', name: 'Dolomite Soil Conditioner', category: 'soil-care', price: 3.25,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhaxfYbNqWC64Vw3l564n6RSIYCmPnbTCKpHMly1ZnY5wouvVvA92eJRllroS4fIJmiq_4WxI83nk3fwFKQgaLoZ8xafvAOYomd1lFGgaVDsaYy7_THck-TeJGO5fgsnwHee-IuGEWydk_kBTCMwmfUbT4kpxZ4F0E76aek4C8bb3ZAtCZKtFA9W88j-P0rZhl2BQ0gtYTR3x697H7ZpgLY32npV7NdZ7jK7x1xFUMTYKkipp4lrRKf9SARCqKyO8hvsK8k8ackXYp',
    description: 'Dolomite mineral amendment for balancing soil pH.', badge: null, rating: 4.4, reviews: 87, available: true,
    details: 'Crafted with 48 layers of hand-folded dough and pure French butter, our croissants are baked every morning to achieve that perfect shattering crust and pillowy interior.',
  },
  {
    id: '8', name: 'Potassium Humate', category: 'npk-fertilizer', price: 4.50,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    description: 'Potassium humate granules for root vigor and nutrient efficiency.', badge: 'Specialty', rating: 4.8, reviews: 267, available: true,
    details: 'A Hanoi classic. Strong robusta espresso topped with a luxuriously whipped mixture of egg yolk, condensed milk, and Vietnamese butter. Unique, indulgent, and unforgettable.',
  },
]

export const MOCK_USERS = {
  customer: { id: 'c1', name: 'Nguyen Van A', email: 'customer@demo.com', role: 'customer', phone: '0901234567', avatar: null, points: 340, memberSince: '2023-01-15' },
  staff: { id: 's1', name: 'Tran Thi B', email: 'staff@demo.com', role: 'staff', branch: 'AgriFert - Central Agency', avatar: null },
  manager: { id: 'm1', name: 'Le Van C', email: 'manager@demo.com', role: 'manager', branch: 'AgriFert - Central Agency', avatar: null },
  admin: { id: 'a1', name: 'Admin System', email: 'admin@demo.com', role: 'admin', avatar: null },
}

export const MOCK_STATS = {
  admin: {
    totalRevenue: 284500,
    totalOrders: 12840,
    totalBranches: 24,
    totalStaff: 186,
    revenueGrowth: 12.4,
    ordersGrowth: 8.2,
  },
  manager: {
    todayRevenue: 3250,
    todayOrders: 142,
    pendingOrders: 8,
    staffOnDuty: 4,
  },
  staff: {
    pendingOrders: 5,
    completedToday: 67,
    avgPrepTime: '4.2 min',
    queue: 3,
  },
}

export const MOCK_ORDERS_QUEUE = [
  { id: '#1042', customer: 'Minh T.', items: ['NPK 20-20-15 Bag 25kg x2', 'Calcium Boron x1'], status: 'preparing', time: '2 min ago', total: 12.50 },
  { id: '#1043', customer: 'Lan H.', items: ['Foliar Fertilizer Amino x1', 'Dolomite x1'], status: 'pending', time: 'Just now', total: 8.00 },
  { id: '#1044', customer: 'Duc P.', items: ['Potassium Humate x1'], status: 'ready', time: '5 min ago', total: 4.50 },
  { id: '#1045', customer: 'Thu N.', items: ['Organic Microbial Fertilizer x2', 'Calcium Boron x2'], status: 'pending', time: 'Just now', total: 19.50 },
]

export const MOCK_BRANCHES = [
  { id: 'b1', name: 'Central Agency', address: '123 Main St', revenue: 48200, orders: 2140, rating: 4.8, staff: 12 },
  { id: 'b2', name: 'West Farm Hub', address: '456 Lake Ave', revenue: 39100, orders: 1820, rating: 4.7, staff: 10 },
  { id: 'b3', name: 'Logistics Hub', address: 'Terminal 2', revenue: 61500, orders: 3200, rating: 4.6, staff: 15 },
  { id: 'b4', name: 'Agri Training Hub', address: '789 Campus Rd', revenue: 35800, orders: 1650, rating: 4.9, staff: 9 },
]

export const MOCK_CATEGORIES = [
  { id: 'CAT-001', name: 'NPK Fertilizer', slug: 'npk-fertilizer', description: 'Balanced fertilizer lines for core crop nutrition', productCount: 24, status: 'Active', lastUpdated: '2024-03-01' },
  { id: 'CAT-002', name: 'Organic Fertilizer', slug: 'seasonal-teas', description: 'Organic fertilizer and microbial soil nutrition', productCount: 12, status: 'Active', lastUpdated: '2024-03-05' },
  { id: 'CAT-003', name: 'Soil Care', slug: 'soil-care-bakery', description: 'Soil amendments and mineral conditioners', productCount: 18, status: 'Active', lastUpdated: '2024-02-28' },
  { id: 'CAT-004', name: 'Farm Tools', slug: 'merchandise', description: 'Sprayers, measuring tools, and farm supplies', productCount: 35, status: 'Active', lastUpdated: '2024-03-08' },
  { id: 'CAT-005', name: 'Foliar Nutrients', slug: 'bottled-drinks', description: 'Foliar nutrients and liquid crop boosters', productCount: 8, status: 'Inactive', lastUpdated: '2024-01-15' },
];

// Giả lập dữ liệu khách hàng (Customer Data)
export const MOCK_CUSTOMERS = [
  { id: 'CUS-1024', name: 'Hoàng Anh Tuấn', email: 'tuan.ha@gmail.com', phone: '0901234567', tier: 'Platinum', points: 2450, totalSpent: 1250.50, status: 'Active', lastVisit: '2 hours ago', joinedDate: '2023-05-12' },
  { id: 'CUS-1025', name: 'Nguyễn Bích Phương', email: 'phuong.nb@outlook.com', phone: '0907654321', tier: 'Gold', points: 1200, totalSpent: 680.00, status: 'Active', lastVisit: 'Yesterday', joinedDate: '2023-08-20' },
  { id: 'CUS-1026', name: 'Trần Minh Tâm', email: 'tam.tm@yahoo.com', phone: '0988888888', tier: 'Silver', points: 450, totalSpent: 210.20, status: 'Active', lastVisit: '3 days ago', joinedDate: '2023-11-05' },
  { id: 'CUS-1027', name: 'Lê Thu Trang', email: 'trang.le@gmail.com', phone: '0912344321', tier: 'Bronze', points: 150, totalSpent: 45.00, status: 'Inactive', lastVisit: '2 weeks ago', joinedDate: '2024-01-15' },
  { id: 'CUS-1028', name: 'Phạm Thế Hiển', email: 'hien.pt@agrifert.vn', phone: '0933445566', tier: 'Gold', points: 980, totalSpent: 540.00, status: 'Active', lastVisit: 'Just now', joinedDate: '2023-12-01' },
];

export const MOCK_FRANCHISES = [
  { id: 'FR-001', name: 'AgriFert - District 1 Agency', manager: 'Nguyen Van A', email: 'vana@agrifert.vn', phone: '0901234567', revenue: 45200, status: 'Active', address: '123 Le Loi, Q.1, HCMC', joinedDate: '2023-10-12' },
  { id: 'FR-002', name: 'AgriFert - Landmark Agency', manager: 'Tran Thi B', email: 'thib@agrifert.vn', phone: '0907654321', revenue: 68000, status: 'Active', address: 'Vinhome Central Park, Q.Binh Thanh', joinedDate: '2023-11-05' },
  { id: 'FR-003', name: 'AgriFert - Thao Dien Agency', manager: 'Le Van C', email: 'vanc@agrifert.vn', phone: '0988888888', revenue: 31500, status: 'Pending', address: '45 Xuan Thuy, Q.2, HCMC', joinedDate: '2024-01-20' },
  { id: 'FR-004', name: 'AgriFert - Da Nang', manager: 'Hoang My', email: 'myh@agrifert.vn', phone: '0912344321', revenue: 0, status: 'Inactive', address: '102 Vo Nguyen Giap, Da Nang', joinedDate: '2024-02-15' },
  { id: 'FR-005', name: 'AgriFert - West Lake', manager: 'Pham Thanh', email: 'thanhp@agrifert.vn', phone: '0933445566', revenue: 28900, status: 'Active', address: 'Hanoi Creative City, Hai Ba Trung', joinedDate: '2023-12-01' },
];

// Mock data for Dashboard stats
export const statsCards = [
  { id: 1, label: 'Tổng doanh thu', value: '₫284,500,000', change: '+12.4%', up: true },
  { id: 2, label: 'Tổng đơn hàng', value: '12,840', change: '+8.2%', up: true },
  { id: 3, label: 'Số đại lý', value: '24', change: null },
];

export const revenueSummaryTable = [
  { id: 1, branch: 'Central Agency', revenue: '₫48,200,000', orders: 2140, growth: '+5.2%' },
  { id: 2, branch: 'West Farm Hub', revenue: '₫39,100,000', orders: 1820, growth: '+3.8%' },
  { id: 3, branch: 'Logistics Hub', revenue: '₫61,500,000', orders: 3200, growth: '+7.1%' },
  { id: 4, branch: 'Agri Training Hub', revenue: '₫35,800,000', orders: 1650, growth: '+2.4%' },
];

export const topProducts = [
  { id: 1, name: 'NPK 16-16-8', price: '₫350,000', sold: 1200 },
  { id: 2, name: 'Phân hữu cơ vi sinh', price: '₫420,000', sold: 950 },
  { id: 3, name: 'Kali Sunphat', price: '₫550,000', sold: 870 },
];

export const loyalCustomers = [
  { id: 1, name: 'Nguyễn Văn Nam', initial: 'N', orders: 120, rank: 'Gold' },
  { id: 2, name: 'Trần Thị Thu', initial: 'T', orders: 98, rank: 'Silver' },
  { id: 3, name: 'Lê Minh Long', initial: 'L', orders: 85, rank: 'Bronze' },
];

// Mock data for RevenueChart.jsx
export const revenueChartData = [
  { name: 'Central Agency', revenue: 48, orders: 2140 },
  { name: 'West Farm Hub', revenue: 39, orders: 1820 },
  { name: 'Logistics Hub', revenue: 61, orders: 3200 },
  { name: 'Agri Training Hub', revenue: 35, orders: 1650 },
];

export const MOCK_INVENTORY = [
  { id: 'INV-001', name: 'NPK Liquid Booster', sku: 'SR-CM-01', branch: 'District 1 Agency', quantity: 45, unit: 'Bottles', reorderLevel: 20, status: 'In Stock' },
  { id: 'INV-002', name: 'Urea Granules', sku: 'BN-VR-02', branch: 'Đại lý Quận 1', quantity: 12, unit: 'Kg', reorderLevel: 15, status: 'Sắp hết' },
  { id: 'INV-003', name: 'Seedling Trays', sku: 'ACC-PC-12', branch: 'Landmark Agency', quantity: 1200, unit: 'Pieces', reorderLevel: 500, status: 'In Stock' },
  { id: 'INV-004', name: 'Bio Compost', sku: 'DR-WM-04', branch: 'Thao Dien Agency', quantity: 0, unit: 'Cartons', reorderLevel: 10, status: 'Out of Stock' },
  { id: 'INV-005', name: 'Fertilizer Bags', sku: 'ACC-CF-05', branch: 'Đại lý Quận 1', quantity: 8, unit: 'Bao', reorderLevel: 10, status: 'Sắp hết' },
  { id: 'INV-006', name: 'Premium Potash', sku: 'BN-AP-06', branch: 'Landmark Agency', quantity: 30, unit: 'Kg', reorderLevel: 10, status: 'In Stock' },
];

export const BRANCHES = ['Tất cả đại lý', 'Đại lý Quận 1', 'Đại lý Landmark', 'Đại lý Thảo Điền', 'Văn phòng chính'];

export const CATEGORIES = ['NPK Fertilizer', 'Organic Fertilizer', 'Soil Care', 'Farm Tools', 'Foliar Nutrients'];

export const PROMO_CODES = [
  { code: "", label: "No Promo Code", discount: 0 },
  { code: "SAVE10", label: "SAVE10 - 10% Off", discount: 10 },
  { code: "SAVE20", label: "SAVE20 - 20% Off", discount: 20 },
  { code: "WELCOME", label: "WELCOME - 15% Off", discount: 15 },
  { code: "VIP50", label: "VIP50 - 50% Off", discount: 50 },
];

export const INITIAL_PERMISSIONS = [
  { id: 'p1', name: 'Dashboard View', code: 'view_dashboard', category: 'General' },
  { id: 'p2', name: 'Manage Users', code: 'manage_users', category: 'Identity' },
  { id: 'p3', name: 'Manage Roles', code: 'manage_roles', category: 'Identity' },
  { id: 'p4', name: 'Quản lý đại lý', code: 'manage_franchises', category: 'Operations' },
  { id: 'p5', name: 'View Revenue', code: 'view_revenue', category: 'Financials' },
  { id: 'p6', name: 'Process Orders', code: 'process_orders', category: 'Sales' },
  { id: 'p7', name: 'Manage Inventory', code: 'manage_inventory', category: 'Operations' },
];

// Giả lập dữ liệu Roles và quan hệ Permission

export const INITIAL_ROLES = [
  { id: 'r1', name: 'Super Admin', description: 'Full system access', permissions: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'] },
  { id: 'r2', name: 'Manager', description: 'Quản lý cấp đại lý', permissions: ['p1', 'p4', 'p6', 'p7'] },
  { id: 'r3', name: 'Staff', description: 'Counter operations', permissions: ['p1', 'p6'] },
  { id: 'r4', name: 'Auditor', description: 'Read-only financial access', permissions: ['p1', 'p5'] },
];

export const MOCK_USERS_01 = [
  { id: 'USR-001', name: 'Le Hoang Nam', email: 'nam.le@agrifert.vn', role: 'Admin', branch: 'Head Office', status: 'Active', phone: '0901234567', lastActive: '2 mins ago', joinedDate: '2023-01-15', address: 'Q.7, TP. HCM' },
  { id: 'USR-002', name: 'Nguyen Minh Thu', email: 'thu.nguyen@agrifert.vn', role: 'Manager', branch: 'District 1 Agency', status: 'Active', phone: '0907654321', lastActive: '1 hour ago', joinedDate: '2023-05-20', address: 'Q.1, TP. HCM' },
  { id: 'USR-003', name: 'David Pham', email: 'david.p@agrifert.vn', role: 'Staff', branch: 'Landmark Agency', status: 'Active', phone: '0988888888', lastActive: 'Yesterday', joinedDate: '2023-11-10', address: 'Q. Binh Thanh, TP. HCM' },
  { id: 'USR-004', name: 'Tran Thanh Tam', email: 'tam.tran@agrifert.vn', role: 'Manager', branch: 'Thao Dien Agency', status: 'Suspended', phone: '0912344321', lastActive: '3 days ago', joinedDate: '2023-03-05', address: 'Q.2, TP. HCM' },
  { id: 'USR-005', name: 'Vu Minh Anh', email: 'anh.vu@agrifert.vn', role: 'Staff', branch: 'District 1 Agency', status: 'Active', phone: '0933445566', lastActive: 'Just now', joinedDate: '2024-02-01', address: 'Q.3, TP. HCM' },
];

// Giả lập dữ liệu danh mục của một đại lý
export const MOCK_BRANCH_CATEGORIES = [
  { id: 'C-01', name: 'NPK Fertilizer', slug: 'npk-fertilizer', itemCount: 12, status: 'Active', description: 'Phan bon đặc sản với công thức pha chế riêng biệt.' },
  { id: 'C-02', name: 'Liquid Humate', slug: 'cold-brew', itemCount: 5, status: 'Active', description: 'Phan bon ủ lạnh trong 24 giờ cho hương vị mượt mà.' },
  { id: 'C-03', name: 'Foliar Nutrients', slug: 'fruit-tea', itemCount: 8, status: 'Active', description: 'Trà trái cây tươi mát từ nguyên liệu tự nhiên.' },
  { id: 'C-04', name: 'Soil Care', slug: 'soil-care', itemCount: 6, status: 'Active', description: 'Vat tu nướng tươi mỗi ngày tại dai ly.' },
  { id: 'C-05', name: 'Farm Tools', slug: 'merchandise', itemCount: 3, status: 'Inactive', description: 'Dụng cụ pha chế và bình giữ nhiệt thương hiệu.' },
];
const BASE_URL = "https://provinces.open-api.vn/api"

const MOCK_PROVINCES_LOCAL = [
  {
    code: 79,
    name: "Thanh pho Ho Chi Minh",
    districts: [
      {
        code: 760,
        name: "Quan 7",
        wards: [
          { code: 26734, name: "Phuong Tan Phong" },
          { code: 26737, name: "Phuong Tan Phu" },
        ],
      },
      {
        code: 785,
        name: "Huyen Nha Be",
        wards: [
          { code: 27601, name: "Xa Phuoc Kien" },
          { code: 27604, name: "Xa Phuoc Loc" },
        ],
      },
    ],
  },
  {
    code: 48,
    name: "Thanh pho Da Nang",
    districts: [
      {
        code: 490,
        name: "Quan Hai Chau",
        wards: [
          { code: 20194, name: "Phuong Hai Chau I" },
          { code: 20195, name: "Phuong Hai Chau II" },
        ],
      },
    ],
  },
]

export const getProvinces = async () => {
  if (USE_MOCK_API) {
    return MOCK_PROVINCES_LOCAL.map(({ districts, ...province }) => province)
  }

  const res = await fetch(`${BASE_URL}/p/`)
  return res.json()
}

export const getDistricts = async (provinceCode) => {
  if (USE_MOCK_API) {
    return (
      MOCK_PROVINCES_LOCAL.find((province) => String(province.code) === String(provinceCode))
        ?.districts || []
    ).map(({ wards, ...district }) => district)
  }

  const res = await fetch(`${BASE_URL}/p/${provinceCode}?depth=2`)
  const data = await res.json()
  return data.districts
}

export const getWards = async (districtCode) => {
  if (USE_MOCK_API) {
    return (
      MOCK_PROVINCES_LOCAL.flatMap((province) => province.districts).find(
        (district) => String(district.code) === String(districtCode)
      )?.wards || []
    )
  }

  const res = await fetch(`${BASE_URL}/d/${districtCode}?depth=2`)
  const data = await res.json()
  return data.wards
}
