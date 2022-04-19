import React, { useState } from 'react';
import { useInput } from './hooks/input-hook';
import { useHypGeo } from './hooks/hypgeo-hook';
import './index.css';

export default function App() {
  const [currentTurn, setCurrentTurn] = useState(0);

  // These values will be pulled from the user's deck
  const { value: N, bind: bindN } = useInput('99'); // The number of cards in the library
  let n = currentTurn + 7; // Use this as type/tag/etc. 7 is added to account for an opening hand of 7 cards.
  const { value: x, bind: bindx } = useInput('1'); // This is left as one to represent the fact that we want to know our chance to draw at least one card of the type/tag

  // These values will be pulled from the user's deck. Current values are just test values.
  const { value: creatures, bind: bindCreatures } = useInput('39');
  const { value: artifacts, bind: bindArtifacts } = useInput('7');
  const { value: enchantments, bind: bindEnchantments } = useInput('11');
  const { value: instants, bind: bindInstants } = useInput('4');
  const { value: sorceries, bind: bindSorceries } = useInput('7');
  const { value: planeswalkers, bind: bindPlaneswalkers } = useInput('1');
  const { value: lands, bind: bindLands } = useInput('30');

  const creatureOdds = useHypGeo(N, creatures, n, x);
  const artifactOdds = useHypGeo(N, artifacts, n, x);
  const enchantmentOdds = useHypGeo(N, enchantments, n, x);
  const instantOdds = useHypGeo(N, instants, n, x);
  const sorceryOdds = useHypGeo(N, sorceries, n, x);
  const landOdds = useHypGeo(N, lands, n, x);
  const planeswalkerOdds = useHypGeo(N, planeswalkers, n, x);

  // These values will be pulled from the user's deck. Current values are just test values.
  const dragonsApproach = 25;
  const persistentPetitioners = 23;
  const ratColony = 28;
  const relentlessRats = 27;
  const sevenDwarves = 7;
  const shadowbornApostles = 26;

  // One is subtracted from each Singleton Rule Breaker since you have to cast the card to get the initial ripple; n (the amount of cards that have been drawn so far) is subtracted from N (the library size) to approximate library size through turns.
  const dragonsApproachOdds = useHypGeo(N - n, dragonsApproach - 1, 4, x);
  const persistentPetitionersOdds = useHypGeo(
    N - n,
    persistentPetitioners - 1,
    4,
    x
  );
  const ratColonyOdds = useHypGeo(N - n, ratColony - 1, 4, x);
  const relentlessRatsOdds = useHypGeo(N - n, relentlessRats - 1, 4, x);
  const sevenDwarvesOdds = useHypGeo(N - n, sevenDwarves - 1, 4, x);
  const shadowbornApostleOdds = useHypGeo(N - n, shadowbornApostles - 1, 4, x);

  const nextTurn = () => {
    setCurrentTurn(currentTurn + 1);
  };

  const previousTurn = () => {
    if (currentTurn > 0) {
      setCurrentTurn(currentTurn - 1);
    }
  };

  // Example deck. Real values to be pulled from the user's deck
  const deck = [
    `Thrumming Stone`,
    `Dragon's Approach`,
    `Persistent Petitioners`,
    `Rat Colony`,
    `Relentless Rats`,
    `Seven Dwarves`,
    `Shadowborn Apostle`,
  ];

  // These are all of the cards that ignore restrictions on the number of a specific card that can be played in a deck
  const singletonRuleBreakers = [
    `Dragon's Approach`,
    `Persistent Petitioners`,
    `Rat Colony`,
    `Relentless Rats`,
    `Seven Dwarves`,
    `Shadowborn Apostle`,
  ];

  const hasThrummingStone = deck.includes(`Thrumming Stone`);
  let hasSingletonRuleBreakers = singletonRuleBreakers.filter((f) =>
    deck.includes(f)
  );

  // Needing to have one of these for each singleton rule breaker is clunky
  const hasDragonsApproach = deck.includes(`Dragon's Approach`);
  const hasPersistentPetitioners = deck.includes(`Persistent Petitioners`);
  const hasRatColony = deck.includes(`Rat Colony`);
  const hasRelentlessRats = deck.includes(`Relentless Rats`);
  const hasSevenDwarves = deck.includes(`Seven Dwarves`);
  const hasShadowbornApostles = deck.includes(`Shadowborn Apostle`);

  return (
    <div className='flex flex-col md:h-screen mt-8 md:mt-0 align-center justify-center'>
      <div className='flex flex-col max-w-4xl mx-auto container'>
        <div className='mb-8 mx-auto flex flex-col bg-gray-700 container border-solid border border-gray-100 shadow-xl'>
          <h1 className='md:text-3xl text-xl py-4 text-center'>
            Hypergeometric Distribution Calculator
          </h1>
        </div>
        <div className='mb-4 m-auto bg-gray-700 container border-solid border border-gray-100 shadow-xl'>
          <form className='flex flex-col md:grid md:grid-cols-4 md:gap-y-2 p-4 md:justify-items-start'>
            <div className='col-span-3'>
              <label>Total number of creature cards in your library:</label>
            </div>
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
                min='1'
                max='1000'
                {...bindCreatures}
              />
            </div>
            <div className='col-span-3'>
              <label>Total number of artifact cards in your library:</label>
            </div>
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
                min='1'
                max='1000'
                {...bindArtifacts}
              />
            </div>
            <div className='col-span-3'>
              <label>Total number of enchantment cards in your library:</label>
            </div>
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
                min='1'
                max='1000'
                {...bindEnchantments}
              />
            </div>
            <div className='col-span-3'>
              <label>Total number of instant cards in your library:</label>
            </div>
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
                min='1'
                max='1000'
                {...bindInstants}
              />
            </div>
            <div className='col-span-3'>
              <label>Total number of sorcery cards in your library:</label>
            </div>
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
                min='1'
                max='1000'
                {...bindSorceries}
              />
            </div>
            <div className='col-span-3'>
              <label>Total number of planeswalker cards in your library:</label>
            </div>
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
                min='1'
                max='1000'
                {...bindPlaneswalkers}
              />
            </div>
            <div className='col-span-3'>
              <label>Total number of land cards in your library:</label>
            </div>
            <div className='justify-self-end self-center md:w-auto w-full mb-12'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
                min='1'
                max='1000'
                {...bindLands}
              />
            </div>
            <div className='col-span-3'>
              <label>Total number of cards in your library:</label>
            </div>
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
                min='0'
                max='1000'
                {...bindN}
              />
            </div>
            <div className='col-span-3'>
              <label>
                Number of desired cards of the given type that you hope to draw
                during the draw event{' '}
                <span className='text-red-500'>(best to leave this as 1)</span>:
              </label>
            </div>
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
                min='1'
                max='1000'
                {...bindx}
              />
            </div>
          </form>
        </div>
        <div className='m-auto flex flex-col bg-gray-700 container border-solid border border-gray-100 shadow-xl'>
          <div className='flex flex-row justify-center mt-3 container'>
            <button className='border w-8 mx-3' onClick={previousTurn}>
              &#8592;
            </button>
            <span>Current Turn: {currentTurn}</span>
            <button className='border w-8 mx-3' onClick={nextTurn}>
              &#8594;
            </button>
          </div>
          <div className='flex flex-col md:grid md:grid-cols-4 md:gap-y-2 p-4 md:justify-items-start'>
            <div className='col-span-3'>
              <p>Chance to draw a creature by turn {currentTurn}:</p>
            </div>
            <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
              {creatureOdds}%
            </div>
          </div>
          <div className='flex flex-col md:grid md:grid-cols-4 md:gap-y-2 p-4 md:justify-items-start'>
            <div className='col-span-3'>
              <p>Chance to draw an artifact by turn {currentTurn}:</p>
            </div>
            <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
              {artifactOdds}%
            </div>
          </div>
          <div className='flex flex-col md:grid md:grid-cols-4 md:gap-y-2 p-4 md:justify-items-start'>
            <div className='col-span-3'>
              <p>Chance to draw an enchantment by turn {currentTurn}:</p>
            </div>
            <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
              {enchantmentOdds}%
            </div>
          </div>
          <div className='flex flex-col md:grid md:grid-cols-4 md:gap-y-2 p-4 md:justify-items-start'>
            <div className='col-span-3'>
              <p>Chance to draw an instant by turn {currentTurn}:</p>
            </div>
            <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
              {instantOdds}%
            </div>
          </div>
          <div className='flex flex-col md:grid md:grid-cols-4 md:gap-y-2 p-4 md:justify-items-start'>
            <div className='col-span-3'>
              <p>Chance to draw a sorcery by turn {currentTurn}:</p>
            </div>
            <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
              {sorceryOdds}%
            </div>
          </div>
          <div className='flex flex-col md:grid md:grid-cols-4 md:gap-y-2 p-4 md:justify-items-start'>
            <div className='col-span-3'>
              <p>Chance to draw a planeswalker by turn {currentTurn}:</p>
            </div>
            <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
              {planeswalkerOdds}%
            </div>
          </div>
          <div className='flex flex-col md:grid md:grid-cols-4 md:gap-y-2 p-4 md:justify-items-start'>
            <div className='col-span-3'>
              <p>Chance to draw a land by turn {currentTurn}:</p>
            </div>
            <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
              {landOdds}%
            </div>
          </div>
        </div>
        <div className='m-auto flex flex-col bg-gray-700 container border-solid border border-gray-100 shadow-xl p-4 mt-4'>
          {hasSingletonRuleBreakers && hasThrummingStone && (
            <div>Thrumming Stone detected!</div>
          )}
          {hasDragonsApproach && hasThrummingStone && (
            <div>
              Your odds of rippling into a Dragon's Approach are{' '}
              {dragonsApproachOdds}%
            </div>
          )}
          {hasPersistentPetitioners && hasThrummingStone && (
            <div>
              Your odds of rippling into a Persistent Petitioners are{' '}
              {persistentPetitionersOdds}%
            </div>
          )}
          {hasRatColony && hasThrummingStone && (
            <div>
              Your odds of rippling into a Rat Colony are {ratColonyOdds}%
            </div>
          )}
          {hasRelentlessRats && hasThrummingStone && (
            <div>
              Your odds of rippling into a Relentless Rats are{' '}
              {relentlessRatsOdds}%
            </div>
          )}
          {hasSevenDwarves && hasThrummingStone && (
            <div>
              Your odds of rippling into a Seven Dwarves are {sevenDwarvesOdds}%
            </div>
          )}
          {hasShadowbornApostles && hasThrummingStone && (
            <div>
              Your odds of rippling into a Shadowborn Apostle are{' '}
              {shadowbornApostleOdds}%
            </div>
          )}
        </div>
      </div>
      <footer className='mx-auto md:fixed md:right-0 md:bottom-0 m-1 mt-4 text-sm'>
        <p>
          Made with <span className='font-sans'>&#10084;</span> by
          <a
            href='https://github.com/Kerakis'
            target='_blank'
            rel='noopener noreferrer'>
            &nbsp;Kerakis&nbsp;
          </a>
        </p>
      </footer>
    </div>
  );
}
