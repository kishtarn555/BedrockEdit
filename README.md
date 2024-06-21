
BedrockEdits is a add on that adds powerfool editing tools for minecraft bedrock. It **does not use experimental features**

It adds the option to select a workspace, manipulate the workspace with operators, and some more useful tools

# Session

Each player has the following variables in their session. The session is not persistent, meaning, it's lost when the world is closed.


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
* Debug stick
* Slot with state

## Wands

Wands are used to edit the `pos1` and `pos2` which define the workspace

### Bets wand
Right click a block to set it as `pos1`(Blue corner)

Left click a block to set it as `pos2`(Red corner)


### Bets blue wand
Right click a block to set it as `pos1`(Blue corner)

Left click to place the `pos1`(Blue corner). It places `pos1` against the clicked block face.


### Bets red wand
Right click a block to set it as `pos2`(Red corner)

Left click to place the `pos2`(Red corner).  It places `pos2` against the clicked block face.

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

It now prompts you to select the block placing mode.

> **_NOTE:_** Batched operator, if the area is large it spreads its operation in batches processed in consecutive ticks. Each batch creates its own commit to the history.


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


# Commands

This tool also provides commands to run, currently their accesible through the scriptevents.

So the syntax is:
```
/scriptevent bets:<command> [args]
```
### Example

Prints the structure data of "mystructure" in raw format
```
/scriptevent bets:stdata mystructure -r
```

##  Pos Command

Use either `pos1` or `pos2` command to query or modify the selection position box.

#### Arguments
If no arguments, it returns the position of the selection

* Use optional argument `-set <x y z>` to set the coordinates
* Use optional argument `-x <dx>` to add dx to the x coordinate
* Use optional argument `-y <dy>` to add dy to the y coordinate
* Use optional argument `-z <dz>` to add dz to the z coordinate

#### Examples

Queries pos 1
```
/scriptevent bets:pos1
```


Set pos2 to where the player is
```
/scriptevent bets:pos2 -set ~ ~ ~ 
```

Adds 2 to x value pos pos1
```
/scriptevent bets:pos1 -x 2
```


##  CLS Command

Use `cls` command to clear the selection

##  SBS Command
Use `sbs` to query the selection box size. It prints its x, y and z length.

## Fill Command

Use `fill` to run the fill operator

#### Arguments

* Use optional argument `-mode <mode>` to select the mode, skipping the modal.  This modes may be
  * normal
  * keep
  * replace
  * loosely
 
#### Examples

Runs fill operator, opens the prompt
```
/scriptevent bets:fill 
```


Runs fill operator, skips the prompt by specifying the mode
```
/scriptevent bets:fill -mode replace
```
  
## Stack Command
  
Use `stack` to run the stack operator
  
## Undo Command
  
Use `undo` to run the undo operator
  
## Redo Command
  
Use `redo` to run the redo operator
  
## Load Command
  
Use `load` to run the load operator, and load a structure
  
## Save Command
  
Use `save` to run the save operator, and save a structure
  
## STL Command

Use `stl`  to run to query all structures loaded
  
#### Arguments
  
* Use flag `-r` to display the data raw.


## STDATA Command

Use `stdata <structure>`  to query the data of a specific structure
  
#### Arguments
  
* Mandatory argument <structure>, the structure name to query
* Use flag `-r` to display the data raw.

