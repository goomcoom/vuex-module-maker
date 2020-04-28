# Vuex Module Maker

# Installation

# Usage

### Template

A module is created from a **template** object with instructions, state, getters, mutations, actions & modules. All the
properties of the template except for the instructions are added to the module as is – passing a already generated
module into the module maker should return an exact replica. The module properties that are added from the template's
state, getters, mutations, modules properties take precedence over any of the properties generated from instructions,
for example if a getter is created from an instruction and another getter is defined in the template's getters objects
with the same name, the latter will be in the generated module.

The defaults used to generate the module are very configurable, see the [config](#config) section on how to change the
defaults.

Instructions are backbone of this package, each instruction is processed to generate a state property, getter and
mutation. Each instruction is expected to have at least a `type` option, this type is important for returning the
correct format when using the generated getter. The instruction can be in the form of a `key`:`value` pair where
the key is the raw name of state property and the value is either a string equal to the type or an object with
instruction options.

```javascript
const instructions = {
    id: 'number', // Instruction with just the type declared
    name: {
        type: 'string',

        // State options
        set_state: true,
        state_name: 'name', 
        initial_value: null,

        // Getter options
        set_getter: true,
        getter_name: 'getName',
        getter: state => {
            return (state[state_name] == null) ? default_value : state[state_name];
        },
        default_value: null | '' | false | [], // Depending on type
        
        // Mutation options
        set_mutation: true,
        mutation_name: 'setName',
        mutation: (state, value = undefined) => {
            state[state_name] = (value == null) ? null : value;
        },
    },
}
```

###### `key`

The instruction key is used to generate the names of the state property, getter and mutation. If you want to control any
of the names you can do so using the [`state_name`, `getter_name` & `mutation_name`](#state_name-getter_name--mutation_name)
options.
- state – the key is converted to snake case
- getter – the key is prefixed with 'get' and converted to camel case
- mutation – the key is prefixed with 'set' and converted to camel case

```javascript
    const instructions = {
        'First Name': 'string' // [state = first_name] [getter = getFirstName] [mutation = setFirstName]
    }
```

###### `set_state`, `set_getter` & `set_mutation`

If you want either the state property, getter or mutation to not be set, simply set the relevant option to `false`.

###### `state_name`, `getter_name` & `mutation_name`

If you would like to manually set the state, getter or mutation name set the respective option. If you set the
`state_name` option, the getter and mutation names will be generated from that specified name, however, setting the
getter or mutation name does not affect any other name.

###### `initial_value`

All state properties are initially set to `null` by default. If you would like to set the state property with any other
initial value, you may pass that value using the `initial_value` option.

###### `default_value`

The purpose of the default value is to ensure that the correct type it always returned (where possible), for example if
the expected type is an `array`, to avoid checking if the value is `null` or an `array`, we return an empty array.
The returned default value is dependent on the type set in the instruction option. If you would like to return a
specific value if the state value is `null` you can pass the value using the `default_value` option. If you would like
the default value to be applied to all getters or getters of a specific type you can change the [config](#config)
settings.

###### `getter` & `mutation`

If you would like to customize the getter or mutation that is used to you can pass in the functions using the relevant
options. Be mindful of the vuex standards ([getters](https://vuex.vuejs.org/guide/getters.html) & 
[mutations](https://vuex.vuejs.org/guide/mutations.html)). If you would like to change the default getters & mutations
for all types or specific types you can change the [config](#config) settings.

### Namespaced
Because the generated module is designed to be reusable, the namespace is set to `true` by default
([vuex guide](https://vuex.vuejs.org/guide/modules.html#namespacing)). If you would like to set it to `false` you may
do so by passing a namespaced property in the config object during instantiation.

```javascript
import ModuleMaker from 'vuex-module-maker';

const config = {
    namespaced: false,
    //...
};

const maker = ModuleMaker(config);
const module = maker.make({}); // module.namespaced === false
```

### State

Inline with the vuex instructions on creating reusable modules, the state is a callback that returns the state object,
similar to how we define the state in the vue components
([vuex guide](https://vuex.vuejs.org/guide/modules.html#module-reuse)).

When the state property is created from an instruction, the name is extracted from the instruction's key and converted
to snake case. The name can be controlled by passing a `state_name` option with the desired name, the passed value
is not altered in any way.

If the state property is created from the template's state property, the name will be identical to
the key of the defined property.

The initial value is set to `null` by default but it can also be controlled by passing an
`initial_value` option whose value will be used as the initial value.

If the state property is created from the template's state property, the property's value will be
set as the initial value.

If you would like to prevent the state property from being created, you can include the `set_state` options with a
false value.

```javascript
const template = {
    instructions: {
        id: 'number',
        userActive: 'boolean', 
        name: {
            type: 'string',
            state_name: 'userName',
        },
        age: {
            type: 'number',
            default_value: 18,
        },
        expired: {
            type: 'function',
            set_state: false, // The state property will not be created
        },
    },
    state: {
        RoLe: 'admin',
    },
};

const resulting_module = {
    // ...
    state() {
        return {
            id: null, // No adjustments to the name
            user_active: null, // Converted to snake case
            userName: null, // Specified state name
            age: 18, // initial value defined using the initial_value option
            RoLe: 'admin', // No alterations to the name or value
        }
    },
    // ...
};
```

### Getters

The getter names are created from the instructions's key or the `state_name` option if supplied. The names are
converted to camel case and prefixed with 'get'. The getter name can be overwritten by passing a `getter_name` option,
the passed option is not manipulated at all.

If you don't want the getter to be created from the instruction you can pass a `set_getter` option as a false, this
does not affect the creation of the state or mutation.

The generated getters follow the same pattern – if the state property is `null` return the default value
otherwise return the state property. No other checks are done because the we assume that all state manipulations are
done through their respective mutations – the value is either valid or `null`.

The default value that is returned is dependent on the type set in the instruction, see the
[available types](#available-types) sections. The default value can also be manually set using the `default_value`
option where that value will be returned without any alterations when the state value is `null`.

If you would like to specify the getter that should be use you can provide the getter function as the `getter` option.

Any getters passed through the template's getters object are added as is, no alterations are made.

```javascript
const instructions = {
    id: 'number',
    name: {
        type: 'string',
        state_name: 'user_name',
    },
    comments: {
        type: 'array',
        state_name: 'user_comments',
        getter_name: 'comments',
    },
    friends: {
        type: 'array',
        set_getter: false, // The getter will not be created
    },
    date_of_birth: {
        type: 'date',
        default_value: new Date('2000-01-01'),
    },
    full_name: {
        type: 'string',
        getter: state => {
            if (state.full_name == null) {
                return `${state.first_name} ${state.last_name}`;
            }
            return state.full_name;
        },
    },
};

const generated_module = {
    //...
    getters: {
        // instruction key used
        // id prefixed with 'get' and converted to camel case
        getId: state => state.id,
        
        // instruction key ignored
        // the provided state_name used to generate the getter name
        // state_name prefixed with get and converted to camel case
        getUserName: state => {
            return state.user_name === null ? '' : state.user_name;
        },

        // instruction key and state_name ignored
        // provided getter_name option used as is
        comments: state => {
            return state.user_comments === null ? [] : state.user_comments;
        },
        
        // The defined default value is returned 
        getDateOfBirth: state => {
            return state.date_of_birth === null ? new Date('2000-01-01') : state.date_of_birth;
        },

        // Using the getter defined in the options
        getFullName: state => {
             if (state.full_name == null) {
                 return `${state.first_name} ${state.last_name}`;
             }
             return state.full_name;
         },
    },
    //...
};
```

### Mutations

The mutations follow the same rules as [getters](#getters) but in the context of mutations the names are prefixed with
'set' instead of 'get'.

The generated mutations set the state value equal to the passed value and `null` if no value has been passed.

The mutations rely on the correct value type being passed, no type checks are done within the mutations as this
package was designed to work best with [typescript](https://www.typescriptlang.org/docs/home.html). Using typescript
allows us to have complete control over the value types are passed. See the typescript section [below](#typescript)
for usage with typescript.

```javascript
const instructions = {
    id: 'number',
    name: {
        type: 'string',
        state_name: 'user_name',
    },
    comments: {
        type: 'array',
        state_name: 'user_comments',
        mutation_name: 'comments',
    },
    friends: {
        type: 'array',
        set_mutation: false, // The mutation will not be created
    },
    full_name: {
        type: 'string',
        mutation: (state, value = undefined) => {
            if (value == null) {
                state.full_name = `${state.first_name} ${state.last_name}`;
            } else {
                state.full_name = state.full_name;
            }
        },
    },
};

const generated_module = {
    //...
    mutations: {
        // instruction key used
        // id prefixed with 'set' and converted to camel case
        setId: (state, value = undefined) => {
            state.id = value == null ? null : value;
        },
        
        // instruction key ignored
        // the provided state_name used to generate the mutation name
        // state_name prefixed with set and converted to camel case
        setUserName: (state, value = undefined) => {
            if (value == null) {
                state.user_name = null;
            } else {
                state.user_name = value;
            }
        },

        // instruction key and state_name ignored
        // provided mutation_name option used as is
        comments: (state, value = undefined) => {
            if (value == null) {
                state.user_comments = null;
            } else {
                state.user_comments = value;
            }
        },

        // A custom mutation was defined in the options
        setFullName: (state, value = undefined) => {
             if (value == null) {
                 state.full_name = `${state.first_name} ${state.last_name}`;
             } else {
                 state.full_name = state.full_name;
             }
         },
    },
    //...
};
```

### Actions & Modules

Actions and modules are not directly related to the [state](#state), [getters](#getters) and [mutations](#mutations) so
it's impossible to know what actions and modules will be used in a module, this means that the module maker only adds
actions and modules that have been defined in the actions and modules template properties respectively.

```javascript
const template = {
    //...
    actions: {
        resetUser: (context) => {
            context.commit('setUserName');
            context.commit('setDateOfBirth');
        },
    },
    modules: {
        project: {
             namespaced: true,
             state() {
                 return {
                     name: null,
                 };
             },
             getters: {
                 getProjectName: (state) => {
                     return state.name == null ? '' : state.name;
                 },
             },
             mutations: {
                 setProjectName: (state, value = undefined) => {
                     state.name = value == null ? null : value;
                 },
             },
         },
    },
}

const generated_module = {
    //...
    actions: {
        resetUser: (context) => {
            context.commit('setUserName')
            context.commit('setDateOfBirth')
        },
    },
    modules: {
        project: {
            namespaced: true,
            state() {
                return {
                    name: null,
                };
            },
            getters: {
                getProjectName: (state) => {
                    return state.name == null ? '' : state.name;
                },
            },
            mutations: {
                setProjectName: (state, value = undefined) => {
                    state.name = value == null ? null : value;
                },
            },
        },
    },
}
```

### Available types

### Precedence & Gotchas

- State properties are assigned in order of assignment in the instructions object, if two
instructions have the same state name the last called instruction will be assigned to the module
state.
- The state properties defined in the template's state property take precedence over
instructions.

Note that this does not extend to other parts of the module – if a state property is overwritten
the getter/mutation will remain as is unless they are overwritten by a later instruction with
the same getter/mutation name.

### Config

### Typescript

### Useful Type Declarations
