"use client";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ParagraphNode, TextNode } from "lexical";
import { useEffect, useState } from "react";
import { AutocompleteNode } from "./editor/nodes/autocomplete-node";
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";

// ---------------------------------------------------------------------------
// Serialised‑state → plain‑text helper (used for the empty‑state check)
// ---------------------------------------------------------------------------
function isEditorStateEmpty(serialised: string): boolean {
  try {
    const parsed = JSON.parse(serialised);
    const rootChildren: unknown[] = parsed?.root?.children ?? [];
    if (rootChildren.length === 0) return true;
    // Single paragraph with no children → effectively empty
    if (rootChildren.length === 1) {
      const only = rootChildren[0] as { children?: unknown[] };
      return (only?.children ?? []).length === 0;
    }
    return false;
  } catch {
    return true;
  }
}

// ---------------------------------------------------------------------------
// Public helper — detect serialised Lexical EditorState
// ---------------------------------------------------------------------------
/**
 * Returns `true` when `input` is a JSON string that matches the structural
 * signature of a Lexical serialised EditorState:
 *
 * ```json
 * { "root": { "type": "root", "version": 1, "children": [...], ... } }
 * ```
 *
 * This is intentionally lightweight — it validates shape, not content.
 */
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

// ---------------------------------------------------------------------------
// Inner plugin — forces the composer into read-only after mount
// ---------------------------------------------------------------------------
function ReadOnlyPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(false);
  }, [editor]);

  return null;
}

// ---------------------------------------------------------------------------
// Shared node set (must match the editor)
// ---------------------------------------------------------------------------
const RENDERER_NODES: InitialConfigType["nodes"] = [
  HeadingNode,
  ParagraphNode,
  TextNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  AutoLinkNode,
  AutocompleteNode,
];

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
export interface RichTextRendererProps {
  /** Serialised Lexical EditorState JSON string produced by RichTextEditor */
  value: string;
  /** Rendered when value is empty or unparseable */
  empty?: React.ReactNode;
  className?: string;
}

export function RichTextRenderer({
  value,
  empty = null,
  className,
}: RichTextRendererProps) {
  // Re-key the composer whenever the value changes so Lexical re-initialises
  // with the new editor state (initialConfig is only read once per mount).
  const [composerKey, setComposerKey] = useState(0);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    if (value !== currentValue) {
      setCurrentValue(value);
      setComposerKey((k) => k + 1);
    }
  }, [value, currentValue]);

  if (!value || isEditorStateEmpty(value)) {
    return <>{empty}</>;
  }

  const initialConfig: InitialConfigType = {
    namespace: "renderer",
    editable: false,
    theme: editorTheme,
    nodes: RENDERER_NODES,
    editorState: currentValue,
    onError: (err) => console.error("[RichTextRenderer]", err),
  };

  return (
    <LexicalComposer key={composerKey} initialConfig={initialConfig}>
      <div className={className}>
        <RichTextPlugin
          contentEditable={
            <LexicalContentEditable
              aria-readonly
              tabIndex={-1}
              className="focus:outline-none cursor-default select-text"
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ReadOnlyPlugin />
      </div>
    </LexicalComposer>
  );
}

export default RichTextRenderer;
