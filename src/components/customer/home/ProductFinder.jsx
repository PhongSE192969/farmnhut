import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Search } from "lucide-react";
import { getCrops, getGrowthStages, getCropProblems } from "@/services/customerHomeService";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import Reveal from "@/components/customer/ui/Reveal";

function ChipGroup({ options, selected, onSelect, getLabel = (o) => o.name || o.label }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isOn = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={isOn}
            onClick={() => onSelect(isOn ? null : opt.id)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              isOn
                ? "border-customer-primary bg-customer-primary text-white shadow-sm"
                : "border-customer-primary/20 bg-white text-customer-ink hover:border-customer-primary/50 hover:bg-customer-light"
            }`}
          >
            {getLabel(opt)}
          </button>
        );
      })}
    </div>
  );
}

export default function ProductFinder() {
  const navigate = useNavigate();

  const [crops, setCrops] = useState([]);
  const [stages, setStages] = useState([]);
  const [problems, setProblems] = useState([]);

  const [cropId, setCropId] = useState(null);
  const [stageId, setStageId] = useState(null);
  const [problemId, setProblemId] = useState(null);

  useEffect(() => {
    getCrops().then(setCrops);
    getGrowthStages().then(setStages);
    getCropProblems().then(setProblems);
  }, []);

  const canSubmit = Boolean(cropId);

  const handleReset = () => {
    setCropId(null);
    setStageId(null);
    setProblemId(null);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const params = new URLSearchParams();
    if (cropId) params.set("crop", cropId);
    if (stageId) params.set("stage", stageId);
    if (problemId) params.set("issue", problemId);

    navigate(`/products?${params.toString()}`);
  };

  return (
    <section
      id="product-finder"
      className="font-customer relative z-20 -mt-14 sm:-mt-20 lg:-mt-24 px-4 lg:px-10 pb-14 lg:pb-20 scroll-mt-24"
    >
      <div className="max-w-4xl mx-auto">
        <Reveal delay={80}>
          <div className="rounded-3xl border border-customer-primary/10 bg-white shadow-xl shadow-black/10 p-6 md:p-8 space-y-6">
            <SectionHeading
              align="center"
              eyebrow="Công cụ hỗ trợ lựa chọn"
              title="Tìm sản phẩm phù hợp với vườn của bạn"
              description="Chọn cây trồng, giai đoạn sinh trưởng và vấn đề đang gặp (nếu có) để xem gợi ý sản phẩm phù hợp."
              className="mx-auto"
            />

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-customer-secondary mb-3">
                1. Cây đang trồng <span className="text-customer-primary">*</span>
              </p>
              <ChipGroup options={crops} selected={cropId} onSelect={setCropId} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-customer-secondary mb-3">
                2. Giai đoạn hiện tại <span className="font-normal normal-case">(không bắt buộc)</span>
              </p>
              <ChipGroup
                options={stages}
                selected={stageId}
                onSelect={setStageId}
                getLabel={(o) => o.label}
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-customer-secondary mb-3">
                3. Vấn đề đang gặp <span className="font-normal normal-case">(không bắt buộc)</span>
              </p>
              <ChipGroup
                options={problems}
                selected={problemId}
                onSelect={setProblemId}
                getLabel={(o) => o.label}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-customer-primary/10">
              <CustomerButton
                variant="primary"
                icon={Search}
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                Xem gợi ý sản phẩm
              </CustomerButton>

              <CustomerButton variant="ghost" icon={RotateCcw} onClick={handleReset}>
                Đặt lại
              </CustomerButton>

              {!canSubmit && (
                <span className="text-xs text-customer-secondary">
                  Vui lòng chọn cây trồng để xem gợi ý.
                </span>
              )}
            </div>

            <p className="text-xs text-customer-secondary/80 leading-relaxed">
              Kết quả chỉ mang tính chất gợi ý tham khảo, không phải chẩn đoán
              chuyên môn. Liên hệ đội ngũ kỹ thuật AgriFert để được tư vấn cụ
              thể hơn cho tình trạng vườn của bạn.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
