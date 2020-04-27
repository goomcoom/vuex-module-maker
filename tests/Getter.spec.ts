// @ts-ignore
import Form from "vform";
import Getter from "~/Getter";
import Config from "~/Config";

describe('store/ModuleGenerator/Getter.ts', () => {
    const config_class = new Config();
    const config = config_class.configure();

    test.each`
        type         | default_value  | manual                              | example
        ${'string'}  | ${''}          | ${'default text'}                   | ${'sample'}
        ${'number'}  | ${null}        | ${6543}                             | ${76543}
        ${'boolean'} | ${false}       | ${true}                             | ${false}
        ${'object'}  | ${null}        | ${{name: 'example name'}}           | ${{age: 2345}}
        ${'array'}   | ${[]}          | ${['an', 'example', 'array']}       | ${[23, 'test', false]}
        ${'any'}     | ${null}        | ${true}                             | ${false}
    `(`The $type getter returns the correct value`, ({type, default_value, manual, example}) => {
        let raw = new Getter(config);
        let getter = raw.format(type, 'name');
        expect(getter({name: null}, {}, {}, {})).toEqual(default_value);

        raw = new Getter(config);
        getter = raw.format(type, 'name');
        expect(getter({name: example}, {}, {}, {})).toEqual(example);

        raw = new Getter(config);
        getter = raw.format(type, 'name', manual);
        expect(getter({name: null}, {}, {}, {})).toEqual(manual);
    });

    test('The getter class sets the config property on instantiation', () => {
        const getter = new Getter(config);
        expect(JSON.stringify(getter.config)).toEqual(JSON.stringify(config));
    });

    test('The specified config type getter is returned if defined', () => {
        delete config.types.string.default_value;
        config.types.string.getter = (state_name, default_value) => {
            return (state: any): string => {
                return state[state_name] == null ? default_value : 'No longer hungry';
            }
        };

        const getter = new Getter(config);
        const formatted = getter.format('string', 'banana');

        expect(formatted({banana: null}, {}, {}, {})).toEqual(null);
        expect(formatted({banana: 'fed'}, {}, {}, {})).toEqual('No longer hungry');
    });
});
