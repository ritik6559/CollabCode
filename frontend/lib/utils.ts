import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ACTIONS = {
    ROOM_JOIN: "ROOM_JOIN",
    USER_JOINED: "USER_JOINED",
    USER_CALL: "USER_CALL",
    INCOMING_CALL: "INCOMING_CALL",
    CALL_ACCEPTED: "CALL_ACCEPTED",
    PEER_NEGO_NEEDED: "PEER_NEGO_NEEDED",
    PEER_NEGO_DONE: "PEER_NEGO_DONE",
    CODE_CHANGE: "CODE_CHANGE",
    PEER_NEGO_FINAL: "PEER_NEGO_FINAL"
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
