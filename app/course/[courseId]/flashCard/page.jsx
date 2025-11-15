"use client"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem } from "../../../../components/ui/carousel"
import FlashcardItem from "./_components/FlashcardItem"

function FlashCard() {
    const { courseId } = useParams()
    const [flashCards, setFlashCards] = useState([])
    const [isFlipped, setIsFlipped] = useState()
    const [api, setApi] = useState()

    const GetFlashCards = async () => {
        const result = await axios.post("/api/study-type", {
            courseId: courseId,
            studyType: "Flashcard"
        })
        setFlashCards(result?.data)
    }

    const handleClick = () => {
        setIsFlipped(!isFlipped)
    }

    useEffect(() => {
        GetFlashCards()
    }, [])

    useEffect(() => {
        if (!api) {
            return
        }
        api.on("select", () => {
            setIsFlipped(false)
        })
    }, [api])

    return (
        <div>
            <h2 className="font-bold text-2xl">FlashCards</h2>
            <p>Flashcards: The Ultimate Tool to lock in Concepts!</p>
            <div>
                <Carousel setApi={setApi}>
                    <CarouselContent>
                        {flashCards?.content?.map((flashcard, index) => (
                            <CarouselItem key={index} className="flex items-center justify-center">
                                <FlashcardItem
                                    isFlipped={isFlipped}
                                    handleClick={handleClick}
                                    flashcard={flashcard}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    )
}

export default FlashCard
