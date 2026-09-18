import DashboardHeader from "../dashboard/_components/DashboardHeader"

function CourseViewLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col">
            <DashboardHeader />
            <div className="w-full flex-1">
                {children}
            </div>
        </div>
    )
}

export default CourseViewLayout
