import antlr4, { ErrorListener, ParserRuleContext, Token } from 'antlr4';
import HttlLexer from './antlr/HttlLexer';
import HttlParser, {
  ApiAliasContext,
  ApiHeaderContext,
  ApiPathContext,
  ExprContext,
  HttpHeaderContext,
  HttpHeaderNameContext,
  HttpHeaderValueContext,
  HttpHeaderValuePartContext,
  Json_arrayContext,
  Json_keyContext,
  Json_numberContext,
  Json_objectContext,
  Json_valueContext,
  JsonContext,
  ProgramContext,
  RequestAssertContext,
  RequestBodyContext,
  RequestContext,
  RequestHeaderContext,
  RequestUrlContext,
  RequestVarContext,
  StringContext,
  StringPartTextContext,
  StringPartVarContext,
  UseContext,
  VarContext
} from './antlr/HttlParser';
import { HttpHeaderExpression } from '../compiler/expressions';
import { IExpressionBuilder } from '../compiler';
import { Expression, Lang, Token as HttlToken, TokenRange } from '../common';
import HttlParserVisitor from './antlr/HttlParserVisitor';


type IRuleNodeContext = { start: Token, stop: Token, getText: () => string, parentCtx?: ParserRuleContext };

function fromRuleNodeToHttlToken(node: IRuleNodeContext): HttlToken {
  let { tokenIndex, type, line, start, } = node.start
  let { column, stop } = node.stop

  if (start === -1 && node.parentCtx) {
    start = node.parentCtx.start.start
    stop = node.parentCtx.start.stop
  }

  const token = {
    tokenIndex,
    line: line - 1,
    column,
    type,
    start,
    end: stop + 1,
    text: node.getText()
  }

  return new HttlToken(token)
}

type ILexerNodeContext = { symbol: Token, getText: () => string, parentCtx?: ParserRuleContext };

function fromLexerNodeToHttlToken(node: ILexerNodeContext): HttlToken {
  let { line, tokenIndex, text, column, start, stop, type } = node.symbol

  if (start === -1 && node.parentCtx) {
    start = node.parentCtx.start.start
    stop = node.parentCtx.start.stop
  }

  const token = {
    tokenIndex,
    line: line - 1,
    column,
    type,
    start,
    end: stop + 1,
    text: node.getText()
  }

  return new HttlToken(token)
}

function toHttlTokenRange(node: { start: Token, stop: Token, getText(): string }): TokenRange {
  const { start, stop = { stop: 0 } } = node
  const st = (stop === null || stop === undefined) ? 0 : stop.stop
  return {
    start: start.start,
    end: st + 1,
    text: node.getText()
  }
}

class HiddenTokenStreamAdapter {

  private alreadyCapturedRanges = [];

  constructor(
    private readonly tokenStream: antlr4.CommonTokenStream
  ) { }


  public getHiddenTokensToLeft = (tokenIndex: number | undefined): HttlToken[] => {
    if (tokenIndex === undefined) return [];

    const leftComments = this.tokenStream.getHiddenTokensToLeft(tokenIndex, HttlLexer.COMMENT_CHANNEL) || [];
    const leftLineBreaks = this.tokenStream.getHiddenTokensToLeft(tokenIndex, HttlLexer.CRLF_CHANNEL) || [];

    const leftHiddenTokens =
      [...leftComments, ...leftLineBreaks]
        .toSorted((a, b) => a.tokenIndex - b.tokenIndex)

    if (leftHiddenTokens.length > 0) {
      const rangeKey = `${leftHiddenTokens[0].tokenIndex}-${leftHiddenTokens.at(-1).tokenIndex}`

      if (!this.alreadyCapturedRanges.includes(rangeKey)) {
        this.alreadyCapturedRanges.push(rangeKey);
        return this.convertHiddenTokens(leftHiddenTokens);
      }
    }

    return [];
  }

