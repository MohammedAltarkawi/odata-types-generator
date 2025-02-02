import { fetchMetadata } from './utils';
import {
  generateTypescriptTypes,
  parseMetadata,
  writeTypesToFile,
} from './typeGenerator';
import { generateCrudOperations, writeCrudToFile } from './crudGenerator';
import path from 'path';
import fs from 'fs';

const OUTPUT_FILE = 'webapp/model/generatedTypes.ts';
const CRUD_FILE = 'webapp/ODataClient';

const ensureDirectoryExistence = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

const fnMain = async (
  metadataUrl: string,
  username: string,
  password: string,
) => {
  try {
    const metadataXml = await fetchMetadata(metadataUrl, username, password);
    const parsedMetadata = await parseMetadata(metadataXml);

    ensureDirectoryExistence(OUTPUT_FILE);
    ensureDirectoryExistence(CRUD_FILE);

    const typescriptTypes = generateTypescriptTypes(parsedMetadata);
    writeTypesToFile(typescriptTypes, OUTPUT_FILE);

    const crudOperations = generateCrudOperations(parsedMetadata, OUTPUT_FILE);
    writeCrudToFile(crudOperations, CRUD_FILE);

    console.log('CRUD operations generated successfully.');
  } catch (error) {
    console.error('An error occurred in the main function:', error);
  }
};

// Execute fnMain with command line arguments
fnMain(process.argv[2], process.argv[3], process.argv[4]).catch((error) =>
  console.error(error),
);

// Export fnMain as main
export const main = fnMain;
