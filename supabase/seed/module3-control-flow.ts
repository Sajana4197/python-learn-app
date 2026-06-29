import type { SeedLesson } from './module1-variables';

export const module3Lessons: SeedLesson[] = [
  {
    moduleSlug: 'control-flow-loops',
    slug: 'if-elif-else',
    title: 'if, elif, else',
    summary: 'Make your code run different paths depending on a condition.',
    sortOrder: 1,
    estimatedMinutes: 5,
    xpReward: 15,
    content: {
      introduction:
        'An if statement runs a block of code only when a condition is true. elif and else let you handle additional conditions and a fallback case.',
      explanation:
        'The structure is: if condition:, then an indented block that runs if the condition is true. elif (else if) checks another condition only if the previous ones were false. else catches everything not already handled. Python uses indentation — not curly braces — to mark which lines belong to which block, so consistent indentation is not optional, it\u2019s part of the syntax.',
      visualExamples: [
        { label: 'Simple if', code: 'if age >= 18:\n    print("Adult")' },
        { label: 'if/else', code: 'if age >= 18:\n    print("Adult")\nelse:\n    print("Minor")' },
      ],
      codeExample: {
        code: 'score = 75\n\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelse:\n    print("F")',
        expectedOutput: 'C',
      },
      commonMistakes: [
        {
          mistake: 'Forgetting the colon at the end of the if line.',
          why: 'Python requires a colon to mark the start of the indented block — if score >= 90 without the colon is a syntax error.',
        },
        {
          mistake: 'Inconsistent indentation, mixing tabs and spaces, or different indent widths in the same block.',
          why: 'Since indentation IS the syntax in Python, mismatched indentation raises an IndentationError. Stick to one style (4 spaces is the near-universal convention) throughout a file.',
        },
      ],
      tips: [
        'Only the first matching condition in an if/elif chain runs — once one matches, Python skips the rest, even if a later condition would also be true.',
        'If you only have two outcomes, you usually only need if/else — save elif for when there are genuinely three or more distinct paths.',
      ],
      quiz: [
        {
          question: 'In an if/elif/else chain, how many blocks can run for a single check?',
          options: ['Only one — the first matching condition', 'All matching conditions', 'Only the else block', 'It depends on the order'],
          correctIndex: 0,
          explanation: 'Python stops checking after the first true condition in the chain and runs only that block.',
        },
      ],
      summary:
        'if/elif/else let code branch based on conditions. Indentation marks each block — it\u2019s required syntax, not just style.',
    },
  },
  {
    moduleSlug: 'control-flow-loops',
    slug: 'while-loops',
    title: 'while loops',
    summary: 'Repeat a block of code as long as a condition stays true.',
    sortOrder: 2,
    estimatedMinutes: 5,
    xpReward: 15,
    content: {
      introduction:
        'A while loop repeats a block of code for as long as its condition remains true. It\u2019s the right tool when you don\u2019t know in advance exactly how many times you need to repeat something.',
      explanation:
        'The loop checks its condition before each pass. If the condition is true, the block runs, then Python checks the condition again — and again — until it becomes false. The block needs to do something that eventually makes the condition false, or the loop runs forever (an "infinite loop"), which is one of the most common beginner bugs.',
      visualExamples: [
        { label: 'Basic countdown', code: 'count = 3\nwhile count > 0:\n    print(count)\n    count -= 1' },
      ],
      codeExample: {
        code: 'count = 3\nwhile count > 0:\n    print(count)\n    count -= 1\nprint("Done!")',
        expectedOutput: '3\n2\n1\nDone!',
      },
      commonMistakes: [
        {
          mistake: 'Forgetting to update the variable the condition depends on, like leaving out count -= 1.',
          why: 'Without something changing inside the loop, the condition never becomes false, and the loop runs forever — you\u2019d need to manually stop the program.',
        },
        {
          mistake: 'Using while when the number of repetitions is already known ahead of time.',
          why: 'If you know you need exactly 10 repetitions, a for loop (next lesson) is usually clearer and less error-prone than manually managing a counter with while.',
        },
      ],
      tips: [
        'while True: combined with a break statement inside is a common, deliberate pattern for "loop until something specific happens," rather than an infinite-loop bug.',
        'If a while loop seems stuck, double-check that the condition variable is actually being changed somewhere inside the loop body.',
      ],
      quiz: [
        {
          question: 'What\u2019s the main risk specific to while loops that for loops mostly avoid?',
          options: ['Syntax errors', 'Infinite loops', 'Indentation errors', 'Type errors'],
          correctIndex: 1,
          explanation: 'Because while depends entirely on a condition you manage yourself, forgetting to update it causes the loop to never end.',
        },
      ],
      summary:
        'while loops repeat as long as a condition is true. Make sure something inside the loop eventually makes the condition false.',
    },
  },
  {
    moduleSlug: 'control-flow-loops',
    slug: 'for-loops',
    title: 'for loops',
    summary: 'Repeat code once for each item in a sequence.',
    sortOrder: 3,
    estimatedMinutes: 5,
    xpReward: 15,
    content: {
      introduction:
        'A for loop runs a block of code once for each item in a sequence — like each character in a string, or each number in a range. It\u2019s the most common loop in everyday Python.',
      explanation:
        'The structure is for variable in sequence:, where "variable" takes on each value in "sequence", one at a time. range() is the most common sequence to loop over when you want to repeat something a specific number of times: range(5) produces 0, 1, 2, 3, 4 — five values, starting at 0.',
      visualExamples: [
        { label: 'Looping over a range', code: 'for i in range(3):\n    print(i)' },
        { label: 'Looping over a string', code: 'for letter in "Hi":\n    print(letter)' },
      ],
      codeExample: {
        code: 'for i in range(5):\n    print(i * 2)',
        expectedOutput: '0\n2\n4\n6\n8',
      },
      commonMistakes: [
        {
          mistake: 'Expecting range(5) to include 5.',
          why: 'range(5) produces 0 through 4 — five numbers total, but stopping just before 5. range(start, stop) works the same way: the stop value is never included.',
        },
        {
          mistake: 'Trying to modify a list while looping over it directly.',
          why: 'Changing a sequence\u2019s length while iterating over it can skip items or cause errors. This is a more advanced pitfall worth knowing about even before you hit it.',
        },
      ],
      tips: [
        'range(start, stop, step) lets you control where the loop begins, ends, and how much it increases each time — e.g. range(0, 10, 2) gives even numbers 0 through 8.',
        'If you need both the index and the value while looping, enumerate() is the idiomatic tool — you\u2019ll meet it once lists are covered.',
      ],
      quiz: [
        {
          question: 'How many times does the loop body run for `for i in range(4):`?',
          options: ['3', '4', '5', 'It depends on i'],
          correctIndex: 1,
          explanation: 'range(4) produces 0, 1, 2, 3 — four values — so the loop body runs exactly four times.',
        },
      ],
      summary:
        'for loops repeat once per item in a sequence. range() generates a sequence of numbers, commonly used to repeat something a fixed number of times.',
    },
  },
  {
    moduleSlug: 'control-flow-loops',
    slug: 'break-and-continue',
    title: 'break & continue',
    summary: 'Exit a loop early, or skip to the next iteration.',
    sortOrder: 4,
    estimatedMinutes: 4,
    xpReward: 15,
    content: {
      introduction:
        'break stops a loop immediately, regardless of its condition. continue skips the rest of the current iteration and moves on to the next one.',
      explanation:
        'Both work inside for and while loops. break is useful for "stop searching once you\u2019ve found what you need" patterns. continue is useful for "skip this particular item, but keep going" patterns — like skipping over values that don\u2019t meet some criteria without exiting the loop entirely.',
      visualExamples: [
        { label: 'Stopping early', code: 'for n in range(10):\n    if n == 5:\n        break\n    print(n)' },
        { label: 'Skipping an item', code: 'for n in range(5):\n    if n == 2:\n        continue\n    print(n)' },
      ],
      codeExample: {
        code: 'for n in range(10):\n    if n == 5:\n        break\n    if n % 2 == 0:\n        continue\n    print(n)',
        expectedOutput: '1\n3',
      },
      commonMistakes: [
        {
          mistake: 'Using break when continue was actually intended, or vice versa.',
          why: 'break exits the entire loop; continue only skips the current pass and keeps looping. Mixing them up either ends a loop too early or never skips the item you meant to skip.',
        },
        {
          mistake: 'Putting break or continue outside of any loop.',
          why: 'Both only make sense inside a for or while loop — using them elsewhere raises a SyntaxError.',
        },
      ],
      tips: [
        'Trace through the example above mentally, one number at a time, if the output isn\u2019t immediately obvious — this is one of the few lessons worth stepping through by hand.',
        'A loop with break is often paired with else on the loop itself (an intermediate-level pattern) to detect "did we ever find it?" — worth knowing exists, even if you don\u2019t need it yet.',
      ],
      quiz: [
        {
          question: 'What does continue do inside a loop?',
          options: ['Stops the loop completely', 'Skips the rest of the current iteration and moves to the next one', 'Restarts the loop from the beginning', 'Pauses the loop'],
          correctIndex: 1,
          explanation: 'continue jumps straight to the next iteration, skipping any remaining code in the current pass — it does not exit the loop.',
        },
      ],
      summary:
        'break exits a loop immediately. continue skips to the next iteration without exiting. Both only work inside a loop.',
    },
  },
];
