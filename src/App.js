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

  const checkIncludeAcademy = async (location, uid) =>{
    if(location.pathname === '/dashboard/academy/add') return;
    const academyRes = await db.collection('Academy').where('admins', 'array-contains',uid).get()
    if(!academyRes.docs.length) navigate('/dashboard/academy/add')
}

  React.useEffect(() => {
    const isLoginPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register'
    if(!isLoginPage) {
      if(isEmptyObj(user)) navigate('/login')
      else checkIncludeAcademy(location, user.uid);
    }
  }, [location, user])

  const fetchAcademyInfo = async (uid) => {
    const academyFetchRes = await db.collection('Academy').where('admins', 'array-contains', uid).get()
    if(academyFetchRes.docs.length)
      academyFetchRes.forEach((doc) => console.log(doc.id, doc.data()))
    else console.log('there\'s no academy for this user')
  }

  const isEmptyObj = (obj) => {
    if(obj.constructor === Object
       && Object.keys(obj).length === 0)  {
      return true;
    }
    return false;
  }



  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
