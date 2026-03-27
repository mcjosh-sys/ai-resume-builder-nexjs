"use client";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { AutoLinkPlugin } from "@/components/editor/plugins/auto-link-plugin";
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ParagraphNode, TextNode } from "lexical";
import { useState } from "react";
import { AutocompleteNode } from "./editor/nodes/autocomplete-node";
import { AutocompletePlugin } from "./editor/plugins/autocomplete-plugin";
import { LinkPlugin } from "./editor/plugins/link-plugin";
import { BlockFormatButtons } from "./editor/plugins/toolbar/block-format-btns-toolbar-plugin";
import { FormatBulletedListButton } from "./editor/plugins/toolbar/block-format-btns/format-bulleted-list-btn";
import { FormatNumberedListButton } from "./editor/plugins/toolbar/block-format-btns/format-numbered-list-btn";
import { FormatParagraphButton } from "./editor/plugins/toolbar/block-format-btns/format-paragraph-btn";
import { FontFormatToolbarPlugin } from "./editor/plugins/toolbar/font-format-toolbar-plugin";
import { LinkToolbarPlugin } from "./editor/plugins/toolbar/link-toolbar-plugin";

const editorConfig: InitialConfigType = {
  namespace: "editor",
  onError: (error) => {
    console.error(error);
  },
  editable: true,
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
    AutocompleteNode,
  ],
};

export default function RichTextEditor({
  placeholder = "Type something...",
  value,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="bg-background w-full overflow-hidden rounded-lg border">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          editorState: value && value !== "" ? value : undefined,
        }}
      >
        <TooltipProvider>
          <Plugins placeholder={placeholder} onChange={onChange} />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}

export function Plugins({
  placeholder = "Type something...",
  onChange,
}: {
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  const [floatingAnchorElem, setAnchorFloatingElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement | null) => {
    if (_floatingAnchorElem !== null) {
      setAnchorFloatingElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
            <BlockFormatButtons>
              <FormatParagraphButton />
              <FormatBulletedListButton />
              <FormatNumberedListButton />
            </BlockFormatButtons>
            <FontFormatToolbarPlugin />
            {/* <FormatNumberedList />
            <FormatBulletedList /> */}
            <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div>
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block h-72 min-h-72 overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <ClickableLinkPlugin />
        <AutoLinkPlugin />
        <LinkPlugin />
        <FloatingLinkEditorPlugin
          anchorElem={floatingAnchorElem}
          isLinkEditMode={isLinkEditMode}
          setIsLinkEditMode={setIsLinkEditMode}
        />
        <AutocompletePlugin />
        {onChange && (
          <OnChangePlugin
            onChange={(editorState) => {
              onChange(JSON.stringify(editorState.toJSON()));
            }}
          />
        )}
      </div>
    </div>
  );
}
