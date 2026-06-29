import type { SeedLesson } from './module1-variables';

export const module4Lessons: SeedLesson[] = [
  {
    moduleSlug: 'functions',
    slug: 'defining-functions',
    title: 'Defining functions',
    summary: 'Package a block of code so you can reuse it by name.',
    sortOrder: 1,
    estimatedMinutes: 5,
    xpReward: 15,
    content: {
      introduction:
        'A function is a named, reusable block of code. Instead of copying the same lines everywhere you need them, you define the logic once and "call" it by name whenever you need it.',
      explanation:
        'Define a function with def name():, followed by an indented block — the same indentation rule as if statements and loops. You "call" (run) the function later by writing its name followed by parentheses. Functions don\u2019t run when defined; they only run when called.',
      visualExamples: [
        { label: 'Defining a function', code: 'def greet():\n    print("Hello!")' },
        { label: 'Calling it', code: 'greet()' },
      ],
      codeExample: {
        code: 'def greet():\n    print("Hello!")\n\nprint("Before calling")\ngreet()\nprint("After calling")',
        expectedOutput: 'Before calling\nHello!\nAfter calling',
      },
      commonMistakes: [
        {
          mistake: 'Forgetting the parentheses when calling a function, like greet instead of greet().',
          why: 'Without parentheses, you\u2019re referring to the function itself, not running it — nothing happens, and no error is raised, which makes this an easy mistake to miss.',
        },
        {
          mistake: 'Expecting code in a function to run immediately when it\u2019s defined.',
          why: 'def only creates the function — the code inside only runs once you actually call it later with greet().',
        },
      ],
      tips: [
        'Function names should be verbs or verb phrases describing what they do — calculate_total, send_email, not just data or stuff.',
        'You can define a function anywhere above where you call it, but it\u2019s conventional to group all function definitions near the top of a file.',
      ],
      quiz: [
        {
          question: 'What happens when Python runs a "def" line by itself, without calling the function?',
          options: ['The function body runs immediately', 'The function is defined but its body doesn\u2019t run yet', 'A syntax error occurs', 'Nothing is created'],
          correctIndex: 1,
          explanation: 'def only creates the function in memory — the body inside only executes once you call the function by name with parentheses.',
        },
      ],
      summary:
        'def name(): defines a reusable block of code. The block only runs when you call the function by name with parentheses.',
    },
  },
  {
    moduleSlug: 'functions',
    slug: 'parameters-and-return-values',
    title: 'Parameters & return values',
    summary: 'Pass information into a function, and get a result back out.',
    sortOrder: 2,
    estimatedMinutes: 6,
    xpReward: 20,
    content: {
      introduction:
        'Parameters let a function accept input. return lets a function send a result back to wherever it was called from, instead of just printing something directly.',
      explanation:
        'Parameters go inside the parentheses in the function definition, and become local variables inside the function. When calling the function, you provide matching "arguments" — the actual values. return ends the function and hands back a value, which you can then store in a variable or use right away. A function without an explicit return implicitly returns None.',
      visualExamples: [
        { label: 'A parameter', code: 'def greet(name):\n    print(f"Hello, {name}!")' },
        { label: 'A return value', code: 'def add(a, b):\n    return a + b' },
      ],
      codeExample: {
        code: 'def add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)\nprint(add(10, 20))',
        expectedOutput: '7\n30',
      },
      commonMistakes: [
        {
          mistake: 'Using print() inside a function when the caller actually needs the value back via return.',
          why: 'print() only displays a value — it doesn\u2019t hand it back to the rest of the program. If you write result = add(3, 4) but add() only prints, result ends up being None.',
        },
        {
          mistake: 'Calling a function with the wrong number of arguments.',
          why: 'If a function is defined with two parameters, like def add(a, b), calling add(3) (only one argument) raises a TypeError — Python requires every parameter to get a value unless it has a default.',
        },
      ],
      tips: [
        'You can give a parameter a default value, like def greet(name="friend"):, making the argument optional when calling it.',
        'A function can return multiple values at once, separated by commas — Python packages them together automatically, a feature worth knowing exists even before you need it.',
      ],
      quiz: [
        {
          question: 'What does a function return if it has no explicit return statement?',
          options: ['0', 'An empty string', 'None', 'It raises an error'],
          correctIndex: 2,
          explanation: 'Without an explicit return, Python functions implicitly return None when they finish running.',
        },
      ],
      summary:
        'Parameters accept input when a function is called. return sends a result back to the caller — without it, the function returns None.',
    },
  },
  {
    moduleSlug: 'functions',
    slug: 'scope-basics',
    title: 'Scope basics',
    summary: 'Where a variable exists, and where it doesn\u2019t.',
    sortOrder: 3,
    estimatedMinutes: 5,
    xpReward: 20,
    content: {
      introduction:
        'Scope determines where in your code a variable can be used. A variable created inside a function generally only exists inside that function.',
      explanation:
        'Variables defined inside a function are "local" — they exist only while that function is running, and disappear once it finishes. Variables defined outside any function, at the top level of a file, are "global" and can be read from inside functions, though modifying a global variable from inside a function needs the "global" keyword (an edge case you\u2019ll rarely need early on).',
      visualExamples: [
        { label: 'A local variable', code: 'def calculate():\n    total = 10\n    return total' },
        { label: 'Trying to use it outside', code: 'calculate()\nprint(total)  # Error: total doesn\u2019t exist here' },
      ],
      codeExample: {
        code: 'def calculate():\n    total = 10\n    return total\n\nresult = calculate()\nprint(result)',
        expectedOutput: '10',
      },
      commonMistakes: [
        {
          mistake: 'Trying to access a function\u2019s local variable from outside that function.',
          why: 'Local variables only exist while their function is running. Once the function returns, they\u2019re gone — only the returned value (if any) survives.',
        },
        {
          mistake: 'Assuming two functions can\u2019t use the same variable name without conflict.',
          why: 'Actually the opposite is true and is often a source of confusion the other way: each function has its own separate local scope, so reusing a name like total in two different functions is completely safe and won\u2019t cause a clash.',
        },
      ],
      tips: [
        'If you find yourself needing a function to permanently change a variable outside itself, consider having it return the new value instead — it\u2019s usually clearer than relying on global state.',
        'When debugging a "variable not defined" error, check whether the variable was created inside a function that already finished running.',
      ],
      quiz: [
        {
          question: 'What happens to a local variable once its function finishes running?',
          options: ['It becomes global', 'It keeps its last value forever', 'It stops existing', 'It resets to None'],
          correctIndex: 2,
          explanation: 'Local variables exist only for the duration of the function call — once the function returns, they\u2019re gone entirely.',
        },
      ],
      summary:
        'Variables created inside a function are local and disappear once the function finishes. Variables at the top level of a file are global and readable from inside functions.',
    },
  },
];
