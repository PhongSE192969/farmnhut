import {useState, useEffect} from "react"
import {getProvinces, getDistricts, getWards} from "../../utils/mockData"
import {useLanguageStore} from "../../stores"
import {translations} from "../../locales"
import MapGeoApiFyModal from "@/components/modal/MapGeoApiFyModal.jsx";
import iconGeoApi from "/public/geoapify.png";
import {normalizeVietnamese, normalizeProvince, normalizeDistrict, normalizeWard} from "@/utils/helpers.js";

export default function ShippingInfo({shipping, setShipping}) {
    const {language} = useLanguageStore();
    const t = (translations[language] || translations.vi).customer?.shippingInfo || {};

    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState("")
    const [selectedDistrict, setSelectedDistrict] = useState("")
    const [selectedWard, setSelectedWard] = useState("")

    useEffect(() => {
        buildAddressIndex();
    }, []);
    useEffect(() => {
        const loadProvinces = async () => {
            const data = await getProvinces()
            setProvinces(data)
        }
        loadProvinces()
    }, [])

    const handleProvinceChange = async (e) => {

        const code = e.target.value
        const province = provinces.find(p => p.code == code)
        setSelectedProvince(code)

        setShipping(prev => ({
            ...prev,
            province: province.name
        }))

        const districts = await getDistricts(code)
        setDistricts(districts)
        setWards([])
    }

    const handleDistrictChange = async (e) => {

        const code = e.target.value
        const district = districts.find(d => d.code == code)
        setSelectedDistrict(code)

        setShipping(prev => ({
            ...prev,
            district: district.name
        }))

        const wards = await getWards(code)
        setWards(wards)

    }

    const handleWardChange = (e) => {
        const code = e.target.value
        const ward = wards.find(w => w.code == code)
        setSelectedWard(code)
        setShipping(prev => ({
            ...prev,
            ward: ward.name
        }))
    }


    const handleChange = (e) => {
        const {name, value} = e.target
        setShipping(prev => ({
            ...prev,
            [name]: value,
            isFromMap: false // reset nếu user sửa tay
        }))
    }
    //
    // const findProvince = async (name) => {
    //     const key = normalizeVietnamese(name);
    //
    //     return provinces.find(p => {
    //         const normalized = normalizeVietnamese(p.name);
    //
    //         return (
    //             normalized === key ||
    //             normalized.includes(key) ||
    //             key.includes(normalized)
    //         );
    //     });
    // };
    const findDistrict = async (provinceCode, name) => {
        const data = await getDistricts(provinceCode);
        const key = normalizeVietnamese(name);

        return data.find(d => {
            const normalized = normalizeVietnamese(d.name);

            return (
                normalized === key ||
                normalized.includes(key) ||
                key.includes(normalized)
            );
        });
    };

    const findWard = async (districtCode, name) => {
        const data = await getWards(districtCode);
        const key = normalizeVietnamese(name);

        return data.find(w => {
            const normalized = normalizeVietnamese(w.name);

            return (
                normalized === key ||
                normalized.includes(key) ||
                key.includes(normalized)
            );
        });
    };

    const fuzzyMatch = (list, name) => {
        if (!name) return null;

        const key = normalizeVietnamese(name);

        return list.find(item => {
            const normalized = normalizeVietnamese(item.name);

            return (
                normalized === key ||
                normalized.includes(key) ||
                key.includes(normalized)
            );
        });
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&lang=vi&apiKey=be404ab39aa94ae2bd00133e5add65a3`
            );
            // const res = await fetch(`/api/map/reverse?lat=${lat}&lng=${lng}`); sửa lại sau cho xuống BE

            const data = await res.json();

            if (!data.features?.length) return null;

            const props = data.features[0].properties;

            return {
                fullAddress: props.formatted,
                ward: props.suburb,
                district: props.district || props.city,
                province: props.state
            };
        } catch (err) {
            console.error("Reverse geocode error:", err);
            return null;
        }
    };

    // const searchAddress = async (text) => {
    //     const res = await fetch(
    //         `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&limit=5&apiKey=be404ab39aa94ae2bd00133e5add65a3`);
    //
    //     const data = await res.json();
    //
    //     return data.features.map(f => ({
    //         label: f.properties.formatted,
    //         lat: f.properties.lat,
    //         lng: f.properties.lon
    //     }));
    // };

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">

                {/* HEADER */}
                <h2 className="font-semibold text-gray-700 mb-5">
                    {t.title || "Thông tin giao vật tư"}
                </h2>

                {/* SHIPPING TYPE */}
                <div className="flex gap-4 mb-5">
                    {/* DELIVERY */}
                    <button
                        type="button"
                        onClick={() => {
                            console.log("CLICK MAP BUTTON");
                            setIsMapOpen(true)
                        }}
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border">
                        <img src={iconGeoApi}/>
                    </button>

                </div>

                {/* DELIVERY */}
                <div className="space-y-4">
                    {/* NAME + PHONE */}
                    <div className="grid grid-cols-2 gap-4">

                        <input
                            required
                            name="name"
                            value={shipping.name}
                            onChange={handleChange}
                            placeholder={t.delivery?.name || "Tên người nhận"}
                            className="border border-gray-300 px-3 py-2.5 rounded-lg text-sm
                                        focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                        />

                        <input
                            required
                            name="phone"
                            value={shipping.phone}
                            onChange={handleChange}
                            placeholder={t.delivery?.phone || "Số điện thoại người nhận"}
                            className="border border-gray-300 px-3 py-2.5 rounded-lg text-sm
                                        focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                        />

                    </div>

                    {/* LOCATION */}
                    <div className="grid grid-cols-3 gap-4">

                        <select
                            value={selectedProvince}
                            required
                            className="border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                            onChange={handleProvinceChange}
                        >
                            <option value="">
                                {t.delivery?.province || "Tỉnh / Thành phố"}
                            </option>
                            {provinces.map(p => (
                                <option key={p.code} value={p.code}>
                                    {p.name}
                                </option>
                            ))}
                        </select>

                        <select
                            required
                            disabled={!selectedProvince}
                            value={selectedDistrict}
                            className="border border-gray-300 px-3 py-2.5 rounded-lg text-sm disabled:bg-gray-100"
                            onChange={handleDistrictChange}
                        >
                            <option value="">
                                {t.delivery?.district || "Quận / Huyện"}
                            </option>
                            {districts.map(d => (
                                <option key={d.code} value={d.code}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                        <select
                            required
                            disabled={!selectedProvince}
                            value={selectedWard}
                            className="border border-gray-300 px-3 py-2.5 rounded-lg text-sm disabled:bg-gray-100"
                            onChange={handleWardChange}
                        >
                            <option value="">
                                {t.delivery?.ward || "Phường / Xã"}
                            </option>
                            {wards.map(w => (
                                <option key={w.code} value={w.code}>
                                    {w.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    {/* ADDRESS */}
                    <input
                        name="address"
                        value={shipping.address}
                        onChange={handleChange}
                        placeholder={t.delivery?.address || "Số nhà / Tên đường"}
                        className="border border-gray-300 px-3 py-2.5 rounded-lg w-full text-sm
                                    focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                    />
                    {shipping.distance > 0 && (
                        <div className="mt-3 text-sm text-gray-600">
                            <p>Khoảng cách: {shipping.distance.toFixed(2)} km</p>
                            <p>Phí giao vật tư: {shipping.fee.toLocaleString()} VND</p>
                        </div>
                    )}

                </div>

                {/* NOTE */}
                <textarea
                    placeholder={t.notes || "Ghi chú khác"}
                    className="border border-gray-300 px-3 py-2.5 rounded-lg w-full mt-5 text-sm
                            focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                />

            </div>

            {isMapOpen && (
                <MapGeoApiFyModal
                    onClose={() => setIsMapOpen(false)}
                    onSelectLocation={async (location) => {

                        setDistricts([]);
                        setWards([]);
                        const {lat, lng} = location;

                        const geo = await reverseGeocode(lat, lng);
                        if (!geo) {
                            alert("Không lấy được địa chỉ");
                            return;
                        }
                        console.log("Geo:", geo);

                        const fullAddress = geo.fullAddress || "";
                        const result = matchAddressFromGeo({
                            suburb: geo.ward,
                            district: geo.district,
                            state: geo.province
                        });
                        if (result) {
                            if (result?.provinceCode) {
                                setSelectedProvince(result.provinceCode);
                                const districtsData = await getDistricts(result.provinceCode);
                                setDistricts(districtsData);
                            }
                            if (result?.districtCode) {
                                setSelectedDistrict(result.districtCode);
                                const wardsData = await getWards(result.districtCode);
                                setWards(wardsData);
                            }
                            if (result?.wardCode) {
                                setSelectedWard(result.wardCode);
                            }
                            setShipping(prev => ({
                                ...prev,
                                lat,
                                lng,
                                address: fullAddress,
                                province: result.provinceName,
                                district: result.districtName,
                                ward: result.wardName,
                                isFromMap: true
                            }));
                        } else {
                            const province = fuzzyMatch(provinces, geo.province);
                            if (!province) {
                                alert("Không xác định được Tỉnh/Thành. Vui lòng nhập thủ công.");
                                return;
                            }
                            setSelectedProvince(province.code);
                            const districtsData = await getDistricts(province.code);
                            setDistricts(districtsData);
                            const district = await findDistrict(province.code, geo.district);
                            if (!district) {
                                alert("Không xác định được Quận/Huyện. Vui lòng chọn lại.");
                                return;
                            }
                            setSelectedDistrict(district.code);
                            const wardsData = await getWards(district.code);
                            setWards(wardsData);
                            const ward = await findWard(district.code, geo.ward);
                            if (!ward) {
                                alert("Không xác định được Phường/Xã. Vui lòng chọn lại.");
                                return;
                            }
                            setSelectedWard(ward.code);
                            setShipping(prev => ({
                                ...prev,
                                lat,
                                lng,
                                address: fullAddress,
                                province: province.name,
                                district: district.name,
                                ward: ward.name,
                                isFromMap: true
                            }));
                        }
                        // const res = await fetch("/api/shipping/calculate", {
                        //     method: "POST",
                        //     headers: {"Content-Type": "application/json"},
                        //     body: JSON.stringify({
                        //         lat,
                        //         lng,
                        //         franchiseId: shipping.franchiseId
                        //     })
                        // });
                        // const data = await res.json();
                        // setShipping(prev => ({
                        //     ...prev,
                        //     distance: data.distance,
                        //     fee: data.fee
                        // }));
                        setIsMapOpen(false);
                        window.scrollTo({top: 300, behavior: "smooth"});
                    }}
                />
            )}
        </>
    )
}
// ============================MAP LOOKUP=======================================
let wardIndex = {};
let districtIndex = {};
let provinceIndex = {};
let isBuilt = false;
export const buildAddressIndex = async () => {
    if (isBuilt) return;
    const provinces = await getProvinces();
    for (const p of provinces) {
        const pKey = normalizeProvince(p.name);
        provinceIndex[pKey] = {
            code: p.code,
            name: p.name
        };
        const districts = await getDistricts(p.code);
        for (const d of districts) {
            const dKey = normalizeDistrict(d.name);
            districtIndex[dKey] = {
                code: d.code,
                name: d.name,
                provinceCode: p.code
            };
            const wards = await getWards(d.code);
            for (const w of wards) {
                const wKey = normalizeWard(w.name);
                wardIndex[wKey] = {
                    wardCode: w.code,
                    wardName: w.name,
                    districtCode: d.code,
                    districtName: d.name,
                    provinceCode: p.code,
                    provinceName: p.name
                };
            }
        }
    }
    isBuilt = true;
    console.log("✅ Address index built");
};
// ======================MATCH=======================
// const findMatch = (index, value) => {
//     if (!value) return null;
//     const key = normalizeVietnamese(value);
//     // exact match
//     if (index[key]) return index[key];
//     const foundKey = Object.keys(index).find(k =>
//         k === key ||
//         k.includes(key) ||
//         key.includes(k)
//     );
//     return foundKey ? index[foundKey] : null;
// };

const findMatch = (index, value, normalizeFn) => {
    if (!value) return null;
    const key = normalizeFn(value);
    if (index[key]) return index[key];
    const foundKey = Object.keys(index).find(k =>
        k.startsWith(key) || key.startsWith(k)
    );
    return foundKey ? index[foundKey] : null;
};
const matchAddressFromGeo = (geo) => {
    const provinceMatch = findMatch(provinceIndex, geo.state, normalizeProvince);
    const districtMatch = findMatch(districtIndex, geo.district, normalizeDistrict);
    const wardMatch = findMatch(wardIndex, geo.suburb, normalizeWard);
    if (
        wardMatch &&
        districtMatch &&
        wardMatch.districtCode === districtMatch.code
    ) {
        return wardMatch;
    }
    if (
        districtMatch &&
        provinceMatch &&
        districtMatch.provinceCode === provinceMatch.code
    ) {
        return {
            districtCode: districtMatch.code,
            districtName: districtMatch.name,
            provinceCode: provinceMatch.code,
            provinceName: provinceMatch.name
        };
    }
    if (provinceMatch) {
        return {
            provinceCode: provinceMatch.code,
            provinceName: provinceMatch.name
        };
    }
    return null;
};
