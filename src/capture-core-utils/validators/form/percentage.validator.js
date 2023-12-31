//
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
export const isValidPercentage = value => {
    const replacedValue = value.replace("%", "");
    return !!(!isNaN(replacedValue) && Number(replacedValue) !== Infinity);
};
