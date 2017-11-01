# Planning
The following lists and documents are a breakdown of the tech, concepts,
mechanics, essentially all things that build up the darkest dungeon game.

The purpose of this plan is to the be used for the initial project time
and task estimate and as a reference during development.

The plan is split into four sections: Tech, Screens, Popups and Components

> The plan is rough and does not fully cover all details,
> but will provide a full overview.

## Tech
Technologies required that extends the basic web platform.

> Will require a third party or custom implementation

- Keyframe animations
- Property tweens
- Sound effects, ambient sound, music
- Keyboard/Gamepad input
- Stretch goals:
    - Story audio (Record original / Auto generate)
    - Cutscenes
    - Bone animations

# Screens
A screen is a section of the game with its own specific purpose and design.
Only one screen is active at a time, but transitions between screens may require multiple screens to be rendered simultaneously.

- [Start](screens/start.md)
- [Loading](screens/loading.md)
- [Dungeon](screens/dungeon.md)
- [Dungeon Result](screens/dungeon_result.md)
- [Estate](screens/estate.md)
- [Estate Map](screens/estate_map.md)
- [Estate Provisioning](screens/estate_provisioning.md)

# Popups/Prompts
Popups are temporary modal pages that are rendered on top of the current screen. A prompt is a popup that also requires a player choice before being dismissed.

- [Main menu](popups/mainMenu.md)
    - [Help](popups/help.md)
    - [Controls](popups/controls.md)
    - [Credits](popups/credits.md)
    - [Glossary](popups/glossary.md)
    - [Options](popups/options.md)
- [Character info](popups/characterInfo.md)
- [Trinkets](popups/trinkets.md)
- [Activity Log](popups/activityLog.md)
- [Embark Danger](popups/embarkDanger.md)
- [Item pickup](popups/itemPickup.md)
- [Dungeon Interaction](popups/dungeonInteraction.md)
- [Quest complete](popups/questComplete.md)

# Components
Common design elements used throughout the game, across multiple screens and popups.

- Tooltip box (specific location / relative to mouse)
- Icon
- Select tag with arrows
- Checkbox
- Scrolling
- Popup (close button with interchangeable image)
- List item (normal/hover states)
- Prompt/Popup header
- ??? Header (found in victory screen, 2nd to top)
- Scarf Header
- Estate name header
- Huge Header (with images and/or text)
- Huge header with inner purple box and text (inner purple box should be own component)
- Huge aligned header (with one image and text)
- Huge aligned header 2 (image, topic, description)
- Big Header with text (text + generic area to the right, possibly bg color/img)
- Normal Header with text
- Table
- HR's
- Button
- Upgrade flipdown list
- Event list item rectangle (yellow/red/gray background)
- Red Rectangle Thing
- Text
    - Input visualizers
    - Highlighted text
- Quirk reveal faces
- Skill box (locked, unlocked, selected)
- Preferred position/target
- Item box (enabled/disabled)
- Sanity bar
- Level/Experience indicator
- Level/Experience container
- Character picture/container
