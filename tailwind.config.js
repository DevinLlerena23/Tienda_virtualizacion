/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: '#3B82F6',
  				foreground: '#FFFFFF',
  				50: '#EFF6FF',
  				100: '#DBEAFE',
  				200: '#BFDBFE',
  				300: '#93C5FD',
  				400: '#60A5FA',
  				500: '#3B82F6',
  				600: '#2563EB',
  				700: '#1D4ED8',
  				800: '#1E40AF',
  				900: '#1E3A8A'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: '#10B981',
  				foreground: '#FFFFFF',
  				50: '#ECFDF5',
  				100: '#D1FAE5',
  				200: '#A7F3D0',
  				300: '#6EE7B7',
  				400: '#34D399',
  				500: '#10B981',
  				600: '#059669',
  				700: '#047857',
  				800: '#065F46',
  				900: '#064E3B'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: '#F59E0B',
  				foreground: '#FFFFFF',
  				50: '#FFFBEB',
  				100: '#FEF3C7',
  				200: '#FDE68A',
  				300: '#FCD34D',
  				400: '#FBBF24',
  				500: '#F59E0B',
  				600: '#D97706',
  				700: '#B45309',
  				800: '#92400E',
  				900: '#78350F'
  			},
  			destructive: {
  				DEFAULT: '#EF4444',
  				foreground: '#FFFFFF',
  				50: '#FEF2F2',
  				100: '#FEE2E2',
  				200: '#FECACA',
  				300: '#FCA5A5',
  				400: '#F87171',
  				500: '#EF4444',
  				600: '#DC2626',
  				700: '#B91C1C',
  				800: '#991B1B',
  				900: '#7F1D1D'
  			},
  			success: {
  				DEFAULT: '#22C55E',
  				foreground: '#FFFFFF'
  			},
  			warning: {
  				DEFAULT: '#F59E0B',
  				foreground: '#FFFFFF'
  			},
  			info: {
  				DEFAULT: '#3B82F6',
  				foreground: '#FFFFFF'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			'gradient-xy': 'gradient-xy 3s ease infinite',
  		},
  		keyframes: {
  			'gradient-xy': {
  				'0%, 100%': {
  					'background-size': '400% 400%',
  					'background-position': 'left center'
  				},
  				'50%': {
  					'background-size': '200% 200%',
  					'background-position': 'right center'
  				}
  			},
  			neon: {
  				'0%, 100%': {
  					borderColor: '#ff0000',
  					boxShadow: '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000'
  				},
  				'25%': {
  					borderColor: '#00ff00',
  					boxShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00'
  				},
  				'50%': {
  					borderColor: '#0000ff',
  					boxShadow: '0 0 10px #0000ff, 0 0 20px #0000ff, 0 0 30px #0000ff'
  				},
  				'75%': {
  					borderColor: '#ff00ff',
  					boxShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff'
  				}
  			}
  		}
  	}
  },
  plugins: [],
};
