## Packages
framer-motion | Smooth animations and premium page transitions
react-dropzone | Robust drag-and-drop file upload for images
lucide-react | Icons (already in stack but confirming usage)

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}

The API endpoints expect `image` as a base64 encoded string.
The audio generation might take time, UI implements a robust loading state.
