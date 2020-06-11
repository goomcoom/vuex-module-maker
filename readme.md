# Vuex Module Maker

- [Installation](#installation)
- [Usage](#usage)
    - [Template](#template)
        - [`key`](#key)
        - [`state_name, getter_name` & `mutation_name`](#state_name-getter_name-and-mutation_name)
        - [`set_state, set_getter` & `set_mutation`](#set_state-set_getter-and-set_mutation)
        - [`initial_value`](#initial_value)
        - [`default_value`](#default_value)
        - [`getter` & `mutation`](#getter-and-mutation)
    - [Namespaced](#namespaced)
    - [State](#state)
    - [Getters](#getters)
    - [Mutations](#mutations)
    - [Actions & Modules](#actions-and-modules)
    - [Available Types](#available-types)
- [Config](#config)
    - [`namespaced`](#config---namespaced)
    - [`naming`](#config---naming)
- [Typescript](#typescript)

The module maker has been designed to remove the overhead involved in implementing the reusable-modules pattern. Every
object that has mutable properties and methods should have its own module that can be reused across an
application. One major drawback of this pattern is that modules become verbose, and repetitive – modules are made-up of
the same data types, and their state tends to be manipulated in the same way (all `string` type properties tend to
have the same kind of getter and mutation). Adding testing to these modules just makes it even more laborious and
let's be honest, it's discouraging!

The idea is to centralize all the repetitive getter and mutation logic, organize it by type and ensure its tested. The
module maker is also completely configurable all the way from the default getter signature to how the property names are
generated. The example below shows the module generated from the short template.

```javascript
const template = {
    instructions: {
        id: 'number',
        name: 'string',
        dob: 'date',
        comments: {
            type: 'array',
            getter_name: 'getAllComments',
        },
    },
    getters: {
        getFilteredComments: state => (liked = true) => state.comments.filter(c => liked === !!c.likes),
    },
};

const generated_module = {
    namespaced: true,
    state() {
        return {
            id: null,
            name: null,
            dob: null,
            comments: null,
        };
    },
    getters: {
        getId: state => state.id,
        getName: state => (state.name == null) ? '' : state.name,
        getDob: state => state.dob,
        getAllComments: state => (state.comments == null) ? [] : state.comments,
        getFilteredComments: state => (liked = true) => state.comments.filter(c => liked === !!c.likes),
    },
    mutations: {
        setId: (state, value = undefined) => {
           if (value == null) {
               state.id = null;
           } else if (typeof value === 'number') {
               state.id = value;
           } else {
               const num = parseInt(value);
               state.id = isNaN(num) ? null : num;
           }
       },
       setName: (state, value) => {
           state.name = (value == null) ? null : value;
       },
        setDob: (state, value = undefined) => {
            if (value) {
                const date = new Date(value);
                state.dob = (date.toDateString() === 'Invalid Date') ? null : date;
            } else {
                state.dob = null;
            }
        },
       setComments: (state, value) => {
            state.name = (value == null) ? null : value;
        },
    },
};
```

# Installation

```shell script
$ npm i vuex-module-maker
```
```shell script
$ yarn add vuex-module-maker
```

# Usage

1. Import `vuex-module-maker` 
2. Instantiate the ModuleMaker class (pass in any config settings if necessary)
3. Call the `make()` method and pass in your template, that's it!
4. You can make use of the static `Make` method to combine step 2 and 3.

```javascript
import ModuleMaker from "vuex-module-maker";

const maker = new ModuleMaker(config);
const my_module = maker.make(template)

// Alternatively
const module = MaduleMaker.Make(template, config);
```

### Template

A module is created from a template object with instructions, state, getters, mutations, actions and modules properties.
All the properties of the template except for the instructions are added to the module as is – passing an already
generated module into the module maker should return a replica. The module properties that are added from the
template's state, getters, mutations, modules properties take precedence over any of the properties generated from
instructions, for example if a getter is created from an instruction and another getter is defined in the template's
getters objects with the same name, the latter will be in the generated module.

The defaults used to generate the module are very configurable, see the [config](#config) section on how to change the
defaults.

Instructions are the backbone of this package, each instruction is processed to generate a state property, getter and
mutation. Each instruction is expected to have at least a `type` option, this type is important for returning the
correct format when using the generated getter and that the mutations format payloads correctly before being added to
the state.

The instruction is in the form of a `key: value` pair where the key is the name of state property, and the value is
either a string equal to the type, or an object with instruction options.

```javascript
const template = {
    instructions {
        id: 'number', // Instruction with just the type declared
        name: {
            type: 'string' | 'number' | 'boolean' | 'array' | 'date' | 'object',
    
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
    },
    state: {
        // ...
    },
    getters: {
        // ...
    },
    mutations: {
        // ...
    },
    actions: {
        // ...
    },
    modules: {
        // ...
    }
}
```

###### `key`

The instruction key is used to generate the names of the state property, getter and mutation. If you want to control
any of the names you can do so using the
[`state_name, getter_name & mutation_name`](#state_name-getter_name-and-mutation_name)
options.

```javascript
const template = {
    instructions: {
        'First Name': 'string' // [state = first_name] [getter = getFirstName] [mutation = setFirstName]
    }
    // ...
};
```

###### `state_name, getter_name and mutation_name`

If you would like to manually set the state, getter or mutation name set the respective option. Setting any of the
naming options does not affect the others for example setting the `state_nsme` will not affect the generated getter &
mutation names.

> See the [config](#config-naming) section for details on changing the naming rules.

###### `set_state, set_getter & set_mutation`

If you want either the state property, getter or mutation to not be set, simply set the respective option to `false`.

###### `initial_value`

All state properties except for booleans are initially set to `null` by default, booleans are initially set to `false`.
If you would like to set the state property with any other initial value, you may pass that value using the
`initial_value` option. 

> See the [config](#config-types) section for details on changing the default initial values.

###### `default_value`

The purpose of the default value is to ensure that the correct type it always returned (where possible), for example if
the expected type is an `array`, to avoid checking if the value is `null` or an `array`, we return an empty array
instead of `null`. The returned default value is dependent on the type set. If you would like to return a specific value
if the state value is `null` you can pass the value using the `default_value` option.

> See the [config](#config-types) section for details on changing the default values.

###### `getter & mutation`

If you would like to customize the getter or mutation that is used to you can pass in the functions using the relevant
options. Be mindful of the vuex standards ([getters](https://vuex.vuejs.org/guide/getters.html) and 
[mutations](https://vuex.vuejs.org/guide/mutations.html)).

> See the [config](#config-types) section for details on changing the getters and mutation used.

### Namespaced
Because the generated module is designed to be reusable, the namespace property is set to `true` by default
([vuex guide](https://vuex.vuejs.org/guide/modules.html#namespacing)).

> See the [config](#config-namespaced) section for details on changing the namespaced property.

### State

Inline with vuex instructions on creating reusable modules, the state is a callback that returns the state object,
similar to how we define the state in vue components 
([vuex guide](https://vuex.vuejs.org/guide/modules.html#module-reuse)).

When the state property is created from an instruction, the name is extracted from the instruction's key and converted
to snake case by default. The name can be controlled by passing a `state_name` option with the desired name.

> See the [config](#config-naming) section for details on changing naming rules.

The initial value is set to `null` (or `false` if it's a 'boolean' type) by default, but it can also be controlled by
passing an `initial_value` option whose value will be used as the initial value.

> See the [config](#config-types) section for details on changing the default initial values.

If you would like to prevent the state property from being created, you can include the `set_state` option with a
`false` value, this does not affect the creation of the getter or mutation.

If the state property is created from the `template.state` property, the name will be identical to the key of the
defined property and so will be the initial value.

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
            initial_value: 18,
        },
        expired: {
            type: 'function', // Custom type
            set_state: false, // The state property will not be created
        },
    },
    state: {
        RoLe: 'admin',
    },
    // ...
};

const resulting_module = {
    // ...
    state() {
        return {
            id: null, // No adjustments to the name
            user_active: false, // Converted to snake case & boolean types have `false` initial value
            userName: null, // Specified state name
            age: 18, // initial value defined using the initial_value option
            RoLe: 'admin', // No alterations to the name or value
        }
    },
    // ...
};
```

### Getters

The getter names are created from the instructions' keys. The names are converted to camel case and prefixed with 'get'
by default. The getter name can be overwritten by passing a `getter_name` option.

> See the [config](#config-naming) section for details on changing the naming rules.

The default getters follow the same pattern – if the state property is `null` return the default value
otherwise return the state property. No other checks are done because we assume that all state manipulations are
done through their respective mutations – the value is either valid or `null`. The default value that is returned is
dependent on the type set in the instruction, see the [available types](#available-types) section. The default value
can also be manually set using the `default_value` option where that value will be returned without any alterations
when the state value is `null`.

> See the [config](#config-types) section for details on changing the default values.

If you would like to specify the getter that should be used you can provide the getter function as the `getter` option.

> See the [config](#config-types) section for details on changing the getters used.

If you don't want the getter to be created from the instruction you can pass a `set_getter` option as a `false`, this
does not affect the creation of the state or mutation.

Any getters passed through the `template.getters` object are added as is.

```javascript
const template = {
    instructions: {
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
    },
    getters: {
        'Get Liked Comments': state => state.comments.filter(c => !!c.likes)
    }
    // ...
};

const generated_module = {
    // ...
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

        // Added from the template.getters object
        // Added as-is
        'Get Liked Comments': state => state.comments.filter(c => !!c.likes)
    },
    // ...
};
```

### Mutations

Mutations follow the same rules as [getters](#getters) but in the context of mutations the names are prefixed with
'set' instead of 'get' by default.

> See the [config](#config-naming) section for details on changing the naming rules.

The mutations that are assigned depend on the type, see the [available types](#available-types) section for more info
about type specific mutations.

> See the [config](#config-types) section for details on changing the mutation settings.

```javascript
const template = {
    instructions: {
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
    },
    mutations: {
        'set name to uppercase': (state, value) => {
            state.name = value.toUpperCase();
        },
    },
    // ...
};

const generated_module = {
    // ...
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
         
        // Defined in template.mutations
        // Added to module as-is
        'set name to uppercase': (state, value) => {
            state.name = value.toUpperCase();
        },
    },
    // ...
};
```

### Actions and Modules

Actions and modules are not directly related to the [state](#state) so it's impossible to know what actions and modules
will be used in a module, this means that the module maker only adds actions and modules that have been defined in their
respective template properties.

```javascript
const template = {
    // ...
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
    // ...
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

The module maker comes pre-loaded with common types but are completely configurable and more can be added. If you would
like to change the default values used for a specific type or create a new type you can follow the instructions stated
in the [config](#config) section.

###### `default`

The `default` type is important because if the specified type does not exist all settings are pulled from the default,
when you change the default config be mindful of any ripple effects.

```javascript
const initial_value = null;

const default_value = null;

/**
* The getter used when the type specified doesn't exist or does't have a specified getter
*
* @param state
*/
const default_getter = state => {
   return (state[state_name] == null) ? default_value : state[state_name];
};

/**
* The mutation used when the type specified doesn't exist or does't have a specified mutation
*
* @param state
* @param {*} value
*/
const default_mutation = (state, value = undefined) => {
    state[state_name] = (value == null) ? null : value;
};
```

###### `string`

```javascript
const initial_value = null;

const default_value = '';

const string_getter = default_getter;

const string_mutation = default_mutation;
```

###### `number`

```javascript
const initial_value = null;

const default_value = null;

const number_getter = default_getter;

/**
* Mutation used when type === 'number'.
* 
* @param state
* @param {number|string} value
*/
const number_mutation = (state, value = undefined) => {
    if (value == null) {
        state[state_name] = null;
    } else if (typeof value === 'number') {
        state[state_name] = value;
    } else {
        const num = parseInt(value);
        state[state_name] = isNaN(num) ? null : num;
    }
};
```

###### `boolean`

```javascript
const initial_value = false;

const default_value = false;

const boolean_getter = default_getter;

/**
* The mutation used when the type === 'boolean'.
* 
* @param state
* @param {*} value
*/
const boolean_mutation = (state, value = undefined) => {
    state[state_name] = !!value;
};
```

###### `date`

```javascript
const initial_value = null;

const default_value = null;

const date_getter = default_getter;

/**
* The mutation used when the type === 'date'.
* 
* @param state
* @param {number|string|Date} value
*/
const date_mutation = (state, value = undefined) => {
    if (value) {
        const date = new Date(value);
        state[state_name] = (date.toDateString() === 'Invalid Date') ? null : date;
    } else {
        state[state_name] = null;
    }
};
```

###### `array`

```javascript
const initial_value = null;

const default_value = [];

const array_getter = default_getter;

const array_mutation = default_mutation;
```

###### `object`

```javascript
const initial_value = null;

const default_value = null;

const object_getter = default_getter;

/**
* The mutation used when the type === 'object'.
* 
* @param state
* @param {string|object} value
*/
const object_mutation = (state, value = undefined) => {
    if (typeof value === 'object') {
        state[state_name] = value;
    } else if (typeof value === 'string') {
        try {
            state[state_name] = JSON.parse(value);
        } catch (e) {
            state[state_name] = null;
        }
    } else {
        state[state_name] = null;
    }
};
```

# Config

The config is split into three parts – namespaced, naming & types.

### Config - `namespaced`

Because the generated module is designed to be reusable, the namespace property is set to `true` by default
([vuex guide](https://vuex.vuejs.org/guide/modules.html#namespacing)). If you would like to set it to `false` you may
do so by passing a namespaced property in the config object during instantiation.

```javascript
import ModuleMaker from 'vuex-module-maker';

const config = {
    namespaced: false,
    // ...
};

const maker = ModuleMaker(config);
const module = maker.make(template); // module.namespaced === false
```

### Config - `naming`

The naming config is split into state, getter and mutation; they each have a prefix, suffix and transformer option. The
naming process follows the same procedure: The naming config options are independent of each other meaning you only
need to submit the options you would like to change, for example if you just want to change the `prefix` you only need
to supply the `prefix` option, all other settings will remain the same.

```javascript
const raw_name = 'example';
const formatted_name = transformer(prefix + raw_name + suffix);
```

###### Default Types

The table below shows the default naming options and how they would transform the example – `Example word`

| Option        | Prefix    | Suffix   | Transformer         | Result            |
| ------------- | --------- | -------- | ------------------- | ----------------- |
| state         | `''`      | `''`     | `to_snake_case()`   | `example_word`    |
| getter        | `get_`    | `''`     | `toCamelCase()`     | `getExampleWord`  |
| mutation      | `set_`    | `''`     | `toCamelCase()`     | `setExampleWord`  |

The state property, getter and mutation all get their names from the instruction key or the `state_name`, `getter_name`
& `mutation_name` instruction options respectively.

The example below shows the config options necessary to add a suffix and prefix to the state property and convert the
name to uppercase; set the getter prefix as 'getter'; remove the mutation prefix and add a 'mutation' suffix.

```javascript
import ModuleMaker from "vuex-module-maker";

const config = {
    // ...
    naming: {
        state: {
            prefix: 'state_',
            suffix: '_prop',
            transformer: raw => raw.toUpperCase();,
        },
        getter: {
            prefix: 'getter_'
        },
        mutation: {
            prefix: '',
            suffix: ' mutation'
        }
    },
};

const template = {
    instruction: {
        active: 'boolean',
        id: {
            type: 'number',
            state_name: 'user_id',
        },
    },
};

const Maker = new ModuleMaker(config);
const module = Maker.make(template);

module === {
    // ...
    state() {
        return {
            STATE_ACTIVE_PROP: false,
            STATE_USER_ID_PROP: null,
        }
    },
    getters: {
        getterActive: ...,
        getterId: ...
    },
    mutations: {
        activeMutation: ...,
        idMutation: ...
    },
    // ...
};
```

### Config - `types`

The `types` config is broken down into 4 parts – `initial_value, default_value, getter & mutation`. When an instruction
is being processed each of the parts are processed individually; if the given type does not exist the default is used,
if the type exists but does not have the that specific part defined, the default is used.

All pre-configured [types](#available-types) use the default getter.

```javascript
const default_getter = (state) => {
   return (state[state_name] == null) ? default_value : state[state_name];
}

const default_mutation = (state, value = undefined) => {
     state[state_name] = (value == null) ? null : value;
}
```

If you would like to change/create a type you can pass a type-config into the `types` config object, if you would like to
change the default you can pass the type-config under the type name `default`.

The example below shows how to create a new type, the same process can be used to edit any of the existing types or
default.

###### Example – Creating a `form` Type

We will be using the [vform](https://github.com/cretueusebiu/vform) package as an example, the package provides us with
a form object that is extremely helpful with handling [laravel](https://laravel.com/docs/7.x) form errors.

1. We would like the type to be assignable to state properties with the type 'form', and we want a new form to be
returned if the state property is `null` – `config.types.form.default_value = new Form`.
2. The current default function already returns the default value if the `state_property === null` so we do not need to
add a getter config for our `form` type – If a type does not have a specified getter, the default getter is used.
However, an example has been provided to show the wrapping function. Every config getter should be returned by a
function that accepts the `state_name & default_value`. The getter will be re-used, so we need a way of passing the
variables to the getter.
3. For the mutation we want to accept both the `Form` class and an `object` that we can use in the construction of the
form but if the value is `null` or `undefined` we would like to set the state prop to `null`. The default mutation does
not provide this kind of functionality, so we need to define a custom mutation. Similar to the getter, we need to wrap
the mutation in a function that will make `state_name` available to the mutation.

```javascript
import Form from "vform";
import Maker from "vuex-module-maker";

const config = {
    types: {
        form: {
            // No need to define the initial_value as the default is already null but can be added for certainty
            initial_value: null,

            default_value: new Form(),

            // Because the getter will be used over many instances
            // The function should accept the state_name and default_value
            // This wrapping function is not needed when defining getters in instructions
            getter: (state_name, default_value) => {
                // If a type does not have a specific getter function the default is used
                // This getter is identical to the default getter so its definition is redundant
                return state => (state[state_name] == null) ? default_value : state[state_name];
            },

            // The default_value is never used so we do not need to pass it
            mutation: (state_name) => {
                return (state, value = undefined) => {
                    if (value == null) {
                        state[state_name] = null;
                    } else if (value instanceof Form) { // Objects are technically functions
                        state[state_name] = value;
                    } else {
                        state[state_name] = new Form(value);
                    }
                };
            },
        },
    },
};

const maker = new Maker(config);

const module = maker.make({
    instruction: {
        login_Form: 'form',
    },
});

// After registering the module
store.getters.getLoginForm === new Form(); // true
```


### Typescript

The make methods take 2 type properties – final Module interface and types.
If you would like to use/append the default types you can import the `DefaultTypes` type.

```typescript
import ModuleMaker, { DefaultTypes, Template } from "vuex-module-maker";

interface UserState {
    id: number|null,
    name: string|null,
}

interface RootState {
    user: UserState
}

interface UserModule {
    namespaced: true,
    state(): UserState,
    getters: {
        getId(state: UserState, getters?: any, rootState?: RootState, rootGetters?: any): number|null,
        getName(state: UserState, getters?: any, rootState?: RootState, rootGetters?: any): string,
    },
    mutations: {
        setId(state: UserState, payload?: number): void,
        setName(state: UserState, payload?: string): void,
    },
}

const template: Template<DefaultTypes> = {
    instructions: {
        id: "number",
        name: "string",
    },
}

const module = ModuleMaker.Make<UserModule, DefaultTypes>(template);
```

If you would like type hinting you may import the following types:

type: 'string' | 'number' | 'boolean' | 'array' | 'date' | 'object',

| Object           | Type                                           |
| ---------------- | ---------------------------------------------- |
| Config           | `CustomConfig<State, RootState>`               |
| ConfigGetter     | `ConfigGetter<State, RootState>`               |
| ConfigMutation   | `ConfigMutation<State>`                        |
| Template         | `Template<STypes>`                             |
| Instructions     | `Instructions<Types>`                          |
| StringGetter     | `StringGetter<State, RootState>`               |
| NumberGetter     | `NumberGetter<State, RootState>`               |
| BooleanGetter    | `BooleanGetter<State, RootState>`              |
| ArrayGetter      | `ArrayGetter<State, RootState>`                |
| DateGetter       | `DateGetter<State, RootState>`                 |
| ObjectGetter     | `ObjectGetter<State, RootState>`               |
| StringMutation   | `StringMutation<State>`                        |
| NumberMutation   | `NumberMutation<State>`                        |
| BooleanMutation  | `BooleanMutation<State>`                       |
| ArrayMutation    | `ArrayMutation<State>`                         |
| DateMutation     | `DateMutation<State>`                          |
| ObjectMutation   | `ObjectMutation<State>`                        |
