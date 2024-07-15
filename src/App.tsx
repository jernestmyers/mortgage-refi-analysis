import { useState, useEffect, useRef } from 'react'
import './App.css'
import { getFormattedOriginationDate, getLoanCalculations, getMonthlyPayment, getNumberOfPaymentsMade } from './utils/mortgageCalcs';
import { formatNumberAsCurrency } from './utils/numbers';
import { getOriginationDate } from './utils/dates';

const RATES_COLUMN_REGEX = /<td>\s*([\d]+\.[\d]+)\s*<\/td>/g
const RATE_REGEX = /([\d]+\.[\d]+)/
const REFI_TERMS = ['30', '15'] as const
type RefiTerm = typeof REFI_TERMS[number]

function App() {
  const [aggregatedFreddieMacRates, setAggregatedFreddieMacRates] = useState<number[] | undefined>(undefined);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [refinanceTerms, setRefinanceTerms] = useState<RefiTerm>('30');
  const selectedRefiRate = aggregatedFreddieMacRates ? refinanceTerms === '30' ? aggregatedFreddieMacRates[0] : aggregatedFreddieMacRates[1] : null

  useEffect(
    () => {
      async function getFreddieMacWidget() {
        try {
          const freddieMacWidgetResponse = await fetch('https://corsproxy.io/?https://www.freddiemac.com/pmms/pmmsthin.html');
          const widgetHtmlString = await freddieMacWidgetResponse.text();
          const ratesCells = widgetHtmlString.match(RATES_COLUMN_REGEX)
          const rates = ratesCells?.reduce((prev: number[] | undefined, curr: string) => {
            const rate = curr.match(RATE_REGEX)
            if (rate && prev) {
              return prev.concat(Number(rate[0]))
            }
          }, [])
          setAggregatedFreddieMacRates(rates)
        } catch (err) {
          console.log(err)
        }
      }

      getFreddieMacWidget()
    }, []
  )

  const { totalInterestPaid, balanceRemaining } =
    getLoanCalculations(
      Number(import.meta.env.VITE_ORIGINAL_LOAN_AMOUNT),
      getNumberOfPaymentsMade(getOriginationDate()),
      Number(import.meta.env.VITE_ORIGINAL_MONTHLY_LOAN_PAYMENT)
    )

  const thirtyYearLoanInterest =
    getLoanCalculations(
      Number(import.meta.env.VITE_ORIGINAL_LOAN_AMOUNT),
      360,
      Number(import.meta.env.VITE_ORIGINAL_MONTHLY_LOAN_PAYMENT)
    ).totalInterestPaid

  return (
    <>
      <div>
        <div>
          <h2>Current Loan Details:</h2>
          <p><span>APR: </span>{import.meta.env.VITE_ORIGINAL_APR}%</p>
          <p><span>Term: </span>{import.meta.env.VITE_ORIGINAL_TERM} years</p>
          <p><span>Loan Amount: </span>{formatNumberAsCurrency(import.meta.env.VITE_ORIGINAL_LOAN_AMOUNT)}</p>
          <p><span>Monthly Payment: </span>{formatNumberAsCurrency(import.meta.env.VITE_ORIGINAL_MONTHLY_LOAN_PAYMENT)}</p>
          <p><span>Origination Date: </span>{getFormattedOriginationDate()}</p>
          <p><span>30Y Interest: </span>{formatNumberAsCurrency(thirtyYearLoanInterest)}</p>
        </div>
        <div>
          <h2>Current Payment Summary:</h2>
          <p><span>Remaining Principal: </span>{formatNumberAsCurrency(balanceRemaining)}</p>
          <p><span>Interest Paid: </span>{formatNumberAsCurrency(totalInterestPaid)}</p>
        </div>
      </div>
      <div>
        <iframe
          ref={iframeRef}
          src="https://www.freddiemac.com/pmms/pmmsthick.html"
          title="Freddie Mac Weekly PMMS"
          width="185"
          height="175"
          scrolling="no"
        />
        {aggregatedFreddieMacRates && selectedRefiRate &&
          (<div>
            <h2>Refi Details:</h2>
            <p><span>APR: </span>{selectedRefiRate}%</p>
            <p><span>Term: </span>
              {REFI_TERMS.map(term => (
                <label key={term} htmlFor={term}>
                  <input onChange={(e) => setRefinanceTerms(e.target.value as RefiTerm)} checked={term === refinanceTerms} type="radio" id={term} name="refiTerm" value={term} />
                  {term}Y
                </label>
              ))}
            </p>
            <p><span>New Monthly Payment: </span>{formatNumberAsCurrency(getMonthlyPayment(balanceRemaining, selectedRefiRate, Number(refinanceTerms)).toString())}</p>
          </div>)
        }
      </div>
    </>
  )
}

export default App
