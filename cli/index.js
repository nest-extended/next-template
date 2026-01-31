const createFileWithContent = require('./createFileWithContent');
const getSchema = require('./schema');
const getModule = require('./module');
const getService = require('./service');
const getController = require('./controller');
const getDto = require('./dto');
const getServiceSpec = require('./service.spec.js');
const getControllerSpec = require('./controller.spec.js');
const fs = require('fs');
const path = require('path');

const arg = process.argv?.[2];

if (!arg) {
  console.error('Please provide a name for the module');
  process.exit(1);
}

// if arg have '-' change to camelCase
const argArray = arg.split('-');
argArray.forEach((arg, index) => {
  argArray[index] = arg[0].toUpperCase() + arg.slice(1).toLowerCase();
});
const Name = argArray.join('');
const name = Name[0].toLowerCase() + Name.slice(1);

// Function to update app.module.ts with the new module
function updateAppModule(Name, name) {
  const appModulePath = path.join(process.cwd(), 'src/app.module.ts');

  try {
    let content = fs.readFileSync(appModulePath, 'utf-8');

    // Check if module is already imported
    const moduleImport = `${Name}Module`;
    if (content.includes(`import { ${moduleImport} }`)) {
      console.log(`${moduleImport} is already imported in app.module.ts`);
      return;
    }

    // Find the last module import line (lines importing from './services/')
    const importRegex = /import\s*{\s*\w+Module\s*}\s*from\s*'\.\/services\/[^']+';/g;
    let lastImportMatch = null;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportMatch = match;
    }

    // Create the new import statement
    const newImport = `import { ${Name}Module } from './services/${name}/${name}.module';`;

    if (lastImportMatch) {
      // Insert after the last service module import
      const insertPosition = lastImportMatch.index + lastImportMatch[0].length;
      content = content.slice(0, insertPosition) + '\n' + newImport + content.slice(insertPosition);
    } else {
      // If no service module imports found, add after the last import statement
      const lastImportIndex = content.lastIndexOf('import');
      const lineEnd = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, lineEnd + 1) + newImport + '\n' + content.slice(lineEnd + 1);
    }

    // Find the imports array and add the new module at the end
    // Match the imports array pattern and find the closing bracket
    const importsArrayRegex = /imports:\s*\[[\s\S]*?\n\s*\]/;
    const importsMatch = content.match(importsArrayRegex);

    if (importsMatch) {
      const importsArray = importsMatch[0];
      // Find the position of the last item before the closing bracket
      const closingBracketIndex = importsArray.lastIndexOf(']');
      const lastItemIndex = importsArray.lastIndexOf(',', closingBracketIndex);

      // Find what comes before the closing bracket to determine formatting
      const beforeClosing = importsArray.substring(0, closingBracketIndex);
      const lastLine = beforeClosing.split('\n').pop();
      const indent = lastLine.match(/^\s*/)?.[0] || '    ';

      // Add the new module before the closing bracket
      const newImportsArray =
        importsArray.substring(0, closingBracketIndex) +
        `${Name}Module,\n${indent}` +
        importsArray.substring(closingBracketIndex);

      content = content.replace(importsArrayRegex, newImportsArray);
    }

    fs.writeFileSync(appModulePath, content, 'utf-8');
    console.log(`Successfully added ${Name}Module to app.module.ts`);
  } catch (err) {
    console.error('Error updating app.module.ts:', err.message);
  }
}

createFileWithContent(`src/schemas/${name}.schema.ts`, getSchema(Name));
createFileWithContent(`src/services/${name}/${name}.module.ts`, getModule(Name, name));
createFileWithContent(`src/services/${name}/${name}.service.ts`, getService(Name, name));
createFileWithContent(
  `src/services/${name}/${name}.controller.ts`,
  getController(Name, name, arg),
);
createFileWithContent(`src/services/${name}/dto/${name}.dto.ts`, getDto(Name));
createFileWithContent(
  `src/services/${name}/${name}.service.spec.ts`,
  getServiceSpec(Name, name),
);
createFileWithContent(
  `src/services/${name}/${name}.controller.spec.ts`,
  getControllerSpec(Name, name),
);

// Update app.module.ts with the new module
updateAppModule(Name, name);
