// Generated from HttlParser.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import HttlParserListener from "./HttlParserListener.js";
import HttlParserVisitor from "./HttlParserVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

import HttlParserBase from './HttlParserBase.js';

export default class HttlParser extends HttlParserBase {
	public static readonly USE = 1;
	public static readonly AS = 2;
	public static readonly ASSERT = 3;
	public static readonly JSON_BODY = 4;
	public static readonly FORM_BODY = 5;
	public static readonly URL_ENCODED_BODY = 6;
	public static readonly BINARY_BODY = 7;
	public static readonly RAW_BODY = 8;
	public static readonly GET = 9;
	public static readonly POST = 10;
	public static readonly PUT = 11;
	public static readonly DELETE = 12;
	public static readonly PATCH = 13;
	public static readonly HEAD = 14;
	public static readonly OPTIONS = 15;
	public static readonly CONNECT = 16;
	public static readonly TRACE = 17;
	public static readonly LOCK = 18;
	public static readonly UNLOCK = 19;
	public static readonly PROPFIND = 20;
	public static readonly PROPPATCH = 21;
	public static readonly COPY = 22;
	public static readonly MOVE = 23;
	public static readonly MKCOL = 24;
	public static readonly MKCALENDAR = 25;
	public static readonly ACL = 26;
	public static readonly SEARCH = 27;
	public static readonly VAR_TEST = 28;
	public static readonly STRING_START = 29;
	public static readonly REQEST_START = 30;
	public static readonly EXT_HTTP_HEADER_NAME = 31;
	public static readonly HTTP_HEADER_NAME = 32;
	public static readonly IDENTIFIER = 33;
	public static readonly DIGITS = 34;
	public static readonly CRLF = 35;
	public static readonly COMMENT = 36;
	public static readonly WS = 37;
	public static readonly JSON_OBJECT_START = 38;
	public static readonly JSON_OBJECT_END = 39;
	public static readonly JSON_ARRAY_START = 40;
	public static readonly JSON_ARRAY_END = 41;
	public static readonly ERROR = 42;
	public static readonly VAR_INTERPOLATION_START = 43;
	public static readonly STRING_END = 44;
	public static readonly STRING_CONTENT = 45;
	public static readonly VAR_INTERPOLATION_END = 46;
	public static readonly VAR_EXPR = 47;
	public static readonly END_OF_REQEST_URL = 48;
	public static readonly END_OF_REQEST_URL_NL = 49;
	public static readonly REQEST_URL = 50;
	public static readonly END_OF_LINE = 51;
	public static readonly LINE_CONTENT = 52;
	public static readonly JSON_COMMA = 53;
	public static readonly JSON_SEMI = 54;
	public static readonly JSON_LITERAL = 55;
	public static readonly JSON_NUMBER = 56;
	public static readonly JSON_NUMERIC_LITERAL = 57;
	public static readonly JSON_SYMBOL = 58;
	public static readonly JSON_IDENTIFIER = 59;
	public static readonly JSON_VAR_IDENTIFIER = 60;
	public static readonly JSON_WS = 61;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_program = 0;
	public static readonly RULE_expr = 1;
	public static readonly RULE_use = 2;
	public static readonly RULE_apiPath = 3;
	public static readonly RULE_apiAlias = 4;
	public static readonly RULE_request = 5;
	public static readonly RULE_requestMethod = 6;
	public static readonly RULE_requestUrl = 7;
	public static readonly RULE_requestHeader = 8;
	public static readonly RULE_requestBody = 9;
	public static readonly RULE_formBody = 10;
	public static readonly RULE_urlEncodedBody = 11;
	public static readonly RULE_jsonBody = 12;
	public static readonly RULE_binBody = 13;
	public static readonly RULE_rawBody = 14;
	public static readonly RULE_requestVar = 15;
	public static readonly RULE_requestAssert = 16;
	public static readonly RULE_apiHeader = 17;
	public static readonly RULE_httpHeader = 18;
	public static readonly RULE_httpHeaderName = 19;
	public static readonly RULE_httpHeaderValue = 20;
	public static readonly RULE_httpHeaderValuePart = 21;
	public static readonly RULE_string = 22;
	public static readonly RULE_stringPart = 23;
	public static readonly RULE_var = 24;
	public static readonly RULE_jsonAssertion = 25;
	public static readonly RULE_json = 26;
	public static readonly RULE_json_object = 27;
	public static readonly RULE_json_pair = 28;
	public static readonly RULE_json_key = 29;
	public static readonly RULE_json_value = 30;
	public static readonly RULE_json_array = 31;
	public static readonly RULE_json_number = 32;
	public static readonly literalNames: (string | null)[] = [ null, "'use'", 
                                                            "'as'", "'assert'", 
                                                            "'json'", "'formdata'", 
                                                            "'urlencoded'", 
                                                            "'bin'", "'raw'", 
                                                            "'get'", "'post'", 
                                                            "'put'", "'delete'", 
                                                            "'patch'", "'head'", 
                                                            "'options'", 
                                                            "'connect'", 
                                                            "'trace'", "'lock'", 
                                                            "'unlock'", 
                                                            "'propfind'", 
                                                            "'proppatch'", 
                                                            "'copy'", "'move'", 
                                                            "'mkcol'", "'mkcalendar'", 
                                                            "'acl'", "'search'", 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            "'['", null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, "','", 
                                                            "':'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "USE", 
                                                             "AS", "ASSERT", 
                                                             "JSON_BODY", 
                                                             "FORM_BODY", 
                                                             "URL_ENCODED_BODY", 
                                                             "BINARY_BODY", 
                                                             "RAW_BODY", 
                                                             "GET", "POST", 
                                                             "PUT", "DELETE", 
                                                             "PATCH", "HEAD", 
                                                             "OPTIONS", 
                                                             "CONNECT", 
                                                             "TRACE", "LOCK", 
                                                             "UNLOCK", "PROPFIND", 
                                                             "PROPPATCH", 
                                                             "COPY", "MOVE", 
                                                             "MKCOL", "MKCALENDAR", 
                                                             "ACL", "SEARCH", 
                                                             "VAR_TEST", 
                                                             "STRING_START", 
                                                             "REQEST_START", 
                                                             "EXT_HTTP_HEADER_NAME", 
                                                             "HTTP_HEADER_NAME", 
                                                             "IDENTIFIER", 
                                                             "DIGITS", "CRLF", 
                                                             "COMMENT", 
                                                             "WS", "JSON_OBJECT_START", 
                                                             "JSON_OBJECT_END", 
                                                             "JSON_ARRAY_START", 
                                                             "JSON_ARRAY_END", 
                                                             "ERROR", "VAR_INTERPOLATION_START", 
                                                             "STRING_END", 
                                                             "STRING_CONTENT", 
                                                             "VAR_INTERPOLATION_END", 
                                                             "VAR_EXPR", 
                                                             "END_OF_REQEST_URL", 
                                                             "END_OF_REQEST_URL_NL", 
                                                             "REQEST_URL", 
                                                             "END_OF_LINE", 
                                                             "LINE_CONTENT", 
                                                             "JSON_COMMA", 
                                                             "JSON_SEMI", 
                                                             "JSON_LITERAL", 
                                                             "JSON_NUMBER", 
                                                             "JSON_NUMERIC_LITERAL", 
                                                             "JSON_SYMBOL", 
                                                             "JSON_IDENTIFIER", 
                                                             "JSON_VAR_IDENTIFIER", 
                                                             "JSON_WS" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"program", "expr", "use", "apiPath", "apiAlias", "request", "requestMethod", 
		"requestUrl", "requestHeader", "requestBody", "formBody", "urlEncodedBody", 
		"jsonBody", "binBody", "rawBody", "requestVar", "requestAssert", "apiHeader", 
		"httpHeader", "httpHeaderName", "httpHeaderValue", "httpHeaderValuePart", 
		"string", "stringPart", "var", "jsonAssertion", "json", "json_object", 
		"json_pair", "json_key", "json_value", "json_array", "json_number",
	];
	public get grammarFileName(): string { return "HttlParser.g4"; }
	public get literalNames(): (string | null)[] { return HttlParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return HttlParser.symbolicNames; }
	public get ruleNames(): string[] { return HttlParser.ruleNames; }
	public get serializedATN(): number[] { return HttlParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, HttlParser._ATN, HttlParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public program(): ProgramContext {
		let localctx: ProgramContext = new ProgramContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, HttlParser.RULE_program);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 69;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 1)) & ~0x1F) === 0 && ((1 << (_la - 1)) & 3758096385) !== 0)) {
				{
				{
				this.state = 66;
				this.expr();
				}
				}
				this.state = 71;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 72;
			this.match(HttlParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public expr(): ExprContext {
		let localctx: ExprContext = new ExprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, HttlParser.RULE_expr);
		try {
			this.state = 77;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 74;
				this.use();
				}
				break;
			case 30:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 75;
				this.request();
				}
				break;
			case 31:
			case 32:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 76;
				this.apiHeader();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public use(): UseContext {
		let localctx: UseContext = new UseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, HttlParser.RULE_use);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 79;
			this.match(HttlParser.USE);
			this.state = 80;
			this.apiPath();
			this.state = 83;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===2) {
				{
				this.state = 81;
				this.match(HttlParser.AS);
				this.state = 82;
				this.apiAlias();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public apiPath(): ApiPathContext {
		let localctx: ApiPathContext = new ApiPathContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, HttlParser.RULE_apiPath);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 85;
			this.string_();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public apiAlias(): ApiAliasContext {
		let localctx: ApiAliasContext = new ApiAliasContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, HttlParser.RULE_apiAlias);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 87;
			this.match(HttlParser.IDENTIFIER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public request(): RequestContext {
		let localctx: RequestContext = new RequestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, HttlParser.RULE_request);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 89;
			this.requestMethod();
			this.state = 90;
			this.requestUrl();
			this.state = 94;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 3, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 91;
					this.requestHeader();
					}
					}
				}
				this.state = 96;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 3, this._ctx);
			}
			this.state = 98;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 496) !== 0) || _la===38 || _la===40) {
				{
				this.state = 97;
				this.requestBody();
				}
			}

			this.state = 114;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 2:
				{
				{
				{
				this.state = 100;
				this.match(HttlParser.AS);
				this.state = 101;
				this.requestVar();
				}
				this.state = 105;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===3) {
					{
					this.state = 103;
					this.match(HttlParser.ASSERT);
					this.state = 104;
					this.requestAssert();
					}
				}

				}
				}
				break;
			case 3:
				{
				{
				{
				this.state = 107;
				this.match(HttlParser.ASSERT);
				this.state = 108;
				this.requestAssert();
				}
				this.state = 112;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===2) {
					{
					this.state = 110;
					this.match(HttlParser.AS);
					this.state = 111;
					this.requestVar();
					}
				}

				}
				}
				break;
			case -1:
			case 1:
			case 30:
			case 31:
			case 32:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public requestMethod(): RequestMethodContext {
		let localctx: RequestMethodContext = new RequestMethodContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, HttlParser.RULE_requestMethod);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 116;
			this.match(HttlParser.REQEST_START);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public requestUrl(): RequestUrlContext {
		let localctx: RequestUrlContext = new RequestUrlContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, HttlParser.RULE_requestUrl);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 119;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 118;
					this.stringPart();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 121;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 8, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public requestHeader(): RequestHeaderContext {
		let localctx: RequestHeaderContext = new RequestHeaderContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, HttlParser.RULE_requestHeader);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 123;
			if (!(this.hasNoBreaks())) {
				throw this.createFailedPredicateException("this.hasNoBreaks()");
			}
			this.state = 124;
			this.httpHeader();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public requestBody(): RequestBodyContext {
		let localctx: RequestBodyContext = new RequestBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, HttlParser.RULE_requestBody);
		try {
			this.state = 131;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 5:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 126;
				this.formBody();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 127;
				this.urlEncodedBody();
				}
				break;
			case 4:
			case 38:
			case 40:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 128;
				this.jsonBody();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 129;
				this.binBody();
				}
				break;
			case 8:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 130;
				this.rawBody();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public formBody(): FormBodyContext {
		let localctx: FormBodyContext = new FormBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, HttlParser.RULE_formBody);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 133;
			this.match(HttlParser.FORM_BODY);
			this.state = 134;
			this.json();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public urlEncodedBody(): UrlEncodedBodyContext {
		let localctx: UrlEncodedBodyContext = new UrlEncodedBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, HttlParser.RULE_urlEncodedBody);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 136;
			this.match(HttlParser.URL_ENCODED_BODY);
			this.state = 137;
			this.json();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public jsonBody(): JsonBodyContext {
		let localctx: JsonBodyContext = new JsonBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, HttlParser.RULE_jsonBody);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 140;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===4) {
				{
				this.state = 139;
				this.match(HttlParser.JSON_BODY);
				}
			}

			this.state = 142;
			this.json();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public binBody(): BinBodyContext {
		let localctx: BinBodyContext = new BinBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, HttlParser.RULE_binBody);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 144;
			this.match(HttlParser.BINARY_BODY);
			this.state = 145;
			this.string_();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public rawBody(): RawBodyContext {
		let localctx: RawBodyContext = new RawBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 28, HttlParser.RULE_rawBody);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 147;
			this.match(HttlParser.RAW_BODY);
			this.state = 148;
			this.string_();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public requestVar(): RequestVarContext {
		let localctx: RequestVarContext = new RequestVarContext(this, this._ctx, this.state);
		this.enterRule(localctx, 30, HttlParser.RULE_requestVar);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 150;
			this.match(HttlParser.IDENTIFIER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public requestAssert(): RequestAssertContext {
		let localctx: RequestAssertContext = new RequestAssertContext(this, this._ctx, this.state);
		this.enterRule(localctx, 32, HttlParser.RULE_requestAssert);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 152;
			this.jsonAssertion();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public apiHeader(): ApiHeaderContext {
		let localctx: ApiHeaderContext = new ApiHeaderContext(this, this._ctx, this.state);
		this.enterRule(localctx, 34, HttlParser.RULE_apiHeader);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 154;
			this.httpHeader();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public httpHeader(): HttpHeaderContext {
		let localctx: HttpHeaderContext = new HttpHeaderContext(this, this._ctx, this.state);
		this.enterRule(localctx, 36, HttlParser.RULE_httpHeader);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 156;
			this.httpHeaderName();
			this.state = 157;
			this.httpHeaderValue();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public httpHeaderName(): HttpHeaderNameContext {
		let localctx: HttpHeaderNameContext = new HttpHeaderNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 38, HttlParser.RULE_httpHeaderName);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 159;
			_la = this._input.LA(1);
			if(!(_la===31 || _la===32)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public httpHeaderValue(): HttpHeaderValueContext {
		let localctx: HttpHeaderValueContext = new HttpHeaderValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 40, HttlParser.RULE_httpHeaderValue);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 162;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 161;
					this.httpHeaderValuePart();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 164;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 11, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public httpHeaderValuePart(): HttpHeaderValuePartContext {
		let localctx: HttpHeaderValuePartContext = new HttpHeaderValuePartContext(this, this._ctx, this.state);
		this.enterRule(localctx, 42, HttlParser.RULE_httpHeaderValuePart);
		try {
			this.state = 169;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 52:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 166;
				this.match(HttlParser.LINE_CONTENT);
				}
				break;
			case 29:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 167;
				this.string_();
				}
				break;
			case 43:
			case 59:
			case 60:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 168;
				this.var_();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public string_(): StringContext {
		let localctx: StringContext = new StringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 44, HttlParser.RULE_string);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 171;
			this.match(HttlParser.STRING_START);
			this.state = 173;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 172;
				this.stringPart();
				}
				}
				this.state = 175;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 43)) & ~0x1F) === 0 && ((1 << (_la - 43)) & 197253) !== 0));
			this.state = 177;
			this.match(HttlParser.STRING_END);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public stringPart(): StringPartContext {
		let localctx: StringPartContext = new StringPartContext(this, this._ctx, this.state);
		this.enterRule(localctx, 46, HttlParser.RULE_stringPart);
		let _la: number;
		try {
			this.state = 181;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 45:
			case 50:
			case 52:
				localctx = new StringPartTextContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 179;
				_la = this._input.LA(1);
				if(!(((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & 161) !== 0))) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			case 43:
			case 59:
			case 60:
				localctx = new StringPartVarContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 180;
				this.var_();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public var_(): VarContext {
		let localctx: VarContext = new VarContext(this, this._ctx, this.state);
		this.enterRule(localctx, 48, HttlParser.RULE_var);
		try {
			this.state = 188;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 43:
				this.enterOuterAlt(localctx, 1);
				{
				{
				this.state = 183;
				this.match(HttlParser.VAR_INTERPOLATION_START);
				this.state = 184;
				this.match(HttlParser.VAR_EXPR);
				this.state = 185;
				this.match(HttlParser.VAR_INTERPOLATION_END);
				}
				}
				break;
			case 59:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 186;
				this.match(HttlParser.JSON_IDENTIFIER);
				}
				break;
			case 60:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 187;
				this.match(HttlParser.JSON_VAR_IDENTIFIER);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public jsonAssertion(): JsonAssertionContext {
		let localctx: JsonAssertionContext = new JsonAssertionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 50, HttlParser.RULE_jsonAssertion);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 190;
			this.json_object();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public json(): JsonContext {
		let localctx: JsonContext = new JsonContext(this, this._ctx, this.state);
		this.enterRule(localctx, 52, HttlParser.RULE_json);
		try {
			this.state = 194;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 38:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 192;
				this.json_object();
				}
				break;
			case 40:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 193;
				this.json_array();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public json_object(): Json_objectContext {
		let localctx: Json_objectContext = new Json_objectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 54, HttlParser.RULE_json_object);
		let _la: number;
		try {
			let _alt: number;
			this.state = 212;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 19, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 196;
				this.match(HttlParser.JSON_OBJECT_START);
				this.state = 197;
				this.json_pair();
				this.state = 202;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 17, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 198;
						this.match(HttlParser.JSON_COMMA);
						this.state = 199;
						this.json_pair();
						}
						}
					}
					this.state = 204;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 17, this._ctx);
				}
				this.state = 206;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===53) {
					{
					this.state = 205;
					this.match(HttlParser.JSON_COMMA);
					}
				}

				this.state = 208;
				this.match(HttlParser.JSON_OBJECT_END);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 210;
				this.match(HttlParser.JSON_OBJECT_START);
				this.state = 211;
				this.match(HttlParser.JSON_OBJECT_END);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public json_pair(): Json_pairContext {
		let localctx: Json_pairContext = new Json_pairContext(this, this._ctx, this.state);
		this.enterRule(localctx, 56, HttlParser.RULE_json_pair);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 214;
			this.json_key();
			this.state = 215;
			this.match(HttlParser.JSON_SEMI);
			this.state = 216;
			this.json_value();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public json_key(): Json_keyContext {
		let localctx: Json_keyContext = new Json_keyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 58, HttlParser.RULE_json_key);
		try {
			this.state = 222;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 29:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 218;
				this.string_();
				}
				break;
			case 59:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 219;
				this.match(HttlParser.JSON_IDENTIFIER);
				}
				break;
			case 55:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 220;
				this.match(HttlParser.JSON_LITERAL);
				}
				break;
			case 57:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 221;
				this.match(HttlParser.JSON_NUMERIC_LITERAL);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public json_value(): Json_valueContext {
		let localctx: Json_valueContext = new Json_valueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 60, HttlParser.RULE_json_value);
		try {
			this.state = 230;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 29:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 224;
				this.string_();
				}
				break;
			case 56:
			case 57:
			case 58:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 225;
				this.json_number();
				}
				break;
			case 38:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 226;
				this.json_object();
				}
				break;
			case 40:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 227;
				this.json_array();
				}
				break;
			case 55:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 228;
				this.match(HttlParser.JSON_LITERAL);
				}
				break;
			case 43:
			case 59:
			case 60:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 229;
				this.var_();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public json_array(): Json_arrayContext {
		let localctx: Json_arrayContext = new Json_arrayContext(this, this._ctx, this.state);
		this.enterRule(localctx, 62, HttlParser.RULE_json_array);
		let _la: number;
		try {
			let _alt: number;
			this.state = 248;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 24, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 232;
				this.match(HttlParser.JSON_ARRAY_START);
				this.state = 233;
				this.json_value();
				this.state = 238;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 22, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 234;
						this.match(HttlParser.JSON_COMMA);
						this.state = 235;
						this.json_value();
						}
						}
					}
					this.state = 240;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 22, this._ctx);
				}
				this.state = 242;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===53) {
					{
					this.state = 241;
					this.match(HttlParser.JSON_COMMA);
					}
				}

				this.state = 244;
				this.match(HttlParser.JSON_ARRAY_END);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 246;
				this.match(HttlParser.JSON_ARRAY_START);
				this.state = 247;
				this.match(HttlParser.JSON_ARRAY_END);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public json_number(): Json_numberContext {
		let localctx: Json_numberContext = new Json_numberContext(this, this._ctx, this.state);
		this.enterRule(localctx, 64, HttlParser.RULE_json_number);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 251;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===58) {
				{
				this.state = 250;
				this.match(HttlParser.JSON_SYMBOL);
				}
			}

			this.state = 253;
			_la = this._input.LA(1);
			if(!(_la===56 || _la===57)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public sempred(localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 8:
			return this.requestHeader_sempred(localctx as RequestHeaderContext, predIndex);
		}
		return true;
	}
	private requestHeader_sempred(localctx: RequestHeaderContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.hasNoBreaks();
		}
		return true;
	}

	public static readonly _serializedATN: number[] = [4,1,61,256,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,
	10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,
	7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,
	24,2,25,7,25,2,26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,
	2,32,7,32,1,0,5,0,68,8,0,10,0,12,0,71,9,0,1,0,1,0,1,1,1,1,1,1,3,1,78,8,
	1,1,2,1,2,1,2,1,2,3,2,84,8,2,1,3,1,3,1,4,1,4,1,5,1,5,1,5,5,5,93,8,5,10,
	5,12,5,96,9,5,1,5,3,5,99,8,5,1,5,1,5,1,5,1,5,1,5,3,5,106,8,5,1,5,1,5,1,
	5,1,5,1,5,3,5,113,8,5,3,5,115,8,5,1,6,1,6,1,7,4,7,120,8,7,11,7,12,7,121,
	1,8,1,8,1,8,1,9,1,9,1,9,1,9,1,9,3,9,132,8,9,1,10,1,10,1,10,1,11,1,11,1,
	11,1,12,3,12,141,8,12,1,12,1,12,1,13,1,13,1,13,1,14,1,14,1,14,1,15,1,15,
	1,16,1,16,1,17,1,17,1,18,1,18,1,18,1,19,1,19,1,20,4,20,163,8,20,11,20,12,
	20,164,1,21,1,21,1,21,3,21,170,8,21,1,22,1,22,4,22,174,8,22,11,22,12,22,
	175,1,22,1,22,1,23,1,23,3,23,182,8,23,1,24,1,24,1,24,1,24,1,24,3,24,189,
	8,24,1,25,1,25,1,26,1,26,3,26,195,8,26,1,27,1,27,1,27,1,27,5,27,201,8,27,
	10,27,12,27,204,9,27,1,27,3,27,207,8,27,1,27,1,27,1,27,1,27,3,27,213,8,
	27,1,28,1,28,1,28,1,28,1,29,1,29,1,29,1,29,3,29,223,8,29,1,30,1,30,1,30,
	1,30,1,30,1,30,3,30,231,8,30,1,31,1,31,1,31,1,31,5,31,237,8,31,10,31,12,
	31,240,9,31,1,31,3,31,243,8,31,1,31,1,31,1,31,1,31,3,31,249,8,31,1,32,3,
	32,252,8,32,1,32,1,32,1,32,0,0,33,0,2,4,6,8,10,12,14,16,18,20,22,24,26,
	28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,0,3,1,0,31,32,
	3,0,45,45,50,50,52,52,1,0,56,57,261,0,69,1,0,0,0,2,77,1,0,0,0,4,79,1,0,
	0,0,6,85,1,0,0,0,8,87,1,0,0,0,10,89,1,0,0,0,12,116,1,0,0,0,14,119,1,0,0,
	0,16,123,1,0,0,0,18,131,1,0,0,0,20,133,1,0,0,0,22,136,1,0,0,0,24,140,1,
	0,0,0,26,144,1,0,0,0,28,147,1,0,0,0,30,150,1,0,0,0,32,152,1,0,0,0,34,154,
	1,0,0,0,36,156,1,0,0,0,38,159,1,0,0,0,40,162,1,0,0,0,42,169,1,0,0,0,44,
	171,1,0,0,0,46,181,1,0,0,0,48,188,1,0,0,0,50,190,1,0,0,0,52,194,1,0,0,0,
	54,212,1,0,0,0,56,214,1,0,0,0,58,222,1,0,0,0,60,230,1,0,0,0,62,248,1,0,
	0,0,64,251,1,0,0,0,66,68,3,2,1,0,67,66,1,0,0,0,68,71,1,0,0,0,69,67,1,0,
	0,0,69,70,1,0,0,0,70,72,1,0,0,0,71,69,1,0,0,0,72,73,5,0,0,1,73,1,1,0,0,
	0,74,78,3,4,2,0,75,78,3,10,5,0,76,78,3,34,17,0,77,74,1,0,0,0,77,75,1,0,
	0,0,77,76,1,0,0,0,78,3,1,0,0,0,79,80,5,1,0,0,80,83,3,6,3,0,81,82,5,2,0,
	0,82,84,3,8,4,0,83,81,1,0,0,0,83,84,1,0,0,0,84,5,1,0,0,0,85,86,3,44,22,
	0,86,7,1,0,0,0,87,88,5,33,0,0,88,9,1,0,0,0,89,90,3,12,6,0,90,94,3,14,7,
	0,91,93,3,16,8,0,92,91,1,0,0,0,93,96,1,0,0,0,94,92,1,0,0,0,94,95,1,0,0,
	0,95,98,1,0,0,0,96,94,1,0,0,0,97,99,3,18,9,0,98,97,1,0,0,0,98,99,1,0,0,
	0,99,114,1,0,0,0,100,101,5,2,0,0,101,102,3,30,15,0,102,105,1,0,0,0,103,
	104,5,3,0,0,104,106,3,32,16,0,105,103,1,0,0,0,105,106,1,0,0,0,106,115,1,
	0,0,0,107,108,5,3,0,0,108,109,3,32,16,0,109,112,1,0,0,0,110,111,5,2,0,0,
	111,113,3,30,15,0,112,110,1,0,0,0,112,113,1,0,0,0,113,115,1,0,0,0,114,100,
	1,0,0,0,114,107,1,0,0,0,114,115,1,0,0,0,115,11,1,0,0,0,116,117,5,30,0,0,
	117,13,1,0,0,0,118,120,3,46,23,0,119,118,1,0,0,0,120,121,1,0,0,0,121,119,
	1,0,0,0,121,122,1,0,0,0,122,15,1,0,0,0,123,124,4,8,0,0,124,125,3,36,18,
	0,125,17,1,0,0,0,126,132,3,20,10,0,127,132,3,22,11,0,128,132,3,24,12,0,
	129,132,3,26,13,0,130,132,3,28,14,0,131,126,1,0,0,0,131,127,1,0,0,0,131,
	128,1,0,0,0,131,129,1,0,0,0,131,130,1,0,0,0,132,19,1,0,0,0,133,134,5,5,
	0,0,134,135,3,52,26,0,135,21,1,0,0,0,136,137,5,6,0,0,137,138,3,52,26,0,
	138,23,1,0,0,0,139,141,5,4,0,0,140,139,1,0,0,0,140,141,1,0,0,0,141,142,
	1,0,0,0,142,143,3,52,26,0,143,25,1,0,0,0,144,145,5,7,0,0,145,146,3,44,22,
	0,146,27,1,0,0,0,147,148,5,8,0,0,148,149,3,44,22,0,149,29,1,0,0,0,150,151,
	5,33,0,0,151,31,1,0,0,0,152,153,3,50,25,0,153,33,1,0,0,0,154,155,3,36,18,
	0,155,35,1,0,0,0,156,157,3,38,19,0,157,158,3,40,20,0,158,37,1,0,0,0,159,
	160,7,0,0,0,160,39,1,0,0,0,161,163,3,42,21,0,162,161,1,0,0,0,163,164,1,
	0,0,0,164,162,1,0,0,0,164,165,1,0,0,0,165,41,1,0,0,0,166,170,5,52,0,0,167,
	170,3,44,22,0,168,170,3,48,24,0,169,166,1,0,0,0,169,167,1,0,0,0,169,168,
	1,0,0,0,170,43,1,0,0,0,171,173,5,29,0,0,172,174,3,46,23,0,173,172,1,0,0,
	0,174,175,1,0,0,0,175,173,1,0,0,0,175,176,1,0,0,0,176,177,1,0,0,0,177,178,
	5,44,0,0,178,45,1,0,0,0,179,182,7,1,0,0,180,182,3,48,24,0,181,179,1,0,0,
	0,181,180,1,0,0,0,182,47,1,0,0,0,183,184,5,43,0,0,184,185,5,47,0,0,185,
	189,5,46,0,0,186,189,5,59,0,0,187,189,5,60,0,0,188,183,1,0,0,0,188,186,
	1,0,0,0,188,187,1,0,0,0,189,49,1,0,0,0,190,191,3,54,27,0,191,51,1,0,0,0,
	192,195,3,54,27,0,193,195,3,62,31,0,194,192,1,0,0,0,194,193,1,0,0,0,195,
	53,1,0,0,0,196,197,5,38,0,0,197,202,3,56,28,0,198,199,5,53,0,0,199,201,
	3,56,28,0,200,198,1,0,0,0,201,204,1,0,0,0,202,200,1,0,0,0,202,203,1,0,0,
	0,203,206,1,0,0,0,204,202,1,0,0,0,205,207,5,53,0,0,206,205,1,0,0,0,206,
	207,1,0,0,0,207,208,1,0,0,0,208,209,5,39,0,0,209,213,1,0,0,0,210,211,5,
	38,0,0,211,213,5,39,0,0,212,196,1,0,0,0,212,210,1,0,0,0,213,55,1,0,0,0,
	214,215,3,58,29,0,215,216,5,54,0,0,216,217,3,60,30,0,217,57,1,0,0,0,218,
	223,3,44,22,0,219,223,5,59,0,0,220,223,5,55,0,0,221,223,5,57,0,0,222,218,
	1,0,0,0,222,219,1,0,0,0,222,220,1,0,0,0,222,221,1,0,0,0,223,59,1,0,0,0,
	224,231,3,44,22,0,225,231,3,64,32,0,226,231,3,54,27,0,227,231,3,62,31,0,
	228,231,5,55,0,0,229,231,3,48,24,0,230,224,1,0,0,0,230,225,1,0,0,0,230,
	226,1,0,0,0,230,227,1,0,0,0,230,228,1,0,0,0,230,229,1,0,0,0,231,61,1,0,
	0,0,232,233,5,40,0,0,233,238,3,60,30,0,234,235,5,53,0,0,235,237,3,60,30,
	0,236,234,1,0,0,0,237,240,1,0,0,0,238,236,1,0,0,0,238,239,1,0,0,0,239,242,
	1,0,0,0,240,238,1,0,0,0,241,243,5,53,0,0,242,241,1,0,0,0,242,243,1,0,0,
	0,243,244,1,0,0,0,244,245,5,41,0,0,245,249,1,0,0,0,246,247,5,40,0,0,247,
	249,5,41,0,0,248,232,1,0,0,0,248,246,1,0,0,0,249,63,1,0,0,0,250,252,5,58,
	0,0,251,250,1,0,0,0,251,252,1,0,0,0,252,253,1,0,0,0,253,254,7,2,0,0,254,
	65,1,0,0,0,26,69,77,83,94,98,105,112,114,121,131,140,164,169,175,181,188,
	194,202,206,212,222,230,238,242,248,251];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!HttlParser.__ATN) {
			HttlParser.__ATN = new ATNDeserializer().deserialize(HttlParser._serializedATN);
		}

		return HttlParser.__ATN;
	}


	static DecisionsToDFA = HttlParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class ProgramContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(HttlParser.EOF, 0);
	}
	public expr_list(): ExprContext[] {
		return this.getTypedRuleContexts(ExprContext) as ExprContext[];
	}
	public expr(i: number): ExprContext {
		return this.getTypedRuleContext(ExprContext, i) as ExprContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_program;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterProgram) {
	 		listener.enterProgram(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitProgram) {
	 		listener.exitProgram(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitProgram) {
			return visitor.visitProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public use(): UseContext {
		return this.getTypedRuleContext(UseContext, 0) as UseContext;
	}
	public request(): RequestContext {
		return this.getTypedRuleContext(RequestContext, 0) as RequestContext;
	}
	public apiHeader(): ApiHeaderContext {
		return this.getTypedRuleContext(ApiHeaderContext, 0) as ApiHeaderContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_expr;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterExpr) {
	 		listener.enterExpr(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitExpr) {
	 		listener.exitExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitExpr) {
			return visitor.visitExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USE(): TerminalNode {
		return this.getToken(HttlParser.USE, 0);
	}
	public apiPath(): ApiPathContext {
		return this.getTypedRuleContext(ApiPathContext, 0) as ApiPathContext;
	}
	public AS(): TerminalNode {
		return this.getToken(HttlParser.AS, 0);
	}
	public apiAlias(): ApiAliasContext {
		return this.getTypedRuleContext(ApiAliasContext, 0) as ApiAliasContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_use;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterUse) {
	 		listener.enterUse(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitUse) {
	 		listener.exitUse(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitUse) {
			return visitor.visitUse(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ApiPathContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_apiPath;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterApiPath) {
	 		listener.enterApiPath(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitApiPath) {
	 		listener.exitApiPath(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitApiPath) {
			return visitor.visitApiPath(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ApiAliasContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(HttlParser.IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_apiAlias;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterApiAlias) {
	 		listener.enterApiAlias(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitApiAlias) {
	 		listener.exitApiAlias(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitApiAlias) {
			return visitor.visitApiAlias(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequestContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public requestMethod(): RequestMethodContext {
		return this.getTypedRuleContext(RequestMethodContext, 0) as RequestMethodContext;
	}
	public requestUrl(): RequestUrlContext {
		return this.getTypedRuleContext(RequestUrlContext, 0) as RequestUrlContext;
	}
	public requestHeader_list(): RequestHeaderContext[] {
		return this.getTypedRuleContexts(RequestHeaderContext) as RequestHeaderContext[];
	}
	public requestHeader(i: number): RequestHeaderContext {
		return this.getTypedRuleContext(RequestHeaderContext, i) as RequestHeaderContext;
	}
	public requestBody(): RequestBodyContext {
		return this.getTypedRuleContext(RequestBodyContext, 0) as RequestBodyContext;
	}
	public AS(): TerminalNode {
		return this.getToken(HttlParser.AS, 0);
	}
	public requestVar(): RequestVarContext {
		return this.getTypedRuleContext(RequestVarContext, 0) as RequestVarContext;
	}
	public ASSERT(): TerminalNode {
		return this.getToken(HttlParser.ASSERT, 0);
	}
	public requestAssert(): RequestAssertContext {
		return this.getTypedRuleContext(RequestAssertContext, 0) as RequestAssertContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_request;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterRequest) {
	 		listener.enterRequest(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitRequest) {
	 		listener.exitRequest(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitRequest) {
			return visitor.visitRequest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequestMethodContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public REQEST_START(): TerminalNode {
		return this.getToken(HttlParser.REQEST_START, 0);
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_requestMethod;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterRequestMethod) {
	 		listener.enterRequestMethod(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitRequestMethod) {
	 		listener.exitRequestMethod(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitRequestMethod) {
			return visitor.visitRequestMethod(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequestUrlContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public stringPart_list(): StringPartContext[] {
		return this.getTypedRuleContexts(StringPartContext) as StringPartContext[];
	}
	public stringPart(i: number): StringPartContext {
		return this.getTypedRuleContext(StringPartContext, i) as StringPartContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_requestUrl;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterRequestUrl) {
	 		listener.enterRequestUrl(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitRequestUrl) {
	 		listener.exitRequestUrl(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitRequestUrl) {
			return visitor.visitRequestUrl(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequestHeaderContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public httpHeader(): HttpHeaderContext {
		return this.getTypedRuleContext(HttpHeaderContext, 0) as HttpHeaderContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_requestHeader;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterRequestHeader) {
	 		listener.enterRequestHeader(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitRequestHeader) {
	 		listener.exitRequestHeader(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitRequestHeader) {
			return visitor.visitRequestHeader(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequestBodyContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public formBody(): FormBodyContext {
		return this.getTypedRuleContext(FormBodyContext, 0) as FormBodyContext;
	}
	public urlEncodedBody(): UrlEncodedBodyContext {
		return this.getTypedRuleContext(UrlEncodedBodyContext, 0) as UrlEncodedBodyContext;
	}
	public jsonBody(): JsonBodyContext {
		return this.getTypedRuleContext(JsonBodyContext, 0) as JsonBodyContext;
	}
	public binBody(): BinBodyContext {
		return this.getTypedRuleContext(BinBodyContext, 0) as BinBodyContext;
	}
	public rawBody(): RawBodyContext {
		return this.getTypedRuleContext(RawBodyContext, 0) as RawBodyContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_requestBody;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterRequestBody) {
	 		listener.enterRequestBody(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitRequestBody) {
	 		listener.exitRequestBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitRequestBody) {
			return visitor.visitRequestBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormBodyContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FORM_BODY(): TerminalNode {
		return this.getToken(HttlParser.FORM_BODY, 0);
	}
	public json(): JsonContext {
		return this.getTypedRuleContext(JsonContext, 0) as JsonContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_formBody;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterFormBody) {
	 		listener.enterFormBody(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitFormBody) {
	 		listener.exitFormBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitFormBody) {
			return visitor.visitFormBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UrlEncodedBodyContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public URL_ENCODED_BODY(): TerminalNode {
		return this.getToken(HttlParser.URL_ENCODED_BODY, 0);
	}
	public json(): JsonContext {
		return this.getTypedRuleContext(JsonContext, 0) as JsonContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_urlEncodedBody;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterUrlEncodedBody) {
	 		listener.enterUrlEncodedBody(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitUrlEncodedBody) {
	 		listener.exitUrlEncodedBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitUrlEncodedBody) {
			return visitor.visitUrlEncodedBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsonBodyContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public json(): JsonContext {
		return this.getTypedRuleContext(JsonContext, 0) as JsonContext;
	}
	public JSON_BODY(): TerminalNode {
		return this.getToken(HttlParser.JSON_BODY, 0);
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_jsonBody;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterJsonBody) {
	 		listener.enterJsonBody(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitJsonBody) {
	 		listener.exitJsonBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitJsonBody) {
			return visitor.visitJsonBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BinBodyContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BINARY_BODY(): TerminalNode {
		return this.getToken(HttlParser.BINARY_BODY, 0);
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_binBody;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterBinBody) {
	 		listener.enterBinBody(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitBinBody) {
	 		listener.exitBinBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitBinBody) {
			return visitor.visitBinBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RawBodyContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public RAW_BODY(): TerminalNode {
		return this.getToken(HttlParser.RAW_BODY, 0);
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_rawBody;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterRawBody) {
	 		listener.enterRawBody(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitRawBody) {
	 		listener.exitRawBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitRawBody) {
			return visitor.visitRawBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequestVarContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(HttlParser.IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_requestVar;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterRequestVar) {
	 		listener.enterRequestVar(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitRequestVar) {
	 		listener.exitRequestVar(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitRequestVar) {
			return visitor.visitRequestVar(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequestAssertContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public jsonAssertion(): JsonAssertionContext {
		return this.getTypedRuleContext(JsonAssertionContext, 0) as JsonAssertionContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_requestAssert;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterRequestAssert) {
	 		listener.enterRequestAssert(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitRequestAssert) {
	 		listener.exitRequestAssert(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitRequestAssert) {
			return visitor.visitRequestAssert(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ApiHeaderContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public httpHeader(): HttpHeaderContext {
		return this.getTypedRuleContext(HttpHeaderContext, 0) as HttpHeaderContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_apiHeader;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterApiHeader) {
	 		listener.enterApiHeader(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitApiHeader) {
	 		listener.exitApiHeader(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitApiHeader) {
			return visitor.visitApiHeader(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HttpHeaderContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public httpHeaderName(): HttpHeaderNameContext {
		return this.getTypedRuleContext(HttpHeaderNameContext, 0) as HttpHeaderNameContext;
	}
	public httpHeaderValue(): HttpHeaderValueContext {
		return this.getTypedRuleContext(HttpHeaderValueContext, 0) as HttpHeaderValueContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_httpHeader;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterHttpHeader) {
	 		listener.enterHttpHeader(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitHttpHeader) {
	 		listener.exitHttpHeader(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitHttpHeader) {
			return visitor.visitHttpHeader(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HttpHeaderNameContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public HTTP_HEADER_NAME(): TerminalNode {
		return this.getToken(HttlParser.HTTP_HEADER_NAME, 0);
	}
	public EXT_HTTP_HEADER_NAME(): TerminalNode {
		return this.getToken(HttlParser.EXT_HTTP_HEADER_NAME, 0);
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_httpHeaderName;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterHttpHeaderName) {
	 		listener.enterHttpHeaderName(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitHttpHeaderName) {
	 		listener.exitHttpHeaderName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitHttpHeaderName) {
			return visitor.visitHttpHeaderName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HttpHeaderValueContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public httpHeaderValuePart_list(): HttpHeaderValuePartContext[] {
		return this.getTypedRuleContexts(HttpHeaderValuePartContext) as HttpHeaderValuePartContext[];
	}
	public httpHeaderValuePart(i: number): HttpHeaderValuePartContext {
		return this.getTypedRuleContext(HttpHeaderValuePartContext, i) as HttpHeaderValuePartContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_httpHeaderValue;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterHttpHeaderValue) {
	 		listener.enterHttpHeaderValue(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitHttpHeaderValue) {
	 		listener.exitHttpHeaderValue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitHttpHeaderValue) {
			return visitor.visitHttpHeaderValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HttpHeaderValuePartContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LINE_CONTENT(): TerminalNode {
		return this.getToken(HttlParser.LINE_CONTENT, 0);
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public var_(): VarContext {
		return this.getTypedRuleContext(VarContext, 0) as VarContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_httpHeaderValuePart;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterHttpHeaderValuePart) {
	 		listener.enterHttpHeaderValuePart(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitHttpHeaderValuePart) {
	 		listener.exitHttpHeaderValuePart(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitHttpHeaderValuePart) {
			return visitor.visitHttpHeaderValuePart(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StringContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public STRING_START(): TerminalNode {
		return this.getToken(HttlParser.STRING_START, 0);
	}
	public STRING_END(): TerminalNode {
		return this.getToken(HttlParser.STRING_END, 0);
	}
	public stringPart_list(): StringPartContext[] {
		return this.getTypedRuleContexts(StringPartContext) as StringPartContext[];
	}
	public stringPart(i: number): StringPartContext {
		return this.getTypedRuleContext(StringPartContext, i) as StringPartContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_string;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterString) {
	 		listener.enterString(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitString) {
	 		listener.exitString(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitString) {
			return visitor.visitString(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StringPartContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_stringPart;
	}
	public override copyFrom(ctx: StringPartContext): void {
		super.copyFrom(ctx);
	}
}
export class StringPartTextContext extends StringPartContext {
	constructor(parser: HttlParser, ctx: StringPartContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public REQEST_URL(): TerminalNode {
		return this.getToken(HttlParser.REQEST_URL, 0);
	}
	public LINE_CONTENT(): TerminalNode {
		return this.getToken(HttlParser.LINE_CONTENT, 0);
	}
	public STRING_CONTENT(): TerminalNode {
		return this.getToken(HttlParser.STRING_CONTENT, 0);
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterStringPartText) {
	 		listener.enterStringPartText(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitStringPartText) {
	 		listener.exitStringPartText(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitStringPartText) {
			return visitor.visitStringPartText(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class StringPartVarContext extends StringPartContext {
	constructor(parser: HttlParser, ctx: StringPartContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public var_(): VarContext {
		return this.getTypedRuleContext(VarContext, 0) as VarContext;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterStringPartVar) {
	 		listener.enterStringPartVar(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitStringPartVar) {
	 		listener.exitStringPartVar(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitStringPartVar) {
			return visitor.visitStringPartVar(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VarContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VAR_INTERPOLATION_START(): TerminalNode {
		return this.getToken(HttlParser.VAR_INTERPOLATION_START, 0);
	}
	public VAR_EXPR(): TerminalNode {
		return this.getToken(HttlParser.VAR_EXPR, 0);
	}
	public VAR_INTERPOLATION_END(): TerminalNode {
		return this.getToken(HttlParser.VAR_INTERPOLATION_END, 0);
	}
	public JSON_IDENTIFIER(): TerminalNode {
		return this.getToken(HttlParser.JSON_IDENTIFIER, 0);
	}
	public JSON_VAR_IDENTIFIER(): TerminalNode {
		return this.getToken(HttlParser.JSON_VAR_IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_var;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterVar) {
	 		listener.enterVar(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitVar) {
	 		listener.exitVar(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitVar) {
			return visitor.visitVar(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsonAssertionContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public json_object(): Json_objectContext {
		return this.getTypedRuleContext(Json_objectContext, 0) as Json_objectContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_jsonAssertion;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterJsonAssertion) {
	 		listener.enterJsonAssertion(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitJsonAssertion) {
	 		listener.exitJsonAssertion(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitJsonAssertion) {
			return visitor.visitJsonAssertion(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsonContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public json_object(): Json_objectContext {
		return this.getTypedRuleContext(Json_objectContext, 0) as Json_objectContext;
	}
	public json_array(): Json_arrayContext {
		return this.getTypedRuleContext(Json_arrayContext, 0) as Json_arrayContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_json;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterJson) {
	 		listener.enterJson(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitJson) {
	 		listener.exitJson(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitJson) {
			return visitor.visitJson(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Json_objectContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public JSON_OBJECT_START(): TerminalNode {
		return this.getToken(HttlParser.JSON_OBJECT_START, 0);
	}
	public json_pair_list(): Json_pairContext[] {
		return this.getTypedRuleContexts(Json_pairContext) as Json_pairContext[];
	}
	public json_pair(i: number): Json_pairContext {
		return this.getTypedRuleContext(Json_pairContext, i) as Json_pairContext;
	}
	public JSON_OBJECT_END(): TerminalNode {
		return this.getToken(HttlParser.JSON_OBJECT_END, 0);
	}
	public JSON_COMMA_list(): TerminalNode[] {
	    	return this.getTokens(HttlParser.JSON_COMMA);
	}
	public JSON_COMMA(i: number): TerminalNode {
		return this.getToken(HttlParser.JSON_COMMA, i);
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_json_object;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterJson_object) {
	 		listener.enterJson_object(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitJson_object) {
	 		listener.exitJson_object(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitJson_object) {
			return visitor.visitJson_object(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Json_pairContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public json_key(): Json_keyContext {
		return this.getTypedRuleContext(Json_keyContext, 0) as Json_keyContext;
	}
	public JSON_SEMI(): TerminalNode {
		return this.getToken(HttlParser.JSON_SEMI, 0);
	}
	public json_value(): Json_valueContext {
		return this.getTypedRuleContext(Json_valueContext, 0) as Json_valueContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_json_pair;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterJson_pair) {
	 		listener.enterJson_pair(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitJson_pair) {
	 		listener.exitJson_pair(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitJson_pair) {
			return visitor.visitJson_pair(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Json_keyContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public JSON_IDENTIFIER(): TerminalNode {
		return this.getToken(HttlParser.JSON_IDENTIFIER, 0);
	}
	public JSON_LITERAL(): TerminalNode {
		return this.getToken(HttlParser.JSON_LITERAL, 0);
	}
	public JSON_NUMERIC_LITERAL(): TerminalNode {
		return this.getToken(HttlParser.JSON_NUMERIC_LITERAL, 0);
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_json_key;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterJson_key) {
	 		listener.enterJson_key(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitJson_key) {
	 		listener.exitJson_key(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitJson_key) {
			return visitor.visitJson_key(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Json_valueContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public json_number(): Json_numberContext {
		return this.getTypedRuleContext(Json_numberContext, 0) as Json_numberContext;
	}
	public json_object(): Json_objectContext {
		return this.getTypedRuleContext(Json_objectContext, 0) as Json_objectContext;
	}
	public json_array(): Json_arrayContext {
		return this.getTypedRuleContext(Json_arrayContext, 0) as Json_arrayContext;
	}
	public JSON_LITERAL(): TerminalNode {
		return this.getToken(HttlParser.JSON_LITERAL, 0);
	}
	public var_(): VarContext {
		return this.getTypedRuleContext(VarContext, 0) as VarContext;
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_json_value;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterJson_value) {
	 		listener.enterJson_value(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitJson_value) {
	 		listener.exitJson_value(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitJson_value) {
			return visitor.visitJson_value(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Json_arrayContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public JSON_ARRAY_START(): TerminalNode {
		return this.getToken(HttlParser.JSON_ARRAY_START, 0);
	}
	public json_value_list(): Json_valueContext[] {
		return this.getTypedRuleContexts(Json_valueContext) as Json_valueContext[];
	}
	public json_value(i: number): Json_valueContext {
		return this.getTypedRuleContext(Json_valueContext, i) as Json_valueContext;
	}
	public JSON_ARRAY_END(): TerminalNode {
		return this.getToken(HttlParser.JSON_ARRAY_END, 0);
	}
	public JSON_COMMA_list(): TerminalNode[] {
	    	return this.getTokens(HttlParser.JSON_COMMA);
	}
	public JSON_COMMA(i: number): TerminalNode {
		return this.getToken(HttlParser.JSON_COMMA, i);
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_json_array;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterJson_array) {
	 		listener.enterJson_array(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitJson_array) {
	 		listener.exitJson_array(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitJson_array) {
			return visitor.visitJson_array(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Json_numberContext extends ParserRuleContext {
	constructor(parser?: HttlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public JSON_NUMERIC_LITERAL(): TerminalNode {
		return this.getToken(HttlParser.JSON_NUMERIC_LITERAL, 0);
	}
	public JSON_NUMBER(): TerminalNode {
		return this.getToken(HttlParser.JSON_NUMBER, 0);
	}
	public JSON_SYMBOL(): TerminalNode {
		return this.getToken(HttlParser.JSON_SYMBOL, 0);
	}
    public get ruleIndex(): number {
    	return HttlParser.RULE_json_number;
	}
	public enterRule(listener: HttlParserListener): void {
	    if(listener.enterJson_number) {
	 		listener.enterJson_number(this);
		}
	}
	public exitRule(listener: HttlParserListener): void {
	    if(listener.exitJson_number) {
	 		listener.exitJson_number(this);
		}
	}
	// @Override
	public accept<Result>(visitor: HttlParserVisitor<Result>): Result {
		if (visitor.visitJson_number) {
			return visitor.visitJson_number(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
