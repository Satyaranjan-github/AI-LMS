"use client"
import { useState } from "react"
import { CourseCountContext } from "../_context/CourseCountContext.jsx"
import DashboardHeader from "./_components/DashboardHeader.jsx"
import Sidebar from "./_components/Sidebar.jsx"

function DashboardLayout({ children }) {

    const [totalCourse, setTotalCourse] = useState(0)

    return (
        <CourseCountContext.Provider value={{ totalCourse, setTotalCourse }}>
            <div>
                <div className="md:w-64 hidden md:block fixed">
                    <Sidebar />
                </div>
                <div className="md:ml-64">
                    <DashboardHeader />
                    <div className="p-10">
                        {children}
                    </div>
                </div>
            </div>
        </CourseCountContext.Provider>
    )
}

export default DashboardLayout
