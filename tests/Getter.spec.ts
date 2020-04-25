import Getter from "~/Getter";

describe('store/ModuleGenerator/Getter.ts', () => {

    test.each`
        type         | default_value  | manual                          | example
        ${'string'}  | ${''}          | ${'default text'}               | ${'sample'}
        ${'number'}  | ${0}        | ${6543}                         | ${76543}
        ${'boolean'} | ${false}       | ${true}                         | ${false}
        ${'object'}  | ${{}}        | ${{name: 'example name'}}       | ${{age: 2345}}
        ${'array'}   | ${[]}          | ${['an', 'example', 'array']}   | ${[23, 'test', false]}
        ${'any'}     | ${null}        | ${true}                         | ${false}
    `(`The $type getter returns the correct value`, ({type, default_value, manual, example}) => {
        let raw = new Getter('name');
        let getter = raw.format(type);
        expect(getter({name: null}, {}, {}, {})).toEqual(default_value);

        raw = new Getter('name');
        getter = raw.format(type);
        expect(getter({name: example}, {}, {}, {})).toEqual(example);

        raw = new Getter('name', manual);
        getter = raw.format(type);
        expect(getter({name: null}, {}, {}, {})).toEqual(manual);
    });
});
