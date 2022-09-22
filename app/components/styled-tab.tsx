import { Tab, useTabsContext } from "@reach/tabs";

type StyledTabProps = {
  index: number;
  [p: string]: any;
};

export default function StyledTimePeriodTab({
  index,
  ...props
}: StyledTabProps) {
  const { selectedIndex, focusedIndex } = useTabsContext();
  const isSelected = selectedIndex === index;
  const isFocused = focusedIndex === index;
  return (
    <Tab
      style={{
        background: isSelected ? "#fff" : "#dce9f3", // #DCE9F3 is seabin's light blue with 10% opacity
        color: "#283B8B",
        fontWeight: isSelected ? "bold" : "normal",
        fontSize: 14,
      }}
      {...props}
    />
  );
}
