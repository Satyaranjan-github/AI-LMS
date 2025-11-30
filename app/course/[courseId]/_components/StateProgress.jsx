import { Button } from "../../../../components/ui/button"

function StateProgress({ stepCount, setStepCount, data }) {
    return (
        <div className="flex gap-5 items-center">
            {stepCount !== 0 && <Button
                variant="outline" onClick={() => setStepCount(stepCount - 1)}>Previous</Button>}
            {data?.map((item, index) => (
                <div key={index} className={`w-full h-2 rounded-full ${index < stepCount ? "bg-primary" : "bg-gray-200"}`} >
                </div>
            ))}
            <Button variant="outline" onClick={() => setStepCount(stepCount + 1)}>Next</Button>
        </div >
    )
}

export default StateProgress
