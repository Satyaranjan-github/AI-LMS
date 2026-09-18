import { Button } from "../../../../components/ui/button"

function StateProgress({ stepCount, setStepCount, data }) {
    return (
        <div className="flex gap-2 sm:gap-4 items-center w-full my-4">
            {stepCount !== 0 ? (
                <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount - 1)} className="text-xs">
                    Prev
                </Button>
            ) : (
                <div className="w-[50px]" />
            )}

            <div className="flex gap-1.5 flex-1 items-center">
                {data?.map((item, index) => (
                    <div
                        key={index}
                        className={`h-2 flex-1 rounded-full transition-all ${
                            index <= stepCount ? "bg-primary" : "bg-slate-200"
                        }`}
                    />
                ))}
            </div>

            {stepCount < (data?.length - 1 || 0) && (
                <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount + 1)} className="text-xs">
                    Next
                </Button>
            )}
        </div>
    )
}

export default StateProgress
