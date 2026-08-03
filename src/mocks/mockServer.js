export const MOCK_TOKEN_PREFIX = "mock-token";

const MAIN_WAREHOUSE_ID = "00000000-0000-0000-0000-000000000000";
const DEFAULT_IMAGE = "/agri-logo.svg";

const nowIso = () => new Date().toISOString();
const clone = (value) => JSON.parse(JSON.stringify(value));

const roleSeeds = [
  {
    id: "role-admin",
    name: "ADMIN",
    description: "Full system administration",
  },
  {
    id: "role-manager",
    name: "MANAGER",
    description: "Operations manager",
  },
  {
    id: "role-store-manager",
    name: "STORE_MANAGER",
    description: "Agency manager",
  },
  {
    id: "role-staff",
    name: "STAFF",
    description: "Agency staff",
  },
  {
    id: "role-customer",
    name: "CUSTOMER",
    description: "Customer account",
  },
];

let mockPermissions = [
  {
    id: "perm-dashboard-view",
    name: "Dashboard View",
    code: "DASHBOARD_VIEW",
    module: "Dashboard",
    apiPath: "/reports/dashboard",
    httpMethod: "GET",
    description: "View dashboard reports",
  },
  {
    id: "perm-users-manage",
    name: "Manage Users",
    code: "USERS_MANAGE",
    module: "Identity",
    apiPath: "/auth/users/**",
    httpMethod: "ALL",
    description: "Create, update and deactivate users",
  },
  {
    id: "perm-products-manage",
    name: "Manage Products",
    code: "PRODUCTS_MANAGE",
    module: "Catalog",
    apiPath: "/products/**",
    httpMethod: "ALL",
    description: "Manage fertilizer products and variants",
  },
  {
    id: "perm-orders-manage",
    name: "Manage Orders",
    code: "ORDERS_MANAGE",
    module: "Orders",
    apiPath: "/orders/**",
    httpMethod: "ALL",
    description: "Process POS and online orders",
  },
  {
    id: "perm-inventory-manage",
    name: "Manage Inventory",
    code: "INVENTORY_MANAGE",
    module: "Inventory",
    apiPath: "/inventory/**",
    httpMethod: "ALL",
    description: "Manage stock, transfers and restock requests",
  },
];

let mockRoles = roleSeeds.map((role) => ({
  ...role,
  permissions:
    role.name === "ADMIN" || role.name === "MANAGER"
      ? mockPermissions
      : mockPermissions.filter((permission) =>
          ["DASHBOARD_VIEW", "ORDERS_MANAGE", "INVENTORY_MANAGE"].includes(
            permission.code
          )
        ),
}));

let mockCategories = [
  {
    id: "cat-npk",
    name: "NPK Fertilizer",
    slug: "npk-fertilizer",
    description: "Balanced NPK blends for rice, vegetables and fruit crops",
    status: "ACTIVE",
    createdAt: "2026-01-04T08:30:00.000Z",
    updatedAt: "2026-07-18T10:20:00.000Z",
  },
  {
    id: "cat-organic",
    name: "Organic Fertilizer",
    slug: "organic-fertilizer",
    description: "Microbial, compost and humic products for soil health",
    status: "ACTIVE",
    createdAt: "2026-01-04T08:40:00.000Z",
    updatedAt: "2026-07-12T09:12:00.000Z",
  },
  {
    id: "cat-foliar",
    name: "Foliar Nutrients",
    slug: "foliar-nutrients",
    description: "Liquid fertilizers for quick leaf absorption",
    status: "ACTIVE",
    createdAt: "2026-02-10T07:25:00.000Z",
    updatedAt: "2026-07-22T08:45:00.000Z",
  },
  {
    id: "cat-soil",
    name: "Soil Care",
    slug: "soil-care",
    description: "Lime, dolomite and conditioners for pH and structure",
    status: "ACTIVE",
    createdAt: "2026-02-14T07:25:00.000Z",
    updatedAt: "2026-07-25T11:45:00.000Z",
  },
  {
    id: "cat-tools",
    name: "Farm Tools",
    slug: "farm-tools",
    description: "Sprayers, test kits and small farm supplies",
    status: "INACTIVE",
    createdAt: "2026-03-01T07:25:00.000Z",
    updatedAt: "2026-06-18T11:45:00.000Z",
  },
];

const categoryById = (id) => mockCategories.find((category) => category.id === id);

let mockProducts = [
  {
    id: "prd-npk-2015",
    name: "NPK 20-20-15 TE",
    description:
      "Balanced NPK with trace elements for vegetables, rice and fruit trees.",
    descriptionEn:
      "Balanced NPK with trace elements for vegetables, rice and fruit trees.",
    brand: "AgriFert",
    status: "ACTIVE",
    category: categoryById("cat-npk"),
    categoryId: "cat-npk",
    price: 320000,
    imageUrl: DEFAULT_IMAGE,
    image: DEFAULT_IMAGE,
    createdAt: "2026-06-01T08:00:00.000Z",
    updatedAt: "2026-07-28T08:00:00.000Z",
    variants: [
      {
        id: "var-npk-2015-25kg",
        productVariantId: "var-npk-2015-25kg",
        sku: "AGF-NPK2015-25",
        variantName: "Bag 25kg",
        packageSize: 25,
        packageUnit: "kg",
        size: "25kg",
        color: "Green bag",
        price: 320000,
        sellingPrice: 320000,
        salePrice: 299000,
        quantity: 420,
        stockQuantity: 420,
        status: "ACTIVE",
        imageUrl: DEFAULT_IMAGE,
        images: { image01: DEFAULT_IMAGE },
      },
      {
        id: "var-npk-2015-50kg",
        productVariantId: "var-npk-2015-50kg",
        sku: "AGF-NPK2015-50",
        variantName: "Bag 50kg",
        packageSize: 50,
        packageUnit: "kg",
        size: "50kg",
        color: "Green bag",
        price: 610000,
        sellingPrice: 610000,
        salePrice: 585000,
        quantity: 260,
        stockQuantity: 260,
        status: "ACTIVE",
        imageUrl: DEFAULT_IMAGE,
        images: { image01: DEFAULT_IMAGE },
      },
    ],
  },
  {
    id: "prd-dap-1846",
    name: "DAP 18-46-0",
    description:
      "High phosphate fertilizer for root development and flowering stages.",
    descriptionEn:
      "High phosphate fertilizer for root development and flowering stages.",
    brand: "AgriFert Pro",
    status: "ACTIVE",
    category: categoryById("cat-npk"),
    categoryId: "cat-npk",
    price: 540000,
    imageUrl: DEFAULT_IMAGE,
    image: DEFAULT_IMAGE,
    createdAt: "2026-05-18T08:00:00.000Z",
    updatedAt: "2026-07-20T08:00:00.000Z",
    variants: [
      {
        id: "var-dap-1846-50kg",
        productVariantId: "var-dap-1846-50kg",
        sku: "AGF-DAP1846-50",
        variantName: "Bag 50kg",
        packageSize: 50,
        packageUnit: "kg",
        size: "50kg",
        color: "Blue bag",
        price: 540000,
        sellingPrice: 540000,
        salePrice: 525000,
        quantity: 180,
        stockQuantity: 180,
        status: "ACTIVE",
        imageUrl: DEFAULT_IMAGE,
        images: { image01: DEFAULT_IMAGE },
      },
    ],
  },
  {
    id: "prd-organic-micro",
    name: "Organic Microbial Fertilizer",
    description:
      "Microbial compost fertilizer to improve soil biology and nutrient uptake.",
    descriptionEn:
      "Microbial compost fertilizer to improve soil biology and nutrient uptake.",
    brand: "AgriBio",
    status: "ACTIVE",
    category: categoryById("cat-organic"),
    categoryId: "cat-organic",
    price: 185000,
    imageUrl: DEFAULT_IMAGE,
    image: DEFAULT_IMAGE,
    createdAt: "2026-04-24T08:00:00.000Z",
    updatedAt: "2026-07-25T08:00:00.000Z",
    variants: [
      {
        id: "var-organic-micro-20kg",
        productVariantId: "var-organic-micro-20kg",
        sku: "AGB-MICRO-20",
        variantName: "Bag 20kg",
        packageSize: 20,
        packageUnit: "kg",
        size: "20kg",
        color: "Brown bag",
        price: 185000,
        sellingPrice: 185000,
        salePrice: 175000,
        quantity: 560,
        stockQuantity: 560,
        status: "ACTIVE",
        imageUrl: DEFAULT_IMAGE,
        images: { image01: DEFAULT_IMAGE },
      },
    ],
  },
  {
    id: "prd-humic-acid",
    name: "Humic Acid Soil Booster",
    description:
      "Humic granules for better soil structure and more efficient nutrients.",
    descriptionEn:
      "Humic granules for better soil structure and more efficient nutrients.",
    brand: "AgriBio",
    status: "ACTIVE",
    category: categoryById("cat-organic"),
    categoryId: "cat-organic",
    price: 230000,
    imageUrl: DEFAULT_IMAGE,
    image: DEFAULT_IMAGE,
    createdAt: "2026-04-08T08:00:00.000Z",
    updatedAt: "2026-07-16T08:00:00.000Z",
    variants: [
      {
        id: "var-humic-10kg",
        productVariantId: "var-humic-10kg",
        sku: "AGB-HUMIC-10",
        variantName: "Bag 10kg",
        packageSize: 10,
        packageUnit: "kg",
        size: "10kg",
        color: "Black bag",
        price: 230000,
        sellingPrice: 230000,
        salePrice: 215000,
        quantity: 340,
        stockQuantity: 340,
        status: "ACTIVE",
        imageUrl: DEFAULT_IMAGE,
        images: { image01: DEFAULT_IMAGE },
      },
    ],
  },
  {
    id: "prd-foliar-amino",
    name: "Amino Foliar Fertilizer",
    description:
      "Amino acid liquid fertilizer for quick recovery after stress.",
    descriptionEn:
      "Amino acid liquid fertilizer for quick recovery after stress.",
    brand: "LeafMax",
    status: "ACTIVE",
    category: categoryById("cat-foliar"),
    categoryId: "cat-foliar",
    price: 145000,
    imageUrl: DEFAULT_IMAGE,
    image: DEFAULT_IMAGE,
    createdAt: "2026-03-12T08:00:00.000Z",
    updatedAt: "2026-07-19T08:00:00.000Z",
    variants: [
      {
        id: "var-amino-1l",
        productVariantId: "var-amino-1l",
        sku: "LFM-AMINO-1L",
        variantName: "Bottle 1L",
        packageSize: 1,
        packageUnit: "L",
        size: "1L",
        color: "Bottle",
        price: 145000,
        sellingPrice: 145000,
        salePrice: 135000,
        quantity: 220,
        stockQuantity: 220,
        status: "ACTIVE",
        imageUrl: DEFAULT_IMAGE,
        images: { image01: DEFAULT_IMAGE },
      },
    ],
  },
  {
    id: "prd-calcium-boron",
    name: "Calcium Boron Foliar Pack",
    description:
      "Calcium and boron supplement to reduce cracking and improve fruit set.",
    descriptionEn:
      "Calcium and boron supplement to reduce cracking and improve fruit set.",
    brand: "LeafMax",
    status: "ACTIVE",
    category: categoryById("cat-foliar"),
    categoryId: "cat-foliar",
    price: 168000,
    imageUrl: DEFAULT_IMAGE,
    image: DEFAULT_IMAGE,
    createdAt: "2026-02-22T08:00:00.000Z",
    updatedAt: "2026-07-24T08:00:00.000Z",
    variants: [
      {
        id: "var-ca-bo-500ml",
        productVariantId: "var-ca-bo-500ml",
        sku: "LFM-CABO-500",
        variantName: "Bottle 500ml",
        packageSize: 500,
        packageUnit: "ml",
        size: "500ml",
        color: "Bottle",
        price: 168000,
        sellingPrice: 168000,
        salePrice: 158000,
        quantity: 148,
        stockQuantity: 148,
        status: "ACTIVE",
        imageUrl: DEFAULT_IMAGE,
        images: { image01: DEFAULT_IMAGE },
      },
    ],
  },
  {
    id: "prd-dolomite",
    name: "Dolomite Soil Conditioner",
    description:
      "Mineral amendment for balancing soil pH and supplying Ca-Mg.",
    descriptionEn:
      "Mineral amendment for balancing soil pH and supplying Ca-Mg.",
    brand: "SoilCare",
    status: "ACTIVE",
    category: categoryById("cat-soil"),
    categoryId: "cat-soil",
    price: 90000,
    imageUrl: DEFAULT_IMAGE,
    image: DEFAULT_IMAGE,
    createdAt: "2026-01-20T08:00:00.000Z",
    updatedAt: "2026-07-14T08:00:00.000Z",
    variants: [
      {
        id: "var-dolomite-25kg",
        productVariantId: "var-dolomite-25kg",
        sku: "SLC-DOLO-25",
        variantName: "Bag 25kg",
        packageSize: 25,
        packageUnit: "kg",
        size: "25kg",
        color: "White bag",
        price: 90000,
        sellingPrice: 90000,
        salePrice: 85000,
        quantity: 720,
        stockQuantity: 720,
        status: "ACTIVE",
        imageUrl: DEFAULT_IMAGE,
        images: { image01: DEFAULT_IMAGE },
      },
    ],
  },
];

