export const classHandler = (element, toCompare, base = 'item label') => {
    return element === toCompare ? base + ' active' : base
}