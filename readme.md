# Vuex Module Maker

# Installation

# Usage

### Namespaced
Because the generated module is designed to be a reusable one the namespace is set to `true` by
default. If you would like to set the namespaced property to `false` *(not recommended)* you may
do so during the creation of the ModuleMaker instance. You can learn more about namespaced modules
from the [vuex guide](https://vuex.vuejs.org/guide/modules.html#namespacing).
```javascript
import ModuleMaker from 'vuex-module-maker';

const maker = ModuleMaker(false);
const module = maker.make({}); // module.namespaced === false
```

### State

Inline with the vuex instructions on creating reusable modules, the state is a callback that
returns the module's state object, similar to how we define the state in the vue components.
You can read more about it in the
[vuex guide](https://vuex.vuejs.org/guide/modules.html#module-reuse).

When the state property is created from an [instruction](#instructions), the name is extracted
from the instruction's key and converted to snake case. The name can be controlled by passing a
`state_name` option with the desired name, the passed value is not altered in any way.
```javascript
const instructions = {
    id: 'number',
    userActive: 'boolean', 
    name: {
        type: 'string',
        state_name: 'userName'
    }
};

const resulting_module = {
    // ...
    state() {
        return {
            id: null, // No adjustments to the name
            user_active: null, // Converted to snake case
            userName: null // Specified state name
        }
    }
    // ...
};
```
If the state property is created from the template's state property, the name will be identical to
the key of the defined property.

The initial value is set to `null` by default but it can also be controlled by passing an
`initial_value` option whose value will be used as the initial value.

If the state property is created from the template's state property, the property's value will be
set as the initial value.

```javascript
const instructions = {
    id: 'number',
    name: {
        type: 'string',
        initial_value: 'John Doe'
    }
};

const resulting_module = {
    // ...
    state() {
        return {
            id: null, // Default null value used
            name: 'John Doe' // Set initial value to specified value
        }
    }
    // ...
};
```

### Getters

The getter names are created from the instructions's key or the `state name` option if supplied. The names are
converted to camel case and prefixed with 'get'. The getter name can be overwritten by passing a `getter_name` option,
the passed option is not manipulated at all.

```javascript
const instructions = {
    id: 'number',
    name: {
        type: 'string',
        state_name: 'user_name'
    },
    comments: {
        type: 'array',
        state_name: 'user_comments',
        getter_name: 'comments'
    }
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
        getUserName: (state) => {
            return state.user_name === null ? '' : state.user_name;
        },

        // instruction key and state_name ignored
        // provided getter_name option used as is
        comments: (state) => {
            return state.user_comments === null ? [] : state.user_comments;
        }
    },
    //...
};
```

The generated getters follow the same pattern – if the state property is equal to null return the default value
otherwise return the state property. No other checks are done because the we assume that all state manipulations are
done through their respective mutations – the value is either valid or null.

The default value that is returned is dependent on the type set in the instruction, and can also be manually set using
the `default_value` option where that value will be returned without any alterations if the state value is `null`.
 
 The object below shows the types and their corresponding default values.
 ```javascript
const default_value_map = {
    string: '',
    number: null,
    boolean: false,
    array: [],
    object: null,
    form: new Form,
    any: null
};
```

Any getters passed through the template's getters object are added as is, no alterations are made.

### Mutations

The names assigned to generated mutations follow a similar pattern to the [getters](#getters), with the only difference
being we prefix the mutations with 'set' instead of 'get' and we use the `mutation_name` instead of the `getter_name`.

```javascript
const instructions = {
    id: 'number',
    name: {
        type: 'string',
        state_name: 'user_name'
    },
    comments: {
        type: 'array',
        state_name: 'user_comments',
        mutation_name: 'comments'
    }
};

const generated_module = {
    //...
    mutations: {
        // instruction key used
        // id prefixed with 'set' and converted to camel case
        setId(state, value = undefined) {
            state.id = value == null ? null : value;
        },
        
        // instruction key ignored
        // the provided state_name used to generate the mutation name
        // state_name prefixed with set and converted to camel case
        setUserName(state, value = undefined) {
            if (value == null || value.length === 0) {
                state.user_name = null
            } else {
                state.user_name = value
            }
        },

        // instruction key and state_name ignored
        // provided mutation_name option used as is
        comments(state) {
            if (value == null || value.length === 0) {
                state.user_comments = null
            } else {
                state.user_comments = value
            }
        }
    },
    //...
};
```

### Actions & Modules

### Precedence & Gotchas

- State properties are assigned in order of assignment in the instructions object, if two
instructions have the same state name the last called instruction will be assigned to the module
state.
- The state properties defined in the template's state property take precedence over
instructions.

Note that this does not extend to other parts of the module – if a state property is overwritten
the getter/mutation will remain as is unless they are overwritten by a later instruction with
the same getter/mutation name.

### Types

## Typescript

### Useful Type Declarations