let mockFranchises = [
  {
    id: "fr-hcm-01",
    name: "AgriFert - Dai ly Quan 7",
    franchiseName: "AgriFert - Dai ly Quan 7",
    code: "AGF-Q7",
    address: "12 Nguyen Thi Thap, Quan 7, TP.HCM",
    phone: "0901234567",
    email: "quan7@agrifert.vn",
    manager: "Tran Minh Khang",
    managerName: "Tran Minh Khang",
    status: "ACTIVE",
    revenue: 685000000,
    joinedDate: "2026-01-15",
    openedAt: "2026-01-15T08:00:00.000Z",
    createdAt: "2026-01-15T08:00:00.000Z",
    googleMapsUrl: "https://maps.google.com/?q=10.735,106.721",
    at: "10.735,106.721",
  },
  {
    id: "fr-dn-01",
    name: "AgriFert - Dai ly Da Nang",
    franchiseName: "AgriFert - Dai ly Da Nang",
    code: "AGF-DN",
    address: "88 Nguyen Huu Tho, Hai Chau, Da Nang",
    phone: "0907654321",
    email: "danang@agrifert.vn",
    manager: "Le Hoang Vy",
    managerName: "Le Hoang Vy",
    status: "ACTIVE",
    revenue: 412000000,
    joinedDate: "2026-02-10",
    openedAt: "2026-02-10T08:00:00.000Z",
    createdAt: "2026-02-10T08:00:00.000Z",
    googleMapsUrl: "https://maps.google.com/?q=16.054,108.202",
    at: "16.054,108.202",
  },
  {
    id: "fr-ct-01",
    name: "AgriFert - Dai ly Can Tho",
    franchiseName: "AgriFert - Dai ly Can Tho",
    code: "AGF-CT",
    address: "51 Nguyen Van Cu, Ninh Kieu, Can Tho",
    phone: "0912344321",
    email: "cantho@agrifert.vn",
    manager: "Pham Quoc Bao",
    managerName: "Pham Quoc Bao",
    status: "NEW",
    revenue: 128000000,
    joinedDate: "2026-07-01",
    openedAt: "2026-07-01T08:00:00.000Z",
    createdAt: "2026-07-01T08:00:00.000Z",
    googleMapsUrl: "https://maps.google.com/?q=10.045,105.746",
    at: "10.045,105.746",
  },
  {
    id: "fr-hn-01",
    name: "AgriFert - Dai ly Ha Noi",
    franchiseName: "AgriFert - Dai ly Ha Noi",
    code: "AGF-HN",
    address: "20 Nguyen Trai, Thanh Xuan, Ha Noi",
    phone: "0988888888",
    email: "hanoi@agrifert.vn",
    manager: "Nguyen Thanh Son",
    managerName: "Nguyen Thanh Son",
    status: "INACTIVE",
    revenue: 96000000,
    joinedDate: "2026-03-18",
    openedAt: "2026-03-18T08:00:00.000Z",
    createdAt: "2026-03-18T08:00:00.000Z",
    googleMapsUrl: "https://maps.google.com/?q=21.002,105.807",
    at: "21.002,105.807",
  },
];

const franchiseById = (id) => mockFranchises.find((franchise) => franchise.id === id);
const roleByName = (roleName) =>
  mockRoles.find((role) => role.name === String(roleName || "").toUpperCase()) ||
  mockRoles.find((role) => role.name === "CUSTOMER");

const withRole = (roleName) => {
  const role = roleByName(roleName);
  return {
    id: role.id,
    name: role.name,
    description: role.description,
  };
};

let mockUsers = [
  {
    id: "user-admin-01",
    username: "admin",
    fullName: "AgriFert Admin",
    email: "admin@agrifert.vn",
    password: "123456",
    phone: "0901000001",
    gender: true,
    status: "ACTIVE",
    verifyEmail: true,
    avatarUrl: "",
    role: withRole("ADMIN"),
    franchise: null,
    createdAt: "2026-01-01T08:00:00.000Z",
    lastLogin: nowIso(),
  },
  {
    id: "user-manager-01",
    username: "manager",
    fullName: "Nguyen Hoang Manager",
    email: "manager@agrifert.vn",
    password: "123456",
    phone: "0901000002",
    gender: true,
    status: "ACTIVE",
    verifyEmail: true,
    avatarUrl: "",
    role: withRole("MANAGER"),
    franchise: null,
    createdAt: "2026-01-02T08:00:00.000Z",
    lastLogin: nowIso(),
  },
  {
    id: "user-store-01",
    username: "store",
    fullName: "Tran Minh Store Manager",
    email: "store@agrifert.vn",
    password: "123456",
    phone: "0901000003",
    gender: true,
    status: "ACTIVE",
    verifyEmail: true,
    avatarUrl: "",
    role: withRole("STORE_MANAGER"),
    franchise: franchiseById("fr-hcm-01"),
    createdAt: "2026-01-03T08:00:00.000Z",
    lastLogin: nowIso(),
  },
  {
    id: "user-staff-01",
    username: "staff",
    fullName: "Le Thu Staff",
    email: "staff@agrifert.vn",
    password: "123456",
    phone: "0901000004",
    gender: false,
    status: "ACTIVE",
    verifyEmail: true,
    avatarUrl: "",
    role: withRole("STAFF"),
    franchise: franchiseById("fr-hcm-01"),
    createdAt: "2026-01-04T08:00:00.000Z",
    lastLogin: nowIso(),
  },
  {
    id: "user-customer-01",
    username: "customer",
    fullName: "Pham Ngoc Customer",
    email: "customer@agrifert.vn",
    password: "123456",
    phone: "0901000005",
    gender: false,
    status: "ACTIVE",
    verifyEmail: true,
    avatarUrl: "",
    role: withRole("CUSTOMER"),
    franchise: null,
    createdAt: "2026-01-05T08:00:00.000Z",
    lastLogin: nowIso(),
  },
  {
    id: "user-customer-02",
    username: "farmernam",
    fullName: "Nguyen Van Nam",
    email: "nam.farm@example.com",
    password: "123456",
    phone: "0911222333",
    gender: true,
    status: "ACTIVE",
    verifyEmail: true,
    avatarUrl: "",
    role: withRole("CUSTOMER"),
    franchise: null,
    createdAt: "2026-03-10T08:00:00.000Z",
    lastLogin: "2026-08-03T09:00:00.000Z",
  },
  {
    id: "user-staff-02",
    username: "staff2",
    fullName: "Hoang My Staff",
    email: "staff2@agrifert.vn",
    password: "123456",
    phone: "0901000006",
    gender: false,
    status: "ACTIVE",
    verifyEmail: true,
    avatarUrl: "",
    role: withRole("STAFF"),
    franchise: franchiseById("fr-dn-01"),
    createdAt: "2026-02-20T08:00:00.000Z",
    lastLogin: "2026-08-02T09:00:00.000Z",
  },
];

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return clone(safeUser);
};

export const mockTestAccounts = [
  {
    email: "admin@agrifert.vn",
    password: "123456",
    role: "ADMIN",
    note: "Quan tri he thong",
  },
  {
    email: "manager@agrifert.vn",
    password: "123456",
    role: "MANAGER",
    note: "Quan ly tong",
  },
  {
    email: "store@agrifert.vn",
    password: "123456",
    role: "STORE_MANAGER",
    note: "Quan ly dai ly Quan 7",
  },
  {
    email: "staff@agrifert.vn",
    password: "123456",
    role: "STAFF",
    note: "Nhan vien dai ly Quan 7",
  },
  {
    email: "customer@agrifert.vn",
    password: "123456",
    role: "CUSTOMER",
    note: "Tai khoan khach hang",
  },
];

export const createMockToken = (userId) => `${MOCK_TOKEN_PREFIX}:${userId}`;

const userIdFromToken = (token) => {
  if (!token || !String(token).startsWith(`${MOCK_TOKEN_PREFIX}:`)) return null;
  return String(token).split(":")[1] || null;
};

const getHeaderValue = (headers, name) => {
  if (!headers) return null;
  return (
    headers[name] ||
    headers[name.toLowerCase()] ||
    headers[name.toUpperCase()] ||
    headers.get?.(name) ||
    headers.get?.(name.toLowerCase()) ||
    null
  );
};

const getAuthTokenFromConfig = (config) => {
  const authorization = getHeaderValue(config?.headers, "Authorization");
  if (!authorization) return null;
  return String(authorization).replace(/^Bearer\s+/i, "");
};

export const getMockUserFromToken = (token) => {
  const userId = userIdFromToken(token);
  const user = userId ? mockUsers.find((item) => item.id === userId) : null;
  return sanitizeUser(user || mockUsers.find((item) => item.email === "customer@agrifert.vn"));
};

const getCurrentUser = (config) => {
  return getMockUserFromToken(getAuthTokenFromConfig(config));
};

export const findMockAccountByEmail = (email, password) => {
  const account = mockUsers.find(
    (user) => user.email.toLowerCase() === String(email || "").toLowerCase()
  );

  if (!account || account.password !== password) {
    return null;
  }

  account.lastLogin = nowIso();
  return sanitizeUser(account);
};

export const registerMockCustomer = ({
  email,
  password = "123456",
  fullName,
  phone = "",
  gender = false,
  avatarUrl = "",
}) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const existing = mockUsers.find((user) => user.email.toLowerCase() === normalizedEmail);

  if (existing) {
    const error = new Error("Email already exists.");
    error.code = "auth/email-already-in-use";
    throw error;
  }

  const user = {
    id: `user-customer-${Date.now()}`,
    username: normalizedEmail.split("@")[0],
    fullName: fullName || normalizedEmail.split("@")[0] || "Mock Customer",
    email: normalizedEmail,
    password,
    phone,
    gender,
    status: "ACTIVE",
    verifyEmail: true,
    avatarUrl,
    role: withRole("CUSTOMER"),
    franchise: null,
    createdAt: nowIso(),
    lastLogin: nowIso(),
  };

  mockUsers = [user, ...mockUsers];
  ensureCustomerFranchise(user.id, "fr-hcm-01", "ONLINE");

  return sanitizeUser(user);
};

let mockCustomerFranchises = [
  {
    id: "cf-001",
    user: mockUsers.find((user) => user.id === "user-customer-01"),
    franchise: franchiseById("fr-hcm-01"),
    type: "ONLINE",
    status: "ACTIVE",
    firstOrderAt: "2026-05-02T09:30:00.000Z",
    lastOrderAt: "2026-08-03T10:12:00.000Z",
    createdAt: "2026-05-02T09:30:00.000Z",
    updatedAt: "2026-08-03T10:12:00.000Z",
  },
  {
    id: "cf-002",
    user: mockUsers.find((user) => user.id === "user-customer-02"),
    franchise: franchiseById("fr-hcm-01"),
    type: "REGISTERED",
    status: "ACTIVE",
    firstOrderAt: "2026-06-15T09:30:00.000Z",
    lastOrderAt: "2026-08-01T11:20:00.000Z",
    createdAt: "2026-06-15T09:30:00.000Z",
    updatedAt: "2026-08-01T11:20:00.000Z",
  },
];

