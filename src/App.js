import React, { useRef } from 'react';
import { useInput } from './hooks/input-hook';
import './index.css';

export default function App() {
  const resultsRef = useRef(null);
  const { value: N, bind: bindN } = useInput('100');
  const { value: n, bind: bindn } = useInput('7');
  const { value: M, bind: bindm } = useInput('40');
  const { value: x, bind: bindk } = useInput('2');

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

  const handleSubmit = (evt) => {
    evt.preventDefault();
    // pmf(N, M, n, x);
    // lcdf(N, M, n, x);
    // ucdf(N, M, n, x);
    // whiff(N, M, n);
    // mean(N, M, n);
    resultsRef.current.style.display = 'flex';
  };

  let exactCards = 100 * +pmf(N, M, n, x).toFixed(3) + '%';
  let cardsOrLess = +lcdf(N, M, n, x).toFixed(3) + '%';
  let cardsOrMore = +ucdf(N, M, n, x).toFixed(3) + '%';
  let noCards = +whiff(N, M, n, x).toFixed(3) + '%';
  let meanCards = +mean(N, M, n, x);

  return (
    <div className='flex flex-col h-screen align-center justify-center'>
      <div className='flex flex-col max-w-4xl mx-auto'>
        <div className='mb-8 mx-auto flex flex-col items-center bg-gray-700 container border-solid border border-gray-100'>
          <h1 className='text-3xl py-4'>
            Hypergeometric Distribution Calculator
          </h1>
        </div>
        <div className='mb-4 mx-auto flex flex-col items-center bg-gray-700 container border-solid border border-gray-100'>
          <h3 className='p-4 text-justify'>
            This hypergeometric distribution calculator can help you determine
            the probabilities of you drawing a specific card or cards from a
            library of cards. For example, it can help you determine the
            liklihood of drawing 2 land cards in your opening hand from a
            library of 100 cards which contains 40 land cards.
          </h3>
        </div>
        <div className='m-auto flex flex-col bg-gray-700 container border-solid border border-gray-100'>
          <form
            className='grid grid-rows-5 grid-cols-1 p-4'
            onSubmit={handleSubmit}
          >
            <div>
              <label>Total number of cards in your library:</label>
            </div>
            <div className='justify-self-end'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 px-2 mx-2'
                type='text'
                {...bindN}
              />
            </div>
            <div>
              <label>Number of cards to draw during the draw event:</label>
            </div>
            <div className='justify-self-end'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 px-2 mx-2'
                type='text'
                {...bindn}
              />
            </div>
            <div>
              <label>
                Total number of desired cards that are in your library:
              </label>
            </div>
            <div className='justify-self-end pb-2'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 px-2 mx-2'
                type='text'
                {...bindm}
              />
            </div>
            <div>
              <label>
                Number of desired cards that you hope to draw during the draw
                event:
              </label>
            </div>
            <div className='justify-self-end'>
              <input
                className='bg-gray-800 focus:bg-slate-500 transition-colors border border-solid rounded border-gray-100 px-2 mx-2'
                type='text'
                {...bindk}
              />
            </div>
            <div className='self-center mx-auto col-span-2 pt-2'>
              <input
                className='text-base bg-gray-800 hover:bg-slate-500 transition-colors border border-solid rounded border-gray-100 w-56'
                type='submit'
                value='Calculate Probabilities'
              />
            </div>
          </form>
          <div ref={resultsRef} className='hidden'>
            <div className='p-4 grid grid-cols-2 grid-rows-4 gap-1'>
              <div className=''>
                <p>Chance to draw exactly {x} of the desired card: </p>
              </div>
              <div className='font-bold'>{exactCards}</div>
              <div>
                <p>Chance to draw {x} or less of the desired card: </p>
              </div>
              <div className='font-bold'>{cardsOrLess}</div>
              <div>
                <p>Chance to draw {x} or more of the desired card: </p>
              </div>
              <div className='font-bold'>{cardsOrMore}</div>
              <div>
                <p>Chance to draw none of the desired card: </p>
              </div>

              <div className='font-bold'>{noCards}</div>
              <div className='col-span-2'>
                <p>
                  On average, you can expect to draw{' '}
                  <span className='font-bold'>{meanCards}</span> of the desired
                  card(s) when you draw <span className='font-bold'>{n}</span>{' '}
                  card(s) from a <span className='font-bold'>{N}</span>-card
                  library containing <span className='font-bold'>{M}</span> of
                  the desired card(s).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className='fixed right-0 bottom-0 m-1'>
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
