"use client"

import { Compass, LayoutDashboard, Plus, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react"
import { Button } from "../../../components/ui/button"
import { Progress } from "../../../components/ui/progress"
import { CourseCountContext } from "../../_context/CourseCountContext"

function Sidebar({ closeMobileMenu }) {

    const MenuList = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard"
        },
        {
            name: "Explore Courses",
            icon: Compass,
            path: "/dashboard/explore"
        },
        {
            name: "Settings",
            icon: Settings,
            path: "/dashboard/settings"
        },
    ]

    const { totalCourse } = useContext(CourseCountContext)
    const path = usePathname()

    return (
        <div className="h-full min-h-screen bg-white shadow-sm border-r p-5 flex flex-col justify-between">
            <div>
                {/* Logo Section */}
                <div className="flex gap-3 items-center">
                    <Image src={"/logo.svg"} width={36} height={36} alt="logo" />
                    <h2 className="font-bold text-xl text-slate-900">Easy Study</h2>
                </div>

                {/* Create Button & Nav Options */}
                <div className="mt-8">
                    <Link href={"/create"} onClick={closeMobileMenu}>
                        <Button className="w-full gap-2 font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20 rounded-xl cursor-pointer transition-all">
                            <Plus className="size-4" /> Create New Course
                        </Button>
                    </Link>
                    <div className="mt-6 space-y-1">
                        {MenuList.map((menubar, index) => {
                            const isActive = path === menubar.path;
                            return (
                                <Link href={menubar.path} key={index} onClick={closeMobileMenu}>
                                    <div className={`flex gap-3.5 items-center p-3 rounded-xl transition-all cursor-pointer text-sm font-medium ${
                                        isActive
                                            ? "bg-indigo-50/90 text-indigo-600 font-semibold border-l-4 border-indigo-600 shadow-2xs"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}>
                                        <menubar.icon className={`size-4.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                                        <span>{menubar.name}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Credits Usage Card */}
            <div className="border p-4 bg-slate-50 rounded-xl mt-8">
                <h2 className="text-sm font-semibold text-slate-800 mb-1">Available Credits: {Math.max(0, 5 - totalCourse)}</h2>
                <Progress value={(totalCourse / 5) * 100} className="h-2 my-2" />
                <p className="text-xs text-slate-500">{totalCourse} Out of 5 Credits Used</p>
                <Link href="/dashboard/upgrade" onClick={closeMobileMenu} className="inline-block text-primary font-medium text-xs mt-2 hover:underline">
                    Upgrade to create more →
                </Link>
            </div>
        </div>
    )
}

export default Sidebar
