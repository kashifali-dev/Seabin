import { Program } from "@prisma/client";
import { Listbox, ListboxOption } from "@reach/listbox";

interface ProgramSelectorProps {
  programs: { id: string; name: string; }[];
  onProgramIdChanged: (arg: string) => void;
};

export function ProgramSelector({ programs, onProgramIdChanged }: ProgramSelectorProps) {
  return (
    <Listbox
      onChange={onProgramIdChanged}
    >
      {programs.length > 0 && programs.map(p => {
        return (
          <ListboxOption
            key={p.id}
            value={p.id}
            className="w-full h-full"
          >
            {p.name}
          </ListboxOption>
        )
      })}
    </Listbox>
  );
}