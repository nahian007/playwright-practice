# playwright-practice
Some Basic PlayGround with Playwright

## Prerequisites
1. Install Node.js

> **_NOTE:_**  Try to install node version 20 or above.

## Playwright Installation
```bash
npm init playwright@latest
```


## Command to run tests

**To Run all the text**
```bash
npx playwright test
```

**To Run a sepct**
```bash
npx playwright test -g "add a todo item"
Example: npx playwright test -g "Pull Text - Extract 5 data"
```

**To Run a specific file**
```bash
npx playwright test example.spec.ts
Example: npx playwright test productSearch.spec.ts
```

**To disable parallel execution**
```bash
npx playwright test --workers=1
Example: npx playwright test productSearch.spec.ts --workers=1
```

**Passing Environment Variables**
```bash
Example: filterKey=Mobiles brandName=Redmi npx playwright test parameterizedFilter.spec.ts --headed
Example: filterKey=Mobiles brandName=Samsung npx playwright test parameterizedFilter.spec.ts --headed
```

