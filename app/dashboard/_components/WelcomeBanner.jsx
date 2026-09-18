"use client"

import { useUser } from "@clerk/nextjs"
import Image from "next/image"

function WelcomeBanner() {
    const { user } = useUser()
    return (
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-indigo-600 w-full text-white rounded-xl flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 shadow-sm">
            <Image alt="Welcome Banner" src={"/laptop.png"} width={90} height={90} className="w-20 sm:w-24 h-auto shrink-0" />
            <div>
                <h2 className="font-bold text-xl sm:text-2xl md:text-3xl">Hello, {user?.fullName || "Student"} 👋</h2>
                <p className="text-sm sm:text-base text-blue-100 mt-1">Welcome Back! Time to start learning and generating new study materials.</p>
            </div>
        </div>
    )
}

export default WelcomeBanner
