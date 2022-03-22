import React, { useRef, useState } from 'react';
import { useInput } from './hooks/input-hook';
import './index.css';

export default function App() {
  const resultsRef = useRef(null);
  const successesOverDrawRef = useRef(null);
  const drawOverLibraryRef = useRef(null);
  const successSizeOverLibraryRef = useRef(null);
  const { value: N, bind: bindN } = useInput('100');
  const { value: n, bind: bindn } = useInput('7');
  const { value: M, bind: bindM } = useInput('40');
  const { value: x, bind: bindx } = useInput('2');
  const [exactCards, setExactCards] = useState(0);
  const [cardsOrLess, setCardsOrLess] = useState(0);
  const [cardsOrMore, setCardsOrMore] = useState(0);
  const [noCards, setNoCards] = useState(0);
  const [meanCards, setMeanCards] = useState(0);
  const [currentLibrary, setCurrentLibrary] = useState(0);
  const [currentDraw, setCurrentDraw] = useState(0);
  const [currentSuccessSize, setCurrentSuccessSize] = useState(0);
  const [currentSuccesses, setCurrentSuccesses] = useState(0);

  const choose = (n, x) => {
    let r = 1;
    for (let i = 1; i <= x; i++) {
      r = (r * (n - (x - i))) / i;
    }
    return r;
  };

  /*
   * N - library size
   * M - desired cards in library
   * n - number of cards to draw in one event
   * x - number of the desired cards in the draw event
   */

  const pmf = (N, M, n, x) => {
    return (choose(M, x) * choose(N - M, n - x)) / choose(N, n);
  };

  const lcdf = (N, M, n, x) => {
    let r = 0;
    for (let i = 0; i <= x; i++) {
      r = r + pmf(N, M, n, i);
    }
    return r * 100;
  };

  const ucdf = (N, M, n, x) => {
    let r = 0;
    for (let i = 0; i < x; i++) {
      r = r + pmf(N, M, n, i);
    }
    return (1 - r) * 100;
  };

  const whiff = (N, M, n) => {
    return pmf(N, M, n, 0) * 100;
  };

  const mean = (N, M, n) => {
    let r;
    r = (n * M) / N;
    return r.toFixed(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numM = parseFloat(M);
    const numN = parseFloat(N);
    const numn = parseFloat(n);
    const numx = parseFloat(x);
    setExactCards((+pmf(numN, numM, numn, numx) * 100).toFixed(2));
    setCardsOrLess(+lcdf(numN, numM, numn, numx).toFixed(2));
    setCardsOrMore(+ucdf(numN, numM, numn, numx).toFixed(2));
    setNoCards(+whiff(numN, numM, numn, numx).toFixed(2));
    setMeanCards(+mean(numN, numM, numn, numx));
    setCurrentLibrary(numN);
    setCurrentDraw(numn);
    setCurrentSuccessSize(numM);
    setCurrentSuccesses(numx);
    resultsRef.current.style.visibility = 'visible';
    numx > numn
      ? (successesOverDrawRef.current.style.borderColor = 'red')
      : (successesOverDrawRef.current.style.borderColor = 'white');
    numn > numN
      ? (drawOverLibraryRef.current.style.borderColor = 'red')
      : (drawOverLibraryRef.current.style.borderColor = 'white');
    numM > numN
      ? (successSizeOverLibraryRef.current.style.borderColor = 'red')
      : (successSizeOverLibraryRef.current.style.borderColor = 'white');
  };

  const isError =
    currentSuccesses > currentDraw ||
    currentDraw > currentLibrary ||
    currentSuccessSize > currentLibrary;

  const getErrorMessage = () => {
    if (currentSuccesses > currentDraw) {
      return (
        <div className='text-red-600 p-4 self-center font-bold text-justify'>
          <p>
            The number of desired cards that you're hoping to draw during the
            draw event can't be greater than the number of cards being drawn
            during the draw event.
          </p>
        </div>
      );
    }
    if (currentDraw > currentLibrary) {
      return (
        <div className='text-red-600 p-4 self-center font-bold text-justify'>
          <p>
            The number of cards drawn during the draw event can't be greater
            than the number of cards in your library.
          </p>
        </div>
      );
    }
    if (currentSuccessSize > currentLibrary) {
      return (
        <div className='text-red-600 p-4 self-center font-bold text-justify'>
          <p>
            The total number of desired cards can't be greater than the number
            of cards in your library.
          </p>
        </div>
      );
    }
  };

  return (
    <div className='flex flex-col md:h-screen mt-8 md:mt-0 align-center justify-center'>
      <div className='flex flex-col text-sm md:text-base max-w-4xl mx-auto container'>
        <div className='mb-8 mx-auto flex flex-col bg-gray-700 container border-solid border border-gray-100 shadow-xl'>
          <h1 className='md:text-3xl text-xl py-4 text-center'>
            Hypergeometric Distribution Calculator
          </h1>
        </div>
        <div className='mb-4 mx-auto flex flex-col items-center bg-gray-700 container border-solid border border-gray-100 shadow-xl'>
          <h3 className='p-4 text-justify'>
            This hypergeometric distribution calculator can help you determine
            the probabilities of drawing a specific card or cards from a library
            of cards. For example, it can help you determine the likelihood of
            drawing 2 land cards in your opening hand of 7 cards from a 100-card
            library containing 40 land cards.
          </h3>
        </div>
        <div className='mb-4 m-auto bg-gray-700 container border-solid border border-gray-100 shadow-xl'>
          <form
            className='grid grid-cols-4 gap-y-2 p-4 md:justify-items-start'
            onSubmit={handleSubmit}
          >
            <div className='col-span-3'>
              <label>Total number of cards in your library:</label>
            </div>
            <div className='justify-self-end md:justify-self-end self-center'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 w-16 md:w-32'
                type='number'
                min='1'
                max='1000'
                {...bindN}
              />
            </div>
            <div className='col-span-3'>
              <label>Number of cards to draw during the draw event:</label>
            </div>
            <div className='justify-self-end self-center'>
              <input
                ref={drawOverLibraryRef}
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 w-16 md:w-32'
                type='number'
                min='1'
                max='1000'
                {...bindn}
              />
            </div>
            <div className='col-span-3'>
              <label>
                Total number of desired cards that are in your library:
              </label>
            </div>
            <div className='justify-self-end md:justify-self-end self-center'>
              <input
                ref={successSizeOverLibraryRef}
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 w-16 md:w-32'
                type='number'
                min='0'
                max='1000'
                {...bindM}
              />
            </div>
            <div className='col-span-3'>
              <label>
                Number of desired cards that you hope to draw during the draw
                event:
              </label>
            </div>
            <div className='justify-self-end md:justify-self-end self-center'>
              <input
                ref={successesOverDrawRef}
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 w-16 md:w-32'
                type='number'
                min='1'
                max='1000'
                {...bindx}
              />
            </div>
            <div className='mx-auto col-span-4 mt-4'>
              <input
                className='bg-gray-800 hover:bg-slate-500 transition-colors border border-solid rounded border-gray-100 w-56'
                type='submit'
                value='Calculate Probabilities'
              />
            </div>
          </form>
        </div>
        <div
          ref={resultsRef}
          className='invisible m-auto flex flex-col bg-gray-700 container border-solid border border-gray-100 shadow-xl'
        >
          {isError && getErrorMessage()}

          {!isError && (
            <div className='grid grid-cols-4 gap-y-2 p-4 md:justify-items-start'>
              <div className='col-span-3'>
                <p>
                  Chance to draw exactly {currentSuccesses} of the desired card:{' '}
                </p>
              </div>
              <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 w-16 md:w-32 font-bold overflow-hidden'>
                {exactCards}%
              </div>
              <div className='col-span-3'>
                <p>
                  Chance to draw {currentSuccesses} or less of the desired card:{' '}
                </p>
              </div>
              <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 w-16 md:w-32 font-bold'>
                {cardsOrLess}%
              </div>
              <div className='col-span-3'>
                <p>
                  Chance to draw {currentSuccesses} or more of the desired card:
                </p>
              </div>
              <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 w-16 md:w-32 font-bold'>
                {cardsOrMore}%
              </div>
              <div className='col-span-3'>
                <p>Chance to draw none of the desired card:</p>
              </div>
              <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 w-16 md:w-32 font-bold'>
                {noCards}%
              </div>
              <div className='col-span-4 text-justify'>
                <p>
                  On average, you can expect to draw{' '}
                  <span className='font-bold'>{meanCards}</span> of the desired
                  card(s) when you draw{' '}
                  <span className='font-bold'>{currentDraw}</span> card(s) from
                  a <span className='font-bold'>{currentLibrary}</span>-card
                  library containing{' '}
                  <span className='font-bold'>{currentSuccessSize}</span> of the
                  desired card(s).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className='mx-auto md:fixed md:right-0 md:bottom-0 m-1'>
        <p>
          Made with &#10084; by
          <a
            href='https://github.com/Kerakis'
            target='_blank'
            rel='noopener noreferrer'
          >
            &nbsp;Kerakis&nbsp;
          </a>
        </p>
      </footer>
    </div>
  );
}
