import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin, Phone, Mail, Search } from "lucide-react";
import toast from "react-hot-toast";
import { getRegions, getDealers } from "@/services/customerHomeService";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import EmptyState from "@/components/customer/ui/EmptyState";

export default function StoreLocatorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const regionCode = searchParams.get("province") || "";

  const [regions, setRegions] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    Promise.all([getRegions(), getDealers()])
      .then(([regionList, dealerList]) => {
        setRegions(regionList);
        setDealers(Array.isArray(dealerList) ? dealerList : []);
      })
      .catch(() => {
        setRegions([]);
        setDealers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedRegion = regions.find((r) => String(r.code) === String(regionCode));

  const filteredDealers = useMemo(() => {
    if (!selectedRegion) return dealers;

    const keyword = selectedRegion.name.replace(/^(Tỉnh|Thành phố)\s+/i, "").toLowerCase();

    return dealers.filter((dealer) =>
      (dealer.address || "").toLowerCase().includes(keyword)
    );
  }, [dealers, selectedRegion]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) {
      toast.error("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }
    // Frontend-only simulation — no backend endpoint wired up yet.
    setSubmitted(true);
    toast.success("Đã ghi nhận thông tin. AgriFert sẽ liên hệ hỗ trợ bạn sớm.");
  };

  return (
    <div className="font-customer bg-customer-cream min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 py-12 lg:py-16">
        <SectionHeading
          eyebrow="Tìm điểm bán"
          title="Tìm điểm bán AgriFert gần bạn"
          description="Chọn khu vực để tìm điểm bán phù hợp hoặc để lại thông tin, AgriFert sẽ hỗ trợ kết nối."
          className="mb-8"
        />

        <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-lg">
          <div className="w-full sm:flex-1 flex items-center gap-2 h-12 px-4 rounded-xl border border-customer-primary/20 bg-white">
            <MapPin size={16} className="text-customer-primary shrink-0" />
            <label htmlFor="locator-page-region" className="sr-only">Chọn tỉnh/thành</label>
            <select
              id="locator-page-region"
              value={regionCode}
              onChange={(e) => setSearchParams(e.target.value ? { province: e.target.value } : {})}
              className="w-full bg-transparent text-sm text-customer-ink outline-none"
            >
              <option value="">Tất cả khu vực</option>
              {regions.map((region) => (
                <option key={region.code} value={region.code}>{region.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-white/70 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredDealers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDealers.map((dealer) => (
              <div key={dealer.id} className="rounded-2xl bg-white border border-customer-primary/10 p-5">
                <h3 className="font-bold text-customer-ink mb-2">{dealer.name}</h3>
                {dealer.address && (
                  <p className="flex items-start gap-2 text-sm text-customer-secondary mb-1">
                    <MapPin size={14} className="mt-0.5 shrink-0" /> {dealer.address}
                  </p>
                )}
                {dealer.phone && (
                  <a href={`tel:${dealer.phone}`} className="flex items-center gap-2 text-sm text-customer-primary hover:underline">
                    <Phone size={14} /> {dealer.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="Chưa tìm thấy điểm bán ở khu vực này"
            description="Để lại thông tin bên dưới, đội ngũ AgriFert sẽ liên hệ hỗ trợ kết nối điểm bán gần bạn nhất."
          />
        )}

        <div className="mt-12 max-w-lg rounded-2xl bg-white border border-customer-primary/10 p-6">
          <h3 className="font-bold text-customer-ink mb-1">Không tìm thấy điểm bán phù hợp?</h3>
          <p className="text-sm text-customer-secondary mb-4">
            Để lại thông tin, AgriFert sẽ hỗ trợ kết nối.
          </p>

          {submitted ? (
            <p className="text-sm font-semibold text-customer-primary">
              Cảm ơn bạn! Đội ngũ AgriFert sẽ liên hệ sớm nhất.
            </p>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div>
                <label htmlFor="locator-name" className="text-xs font-semibold text-customer-secondary">Họ và tên</label>
                <input
                  id="locator-name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label htmlFor="locator-phone" className="text-xs font-semibold text-customer-secondary">Số điện thoại</label>
                <input
                  id="locator-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary"
                  placeholder="09xxxxxxxx"
                />
              </div>
              <CustomerButton variant="primary" type="submit" className="w-full">
                Gửi thông tin
              </CustomerButton>
            </form>
          )}
        </div>

        <p className="mt-6 text-xs text-customer-secondary/70 flex items-center gap-1.5">
          <Mail size={12} /> Danh sách điểm bán lấy từ hệ thống đại lý thực tế — không hiển thị số lượng theo tỉnh chưa xác nhận.
        </p>
      </div>
    </div>
  );
}
