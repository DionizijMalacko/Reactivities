export interface Duck {
    name: string;
    numLegs: number;
    makeSound?: (sound: string) => void;
}

const duck1: Duck = {
    name: 'bla',
    numLegs: 2,
    makeSound: (sound: any) => console.log(sound)
}

const duck2: Duck = {
    name: 'blabla',
    numLegs: 2,
}


duck1.makeSound!('quack');

export const ducks = [duck1, duck2];