  public getHiddenTokensToRight = (tokenIndex: number | undefined): HttlToken[] => {
    if (tokenIndex === undefined) return [];

    const rightComments = this.tokenStream.getHiddenTokensToRight(tokenIndex, HttlLexer.COMMENT_CHANNEL) || [];
    const rightLineBreaks = this.tokenStream.getHiddenTokensToRight(tokenIndex, HttlLexer.CRLF_CHANNEL) || [];

    const rightHiddenTokens =
      [...rightComments, ...rightLineBreaks]
        .toSorted((a, b) => a.tokenIndex - b.tokenIndex)

    if (rightHiddenTokens.length > 0) {
      const rangeKey = `${rightHiddenTokens[0].tokenIndex}-${rightHiddenTokens.at(-1).tokenIndex}`

      if (!this.alreadyCapturedRanges.includes(rangeKey)) {
        this.alreadyCapturedRanges.push(rangeKey);
        return this.convertHiddenTokens(rightHiddenTokens);
      }
    }

    return [];
  }

  private convertHiddenTokens = (hiddenTokens: Token[]): HttlToken[] => {
    return hiddenTokens.map(token => new HttlToken({
      tokenIndex: token.tokenIndex,
      line: token.line - 1,
      column: token.column,
      type: token.type,
      start: token.start,
      end: token.stop + 1,
      text: token.text
    }))
  }

}

class HttlVisitor extends HttlParserVisitor<Expression> {
  constructor(
    private readonly builder: IExpressionBuilder,
    private readonly hiddenTokenStream: HiddenTokenStreamAdapter
  ) {
    super();
  }

  override visitProgram = (ctx: ProgramContext): Expression => {
    const programExp =
      ctx.children.map(child => this.visit(child))

    const exp = this.builder.createProgram(toHttlTokenRange(ctx)).set(expr =>
      expr.addExpressions(
        ...programExp.filter(exp => !!exp)
      )
    ).build();

    return exp;
  }

  override visitExpr = (ctx: ExprContext): Expression => {
    if (ctx.children.length !== 1)
      throw new Error('Invalid expression')

    return this.visit(ctx.children[0])
  }

  override visitErrorNode(node: antlr4.ErrorNode): Expression {
    return this.builder.createError(fromLexerNodeToHttlToken(node)).set(
      exp => exp.setErrorMessage(`Syntax error: ${node.getText()}`)
    ).build();
  }

  override visit(tree: antlr4.ParseTree): Expression {
    const expr = super.visit(tree);

    // Capture hidden tokens for Formatting
    if (expr && tree instanceof ParserRuleContext) {
      expr.setLeftHiddenTokens(
        this.hiddenTokenStream.getHiddenTokensToLeft(tree.start.tokenIndex)
      );

      expr.setRightHiddenTokens(
        this.hiddenTokenStream.getHiddenTokensToRight(tree.stop?.tokenIndex)
      );
    }

    if ('children' in tree && Array.isArray(tree.children)) {
      const errNode = tree.children.find(child => 'isErrorNode' in child);
      if (errNode) {
        const error = this.visit(errNode)
        expr.setError(error)
        return expr;
      }
    }

    if ('exception' in tree && !!tree.exception) {
      const error = this.builder.createError(fromRuleNodeToHttlToken(tree as any)).set(
        exp => exp.setErrorMessage(`Syntax error: ${tree.getText()}`)
      ).build();

      expr.setError(error)
    }

    return expr;
  }

  //
  // Use
  //
  override visitUse = (ctx: UseContext): Expression => {
    const USE = ctx.USE()
    const apiPath = ctx.apiPath()
    const AS = ctx.AS()
    const apiAlias = ctx.apiAlias()

    const useKeyword = this.builder.createKeyword(fromLexerNodeToHttlToken(USE)).set(expr => {
      expr.setValue(USE.getText())
    }).build();

    const pathExp = this.visit(apiPath)

    const asKeyword = AS
      ? this.builder.createKeyword(fromLexerNodeToHttlToken(AS)).set(expr => {
        expr.setValue(AS.getText())
      }).build()
      : null;

    const aliasExp = apiAlias
      ? this.visit(apiAlias)
      : this.builder.createVariable(HttlToken.UNDEFINED).set(
        expr => {
          expr.setName(Lang.DEFAULT_API_NAME)
          expr.setDeclaring(true)
        }
      ).build();


    const exp = this.builder.createUse(toHttlTokenRange(ctx)).set(expr => {
      expr.setUse(useKeyword)
      expr.setPath(pathExp)
      if (asKeyword) expr.setAs(asKeyword)
      if (aliasExp) expr.setAlias(aliasExp)
    })

    return exp.build()
  }

