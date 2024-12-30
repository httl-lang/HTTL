import { Parser, TokenStream } from 'antlr4';

export default class HttlParserBase extends Parser {
	constructor(input: TokenStream) {
		super(input);
	}

	public hasNoBreaks() {
		let idx = this.getCurrentToken().tokenIndex;
		let currentTokenType: number;
		let count = 0;

		// @ts-ignore
		const { WS, CRLF, COMMENT } = this.constructor

		do {
			currentTokenType = this.getTokenStream().get(--idx).type;

			if (currentTokenType === WS) {
				continue;
			}

			if (currentTokenType === CRLF) {
				count++;
			}

			if (currentTokenType === COMMENT) {
				count--;
			}

		} while (currentTokenType === CRLF || currentTokenType === COMMENT || currentTokenType === WS);

		return count === 1;
	}

	public getConsecutiveLeftTokensCount(tokenTypePlus: number, tokenTypeMinus: number, skipToken: number): number {
		let idx = this.getCurrentToken().tokenIndex;
		let currentTokenType: number;
		let count = 0;

		do {
			currentTokenType = this.getTokenStream().get(--idx).type;

			if (currentTokenType === skipToken) {
				continue;
			}

			if (currentTokenType === tokenTypePlus) {
				count++;
			}

			if (currentTokenType === tokenTypeMinus) {
				count--;
			}

		} while (currentTokenType === tokenTypePlus || currentTokenType === tokenTypeMinus || currentTokenType === skipToken);

		return count;
	}
}
