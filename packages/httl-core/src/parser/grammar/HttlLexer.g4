// $antlr-format alignTrailingComments on, columnLimit 130, minEmptyLines 1, maxEmptyLinesToKeep 1, reflowComments off
// $antlr-format useTab off, allowShortRulesOnASingleLine off, allowShortBlocksOnASingleLine on, alignSemicolons hanging
// $antlr-format alignColons hanging

lexer grammar HttlLexer;

options {
    superClass = HttlLexerBase;
}

channels {
    CRLF_CHANNEL,
    COMMENT_CHANNEL,
    WS_CHANNEL
}

// Keywords
USE
    : 'use'
    ;

AS
    : 'as'
    ;

ASSERT
    : 'assert'
    ;

// Request Body Types
JSON_BODY
    : 'json'
    ;

FORM_BODY
    : 'formdata'
    ;

URL_ENCODED_BODY
    : 'urlencoded'
    ;

BINARY_BODY
    : 'bin'
    ;

RAW_BODY
    : 'raw'
    ;

// Verbs
GET
    : 'get'
    ;

POST
    : 'post'
    ;

PUT
    : 'put'
    ;

DELETE
    : 'delete'
    ;

PATCH
    : 'patch'
    ;

HEAD
    : 'head'
    ;

OPTIONS
    : 'options'
    ;

CONNECT
    : 'connect'
    ;

TRACE
    : 'trace'
    ;

LOCK
    : 'lock'
    ;

UNLOCK
    : 'unlock'
    ;

PROPFIND
    : 'propfind'
    ;

PROPPATCH
    : 'proppatch'
    ;

COPY
    : 'copy'
    ;

MOVE
    : 'move'
    ;

MKCOL
    : 'mkcol'
    ;

MKCALENDAR
    : 'mkcalendar'
    ;

ACL
    : 'acl'
    ;

SEARCH
    : 'search'
    ;

fragment HTTP_METHOD
    : GET
    | POST
    | PUT
    | DELETE
    | PATCH
    | HEAD
    | OPTIONS
    | CONNECT
    | TRACE
    | LOCK
    | UNLOCK
    | PROPFIND
    | PROPPATCH
    | COPY
    | MOVE
    | MKCOL
    | MKCALENDAR
    | ACL
    | SEARCH
    ;

fragment KEYWORD
    : USE
    | AS
    | ASSERT
    | JSON_BODY
    | FORM_BODY
    | URL_ENCODED_BODY
    | BINARY_BODY
    | RAW_BODY
    | HTTP_METHOD
    ;

VAR_TEST
    : '{' IDENTIFIER '}'
    ;

STRING_START
    : '"' -> pushMode(STRING_MODE)
    ;

REQEST_START
    : {this.isStartOfLine()}? (HTTP_METHOD /*| STRING*/) [ ]+ -> pushMode(REQEST_URL_MODE)
    ;

EXT_HTTP_HEADER_NAME
    : {this.isStartOfLine()}? '@' HEADER_NAME {!this.hasWhitespaces()}? ':' -> pushMode(END_OF_LINE_MODE)
    ;

HTTP_HEADER_NAME
    : {this.isStartOfLine()}? HEADER_NAME {!this.hasWhitespaces()}? ':' -> pushMode(END_OF_LINE_MODE)
    ;

fragment HEADER_NAME
    : (IDENTIFIER | KEYWORD | [-])+
    /*| STRING*/
    ;

// Common rules
IDENTIFIER
    : [a-zA-Z_][a-zA-Z_0-9]*
    ;

DIGITS
    : [0-9]+
    ;

// Skip rules
CRLF
    : '\r'? '\n' -> channel(CRLF_CHANNEL)
    ;

COMMENT
    : WS? '#' ~[\r\n]* -> channel(COMMENT_CHANNEL)
    ;

WS
    : [ \t]+ -> channel(WS_CHANNEL)
    ;

// ----------------- JSON SWITCH ---------------------
JSON_OBJECT_START
    : '{' -> pushMode(JSON_MODE)
    ;

JSON_OBJECT_END
    : '}' -> popMode
    ;

JSON_ARRAY_START
    : '[' -> pushMode(JSON_MODE)
    ;

JSON_ARRAY_END
    : ']' -> popMode
    ;

// For debug pupose
ERROR
    : .
    ;

// ----------------- STRING_MODE ---------------------
mode STRING_MODE;

VAR_INTERPOLATION_START
    : '{' -> pushMode(VAR_INTERPOLATION_MODE)
    ;

STRING_END
    : '"' -> popMode
    ;

