# TODO
- [ ] For vivus.js, the animation duration is set as number of frames. Since the FPS of Chrome are tied to the refresh rate of the monitor, this might cause the animation to play too fast on devices with e.g. 144Hz monitors. -> Add coarse FPS detection to SimpleLoop so the animation duration can be adjusted

# Feedback

## 2020-07-06
- On devices with no physical buttons, the lower screen area is often used for swipe gestures, which conflict with the lower row of the keyboard
    - [ ] Add option to adjust distance between bottom of screen and bottom of keyboard
    - [x] Allow swipe gesture on whole keyboard, not just on the lower row
- [x] Make the whole bookshelf touchable, not just the button part at the bottom
- [ ] Provide a hint on what to do when clicking "start" while no lessons are selected
- [x] When failing a word, show the correct solution
- [x] Lock the keyboard after the correct romaji was entered