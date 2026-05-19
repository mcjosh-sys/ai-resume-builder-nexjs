/**
 * rich-text-conversions.ts
 *
 * Utilities for converting between raw HTML strings and the serialised Lexical
 * EditorState JSON produced / consumed by RichTextEditor.
 *
 * Both functions spin up a lightweight, headless Lexical editor with the same
 * node set used by RichTextEditor so the round-trip is lossless.
 *
 * NOTE: `htmlToEditorState` requires a DOM environment (browser or a jsdom
 * context in tests) because Lexical's HTML importer relies on DOMParser.
 * `editorStateToHtml` is universal — it runs synchronously via `read()`.
 */

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  $getRoot,
  $insertNodes,
  createEditor,
  type CreateEditorArgs,
} from "lexical";
import { AutocompleteNode } from "../nodes/autocomplete-node";

// ---------------------------------------------------------------------------
// Shared headless editor configuration
// ---------------------------------------------------------------------------
const EDITOR_ARGS: CreateEditorArgs = {
  namespace: "converter",
  editable: false,
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
    AutocompleteNode,
  ],
  onError: (err) => {
    throw err;
  },
};

export function editorStateToHtml(serialisedState: string): string {
  if (!serialisedState || serialisedState.trim() === "") return "";

  const editor = createEditor(EDITOR_ARGS);

  let parsedState;
  try {
    parsedState = editor.parseEditorState(serialisedState);
  } catch {
    return "";
  }

  let html = "";
  parsedState.read(() => {
    html = $generateHtmlFromNodes(editor);
  });

  return html;
}

export function htmlToEditorState(html: string): Promise<string> {
  if (typeof DOMParser === "undefined") {
    return Promise.reject(
      new Error(
        "[htmlToEditorState] DOMParser is not available. " +
          "This function must be called in a browser environment.",
      ),
    );
  }

  if (!html || html.trim() === "") {
    // Return the empty EditorState for an empty document
    const editor = createEditor(EDITOR_ARGS);
    return Promise.resolve(JSON.stringify(editor.getEditorState().toJSON()));
  }

  return new Promise((resolve, reject) => {
    const editor = createEditor(EDITOR_ARGS);

    editor.update(
      () => {
        try {
          const parser = new DOMParser();
          const dom = parser.parseFromString(html, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);
          $getRoot().clear().select();
          $insertNodes(nodes);
        } catch (err) {
          reject(err);
        }
      },
      {
        onUpdate() {
          resolve(JSON.stringify(editor.getEditorState().toJSON()));
        },
        skipTransforms: true,
      },
    );
  });
}

export function isSerializedRichText(input: unknown): input is string {
  if (typeof input !== "string" || input.trim() === "") return false;

  try {
    const parsed: unknown = JSON.parse(input);

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
      return false;

    const root = (parsed as Record<string, unknown>).root;

    if (typeof root !== "object" || root === null || Array.isArray(root))
      return false;

    const r = root as Record<string, unknown>;

    return (
      r.type === "root" &&
      typeof r.version === "number" &&
      Array.isArray(r.children)
    );
  } catch {
    return false;
  }
}