STRING_CONTENT
    : (~[\r\n"{#] | '\\"' | '\\{' | '#' .)+
    ;

// ----------------- VAR ---------------------
mode VAR_INTERPOLATION_MODE;

VAR_INTERPOLATION_END
    : '}' -> popMode
    ;

VAR_EXPR
    : ~[}]+
    ;

// ----------------- REQEST_URL_MODE ---------------------
mode REQEST_URL_MODE;

REQEST_URL_MODE_VAR_START
    : '{' -> pushMode(VAR_INTERPOLATION_MODE), type(VAR_INTERPOLATION_START)
    ;

END_OF_REQEST_URL
    : [ ] {this.rewind();} -> popMode, skip
    ;

END_OF_REQEST_URL_NL
    : [\r\n] {this.rewind();} -> popMode, skip
    ;

REQEST_URL
    : ~[ {\r\n]+
    ;

// ----------------- END_OF_LINE_MODE ---------------------
mode END_OF_LINE_MODE;

END_OF_LINE_MODE_STRING_START
    : '"' -> pushMode(STRING_MODE), type(STRING_START)
    ;

END_OF_LINE_MODE_VAR_START
    : '{' -> pushMode(VAR_INTERPOLATION_MODE), type(VAR_INTERPOLATION_START)
    ;

END_OF_LINE
    : ["\r\n] {this.rewind();} -> popMode, skip
    ;

LINE_CONTENT
    : ~["{\r\n]+
    ;

// ----------------- JSON ---------------------
mode JSON_MODE;

JSON_MODE_STRING_START
    : '"' -> pushMode(STRING_MODE), type(STRING_START)
    ;

JSON_BLOCK_START_IN
    : '{' -> pushMode(JSON_MODE), type(JSON_OBJECT_START)
    ;

JSON_BLOCK_END_IN
    : '}' -> popMode, type(JSON_OBJECT_END)
    ;

JSON_ARRAY_START_IN
    : '[' -> pushMode(JSON_MODE), type(JSON_ARRAY_START)
    ;

JSON_ARRAY_END_IN
    : ']' -> popMode, type(JSON_ARRAY_END)
    ;

JSON_COMMA
    : ','
    ;

JSON_SEMI
    : ':'
    ;

JSON_LITERAL
    : 'true'
    | 'false'
    | 'null'
    ;

JSON_NUMBER
    : INT ('.' [0-9]*)? EXP? // +1.e2, 1234, 1234.5
    | '.' [0-9]+ EXP?        // -.2e3
    | '0' [xX] HEX+
    ; // 0x12345678

JSON_NUMERIC_LITERAL
    : 'Infinity'
    | 'NaN'
    ;

JSON_SYMBOL
    : '+'
    | '-'
    ;

fragment HEX
    : [0-9a-fA-F]
    ;

fragment INT
    : '0'
    | [1-9] [0-9]*
    ;

fragment EXP
    : [Ee] JSON_SYMBOL? [0-9]*
    ;

JSON_IDENTIFIER
    : IDENTIFIER_START IDENTIFIER_PART*
    ;

fragment IDENTIFIER_START
    : [\p{L}]
    | '_'
    | '\\' UNICODE_SEQUENCE
    ;

fragment IDENTIFIER_PART
    : IDENTIFIER_START
    | [\p{M}]
    | [\p{N}]
    | [\p{Pc}]
    | '\u200C'
    | '\u200D'
    ;

JSON_VAR_IDENTIFIER
    : JSON_VAR_IDENTIFIER_START JSON_VAR_IDENTIFIER_SEGMENT*
    ;

fragment JSON_VAR_IDENTIFIER_START
    : [a-zA-Z_][a-zA-Z_0-9]*
    ;

fragment JSON_VAR_IDENTIFIER_SEGMENT
    : '.' JSON_VAR_IDENTIFIER_START
    | '[' (INT | JSON_VAR_IDENTIFIER_START | JSON_VAR_STRING_SEGMENT) ']'
    ;

fragment JSON_VAR_STRING_SEGMENT
    : '"' (~["\\])* '"'
    | '\'' (~['\\])* '\''
    ;

fragment UNICODE_SEQUENCE
    : 'u' HEX HEX HEX HEX
    ;

fragment NEWLINE
    : '\r\n'
    | [\r\n\u2028\u2029]
    ;

JSON_COMMENT
    : WS? '#' ~[\r\n]* -> channel(COMMENT_CHANNEL), type(COMMENT)
    ;

JSON_WS
    : [ \t\n\r\u00A0\uFEFF\u2003]+ -> channel(CRLF_CHANNEL) 
    ;