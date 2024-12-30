
export interface InlineCompletionItem {
  /**
   * The text to replace the range with. Must be set.
   */
  insertText: string;
  /**
   * A text that is used to decide if this inline completion should be shown. When `falsy` the {@link InlineCompletionItem.insertText} is used.
   */
  filterText?: string;
  /**
   * The range to replace. Must begin and end on the same line.
   */
  range?: Range;
  /**
   * An optional {@link Command} that is executed *after* inserting this completion.
   */
  // command?: Command;
}

export enum CompletionItemKind {
  Text = 1,
  Method = 2,
  Function = 3,
  Constructor = 4,
  Field = 5,
  Variable = 6,
  Class = 7,
  Interface = 8,
  Module = 9,
  Property = 10,
  Unit = 11,
  Value = 12,
  Enum = 13,
  Keyword = 14,
  Snippet = 15,
  Color = 16,
  File = 17,
  Reference = 18,
  Folder = 19,
  EnumMember = 20,
  Constant = 21,
  Struct = 22,
  Event = 23,
  Operator = 24,
  TypeParameter = 25
}

interface Range {
  start: { line: number, character: number };
  end: { line: number, character: number };
}

export interface CompletionItemLabelDetails {
  /**
   * An optional string which is rendered less prominently directly after {@link CompletionItem.label label},
   * without any spacing. Should be used for function signatures and type annotations.
   */
  detail?: string;
  /**
   * An optional string which is rendered less prominently after {@link CompletionItem.detail}. Should be used
   * for fully qualified names and file paths.
   */
  description?: string;
}

export interface TextEdit {
  range: Range;
  newText: string;
}

export interface InsertReplaceEdit {
  /**
   * The string to be inserted.
   */
  newText: string;
  /**
   * The range if the insert is requested
   */
  insert: Range;
  /**
   * The range if the replace is requested.
   */
  replace: Range;
}

export interface CompletionItem {
  /**
   * The label of this completion item.
   *
   * The label property is also by default the text that
   * is inserted when selecting this completion.
   *
   * If label details are provided the label itself should
   * be an unqualified name of the completion item.
   */
  label: string;
  /**
   * Additional details for the label
   *
   * @since 3.17.0
   */
  labelDetails?: CompletionItemLabelDetails;
  /**
   * The kind of this completion item. Based of the kind
   * an icon is chosen by the editor.
   */
  kind?: CompletionItemKind;
  /**
   * Tags for this completion item.
   *
   * @since 3.15.0
   */
  // tags?: CompletionItemTag[];
  /**
   * A human-readable string with additional information
   * about this item, like type or symbol information.
   */
  detail?: string;
  /**
   * A human-readable string that represents a doc-comment.
   */
  // documentation?: string | MarkupContent;
  /**
   * Indicates if this item is deprecated.
   * @deprecated Use `tags` instead.
   */
  // deprecated?: boolean;
  /**
   * Select this item when showing.
   *
   * *Note* that only one completion item can be selected and that the
   * tool / client decides which item that is. The rule is that the *first*
   * item of those that match best is selected.
   */
  preselect?: boolean;
  /**
   * A string that should be used when comparing this item
   * with other items. When `falsy` the {@link CompletionItem.label label}
   * is used.
   */
  sortText?: string;
  /**
   * A string that should be used when filtering a set of
   * completion items. When `falsy` the {@link CompletionItem.label label}
   * is used.
   */
  filterText?: string;
  /**
   * A string that should be inserted into a document when selecting
   * this completion. When `falsy` the {@link CompletionItem.label label}
   * is used.
   *
   * The `insertText` is subject to interpretation by the client side.
   * Some tools might not take the string literally. For example
   * VS Code when code complete is requested in this example
   * `con<cursor position>` and a completion item with an `insertText` of
   * `console` is provided it will only insert `sole`. Therefore it is
   * recommended to use `textEdit` instead since it avoids additional client
   * side interpretation.
   */
  insertText?: string;
  /**
   * The format of the insert text. The format applies to both the
   * `insertText` property and the `newText` property of a provided
   * `textEdit`. If omitted defaults to `InsertTextFormat.PlainText`.
   *
   * Please note that the insertTextFormat doesn't apply to
   * `additionalTextEdits`.
   */
  // insertTextFormat?: InsertTextFormat;
  /**
   * How whitespace and indentation is handled during completion
   * item insertion. If not provided the clients default value depends on
   * the `textDocument.completion.insertTextMode` client capability.
   *
   * @since 3.16.0
   */
  // insertTextMode?: InsertTextMode;
  /**
   * An {@link TextEdit edit} which is applied to a document when selecting
   * this completion. When an edit is provided the value of
   * {@link CompletionItem.insertText insertText} is ignored.
   *
   * Most editors support two different operations when accepting a completion
   * item. One is to insert a completion text and the other is to replace an
   * existing text with a completion text. Since this can usually not be
   * predetermined by a server it can report both ranges. Clients need to
   * signal support for `InsertReplaceEdits` via the
   * `textDocument.completion.insertReplaceSupport` client capability
   * property.
   *
   * *Note 1:* The text edit's range as well as both ranges from an insert
   * replace edit must be a [single line] and they must contain the position
   * at which completion has been requested.
   * *Note 2:* If an `InsertReplaceEdit` is returned the edit's insert range
   * must be a prefix of the edit's replace range, that means it must be
   * contained and starting at the same position.
   *
   * @since 3.16.0 additional type `InsertReplaceEdit`
   */
  textEdit?: TextEdit | InsertReplaceEdit;
  /**
   * The edit text used if the completion item is part of a CompletionList and
   * CompletionList defines an item default for the text edit range.
   *
   * Clients will only honor this property if they opt into completion list
   * item defaults using the capability `completionList.itemDefaults`.
   *
   * If not provided and a list's default range is provided the label
   * property is used as a text.
   *
   * @since 3.17.0
   */
  textEditText?: string;
  /**
   * An optional array of additional {@link TextEdit text edits} that are applied when
   * selecting this completion. Edits must not overlap (including the same insert position)
   * with the main {@link CompletionItem.textEdit edit} nor with themselves.
   *
   * Additional text edits should be used to change text unrelated to the current cursor position
   * (for example adding an import statement at the top of the file if the completion item will
   * insert an unqualified type).
   */
  additionalTextEdits?: TextEdit[];
  /**
   * An optional set of characters that when pressed while this completion is active will accept it first and
   * then type that character. *Note* that all commit characters should have `length=1` and that superfluous
   * characters will be ignored.
   */
  // commitCharacters?: string[];
  /**
   * An optional {@link Command command} that is executed *after* inserting this completion. *Note* that
   * additional modifications to the current document should be described with the
   * {@link CompletionItem.additionalTextEdits additionalTextEdits}-property.
   */
  // command?: Command;
  /**
   * A data entry field that is preserved on a completion item between a
   * {@link CompletionRequest} and a {@link CompletionResolveRequest}.
   */
  data?: any;
}