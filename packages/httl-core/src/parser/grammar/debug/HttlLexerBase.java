
// Generated from HttlParser.g4 by ANTLR 4.13.2
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;

import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

public abstract class HttlLexerBase extends Lexer {
  private List<Token> _tokensStream = new ArrayList<>();
  // private Token _lastToken;
  private int _previousIndex;
  private int _tempLine = -1;
  private int _tempColumn = -1;

  public HttlLexerBase(CharStream input) {
    super(input);
  }

  public boolean isStartOfLine() {
    // System.out.println("[" + _tokenStartCharIndex + "]: Start ");

    if (_tokenStartCharIndex <= 0)
      return true;

    for (int i = _tokensStream.size() - 1; i >= 0; i--) {
      Token token = _tokensStream.get(i);
      // System.out.println("[" + _tokenStartCharIndex + "]: Token " + token);

      if (token.getChannel() == HttlLexer.WS_CHANNEL) {
        // System.out.println("[" + _tokenStartCharIndex + "]: Continue ");
        continue;
      }

      if (token.getChannel() == HttlLexer.CRLF_CHANNEL) {
        // System.out.println("[" + _tokenStartCharIndex + "]: Success");
        return true;
      }

      // if (token.getType() == HttlLexer.END_OF_LINE) {
      //   // System.out.println("[" + _tokenStartCharIndex + "]: Success");
      //   return true;
      // }

      // if (token.getType() == HttlLexer.END_OF_STRING) {
      //   // System.out.println("[" + _tokenStartCharIndex + "]: Success");
      //   return true;
      // }

      // System.out.println("[" + _tokenStartCharIndex + "]: Fail loop");

      return false;
    }

    // System.out.println("[" + _tokenStartCharIndex + "]: Fail end");
    return true;
  }

  public boolean hasWhitespaces() {
    Token lastToken = getLastToken();
    boolean result = lastToken != null && lastToken.getChannel() == HttlLexer.WS_CHANNEL
        && getText().trim().length() != getText().length();
    // System.out.println("hasWhitespaces: `" + getText() + "` " + lastToken + " " + result);
    return result;
  }

  public boolean isToken(int tokenType) {
    Token lastToken = getLastToken();

    boolean result = lastToken != null && lastToken.getType() == tokenType;
    // if (lastToken != null)
    // System.out.println("isToken1: " + result + " " + lastToken.getType());
    // else
    // System.out.println("isToken2: " + result);

    return result;
  }

  public void rewind() {
    _input.seek(_previousIndex); 
    Token lastToken = getLastToken();
    _tempLine = getLine() - 1;
    _tempColumn = lastToken.getCharPositionInLine() + lastToken.getText().length() + 1;
  }

  @Override
  public Token emit() {
    _previousIndex = _input.index();
    
    Token token = super.emit();
    if (token != null && token.getText().equals("\n") && _tempLine != -1 && _tempColumn != -1) {
      ((WritableToken)token).setLine(_tempLine);
      ((WritableToken)token).setCharPositionInLine(_tempColumn);
      setLine(getLine() - 1);
    }

    _tempLine = -1;
    _tempColumn = -1;

    // System.out.println("emit: " + _previousIndex);
    // System.out.println("emit: " + token.getType() + " " + token.getText() + " " + token.getLine() + " -:" + _tokenStartLine);
    _tokensStream.add(token);
    return token;
  }

  private Token getLastToken() {
    int idx = _tokensStream.size() - 1;
    return idx >= 0
        ? _tokensStream.get(idx)
        : null;
  }
}
