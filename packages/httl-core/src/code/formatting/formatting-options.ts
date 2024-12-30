export interface FormattingOptions {
  /**
   * Size of a tab in spaces.
   */
  tabSize: number;
  /**
   * Prefer spaces over tabs.
   */
  insertSpaces: boolean;
  /**
   * Trim trailing whitespace on a line.
   *
   * @since 3.15.0
   */
  trimTrailingWhitespace?: boolean;
  /**
   * Insert a newline character at the end of the file if one does not exist.
   *
   * @since 3.15.0
   */
  insertFinalNewline?: boolean;
  /**
   * Trim all newlines after the final newline at the end of the file.
   *
   * @since 3.15.0
   */
  trimFinalNewlines?: boolean;
}