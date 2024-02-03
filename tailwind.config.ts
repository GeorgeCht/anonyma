import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        offwhite: 'rgb(var(--color-offwhite) / <alpha-value>)',
        light: 'rgb(var(--color-light) / <alpha-value>)',
        dark: 'rgb(var(--color-dark) / <alpha-value>)',
        gray: 'rgb(var(--color-gray) / <alpha-value>)',
        offgray: 'rgb(var(--color-offgray) / <alpha-value>)',
        'accent-primary': 'rgb(var(--color-accent-primary) / <alpha-value>)',
        'accent-secondary':
          'rgb(var(--color-accent-secondary) / <alpha-value>)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      boxShadow: {
        badge: '0 0 2px 1px rgb(var(--color-dark) / 0.75)',
      },
      dropShadow: {
        'indicator-green': '0px 0px 6px rgba(80, 200, 100, 0.99)',
      },
      width: {
        prefered: 'var(--view-modifier)',
      },
      maxWidth: {
        prefered: 'var(--view-modifier)',
      },
      minHeight: {
        // @ts-expect-error
        layout: ['calc(100vh - 70px)', 'calc(100dvh - 70px)'],
        // @ts-expect-error
        inner: ['calc(100vh - 142px)', 'calc(100dvh - 142px)'],
      },
      content: {
        empty: "''",
      },
      lineHeight: {
        base: '1',
      },
      letterSpacing: {
        tightest: '-.04em',
        tighter: '-.02em',
        tight: '-.01em',
        base: '0',
        wide: '.015em',
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          {
            fontFeatureSettings: '"ss05", "ss04"',
            fontVariationSettings: '"shea" 420',
          },
        ],
        mono: ['var(--font-mono)'],
      },
      fontWeight: {
        'neue-light': '430',
        'neue-normal': '500',
        'neue-medium': '666',
        'neue-bold': '833',
      },
      borderRadius: {
        '2xl': '18px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      transitionProperty: {
        button:
          'transform, color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      keyframes: {
        'delay-animation': {
          from: { opacity: '1' },
          to: { opacity: '1' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'logo-shine': 'pulse 2.175s ease-out infinite',
        'delay-animation': 'delay-animation 3.275s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
