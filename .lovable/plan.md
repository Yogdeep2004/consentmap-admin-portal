

# Plan: Dark Blue Sidebar Background

## Overview

This is a pure styling update to change the sidebar background to a professional dark blue color while ensuring text and icons remain readable.

## Change Summary

**Single file to modify:** `src/index.css`

Update the sidebar CSS custom properties in the `:root` (light mode) section to use dark blue instead of white.

## Specific Changes

In `src/index.css`, update lines 39-46 (the sidebar variables in `:root`):

| Variable | Current Value | New Value |
|----------|---------------|-----------|
| `--sidebar-background` | `0 0% 100%` (white) | `220 60% 20%` (dark blue) |
| `--sidebar-foreground` | `220 9% 46%` (gray) | `210 40% 96%` (light gray/white) |
| `--sidebar-accent` | `220 14% 96%` (light gray) | `220 60% 28%` (slightly lighter blue) |
| `--sidebar-accent-foreground` | `220 13% 18%` (dark) | `210 40% 96%` (light) |
| `--sidebar-border` | `220 13% 91%` (light gray) | `220 60% 30%` (darker blue border) |

## What This Achieves

- **Background**: Changes from white to a professional dark navy blue
- **Text/Icons**: Light colored for readability against dark background
- **Hover states**: Slightly lighter blue for contrast
- **Borders**: Subtle darker blue for visual separation

## What Stays the Same

- All sidebar structure, spacing, and layout
- All navigation items, icons, and their order
- All functionality (navigation, logout, collapse/expand)
- All other pages, forms, tables, and components
- All authentication/authorization logic
- All matching/non-matching logic and data handling

## Technical Notes

- The change uses HSL values (Hue, Saturation, Lightness) which is the format already used in the project
- The dark mode sidebar variables (lines 86-93) will remain unchanged as they already have dark styling
- This approach leverages the existing CSS variable system, requiring minimal changes