  override visitApiPath = (ctx: ApiPathContext): Expression => {
    return this.createFileExpression(ctx)
  }

  override visitApiAlias = (ctx: ApiAliasContext): Expression => {
    const name = ctx.getText()

    const exp = this.builder.createVariable(fromLexerNodeToHttlToken(ctx.IDENTIFIER())).set(expr => {
      expr.setName(name)
      expr.setDeclaring(true)
    })

    return exp.build()
  };

  //
  // Request
  //

  override visitRequest = (ctx: RequestContext): Expression => {
    const exp = this.builder.createRequest(toHttlTokenRange(ctx));

    exp.set(expr => {
      // TODO - add api token
      const apiExp = this.builder.createVariable(HttlToken.UNDEFINED).set(
        expr => expr.setName(Lang.DEFAULT_API_NAME)
      ).build();

      expr.setApi(apiExp)
    })

    exp.set(expr => {
      const requestMethod = ctx.requestMethod()
      const methodExp = this.builder.createKeyword(fromLexerNodeToHttlToken(requestMethod.REQEST_START())).set(expr => {
        expr.setValue(requestMethod.getText())
      }).build()

      expr.setMethod(methodExp)
    })

    exp.set(expr => {
      const urlExp = this.visit(ctx.requestUrl())
      expr.setUrl(urlExp)
    })

    exp.set(expr => {
      const headersExps = ctx.requestHeader_list().map(
        header => this.visit(header)
      )

      expr.setHeaders(headersExps)
    })

    const body = ctx.requestBody();
    if (body) {
      const bodyExp = this.visit(body)
      exp.set(expr => expr.setBody(bodyExp))
    }

    const requestVar = ctx.requestVar()
    if (requestVar) {
      const varExp = this.visit(requestVar)
      exp.set(expr => expr.setVar(varExp))
    }

    const requestAssert = ctx.requestAssert()
    if (requestAssert) {
      const assertExp = this.visit(requestAssert)
      exp.set(expr => expr.setAssert(assertExp))
    }

    return exp.build()
  }

  override visitRequestUrl = (ctx: RequestUrlContext): Expression => {
    const strExp = this.visitStringPartList(ctx, false);

    const exp = this.builder.createUrl(toHttlTokenRange(ctx)).set(expr =>
      expr.setUrl(strExp)
    )

    return exp.build()
  }

  override visitRequestHeader = (ctx: RequestHeaderContext): Expression => {
    if (ctx.children.length !== 1)
      throw new Error('Invalid expression')

    return this.visit(ctx.children[0])
  }

  override visitRequestBody = (ctx: RequestBodyContext): Expression => {
    const body = this.builder.createRequestBody(toHttlTokenRange(ctx));

    if (ctx.jsonBody()) {
      body.set(expr => {
        const body = this.visit(ctx.jsonBody().json())
        expr.setType('json')
        expr.setBody(body)
      })
    }
    else if (ctx.formBody()) {
      body.set(expr => {
        const body = this.visit(ctx.formBody().json())
        expr.setType('formdata')
        expr.setBody(body)
      })
    } else if (ctx.urlEncodedBody()) {
      body.set(expr => {
        const body = this.visit(ctx.urlEncodedBody().json())
        expr.setType('urlencoded')
        expr.setBody(body)
      })
    } else if (ctx.binBody()) {
      body.set(expr => {
        const body = this.createFileExpression(ctx.binBody())
        expr.setType('bin')
        expr.setBody(body)
      })
    } else if (ctx.rawBody()) {
      body.set(expr => {
        const body = this.visit(ctx.rawBody().string_())
        expr.setType('raw')
        expr.setBody(body)
      })
    }

    return body.build()
  }

  override visitRequestVar = (ctx: RequestVarContext): Expression => {
    const name = ctx.getText()

    const exp = this.builder.createVariable(fromLexerNodeToHttlToken(ctx.IDENTIFIER())).set(expr => {
      expr.setName(name)
      expr.setDeclaring(true)
    })

    return exp.build()
  }

  override visitRequestAssert = (ctx: RequestAssertContext): Expression => {
    const exp = this.builder.createRequestAssert(toHttlTokenRange(ctx));

    exp.set(expr => {
      const assertExp = this.visit(ctx.jsonAssertion().json_object())
      expr.setAssertion(assertExp)
    })

    return exp.build()
  }

