// $antlr-format alignTrailingComments on, columnLimit 130, minEmptyLines 1, maxEmptyLinesToKeep 1, reflowComments off
// $antlr-format useTab off, allowShortRulesOnASingleLine off, allowShortBlocksOnASingleLine on, alignSemicolons hanging
// $antlr-format alignColons hanging

parser grammar HttlParser;

options {
    tokenVocab = HttlLexer;
    superClass = HttlParserBase;
}

program
    : expr* EOF
    ;

expr
    : use
    | request
    | apiHeader
    ;

//
// API
use
    : USE apiPath (AS apiAlias)?
    ;

apiPath
    : string
    ;

apiAlias
    : IDENTIFIER
    ;

//
// Request
request
    : requestMethod requestUrl requestHeader* requestBody? (
        ((AS requestVar) (ASSERT requestAssert)?)
        | ((ASSERT requestAssert) (AS requestVar)?)
    )?
    ;

requestMethod
    : REQEST_START
    ;

requestUrl
    : stringPart+
    ;

requestHeader
    : {this.hasNoBreaks()}? httpHeader
    ;

// Req: Body
requestBody
    : formBody
    | urlEncodedBody
    | jsonBody
    | binBody
    | rawBody
    ;

formBody
    : FORM_BODY json
    ;

urlEncodedBody
    : URL_ENCODED_BODY json
    ;

jsonBody
    : JSON_BODY? json
    ;

binBody
    : BINARY_BODY string
    ;

rawBody
    : RAW_BODY string
    ;

// Req: Var
requestVar
    : IDENTIFIER
    ;

requestAssert
    : jsonAssertion
    ;

//
// Api Global Header
apiHeader
    : httpHeader
    ;

//
// HTTP Header
httpHeader
    : httpHeaderName httpHeaderValue
    ;

httpHeaderName
    : HTTP_HEADER_NAME
    | EXT_HTTP_HEADER_NAME
    ;

httpHeaderValue
    : httpHeaderValuePart+
    ;

httpHeaderValuePart
    : LINE_CONTENT
    | string
    | var
    ;

//
// String rules
string
    : STRING_START stringPart+ STRING_END
    ;

stringPart
    : (REQEST_URL | LINE_CONTENT | STRING_CONTENT) # StringPartText
    | var                                          # StringPartVar
    ;

//
// Var rules
var
    : (VAR_INTERPOLATION_START VAR_EXPR VAR_INTERPOLATION_END)
    | JSON_IDENTIFIER
    | JSON_VAR_IDENTIFIER
    ;

//
// Assertion JSON rules
jsonAssertion
    : json_object
    ;

//
// JSON rules
json
    // : json_value
    : json_object
    | json_array
    ;

json_object
    : JSON_OBJECT_START json_pair (JSON_COMMA json_pair)* JSON_COMMA? JSON_OBJECT_END
    | JSON_OBJECT_START JSON_OBJECT_END
    ;

json_pair
    : json_key JSON_SEMI json_value
    ;

json_key
    : string
    | JSON_IDENTIFIER
    | JSON_LITERAL
    | JSON_NUMERIC_LITERAL
    ;

json_value
    : string
    | json_number
    | json_object
    | json_array
    | JSON_LITERAL
    | var
    ;

json_array
    : JSON_ARRAY_START json_value (JSON_COMMA json_value)* JSON_COMMA? JSON_ARRAY_END
    | JSON_ARRAY_START JSON_ARRAY_END
    ;

json_number
    : JSON_SYMBOL? (JSON_NUMERIC_LITERAL | JSON_NUMBER)
    ;