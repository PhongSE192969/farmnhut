// src/layouts/CustomerLayout.jsx
import { Outlet } from "react-router-dom";
import CustomerHeader from "@/components/customer/layout/CustomerHeader";
import CustomerFooter from "@/components/customer/layout/CustomerFooter";

export default function CustomerLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg-light">
      <CustomerHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
}
