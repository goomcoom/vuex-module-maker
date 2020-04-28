/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * String Helpers
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 */

export function lastChar(str: string, num = 1): string
{
    if (num > str.length) num = str.length;
    return str.slice((str.length - num))
}

export function toLowerCaseFirst(subject: string): string
{
    return `${subject.charAt(0).toLowerCase()}${subject.slice(1)}`
}

export function toUpperCaseFirst(subject: string): string
{
    return `${subject.charAt(0).toUpperCase()}${subject.slice(1)}`
}

/**
 * Uppercase all first letters of a string.
 *
 * If not separators are specified all the first character after the following will be transformed:
 * "\s", "-", "_", "/", "\", "\n", "\t"
 */
export function toUpperCaseFirstAll(string: string, ...separators: string[]): string
{
    if (!separators.length) separators = [' ', '-', '_', '/', '\\', '\n', '\t'];

    separators.forEach(separator => {
        string = string.split(separator).map(word => {
            return toUpperCaseFirst(word)
        }).join(separator)
    });

    return string
}

/**
 * Convert a string to pascal case.
 *
 * If not separators are specified all the first character after the following will be transformed:
 * "\s", "-", "_", "/", "\", "\n", "\t" and the separators will be removed
 */
export function toPascalCase(string: string, ...separators: string[]): string
{
    if (!separators.length) separators = [' ', '-', '_', '/', '\\'];

    string = toUpperCaseFirstAll(string, ...separators);

    separators.forEach(separator => {
        if (separator === '\\') separator = '\\\\';
        const regEx = new RegExp(separator, 'g');
        string = string.replace(regEx, '')
    });

    return string
}

/**
 * Convert a string to pascal case.
 *
 * If not separators are specified all the first character after the following will be transformed:
 * "\s", "-", "_", "/", "\", "\n", "\t" and the separators will be removed
 */
export function toCamelCase(string: string, ...separators: string[]): string
{
    return toLowerCaseFirst(toPascalCase(string, ...separators))
}

/**
 * Convert a string to snake case.
 *
 * If not separators are specified all the first character after the following will be transformed:
 * "\s", "-", "_", "/", "\", "\n", "\t" and the separators will be removed
 */
export function toSnakeCase(string: string, ...separators: string[]): string
{
    if (!separators.length) separators = [' ', '-', '/', '\\'];

    separators.forEach(separator => {
        if (separator === '\\') separator = '\\\\';
        const regEx = new RegExp(separator, 'g');
        string = string.replace(regEx, '_');
    });

    string = string.replace(/\.?([A-Z])/g, (x,y) => `_${y.toLowerCase()}`);
    return string.replace(/^_/, "").replace(/(_)+/g, '_');
}

/**
 * Convert a string to snake case.
 *
 * If not separators are specified all the first character after the following will be transformed:
 * "\s", "-", "_", "/", "\", "\n", "\t" and the separators will be removed
 */
export function toKebabCase(string: string, ...separators: string[]): string
{
    if (!separators.length) separators = [' ', '_', '/', '\\'];

    separators.forEach(separator => {
        if (separator === '\\') separator = '\\\\';
        const regEx = new RegExp(separator, 'g');
        string = string.replace(regEx, '-');
    });

    string = string.replace(/\.?([A-Z])/g, (x,y) => `-${y.toLowerCase()}`);
    return string.replace(/^-/, "").replace(/(-)+/g, '-');
}
