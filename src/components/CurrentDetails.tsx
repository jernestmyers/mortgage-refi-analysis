import { formatNumberAsCurrency } from "../utils/numbers"
import { getFormattedOriginationDate } from "../utils/mortgageCalcs"

type Props = {
    thirtyYearLoanInterest: number,
    balanceRemaining: number,
    totalInterestPaid: number,
}

export function CurrentDetails({ thirtyYearLoanInterest, balanceRemaining, totalInterestPaid }: Props) {
    return (
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
    )
}