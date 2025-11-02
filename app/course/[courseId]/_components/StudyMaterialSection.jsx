
import MaterialCardItem from "./MaterialCardItem"

const StudyMaterialSection = () => {
    const materialList = [
        {
            name: "Notes/Chapters",
            description: "Read Notes To Prepare it",
            icon: "/notes.png",
            path: "/notes"
        },
        {
            name: "Flashcard",
            description: "Flashcard help to remember the concepts",
            icon: "/flashcard.png",
            path: "/flashcards"
        },
        {
            name: "Quiz",
            description: "Great way to test your knowledge",
            icon: "/quiz.png",
            path: "/quiz"
        },
        {
            name: "Question/Answer",
            description: "Help to practice your knowledge",
            icon: "/notes.png",
            path: "/notes"
        },
    ]

    return (
        <div className="mt-5">
            <h2 className="font-medium text-2xl ">Study Material</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
                {materialList.map((material, index) => (
                    <MaterialCardItem key={index} material={material} />
                ))}
            </div>
        </div>
    )
}

export default StudyMaterialSection
