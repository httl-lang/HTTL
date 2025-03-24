import { Agent } from '../../core/agent';
import { LLM } from '../../core/llm';
import { HttlExtensionContext } from '../../../common';
import { GenerateRequestStep } from './steps/generate-request-step';

const INSTRUCTIONS_PROMPT = `Purpose:
      - You are an API that responds strictly in VALID JSON format without any markdown, explanations, line breaks, or formatting.
      - JSON.parse() must be able to parse the output without any errors.
      - Given a JSON object with placeholder values (like "string", 123, false), generate a realistic and coherent example JSON request body. Maintain the structure and keys of the original object, but replace placeholder values with plausible, context-appropriate data (e.g., realistic names, phone numbers, email addresses, ages, etc.). Do not change any keys or add/remove fields.

Example input:
{
  "firstName": "string",
  "lastName": "string",
  "phone": 123,
  "email": "string",
  "age": 123,
  "teacher": false,
  "address": {}
}

Expected output:
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": +1125446879,
  "email": "john.smith@testemail.com",
  "age": 47,
  "teacher": false,
  
  "address": { // try to figure out what kind of information would be in this object based on the name of the key
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62701"
  }
}
`;

export class RequestAgent {
  private agent?: Agent;

  constructor(
    private readonly context: HttlExtensionContext,
  ) { }

  public stop() {
    this.agent?.stop();
  }

  public async generateRequest(script: string): Promise<string> {
    if (this.agent) {
      this.agent.stop();
    }

    this.agent = new Agent({
      llm: await LLM.create(),
      instructions: INSTRUCTIONS_PROMPT,
    });

    const requestResult = await this.agent.run(GenerateRequestStep, script);

    return requestResult.result;
  }
}