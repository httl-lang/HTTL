export interface Position {
  line: number;
  column: number;
}

export interface TokenSource {
  start: number, end: number, line: number
}

export interface TokenRange {
  start: number;
  end: number;
  text?: string;
}

export interface IToken extends TokenRange {
  tokenIndex: number;
  line: number;
  column: number;
  type: number;
  start: number;
  end: number;
}

export class Token {
  public static fromText(text: string): Token {
    return new Token({
      tokenIndex: NaN, line: 0, column: 0, type: NaN, start: 0, end: text.length, text: text
    })
  }
  public static UNDEFINED: Token = new Token({
    tokenIndex: -1, line: -1, column: -1, type: -1, start: -1, end: -1, text: "UNDEFINED"
  });

  public readonly tokenIndex: number;
  public readonly line: number;
  public readonly column: number;
  public readonly type: number;
  public readonly start: number;
  public readonly end: number;
  public readonly text: string;

  constructor(token: IToken) {
    Object.assign(this, token);
  }

  public get range(): TokenRange {
    return {
      start: this.start,
      end: this.end,
      text: this.text
    }
  }

  public get position(): Position {
    return {
      line: this.line,
      column: this.column
    }
  }

  public lengthTo(position: Position) {
    return position.column - this.column;
  }

  public length() {
    return this.end - this.start;
  }

  public toString() {
    return this.text;
  }
}