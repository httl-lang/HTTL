// Generated from HttlParser.g4 by ANTLR 4.13.2

import {ParseTreeListener} from "antlr4";


import { ProgramContext } from "./HttlParser.js";
import { ExprContext } from "./HttlParser.js";
import { UseContext } from "./HttlParser.js";
import { ApiPathContext } from "./HttlParser.js";
import { ApiAliasContext } from "./HttlParser.js";
import { RequestContext } from "./HttlParser.js";
import { RequestMethodContext } from "./HttlParser.js";
import { RequestUrlContext } from "./HttlParser.js";
import { RequestHeaderContext } from "./HttlParser.js";
import { RequestBodyContext } from "./HttlParser.js";
import { FormBodyContext } from "./HttlParser.js";
import { UrlEncodedBodyContext } from "./HttlParser.js";
import { JsonBodyContext } from "./HttlParser.js";
import { BinBodyContext } from "./HttlParser.js";
import { RawBodyContext } from "./HttlParser.js";
import { RequestVarContext } from "./HttlParser.js";
import { RequestAssertContext } from "./HttlParser.js";
import { ApiHeaderContext } from "./HttlParser.js";
import { HttpHeaderContext } from "./HttlParser.js";
import { HttpHeaderNameContext } from "./HttlParser.js";
import { HttpHeaderValueContext } from "./HttlParser.js";
import { HttpHeaderValuePartContext } from "./HttlParser.js";
import { StringContext } from "./HttlParser.js";
import { StringPartTextContext } from "./HttlParser.js";
import { StringPartVarContext } from "./HttlParser.js";
import { VarContext } from "./HttlParser.js";
import { JsonAssertionContext } from "./HttlParser.js";
import { JsonContext } from "./HttlParser.js";
import { Json_objectContext } from "./HttlParser.js";
import { Json_pairContext } from "./HttlParser.js";
import { Json_keyContext } from "./HttlParser.js";
import { Json_valueContext } from "./HttlParser.js";
import { Json_arrayContext } from "./HttlParser.js";
import { Json_numberContext } from "./HttlParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `HttlParser`.
 */
