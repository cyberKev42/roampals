export const AVATAR_OPTIONS = [
  {
    id: 'avatar_m',
    image: require('../assets/images/avatar/avatar1_front.png'),
    headshotId: 'avatar_m_headshot',
    sprite: require("@/src/assets/images/avatar/avatar1_spritesheet.png"),
    frameWidth: 161,
    frameHeight: 512,
    frames: 20,
  },
  {
    id: 'avatar_w',
    image: require('../assets/images/avatar/avatar2_front.png'),
    headshotId: 'avatar_w_headshot',
    sprite: require("@/src/assets/images/avatar/avatar2_spritesheet.png"),
    frameWidth: 231,
    frameHeight: 512,
    frames: 20,
  },
] as const;
