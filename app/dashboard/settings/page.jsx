"use client"

import { useUser } from "@clerk/nextjs"
import { Bell, Key, Moon, Save, Settings, ShieldCheck, Sparkles, User } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../components/ui/button"

export default function SettingsPage() {
    const { user } = useUser()
    const [difficulty, setDifficulty] = useState("Medium")
    const [emailAlerts, setEmailAlerts] = useState(true)
    const [aiTone, setAiTone] = useState("Detailed & Analytical")

    const handleSave = () => {
        toast.success("Preferences updated successfully!")
    }

    return (
        <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium">
                    <Settings className="size-3.5" />
                    <span>Control Center</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings & Preferences</h1>
                <p className="text-indigo-100 text-xs sm:text-sm max-w-lg">
                    Customize your study default difficulty, AI generation tone, and account notifications.
                </p>
            </div>

            {/* Main Form Box */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-8">
                {/* Account Details */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-2 border-b border-slate-100">
                        <User className="size-4 text-indigo-600" />
                        <span>Account Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">Full Name</label>
                            <input
                                type="text"
                                readOnly
                                value={user?.fullName || "Study User"}
                                className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">Email Address</label>
                            <input
                                type="text"
                                readOnly
                                value={user?.primaryEmailAddress?.emailAddress || "user@example.com"}
                                className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* AI Preferences */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-2 border-b border-slate-100">
                        <Sparkles className="size-4 text-indigo-600" />
                        <span>AI Generation Preferences</span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">Default Course Difficulty</label>
                            <div className="grid grid-cols-3 gap-3">
                                {["Easy", "Medium", "Hard"].map((lvl) => (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => setDifficulty(lvl)}
                                        className={`py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                                            difficulty === lvl
                                                ? "bg-indigo-50 border-indigo-600 text-indigo-600 shadow-2xs"
                                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">AI Explanation Style</label>
                            <select
                                value={aiTone}
                                onChange={(e) => setAiTone(e.target.value)}
                                className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                            >
                                <option value="Detailed & Analytical">Detailed & Analytical (Exam Preparation)</option>
                                <option value="Concise & Direct">Concise & Direct (Quick Revisions)</option>
                                <option value="Beginner Friendly">Beginner Friendly (Simple Analogies)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-2 border-b border-slate-100">
                        <Bell className="size-4 text-indigo-600" />
                        <span>Notifications & Alerts</span>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div>
                            <h4 className="font-semibold text-xs sm:text-sm text-slate-900">Study Reminder Emails</h4>
                            <p className="text-slate-500 text-xs">Receive weekly streak alerts and course summary reports.</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={emailAlerts}
                            onChange={(e) => setEmailAlerts(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                    </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex justify-end">
                    <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl gap-2 cursor-pointer shadow-md"
                    >
                        <Save className="size-4" /> Save Preferences
                    </Button>
                </div>
            </div>
        </div>
    )
}