const ensureCustomerFranchise = (userId, franchiseId, type = "REGISTERED") => {
  let item = mockCustomerFranchises.find(
    (customer) => customer.user?.id === userId && customer.franchise?.id === franchiseId
  );

  if (item) return item;

  item = {
    id: `cf-${Date.now()}`,
    user: mockUsers.find((user) => user.id === userId),
    franchise: franchiseById(franchiseId),
    type,
    status: "ACTIVE",
    firstOrderAt: null,
    lastOrderAt: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  mockCustomerFranchises = [item, ...mockCustomerFranchises];
  return item;
};

const productVariantPairs = () =>
  mockProducts.flatMap((product) =>
    (product.variants || []).map((variant) => ({ product, variant }))
  );

let mockStocks = productVariantPairs().flatMap(({ product, variant }, index) => [
  {
    id: `stock-wh-${variant.id}`,
    productId: product.id,
    productVariantId: variant.id,
    productName: product.name,
    variantName: variant.variantName,
    sku: variant.sku,
    packageSize: variant.packageSize,
    packageUnit: variant.packageUnit,
    size: variant.size,
    color: variant.color,
    locationId: MAIN_WAREHOUSE_ID,
    locationName: "Kho tong AgriFert",
    locationType: "WAREHOUSE",
    quantity: Math.max(80, variant.quantity - 40),
    reservedQuantity: index % 2 === 0 ? 8 : 3,
    minStock: 40,
    updatedAt: nowIso(),
  },
  {
    id: `stock-q7-${variant.id}`,
    productId: product.id,
    productVariantId: variant.id,
    productName: product.name,
    variantName: variant.variantName,
    sku: variant.sku,
    packageSize: variant.packageSize,
    packageUnit: variant.packageUnit,
    size: variant.size,
    color: variant.color,
    locationId: "fr-hcm-01",
    locationName: "AgriFert - Dai ly Quan 7",
    locationType: "FRANCHISE",
    quantity: 25 + index * 7,
    reservedQuantity: index % 3,
    minStock: 12,
    updatedAt: nowIso(),
  },
  {
    id: `stock-dn-${variant.id}`,
    productId: product.id,
    productVariantId: variant.id,
    productName: product.name,
    variantName: variant.variantName,
    sku: variant.sku,
    packageSize: variant.packageSize,
    packageUnit: variant.packageUnit,
    size: variant.size,
    color: variant.color,
    locationId: "fr-dn-01",
    locationName: "AgriFert - Dai ly Da Nang",
    locationType: "FRANCHISE",
    quantity: 18 + index * 5,
    reservedQuantity: index % 2,
    minStock: 10,
    updatedAt: nowIso(),
  },
]);

let mockTransactions = [
  {
    id: "txn-001",
    type: "RECEIPT",
    productVariantId: "var-npk-2015-25kg",
    productName: "NPK 20-20-15 TE",
    variantName: "Bag 25kg",
    quantity: 120,
    locationId: MAIN_WAREHOUSE_ID,
    locationName: "Kho tong AgriFert",
    createdByName: "AgriFert Admin",
    createdAt: "2026-08-01T08:20:00.000Z",
    notes: "Nhap kho dau thang",
  },
  {
    id: "txn-002",
    type: "TRANSFER_OUT",
    productVariantId: "var-organic-micro-20kg",
    productName: "Organic Microbial Fertilizer",
    variantName: "Bag 20kg",
    quantity: 40,
    locationId: MAIN_WAREHOUSE_ID,
    locationName: "Kho tong AgriFert",
    createdByName: "Nguyen Hoang Manager",
    createdAt: "2026-08-02T10:10:00.000Z",
    notes: "Cap hang dai ly Quan 7",
  },
];

let mockTransfers = [
  {
    id: "trf-001",
    fromLocationId: MAIN_WAREHOUSE_ID,
    fromLocationName: "Kho tong AgriFert",
    toLocationId: "fr-hcm-01",
    toLocationName: "AgriFert - Dai ly Quan 7",
    type: "WAREHOUSE_TO_FRANCHISE",
    status: "PENDING",
    totalQuantity: 85,
    createdBy: "user-manager-01",
    createdByName: "Nguyen Hoang Manager",
    createdAt: "2026-08-03T09:15:00.000Z",
    notes: "Bo sung hang ban chay",
    items: [
      {
        productVariantId: "var-npk-2015-25kg",
        productName: "NPK 20-20-15 TE",
        variantName: "Bag 25kg",
        quantity: 50,
      },
      {
        productVariantId: "var-amino-1l",
        productName: "Amino Foliar Fertilizer",
        variantName: "Bottle 1L",
        quantity: 35,
      },
    ],
  },
  {
    id: "trf-002",
    fromLocationId: MAIN_WAREHOUSE_ID,
    fromLocationName: "Kho tong AgriFert",
    toLocationId: "fr-dn-01",
    toLocationName: "AgriFert - Dai ly Da Nang",
    type: "WAREHOUSE_TO_FRANCHISE",
    status: "SHIPPED",
    totalQuantity: 45,
    createdBy: "user-manager-01",
    createdByName: "Nguyen Hoang Manager",
    createdAt: "2026-08-02T09:15:00.000Z",
    notes: "Don hang dang van chuyen",
    items: [
      {
        productVariantId: "var-dap-1846-50kg",
        productName: "DAP 18-46-0",
        variantName: "Bag 50kg",
        quantity: 45,
      },
    ],
  },
];

let mockStockRequests = [
  {
    id: "req-001",
    franchiseId: "fr-hcm-01",
    franchiseName: "AgriFert - Dai ly Quan 7",
    status: "PENDING",
    createdBy: "user-store-01",
    createdByName: "Tran Minh Store Manager",
    approvedBy: null,
    totalAmount: 24400000,
    createdAt: "2026-08-03T07:10:00.000Z",
    updatedAt: "2026-08-03T07:10:00.000Z",
    notes: "Can them hang cho vu mua sau",
    items: [
      {
        productVariantId: "var-npk-2015-50kg",
        productName: "NPK 20-20-15 TE",
        variantName: "Bag 50kg",
        quantity: 30,
        price: 610000,
      },
      {
        productVariantId: "var-humic-10kg",
        productName: "Humic Acid Soil Booster",
        variantName: "Bag 10kg",
        quantity: 25,
        price: 230000,
      },
    ],
  },
  {
    id: "req-002",
    franchiseId: "fr-dn-01",
    franchiseName: "AgriFert - Dai ly Da Nang",
    status: "SHIPPED",
    createdBy: "user-staff-02",
    createdByName: "Hoang My Staff",
    approvedBy: "user-manager-01",
    totalAmount: 14500000,
    createdAt: "2026-08-01T07:10:00.000Z",
    updatedAt: "2026-08-02T09:10:00.000Z",
    notes: "Hang dang giao",
    items: [
      {
        productVariantId: "var-amino-1l",
        productName: "Amino Foliar Fertilizer",
        variantName: "Bottle 1L",
        quantity: 100,
        price: 145000,
      },
    ],
  },
];

const paymentMethods = [
  {
    id: "pay-cod",
    methodName: "COD",
    provider: "Thanh toan khi nhan hang",
    status: "ACTIVE",
  },
  {
    id: "pay-vnpay",
    methodName: "VNPAY",
    provider: "VNPAY Sandbox",
    status: "ACTIVE",
  },
  {
    id: "pay-momo",
    methodName: "MOMO",
    provider: "MoMo Sandbox",
    status: "ACTIVE",
  },
];

let mockOrders = [
  {
    id: "ord-1001",
    orderId: "ord-1001",
    orderCode: "AGF-1001",
    customerId: "user-customer-01",
    customerName: "Pham Ngoc Customer",
    customerPhone: "0901000005",
    staffId: "user-staff-01",
    staffName: "Le Thu Staff",
    franchiseId: "fr-hcm-01",
    franchiseName: "AgriFert - Dai ly Quan 7",
    paymentMethodId: "pay-cod",
    paymentMethodName: "COD",
    typeOrder: "Online",
    orderStatus: "WAITING_FOR_CONFIRMATION",
    status: "WAITING_FOR_CONFIRMATION",
    totalDue: 1135000,
    totalAmount: 1135000,
    priceShip: 30000,
    address: "Ap 2, Xa Phuoc Kien, Nha Be, TP.HCM",
    distance: 8.4,
    createAt: "2026-08-03T10:12:00.000Z",
    createdAt: "2026-08-03T10:12:00.000Z",
    orderDetails: [
      {
        productId: "prd-npk-2015",
        productVariantId: "var-npk-2015-25kg",
        productNameSnapshot: "NPK 20-20-15 TE",
        productImageUrl: DEFAULT_IMAGE,
        variantName: "Bag 25kg",
        packageSize: 25,
        packageUnit: "kg",
        quantity: 2,
        priceSnapshot: 299000,
        price: 299000,
      },
      {
        productId: "prd-calcium-boron",
        productVariantId: "var-ca-bo-500ml",
        productNameSnapshot: "Calcium Boron Foliar Pack",
        productImageUrl: DEFAULT_IMAGE,
        variantName: "Bottle 500ml",
        packageSize: 500,
        packageUnit: "ml",
        quantity: 3,
        priceSnapshot: 158000,
        price: 158000,
      },
    ],
  },
  {
    id: "ord-1002",
    orderId: "ord-1002",
    orderCode: "AGF-1002",
    customerId: "user-customer-02",
    customerName: "Nguyen Van Nam",
    customerPhone: "0911222333",
    staffId: "user-staff-01",
    staffName: "Le Thu Staff",
    franchiseId: "fr-hcm-01",
    franchiseName: "AgriFert - Dai ly Quan 7",
    paymentMethodId: "pay-cod",
    paymentMethodName: "COD",
    typeOrder: "POS",
    orderStatus: "COMPLETED",
    status: "COMPLETED",
    totalDue: 905000,
    totalAmount: 905000,
    priceShip: 0,
    address: null,
    distance: 0,
    createAt: "2026-08-02T14:22:00.000Z",
    createdAt: "2026-08-02T14:22:00.000Z",
    orderDetails: [
      {
        productId: "prd-dap-1846",
        productVariantId: "var-dap-1846-50kg",
        productNameSnapshot: "DAP 18-46-0",
        productImageUrl: DEFAULT_IMAGE,
        variantName: "Bag 50kg",
        packageSize: 50,
        packageUnit: "kg",
        quantity: 1,
        priceSnapshot: 525000,
        price: 525000,
      },
      {
        productId: "prd-organic-micro",
        productVariantId: "var-organic-micro-20kg",
        productNameSnapshot: "Organic Microbial Fertilizer",
        productImageUrl: DEFAULT_IMAGE,
        variantName: "Bag 20kg",
        packageSize: 20,
        packageUnit: "kg",
        quantity: 2,
        priceSnapshot: 175000,
        price: 175000,
      },
    ],
  },
  {
    id: "ord-1003",
    orderId: "ord-1003",
    orderCode: "AGF-1003",
    customerId: "user-customer-01",
    customerName: "Pham Ngoc Customer",
    customerPhone: "0901000005",
    staffId: "user-staff-02",
    staffName: "Hoang My Staff",
    franchiseId: "fr-dn-01",
    franchiseName: "AgriFert - Dai ly Da Nang",
    paymentMethodId: "pay-vnpay",
    paymentMethodName: "VNPAY",
    typeOrder: "Online",
    orderStatus: "PREPARING",
    status: "PREPARING",
    totalDue: 465000,
    totalAmount: 465000,
    priceShip: 25000,
    address: "Thon An Hai, Ngu Hanh Son, Da Nang",
    distance: 6.2,
    createAt: "2026-08-01T15:30:00.000Z",
    createdAt: "2026-08-01T15:30:00.000Z",
    orderDetails: [
      {
        productId: "prd-humic-acid",
        productVariantId: "var-humic-10kg",
        productNameSnapshot: "Humic Acid Soil Booster",
        productImageUrl: DEFAULT_IMAGE,
        variantName: "Bag 10kg",
        packageSize: 10,
        packageUnit: "kg",
        quantity: 2,
        priceSnapshot: 215000,
        price: 215000,
      },
    ],
  },
];

let mockPromotions = [
  {
    id: "promo-season-01",
    name: "Mua vu moi - giam 10%",
    code: "AGRI10",
    description: "Discount for first crop-season fertilizer order.",
    discountType: "PERCENT",
    discountValue: 10,
    value: 10,
    minOrderValue: 500000,
    maxDiscountValue: 150000,
    startDate: "2026-08-01",
    endDate: "2026-09-30",
    status: "ACTIVE",
    rank: "BRONZE",
    quantity: 500,
    used: 34,
  },
  {
    id: "promo-loyal-gold",
    name: "Hoi vien Gold - giam 50k",
    code: "GOLD50",
    description: "Fixed discount for loyal farmers.",
    discountType: "FIXED",
    discountValue: 50000,
    value: 50000,
    minOrderValue: 800000,
    maxDiscountValue: 50000,
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    status: "ACTIVE",
    rank: "GOLD",
    quantity: 200,
    used: 18,
  },
  {
    id: "promo-old",
    name: "Chuong trinh cu",
    code: "OLDAGRI",
    description: "Inactive demo promotion.",
    discountType: "PERCENT",
    discountValue: 5,
    value: 5,
    minOrderValue: 200000,
    maxDiscountValue: 50000,
    startDate: "2026-04-01",
    endDate: "2026-05-01",
    status: "INACTIVE",
    rank: "SILVER",
    quantity: 100,
    used: 100,
  },
];

let mockCarts = {
  "user-customer-01": [
    {
      productId: "prd-npk-2015",
      variantId: "var-npk-2015-25kg",
      quantity: 1,
    },
  ],
};

let mockLoyaltyTiers = [
  {
    tierName: "BRONZE",
    requiredPoints: 0,
    benefit: "Base member",
  },
  {
    tierName: "SILVER",
    requiredPoints: 500,
    benefit: "Priority support",
  },
  {
    tierName: "GOLD",
    requiredPoints: 1500,
    benefit: "Seasonal vouchers",
  },
  {
    tierName: "PLATINUM",
    requiredPoints: 3000,
    benefit: "Best farmer partner tier",
  },
];

let mockWallets = {
  "user-customer-01": {
    userId: "user-customer-01",
    loyaltyTier: "GOLD",
    currentPoint: 1680,
    totalPoint: 4260,
    points: 1680,
  },
  "user-customer-02": {
    userId: "user-customer-02",
    loyaltyTier: "SILVER",
    currentPoint: 820,
    totalPoint: 1180,
    points: 820,
  },
};

let mockLoyaltyTransactions = [
  {
    id: "ltx-001",
    userId: "user-customer-01",
    orderId: "ord-1001",
    type: "EARN",
    point: 113,
    points: 113,
    description: "Earned points from order AGF-1001",
    createdAt: "2026-08-03T10:12:00.000Z",
    orderStatus: "WAITING_FOR_CONFIRMATION",
  },
  {
    id: "ltx-002",
    userId: "user-customer-02",
    orderId: "ord-1002",
    type: "EARN",
    point: 90,
    points: 90,
    description: "Earned points from POS order AGF-1002",
    createdAt: "2026-08-02T14:22:00.000Z",
    orderStatus: "COMPLETED",
  },
];

let mockShifts = [
  {
    id: "shift-morning",
    name: "Morning Shift",
    franchiseId: "fr-hcm-01",
    startTime: "07:30",
    endTime: "12:00",
    status: "ACTIVE",
    type: "MORNING",
  },
  {
    id: "shift-afternoon",
    name: "Afternoon Shift",
    franchiseId: "fr-hcm-01",
    startTime: "13:00",
    endTime: "17:30",
    status: "ACTIVE",
    type: "AFTERNOON",
  },
];

let mockShiftAssignments = [
  {
    id: "assign-001",
    assignmentId: "assign-001",
    shiftId: "shift-morning",
    shiftName: "Morning Shift",
    staffId: "user-staff-01",
    staffName: "Le Thu Staff",
    franchiseId: "fr-hcm-01",
    date: "2026-08-04",
    status: "CHECKED_IN",
    checkInTime: "2026-08-04T07:32:00.000Z",
    checkOutTime: null,
  },
];

const makePage = (items, params = {}) => {
  const pageNo = Number(params.page ?? params.pageNo ?? params.number ?? 0) || 0;
  const pageSize =
    Number(params.size ?? params.sizePage ?? params.pageSize ?? (items.length || 10)) ||
    10;
  const start = pageNo * pageSize;
  const content = items.slice(start, start + pageSize);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  return {
    content,
    items: content,
    pageNo,
    currentPage: pageNo,
    page: pageNo,
    number: pageNo,
    pageSize,
    size: pageSize,
    totalElements: items.length,
    totalItems: items.length,
    totalPages,
    last: pageNo >= totalPages - 1,
  };
};

const ok = (data, message = "OK", statusCode = 200) => ({
  statusCode,
  message,
  data,
});

const parseBody = (data) => {
  if (!data) return null;
  if (typeof FormData !== "undefined" && data instanceof FormData) return data;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
};

const normalizeRequest = (config) => {
  const rawUrl = config?.url || "/";
  const url = new URL(
    rawUrl.startsWith("http")
      ? rawUrl
      : `http://mock.local${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`
  );

  let path = url.pathname;
  if (path.startsWith("/api/")) path = path.slice(4);
  if (path === "/api") path = "/";

  const params = new URLSearchParams(url.search);

  if (config?.params) {
    Object.entries(config.params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, item));
      } else {
        params.set(key, value);
      }
    });
  }

  return {
    method: String(config?.method || "GET").toUpperCase(),
    path,
    params,
    body: parseBody(config?.data),
  };
};

