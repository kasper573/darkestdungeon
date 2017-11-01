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

# [Screens](screens)
A screen is a section of the game with its own specific purpose and design.
Only one screen is active at a time, but transitions between screens may require multiple screens to be rendered simultaneously.
If a screen is complex it will be defined as a folder with multiple design documents.
If a screen may spawn screen specific popups those popups are defined in a `popups` folder in the same location.

# Popups/Promps
Popups are temporary modal pages that are rendered on top of the current screen. A prompt is a popup that also requires a player choice before being dismissed.

## [Generic Popups](genericPopups)
These are popups that don't belong to a specific screen.

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
- Estate feature header
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

# Other

## Fonts used

- New rocker
- Dwarvenaxe
