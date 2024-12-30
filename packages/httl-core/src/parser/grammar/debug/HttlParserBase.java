
// Generated from HttlParser.g4 by ANTLR 4.13.2
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

public abstract class HttlParserBase extends Parser {
  public HttlParserBase(TokenStream input) {
    super(input);
  }

  public boolean hasNoBreaks() {
    int idx = getCurrentToken().getTokenIndex();
    // System.out.println("CurrentToken: " + getCurrentToken().getType());
   
    int currentTokenType;
    int count = 0;

    do {
      currentTokenType = getTokenStream().get(--idx).getType();
      // System.out.println("PreviousToken: " + currentTokenType);

      if (currentTokenType == HttlParser.WS) {
        continue;
      }

      if (currentTokenType == HttlParser.CRLF) {
        count++;
      }

      if (currentTokenType == HttlParser.COMMENT) {
        count--;
      }

    } while (currentTokenType == HttlParser.CRLF || currentTokenType == HttlParser.COMMENT || currentTokenType == HttlParser.WS);

    return count == 1;
  }
}
