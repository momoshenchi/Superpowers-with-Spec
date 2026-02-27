/**
 * Command Reference Utilities
 *
 * Utilities for transforming command references to tool-specific formats.
 */

/**
 * Transforms colon-based command references to hyphen-based format.
 * Converts `/sp:` patterns to `/sp-` for tools that use hyphen syntax.
 *
 * @param text - The text containing command references
 * @returns Text with command references transformed to hyphen format
 *
 * @example
 * transformToHyphenCommands('/sp:new') // returns '/sp-new'
 * transformToHyphenCommands('Use /sp:apply to implement') // returns 'Use /sp-apply to implement'
 */
export function transformToHyphenCommands(text: string): string {
  return text.replace(/\/sp:/g, '/sp-');
}
