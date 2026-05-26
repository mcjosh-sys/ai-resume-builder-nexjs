import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { blockTypeToBlockName } from "../block-format/block-format-data";
import { BlockFormatButton } from "./block-format-btn";

const BLOCK_FORMAT_VALUE = "bullet";

export function FormatBulletedListButton() {
  const { activeEditor, blockType } = useToolbarContext();

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatBulletedList = () => {
    if (blockType !== BLOCK_FORMAT_VALUE) {
      activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };
  return (
    <BlockFormatButton
      value={BLOCK_FORMAT_VALUE}
      onFormat={formatBulletedList}
      disabled={blockType === BLOCK_FORMAT_VALUE}
    >
      {blockTypeToBlockName[BLOCK_FORMAT_VALUE].icon}
    </BlockFormatButton>
  );
}