const getParam = (params, key, fallback = null) => {
  const value = params.get(key);
  return value === null || value === undefined || value === "" ? fallback : value;
};

const getAllParams = (params, key) => params.getAll(key).filter(Boolean);

const matchesKeyword = (text, keyword) =>
  !keyword || String(text || "").toLowerCase().includes(String(keyword).toLowerCase());

const productListWithCounts = () =>
  mockProducts.map((product) => ({
    ...product,
    category: categoryById(product.categoryId) || product.category,
  }));

const categoryListWithCounts = () =>
  mockCategories.map((category) => ({
    ...category,
    productCount: mockProducts.filter(
      (product) => product.categoryId === category.id && product.status !== "DELETED"
    ).length,
    lastUpdated: category.updatedAt || category.createdAt,
  }));

const filterProducts = (params) => {
  const keyword = getParam(params, "keyword") || getParam(params, "text");
  const categoryName = getParam(params, "categoryName");
  const status = getParam(params, "status");
  const packageUnit = getParam(params, "packageUnit");
  const fromPrice = Number(getParam(params, "fromPrice", 0));
  const toPrice = Number(getParam(params, "toPrice", 0));

  return productListWithCounts().filter((product) => {
    const category = categoryById(product.categoryId);
    const variantPrices = (product.variants || []).map((variant) =>
      Number(variant.salePrice ?? variant.sellingPrice ?? variant.price ?? 0)
    );
    const minPrice = Math.min(...variantPrices, Number(product.price || 0));
    const hasPackageUnit =
      !packageUnit ||
      (product.variants || []).some(
        (variant) =>
          String(variant.packageUnit || "").toLowerCase() ===
          String(packageUnit).toLowerCase()
      );

    return (
      product.status !== "DELETED" &&
      matchesKeyword(`${product.name} ${product.description} ${product.brand}`, keyword) &&
      (!categoryName ||
        categoryName === "All" ||
        category?.name?.toLowerCase() === categoryName.toLowerCase()) &&
      (!status || product.status === status) &&
      hasPackageUnit &&
      (!fromPrice || minPrice >= fromPrice) &&
      (!toPrice || minPrice <= toPrice)
    );
  });
};

const getVariant = (variantId) => {
  for (const product of mockProducts) {
    const variant = product.variants?.find((item) => item.id === variantId);
    if (variant) return { product, variant };
  }
  return { product: null, variant: null };
};

const buildOrderDetailFromItem = (item) => {
  const variantId = item.variantId || item.productVariantId;
  const { product, variant } = getVariant(variantId);
  const quantity = Number(item.quantity || item.qty || 1);
  const price = Number(
    variant?.salePrice ?? variant?.sellingPrice ?? variant?.price ?? product?.price ?? 0
  );

  return {
    productId: product?.id || item.productId,
    productVariantId: variantId,
    variantId,
    productNameSnapshot: product?.name || item.productName || "Mock fertilizer",
    productImageUrl: variant?.imageUrl || product?.imageUrl || DEFAULT_IMAGE,
    variantName: variant?.variantName || item.variantName || "Default",
    packageSize: variant?.packageSize,
    packageUnit: variant?.packageUnit,
    size: variant?.size,
    color: variant?.color,
    quantity,
    priceSnapshot: price,
    price,
  };
};

