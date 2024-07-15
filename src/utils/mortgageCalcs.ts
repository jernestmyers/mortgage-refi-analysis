import { getOriginationDate } from "./dates";

const MONTHLY_INTEREST_RATE = import.meta.env.VITE_ORIGINAL_APR / 12 / 100;

export function getLoanCalculations(originalBalance: number, numberOfPaymentsMade: number, monthlyPayment: number) {
    let totalInterestPaid = 0;
    let balanceRemaining = originalBalance;
    for (let i = 0; i < numberOfPaymentsMade; i++) {
        const monthlyInterest = balanceRemaining * MONTHLY_INTEREST_RATE;
        totalInterestPaid = totalInterestPaid + monthlyInterest;
        balanceRemaining = balanceRemaining - (monthlyPayment - monthlyInterest)
    }
    return {
        totalInterestPaid: totalInterestPaid.toFixed(2),
        balanceRemaining: balanceRemaining.toFixed(2),
    }
}

export function getNumberOfPaymentsMade(originationDate: Date) {
    const originationMonth = originationDate.getMonth();
    const originationYear = originationDate.getFullYear();
    const todaysMonth = (new Date()).getMonth();
    const todaysYear = (new Date()).getFullYear();
    if (originationYear === todaysYear) {
        return todaysMonth - originationMonth
    } else {
        return (12 - originationMonth) + (todaysYear - originationYear - 1) * 12 + todaysMonth + 1
    }
}

export function getFormattedOriginationDate() {
    const originationDate = getOriginationDate();
    const originationDateComponents = originationDate.toDateString().split(' ')
    return originationDateComponents[1] + ' ' + originationDateComponents[3]
}

export function getMonthlyPayment(loanAmount: string, APR: number, term: number) {
    const i = APR / 12 / 100;
    const n = term * 12;
    // refi costs range from 2 to 5 percent of loan cost, let's assume 3
    const loanPlusFees = Number(loanAmount) * 1.03;
    return (loanPlusFees * (i + (i / ((1 + i) ** n - 1)))).toFixed(2)
}