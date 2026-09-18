import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "Authentication | AI Study Material Generator",
};

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 sm:p-6">
            {/* Minimal Header Logo */}
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
                <Link href="/" className="flex items-center gap-2.5">
                    <Image src="/logo.svg" width={38} height={38} alt="Logo" />
                    <span className="font-bold text-xl text-slate-900 tracking-tight">
                        AI Study Generator
                    </span>
                </Link>
                <p className="text-xs text-slate-500 font-medium">Sign in to manage your AI study materials</p>
            </div>

            {/* Auth Form Card */}
            <div className="w-full max-w-md flex justify-center">
                {children}
            </div>
        </div>
    );
}
