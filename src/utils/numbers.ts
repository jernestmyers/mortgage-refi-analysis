export function formatNumberAsCurrency(value: string) {
    const hasDecimal = value.includes('.')
    if (hasDecimal) {
        const splitValue = value.split('.')
        return '$' + addCommas(splitValue[0].split('')) + '.' + splitValue[1]
    } else {
        return '$' + addCommas(value.split(''))
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