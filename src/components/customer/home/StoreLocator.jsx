import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import { getRegions } from "@/services/customerHomeService";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";

export default function StoreLocator() {
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [regionCode, setRegionCode] = useState("");

  useEffect(() => {
    getRegions()
      .then(setRegions)
      .catch(() => setRegions([]));
  }, []);

  const handleFind = () => {
    const params = regionCode ? `?province=${regionCode}` : "";
    navigate(`/tim-diem-ban${params}`);
  };

  return (
    <section className="font-customer bg-white py-14 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 lg:px-10 text-center">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Tìm điểm bán"
            title="Tìm điểm bán AgriFert gần bạn"
            description="Chọn khu vực để tìm điểm bán phù hợp hoặc để lại thông tin, AgriFert sẽ hỗ trợ kết nối."
            className="mx-auto mb-8"
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center max-w-lg mx-auto">
            <div className="w-full sm:flex-1 flex items-center gap-2 h-12 px-4 rounded-xl border border-customer-primary/20 bg-customer-cream">
              <MapPin size={16} className="text-customer-primary shrink-0" />
              <label htmlFor="store-locator-region" className="sr-only">
                Chọn tỉnh/thành
              </label>
              <select
                id="store-locator-region"
                value={regionCode}
                onChange={(e) => setRegionCode(e.target.value)}
                className="w-full bg-transparent text-sm text-customer-ink outline-none"
              >
                <option value="">Chọn tỉnh/thành...</option>
                {regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <CustomerButton variant="primary" size="lg" icon={Search} onClick={handleFind} className="w-full sm:w-auto">
              Tìm điểm bán
            </CustomerButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
