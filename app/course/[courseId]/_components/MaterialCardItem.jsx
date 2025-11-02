import Image from "next/image"
import { Button } from "../../../../components/ui/button"

const MaterialCardItem = ({ material }) => {

    return (
        <div className="border shadow-md rounded-lg p-5 flex flex-col items-center">
            <h2 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">Ready</h2>
            <Image
                src={material.icon}
                alt={material.name}
                width={50}
                height={50}
            />
            <h2 className="font-medium mt-3">{material.name}</h2>
            <p className="text-gray-500 text-sm text-center">{material.description}</p>
            <Button className="mt-3 w-full" variant="outline">
                View Only
            </Button>
        </div>
    )
}

export default MaterialCardItem
