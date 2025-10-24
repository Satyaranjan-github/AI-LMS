import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Textarea } from "../../../components/ui/textarea"

export function TopicInput({ setTopic, setDifficultyLevel }) {
    return (
        <div className="mt-10 w-full flex flex-col">
            <h2>Enter The topic or Paste The Content for which you want  to generate study material</h2>
            <Textarea placeholder="Enter The topic ..." className="mt-2 w-full" onChange={(e) => setTopic(e.target.value)} />
            < h2 className="mt-5 mb-3">Select the Difficulty level</h2>
            <Select onValueChange={(value) => setDifficultyLevel(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
            </Select>
        </div >
    )
}

export default TopicInput
