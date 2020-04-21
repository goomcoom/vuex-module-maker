import Getter from "~/Getter";

describe('store/ModuleGenerator/Getter.ts', () => {

    test.each`
        type         | default_value  | manual
        ${'string'}  | ${''}          | ${'default text'}
        ${'number'}  | ${null}        | ${6543}
        ${'boolean'} | ${false}       | ${true}
        ${'object'}  | ${null}        | ${{name: 'example name'}}
        ${'array'}   | ${[]}          | ${['an', 'example', 'array']}
        ${'any'}     | ${null}        | ${true}
    `(`Setting the type as "$type" returns the correct default value`, ({type, default_value, manual}) => {
        let raw = new Getter(type, 'name');
        let getter = raw.format();
        expect(getter({name: null})).toEqual(default_value);

        raw = new Getter(type, 'name', manual);
        getter = raw.format();
        expect(getter({name: null})).toEqual(manual);
    });

    test('The getter returns the correct state property', () => {
        const state = {name: 'First Name'};
        const raw = new Getter('string', 'name');
        const getter = raw.format();
        expect(getter(state)).toEqual(state.name);
    })
});
