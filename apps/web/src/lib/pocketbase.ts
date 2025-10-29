import PocketBase, { ClientResponseError } from "pocketbase";

const API_URL = import.meta.env.SSR
  ? process.env.API_URL
  : process.env.PUBLIC_API_URL;

console.log("API_URL", API_URL);

export const pocketbase = new PocketBase(API_URL);

export function usePocketbase(pb: PocketBase) {
  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    success: boolean;
    error: string;
    status?: number;
    response?: Response;
  }> {
    try {
      await pb.collection("users").authWithPassword(email, password);
      return {
        error: "",
        success: true,
      };
    } catch (e) {
      if (e instanceof ClientResponseError && e?.response?.status) {
        return {
          error: "Wrong e-mail or password, please try again.",
          success: false,
          status: e.response.status,
        };
      } else {
        return {
          error: "Unknown error.",
          success: false,
          status: 400,
        };
      }
    }
  }
  return {
    login,
  };
}
