import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type ChatGPTUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
};

const SIGN_IN_PATH = "/login";
const SIGN_OUT_PATH = "/api/logout";

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  
  if (token === "MAR9115COS") {
    return {
      userId: "marcos220896antonio@gmail.com",
      displayName: "Marcos",
      email: "marcos220896antonio@gmail.com",
      fullName: "Marcos",
    };
  }
  return null;
}

export async function requireChatGPTUser(
  returnTo: string,
): Promise<ChatGPTUser> {
  const user = await getChatGPTUser();
  if (user) return user;

  redirect(`${SIGN_IN_PATH}?return_to=${encodeURIComponent(returnTo)}`);
}

export function chatGPTSignInPath(returnTo: string): string {
  return `${SIGN_IN_PATH}?return_to=${encodeURIComponent(returnTo)}`;
}

export function chatGPTSignOutPath(returnTo = "/"): string {
  return `${SIGN_OUT_PATH}?return_to=${encodeURIComponent(returnTo)}`;
}
