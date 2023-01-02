// routes
import React from 'react';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
// import { db } from "./firebase";

// ----------------------------------------------------------------------

export default function App() {
  React.useEffect(() => {
    getRes()
    // const fbRes = db.collection('Student').get()
    // console.log(fbRes)
    // db.collection('Student').get()
    // .then((docs) => {
    //   let bucketData = [];
    //   docs.forEach((doc) => {
    //     // 도큐먼트 객체를 확인해보자!
    //     console.log(doc);
    //     // 도큐먼트 데이터 가져오기
    //     console.log(doc.data());
    //     // 도큐먼트 id 가져오기
    //     console.log(doc.id);

    //     if (doc.exists) {
    //       bucketData = [...bucketData, { id: doc.id, ...doc.data() }];
    //     }
    //   });

    //   console.log(bucketData);
    // })
  })

  const getRes = async() => {
    // const fbRes = await db.collection('Student').get()
    // fbRes.docs.forEach((doc) => {
    //   console.log(doc.id, doc.data())
    // })
    // console.log(fbRes.docs[0].data())
  }
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
