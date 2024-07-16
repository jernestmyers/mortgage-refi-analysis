import { REFI_TERMS, RefiTerm } from "../App"
import { formatNumberAsCurrency } from "../utils/numbers"

type Props = {
    selectedRefiRate: number,
    refinanceTerms: RefiTerm,
    setRefinanceTerms: (term: RefiTerm) => void;
    refinancePayments: number;
}

export function RefiDetails({ selectedRefiRate, refinanceTerms, setRefinanceTerms, refinancePayments }: Props) {
    return (
        <div>
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
            <p><span>New Monthly Payment: </span>{formatNumberAsCurrency(refinancePayments).toString()}</p>
        </div>
    )
}