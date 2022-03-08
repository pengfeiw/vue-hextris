export interface Vector {
    x: number;
    y: number;
}
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

export const normalizeVector = (vector: Vector) => {
    const {x, y} = vector;
    const len = Math.sqrt(x * x + y * y);
    return {
        x: x / len,
        y: y / len
    };
};

export const addVec = (...vectors: Vector[]) => {
    if (vectors.length < 1) {
        throw new Error("addVec Error: the params length must greater then 1");
    }

    const res = {x: vectors[0].x, y: vectors[0].y};
    for (let i = 1; i < vectors.length; i++) {
        res.x += vectors[i].x;
        res.y += vectors[i].y;
    }

    return res;
};

export const multiplyVectorByScalar = (vec: Vector, scalar: number): Vector => {
    return {
        x: vec.x * scalar,
        y: vec.y * scalar
    }
};

export const getPointDistance = (p1: Vector, p2: Vector) => {
    return Math.sqrt(p1.x - p2.x + p1.y - p2.y);
};
