"use client"

import { Check, Shield, Sparkles, Zap } from "lucide-react"
import { Button } from "../../../components/ui/button"

export default function UpgradePage() {
    const plans = [
        {
            name: "Free Starter",
            price: "$0",
            period: "forever",
            description: "Essential AI study material generation for students.",
            features: [
                "5 Course Generations",
                "Standard Flashcards & Quizzes",
                "Basic Q&A Practice Sets",
                "Community Support"
            ],
            current: true,
            buttonText: "Current Plan",
            color: "border-slate-200 bg-white"
        },
        {
            name: "Pro Scholar",
            price: "$9.99",
            period: "per month",
            description: "Unlimited AI study generation and advance learning tools.",
            features: [
                "Unlimited Course Outline Generation",
                "Unlimited Chapter Notes & HTML Exports",
                "Advanced Quiz & Flashcard AI Customization",
                "AI Study Tutor 24/7 Access",
                "Priority Support & Zero Rate Limits"
            ],
            popular: true,
            current: false,
            buttonText: "Upgrade to Pro ✨",
            color: "border-indigo-500 bg-gradient-to-b from-indigo-50/50 to-white shadow-xl"
        },
        {
            name: "Institution / Team",
            price: "$29.99",
            period: "per month",
            description: "Collaborative study materials for classrooms & study groups.",
            features: [
                "Everything in Pro Scholar",
                "Shared Class Repositories",
                "Export PDF / Markdown Bundles",
                "Team Analytics & Mastery Reports",
                "Dedicated Account Manager"
            ],
            current: false,
            buttonText: "Contact Sales",
            color: "border-slate-200 bg-white"
        }
    ]

    return (
        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header Banner */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold border border-indigo-100">
                    <Shield className="size-3.5" />
                    <span>Flexible Pricing</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                    Supercharge Your AI Learning Experience
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Unlock unlimited course outline generation, interactive AI tutors, and custom assessment tools.
                </p>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`rounded-3xl p-6 sm:p-8 border flex flex-col justify-between space-y-6 relative transition-all ${plan.color}`}
                    >
                        {plan.popular && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                                Most Popular
                            </span>
                        )}

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{plan.name}</h3>
                                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                <span className="text-slate-500 text-xs">/ {plan.period}</span>
                            </div>

                            <div className="space-y-2.5 pt-2">
                                {plan.features.map((feat, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700">
                                        <div className="p-0.5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                                            <Check className="size-3" />
                                        </div>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            disabled={plan.current}
                            className={`w-full font-semibold rounded-xl py-2.5 text-xs cursor-pointer transition-all ${
                                plan.popular
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20"
                                    : plan.current
                                    ? "bg-slate-100 text-slate-400 border border-slate-200"
                                    : "bg-slate-900 hover:bg-slate-800 text-white"
                            }`}
                        >
                            {plan.buttonText}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