  //
  // Global Api Header
  //
  override visitApiHeader = (ctx: ApiHeaderContext): Expression => {
    // TODO - add api token
    const apiExp = this.builder.createVariable(HttlToken.UNDEFINED).set(
      expr => expr.setName(Lang.DEFAULT_API_NAME)
    ).build();

    const headerExp = this.visit(ctx.httpHeader()) as HttpHeaderExpression

    const exp = this.builder.createApiHttpHeader(toHttlTokenRange(ctx)).set(expr => {
      expr.setApi(apiExp)
      expr.setHeader(headerExp)
    })

    return exp.build()
  }

  //
  // HTTP Header
  //
  override visitHttpHeader = (ctx: HttpHeaderContext): Expression => {
    const header = this.visit(ctx.httpHeaderName())
    const value = this.visit(ctx.httpHeaderValue())

    const exp = this.builder.createHttpHeader(toHttlTokenRange(ctx)).set(expr => {
      expr.setHeader(header)
      expr.setValue(value)
    })

    return exp.build()
  }

  override visitHttpHeaderName = (ctx: HttpHeaderNameContext): Expression => {
    const ext_header = ctx.EXT_HTTP_HEADER_NAME();
    const smpl_header = ctx.HTTP_HEADER_NAME();

    const isExt = ext_header !== null;

    let header_name = (ext_header ?? smpl_header).getText().trim().slice(0, -1)
    header_name = isExt
      ? header_name.slice(1)
      : header_name

    const header = this.builder.createHttpHeaderName(fromLexerNodeToHttlToken(ext_header || smpl_header)).set(
      expr => {
        expr.setName(header_name)
        expr.setIsExt(isExt)
      }
    ).build()

    return header;

  }

  override visitHttpHeaderValue = (ctx: HttpHeaderValueContext): Expression => {
    const parts = ctx.httpHeaderValuePart_list()
      .map(child => this.visit(child))

    const expr = this.builder.createHttpHeaderValue(toHttlTokenRange(ctx)).set(expr => {
      expr.setValue(parts)
    }).build()

    if (ctx.getText().trim() === '') {
      const errorNode = this.builder.createError(fromRuleNodeToHttlToken(ctx)).set(
        expr => expr.setErrorMessage(`Empty Header Value`)
      ).build()

      expr.setError(errorNode)
    }

    return expr;
  }

  override visitHttpHeaderValuePart = (ctx: HttpHeaderValuePartContext): Expression => {
    const LINE_CONTENT = ctx.LINE_CONTENT()
    if (LINE_CONTENT) {
      return this.builder.createStringLiteral(fromLexerNodeToHttlToken(LINE_CONTENT)).set(
        expr => expr.setLiteral(LINE_CONTENT.getText())
      ).build()
    }

    if (ctx.string_()) {
      return this.visit(ctx.string_())
    }

    if (ctx.var_()) {
      return this.visit(ctx.var_())
    }
  }

  //
  // String
  override visitString = (ctx: StringContext): Expression => {
    return this.visitStringPartList(ctx, true);
  }

  override visitStringPartText = (ctx: StringPartTextContext): Expression => {
    const text = ctx.getText();
    if (text === '') {
      return null;
    }

    const node = ctx.REQEST_URL() || ctx.LINE_CONTENT() || ctx.STRING_CONTENT()

    return this.builder.createStringLiteral(fromLexerNodeToHttlToken(node)).set(
      expr => expr.setLiteral(text)
    ).build()
  }

  override visitStringPartVar = (ctx: StringPartVarContext): Expression => {
    if (ctx.children.length !== 1)
      throw new Error('Invalid expression')


    return this.visit(ctx.children[0]);
  }

  //
  // Variable
  override visitVar = (ctx: VarContext): Expression => {
    const varExpr = ctx.VAR_EXPR() || ctx.JSON_IDENTIFIER() || ctx.JSON_VAR_IDENTIFIER();

    return this.builder.createVariable(fromLexerNodeToHttlToken(varExpr)).set(
      expr => {
        expr.setName(varExpr.getText().trim());
        expr.setInterpolation(ctx.VAR_EXPR() !== null);
      }
    ).build()
  }

