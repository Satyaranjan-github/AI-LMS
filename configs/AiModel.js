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

export const generateNotesAiModel = model.startChat({
  generationConfig,
  history: [
    // AI will take input like this 
    {
      role: 'user',
      parts: [{
        text:
          `Generate exam material details content for each chapter, Make sure to includes all topic point in the content, make sure to give content in hTML format (Do not Add HTMLK,Head,Body,Title tag). The Chapters:`
      }
      ]
    },
    // this is defined to tell AI how we require result 
    {
      role: "model",
      parts: [
        {
          text: "<h2>Chapter 1: Introduction to JavaScript</h2>\
<h3>Exam Material Details</h3>\
<h4>What is JavaScript?</h4>\
<ul>\
  <li>Definition and purpose of JavaScript</li>\
  <li>History and evolution of JavaScript</li>\
  <li>Key features and characteristics (e.g., scripting language, object-oriented, dynamic, weakly typed)</li>\
  <li>Relationship with other web technologies (HTML, CSS)</li>\
  <li>Use cases beyond web browsers (Node.js, mobile apps, desktop apps)</li>\
</ul>\
<h4>Client-side vs. Server-side JavaScript</h4>\
<ul>\
  <li><strong>Client-side JavaScript:</strong>\
    <ul>\
      <li>Execution environment (browser)</li>\
      <li>Purpose (interactivity, DOM manipulation, form validation, AJAX)</li>\
      <li>Examples of client-side operations</li>\
    </ul>\
  </li>\
  <li><strong>Server-side JavaScript:</strong>\
    <ul>\
      <li>Execution environment (Node.js)</li>\
      <li>Purpose (backend logic, API creation, database interaction)</li>\
      <li>Examples of server-side operations</li>\
    </ul>\
  </li>\
  <li>Key differences and similarities</li>\
</ul>\
<h4>How to include JavaScript in HTML (&lt;script&gt; tag)</h4>\
<ul>\
  <li><strong>Inline JavaScript:</strong>\
    <ul>\
      <li>Using onclick or other event attributes</li>\
      <li>Advantages and disadvantages</li>\
    </ul>\
  </li>\
  <li><strong>Internal JavaScript:</strong>\
    <ul>\
      <li>Placing &lt;script&gt; tags within the HTML document (&lt;head&gt; vs. &lt;body&gt;)</li>\
      <li>Understanding render-blocking behavior</li>\
      <li>Best practices for placement</li>\
    </ul>\
  </li>\
  <li><strong>External JavaScript:</strong>\
    <ul>\
      <li>Linking to external .js files using the src attribute</li>\
      <li>Advantages (caching, separation of concerns, reusability)</li>\
      <li>Using async and defer attributes:\
        <ul>\
          <li>Purpose and impact on script loading and execution</li>\
          <li>Differences between async and defer</li>\
          <li>When to use each</li>\
        </ul>\
      </li>\
    </ul>\
  </li>\
</ul>\
<h4>Commenting in JavaScript</h4>\
<ul>\
  <li>Purpose of comments (documentation, explaining code, debugging)</li>\
  <li><strong>Single-line comments:</strong>\
    <ul>\
      <li>Syntax (//)</li>\
      <li>Examples of usage</li>\
    </ul>\
  </li>\
  <li><strong>Multi-line comments:</strong>\
    <ul>\
      <li>Syntax (/* ... */)</li>\
      <li>Examples of usage (e.g., block comments, JSDoc style)</li>\
    </ul>\
  </li>\
  <li>Best practices for commenting</li>\
</ul>\
<h4>The Console (console.log())</h4>\
<ul>\
  <li>Introduction to the browser's developer console</li>\
  <li>Purpose of console.log() for debugging and outputting information</li>\
  <li>Basic usage and syntax of console.log()</li>\
  <li>Other console methods (e.g., console.warn(), console.error(), console.info(), console.table(), console.dir()) — awareness of their existence and general purpose</li>\
  <li>Accessing the console in different browsers</li>\
</ul>"
        }
      ]
    }
  ]
})