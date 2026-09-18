"use client"
import { useState } from "react"
import { CourseCountContext } from "../_context/CourseCountContext.jsx"
import DashboardHeader from "./_components/DashboardHeader.jsx"
import Sidebar from "./_components/Sidebar.jsx"

function DashboardLayout({ children }) {

    const [totalCourse, setTotalCourse] = useState(0)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <CourseCountContext.Provider value={{ totalCourse, setTotalCourse }}>
            <div className="min-h-screen bg-slate-50/50">
                {/* Desktop Sidebar */}
                <div className="md:w-64 hidden md:block fixed inset-y-0 z-30">
                    <Sidebar />
                </div>

                {/* Mobile Drawer Backdrop & Sidebar */}
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-40 flex">
                        <div
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                            onClick={closeMobileMenu}
                        />
                        <div className="relative w-64 max-w-[80vw] z-50 bg-white shadow-2xl">
                            <Sidebar closeMobileMenu={closeMobileMenu} />
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="md:ml-64 flex flex-col min-h-screen">
                    <DashboardHeader
                        toggleMobileMenu={toggleMobileMenu}
                        isMobileMenuOpen={isMobileMenuOpen}
                    />
                    <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </CourseCountContext.Provider>
    )
}

export default DashboardLayout
