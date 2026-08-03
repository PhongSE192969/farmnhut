import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOrderStore = create(
  persist(
    (set, get) => ({
      // Orders queue
      orders: [
        { id: "#1001", customer: "Trần Anh Tuấn", items: ["NPK 20-20-15 x1", "Phân hữu cơ x1"], itemDetails: [{name: "NPK 20-20-15", quantity: 1, price: 25000}, {name: "Phân hữu cơ", quantity: 1, price: 20000}], status: "WAITING_FOR_CONFIRMATION", typeOrder: "ONLINE", time: "10:30 AM", total: 45000, createdAt: new Date().toISOString() },
        { id: "#1002", customer: "Lê Minh Tuấn", items: ["Trà sữa trân châu x2"], itemDetails: [{name: "Trà sữa trân châu", quantity: 2, price: 35000}], status: "WAITING_FOR_CONFIRMATION", typeOrder: "ONLINE", time: "10:35 AM", total: 70000, createdAt: new Date().toISOString() },
        { id: "#1003", customer: "Nguyễn Hương Giang", items: ["Bạc xỉu x1"], itemDetails: [{name: "Bạc xỉu", quantity: 1, price: 30000}], status: "WAITING_FOR_CONFIRMATION", typeOrder: "ONLINE", time: "10:40 AM", total: 30000, createdAt: new Date().toISOString() },
        { id: "#1004", customer: "Hoàng Thanh Hà", items: ["Phân bón lá x1", "Kali Humate x1"], itemDetails: [{name: "Phân bón lá", quantity: 1, price: 40000}, {name: "Kali Humate", quantity: 1, price: 29000}], status: "WAITING_FOR_CONFIRMATION", typeOrder: "ONLINE", time: "10:45 AM", total: 69000, createdAt: new Date().toISOString() },
        { id: "#1005", customer: "Phạm Quốc Bảo", items: ["Sinh tố bơ x1"], itemDetails: [{name: "Sinh tố bơ", quantity: 1, price: 45000}], status: "PAID", typeOrder: "ONLINE", time: "10:50 AM", total: 45000, createdAt: new Date().toISOString() },
        { id: "#1006", customer: "Đặng Thùy Trâm", items: ["Hồng trà x3"], itemDetails: [{name: "Hồng trà", quantity: 3, price: 25000}], status: "PAID", typeOrder: "ONLINE", time: "10:55 AM", total: 75000, createdAt: new Date().toISOString() }
      ],
      nextOrderNumber: 1007,

      // Thêm order mới vào queue (từ CreateOrder khi charge)
      addOrder: (orderData) => {
        const orderNumber = `#${get().nextOrderNumber}`
        const newOrder = {
          id: orderNumber,
          customer: orderData.customer || 'Walk-in Customer',
          items: orderData.items.map(item => `${item.name} x${item.quantity}`),
          itemDetails: orderData.items, // Lưu chi tiết items
          status: orderData.status || 'PAID',
          typeOrder: orderData.typeOrder || 'POS',
          time: orderData.time || 'Just now',
          total: orderData.total,
          createdAt: new Date().toISOString(),
          staffName: orderData.staffName || null
        }

        set(state => ({
          orders: [newOrder, ...state.orders],
          nextOrderNumber: state.nextOrderNumber + 1
        }))

        return orderNumber
      },

      // Cập nhật trạng thái order
      updateOrderStatus: (orderId, newStatus) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        }))
      },

      // Xóa order
      removeOrder: (orderId) => {
        set(state => ({
          orders: state.orders.filter(order => order.id !== orderId)
        }))
      },

      // Lấy orders theo status
      getOrdersByStatus: (status) => {
        return get().orders.filter(order => order.status === status)
      },

      // Clear all orders
      clearOrders: () => {
        set({ orders: [], nextOrderNumber: 1001 })
      }
    }),
    {
      name: 'order-storage',
      partializer: (state) => ({
        orders: state.orders,
        nextOrderNumber: state.nextOrderNumber
      })
    }
  )
)
