# Vuex Module Maker

The introduction goes here.

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
}

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
}
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
}

const resulting_module = {
    // ...
    state() {
        return {
            id: null, // Default null value used
            name: 'John Doe' // Set initial value to specified value
        }
    }
    // ...
}
```

###### State Precedence & Gotchas

- State properties are assigned in order of assignment in the instructions object, if two
instructions have the same state name the last called instruction will be assigned to the module
state.
- The state properties defined in the template's state property take precedence over
instructions.

Note that this does not extend to other parts of the module – if a state property is overwritten
the getter/mutation will remain as is unless they are overwritten by a later instruction with
the same getter/mutation name.


### Getters

###### Name

###### Default Value

### Mutations

###### Name

###### Accepted Values

### Actions & Modules

## Available Types

### Namespaced

### Template

### Instructions

### State

### Getters

###Mutations

### Actions

### Modules

## Typescript

### Useful Type Declarations
