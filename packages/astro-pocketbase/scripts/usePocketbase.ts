import PocketBase, { ClientResponseError } from "pocketbase";

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
      // Request verification
      await pb.collection("users").requestVerification(email);
      // Login
      await pb.collection("users").authWithPassword(email, password);
      return {
        error: "",
        success: true,
      };
    } catch (e) {
      if (
        e instanceof ClientResponseError &&
        e?.response?.data?.email?.code === "validation_not_unique"
      ) {
        return {
          error: "There is already an account with this e-mail address.",
          success: false,
          status: e.response.status,
        };
      } else if (
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
