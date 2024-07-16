export function formatNumberAsCurrency(value: number) {
    const stringValue = value.toString();
    const hasDecimal = stringValue.includes('.')
    if (hasDecimal) {
        const splitValue = stringValue.split('.')
        return '$' + addCommas(splitValue[0].split('')) + '.' + splitValue[1]
    } else {
        return '$' + addCommas(stringValue.split(''))
    }
}

function addCommas(value: string[]) {
    const test = value.reverse()
    const final: string[] = []
    test.forEach((t, i) => {
        if ((i + 1) % 3 === 0 && (i + 1) < test.length) {
            final.unshift(t)
            final.unshift(',')
        } else {
            final.unshift(t)
        }
    })
    return final.join('')
}