import type { SeedLesson } from './module1-variables';

export const module2Lessons: SeedLesson[] = [
  {
    moduleSlug: 'operators',
    slug: 'arithmetic-operators',
    title: 'Arithmetic operators',
    summary: 'Add, subtract, multiply, divide, and a few less obvious ones.',
    sortOrder: 1,
    estimatedMinutes: 5,
    xpReward: 10,
    content: {
      introduction:
        'Arithmetic operators do math: +, -, *, /, and a couple of operators that aren\u2019t in basic math class but come up constantly in code.',
      explanation:
        'Beyond the four you already know, Python has // (floor division, which divides and drops the remainder), % (modulo, which gives just the remainder), and ** (exponent, for powers). Regular division (/) always returns a float, even when dividing evenly — 10 / 2 gives 5.0, not 5.',
      visualExamples: [
        { label: 'Floor division', code: '17 // 5' },
        { label: 'Modulo (remainder)', code: '17 % 5' },
        { label: 'Exponent', code: '2 ** 5' },
      ],
      codeExample: {
        code: 'a = 17\nb = 5\n\nprint(a / b)\nprint(a // b)\nprint(a % b)\nprint(a ** 2)',
        expectedOutput: '3.4\n3\n2\n289',
      },
      commonMistakes: [
        {
          mistake: 'Using ^ for exponents, like 2 ^ 5.',
          why: 'In Python, ^ is a different operator entirely (bitwise XOR). Use ** for powers: 2 ** 5.',
        },
        {
          mistake: 'Expecting / to always give a whole number when dividing evenly.',
          why: '/ always returns a float in Python 3. If you specifically need a whole-number result, use // instead.',
        },
      ],
      tips: [
        '% is the operator to reach for when you need to check "is this number even?" — a number is even if number % 2 == 0.',
        'Order of operations follows standard math rules: ** before * and /, which come before + and -.',
      ],
      quiz: [
        {
          question: 'What does 10 % 3 evaluate to?',
          options: ['3', '3.33', '1', '0'],
          correctIndex: 2,
          explanation: '10 divided by 3 is 3 with a remainder of 1 — % returns just that remainder.',
        },
      ],
      summary:
        'Beyond +, -, *, /, Python has // (floor division), % (remainder), and ** (exponent). Regular division always returns a float.',
    },
  },
  {
    moduleSlug: 'operators',
    slug: 'comparison-and-logical-operators',
    title: 'Comparison & logical operators',
    summary: 'Compare values and combine multiple conditions.',
    sortOrder: 2,
    estimatedMinutes: 5,
    xpReward: 10,
    content: {
      introduction:
        'Comparison operators ask a yes/no question about two values and return a boolean. Logical operators combine multiple such questions into a single one.',
      explanation:
        'Comparisons include == (equal to), != (not equal to), >, <, >=, and <=. Note the double equals for comparison — a single = is for assignment, a completely different operation. Logical operators are and, or, and not: "and" is true only if both sides are true, "or" is true if at least one side is true, and "not" flips a boolean.',
      visualExamples: [
        { label: 'Equality check', code: 'age == 18' },
        { label: 'Combining conditions', code: 'age >= 13 and age <= 19' },
        { label: 'Negation', code: 'not is_logged_in' },
      ],
      codeExample: {
        code: 'age = 16\nis_teen = age >= 13 and age <= 19\nis_adult = age >= 18\n\nprint(is_teen)\nprint(is_adult)\nprint(not is_adult)',
        expectedOutput: 'True\nFalse\nTrue',
      },
      commonMistakes: [
        {
          mistake: 'Using a single = when you mean to compare, like if age = 18:.',
          why: 'A single = is assignment, not comparison, and Python will raise a syntax error in a condition. Use == to compare.',
        },
        {
          mistake: 'Writing age >= 13 and <= 19 without repeating "age" on the second side.',
          why: 'Python doesn\u2019t infer the left side automatically like some math notation does — each comparison needs its own full expression: age >= 13 and age <= 19.',
        },
      ],
      tips: [
        '!= reads naturally as "is not equal to" — useful for "keep going until this condition stops being true" patterns.',
        'You can chain comparisons directly in Python: 13 <= age <= 19 works and means the same as the and version above.',
      ],
      quiz: [
        {
          question: 'What does 5 != 5 evaluate to?',
          options: ['True', 'False', '0', 'An error'],
          correctIndex: 1,
          explanation: '!= means "is not equal to" \u2014 since 5 does equal 5, the comparison is False.',
        },
      ],
      summary:
        'Comparison operators (==, !=, >, <, >=, <=) return booleans. Logical operators (and, or, not) combine or invert them.',
    },
  },
  {
    moduleSlug: 'operators',
    slug: 'operator-precedence',
    title: 'Operator precedence',
    summary: 'Which operators run first when an expression has several.',
    sortOrder: 3,
    estimatedMinutes: 4,
    xpReward: 10,
    content: {
      introduction:
        'When an expression has multiple operators, Python evaluates them in a specific order — the same general order you learned in math class, extended to cover Python\u2019s extra operators.',
      explanation:
        'From highest to lowest priority: parentheses first, then ** (exponent), then * / // % (multiplication-family), then + - (addition-family), then comparisons, then logical operators (not, then and, then or). When in doubt, parentheses always win and make intent clearer to a reader, even when they aren\u2019t strictly required.',
      visualExamples: [
        { label: 'Without parentheses', code: '2 + 3 * 4' },
        { label: 'With parentheses', code: '(2 + 3) * 4' },
        { label: 'Mixed operators', code: '10 - 2 ** 2' },
      ],
      codeExample: {
        code: 'result_a = 2 + 3 * 4\nresult_b = (2 + 3) * 4\nresult_c = 10 - 2 ** 2\n\nprint(result_a)\nprint(result_b)\nprint(result_c)',
        expectedOutput: '14\n20\n6',
      },
      commonMistakes: [
        {
          mistake: 'Assuming Python evaluates strictly left to right, ignoring operator priority.',
          why: '2 + 3 * 4 is 14, not 20 — multiplication runs before addition regardless of left-to-right order in the text.',
        },
        {
          mistake: 'Skipping parentheses in a complex condition and getting unexpected logic.',
          why: 'a or b and c evaluates "and" before "or", which may not match what you intended. Parenthesize to be explicit: a or (b and c).',
        },
      ],
      tips: [
        'When precedence rules might be unclear to a future reader (including future you), add parentheses even if they\u2019re not required — clarity beats cleverness.',
        'If a calculation gives a surprising result, print() each sub-part separately to see where the order of operations diverged from your expectation.',
      ],
      quiz: [
        {
          question: 'What does 4 + 2 ** 2 evaluate to?',
          options: ['36', '8', '12', '16'],
          correctIndex: 1,
          explanation: '** runs before +, so this is 4 + (2 ** 2) = 4 + 4 = 8.',
        },
      ],
      summary:
        'Python follows a fixed order of operations: parentheses, then **, then * / // %, then + -, then comparisons, then logical operators. Use parentheses to make intent explicit.',
    },
  },
];
