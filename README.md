# The what and why

This is a barebones project that allows me to quickly assess mortgage refinancing. Freddie Mac publishes data every week for standard 15-year and 30-year mortgage rates. I do calculations based on Freddie Mac's data and my own mortgage details (defined in a `.env` file, see `.env.sample` for more info) to make some simple comparisons.

## How to run
If you're interested in playing with this, you can:

1. 
```js
  git clone git@github.com:jernestmyers/mortgage-refi-analysis.git
  cd mortgage-refi-analysis
  npm install
```

2. Set up the `.env` file; refer to the `.env.sample` file for more details.

3. Run `npm run dev`