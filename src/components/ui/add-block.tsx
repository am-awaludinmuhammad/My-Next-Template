import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { WorkflowBlock } from "@/types/workflow";
import { createWorkflowBlock } from "@/lib/workflow-block";
import { blockTypes as workflowBlockTypes } from "@/constants/workflow";

interface Props {
  setBlocks: React.Dispatch<React.SetStateAction<WorkflowBlock[]>>;
  label?: string;
  btnVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "brand"
  blockTypes: typeof workflowBlockTypes
}

export function AddBlockButton({ setBlocks, blockTypes, label = "Add Block", btnVariant = "default"}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={btnVariant}>
          <Plus className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0">
        <Command>
          <CommandGroup heading="Block Types">
            {blockTypes.map((b) => (
              <CommandItem
                key={b.type}
                onSelect={() =>
                  setBlocks((prev) => [...prev, createWorkflowBlock(b.type)])
                }
              >
                {b.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
