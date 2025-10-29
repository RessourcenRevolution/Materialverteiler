import PocketBase, { ClientResponseError } from "pocketbase";

const API_URL = import.meta.env.SSR
  ? process.env.API_URL
  : process.env.PUBLIC_API_URL;

console.log("API_URL", API_URL);

export const pocketbase = new PocketBase(API_URL);

export function usePocketbase(pb: PocketBase) {
  async function signup({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<{
    success: boolean;
    error: string;
    status?: number;
    response?: Response;
  }> {
    try {
      // Create user
      await pb
        .collection("users")
        .create({ name, email, password, passwordConfirm: password });
      // Login
      await pb.collection("users").authWithPassword(email, password);
      return {
        error: "",
        success: true,
      };
    } catch (e) {
      if (
        e instanceof ClientResponseError &&
        e?.response?.data?.password?.code === "validation_min_text_constraint"
      ) {
        return {
          error: "Password should be at least 8 characters long.",
          success: false,
          status: e.response.status,
        };
      } else {
        return {
          error: "An unknown error occured, please try again.",
          success: false,
          status: 400,
        };
      }
    }
  }
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
          error: "An unknown error occured, please try again.",
          success: false,
          status: 400,
        };
      }
    }
  }
  return {
    signup,
    login,
  };
}
