import React from 'react';
import CalendarComponent from '../components/Calendar';
// import { firestore } from '../firebase'
export default function Calendar() {
  React.useEffect(() => {
    // console.log('aa')
  }, [])
  return (
    <div>
      <CalendarComponent />
    </div>
  );
}
