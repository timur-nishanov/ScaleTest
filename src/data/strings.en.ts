/**
 * Interface copy, English version (default; Russian is ?lang=ru, strings.ts).
 * Same structure as STRINGS_RU. Terms match the portfolio case study:
 * “Build it yourself”, “Choose from ready-made”, “Check the chain”, stamp.
 */
import { deepTypoEn } from '@/lib/typo'
import type { Strings } from './strings'

export const STRINGS_EN: Strings = deepTypoEn({
  meta: {
    title: 'Build your perfect bundle · Yandex Cloud',
  },
  attract: {
    title: 'Build your perfect bundle',
    subtitle: 'See which data platform services real business solutions are built from',
    cta: 'Touch the screen to start',
  },
  mode: {
    title: 'How do you want to build your bundle?',
    subtitle:
      'Choose how to play. “Choose from ready-made” is shorter and can earn you a stamp for the merch contest.',
    back: 'Back',
    build: {
      title: 'Build it yourself',
      desc: 'Pick a task and put the services in the right order. For those who want to test what they know.',
    },
    ready: {
      title: 'Choose from ready-made',
      desc: 'We’ll offer a few ready-made bundles. Pick the one that solves the task best.',
      coinBadge: 'Earns a stamp',
    },
  },
  taskSelect: {
    buildLabel: 'Build it yourself',
    readyLabel: 'Choose from ready-made',
    title: 'Choose a business task',
    buildSubtitle: 'Assemble the right set of data platform services in the correct order.',
    readySubtitle:
      'We’ve prepared a few ready-made bundles for each task. Your job is to pick the best one.',
    random: 'Pick at random',
    back: 'Back',
  },
  build: {
    assignmentLabel: 'Goal',
    paletteHint: 'Drag a service into a slot. Tap a service to see what it does',
    slot: (n: number) => `Slot ${n}`,
    clear: 'Clear',
    check: 'Check the chain',
    back: 'All tasks',
  },
  ready: {
    assignmentLabel: 'Goal',
    chooseHint: 'Pick the bundle that fits',
    back: 'All tasks',
    bundleName: (letter: string) => `Bundle ${letter}`,
  },
  result: {
    correct: {
      title: 'Spot on!',
      msg: 'You built the optimal chain of data platform services for this scenario.',
    },
    almost: {
      title: 'Almost!',
      msg: 'Some services are wrong or out of place. Here’s the right order:',
    },
    allWrong: {
      title: 'Not this time!',
      msg: 'All the services are wrong or out of place. Here’s the right order:',
    },
    timeoutBuild: {
      title: 'Time’s up!',
      msg: 'No worries. Here’s the right order for this task:',
    },
    timeoutReady: {
      title: 'Time’s up!',
      msg: 'Here’s the bundle that solves this task best:',
    },
    readyBest: {
      title: 'Great choice!',
      msg: 'This is the best bundle for the task.',
    },
    readyPartial: {
      title: 'So close!',
      msg: 'Your pick works, but another bundle would solve this task better:',
    },
    readyWrong: {
      title: 'Not this one!',
      msg: 'This bundle doesn’t solve the task, so it doesn’t earn a stamp. Here’s the one that does:',
    },
    yourBuild: 'Your chain',
    optimalBuild: 'Optimal sequence',
    optimalBundle: 'Optimal bundle',
    coinEarned: 'You’ve earned a stamp!',
    coinEarnedHint: 'Tell the booth staff to get your stamp for the merch contest draw.',
    coinPromo: 'Want a stamp for the merch contest?',
    coinPromoHint: 'Play “Choose from ready-made” to earn a stamp for the draw.',
    coinPromoCta: 'Go',
    qrTitle: 'Want materials or a consultation on data platform services and products?',
    qrHint: 'Scan the QR code',
    anotherTask: 'Choose another task',
    finish: 'Finish',
    restart: 'Back to start',
  },
  idle: {
    title: 'Are you still here?',
    stay: 'Yes',
  },
  a11y: {
    prevCard: 'Previous card',
    nextCard: 'Next card',
    qr: 'QR code',
  },
})
