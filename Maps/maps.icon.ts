import { IconName } from "@fortawesome/fontawesome-svg-core";

export type MapCatItem = {
  id: string;
  label: string;
  color: string;
  icon: IconName;
};

export const MarkerCat: MapCatItem[] = [
  {
    id: "airport",
    label: "สนามบิน",
    color: "#000000",
    icon: "plane",
  },
  {
    id: "station",
    label: "สถานีรถไฟ/ราง/กระเช้า",
    color: "#000000",
    icon: "train",
  },
  {
    id: "busstop",
    label: "ป้ายรถเมล์",
    color: "#000000",
    icon: "bus",
  },
  {
    id: "pier",
    label: "ท่าเรือ",
    color: "#000000",
    icon: "ship",
  },
  {
    id: "travel",
    label: "ที่เที่ยว",
    color: "#DD0000",
    icon: "camera",
  },
  {
    id: "eating",
    label: "ที่กิน",
    color: "#F0BF00",
    icon: "utensils",
  },
  {
    id: "cafe",
    label: "คาเฟ่",
    color: "#FF7BCB",
    icon: "coffee",
  },
  {
    id: "shopping",
    label: "ที่ช้อป",
    color: "#0059B2",
    icon: "shopping-bag",
  },
  {
    id: "show",
    label: "ชม",
    color: "#007843",
    icon: "eye",
  },
  {
    id: "activity",
    label: "กิจกรรม",
    color: "#007843",
    icon: "child",
  },
  {
    id: "office",
    label: "สำนักงาน",
    color: "#FF7D29",
    icon: "briefcase",
  },
  {
    id: "sleeping",
    label: "ที่นอน",
    color: "#000000",
    icon: "bed",
  },
  {
    id: "hospital",
    label: "สถานพยาบาล",
    color: "#000000",
    icon: "hospital",
  },
  {
    id: "school",
    label: "สถานศึกษา",
    color: "#000000",
    icon: "school",
  },
];

export const MerkerCatDict: Record<string, MapCatItem> = Object.assign(
  {},
  ...MarkerCat.map((item) => ({ [item.id]: item }))
);
