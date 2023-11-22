
BedrockEdits is a add on that adds powerfool editing tools for minecraft bedrock. It **does not use experimental features**

It adds the option to select a workspace, manipulate the workspace with operators, and some more useful tools

# Variables


| concept | type |description                                                      |
| ------  | --- | --------                                                         |
| pos1    | Coordinates(Vector3) |Is the blue corner of the selection, it is also the main corner |
| pos2    | Coordinates(Vector3) |Is the red corner of the selection, also the secondary corner |
| block1  | Block(BlockPermutation) |Represents the main block, red |
| block2  | Block(BlockPermutation) |Represents the secondary block, blue |

# Tools

There are multiple item tools that you can use

* Wands
* Block picker

## Wands

Wands are used to edit the `pos1` and `pos2` which define the workspace

### Bets wand
Right click a block to set it as `pos1`(Blue corner)

Left click a block to set it as `pos2`(Red corner)


### Bets blue wand
Right click a block to set it as `pos1`(Blue corner)

Left click to place the `pos1`(Blue corner). It places against the clicked block as if it were a block


### Bets red wand
Right click a block to set it as `pos2`(Red corner)

Left click to place the `pos2`(Red corner). It places against the clicked block as if it were a block

## Block pickers

Use the blue picker to select the block your operators will place.

Use the red picker to select the secondary block, this is used when placing block on replace mode.

## Block placing mode

This tool, when used (right click) opens up a form which allows you to select from four modes. This are similar to the fill command

| Mode | Description |
| ---  | --- |
| Normal | Just places the blocks |
| Keep | Only places blocks if it was air |
| Replace exactly | Only replaces blocks that match the secondary block permutation, with the same block states |
| Replace loosely | Only replaces blocks that match the identifier of the secondary block |



# Operators

Operators are what apply changes to your world, you can find them as items. To activate them, simply use the item (right click).


## Fill Operator

Places blocks on all the workspace, respecting the block place mode.


**_NOTE:_** Batched operator, if the area is large it spreads its operation in batches processed in consecutive ticks. Each batch creates its own commit to the history.

## Line operator

Places blocks on a line from `pos1` to `pos2`


> **_NOTE:_**  UnBatch operator, this attempts to place all blocks in one game tick

> **_NOTE:_** Workspace-less operator, this attempts to place blocks regardless if there's a valid workspace

## Flood Operator

Right click a block, it will replace all blocks of the same permutation that are connected to the right click. Similar to the bucket tool in image editing software.

> **_NOTE_** Batched operator, if the area is large it spreads its operation in batches processed in consecutive ticks. Each batch creates its own commit to the history.

> **_NOTE:_** It ignores the block placing mode, as it is incompatible with the concept.

# History

Edits also adds a history, to allow you to undo and redo changes.

Every operator creates a commit, which store the block changes, and pushes it into the history. Some operators when working in large areas may create multiple commits.

> **_Note_**: The history has a limited size, if it capacity is exceeded, when a new commit is added, it will remove commits from the oldest to newest until its size goes below its maximum capacity.

## Undo

Use the Undo item.

Undoes one commit made by an operation.


## Redo

Use the Redo item.


Redoes one commit made by an operation. 

This allows Undone commits to be recovered as long as no new commit arrives.
