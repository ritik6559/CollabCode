import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ACTIONS = {
    ROOM_JOIN: "ROOM_JOIN",
    USER_JOINED: "USER_JOINED",
    USER_LEFT: "USER_LEFT",
    CODE_CHANGE: "CODE_CHANGE",
    DOC_CHANGE: "DOC_CHANGE",
    ROOM_ERROR: "ROOM_ERROR",
};


export const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
