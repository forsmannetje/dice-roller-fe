export function flipSign(amount: number, flipSign: boolean = true): number {
    if (flipSign) return amount * -1
    else return amount
}