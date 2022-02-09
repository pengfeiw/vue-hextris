export const degreeToRadians = (degree: number) => degree / 180 * Math.PI;
export const radiansToDegree = (radians: number) => radians / Math.PI * 180;

/**
 * get random integer from [minInt, maxInt)
 */
export const randomInteger = (min: number, max: number) => {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
};
