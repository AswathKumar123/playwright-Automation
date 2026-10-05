import fs from 'fs/promises'
import path from 'path'
import Ajv from 'ajv'
import { createSchema } from 'genson-js'
import addFormats from "ajv-formats"

const BASE_SCHEMA_PATH = './response-schemas'
  const ajv = new Ajv({allErrors: true});
  addFormats(ajv);

export async function validator(responseBody, dirName, fileName) {
    const schemaPath = path.join(BASE_SCHEMA_PATH, dirName, `${fileName}_schemas.json`);
    const schema = await loadSchema(schemaPath);
    const validate = ajv.compile(schema);

    console.log('The validate is ', validate);
    console.log('The schema is ', schema);

    if (!validate(responseBody)) {
        throw new Error(`Response does not match schema: ${ajv.errorsText(validate.errors)}`)
    }

    return true
}

export async function validateSchema(responseBody, dirName, fileName) {
    const schema = createSchema(responseBody);
    const schemaPath = path.join(BASE_SCHEMA_PATH, dirName, `${fileName}_schemas.json`);
    await fs.mkdir(path.dirname(schemaPath), { recursive: true });
    await fs.writeFile(schemaPath, JSON.stringify(schema, null, 2), 'utf-8');

  
    const validate = ajv.compile(schema);

    if (!validate(responseBody)) {
        throw new Error(`Response does not match generated schema: ${ajv.errorsText(validate.errors)}`);
    }

    return true;
}

async function loadSchema(schemaPath){
    try{
 const schemaContent = await fs.readFile(schemaPath, 'utf-8');
 return JSON.parse(schemaContent);
    } catch (error) {
        throw new Error(`Failed to read the schema file ${error.message}`)
    }
}