// Generated from HttlParser.g4 by ANTLR 4.13.2

import {ParseTreeVisitor} from 'antlr4';


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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `HttlParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class HttlParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `HttlParser.program`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgram?: (ctx: ProgramContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr?: (ctx: ExprContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.use`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUse?: (ctx: UseContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.apiPath`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitApiPath?: (ctx: ApiPathContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.apiAlias`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitApiAlias?: (ctx: ApiAliasContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.request`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequest?: (ctx: RequestContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.requestMethod`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequestMethod?: (ctx: RequestMethodContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.requestUrl`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequestUrl?: (ctx: RequestUrlContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.requestHeader`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequestHeader?: (ctx: RequestHeaderContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.requestBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequestBody?: (ctx: RequestBodyContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.formBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFormBody?: (ctx: FormBodyContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.urlEncodedBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUrlEncodedBody?: (ctx: UrlEncodedBodyContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.jsonBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonBody?: (ctx: JsonBodyContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.binBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBinBody?: (ctx: BinBodyContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.rawBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRawBody?: (ctx: RawBodyContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.requestVar`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequestVar?: (ctx: RequestVarContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.requestAssert`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequestAssert?: (ctx: RequestAssertContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.apiHeader`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitApiHeader?: (ctx: ApiHeaderContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.httpHeader`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHttpHeader?: (ctx: HttpHeaderContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.httpHeaderName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHttpHeaderName?: (ctx: HttpHeaderNameContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.httpHeaderValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHttpHeaderValue?: (ctx: HttpHeaderValueContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.httpHeaderValuePart`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHttpHeaderValuePart?: (ctx: HttpHeaderValuePartContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.string`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitString?: (ctx: StringContext) => Result;
	/**
	 * Visit a parse tree produced by the `StringPartText`
	 * labeled alternative in `HttlParser.stringPart`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStringPartText?: (ctx: StringPartTextContext) => Result;
	/**
	 * Visit a parse tree produced by the `StringPartVar`
	 * labeled alternative in `HttlParser.stringPart`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStringPartVar?: (ctx: StringPartVarContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.var`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVar?: (ctx: VarContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.jsonAssertion`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonAssertion?: (ctx: JsonAssertionContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.json`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJson?: (ctx: JsonContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.json_object`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJson_object?: (ctx: Json_objectContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.json_pair`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJson_pair?: (ctx: Json_pairContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.json_key`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJson_key?: (ctx: Json_keyContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.json_value`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJson_value?: (ctx: Json_valueContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.json_array`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJson_array?: (ctx: Json_arrayContext) => Result;
	/**
	 * Visit a parse tree produced by `HttlParser.json_number`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJson_number?: (ctx: Json_numberContext) => Result;
}

