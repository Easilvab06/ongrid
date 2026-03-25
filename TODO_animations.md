# Plan: Copy Panel9 animations to Panel4

## Changes needed in Panel4.vue:

1. **Icon Bubble**: Make always visible (remove opacity:0 and scale(0) from default state)
2. **Card hover**: Add `scale(1.02)` to transform
3. **Panel container**: Add `border: 1px solid #e9ecef`
4. **Expand transition**: Change max-height from 1000px to 2000px
5. **Header hover**: Add `transform: translateY(-2px)` effect
6. **Card default shadow**: Add `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);`
7. **Blob colors**: Match Panel9 colors
8. **Circle progress**: Add gradient like Panel9 (or keep solid for consistency with color scheme)
9. **Font**: Keep Montserrat (Panel4's theme)
