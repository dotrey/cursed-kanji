# Devlog

## 2020-08-02
- Added cardbox with 3 slots for spaced repetition
    - Each word can move up only once a day
- Added corruption
- Added seals

## 2020-08-01
- Added option for left handed/right handed keyboard
- Adjusted thresholds for keyboard swipe and touch-cancel

## 2020-07-11
- Added option to adjust keyboard offset from bottom

## 2020-07-08
- Show correct romaji if kanji isn't solved within timelimit

## 2020-07-07
- Added dedicated `gh-pages` branch for optimized website version with bundles js and css files
- Lock keyboard input after time is up -> no accidentally adding another letter to the originally correct word
- Made the lower keyboard row swipeable on the whole keyboard area
- The complete bookshelf can now be tapped to enter the library, not just the button at the bottom

## 2020-07-05
- Added option to select single symbol for detail view
- Added vivus.js for animated svgs
- Added back button to game view
- Added `robots.txt` with deny all

## 2020-06-23
- Added kanji vg for detail view

## 2020-06-20
- Added detail view for single kanji

## 2020-06-18
- Added settings and different keyboard layouts

## 2020-06-16
- Added dynamic scaling to the kanji card

## 2020-06-14
- Split CSS into separate files and added `postCSS` for bundling
- Added simple game loop based on a state machine
- Changed word's id back to string
- Added `WordPool` as provider of words
- Wired everything up for a working version

## 2020-06-02
- Added `ObjectStorage` for easy save and load of classes

## 2020-06-01
- Added file structures for books and index
- Added loading of index files
- Added option to enable/disable books
- Added main view and library view

## 2020-05-31
- Initial setup of mithril
- Custom touch-handler
- Romaji keyboard