import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "./chat-widget";

export const metadata: Metadata = {
  title: "Prompt AI Studio",
  description: "Seu estúdio de prompts, referências e projetos criativos.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
