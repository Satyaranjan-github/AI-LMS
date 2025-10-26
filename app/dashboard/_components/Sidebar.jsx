"use client"

import { LayoutDashboard, Plus, Shield, UserCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Progress } from "../../../components/ui/progress"

function Sidebar() {

    const MenuList = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard"
        },
        {
            name: "Upgrade",
            icon: Shield,
            path: "/dashboard/upgrade"
        },
        {
            name: "Profile",
            icon: UserCircle,
            path: "/dashboard/profile"
        },
    ]
    const path = usePathname()

    return (
        <div className="h-screen shadow-md p-5">
            <div className="flex gap-2  items-center">
                {/* {"https://www.untitledui.com/logos"} */}
                <Image src={"/logo.svg"} width={40} height={40} alt="logo" />
                <h2 className="font-bold text-2xl">Easy Study</h2>
            </div>
            <div className="mt-10">
                <Link href={"/create"}>
                    <Button className="w-full">
                        <Plus />  Create New
                    </Button>
                </Link>
                <div className="mt-5 ">
                    {MenuList.map((menubar, index) => (
                        <div key={index} className={`flex gap-5 items-center p-3 hover:bg-slate-200 rounded-lg cursor-pointer mt-3 ${path == menubar.path && "bg-slate-200"}`} >
                            <menubar.icon />
                            <h2>{menubar.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border p-5 bg-slate-100 rounded-lg absolute bottom-10 w-[85%]">
                <h2 className="text-lg mb-2">Available Credits : 5</h2>
                <Progress value={30} />
                <h2 className="text-sm">1 Out of 5 Credits Used
                </h2>
                <Link href="/dashboard/upgrade" className="text-primary text-xs mt-3">Upgrade to create more</Link>
            </div>
        </div >
    )
}

export default Sidebar
