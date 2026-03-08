import { barangays, cities } from "select-philippines-address";

export async function getCities() {
  const res = await cities("0349");
  return res.map((i: { city_name: string; city_code: string }) => ({
    name: i.city_name,
    code: i.city_code,
  }));
}

export async function getBarangays(code: string) {
  const res = await barangays(code);
  return res.map((i: { brgy_name: string; brgy_code: string }) => ({
    name: i.brgy_name,
    code: i.brgy_code,
  }));
}
