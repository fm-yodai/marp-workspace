# Shared Assets

This directory is for assets used across multiple presentations.

## Company Logo

To add your company logo:

1. Place logo file here (e.g., `logo.png`)
2. Edit `../themes/company.css`
3. Add logo styling to the theme (example below)
4. Adjust size and position as needed

### Example CSS for Logo

Add to `company.css` in the `section` rule:

```css
section::before {
  content: '';
  background-image: url('../assets/logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 20px;
  right: 70px;
}
```

### Recommended Logo Specs

- **Format:** PNG with transparency
- **Size:** 200x200px or similar square ratio
- **File size:** < 100KB
- **Colors:** Match brand guidelines

## Other Shared Assets

Place any assets used across multiple decks here:
- Brand colors reference
- Icon sets
- Common diagrams
- Standard backgrounds
