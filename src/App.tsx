import { useState, useEffect } from 'react'
import './App.css'
import { getLoanCalculations, getRefiMonthlyPayment, getNumberOfPaymentsMade } from './utils/mortgageCalcs';
import { getOriginationDate } from './utils/dates';
import { RefiDetails } from './components/RefiDetails';
import { ComparisonDetails } from './components/ComparisonDetails';
import { FreddieMacWidget } from './components/FreddieMacWidget';
import { CurrentDetails } from './components/CurrentDetails';

const RATES_COLUMN_REGEX = /<td>\s*([\d]+\.[\d]+)\s*<\/td>/g
const RATE_REGEX = /([\d]+\.[\d]+)/
export const REFI_TERMS = ['30', '15'] as const
export type RefiTerm = typeof REFI_TERMS[number]

function App() {
  const [aggregatedFreddieMacRates, setAggregatedFreddieMacRates] = useState<number[] | undefined>(undefined);
  const [refinanceTerms, setRefinanceTerms] = useState<RefiTerm>('30');

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

  if (!aggregatedFreddieMacRates) return;

  const selectedRefiRate = refinanceTerms === '30' ? aggregatedFreddieMacRates[0] : aggregatedFreddieMacRates[1]

  const { totalInterestPaid, balanceRemaining } =
    getLoanCalculations(
      Number(import.meta.env.VITE_ORIGINAL_LOAN_AMOUNT),
      getNumberOfPaymentsMade(getOriginationDate()),
      Number(import.meta.env.VITE_ORIGINAL_MONTHLY_LOAN_PAYMENT),
      Number(import.meta.env.VITE_ORIGINAL_APR),
    )

  const thirtyYearLoanInterest =
    getLoanCalculations(
      Number(import.meta.env.VITE_ORIGINAL_LOAN_AMOUNT),
      360,
      Number(import.meta.env.VITE_ORIGINAL_MONTHLY_LOAN_PAYMENT),
      Number(import.meta.env.VITE_ORIGINAL_APR),
    ).totalInterestPaid

  const refinancePayments = getRefiMonthlyPayment(balanceRemaining, selectedRefiRate, Number(refinanceTerms))

  const refinanceLoanInterest =
    getLoanCalculations(
      // account for the 3% cost of refinancing
      balanceRemaining * 1.03,
      Number(refinanceTerms) * 12,
      refinancePayments,
      selectedRefiRate,
    ).totalInterestPaid

  const paymentsDifference = parseFloat(Math.abs(refinancePayments - Number(import.meta.env.VITE_ORIGINAL_MONTHLY_LOAN_PAYMENT)).toFixed(2))
  // add the interest we've already paid to the refi loan interest to account for the sunken interest costs from "restarting" a loan
  const interestDifference = parseFloat(Math.abs(thirtyYearLoanInterest - (refinanceLoanInterest + totalInterestPaid)).toFixed(2))

  return (
    <>
      <CurrentDetails
        thirtyYearLoanInterest={thirtyYearLoanInterest}
        balanceRemaining={balanceRemaining}
        totalInterestPaid={totalInterestPaid}
      />
      <div>
        <FreddieMacWidget />
        <RefiDetails
          selectedRefiRate={selectedRefiRate}
          refinanceTerms={refinanceTerms}
          setRefinanceTerms={setRefinanceTerms}
          refinancePayments={refinancePayments}
        />
      </div>
      <ComparisonDetails
        paymentsDifference={paymentsDifference}
        interestDifference={interestDifference}
        isRefiPaymentMore={refinancePayments > Number(import.meta.env.VITE_ORIGINAL_MONTHLY_LOAN_PAYMENT)}
        isRefiInterestMore={refinanceLoanInterest > thirtyYearLoanInterest}
      />
    </>
  )
}

export default App
