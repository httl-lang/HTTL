import { HttlCompiler } from './compiler';


describe('compiler', () => {
  // NOTE: This is not a real test, just a playground to test the compiler
  it('should parse a get request + assertion', () => {
    const input = `
      get /users {
         "id": 1,
         "title": $user.names[0].title,
         "name": "John Doe $gopa"
       }
        assert {
          status: 200
        }
    `;

    const compiler = new HttlCompiler()
    const instructions = compiler.compile(input);

    console.log(instructions);
  });
});