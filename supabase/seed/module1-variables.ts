import type { LessonContent } from '../../src/types/lesson';

export interface SeedLesson {
  moduleSlug: string;
  slug: string;
  title: string;
  summary: string;
  sortOrder: number;
  estimatedMinutes: number;
  xpReward: number;
  content: LessonContent;
}

export const module1Lessons: SeedLesson[] = [
  {
    moduleSlug: 'variables-data-types',
    slug: 'what-is-a-variable',
    title: 'What is a variable?',
    summary: 'Store and label a value so you can use it again later.',
    sortOrder: 1,
    estimatedMinutes: 4,
    xpReward: 10,
    content: {
      introduction:
        'A variable is a name that points to a value stored in memory. Instead of retyping a value every time you need it, you give it a name once and reuse that name.',
      explanation:
        'In Python, you create a variable by writing a name, an equals sign, and a value. There is no need to declare a type up front — Python figures out the type from the value itself. Variable names should describe what they hold: "age" is clearer than "a", and clarity matters more than brevity once code gets longer than a few lines.',
      visualExamples: [
        { label: 'Assigning a number', code: 'age = 28' },
        { label: 'Assigning text', code: 'name = "Maya"' },
        { label: 'Reassigning later', code: 'age = 29' },
      ],
      codeExample: {
        code: 'name = "Maya"\nage = 28\nprint(name)\nprint(age)',
        expectedOutput: 'Maya\n28',
      },
      commonMistakes: [
        {
          mistake: 'Using a number as the first character of a variable name, like 1st_try = 5.',
          why: 'Python variable names can\u2019t start with a digit. Start with a letter or underscore instead, e.g. first_try.',
        },
        {
          mistake: 'Forgetting that variable names are case-sensitive.',
          why: 'age and Age are two completely different variables to Python, which is a common source of confusing bugs.',
        },
      ],
      tips: [
        'Use snake_case for variable names in Python (lowercase words separated by underscores) — it\u2019s the convention nearly all Python code follows.',
        'Pick names that describe the value\u2019s purpose, not its type. total is better than my_int.',
      ],
      quiz: [
        {
          question: 'Which of these is a valid Python variable name?',
          options: ['2nd_place', 'second_place', 'second-place', 'second place'],
          correctIndex: 1,
          explanation:
            'Variable names can\u2019t start with a digit, and can\u2019t contain hyphens or spaces — underscores are used instead.',
        },
      ],
      summary:
        'A variable is a named reference to a value. Create one with name = value, and Python infers the type automatically.',
    },
  },
  {
    moduleSlug: 'variables-data-types',
    slug: 'numbers-and-strings',
    title: 'Numbers and strings',
    summary: 'The two data types you\u2019ll use the most: numbers and text.',
    sortOrder: 2,
    estimatedMinutes: 5,
    xpReward: 10,
    content: {
      introduction:
        'Python has two number types you\u2019ll use constantly — int for whole numbers and float for decimals — plus str for text. Knowing which type you\u2019re working with matters because it changes what operations are allowed.',
      explanation:
        'An int is a whole number with no decimal point: 5, -3, 1000. A float has a decimal point, even if it\u2019s .0: 5.0, 3.14, -0.5. A str is text, always wrapped in quotes — either single or double, Python treats them the same. You can check any value\u2019s type with the built-in type() function.',
      visualExamples: [
        { label: 'An integer', code: 'count = 12' },
        { label: 'A float', code: 'price = 19.99' },
        { label: 'A string', code: 'greeting = "Hello"' },
      ],
      codeExample: {
        code: 'count = 12\nprice = 19.99\ngreeting = "Hello"\n\nprint(type(count))\nprint(type(price))\nprint(type(greeting))',
        expectedOutput: "<class 'int'>\n<class 'float'>\n<class 'str'>",
      },
      commonMistakes: [
        {
          mistake: 'Writing "5" (a string) when you meant 5 (an integer).',
          why: 'Quotes make it text, not a number — "5" + "5" gives "55" (joining text), while 5 + 5 gives 10 (adding numbers).',
        },
        {
          mistake: 'Mixing single and double quotes incorrectly, like \'don\'t\'.',
          why: 'The apostrophe ends the string early. Use double quotes for text containing an apostrophe: "don\'t".',
        },
      ],
      tips: [
        'If a number needs to support decimals later (like a price), store it as a float from the start, even if the initial value is whole: 5.0 instead of 5.',
        'type() is your best debugging friend when a calculation gives an unexpected result — check what type you\u2019re actually working with.',
      ],
      quiz: [
        {
          question: 'What is the type of the value 7.0 in Python?',
          options: ['int', 'float', 'str', 'number'],
          correctIndex: 1,
          explanation: 'Any number written with a decimal point, even 7.0, is a float — not an int.',
        },
      ],
      summary:
        'int holds whole numbers, float holds decimals, and str holds text in quotes. Use type() to check what you\u2019re working with.',
    },
  },
  {
    moduleSlug: 'variables-data-types',
    slug: 'booleans-and-none',
    title: 'Booleans and None',
    summary: 'True, False, and the special value that means "nothing."',
    sortOrder: 3,
    estimatedMinutes: 4,
    xpReward: 10,
    content: {
      introduction:
        'A boolean is one of exactly two values: True or False. Python also has a special value, None, that represents the absence of a value entirely.',
      explanation:
        'Booleans show up constantly in conditions — "is this true or false?" Note the capitalization: True and False, not true or TRUE. None is different from False or 0 — it specifically means "there is no value here yet," which is useful when a variable needs to exist before you know what it should hold.',
      visualExamples: [
        { label: 'A boolean', code: 'is_logged_in = True' },
        { label: 'Another boolean', code: 'has_paid = False' },
        { label: 'No value yet', code: 'result = None' },
      ],
      codeExample: {
        code: 'is_logged_in = True\nresult = None\n\nprint(is_logged_in)\nprint(result)\nprint(type(is_logged_in))',
        expectedOutput: "True\nNone\n<class 'bool'>",
      },
      commonMistakes: [
        {
          mistake: 'Writing true or false in lowercase.',
          why: 'Python is case-sensitive and only recognizes True and False capitalized exactly like that — lowercase versions will raise an error since they look like undefined variable names.',
        },
        {
          mistake: 'Treating None the same as False or 0.',
          why: 'They\u2019re related in conditions, but None specifically means "nothing was set," while False is a real boolean value. Mixing them up can hide bugs where a value was never actually assigned.',
        },
      ],
      tips: [
        'Use None as a placeholder for a variable you\u2019ll assign a real value to later, once you know what it should be.',
        'To check if something is specifically None, use "is None" rather than "== None" — it\u2019s the more correct and conventional way in Python.',
      ],
      quiz: [
        {
          question: 'What does None represent in Python?',
          options: ['The number zero', 'An empty string', 'The absence of a value', 'A boolean false'],
          correctIndex: 2,
          explanation: 'None specifically means "no value here" — it\u2019s distinct from 0, "", or False, even though all four can feel similar.',
        },
      ],
      summary:
        'Booleans are True or False (capitalized). None represents the absence of a value, distinct from False or 0.',
    },
  },
  {
    moduleSlug: 'variables-data-types',
    slug: 'type-conversion',
    title: 'Type conversion',
    summary: 'Convert a value from one type to another, like text to a number.',
    sortOrder: 4,
    estimatedMinutes: 5,
    xpReward: 15,
    content: {
      introduction:
        'Sometimes you have a value in one type but need it in another — a number typed as text, or a number you want to display as text. Python provides built-in functions to convert between types.',
      explanation:
        'int() converts a value to an integer, float() converts to a decimal number, and str() converts a value to text. These are especially useful when reading input, since user input always arrives as a string, even if it looks like a number.',
      visualExamples: [
        { label: 'String to int', code: 'int("42")' },
        { label: 'Int to string', code: 'str(42)' },
        { label: 'String to float', code: 'float("3.14")' },
      ],
      codeExample: {
        code: 'age_text = "25"\nage_number = int(age_text)\nnext_year = age_number + 1\n\nprint(next_year)\nprint(type(age_number))',
        expectedOutput: "26\n<class 'int'>",
      },
      commonMistakes: [
        {
          mistake: 'Trying to add a string and a number directly, like "5" + 3.',
          why: 'Python won\u2019t silently convert between types in math operations — you\u2019ll get a TypeError. Convert first: int("5") + 3.',
        },
        {
          mistake: 'Calling int() on text that isn\u2019t a valid whole number, like int("3.14").',
          why: 'int() can\u2019t parse a decimal point directly from a string. Convert to float first, then to int if you need to drop the decimal: int(float("3.14")).',
        },
      ],
      tips: [
        'Any value can be converted to a string with str() — useful when building a sentence that mixes text and numbers.',
        'If you\u2019re not sure a string is a valid number, wrap the conversion in a try/except (covered in a later lesson) rather than assuming it will always work.',
      ],
      quiz: [
        {
          question: 'What does int("7") + 3 evaluate to?',
          options: ['"73"', '10', 'An error', '7'],
          correctIndex: 1,
          explanation: 'int("7") converts the string "7" to the integer 7, so 7 + 3 correctly evaluates to 10.',
        },
      ],
      summary:
        'Use int(), float(), and str() to convert values between types — most commonly needed when working with text input that represents numbers.',
    },
  },
];
