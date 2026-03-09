import { barangays, cities } from "select-philippines-address";

const cityMap = new Map<string, string>();
export const brgyMap = new Map<string, string>();
export const brgyListMap = new Map<string, any[]>();
export let cityList = [];
export let barangayList = [];

async function addToBarangay(code: string) {
  const brgys = await barangays(code);
  brgys.forEach((b: { brgy_code: string; brgy_name: string }) => {
    brgyMap.set(b.brgy_code, b.brgy_name);
  });
  brgyListMap.set(code, brgys);
}
export const initAddressCache = async () => {
  const allCities = await cities("0349");
  cityList = allCities;

  allCities.forEach((c: { city_code: string; city_name: string }) => {
    cityMap.set(c.city_code, c.city_name);
    addToBarangay(c.city_code);
  });

  console.log("✅ Address cache initialized");
};

export const getCityName = (code: string) => cityMap.get(code) || code;
export const getBrgyName = (code: string) => brgyMap.get(code) || code;
