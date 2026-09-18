"use client"

import { BookOpen, Trophy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Textarea } from "../../../components/ui/textarea"

export function TopicInput({ setTopic, setDifficultyLevel }) {
    return (
        <div className="w-full max-w-xl mx-auto space-y-5">
            <div>
                <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    <BookOpen className="size-4 text-primary" />
                    <span>Enter Topic or Paste Study Content</span>
                </label>
                <Textarea
                    placeholder="E.g., Python Data Structures, React Hooks, World War II History, Financial Accounting..."
                    className="w-full min-h-[130px] rounded-xl border-slate-200 focus:ring-primary focus:border-primary text-xs sm:text-sm p-3.5 leading-relaxed text-slate-800 placeholder:text-slate-400"
                    onChange={(e) => setTopic(e.target.value)}
                />
            </div>

            <div>
                <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    <Trophy className="size-4 text-amber-500" />
                    <span>Select Difficulty Level</span>
                </label>
                <Select onValueChange={(value) => setDifficultyLevel(value)}>
                    <SelectTrigger className="w-full rounded-xl border-slate-200 h-11 text-xs sm:text-sm text-slate-800 font-medium cursor-pointer">
                        <SelectValue placeholder="Choose Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem value="Easy" className="cursor-pointer text-xs sm:text-sm font-medium">Easy</SelectItem>
                        <SelectItem value="Moderate" className="cursor-pointer text-xs sm:text-sm font-medium">Moderate</SelectItem>
                        <SelectItem value="Hard" className="cursor-pointer text-xs sm:text-sm font-medium">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default TopicInput
