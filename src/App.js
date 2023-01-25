import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
// import { db } from "./firebase";
import { auth, db } from './firebase';

// ----------------------------------------------------------------------

export default function App() {
  const [user, setUser] = React.useState({})
  const navigate = useNavigate()
  const location = useLocation()

  React.useEffect(() => {
    console.log(user)
  }, [user])

  React.useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) {
        setUser(user)
      }
      else {
        setUser(null)
        navigate('/login')
      }
    })
  }, [])

  React.useEffect(() => {
    const isLoginPage = location.pathname === '/login' || location.pathname === '/register'

    if(!user && !isLoginPage) navigate('/login')

    if(user && isLoginPage) navigate('/dashboard/app')
  }, [location])

  const fetchAcademyInfo = () => {
    const academyFetchRes = db.collection('')
  }

  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
