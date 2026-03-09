import { brgyListMap, cityList } from "../../utils/locationCache";

export async function getCities() {
  const res = cityList;

  return res.map((i: { city_name: string; city_code: string }) => ({
    name: i.city_name,
    code: i.city_code,
  }));
}

export async function getBarangays(code: string) {
  const res = brgyListMap.get(code);

  return res?.map((i: { brgy_name: string; brgy_code: string }) => ({
    name: i.brgy_name,
    code: i.brgy_code,
  }));
}
