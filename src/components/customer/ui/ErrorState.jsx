import { AlertTriangle } from "lucide-react";
import CustomerButton from "./CustomerButton";

export default function ErrorState({
  title = "Không tải được dữ liệu",
  description = "Đã có lỗi xảy ra. Vui lòng thử lại.",
  onRetry,
}) {
  return (
    <div className="font-customer flex flex-col items-center justify-center text-center py-16 px-4 rounded-2xl border border-red-100 bg-red-50/60">
      <AlertTriangle size={32} className="text-red-400 mb-3" />
      <p className="font-bold text-customer-ink">{title}</p>
      <p className="mt-1 text-sm text-customer-secondary max-w-sm">
        {description}
      </p>
      {onRetry && (
        <CustomerButton variant="outline" size="md" className="mt-4" onClick={onRetry}>
          Thử lại
        </CustomerButton>
      )}
    </div>
  );
}
