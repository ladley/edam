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
    auth.onAuthStateChanged((userCredential) => {
      if(userCredential) {
        setUser(userCredential.multiFactor.user)
        fetchAcademyInfo(userCredential.uid)
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

  const fetchAcademyInfo = async (uid) => {
    const academyFetchRes = await db.collection('Academy').where('admins', 'array-contains', uid).get()
    // console.log(academyFetchRes)
    if(academyFetchRes.docs.length)
      academyFetchRes.forEach((doc) => console.log(doc.id, doc.data()))
    else console.log('there\'s no academy for this user')
  }

  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
