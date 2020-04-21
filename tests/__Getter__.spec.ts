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
        let getters = new Getter(type, 'name');
        let getter = getters.format();
        expect(getter({name: null})).toEqual(default_value);

        getters = new Getter(type, 'name', manual);
        getter = getters.format();
        expect(getter({name: null})).toEqual(manual)
    })
});
