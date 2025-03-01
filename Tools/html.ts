/**
 * This is the HTML Module File.  
 * @module
 */

/**
 * The HTML function, which uses (a backtick function?) to create HTML.
 */
// deno-lint-ignore no-explicit-any
const html = (...args: any[]): string=> {
    return args.join("") as string;
}

export default html;