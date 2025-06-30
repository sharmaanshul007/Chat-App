import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "../assets/lottie-json.json";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const colors = [
  "bg-[#712c4a57] text-[#ff0060] border-[1px] border-[#ff0060aa]",
  "bg-[#ff0060a2] text-[#ff66ba] border-[1px] border-[#ff66babb]",
  "bg-[#8066a02a] text-[#8066a0] border-[1px] border-[#8066a0bb]",
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]",
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0];
};


export const animationDefaultOptions = {
  loop :true,
  autoplay:true,
  animationData: animationData,
}