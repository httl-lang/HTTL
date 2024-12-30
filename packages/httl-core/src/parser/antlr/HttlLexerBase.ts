import { Lexer, CharStream, Token } from 'antlr4';

export default class HttlLexerBase extends Lexer {
	private _tokensStream: Token[] = [];
	private _previousIndex: number;
	private _tempLine: number;
	private _tempColumn: number;

	constructor(input: CharStream) {
		super(input);
	}

	public isStartOfLine(): boolean {
		if (this._tokenStartCharIndex <= 0) {
			return true;
		}

		for (let i = this._tokensStream.length - 1; i >= 0; i--) {
			const token = this._tokensStream[i];
			// @ts-ignore
			if (token.channel === this.constructor.WS_CHANNEL) {
				continue;
			}
			// @ts-ignore
			if (token.channel === this.constructor.CRLF_CHANNEL) {
				return true;
			}

			return false;
		}

		return true;
	}


	public hasWhitespaces(): boolean {
		const lastToken = this.getLastToken();
		// @ts-ignore
		const result = lastToken !== null && lastToken.channel === this.constructor.WS_CHANNEL
			&& this.text.trim().length !== this.text.length;
		return result;
	}

	public rewind() {
		this._input.seek(this._previousIndex);
		const lastToken = this.getLastToken();
		// @ts-ignore
		this._tempLine = this._interp.line - 1;
		this._tempColumn = lastToken.column + lastToken.text.length + 1;
	}

	emit(): Token {
		this._previousIndex = this._input.index;
		const token = super.emit();
		if (token?.text === "\n" && this._tempLine !== undefined && this._tempColumn !== undefined) {
			token.line = this._tempLine;
			token.column = this._tempColumn;
			// @ts-ignore
			this._interp.line -= 1;
		}

		this._tempLine = undefined;
		this._tempColumn = undefined;

		this._tokensStream.push(token);
		return token;
	}

	private getLastToken(): Token | null {
		const idx = this._tokensStream.length - 1;
		return idx >= 0 ? this._tokensStream[idx] : null;
	}
}
