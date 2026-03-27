import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import { blockTypeToBlockName } from "../block-format/block-format-data";

type BlockTypeValue = "bullet" | "number" | "paragraph";

interface BlockFormatButtonProps {
  value: BlockTypeValue;
  onFormat?: () => void;
  children: React.ReactNode;
}

export function BlockFormatButton({
  value,
  children,
  onFormat,
}: BlockFormatButtonProps) {
  const { setBlockType, blockType } = useToolbarContext();
  const handleClick = () => {
    onFormat?.();
    setBlockType(value === blockType ? "paragraph" : value);
  };
  return (
    <ToggleGroupItem
      value={value}
      aria-label={blockTypeToBlockName[value].label}
      onClick={handleClick}
    >
      {children}
    </ToggleGroupItem>
  );
}
