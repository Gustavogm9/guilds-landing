import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1.5rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sora': ['Sora', 'sans-serif'],
				'manrope': ['Manrope', 'sans-serif'],
				'inter': ['Inter', 'sans-serif'],
				'jetbrains': ['JetBrains Mono', 'monospace'],
			},
			colors: {
				// Brand Colors
				brand: {
					DEFAULT: 'hsl(var(--brand-primary))',
					primary: 'hsl(var(--brand-primary))',
					accent: 'hsl(var(--brand-accent))',
				},
				
				// Accent Colors  
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				
				// Neutral Scale
				neutral: {
					50: 'hsl(var(--neutral-50))',
					100: 'hsl(var(--neutral-100))',
					200: 'hsl(var(--neutral-200))',
					300: 'hsl(var(--neutral-300))',
					400: 'hsl(var(--neutral-400))',
					500: 'hsl(var(--neutral-500))',
					600: 'hsl(var(--neutral-600))',
					700: 'hsl(var(--neutral-700))',
					800: 'hsl(var(--neutral-800))',
					900: 'hsl(var(--neutral-900))',
				},
				
				// Semantic Colors
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
				danger: 'hsl(var(--danger))',
				
				// System Colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			spacing: {
				'guild-1': '4px',
				'guild-2': '8px',
				'guild-3': '12px',
				'guild-4': '16px',
				'guild-6': '24px',
				'guild-8': '32px',
				'guild-12': '48px',
				'guild-16': '64px',
				'guild-24': '96px',
			},
			borderRadius: {
				'guild': '12px',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			maxWidth: {
				'guild': '1320px',
			},
			boxShadow: {
				'guild': 'var(--shadow-guild)',
				'guild-glow': 'var(--shadow-glow)',
				'forge': 'var(--shadow-forge)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'glow': {
					'0%': { boxShadow: '0 0 20px hsl(var(--brand-primary) / 0.5)' },
					'100%': { boxShadow: '0 0 30px hsl(var(--brand-primary) / 0.8), 0 0 40px hsl(var(--brand-accent) / 0.3)' }
				},
				'forge': {
					'0%': { 
						transform: 'scale(1) rotate(0deg)',
						boxShadow: '0 0 20px hsl(var(--brand-accent) / 0.3)'
					},
					'50%': { 
						transform: 'scale(1.05) rotate(1deg)',
						boxShadow: '0 0 30px hsl(var(--brand-accent) / 0.6), 0 0 50px hsl(var(--brand-primary) / 0.2)'
					},
					'100%': { 
						transform: 'scale(1) rotate(0deg)',
						boxShadow: '0 0 20px hsl(var(--brand-accent) / 0.3)'
					}
				},
				'shield-pulse': {
					'0%, 100%': { 
						transform: 'scale(1)',
						filter: 'drop-shadow(0 0 10px hsl(var(--brand-primary) / 0.3))'
					},
					'50%': { 
						transform: 'scale(1.02)',
						filter: 'drop-shadow(0 0 20px hsl(var(--brand-primary) / 0.6))'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'forge': 'forge 3s ease-in-out infinite',
				'shield-pulse': 'shield-pulse 4s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
