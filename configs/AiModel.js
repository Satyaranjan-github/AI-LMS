const { GoogleGenerativeAI } = require('@google/generative-ai')

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
})

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
}

export const courseOutline = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "Generate a study material for Python for Exam and level of difficulty will be Easy with summery of course, List of Chapters along with summery for each chapter, Topic list in each chapter in JSON format." }
            ]
        }, {
            role: "model",
            parts: [
                {
                    text: `{
            "courseTitle": "Python Basics for Beginners (Easy Level)",
            "courseSummary": "This study material is designed for absolute beginners looking to grasp the fundamental concepts of Python programming. It covers essential syntax, data types, control flow, functions, and basic data structures, preparing you for entry-level Python exams.",
            "chapters": [
              {
                "chapterNumber": 1,
                "chapterTitle": "Introduction to Python",
                "chapterSummary": "This chapter introduces Python, its history, advantages, and how to set up your development environment. It also covers your first 'Hello World!' program.",
                "topics": [
                  "What is Python?",
                  "History and Applications of Python",
                  "Setting Up Python (Installation)",
                  "Running Your First Python Program ('Hello World!')",
                  "Python Interpreter"
                ]
              },
              {
                "chapterNumber": 2,
                "chapterTitle": "Variables and Basic Data Types",
                "chapterSummary": "Learn about how to store information in variables and explore Python's fundamental data types: integers, floats, strings, and booleans.",
                "topics": [
                  "What are Variables?",
                  "Variable Naming Rules",
                  "Assigning Values to Variables",
                  "Integer Data Type (int)",
                  "Floating-Point Data Type (float)",
                  "String Data Type (str)",
                  "Boolean Data Type (bool)",
                  "Type Conversion (e.g., int(), str())"
                ]
              },
              {
                "chapterNumber": 3,
                "chapterTitle": "Operators",
                "chapterSummary": "Understand different types of operators used in Python for performing calculations, comparisons, and logical operations.",
                "topics": [
                  "Arithmetic Operators (+, -, *, /, %, //, **)",
                  "Comparison Operators (==, !=, <, >, <=, >=)",
                  "Logical Operators (and, or, not)",
                  "Assignment Operators (=, +=, -=, etc.)",
                  "Operator Precedence"
                ]
              },
              {
                "chapterNumber": 4,
                "chapterTitle": "Input and Output",
                "chapterSummary": "Learn how to interact with your Python programs by taking input from the user and displaying output to the console.",
                "topics": [
                  "The print() Function",
                  "Formatted Output (f-strings)",
                  "The input() Function",
                  "Converting Input Data Types"
                ]
              },
              {
                "chapterNumber": 5,
                "chapterTitle": "Control Flow: Conditional Statements",
                "chapterSummary": "Explore how to make decisions in your code using if, elif, and else statements, allowing your programs to execute different blocks of code based on conditions.",
                "topics": [
                  "Introduction to Control Flow",
                  "The if Statement",
                  "The if-else Statement",
                  "The if-elif-else Statement",
                  "Nested if Statements"
                ]
              },
              {
                "chapterNumber": 6,
                "chapterTitle": "Control Flow: Loops",
                "chapterSummary": "Discover how to repeat actions in your code using while and for loops, essential for automating repetitive tasks.",
                "topics": [
                  "The while Loop",
                  "The for Loop (with range())",
                  "Iterating Over Strings",
                  "break Statement",
                  "continue Statement",
                  "else Block with Loops"
                ]
              },
              {
                "chapterNumber": 7,
                "chapterTitle": "Functions",
                "chapterSummary": "Understand how to define and use functions to organize your code, make it reusable, and improve readability.",
                "topics": [
                  "What are Functions?",
                  "Defining a Function (def keyword)",
                  "Calling a Function",
                  "Function Parameters and Arguments",
                  "Return Values",
                  "Built-in Functions (e.g., len(), max(), min())"
                ]
              },
              {
                "chapterNumber": 8,
                "chapterTitle": "Basic Data Structures: Lists",
                "chapterSummary": "Get introduced to lists, a fundamental data structure in Python, allowing you to store collections of items.",
                "topics": [
                  "What are Lists?",
                  "Creating Lists",
                  "Accessing List Elements (Indexing)",
                  "Slicing Lists",
                  "Modifying List Elements",
                  "List Methods (append(), insert(), remove(), pop())",
                  "List Length (len())",
                  "Iterating Over Lists"
                ]
              }
            ]
          }`
                }
            ]
        }
    ],
})