"use client"

import { UserProfile } from "@clerk/nextjs"
import { UserCircle } from "lucide-react"

export default function ProfilePage() {
    return (
        <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium">
                    <UserCircle className="size-3.5" />
                    <span>User Account</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manage Your Profile</h1>
                <p className="text-indigo-100 text-xs sm:text-sm max-w-lg">
                    Manage your personal details, connected email addresses, security settings, and active sessions.
                </p>
            </div>

            {/* Clerk UserProfile Wrapper */}
            <div className="flex justify-center bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-8 shadow-2xs">
                <UserProfile routing="hash" />
            </div>
        </div>
    )
}
