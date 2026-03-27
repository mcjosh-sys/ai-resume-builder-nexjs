import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { blockTypeToBlockName } from "../block-format/block-format-data";
import { BlockFormatButton } from "./block-format-btn";

const BLOCK_FORMAT_VALUE = "paragraph";

export function FormatParagraphButton() {
  const { activeEditor } = useToolbarContext();

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };
  return (
    <BlockFormatButton value={BLOCK_FORMAT_VALUE} onFormat={formatParagraph}>
      {blockTypeToBlockName[BLOCK_FORMAT_VALUE].icon}
    </BlockFormatButton>
  );
}
