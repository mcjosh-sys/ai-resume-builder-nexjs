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
import { useEffect, useState } from "react";
import { AutocompleteNode } from "./editor/nodes/autocomplete-node";
import { AutocompletePlugin } from "./editor/plugins/autocomplete-plugin";
import { LinkPlugin } from "./editor/plugins/link-plugin";
import { BlockFormatDropDown } from "./editor/plugins/toolbar/block-format-toolbar-plugin";
import { FormatBulletedList } from "./editor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatHeading } from "./editor/plugins/toolbar/block-format/format-heading";
import { FormatNumberedList } from "./editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatParagraph } from "./editor/plugins/toolbar/block-format/format-paragraph";
import { FontFormatToolbarPlugin } from "./editor/plugins/toolbar/font-format-toolbar-plugin";
import { LinkToolbarPlugin } from "./editor/plugins/toolbar/link-toolbar-plugin";
import {
  htmlToEditorState,
  isSerializedRichText,
} from "./editor/utils/rich-text-conversions";

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
  value: initialValue,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [initialEditorState, setInitialEditorState] = useState<
    string | undefined
  >();
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (initialValue) {
      if (!isSerializedRichText(initialValue)) {
        htmlToEditorState(initialValue)
          .then((serializedState) => {
            setInitialEditorState(serializedState);
            setEditorKey((k) => k + 1);
          })
          .catch((error) => {
            console.error("Error converting HTML to EditorState:", error);
          });
      } else {
        if (initialEditorState !== initialValue) {
          setInitialEditorState(initialValue);
          setEditorKey((k) => k + 1);
        }
      }
    } else if (initialValue === undefined || initialValue === "") {
      if (initialEditorState !== undefined) {
        setInitialEditorState(undefined);
        setEditorKey((k) => k + 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]); // Deliberately only watching initialValue

  return (
    <div className="bg-background w-full overflow-hidden rounded-lg border">
      <LexicalComposer
        key={editorKey}
        initialConfig={{
          ...editorConfig,
          editorState:
            initialEditorState && initialEditorState !== ""
              ? initialEditorState
              : undefined,
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
            {/* <BlockFormatButtons>
              <FormatBulletedListButton />
              <FormatNumberedListButton />
              <FormatParagraphButton />
            </BlockFormatButtons> */}
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatBulletedList />
              <FormatNumberedList />
            </BlockFormatDropDown>
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
