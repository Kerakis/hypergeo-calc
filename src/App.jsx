import { useRef, useState } from 'react';
import { useInput } from './hooks/input-hook';
import './index.css';
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

export default function App() {
  const resultsRef = useRef(null);
  const successesOverDrawRef = useRef(null);
  const drawOverLibraryRef = useRef(null);
  const successSizeOverLibraryRef = useRef(null);
  const { value: N, bind: bindN } = useInput('99');
  const { value: n, bind: bindn } = useInput('7');
  const { value: M, bind: bindM } = useInput('40');
  const { value: x, bind: bindx } = useInput('2');
  const [exactCards, setExactCards] = useState(0);
  const [lessThan, setLessThan] = useState(0);
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

  const orLess = (N, M, n, x) => {
    let r = 0;
    for (let i = 0; i < x; i++) {
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

  const executeScroll = () =>
    resultsRef.current.scrollIntoView({ behavior: 'smooth' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const numM = parseFloat(M);
    const numN = parseFloat(N);
    const numn = parseFloat(n);
    const numx = parseFloat(x);
    setExactCards((+pmf(numN, numM, numn, numx) * 100).toFixed(2));
    setCardsOrLess(+lcdf(numN, numM, numn, numx).toFixed(2));
    setLessThan(+orLess(numN, numM, numn, numx).toFixed(2));
    setCardsOrMore(+ucdf(numN, numM, numn, numx).toFixed(2));
    setNoCards(+whiff(numN, numM, numn, numx).toFixed(2));
    setMeanCards(+mean(numN, numM, numn, numx));
    setCurrentLibrary(numN);
    setCurrentDraw(numn);
    setCurrentSuccessSize(numM);
    setCurrentSuccesses(numx);
    resultsRef.current.style.visibility = 'visible';
    setTimeout(() => {
      executeScroll();
    }, 0);
    numx > numn
      ? (successesOverDrawRef.current.style.borderColor =
          'rgb(220 38 38 / var(--tw-border-opacity))')
      : (successesOverDrawRef.current.style.borderColor =
          'rgb(243 244 246 / var(--tw-border-opacity))');
    numn > numN
      ? (drawOverLibraryRef.current.style.borderColor =
          'rgb(220 38 38 / var(--tw-border-opacity))')
      : (drawOverLibraryRef.current.style.borderColor =
          'rgb(243 244 246 / var(--tw-border-opacity))');
    numM > numN
      ? (successSizeOverLibraryRef.current.style.borderColor =
          'rgb(220 38 38 / var(--tw-border-opacity))')
      : (successSizeOverLibraryRef.current.style.borderColor =
          'rgb(243 244 246 / var(--tw-border-opacity))');
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
            The number of desired cards that you&apos;re hoping to draw during
            the draw event can&apos;t be greater than the number of cards being
            drawn during the draw event.
          </p>
        </div>
      );
    }
    if (currentDraw > currentLibrary) {
      return (
        <div className='text-red-600 p-4 self-center font-bold text-justify'>
          <p>
            The number of cards drawn during the draw event can&apos;t be
            greater than the number of cards in your library.
          </p>
        </div>
      );
    }
    if (currentSuccessSize > currentLibrary) {
      return (
        <div className='text-red-600 p-4 self-center font-bold text-justify'>
          <p>
            The total number of desired cards can&apos;t be greater than the
            number of cards in your library.
          </p>
        </div>
      );
    }
  };

  return (
    <div className='flex flex-col md:h-screen mt-8 md:mt-0 align-center justify-center'>
      <div className='flex flex-col max-w-4xl mx-auto container'>
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
            drawing 2 land cards in your opening hand of 7 cards from a 99-card
            library containing 40 land cards.
          </h3>
        </div>
        <div className='mb-4 m-auto bg-gray-700 container border-solid border border-gray-100 shadow-xl'>
          <form
            className='flex flex-col md:grid md:grid-cols-4 md:gap-y-2 p-4 md:justify-items-start'
            onSubmit={handleSubmit}>
            <div className='col-span-3'>
              <label>Total number of cards in your library:</label>
            </div>
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
                min='1'
                max='1000'
                {...bindN}
              />
            </div>
            <div className='col-span-3'>
              <label>Number of cards to draw during the draw event:</label>
            </div>
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                ref={drawOverLibraryRef}
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
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
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                ref={successSizeOverLibraryRef}
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
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
            <div className='justify-self-end self-center md:w-auto w-full'>
              <input
                ref={successesOverDrawRef}
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 text-center md:text-left px-2 my-1 md:my-0 md:mx-2 w-full md:w-32'
                type='number'
                required
                min='1'
                max='1000'
                {...bindx}
              />
            </div>
            <div className='mx-auto col-span-4 mt-4 md:mt-2'>
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
          className='invisible m-auto flex flex-col bg-gray-700 container border-solid border border-gray-100 shadow-xl'>
          {isError && getErrorMessage()}

          {!isError && (
            <div className='flex flex-col md:grid md:grid-cols-4 md:gap-y-2 p-4 md:justify-items-start'>
              <div className='col-span-3'>
                <p>
                  Chance to draw exactly {currentSuccesses} of the desired card:{' '}
                </p>
              </div>
              <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
                {exactCards}%
              </div>
              <div className='col-span-3'>
                <p>
                  Chance to draw {currentSuccesses} or less of the desired card:{' '}
                </p>
              </div>
              <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
                {cardsOrLess}%
              </div>
              <div className='col-span-3'>
                <p>
                  Chance to draw less than {currentSuccesses} of the desired
                  card:{' '}
                </p>
              </div>
              <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
                {lessThan}%
              </div>
              <div className='col-span-3'>
                <p>
                  Chance to draw {currentSuccesses} or more of the desired card:
                </p>
              </div>
              <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
                {cardsOrMore}%
              </div>
              <div className='col-span-3'>
                <p>Chance to draw none of the desired card:</p>
              </div>
              <div className='justify-self-end self-center bg-gray-800 border border-solid rounded border-gray-100 text-center md:text-left px-2 mx-2 my-1 md:my-0 w-full md:w-32 overflow-hidden'>
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