  //
  // Json
  override visitJson = (ctx: JsonContext): Expression => {
    const jsonExp =
      ctx.json_array()
        ? this.visit(ctx.json_array())
        : ctx.json_object()
          ? this.visit(ctx.json_object())
          : null

    const exp = this.builder.createJson(toHttlTokenRange(ctx)).set(expr =>
      expr.setValue(jsonExp)
    )

    return exp.build()
  }

  override visitJson_object = (ctx: Json_objectContext): Expression => {
    const pairs = ctx.json_pair_list().map(
      (pair, index) => {
        const key = this.visit(pair.json_key())
        const value = this.visit(pair.json_value())

        value.setRightHiddenTokens(
          this.hiddenTokenStream.getHiddenTokensToRight(ctx.JSON_COMMA(index)?.symbol?.tokenIndex)
        )

        return { key, value }
      }
    )

    const jsonObject = this.builder.createJsonObject(toHttlTokenRange(ctx)).set(expr =>
      expr.setPairs(pairs)
    )

    return jsonObject.build()
  }


  override visitJson_key = (ctx: Json_keyContext): Expression => {
    if (ctx.string_()) {
      return this.visitStringPartList(ctx.string_(), true);
    }

    const node = ctx.JSON_IDENTIFIER() || ctx.JSON_LITERAL() || ctx.JSON_NUMERIC_LITERAL();

    return this.builder.createStringLiteral(fromLexerNodeToHttlToken(node)).set(
      expr => expr.setLiteral(node.getText().trim())
    ).build()
  }

  override visitJson_value = (ctx: Json_valueContext): Expression => {
    const JSON_LITERAL = ctx.JSON_LITERAL()
    if (JSON_LITERAL)
      return this.builder.createJsonLiteral(fromLexerNodeToHttlToken(JSON_LITERAL)).set(
        expr => expr.setValue(JSON_LITERAL.getText().trim())
      ).build()


    return this.visit(ctx.children[0])
  }

  override visitJson_number = (ctx: Json_numberContext): Expression => {
    const node = ctx.JSON_NUMBER() || ctx.JSON_NUMERIC_LITERAL() || ctx.JSON_SYMBOL();

    return this.builder.createJsonNumber(fromLexerNodeToHttlToken(node)).set(
      expr => expr.setValue(node.getText().trim())
    ).build()
  }

  override visitJson_array = (ctx: Json_arrayContext): Expression => {
    const values = ctx.json_value_list().map(
      value => this.visit(value)
    )

    const jsonArray = this.builder.createJsonArray(toHttlTokenRange(ctx)).set(expr =>
      expr.setItems(values)
    )

    return jsonArray.build()
  }

  //
  // Common methods
  private visitStringPartList = (ctx: ParserRuleContext & { stringPart_list: any }, quoted: boolean): Expression => {
    const stringParts =
      ctx.stringPart_list()
        .map(child => this.visit(child))
        .filter(exp => !!exp)

    return this.builder.createString(toHttlTokenRange(ctx)).set(
      expr => {
        expr.setParts(stringParts)
        expr.setQuoted(quoted)
      }
    ).build()
  }

  private createFileExpression = (ctx: ParserRuleContext & { string_: any }): Expression => {
    const filePath = this.visit(ctx.string_())

    const exp = this.builder.createFile(toHttlTokenRange(ctx)).set(expr =>
      expr.setPath(filePath)
    )

    return exp.build()
  }
}

class CustomErrorListener extends ErrorListener<Token> {
  // constructor(
  //   private readonly builder: IExpressionBuilder
  // ) {
  //   super();
  // }
  syntaxError(recognizer: HttlParser, offendingSymbol, line, column, msg, e) {
    // builder.createError().set(
    //   expr => expr.setErrorMessage(msg)
    // ).build();
    // console.error(`Error at line ${line}:${column} - ${msg}`);
    // throw e
  }
}

export class HTTLLangParser {
  public static parse(input: string, builder: IExpressionBuilder) {
    const chars = new antlr4.CharStream(input);
    const lexer = new HttlLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new HttlParser(tokens);

    // parser.removeErrorListeners();
    // parser.addErrorListener(new CustomErrorListener());

    const tree = parser.program();

    const hiddenTokenStream = new HiddenTokenStreamAdapter(tokens);
    const visitor = new HttlVisitor(builder, hiddenTokenStream);
    return visitor.visit(tree);
  }
}