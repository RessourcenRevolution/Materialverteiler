import PocketBase from "pocketbase";

const API_URL = import.meta.env.SSR
  ? process.env.API_URL
  : process.env.PUBLIC_API_URL;

console.log("API_URL", API_URL);

export const pocketbase = new PocketBase(API_URL);
