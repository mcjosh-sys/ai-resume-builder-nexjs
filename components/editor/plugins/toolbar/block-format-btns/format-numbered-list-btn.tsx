import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { blockTypeToBlockName } from "../block-format/block-format-data";
import { BlockFormatButton } from "./block-format-btn";

const BLOCK_FORMAT_VALUE = "number";

export function FormatNumberedListButton() {
  const { activeEditor, blockType } = useToolbarContext();

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatNumberedList = () => {
    if (blockType !== BLOCK_FORMAT_VALUE) {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };
  return (
    <BlockFormatButton value={BLOCK_FORMAT_VALUE} onFormat={formatNumberedList}>
      {blockTypeToBlockName[BLOCK_FORMAT_VALUE].icon}
    </BlockFormatButton>
  );
}
