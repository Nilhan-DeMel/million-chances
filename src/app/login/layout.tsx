import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - Million Chances",
    description: "Sign in to Million Chances work memory app",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children;
}