export default class HttlParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `HttlParser.program`.
	 * @param ctx the parse tree
	 */
	enterProgram?: (ctx: ProgramContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.program`.
	 * @param ctx the parse tree
	 */
	exitProgram?: (ctx: ProgramContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.use`.
	 * @param ctx the parse tree
	 */
	enterUse?: (ctx: UseContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.use`.
	 * @param ctx the parse tree
	 */
	exitUse?: (ctx: UseContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.apiPath`.
	 * @param ctx the parse tree
	 */
	enterApiPath?: (ctx: ApiPathContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.apiPath`.
	 * @param ctx the parse tree
	 */
	exitApiPath?: (ctx: ApiPathContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.apiAlias`.
	 * @param ctx the parse tree
	 */
	enterApiAlias?: (ctx: ApiAliasContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.apiAlias`.
	 * @param ctx the parse tree
	 */
	exitApiAlias?: (ctx: ApiAliasContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.request`.
	 * @param ctx the parse tree
	 */
	enterRequest?: (ctx: RequestContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.request`.
	 * @param ctx the parse tree
	 */
	exitRequest?: (ctx: RequestContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.requestMethod`.
	 * @param ctx the parse tree
	 */
	enterRequestMethod?: (ctx: RequestMethodContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.requestMethod`.
	 * @param ctx the parse tree
	 */
	exitRequestMethod?: (ctx: RequestMethodContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.requestUrl`.
	 * @param ctx the parse tree
	 */
	enterRequestUrl?: (ctx: RequestUrlContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.requestUrl`.
	 * @param ctx the parse tree
	 */
	exitRequestUrl?: (ctx: RequestUrlContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.requestHeader`.
	 * @param ctx the parse tree
	 */
	enterRequestHeader?: (ctx: RequestHeaderContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.requestHeader`.
	 * @param ctx the parse tree
	 */
	exitRequestHeader?: (ctx: RequestHeaderContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.requestBody`.
	 * @param ctx the parse tree
	 */
	enterRequestBody?: (ctx: RequestBodyContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.requestBody`.
	 * @param ctx the parse tree
	 */
	exitRequestBody?: (ctx: RequestBodyContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.formBody`.
	 * @param ctx the parse tree
	 */
	enterFormBody?: (ctx: FormBodyContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.formBody`.
	 * @param ctx the parse tree
	 */
	exitFormBody?: (ctx: FormBodyContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.urlEncodedBody`.
	 * @param ctx the parse tree
	 */
	enterUrlEncodedBody?: (ctx: UrlEncodedBodyContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.urlEncodedBody`.
	 * @param ctx the parse tree
	 */
	exitUrlEncodedBody?: (ctx: UrlEncodedBodyContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.jsonBody`.
	 * @param ctx the parse tree
	 */
	enterJsonBody?: (ctx: JsonBodyContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.jsonBody`.
	 * @param ctx the parse tree
	 */
	exitJsonBody?: (ctx: JsonBodyContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.binBody`.
	 * @param ctx the parse tree
	 */
	enterBinBody?: (ctx: BinBodyContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.binBody`.
	 * @param ctx the parse tree
	 */
	exitBinBody?: (ctx: BinBodyContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.rawBody`.
	 * @param ctx the parse tree
	 */
	enterRawBody?: (ctx: RawBodyContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.rawBody`.
	 * @param ctx the parse tree
	 */
	exitRawBody?: (ctx: RawBodyContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.requestVar`.
	 * @param ctx the parse tree
	 */
	enterRequestVar?: (ctx: RequestVarContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.requestVar`.
	 * @param ctx the parse tree
	 */
	exitRequestVar?: (ctx: RequestVarContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.requestAssert`.
	 * @param ctx the parse tree
	 */
	enterRequestAssert?: (ctx: RequestAssertContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.requestAssert`.
	 * @param ctx the parse tree
	 */
	exitRequestAssert?: (ctx: RequestAssertContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.apiHeader`.
	 * @param ctx the parse tree
	 */
	enterApiHeader?: (ctx: ApiHeaderContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.apiHeader`.
	 * @param ctx the parse tree
	 */
	exitApiHeader?: (ctx: ApiHeaderContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.httpHeader`.
	 * @param ctx the parse tree
	 */
	enterHttpHeader?: (ctx: HttpHeaderContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.httpHeader`.
	 * @param ctx the parse tree
	 */
	exitHttpHeader?: (ctx: HttpHeaderContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.httpHeaderName`.
	 * @param ctx the parse tree
	 */
	enterHttpHeaderName?: (ctx: HttpHeaderNameContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.httpHeaderName`.
	 * @param ctx the parse tree
	 */
	exitHttpHeaderName?: (ctx: HttpHeaderNameContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.httpHeaderValue`.
	 * @param ctx the parse tree
	 */
	enterHttpHeaderValue?: (ctx: HttpHeaderValueContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.httpHeaderValue`.
	 * @param ctx the parse tree
	 */
	exitHttpHeaderValue?: (ctx: HttpHeaderValueContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.httpHeaderValuePart`.
	 * @param ctx the parse tree
	 */
	enterHttpHeaderValuePart?: (ctx: HttpHeaderValuePartContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.httpHeaderValuePart`.
	 * @param ctx the parse tree
	 */
	exitHttpHeaderValuePart?: (ctx: HttpHeaderValuePartContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.string`.
	 * @param ctx the parse tree
	 */
	enterString?: (ctx: StringContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.string`.
	 * @param ctx the parse tree
	 */
	exitString?: (ctx: StringContext) => void;
	/**
	 * Enter a parse tree produced by the `StringPartText`
	 * labeled alternative in `HttlParser.stringPart`.
	 * @param ctx the parse tree
	 */
	enterStringPartText?: (ctx: StringPartTextContext) => void;
	/**
	 * Exit a parse tree produced by the `StringPartText`
	 * labeled alternative in `HttlParser.stringPart`.
	 * @param ctx the parse tree
	 */
	exitStringPartText?: (ctx: StringPartTextContext) => void;
	/**
	 * Enter a parse tree produced by the `StringPartVar`
	 * labeled alternative in `HttlParser.stringPart`.
	 * @param ctx the parse tree
	 */
	enterStringPartVar?: (ctx: StringPartVarContext) => void;
	/**
	 * Exit a parse tree produced by the `StringPartVar`
	 * labeled alternative in `HttlParser.stringPart`.
	 * @param ctx the parse tree
	 */
	exitStringPartVar?: (ctx: StringPartVarContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.var`.
	 * @param ctx the parse tree
	 */
	enterVar?: (ctx: VarContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.var`.
	 * @param ctx the parse tree
	 */
	exitVar?: (ctx: VarContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.jsonAssertion`.
	 * @param ctx the parse tree
	 */
	enterJsonAssertion?: (ctx: JsonAssertionContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.jsonAssertion`.
	 * @param ctx the parse tree
	 */
	exitJsonAssertion?: (ctx: JsonAssertionContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.json`.
	 * @param ctx the parse tree
	 */
	enterJson?: (ctx: JsonContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.json`.
	 * @param ctx the parse tree
	 */
	exitJson?: (ctx: JsonContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.json_object`.
	 * @param ctx the parse tree
	 */
	enterJson_object?: (ctx: Json_objectContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.json_object`.
	 * @param ctx the parse tree
	 */
	exitJson_object?: (ctx: Json_objectContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.json_pair`.
	 * @param ctx the parse tree
	 */
	enterJson_pair?: (ctx: Json_pairContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.json_pair`.
	 * @param ctx the parse tree
	 */
	exitJson_pair?: (ctx: Json_pairContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.json_key`.
	 * @param ctx the parse tree
	 */
	enterJson_key?: (ctx: Json_keyContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.json_key`.
	 * @param ctx the parse tree
	 */
	exitJson_key?: (ctx: Json_keyContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.json_value`.
	 * @param ctx the parse tree
	 */
	enterJson_value?: (ctx: Json_valueContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.json_value`.
	 * @param ctx the parse tree
	 */
	exitJson_value?: (ctx: Json_valueContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.json_array`.
	 * @param ctx the parse tree
	 */
	enterJson_array?: (ctx: Json_arrayContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.json_array`.
	 * @param ctx the parse tree
	 */
	exitJson_array?: (ctx: Json_arrayContext) => void;
	/**
	 * Enter a parse tree produced by `HttlParser.json_number`.
	 * @param ctx the parse tree
	 */
	enterJson_number?: (ctx: Json_numberContext) => void;
	/**
	 * Exit a parse tree produced by `HttlParser.json_number`.
	 * @param ctx the parse tree
	 */
	exitJson_number?: (ctx: Json_numberContext) => void;
}

