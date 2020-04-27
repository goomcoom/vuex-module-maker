import {
    lastChar,
    toLowerCaseFirst,
    toUpperCaseFirst,
    toUpperCaseFirstAll,
    toPascalCase,
    toCamelCase,
    toSnakeCase,
    toKebabCase
} from '~/helpers'

describe('helpers@lastChar', () => {
    test('it returns the last character in a string', () => {
        expect(lastChar('abc')).toEqual('c')
    });

    test('it keeps the case of the letter the same', () => {
        expect(lastChar('abcD')).toEqual('D')
    });

    test('it can return a specified number of characters', () => {
        expect(lastChar('abc')).toEqual('c');
        expect(lastChar('abc', 2)).toEqual('bc');
        expect(lastChar('abc', 3)).toEqual('abc');
        expect(lastChar('abc', 20)).toEqual('abc')
    })
});

describe('helpers@toLowerCaseFirst', () => {
    test('it converts the first letter to lowercase', () => {
        expect(toLowerCaseFirst('Simon')).toEqual('simon')
    });

    test('it can convert a single letter string to lowercase', () => {
        expect(toLowerCaseFirst('S')).toEqual('s')
    });

    test('it does not alter the first letter if it is already lowercase', () => {
        expect(toLowerCaseFirst('s')).toEqual('s')
    });

    test('it does not alter the string if the first character is not a letter', () => {
        expect(toLowerCaseFirst('123S')).toEqual('123S')
    })
});

describe('helpers@toUpperCaseFirst', () => {
    test('it converts the first letter to uppercase', () => {
        expect(toUpperCaseFirst('simon')).toEqual('Simon')
    });

    test('it can convert a single letter string to uppercase', () => {
        expect(toUpperCaseFirst('s')).toEqual('S')
    });

    test('it does not alter the first letter if it is already uppercase', () => {
        expect(toUpperCaseFirst('S')).toEqual('S')
    });

    test('it does not alter the string if the first character is not a letter', () => {
        expect(toUpperCaseFirst('123s')).toEqual('123s')
    })
});

describe('helpers@toUpperCaseFirstAll', () => {
    test('it converts all the first characters of words in a string to uppercase', () => {
        expect(toUpperCaseFirstAll('test string')).toEqual('Test String')
    });

    test('it selects the first characters after a "-"', () => {
        expect(toUpperCaseFirstAll('test-string')).toEqual('Test-String')
    });

    test('it selects the first characters after a "_"', () => {
        expect(toUpperCaseFirstAll('test_string')).toEqual('Test_String')
    });

    test('it selects the first characters after a "/"', () => {
        expect(toUpperCaseFirstAll('test/string')).toEqual('Test/String')
    });

    test('it selects the first characters after a "\\"', () => {
        expect(toUpperCaseFirstAll('test\\string')).toEqual('Test\\String')
    });

    test('it selects the first characters after a "\\n"', () => {
        expect(toUpperCaseFirstAll('test\nstring')).toEqual('Test\nString')
    });

    test('it selects the first characters after a "\\t"', () => {
        expect(toUpperCaseFirstAll('test\tstring')).toEqual('Test\tString')
    });

    test('it only uses the specified separators if any are provided', () => {
        expect(toUpperCaseFirstAll('another test-string', ' ')).toEqual('Another Test-string');
        expect(toUpperCaseFirstAll('and another_test-string', '-', '_')).toEqual('And another_Test-String')
    })
});

describe('helpers@toPascalCase', () => {
    test('it converts a string with words separated by " "', () => {
        expect(toPascalCase('this is a test string')).toEqual('ThisIsATestString')
    });

    test('it converts a string with words separated by "-"', () => {
        expect(toPascalCase('this-is-a-test-string')).toEqual('ThisIsATestString')
    });

    test('it converts a string with words separated by "_"', () => {
        expect(toPascalCase('this_is_a_test_string')).toEqual('ThisIsATestString')
    });

    test('it converts a string with words separated by "/"', () => {
        expect(toPascalCase('this/is/a/test/string')).toEqual('ThisIsATestString')
    });

    test('it converts a string with words separated by "\\"', () => {
        expect(toPascalCase('this\\is\\a\\test\\string')).toEqual('ThisIsATestString')
    });

    test('it only uses the specified separators if any are provided', () => {
        expect(toPascalCase('another test-string', ' ')).toEqual('AnotherTest-string');
        expect(toPascalCase('and another_test-string', '-', '_')).toEqual('And anotherTestString')
    })
});

describe('helpers@toCamelCase', () => {
    test('it converts a string with words separated by " "', () => {
        expect(toCamelCase('this is a test string')).toEqual('thisIsATestString')
    });

    test('it converts a string with words separated by "-"', () => {
        expect(toCamelCase('this-is-a-test-string')).toEqual('thisIsATestString')
    });

    test('it converts a string with words separated by "_"', () => {
        expect(toCamelCase('this_is_a_test_string')).toEqual('thisIsATestString')
    });

    test('it converts a string with words separated by "/"', () => {
        expect(toCamelCase('this/is/a/test/string')).toEqual('thisIsATestString')
    });

    test('it converts a string with words separated by "\\"', () => {
        expect(toCamelCase('this\\is\\a\\test\\string')).toEqual('thisIsATestString')
    });

    test('it only uses the specified separators if any are provided', () => {
        expect(toCamelCase('another test-string', ' ')).toEqual('anotherTest-string');
        expect(toCamelCase('and another_test-string', '-', '_')).toEqual('and anotherTestString')
    })
});

describe('helpers@toSnakeCase', () => {
    test('it converts a string with words separated by " "', () => {
        expect(toSnakeCase('this is a test string')).toEqual('this_is_a_test_string')
    });

    test('it converts a string with words separated by "-"', () => {
        expect(toSnakeCase('this-is-a-test-string')).toEqual('this_is_a_test_string')
    });

    test('it converts a string with words separated by "/"', () => {
        expect(toSnakeCase('this/is/a/test/string')).toEqual('this_is_a_test_string')
    });

    test('it converts a string with words separated by "\\"', () => {
        expect(toSnakeCase('this\\is\\a\\test\\string')).toEqual('this_is_a_test_string')
    });

    test('it only uses the specified separators if any are provided', () => {
        expect(toSnakeCase('another test-string', ' ')).toEqual('another_test-string');
        expect(toSnakeCase('and another/test-string', '-', '/')).toEqual('and another_test_string')
    });

    test('Converts pascal case to snake case', () => {
        expect(toSnakeCase('SnakeCase')).toEqual('snake_case');
    });
});

describe('helpers@toKebabCase', () => {
    test('it converts a string with words separated by " "', () => {
        expect(toKebabCase('this is a test string')).toEqual('this-is-a-test-string')
    });

    test('it converts a string with words separated by "-"', () => {
        expect(toKebabCase('this-is-a-test-string')).toEqual('this-is-a-test-string')
    });

    test('it converts a string with words separated by "/"', () => {
        expect(toKebabCase('this/is/a/test/string')).toEqual('this-is-a-test-string')
    });

    test('it converts a string with words separated by "\\"', () => {
        expect(toKebabCase('this\\is\\a\\test\\string')).toEqual('this-is-a-test-string')
    });

    test('it only uses the specified separators if any are provided', () => {
        expect(toKebabCase('another test_string', ' ')).toEqual('another-test_string');
        expect(toKebabCase('and another/test_string', '_', '/')).toEqual('and another-test-string')
    });

    test('Converts pascal case to kebab case', () => {
        expect(toKebabCase('KebabCase')).toEqual('kebab-case');
    });
});
