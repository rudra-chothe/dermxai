/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // DermX-AI custom colors
        dermx: {
          teal: "#14b8a6",
          purple: "#8b5cf6",
          lavender: "#c084fc",
          "soft-purple": "#f3e8ff",
          "soft-blue": "#dbeafe",
          "glow-blue": "#00d4ff",
          "glow-purple": "#a855f7",
          soft: {
            white: "#f8f9fa",
            green: "#F2FCE2",
            yellow: "#FEF7CD",
            orange: "#FEC6A1",
            purple: "#E5DEFF",
            pink: "#FFDEE2",
            peach: "#FDE1D3",
            blue: "#D3E4FD",
            gray: "#F1F0FB",
          },
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // Enhanced navbar and home page animations
        "fade-in-up": {
          from: {
            opacity: "0",
            transform: "translateY(40px) scale(0.95)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        "float-slow": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg) scale(1)",
          },
          "33%": {
            transform: "translateY(-15px) rotate(1deg) scale(1.02)",
          },
          "66%": {
            transform: "translateY(-25px) rotate(-1deg) scale(0.98)",
          },
        },
        "float-reverse": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg) scale(1)",
          },
          "33%": {
            transform: "translateY(20px) rotate(-1.5deg) scale(1.03)",
          },
          "66%": {
            transform: "translateY(30px) rotate(1deg) scale(0.97)",
          },
        },
        "float-fast": {
          "0%, 100%": {
            transform: "translateY(0px) scale(1) rotate(0deg)",
          },
          "25%": {
            transform: "translateY(-10px) scale(1.05) rotate(0.5deg)",
          },
          "75%": {
            transform: "translateY(-20px) scale(0.95) rotate(-0.5deg)",
          },
        },
        "iphone-glass-shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        "iphone-glass-pulse": {
          "0%, 100%": {
            backdropFilter: "blur(25px) saturate(1.8) brightness(1.1)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.12), 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 -1px 0 rgba(0, 0, 0, 0.05) inset, 0 0 0 1px rgba(255, 255, 255, 0.1)",
          },
          "50%": {
            backdropFilter: "blur(30px) saturate(2.0) brightness(1.15)",
            boxShadow:
              "0 12px 40px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 -1px 0 rgba(0, 0, 0, 0.08) inset, 0 0 0 1px rgba(255, 255, 255, 0.15)",
          },
        },
        "iphone-glass-float": {
          "0%, 100%": {
            transform: "translateY(0px) scale(1)",
          },
          "50%": {
            transform: "translateY(-2px) scale(1.001)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Enhanced navbar and home page animations
        "fade-in-up":
          "fade-in-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "float-reverse": "float-reverse 10s ease-in-out infinite",
        "float-fast": "float-fast 5s ease-in-out infinite",
        "iphone-glass-shimmer": "iphone-glass-shimmer 3s ease-in-out infinite",
        "iphone-glass-pulse": "iphone-glass-pulse 4s ease-in-out infinite",
        "iphone-glass-float": "iphone-glass-float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
