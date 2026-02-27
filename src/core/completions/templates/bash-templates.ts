/**
 * Static template strings for Bash completion scripts.
 * These are Bash-specific helper functions that never change.
 */

export const BASH_DYNAMIC_HELPERS = `# Dynamic completion helpers

_superpowers_complete_changes() {
  local changes
  changes=$(superpowers __complete changes 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$changes" -- "$cur"))
}

_superpowers_complete_specs() {
  local specs
  specs=$(superpowers __complete specs 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$specs" -- "$cur"))
}

_superpowers_complete_items() {
  local items
  items=$(superpowers __complete changes 2>/dev/null | cut -f1; superpowers __complete specs 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$items" -- "$cur"))
}`;
