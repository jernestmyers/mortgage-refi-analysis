import { formatNumberAsCurrency } from "../utils/numbers"

type Props = {
    paymentsDifference: number,
    interestDifference: number,
    isRefiPaymentMore: boolean,
    isRefiInterestMore: boolean,
}

export function ComparisonDetails({ paymentsDifference, interestDifference, isRefiPaymentMore, isRefiInterestMore }: Props) {
    return (
        <div>
            <h2>Comparison Details:</h2>
            <p><span>Monthly Payment: </span>You would pay {formatNumberAsCurrency(paymentsDifference)} {isRefiPaymentMore ? 'more' : 'less'} per month</p>
            <p><span>Total Interest: </span>You would pay {formatNumberAsCurrency(interestDifference)} {isRefiInterestMore ? 'more' : 'less'} interest</p>
        </div>
    )
}