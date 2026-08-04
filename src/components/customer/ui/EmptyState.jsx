import { Inbox } from "lucide-react";

export default function EmptyState(props) {
  const {
    icon: Icon = Inbox,
    title = "Chưa có dữ liệu",
    description,
    action,
  } = props;

  return (
    <div className="font-customer flex flex-col items-center justify-center text-center py-16 px-4 rounded-2xl border border-dashed border-customer-primary/20 bg-customer-light/40">
      <Icon size={32} className="text-customer-primary/50 mb-3" />
      <p className="font-bold text-customer-ink">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-customer-secondary max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
