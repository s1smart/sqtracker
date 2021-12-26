import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { Menu } from '@styled-icons/boxicons-regular/Menu'
import { Sun } from '@styled-icons/boxicons-regular/Sun'
import { Moon } from '@styled-icons/boxicons-regular/Moon'
import Navigation from '../components/Navigation'
import Box from '../components/Box'
import Button from '../components/Button'
import Input from '../components/Input'

const getThemeColours = (theme) => {
  switch (theme) {
    case 'light':
      return {
        primary: '#f45d48',
        background: '#ffffff',
        sidebar: '#f8f8f8',
        text: '#202224',
        grey: '#aaa',
        error: '#f33',
        border: '#deebf1',
      }
    case 'dark':
      return {
        primary: '#f45d48',
        background: '#1f2023',
        sidebar: '#27282b',
        text: '#f8f8f8',
        grey: '#aaa',
        error: '#f33',
        border: '#303236',
      }
  }
}

const baseTheme = {
  breakpoints: ['768px', '1400px'],
  space: [0, 2, 4, 8, 16, 32, 64, 128, 256],
  sizes: {
    body: '1000px',
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: '"Source Code Pro", Courier, monospace',
  },
  fontSizes: [12, 14, 16, 20, 24, 36, 48, 60, 80, 96],
  fontWeights: {
    heading: 700,
    body: 400,
  },
  lineHeights: {
    heading: 1.2,
    body: 1.4,
  },
  radii: [2, 4, 8],
  shadows: {
    edge: '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
  },
}

const GlobalStyle = createGlobalStyle(
  ({ theme: { breakpoints, fonts, colors, lineHeights, sizes, space } }) => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background: ${colors.background};
  }
  #__next {
    color: ${colors.text};
    font-family: ${fonts.body};
    line-height: ${lineHeights.body};
  }
  #__next main {
    min-height: calc(100vh - 109px);
    max-width: ${sizes.body};
    padding: ${space[4]}px;
  }
  @media screen and (min-width: ${breakpoints[0]}) {
    #__next main {
      margin-left: max(calc((100vw - ${sizes.body}) / 2), 200px);
      padding: ${space[5]}px;
    }
  }
  a, a:visited {
    color: ${colors.primary};
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`
)

const SqTracker = ({ Component, pageProps }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    setIsMobile(query.matches)
    query.addEventListener('change', ({ matches }) => {
      setIsMobile(matches)
    })
  }, [])

  const appTheme = { ...baseTheme, colors: getThemeColours(theme) }

  return (
    <>
      <Head>
        <title>sqtracker</title>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Source+Code+Pro:wght@400;500;700&display=swap"
        />
      </Head>
      <ThemeProvider theme={appTheme}>
        <GlobalStyle />
        <Navigation
          isMobile={isMobile}
          menuIsOpen={menuIsOpen}
          setMenuIsOpen={setMenuIsOpen}
        />
        <Box
          width="100%"
          height="60px"
          borderBottom="1px solid"
          borderColor="border"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent={['space-between', 'flex-end']}
            maxWidth="body"
            height="60px"
            ml={[0, `max(calc((100vw - ${appTheme.sizes.body}) / 2), 200px)`]}
            px={[4, 5]}
          >
            <Button
              onClick={() => setMenuIsOpen(true)}
              display={['block', 'none']}
              px={1}
              py={1}
            >
              <Menu size={24} />
            </Button>
            <Box display="flex">
              <Input placeholder="Search" maxWidth="300px" ml={4} />
              <Button
                variant="secondary"
                onClick={() =>
                  setTheme((t) => (t === 'light' ? 'dark' : 'light'))
                }
                px={3}
                ml={3}
              >
                {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
              </Button>
            </Box>
          </Box>
        </Box>
        <main>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </>
  )
}

export default SqTracker