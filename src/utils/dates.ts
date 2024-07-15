export function getOriginationDate() {
    return new Date(import.meta.env.VITE_ORIGINAL_ORIGINATION_YEAR, import.meta.env.VITE_ORIGINAL_ORIGINATION_MONTH);
}