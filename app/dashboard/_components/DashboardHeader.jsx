"use client"
import { UserButton } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"
import Image from "next/image"

function DashboardHeader({ toggleMobileMenu, isMobileMenuOpen }) {
    return (
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center w-full">
                {/* Mobile Logo & Menu Toggle */}
                <div className="flex items-center gap-3 md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 focus:outline-none"
                        aria-label="Toggle Navigation"
                    >
                        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                    <div className="flex items-center gap-2">
                        <Image src="/logo.svg" width={30} height={30} alt="Logo" />
                        <span className="font-bold text-lg text-slate-900">Easy Study</span>
                    </div>
                </div>

                {/* Desktop spacer & User Button */}
                <div className="hidden md:block"></div>
                <div className="flex items-center gap-3">
                    <UserButton />
                </div>
            </div>
        </header>
    )
}

export default DashboardHeader
