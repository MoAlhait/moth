# moth — drop-in instructions for Cursor

## what this is
moth is a standalone AI homework helper. paste any CS homework and it guides you through it line by line with pastel syntax highlighting, live feedback, and a reference panel.

## how to add it to your site

### step 1 — copy files
Drop these two files into your existing Next.js project:
- `public/moth.html` → goes in your project's `public/` folder
- `app/moth/page.tsx` → goes in your project's `app/` folder (creates the route `/moth`)

### step 2 — that's it
No npm installs. No config changes. The HTML file is fully self-contained.

Visit `yourdomain.com/moth` and it works.

## if you're on Pages Router instead of App Router
Replace `app/moth/page.tsx` with `pages/moth.tsx` and use this instead:

```tsx
export default function MothPage() {
  return (
    <iframe
      src="/moth.html"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        border: 'none', margin: 0, padding: 0,
        overflow: 'hidden', display: 'block', zIndex: 9999,
      }}
      title="moth — ai homework helper"
    />
  )
}
```

## if you want a nav link to moth on your main site
In your navbar component, add:
```tsx
<a href="/moth">moth</a>
```
Or with Next.js Link:
```tsx
<Link href="/moth">moth</Link>
```

## notes
- The app calls the Anthropic API directly from the browser. This works fine for personal use.
- If you want to hide your API key for production, route it through a Next.js API route at `/api/claude` and update the `API` constant in moth.html.
