import { useNavigate, useLocation } from 'react-router-dom';
// routes
import React from 'react';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
// import { db } from "./firebase";
import { auth } from './firebase';

// ----------------------------------------------------------------------

export default function App() {
  const [user, setUser] = React.useState({})
  const navigate = useNavigate()
  const location = useLocation()

  React.useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) setUser(user)
      else setUser(null)
    })
  }, [])

  React.useEffect(() => {
    const isLoginPage = location.pathname === '/login' || location.pathname === '/register'

    if(!user && !isLoginPage) navigate('/login')

    if(user && isLoginPage) navigate('/dashboard/app')
  }, [location])

  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
