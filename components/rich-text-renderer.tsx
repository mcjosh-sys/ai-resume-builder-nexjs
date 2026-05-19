"use client";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ParagraphNode, TextNode } from "lexical";
import { useEffect, useState } from "react";
import { AutocompleteNode } from "./editor/nodes/autocomplete-node";

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

function ReadOnlyPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(false);
  }, [editor]);

  return null;
}

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

export interface RichTextRendererProps {
  value: string;
  empty?: React.ReactNode;
  className?: string;
}

export function RichTextRenderer({
  value,
  empty = null,
  className,
}: RichTextRendererProps) {
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
