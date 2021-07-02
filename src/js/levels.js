const Levels = {
  l1: {
    birdGenThreshold: 990,
    cloudGenThreshold: 994,
    birdSpeedMultiplier: 1.25,
    flowerOddsModifier: 0,   
    honeyGoal: 5,
  },
  l2: {
    birdSpeedMultiplier: 1.5,
    birdGenThreshold: 988,
    birdTopOffset:{min:20 , max:80},
    honeyGoal: 15,
  },
  l3: {
    birdSpeedMultiplier: 1.75,
    birdGenThreshold: 986,
    birdTopOffset:{min:20 , max:90},
    lightningTreshold: 997,
    lightningBolsterFactor: 3,
    lightningPeakBolster: 2,
    honeyGoal: 20,
  },
  l4: {
    birdSpeedMultiplier: 2,
    birdGenThreshold: 984,
    lightningTreshold: 996,
    lightningBolsterFactor: 1,
    lightningPeakBolster: 4,
    honeyGoal: 25,
  },
  l5: {
    birdSpeedMultiplier: 2.2,
    birdGenThreshold: 986,
    lightningTreshold: 995,
    lightningBolsterFactor: 2,
    lightningPeakBolster: 4,
    honeyGoal: 30,
  },
  l6: {
    birdSpeedMultiplier: 2.4,
    birdGenThreshold: 982,
    lightningTreshold: 994,
    lightningBolsterFactor: 2,
    lightningPeakBolster: 5,
    honeyGoal: 30,
  },
  l7: {
    birdSpeedMultiplier: 2.6,
    birdGenThreshold: 980,
    lightningTreshold: 993,
    lightningBolsterFactor: 3,
    lightningPeakBolster: 5,
    honeyGoal: 30,
  },
};

export default Levels;
