import { Position, RuntimeObjectBase, TokenExpression } from "../common";
import { IRuntimeExecutor } from "../runtime";

type Column = number;
type Line = number;

export class CodeMap {
  protected tokenExpressionsMap = new Map<Line, Map<Column, RuntimeObjectBase>>();

  constructor(
    protected readonly executor: IRuntimeExecutor
  ) { }

  public register(rt: RuntimeObjectBase) {
    if (!rt.expr)
      return;

    if (rt.expr instanceof TokenExpression) {
      const { column, line } = rt.expr.token;
      const length = rt.expr.token.length();

      for (let col = 0; col < length; col++) {
        const lineMap = this.tokenExpressionsMap.get(line) || new Map<Column, RuntimeObjectBase>();
        lineMap.set(col + column, rt);
        this.tokenExpressionsMap.set(line, lineMap);
      }

      return;
    }
  }

  public objectAt(position: Position): RuntimeObjectBase | undefined {
    const line = this.tokenExpressionsMap.get(position.line)

    // Get a runtime object at the exact position
    return line?.get(position.column) ||
      line?.get(Math.max(position.column - 1, 0))
  }

  public closestLeftObjectAt(position: Position): RuntimeObjectBase | undefined {
    // Get the closest runtime object to the left
    let lastColumn = false;
    for (let l = position.line; l >= 0; l--) {
      const line = this.tokenExpressionsMap.get(l)
      if (line) {
        const sortedColumns = Array.from(line.keys()).sort((a, b) => b - a);
        if (lastColumn) {
          return line.get(sortedColumns[0]);
        }

        const newColumn = sortedColumns.find(c => c < position.column);
        if (newColumn) {
          return line.get(newColumn);
        }
      }
      lastColumn = true;
    }
  }
}