const buildDashboard = (franchiseId = null) => {
  const scopedOrders = franchiseId
    ? mockOrders.filter((order) => order.franchiseId === franchiseId)
    : mockOrders;

  const totalRevenue = scopedOrders.reduce(
    (sum, order) =>
      order.orderStatus === "CANCELLED" ? sum : sum + Number(order.totalDue || 0),
    0
  );

  const orderStatusStats = scopedOrders.reduce((acc, order) => {
    const status = order.orderStatus || "CREATED";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const productStats = {};
  scopedOrders.forEach((order) => {
    (order.orderDetails || []).forEach((detail) => {
      const id = detail.productId || detail.productVariantId;
      if (!productStats[id]) {
        productStats[id] = {
          productId: id,
          productName: detail.productNameSnapshot,
          name: detail.productNameSnapshot,
          soldQuantity: 0,
          quantity: 0,
          revenue: 0,
        };
      }
      productStats[id].soldQuantity += Number(detail.quantity || 0);
      productStats[id].quantity += Number(detail.quantity || 0);
      productStats[id].revenue +=
        Number(detail.priceSnapshot || detail.price || 0) *
        Number(detail.quantity || 0);
    });
  });

  const customerStats = {};
  scopedOrders.forEach((order) => {
    const id = order.customerId || "walk-in";
    if (!customerStats[id]) {
      customerStats[id] = {
        customerId: id,
        customerName: order.customerName || "Walk-in customer",
        fullName: order.customerName || "Walk-in customer",
        totalOrders: 0,
        orderCount: 0,
        totalSpent: 0,
        loyaltyTier: mockWallets[id]?.loyaltyTier || "BRONZE",
      };
    }
    customerStats[id].totalOrders += 1;
    customerStats[id].orderCount += 1;
    customerStats[id].totalSpent += Number(order.totalDue || 0);
  });

  return {
    summary: {
      totalRevenue,
      totalOrders: scopedOrders.length,
      activeBranches: mockFranchises.filter((franchise) => franchise.status === "ACTIVE")
        .length,
      totalProducts: mockProducts.filter((product) => product.status === "ACTIVE").length,
      totalCustomers: mockCustomerFranchises.length,
    },
    topProducts: Object.values(productStats)
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .slice(0, 5),
    topCustomers: Object.values(customerStats)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5),
    revenueByBranch: mockFranchises.map((franchise) => {
      const orders = mockOrders.filter((order) => order.franchiseId === franchise.id);
      return {
        franchiseId: franchise.id,
        branchId: franchise.id,
        franchiseName: franchise.name,
        branchName: franchise.name,
        name: franchise.name,
        revenue: orders.reduce((sum, order) => sum + Number(order.totalDue || 0), 0),
        orders: orders.length,
        orderCount: orders.length,
      };
    }),
    orderStatusStats,
    recentOrders: scopedOrders.slice(0, 10),
    generatedAt: nowIso(),
  };
};

const searchUsersList = (params) => {
  const keyword = getParam(params, "keyword", "");
  const role = getParam(params, "role");
  const status = getParam(params, "status");
  const franchiseId = getParam(params, "franchiseId");

  return mockUsers
    .map(sanitizeUser)
    .filter((user) => {
      const haystack = `${user.fullName} ${user.username} ${user.email} ${user.phone}`;
      return (
        matchesKeyword(haystack, keyword) &&
        (!role || role === "All" || user.role?.name === String(role).toUpperCase()) &&
        (!status ||
          status === "All" ||
          user.status === String(status).toUpperCase()) &&
        (!franchiseId || user.franchise?.id === franchiseId)
      );
    });
};

const customerPage = (list, params) => {
  const page = makePage(list, {
    page: getParam(params, "page", 0),
    size: getParam(params, "size", 10),
  });
  return ok(page);
};

const getCustomerSummaries = (params) => {
  const keyword = getParam(params, "keyword", "");
  const status = getParam(params, "status");
  const franchiseId = getParam(params, "franchiseId");

  const summaries = mockCustomerFranchises
    .filter((customer) => {
      const user = customer.user || {};
      const haystack = `${user.fullName} ${user.username} ${user.email} ${user.phone}`;
      return (
        matchesKeyword(haystack, keyword) &&
        (!status || customer.status === status) &&
        (!franchiseId || customer.franchise?.id === franchiseId)
      );
    })
    .map((customer) => ({
      user: sanitizeUser(customer.user),
      loyaltyInfo: mockWallets[customer.user?.id] || {
        loyaltyTier: "BRONZE",
        currentPoint: 0,
        totalPoint: 0,
      },
      purchasedFranchises: mockCustomerFranchises
        .filter((item) => item.user?.id === customer.user?.id)
        .map((item) => item.franchise),
      lastOrderAt: customer.lastOrderAt,
      createdAt: customer.createdAt,
    }));

  return ok(
    makePage(summaries, {
      page: getParam(params, "page", 0),
      size: getParam(params, "size", 10),
    })
  );
};

const handleAuth = ({ method, path, params, body }, config) => {
  if (path === "/auth/sync-user" && method === "POST") {
    const tokenUser = getCurrentUser(config);
    const email = body?.email?.toLowerCase();
    let user = tokenUser;

    if (email) {
      const existing = mockUsers.find((item) => item.email.toLowerCase() === email);
      user = existing
        ? sanitizeUser(existing)
        : registerMockCustomer({ ...body, password: "123456" });
    }

    return ok(user);
  }

  if (path === "/auth/me" && method === "GET") {
    return ok(getCurrentUser(config));
  }

  if (path === "/auth/logout") return ok(true, "Logged out");

  if (path === "/auth/users/profile" && method === "GET") {
    return ok(getCurrentUser(config));
  }

  if (path === "/auth/users/update-profile" && ["PUT", "PATCH"].includes(method)) {
    const current = getCurrentUser(config);
    const index = mockUsers.findIndex((user) => user.id === current?.id);
    if (index >= 0) {
      mockUsers[index] = {
        ...mockUsers[index],
        ...body,
        role: mockUsers[index].role,
        franchise: mockUsers[index].franchise,
      };
      return ok(sanitizeUser(mockUsers[index]));
    }
    return ok(current);
  }

  if (path === "/auth/users/counts" && method === "GET") {
    const activeUsers = mockUsers.filter((user) => user.status === "ACTIVE");
    return ok({
      totalUsers: mockUsers.length,
      activeUsers: activeUsers.length,
      admin: mockUsers.filter((user) => user.role?.name === "ADMIN").length,
      manager: mockUsers.filter((user) => user.role?.name === "MANAGER").length,
      storeManager: mockUsers.filter((user) => user.role?.name === "STORE_MANAGER").length,
      staff: mockUsers.filter((user) => user.role?.name === "STAFF").length,
      customer: mockUsers.filter((user) => user.role?.name === "CUSTOMER").length,
    });
  }

  if (path === "/auth/users" && method === "GET") {
    return ok(makePage(searchUsersList(params), params));
  }

  if (path === "/auth/users/search" && method === "GET") {
    return ok(makePage(searchUsersList(params), params));
  }

  if (path === "/auth/users/franchise/staff" && method === "GET") {
    const franchiseId = getParam(params, "franchiseId");
    const staff = searchUsersList(params).filter(
      (user) =>
        ["STAFF", "STORE_MANAGER"].includes(user.role?.name) &&
        (!franchiseId || user.franchise?.id === franchiseId)
    );
    return ok(makePage(staff, params));
  }

  if (path === "/auth/users/bulk" && method === "POST") {
    const ids = Array.isArray(body) ? body.map(String) : [];
    return ok(mockUsers.filter((user) => ids.includes(user.id)).map(sanitizeUser));
  }

  if (path === "/auth/users" && method === "POST") {
    const roleName = body?.roleName || body?.role || "CUSTOMER";
    const franchiseId = body?.franchiseId || body?.franchise?.id || null;
    const user = {
      id: `user-${Date.now()}`,
      username: body?.username || body?.email?.split("@")?.[0] || `user${Date.now()}`,
      fullName: body?.fullName || body?.name || "New Mock User",
      email: body?.email || `${Date.now()}@agrifert.vn`,
      password: body?.password || "123456",
      phone: body?.phone || "",
      gender: body?.gender ?? false,
      status: "ACTIVE",
      verifyEmail: true,
      avatarUrl: body?.avatarUrl || "",
      role: withRole(roleName),
      franchise: franchiseId ? franchiseById(franchiseId) : null,
      createdAt: nowIso(),
      lastLogin: null,
    };
    mockUsers = [user, ...mockUsers];
    if (user.role.name === "CUSTOMER") ensureCustomerFranchise(user.id, "fr-hcm-01");
    return ok(sanitizeUser(user), "User created", 201);
  }

  const assignRoleMatch = path.match(/^\/auth\/users\/([^/]+)\/assign-role$/);
  if (assignRoleMatch && method === "PUT") {
    const userId = assignRoleMatch[1];
    const index = mockUsers.findIndex((user) => user.id === userId);
    if (index >= 0) {
      const roleName = getParam(params, "roleName", body?.roleName || "STAFF");
      const franchiseId = getParam(params, "franchiseId", body?.franchiseId);
      mockUsers[index] = {
        ...mockUsers[index],
        role: withRole(roleName),
        franchise: franchiseId ? franchiseById(franchiseId) : null,
      };
      return ok(sanitizeUser(mockUsers[index]), "Role assigned");
    }
  }

  const updateUserMatch = path.match(/^\/auth\/users\/([^/]+)\/update$/);
  if (updateUserMatch && ["PUT", "PATCH"].includes(method)) {
    const userId = updateUserMatch[1];
    const index = mockUsers.findIndex((user) => user.id === userId);
    if (index >= 0) {
      mockUsers[index] = {
        ...mockUsers[index],
        ...body,
        role: body?.roleName ? withRole(body.roleName) : mockUsers[index].role,
        franchise: body?.franchiseId ? franchiseById(body.franchiseId) : mockUsers[index].franchise,
      };
      return ok(sanitizeUser(mockUsers[index]), "User updated");
    }
  }

  const updateStatusMatch = path.match(/^\/auth\/users\/([^/]+)\/update-status$/);
  if (updateStatusMatch && method === "PUT") {
    const userId = updateStatusMatch[1];
    const index = mockUsers.findIndex((user) => user.id === userId);
    if (index >= 0) {
      mockUsers[index].status = getParam(params, "status", body?.status || "ACTIVE");
      return ok(sanitizeUser(mockUsers[index]), "User status updated");
    }
  }

  const deleteUserMatch = path.match(/^\/auth\/users\/delete-account\/([^/]+)$/);
  if (deleteUserMatch && ["PUT", "DELETE"].includes(method)) {
    const userId = deleteUserMatch[1];
    const index = mockUsers.findIndex((user) => user.id === userId);
    if (index >= 0) {
      mockUsers[index].status = "INACTIVE";
      return ok(sanitizeUser(mockUsers[index]), "User deactivated");
    }
  }

  if (path === "/auth/change-password" && method === "POST") {
    return ok(true, "Password changed");
  }

  if (["/auth/verify", "/auth/resend-code", "/auth/forgot-password", "/auth/forgot-password/confirm"].includes(path)) {
    return ok(true, "Mock auth action completed");
  }

  return null;
};

const handleRolesAndPermissions = ({ method, path, body }) => {
  if (path === "/auth/roles" && method === "GET") return ok(mockRoles);
  if (path === "/auth/permissions" && method === "GET") return ok(mockPermissions);

  const roleByNameMatch = path.match(/^\/auth\/roles\/search\/([^/]+)$/);
  if (roleByNameMatch && method === "GET") {
    return ok(roleByName(roleByNameMatch[1]));
  }

  const roleByIdMatch = path.match(/^\/auth\/roles\/([^/]+)$/);
  if (roleByIdMatch && method === "GET") {
    return ok(mockRoles.find((role) => role.id === roleByIdMatch[1]) || null);
  }

  if (path === "/auth/roles" && method === "POST") {
    const role = {
      id: `role-${Date.now()}`,
      name: String(body?.name || "CUSTOM_ROLE").toUpperCase(),
      description: body?.description || "",
      permissions: [],
    };
    mockRoles = [role, ...mockRoles];
    return ok(role, "Role created", 201);
  }

  const roleUpdateMatch = path.match(/^\/auth\/roles\/([^/]+)$/);
  if (roleUpdateMatch && ["PUT", "PATCH"].includes(method)) {
    const index = mockRoles.findIndex((role) => role.id === roleUpdateMatch[1]);
    if (index >= 0) {
      mockRoles[index] = { ...mockRoles[index], ...body };
      return ok(mockRoles[index], "Role updated");
    }
  }

  const rolePermissionMatch = path.match(/^\/auth\/roles\/([^/]+)\/permissions$/);
  if (rolePermissionMatch && method === "PUT") {
    const index = mockRoles.findIndex((role) => role.id === rolePermissionMatch[1]);
    if (index >= 0) {
      const permissionIds = Array.isArray(body) ? body : body?.permissionIds || [];
      mockRoles[index].permissions = mockPermissions.filter((permission) =>
        permissionIds.includes(permission.id)
      );
      return ok(mockRoles[index], "Permissions assigned");
    }
  }

  if (roleUpdateMatch && method === "DELETE") {
    mockRoles = mockRoles.filter((role) => role.id !== roleUpdateMatch[1]);
    return ok(true, "Role deleted");
  }

  if (path === "/auth/permissions" && method === "POST") {
    const permission = {
      id: `perm-${Date.now()}`,
      name: body?.name || "New Permission",
      code: body?.code || `PERMISSION_${Date.now()}`,
      module: body?.module || body?.category || "Custom",
      apiPath: body?.apiPath || "/api/mock",
      httpMethod: body?.httpMethod || "GET",
      description: body?.description || "",
    };
    mockPermissions = [permission, ...mockPermissions];
    return ok(permission, "Permission created", 201);
  }

  const permissionMatch = path.match(/^\/auth\/permissions\/([^/]+)$/);
  if (permissionMatch && ["PUT", "PATCH"].includes(method)) {
    const index = mockPermissions.findIndex((permission) => permission.id === permissionMatch[1]);
    if (index >= 0) {
      mockPermissions[index] = { ...mockPermissions[index], ...body };
      return ok(mockPermissions[index], "Permission updated");
    }
  }
  if (permissionMatch && method === "DELETE") {
    mockPermissions = mockPermissions.filter((permission) => permission.id !== permissionMatch[1]);
    return ok(true, "Permission deleted");
  }

  return null;
};

const handleProducts = ({ method, path, params, body }) => {
  if (
    ["/products/getall", "/products/get-all", "/products/search", "/products/filter"].includes(path) &&
    method === "GET"
  ) {
    return ok(
      makePage(filterProducts(params), {
        page: getParam(params, "page", 0),
        size: getParam(params, "sizePage", getParam(params, "size", 10)),
      })
    );
  }

  const franchiseProductMatch = path.match(/^\/products\/franchise\/([^/]+)$/);
  if (franchiseProductMatch && method === "GET") {
    return ok(
      makePage(filterProducts(params), {
        page: getParam(params, "page", 0),
        size: getParam(params, "sizePage", getParam(params, "size", 10)),
      })
    );
  }

  if (path === "/products/search-by-ids" && method === "POST") {
    const ids = Array.isArray(body) ? body.map(String) : [];
    return ok(productListWithCounts().filter((product) => ids.includes(product.id)));
  }

  const detailMatch = path.match(/^\/products\/detail\/([^/]+)$/);
  if (detailMatch && method === "GET") {
    return ok(productListWithCounts().find((product) => product.id === detailMatch[1]) || null);
  }

  if (path === "/products" && method === "POST") {
    const category = categoryById(body?.categoryId) || mockCategories[0];
    const product = {
      id: `prd-${Date.now()}`,
      name: body?.name || "New Mock Fertilizer",
      description: body?.description || "",
      descriptionEn: body?.descriptionEn || body?.description || "",
      brand: body?.brand || "AgriFert",
      status: body?.status || "ACTIVE",
      category,
      categoryId: category.id,
      price: Number(body?.price || body?.variants?.[0]?.price || 0),
      imageUrl: body?.imageUrl || DEFAULT_IMAGE,
      image: body?.image || body?.imageUrl || DEFAULT_IMAGE,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      variants: Array.isArray(body?.variants)
        ? body.variants.map((variant, index) => ({
            id: variant.id || `var-${Date.now()}-${index}`,
            productVariantId: variant.id || `var-${Date.now()}-${index}`,
            sku: variant.sku || `MOCK-${Date.now()}-${index}`,
            variantName: variant.variantName || "Default",
            packageSize: variant.packageSize || "",
            packageUnit: variant.packageUnit || "",
            size: variant.size || "",
            color: variant.color || "",
            price: Number(variant.price || variant.sellingPrice || 0),
            sellingPrice: Number(variant.sellingPrice || variant.price || 0),
            salePrice: Number(variant.salePrice || variant.price || 0),
            quantity: Number(variant.quantity || 0),
            stockQuantity: Number(variant.quantity || 0),
            status: variant.status || "ACTIVE",
            imageUrl: variant.imageUrl || DEFAULT_IMAGE,
            images: variant.images || { image01: DEFAULT_IMAGE },
          }))
        : [],
    };
    mockProducts = [product, ...mockProducts];
    return ok(product, "Product created", 201);
  }

  const productUpdateMatch = path.match(/^\/products\/([^/]+)$/);
  if (productUpdateMatch && ["PUT", "PATCH"].includes(method)) {
    const index = mockProducts.findIndex((product) => product.id === productUpdateMatch[1]);
    if (index >= 0) {
      const category = body?.categoryId ? categoryById(body.categoryId) : mockProducts[index].category;
      mockProducts[index] = {
        ...mockProducts[index],
        ...body,
        category,
        categoryId: category?.id || mockProducts[index].categoryId,
        updatedAt: nowIso(),
      };
      return ok(productListWithCounts().find((product) => product.id === productUpdateMatch[1]));
    }
  }

  const productInactiveMatch = path.match(/^\/products\/inactive\/([^/]+)$/);
  if (productInactiveMatch && ["DELETE", "PUT"].includes(method)) {
    const index = mockProducts.findIndex((product) => product.id === productInactiveMatch[1]);
    if (index >= 0) {
      mockProducts[index].status = "INACTIVE";
      return ok(mockProducts[index], "Product inactive");
    }
  }

  const variantInactiveMatch = path.match(/^\/products\/([^/]+)\/inactive-variant\/([^/]+)$/);
  if (variantInactiveMatch && ["DELETE", "PUT"].includes(method)) {
    const product = mockProducts.find((item) => item.id === variantInactiveMatch[1]);
    const variant = product?.variants?.find((item) => item.id === variantInactiveMatch[2]);
    if (variant) variant.status = "INACTIVE";
    return ok(product || true, "Variant inactive");
  }

  if (path === "/uploads" && method === "POST") {
    return ok([DEFAULT_IMAGE], "Images uploaded");
  }

  if (path === "/products/categories/get-all" && method === "GET") {
    return ok(categoryListWithCounts());
  }

  if (path === "/products/categories" && method === "GET") {
    return ok(categoryListWithCounts());
  }

  if (path === "/products/categories" && method === "POST") {
    const category = {
      id: `cat-${Date.now()}`,
      name: body?.name || "New Category",
      slug: String(body?.name || "new-category").toLowerCase().replace(/\s+/g, "-"),
      description: body?.description || "",
      status: "ACTIVE",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    mockCategories = [category, ...mockCategories];
    return ok(category, "Category created", 201);
  }

  const categoryUpdateMatch = path.match(/^\/products\/categories\/update\/([^/]+)$/);
  if (categoryUpdateMatch && ["PUT", "PATCH"].includes(method)) {
    const index = mockCategories.findIndex((category) => category.id === categoryUpdateMatch[1]);
    if (index >= 0) {
      mockCategories[index] = { ...mockCategories[index], ...body, updatedAt: nowIso() };
      return ok(mockCategories[index], "Category updated");
    }
  }

  const categoryDeleteMatch = path.match(/^\/products\/categories\/delete\/([^/]+)$/);
  if (categoryDeleteMatch && ["DELETE", "PUT"].includes(method)) {
    const index = mockCategories.findIndex((category) => category.id === categoryDeleteMatch[1]);
    if (index >= 0) {
      mockCategories[index].status = "INACTIVE";
      return ok(true, "Category inactive");
    }
  }

  return null;
};

const handleFranchises = ({ method, path, params, body }) => {
  if (["/franchises", "/franchises/get-all"].includes(path) && method === "GET") {
    return ok(mockFranchises);
  }

  if (path === "/franchises/get-active" && method === "GET") {
    return ok(mockFranchises.filter((franchise) => franchise.status === "ACTIVE"));
  }

  const statusMatch = path.match(/^\/franchises\/status\/([^/]+)$/);
  if (statusMatch && method === "GET") {
    return ok(mockFranchises.filter((franchise) => franchise.status === statusMatch[1]));
  }

  const franchiseDetailMatch = path.match(/^\/franchises\/([^/]+)$/);
  if (franchiseDetailMatch && method === "GET") {
    return ok(mockFranchises.find((franchise) => franchise.id === franchiseDetailMatch[1]) || null);
  }

  if (path === "/franchises" && method === "POST") {
    const franchise = {
      id: `fr-${Date.now()}`,
      name: body?.name || body?.franchiseName || "AgriFert - Dai ly moi",
      franchiseName: body?.name || body?.franchiseName || "AgriFert - Dai ly moi",
      address: body?.address || "",
      googleMapsUrl: body?.googleMapsUrl || "",
      phone: body?.phone || "",
      email: body?.email || "",
      status: body?.status || "NEW",
      revenue: 0,
      joinedDate: body?.opened || new Date().toISOString().split("T")[0],
      openedAt: nowIso(),
      createdAt: nowIso(),
      at: body?.at || null,
    };
    mockFranchises = [franchise, ...mockFranchises];
    return ok(franchise, "Franchise created", 201);
  }

  const updateMatch = path.match(/^\/franchises\/([^/]+)$/);
  if (updateMatch && ["PUT", "PATCH"].includes(method)) {
    const index = mockFranchises.findIndex((franchise) => franchise.id === updateMatch[1]);
    if (index >= 0) {
      const nextStatus =
        path.endsWith("/status")
          ? String(body || getParam(params, "status") || mockFranchises[index].status).replace(/"/g, "")
          : body?.status;
      mockFranchises[index] = {
        ...mockFranchises[index],
        ...body,
        name: body?.name || mockFranchises[index].name,
        franchiseName: body?.name || body?.franchiseName || mockFranchises[index].franchiseName,
        status: nextStatus || mockFranchises[index].status,
        updatedAt: nowIso(),
      };
      return ok(mockFranchises[index], "Franchise updated");
    }
  }

  const statusUpdateMatch = path.match(/^\/franchises\/([^/]+)\/status$/);
  if (statusUpdateMatch && ["PATCH", "PUT"].includes(method)) {
    const index = mockFranchises.findIndex((franchise) => franchise.id === statusUpdateMatch[1]);
    if (index >= 0) {
      mockFranchises[index].status = String(body || getParam(params, "status", "ACTIVE")).replace(/"/g, "");
      return ok(mockFranchises[index], "Franchise status updated");
    }
  }

  const deleteMatch = path.match(/^\/franchises\/([^/]+)$/);
  if (deleteMatch && method === "DELETE") {
    const index = mockFranchises.findIndex((franchise) => franchise.id === deleteMatch[1]);
    if (index >= 0) {
      mockFranchises[index].status = "DELETED";
      return ok(mockFranchises[index], "Franchise deleted");
    }
  }

  return null;
};

const handleInventory = ({ method, path, params, body }) => {
  if (path === "/inventory/stocks" && method === "GET") {
    const locationId = getParam(params, "locationId");
    const lowStock = getParam(params, "lowStock") === "true";
    let list = mockStocks.filter((stock) => !locationId || stock.locationId === locationId);
    if (lowStock) {
      list = list.filter(
        (stock) => Number(stock.quantity || 0) - Number(stock.reservedQuantity || 0) <= Number(stock.minStock || 0)
      );
    }
    return ok(makePage(list, params));
  }

  if (path === "/inventory/stocks/receipt" && method === "POST") {
    const pair = getVariant(body?.productVariantId);
    const stock = {
      id: `stock-${Date.now()}`,
      productId: pair.product?.id,
      productVariantId: body?.productVariantId,
      productName: pair.product?.name || "Mock fertilizer",
      variantName: pair.variant?.variantName || "Default",
      sku: pair.variant?.sku,
      packageSize: pair.variant?.packageSize,
      packageUnit: pair.variant?.packageUnit,
      locationId: body?.locationId || MAIN_WAREHOUSE_ID,
      locationName:
        franchiseById(body?.locationId)?.name ||
        (body?.locationId === MAIN_WAREHOUSE_ID ? "Kho tong AgriFert" : "Mock location"),
      locationType: body?.locationId === MAIN_WAREHOUSE_ID ? "WAREHOUSE" : "FRANCHISE",
      quantity: Number(body?.quantity || 0),
      reservedQuantity: 0,
      minStock: 10,
      updatedAt: nowIso(),
    };
    mockStocks = [stock, ...mockStocks];
    mockTransactions = [
      {
        id: `txn-${Date.now()}`,
        type: "RECEIPT",
        productVariantId: stock.productVariantId,
        productName: stock.productName,
        variantName: stock.variantName,
        quantity: stock.quantity,
        locationId: stock.locationId,
        locationName: stock.locationName,
        createdBy: body?.createdBy,
        createdAt: nowIso(),
        notes: body?.notes || "",
      },
      ...mockTransactions,
    ];
    return ok(stock, "Stock received", 201);
  }

  if (path === "/inventory/stocks/variants/in-stock" && method === "GET") {
    const locationId = getParam(params, "locationId");
    const ids = mockStocks
      .filter(
        (stock) =>
          (!locationId || stock.locationId === locationId) &&
          Number(stock.quantity || 0) > Number(stock.reservedQuantity || 0)
      )
      .map((stock) => stock.productVariantId);
    return ok([...new Set(ids)]);
  }

  if (path === "/inventory/stocks/capable-branches" && method === "POST") {
    const requiredItems = Array.isArray(body) ? body : [];
    const capable = mockFranchises
      .filter((franchise) => franchise.status === "ACTIVE")
      .map((franchise) => {
        const canFulfill = requiredItems.every((item) => {
          const stock = mockStocks.find(
            (entry) =>
              entry.locationId === franchise.id &&
              entry.productVariantId === (item.productVariantId || item.variantId)
          );
          return (
            Number(stock?.quantity || 0) - Number(stock?.reservedQuantity || 0) >=
            Number(item.quantity || 1)
          );
        });
        return {
          franchiseId: franchise.id,
          id: franchise.id,
          franchiseName: franchise.name,
          name: franchise.name,
          address: franchise.address,
          canFulfill,
        };
      })
      .filter((branch) => branch.canFulfill);
    return ok(capable);
  }

  if (["/inventory/stocks/reserve", "/inventory/stocks/release", "/inventory/stocks/commit"].includes(path)) {
    return ok(true, "Stock operation completed");
  }

  if (path === "/inventory/transactions" && method === "GET") {
    const locationId = getParam(params, "locationId");
    const list = mockTransactions.filter((txn) => !locationId || txn.locationId === locationId);
    return ok(makePage(list, params));
  }

  if (path === "/inventory/transfers" && method === "GET") {
    const fromLocationId = getParam(params, "fromLocationId");
    const list = mockTransfers.filter((transfer) => !fromLocationId || transfer.fromLocationId === fromLocationId);
    return ok(makePage(list, params));
  }

  const transferDetailMatch = path.match(/^\/inventory\/transfers\/([^/]+)$/);
  if (transferDetailMatch && method === "GET") {
    return ok(mockTransfers.find((transfer) => transfer.id === transferDetailMatch[1]) || null);
  }

  if (path === "/inventory/transfers" && method === "POST") {
    const transfer = {
      id: `trf-${Date.now()}`,
      fromLocationId: body?.fromLocationId || MAIN_WAREHOUSE_ID,
      fromLocationName:
        franchiseById(body?.fromLocationId)?.name ||
        (body?.fromLocationId === MAIN_WAREHOUSE_ID ? "Kho tong AgriFert" : "Mock source"),
      toLocationId: body?.toLocationId,
      toLocationName: franchiseById(body?.toLocationId)?.name || "Mock destination",
      type: body?.type || "WAREHOUSE_TO_FRANCHISE",
      status: "PENDING",
      createdBy: body?.createdBy,
      createdByName: mockUsers.find((user) => user.id === body?.createdBy)?.fullName || "Mock user",
      createdAt: nowIso(),
      notes: body?.notes || "",
      totalQuantity: (body?.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      items: (body?.items || []).map((item) => {
        const pair = getVariant(item.productVariantId || item.variantId);
        return {
          productVariantId: item.productVariantId || item.variantId,
          productName: pair.product?.name || "Mock fertilizer",
          variantName: pair.variant?.variantName || "Default",
          quantity: Number(item.quantity || item.qty || 1),
        };
      }),
    };
    mockTransfers = [transfer, ...mockTransfers];
    return ok(transfer, "Transfer created", 201);
  }

  const transferActionMatch = path.match(/^\/inventory\/transfers\/([^/]+)\/(ship|receive|reject)$/);
  if (transferActionMatch && method === "PUT") {
    const index = mockTransfers.findIndex((transfer) => transfer.id === transferActionMatch[1]);
    if (index >= 0) {
      const statusByAction = {
        ship: "SHIPPED",
        receive: "COMPLETED",
        reject: "CANCELLED",
      };
      mockTransfers[index].status = statusByAction[transferActionMatch[2]];
      mockTransfers[index].updatedAt = nowIso();
      return ok(mockTransfers[index], "Transfer updated");
    }
  }

  if (path === "/inventory/requests" && method === "GET") {
    const franchiseId = getParam(params, "franchiseId");
    const list = mockStockRequests.filter((request) => !franchiseId || request.franchiseId === franchiseId);
    return ok(makePage(list, params));
  }

  if (path === "/inventory/requests/pending" && method === "GET") {
    return ok(mockStockRequests.filter((request) => request.status === "PENDING"));
  }

  const requestsStatusMatch = path.match(/^\/inventory\/requests\/status\/([^/]+)$/);
  if (requestsStatusMatch && method === "GET") {
    return ok(mockStockRequests.filter((request) => request.status === requestsStatusMatch[1]));
  }

  const requestsMineMatch = path.match(/^\/inventory\/requests\/my-requests\/([^/]+)(?:\/status\/([^/]+))?$/);
  if (requestsMineMatch && method === "GET") {
    return ok(
      mockStockRequests.filter(
        (request) =>
          request.createdBy === requestsMineMatch[1] &&
          (!requestsMineMatch[2] || request.status === requestsMineMatch[2])
      )
    );
  }

  if (path === "/inventory/requests" && method === "POST") {
    const franchise = franchiseById(body?.franchiseId);
    const request = {
      id: `req-${Date.now()}`,
      franchiseId: body?.franchiseId,
      franchiseName: franchise?.name || "Mock franchise",
      status: "PENDING",
      createdBy: body?.createdBy,
      createdByName: body?.createdByName || mockUsers.find((user) => user.id === body?.createdBy)?.fullName || "Mock user",
      totalAmount: body?.totalAmount || 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      notes: body?.notes || "",
      items: (body?.items || []).map((item) => {
        const pair = getVariant(item.productVariantId || item.variantId);
        const price = Number(pair.variant?.price || 0);
        return {
          productVariantId: item.productVariantId || item.variantId,
          productName: pair.product?.name || "Mock fertilizer",
          variantName: pair.variant?.variantName || "Default",
          quantity: Number(item.quantity || item.qty || 1),
          price,
        };
      }),
    };
    mockStockRequests = [request, ...mockStockRequests];
    return ok(request, "Stock request created", 201);
  }

  const requestDetailMatch = path.match(/^\/inventory\/requests\/([^/]+)$/);
  if (requestDetailMatch && method === "GET") {
    return ok(mockStockRequests.find((request) => request.id === requestDetailMatch[1]) || null);
  }

  const requestActionMatch = path.match(/^\/inventory\/requests\/([^/]+)\/(approve|ship|receive|reject)$/);
  if (requestActionMatch && ["PUT", "PATCH"].includes(method)) {
    const index = mockStockRequests.findIndex((request) => request.id === requestActionMatch[1]);
    if (index >= 0) {
      const statusByAction = {
        approve: "APPROVED",
        ship: "SHIPPED",
        receive: "COMPLETED",
        reject: "CANCELLED",
      };
      mockStockRequests[index].status = statusByAction[requestActionMatch[2]];
      mockStockRequests[index].approvedBy = getParam(params, "approvedBy", mockStockRequests[index].approvedBy);
      mockStockRequests[index].updatedAt = nowIso();
      return ok(mockStockRequests[index], "Stock request updated");
    }
  }

  return null;
};

const handleOrders = ({ method, path, params, body }) => {
  const filterOrders = (orders) => {
    const status = getParam(params, "status");
    const typeOrder = getParam(params, "typeOrder");
    return orders.filter(
      (order) =>
        (!status || status === "ALL" || status === "all" || order.orderStatus === status) &&
        (!typeOrder || typeOrder === "ALL" || typeOrder === "all" || order.typeOrder === typeOrder)
    );
  };

  if (path === "/orders/create-order" && method === "POST") {
    const details = (body?.items || []).map(buildOrderDetailFromItem);
    const subtotal = details.reduce(
      (sum, detail) => sum + Number(detail.quantity || 0) * Number(detail.priceSnapshot || 0),
      0
    );
    const orderId = `ord-${Date.now()}`;
    const customer = mockUsers.find((user) => user.id === body?.customerId);
    const staff = mockUsers.find((user) => user.id === body?.staffId);
    const franchise = franchiseById(body?.franchiseId) || franchiseById("fr-hcm-01");
    const order = {
      id: orderId,
      orderId,
      orderCode: `AGF-${String(mockOrders.length + 1001)}`,
      customerId: body?.customerId || null,
      customerName: customer?.fullName || "Walk-in customer",
      customerPhone: customer?.phone || "",
      staffId: body?.staffId || null,
      staffName: staff?.fullName || "",
      franchiseId: franchise?.id,
      franchiseName: franchise?.name,
      paymentMethodId: body?.paymentMethodId,
      paymentMethodName: paymentMethods.find((item) => item.id === body?.paymentMethodId)?.methodName || "COD",
      typeOrder: body?.typeOrder || "Online",
      orderStatus: body?.typeOrder === "POS" ? "COMPLETED" : "WAITING_FOR_CONFIRMATION",
      status: body?.typeOrder === "POS" ? "COMPLETED" : "WAITING_FOR_CONFIRMATION",
      totalDue: subtotal + Number(body?.priceShip || 0),
      totalAmount: subtotal + Number(body?.priceShip || 0),
      priceShip: Number(body?.priceShip || 0),
      address: body?.address || null,
      distance: body?.distance || 0,
      createAt: nowIso(),
      createdAt: nowIso(),
      orderDetails: details,
    };
    mockOrders = [order, ...mockOrders];
    if (body?.customerId && franchise?.id) ensureCustomerFranchise(body.customerId, franchise.id, order.typeOrder);
    return ok({ orderId, paymentUrl: null, order }, "Order created", 201);
  }

  const franchiseOrdersMatch = path.match(/^\/orders\/franchise\/([^/]+)$/);
  if (franchiseOrdersMatch && method === "GET") {
    const orders = filterOrders(
      mockOrders.filter((order) => order.franchiseId === franchiseOrdersMatch[1])
    );
    return ok(makePage(orders, params));
  }

  if (path === "/orders/status" && method === "GET") {
    return ok(makePage(filterOrders(mockOrders), params));
  }

  if (path === "/orders/search" && method === "GET") {
    const keyword = getParam(params, "keyword", "");
    const franchiseId = getParam(params, "franchiseId");
    const orders = mockOrders.filter((order) => {
      const haystack = `${order.id} ${order.orderCode} ${order.customerName} ${order.customerPhone}`;
      return matchesKeyword(haystack, keyword) && (!franchiseId || order.franchiseId === franchiseId);
    });
    return ok(makePage(orders, params));
  }

  const customerOrdersMatch = path.match(/^\/orders\/customer\/([^/]+)$/);
  if (customerOrdersMatch && method === "GET") {
    const orders = filterOrders(
      mockOrders.filter((order) => order.customerId === customerOrdersMatch[1])
    );
    return ok(makePage(orders, params));
  }

  const orderDetailMatch = path.match(/^\/orders\/detail\/([^/]+)$/);
  if (orderDetailMatch && method === "GET") {
    return ok(mockOrders.find((order) => order.id === orderDetailMatch[1] || order.orderId === orderDetailMatch[1]) || null);
  }

  const statusMatch = path.match(/^\/orders\/([^/]+)\/status$/);
  if (statusMatch && ["PATCH", "PUT"].includes(method)) {
    const index = mockOrders.findIndex((order) => order.id === statusMatch[1] || order.orderId === statusMatch[1]);
    if (index >= 0) {
      const status = getParam(params, "status", body?.status || "PREPARING");
      mockOrders[index].orderStatus = status;
      mockOrders[index].status = status;
      return ok(mockOrders[index], "Order status updated");
    }
  }

  const assignStaffMatch = path.match(/^\/orders\/([^/]+)\/assign-staff\/([^/]+)$/);
  if (assignStaffMatch && method === "PUT") {
    const index = mockOrders.findIndex((order) => order.id === assignStaffMatch[1]);
    const staff = mockUsers.find((user) => user.id === assignStaffMatch[2]);
    if (index >= 0) {
      mockOrders[index].staffId = assignStaffMatch[2];
      mockOrders[index].staffName = staff?.fullName || "";
      return ok(mockOrders[index], "Staff assigned");
    }
  }

  const abandonMatch = path.match(/^\/orders\/([^/]+)\/abandon$/);
  if (abandonMatch && method === "DELETE") {
    const index = mockOrders.findIndex((order) => order.id === abandonMatch[1]);
    if (index >= 0) {
      mockOrders[index].orderStatus = "CANCELLED";
      mockOrders[index].status = "CANCELLED";
      return ok(mockOrders[index], "Order cancelled");
    }
  }

  if (path === "/orders" && method === "GET") {
    return ok(makePage(filterOrders(mockOrders), params));
  }

  return null;
};

const handleCart = ({ method, path, params, body }) => {
  const getCartMatch = path.match(/^\/carts\/online\/([^/]+)$/);
  if (getCartMatch && method === "GET") {
    return ok(mockCarts[getCartMatch[1]] || []);
  }

  if (path === "/carts/online/add" && method === "POST") {
    const customerId = body?.customerId;
    if (!mockCarts[customerId]) mockCarts[customerId] = [];
    const existing = mockCarts[customerId].find((item) => item.variantId === body?.variantId);
    if (existing) existing.quantity += Number(body?.quantity || 1);
    else {
      mockCarts[customerId].push({
        productId: body?.productId,
        variantId: body?.variantId,
        quantity: Number(body?.quantity || 1),
      });
    }
    return ok(mockCarts[customerId], "Cart updated");
  }

  const updateCartMatch = path.match(/^\/carts\/online\/([^/]+)\/update\/([^/]+)$/);
  if (updateCartMatch && method === "PUT") {
    const [customerId, variantId] = [updateCartMatch[1], updateCartMatch[2]];
    const quantity = Number(getParam(params, "quantity", body?.quantity || 1));
    mockCarts[customerId] = (mockCarts[customerId] || []).map((item) =>
      item.variantId === variantId ? { ...item, quantity } : item
    );
    return ok(mockCarts[customerId], "Cart item updated");
  }

  const removeCartMatch = path.match(/^\/carts\/online\/([^/]+)\/remove\/([^/]+)$/);
  if (removeCartMatch && method === "DELETE") {
    const [customerId, variantId] = [removeCartMatch[1], removeCartMatch[2]];
    mockCarts[customerId] = (mockCarts[customerId] || []).filter(
      (item) => item.variantId !== variantId
    );
    return ok(mockCarts[customerId], "Cart item removed");
  }

  const clearCartMatch = path.match(/^\/carts\/online\/([^/]+)\/clear$/);
  if (clearCartMatch && method === "DELETE") {
    mockCarts[clearCartMatch[1]] = [];
    return ok([], "Cart cleared");
  }

  const getPosMatch = path.match(/^\/carts\/pos\/([^/]+)$/);
  if (getPosMatch && method === "GET") return ok([]);
  if (path === "/carts/pos/add" && method === "POST") return ok(body || []);
  if (path.includes("/carts/pos/") && method === "DELETE") return ok(true);

  return null;
};

const handleCustomers = ({ method, path, params, body }) => {
  if (path === "/customers/get-all" && method === "GET") return ok(mockCustomerFranchises);
  if (path === "/customers/admin/all" && method === "GET") return customerPage(mockCustomerFranchises, params);
  if (path === "/customers/franchise/all" && method === "GET") {
    const franchiseId = getParam(params, "franchiseId");
    return customerPage(
      mockCustomerFranchises.filter((customer) => customer.franchise?.id === franchiseId),
      params
    );
  }
  if (["/customers/admin/search", "/customers/franchise/search"].includes(path) && method === "GET") {
    const franchiseId = getParam(params, "franchiseId");
    const status = getParam(params, "status");
    const userIds = getAllParams(params, "userIds");
    return customerPage(
      mockCustomerFranchises.filter(
        (customer) =>
          (!franchiseId || customer.franchise?.id === franchiseId) &&
          (!status || customer.status === status) &&
          (userIds.length === 0 || userIds.includes(customer.user?.id))
      ),
      params
    );
  }
  if (path === "/customers/searching" && method === "GET") return getCustomerSummaries(params);
  if (path === "/customers/bulk" && method === "POST") {
    const ids = Array.isArray(body) ? body.map(String) : [];
    return ok(mockCustomerFranchises.filter((customer) => ids.includes(customer.id)));
  }

  if (path === "/customers/customer-franchise" && method === "GET") {
    const userId = getParam(params, "userId");
    const franchiseId = getParam(params, "franchiseId");
    return ok(
      mockCustomerFranchises.find(
        (customer) => customer.user?.id === userId && customer.franchise?.id === franchiseId
      ) || null
    );
  }

  if (["/customers/internal/sync", "/customers/sync-to-franchise"].includes(path) && method === "POST") {
    const userId = getParam(params, "userId", body?.userId);
    const franchiseId = getParam(params, "franchiseId", body?.franchiseId || "fr-hcm-01");
    const type = getParam(params, "type", body?.type || "REGISTERED");
    return ok(ensureCustomerFranchise(userId, franchiseId, type), "Customer synced");
  }

  const createAtFranchiseMatch = path.match(/^\/customers\/franchises\/([^/]+)$/);
  if (createAtFranchiseMatch && method === "POST") {
    const customerId = getParam(params, "customerId", body?.customerId);
    return ok(ensureCustomerFranchise(customerId, createAtFranchiseMatch[1], "REGISTERED"), "Customer added");
  }

  const customerManagerStatusMatch = path.match(/^\/customers\/manager\/([^/]+)\/status$/);
  const customerStatusMatch = path.match(/^\/customers\/([^/]+)\/status$/);
  const statusTarget = customerManagerStatusMatch || customerStatusMatch;
  if (statusTarget && method === "PATCH") {
    const index = mockCustomerFranchises.findIndex((customer) => customer.id === statusTarget[1]);
    if (index >= 0) {
      mockCustomerFranchises[index].status = getParam(params, "status", "ACTIVE");
      return ok(mockCustomerFranchises[index], "Customer status updated");
    }
  }

  const customerManagerDeleteMatch = path.match(/^\/customers\/manager\/([^/]+)$/);
  const customerDetailMatch = path.match(/^\/customers\/([^/]+)$/);
  const targetMatch = customerManagerDeleteMatch || customerDetailMatch;
  if (targetMatch && method === "GET") {
    return ok(mockCustomerFranchises.find((customer) => customer.id === targetMatch[1]) || null);
  }
  if (targetMatch && ["PUT", "PATCH"].includes(method)) {
    const index = mockCustomerFranchises.findIndex((customer) => customer.id === targetMatch[1]);
    if (index >= 0) {
      mockCustomerFranchises[index].user = {
        ...mockCustomerFranchises[index].user,
        ...body,
      };
      mockCustomerFranchises[index].status = body?.status || mockCustomerFranchises[index].status;
      return ok(mockCustomerFranchises[index], "Customer updated");
    }
  }
  if (targetMatch && method === "DELETE") {
    const index = mockCustomerFranchises.findIndex((customer) => customer.id === targetMatch[1]);
    if (index >= 0) {
      mockCustomerFranchises[index].status = "INACTIVE";
      return ok(true, "Customer deleted");
    }
  }

  return null;
};

const handlePromotions = ({ method, path, params, body }) => {
  if (path === "/promotions" && method === "GET") return clone(mockPromotions);

  const availableMatch = path === "/promotions/available";
  if (availableMatch && method === "GET") {
    const orderValue = Number(getParam(params, "orderValue", 0));
    return ok(
      mockPromotions.filter(
        (promotion) =>
          ["ACTIVE", "Active"].includes(promotion.status) &&
          Number(promotion.minOrderValue || 0) <= orderValue
      )
    );
  }

  if (path === "/promotions/apply" && method === "POST") {
    const promotion = mockPromotions.find((item) => item.id === body?.promotionId || item.code === body?.code);
    const orderValue = Number(body?.orderValue || 0);
    const discount =
      promotion?.discountType === "PERCENT"
        ? Math.min(
            (orderValue * Number(promotion.discountValue || 0)) / 100,
            Number(promotion.maxDiscountValue || Infinity)
          )
        : Number(promotion?.discountValue || 0);
    return ok({ promotion, discountAmount: discount });
  }

  if (path === "/promotions/confirm" && method === "POST") return ok(true, "Promotion confirmed");

  if (path === "/promotions" && method === "POST") {
    const promotion = {
      id: `promo-${Date.now()}`,
      ...body,
      status: body?.status || "ACTIVE",
      used: 0,
    };
    mockPromotions = [promotion, ...mockPromotions];
    return ok(promotion, "Promotion created", 201);
  }

  const couponsMatch = path.match(/^\/promotions\/coupons(?:\/generate)?\/([^/]+)$/);
  if (couponsMatch && ["GET", "POST"].includes(method)) {
    return ok([
      {
        id: `coupon-${couponsMatch[1]}-001`,
        code: "AGRI10-DEMO",
        promotionId: couponsMatch[1],
        usageLimit: 1,
        used: 0,
        status: "ACTIVE",
      },
    ]);
  }

  const couponValidateMatch = path.match(/^\/promotions\/coupons\/validate\/([^/]+)$/);
  if (couponValidateMatch) return ok({ valid: true, code: couponValidateMatch[1] });

  const promotionDetailMatch = path.match(/^\/promotions\/([^/]+)$/);
  if (promotionDetailMatch && method === "GET") {
    return ok(mockPromotions.find((promotion) => promotion.id === promotionDetailMatch[1]) || null);
  }
  if (promotionDetailMatch && ["PUT", "PATCH"].includes(method)) {
    const index = mockPromotions.findIndex((promotion) => promotion.id === promotionDetailMatch[1]);
    if (index >= 0) {
      mockPromotions[index] = { ...mockPromotions[index], ...body };
      return ok(mockPromotions[index], "Promotion updated");
    }
  }
  if (promotionDetailMatch && method === "DELETE") {
    mockPromotions = mockPromotions.filter((promotion) => promotion.id !== promotionDetailMatch[1]);
    return ok(true, "Promotion deleted");
  }

  if (path.startsWith("/promotions/scopes")) return ok([]);

  return null;
};

const handleLoyalty = ({ method, path, body }) => {
  if (path === "/loyalty/tiers" && method === "GET") return ok(mockLoyaltyTiers);
  if (path === "/loyalty/tiers" && method === "POST") {
    const index = mockLoyaltyTiers.findIndex((tier) => tier.tierName === body?.tierName);
    if (index >= 0) mockLoyaltyTiers[index] = { ...mockLoyaltyTiers[index], ...body };
    else mockLoyaltyTiers = [...mockLoyaltyTiers, body];
    return ok(mockLoyaltyTiers, "Tier saved");
  }

  const deleteTierMatch = path.match(/^\/loyalty\/tiers\/([^/]+)$/);
  if (deleteTierMatch && method === "DELETE") {
    mockLoyaltyTiers = mockLoyaltyTiers.filter((tier) => tier.tierName !== deleteTierMatch[1]);
    return ok(mockLoyaltyTiers, "Tier deleted");
  }

  const transactionsMatch = path.match(/^\/loyalty\/transactions\/([^/]+)$/);
  if (transactionsMatch && method === "GET") {
    return ok(mockLoyaltyTransactions.filter((transaction) => transaction.userId === transactionsMatch[1]));
  }

  const walletMatch = path.match(/^\/loyalty\/wallets\/users\/([^/]+)$/);
  if (walletMatch && method === "GET") {
    return ok(
      mockWallets[walletMatch[1]] || {
        userId: walletMatch[1],
        loyaltyTier: "BRONZE",
        currentPoint: 0,
        totalPoint: 0,
        points: 0,
      }
    );
  }
  if (walletMatch && method === "POST") {
    mockWallets[walletMatch[1]] = mockWallets[walletMatch[1]] || {
      userId: walletMatch[1],
      loyaltyTier: "BRONZE",
      currentPoint: 0,
      totalPoint: 0,
      points: 0,
    };
    return ok(mockWallets[walletMatch[1]], "Wallet created", 201);
  }

  if (path === "/loyalty/deduct" && method === "POST") {
    const userId = body?.userId;
    const point = Number(body?.point || body?.points || 0);
    if (mockWallets[userId]) {
      mockWallets[userId].currentPoint = Math.max(0, mockWallets[userId].currentPoint - point);
      mockWallets[userId].points = mockWallets[userId].currentPoint;
    }
    return ok(mockWallets[userId] || null, "Points deducted");
  }

  if (path === "/loyalty/reports" && method === "GET") {
    return ok({
      totalMembers: Object.keys(mockWallets).length,
      totalPoints: Object.values(mockWallets).reduce((sum, wallet) => sum + wallet.currentPoint, 0),
      tierDistribution: mockLoyaltyTiers.map((tier) => ({
        tierName: tier.tierName,
        count: Object.values(mockWallets).filter((wallet) => wallet.loyaltyTier === tier.tierName).length,
      })),
    });
  }

  return null;
};

const handlePayments = ({ method, path }) => {
  if (path === "/payments/get-method" && method === "GET") return ok(paymentMethods);
  if (path === "/payments/option" && method === "POST") {
    return ok({ paymentUrl: null, status: "SUCCESS" }, "Payment option selected");
  }
  const statusMatch = path.match(/^\/payments\/status\/([^/]+)$/);
  if (statusMatch && method === "GET") return ok({ orderId: statusMatch[1], status: "PAID" });
  const transactionMatch = path.match(/^\/payments\/([^/]+)\/get-transaction$/);
  if (transactionMatch && method === "GET") {
    return ok({
      orderId: transactionMatch[1],
      transactionId: `txn-pay-${transactionMatch[1]}`,
      amount: mockOrders.find((order) => order.id === transactionMatch[1])?.totalDue || 0,
      status: "PAID",
    });
  }
  const payUrlMatch = path.match(/^\/payments\/pay-url\/([^/]+)$/);
  if (payUrlMatch && method === "GET") return ok({ orderId: payUrlMatch[1], paymentUrl: null });
  return null;
};

const handleAI = ({ method, path, body }) => {
  if (path === "/ai/search" && method === "POST") {
    const text = String(body?.text || "").toLowerCase();
    const matched = filterProducts(new URLSearchParams({ keyword: text })).slice(
      0,
      body?.top_k && body.top_k > 0 ? body.top_k : 10
    );
    return ok(matched.map((product) => ({ product_id: product.id, id: product.id, score: 0.96 })));
  }

  if (path === "/ai/recommendsystem" && method === "POST") {
    const limit = Number(body?.top_k || 8);
    return ok(
      productListWithCounts()
        .slice(0, limit)
        .map((product) => ({ product_id: product.id, id: product.id, score: 0.9 }))
    );
  }

  if (path === "/ai/recommend/similar" && method === "POST") {
    return ok(
      productListWithCounts()
        .filter((product) => product.id !== body?.productId)
        .slice(0, 6)
    );
  }

  if (path === "/ai/translate" && method === "POST") return ok(body?.texts || body || []);
  if (path === "/ai/config" && method === "GET") {
    return ok({
      enabled: true,
      source: "mock",
      model: "local-mock-recommender",
      updatedAt: nowIso(),
    });
  }
  if (path === "/ai/config" && ["POST", "PUT"].includes(method)) return ok(body || {});
  if (path.startsWith("/ai/recommend/train") || path === "/ai/update") return ok({ status: "READY" });
  if (path === "/ai/recommend/status") return ok({ status: "READY", progress: 100 });
  return null;
};

const handleReports = ({ method, path, params }) => {
  if (path === "/reports/dashboard" && method === "GET") {
    return buildDashboard(getParam(params, "franchiseId"));
  }
  return null;
};

const handleShifts = ({ method, path, params, body }) => {
  const byFranchiseMatch = path.match(/^\/shifts\/franchise\/([^/]+)$/);
  if (byFranchiseMatch && method === "GET") {
    return ok(mockShifts.filter((shift) => shift.franchiseId === byFranchiseMatch[1]));
  }

  if (path === "/shifts" && method === "POST") {
    const shift = { id: `shift-${Date.now()}`, status: "ACTIVE", ...body };
    mockShifts = [shift, ...mockShifts];
    return ok(shift, "Shift created", 201);
  }

  const shiftMatch = path.match(/^\/shifts\/([^/]+)$/);
  if (shiftMatch && ["PUT", "PATCH"].includes(method)) {
    const index = mockShifts.findIndex((shift) => shift.id === shiftMatch[1]);
    if (index >= 0) {
      mockShifts[index] = { ...mockShifts[index], ...body };
      return ok(mockShifts[index], "Shift updated");
    }
  }
  if (shiftMatch && method === "DELETE") {
    mockShifts = mockShifts.filter((shift) => shift.id !== shiftMatch[1]);
    return ok(true, "Shift deleted");
  }

  if (path === "/shifts/assignments" && method === "GET") {
    const staffId = getParam(params, "staffId");
    const date = getParam(params, "date");
    return ok(
      mockShiftAssignments.filter(
        (assignment) => (!staffId || assignment.staffId === staffId) && (!date || assignment.date === date)
      )
    );
  }

  if (path === "/shifts/assignments/range" && method === "GET") return ok(mockShiftAssignments);

  if (path === "/shifts/assignments" && method === "POST") {
    const assignment = {
      id: `assign-${Date.now()}`,
      assignmentId: `assign-${Date.now()}`,
      status: "SCHEDULED",
      ...body,
    };
    mockShiftAssignments = [assignment, ...mockShiftAssignments];
    return ok(assignment, "Assignment created", 201);
  }

  const assignmentActionMatch = path.match(/^\/shifts\/assignments\/([^/]+)(?:\/(check-in|check-out|absent))?$/);
  if (assignmentActionMatch && ["PUT", "PATCH"].includes(method)) {
    const index = mockShiftAssignments.findIndex((assignment) => assignment.id === assignmentActionMatch[1]);
    if (index >= 0) {
      const action = assignmentActionMatch[2];
      mockShiftAssignments[index] = {
        ...mockShiftAssignments[index],
        ...body,
        status:
          action === "check-in"
            ? "CHECKED_IN"
            : action === "check-out"
              ? "COMPLETED"
              : action === "absent"
                ? "ABSENT"
                : body?.status || mockShiftAssignments[index].status,
        checkInTime:
          action === "check-in" ? nowIso() : mockShiftAssignments[index].checkInTime,
        checkOutTime:
          action === "check-out" ? nowIso() : mockShiftAssignments[index].checkOutTime,
      };
      return ok(mockShiftAssignments[index], "Assignment updated");
    }
  }

  if (path.startsWith("/shifts/statistics")) {
    return ok({
      total: mockShiftAssignments.length,
      completed: mockShiftAssignments.filter((item) => item.status === "COMPLETED").length,
      absent: mockShiftAssignments.filter((item) => item.status === "ABSENT").length,
      checkedIn: mockShiftAssignments.filter((item) => item.status === "CHECKED_IN").length,
    });
  }

  if (path.startsWith("/shifts/attendance")) return ok([]);
  return null;
};

const handleDelivery = ({ method, path, body }) => {
  if (path === "/delivery/getall" && method === "GET") return ok([]);
  const orderDeliveryMatch = path.match(/^\/delivery\/get-by-order-id\/([^/]+)$/);
  if (orderDeliveryMatch && method === "GET") {
    return ok({
      id: `delivery-${orderDeliveryMatch[1]}`,
      orderId: orderDeliveryMatch[1],
      status: "ASSIGNED",
      shipperName: "Mock shipper",
      phone: "0909009009",
    });
  }
  if (path === "/delivery/create" && method === "POST") return ok({ id: `delivery-${Date.now()}`, ...body }, "Delivery created", 201);
  const deliveryUpdateMatch = path.match(/^\/delivery\/update\/([^/]+)$/);
  if (deliveryUpdateMatch && method === "PUT") return ok({ id: deliveryUpdateMatch[1], ...body }, "Delivery updated");
  return null;
};

const routeHandlers = [
  handleAuth,
  handleRolesAndPermissions,
  handleProducts,
  handleFranchises,
  handleInventory,
  handleOrders,
  handleCart,
  handleCustomers,
  handlePromotions,
  handleLoyalty,
  handlePayments,
  handleAI,
  handleReports,
  handleShifts,
  handleDelivery,
];

const createAxiosResponse = (config, data, status = 200) => ({
  data: clone(data),
  status,
  statusText: status >= 400 ? "Error" : "OK",
  headers: {
    "content-type": "application/json",
    "x-mock-api": "true",
  },
  config,
  request: null,
});

const createAxiosError = (config, data, status = 500) => {
  const error = new Error(data?.message || "Mock API error");
  error.config = config;
  error.response = createAxiosResponse(config, data, status);
  return error;
};

export const handleMockRequest = (config) => {
  const request = normalizeRequest(config);

  for (const handler of routeHandlers) {
    const result = handler(request, config);
    if (result !== null && result !== undefined) {
      return createAxiosResponse(config, result, result?.statusCode || 200);
    }
  }

  if (request.method === "GET") {
    return createAxiosResponse(
      config,
      ok(makePage([], request.params), `Mock fallback for ${request.path}`)
    );
  }

  return createAxiosResponse(
    config,
    ok(request.body || true, `Mock fallback for ${request.path}`)
  );
};

export const mockAxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 80));

  try {
    return handleMockRequest(config);
  } catch (error) {
    if (error?.response) throw error;
    throw createAxiosError(
      config,
      {
        statusCode: 500,
        message: error?.message || "Mock adapter failed",
        data: null,
      },
      500
    );
  }
};

export const mockDashboardData = buildDashboard;
export const mockLoyaltyTierList = () => clone(mockLoyaltyTiers);
export const mockProductList = () => clone(productListWithCounts());
