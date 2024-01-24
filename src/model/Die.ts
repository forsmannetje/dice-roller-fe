export interface Die {
    faces: number;
}

export function fromFaces(faces: number) {
    switch (faces) {
        case 4: return D4;
        case 6: return D6;
        case 8: return D8;
        case 10: return D10;
        case 12: return D12;
        case 20: return D20;
        case 100: return D100;
        default: throw new Error(`Unexpected amount of faces for a die: ${faces}`)
    }
}

export const D4: Die = { faces: 4 };
export const D6: Die = { faces: 6 };
export const D8: Die = { faces: 8 };
export const D10: Die = { faces: 10 };
export const D12: Die = { faces: 12 };
export const D20: Die = { faces: 20 };
export const D100: Die = { faces: 100 };
