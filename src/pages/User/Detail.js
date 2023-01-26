import React from 'react';

import { useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Container,
  // Paper,
  Typography,
  Stack,
  Button
} from '@mui/material'
import styled from 'styled-components'
import moment from 'moment'
import html2canvas from 'html2canvas';

// import "./react-datepicker.css";
import RegularSchedule from '../../components/RegularSchdule';
import Calendar from '../../components/Calendar'
import Table from '../../components/Table'
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { db } from '../../firebase'

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

export default function Detail() {
  const [studentInfo, setStudentInfo] = React.useState({})
  const [loadSchedule, setLoadSchedule] = React.useState(false)
  const [schedule, setSchedule] = React.useState([])
  const [billItems, setBillItems] = React.useState([])
  const [dayList, setDayList] = React.useState([[], [], [], [], [], [], []])
  const [selectedYearMonth, setSelectedYearMonth] = React.useState({
    month: String(monthNames[new Date().getMonth()]),
    year: String(new Date().getFullYear()),
  })

  const navigate = useNavigate()
  const calendarRef = React.useRef()

  const { pathname } = useLocation()
  const documentId = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length)
  const exportRef = React.useRef()

  React.useEffect(() => {
    fetchInformation()
    fetchRegularSchedules()
  }, [])

  React.useEffect(() => {
    const daysOfThisYM =  getDatesInMonth(
      Number(selectedYearMonth.year),
      new Date(`${selectedYearMonth.month} 1, 2000`).getMonth() + 1
    )
    daysOfThisYM.forEach((day) => {
      // setDayList(prev => 
      //   ...prev,
      //   [
      //   ...prev.slice(0, day),
      //   [ ...prev[day], date],
      //   ...prev.slice(day + 1)
      // ])
      // console.log(moment(day).day(), moment(day).date())
    })
    // console.log(sortByDay)
  }, [selectedYearMonth])
  React.useEffect(() => {
    // console.log(regularSchedule)
    // updateSchedule()
  }, [schedule])

  function getDatesInMonth(year, month) {
    const date = new Date(year, month - 1, 1);
    const days = [];
    while (date.getMonth() === month - 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  const fetchInformation = async () => {
    try {
      const res = await db.collection('Student').doc(documentId).get()
      if (res.exists) {
        // console.log(res.id)
        setStudentInfo(res.data())
      } else {
        console.warn('there is no document')
      }
    } catch(e) {
      console.error('error occured while fetching student detail: ', e)
    }
  }

  const updateSchedule = async () => {
    try {
      if (!loadSchedule) return
      const res = await
      db.collection('Student')
      .doc(documentId)
      .update({
          'regularSchedule': schedule
        // 'regularSchedule': schedule.map(item => ({
        //   ...item,
        //   startTM: moment(item.startTM).format('HH:mm').toString(),
        //   endTM: moment(item.endTM).format('HH:mm').toString()
        // }))
      })

      // console.log(res)
    } catch(e) {
      console.error('error occured in updateSchdule function', e)
    }
  }
  const fetchRegularSchedules = async () => {
    try {
      const res = await
        db.collection('Student')
        .doc(documentId)
        // .collection('RegularSchedule')
        .get()
      // console.log(res.data())
      if(res.data().regularSchedule) {
        setSchedule(res.data().regularSchedule.map(item => ({
          ...item,
          schedules: item.schedules.map(item => ({
            start: new Date(item.start.seconds * 1000),
            end: new Date(item.end.seconds * 1000),
          }))
        })))
      }
      setLoadSchedule(true)
    } catch(e) {
      console.error('error occured while fetching student\'s regular schedule: ', e)
    }
  }

  const getDisplayableBirth = (val) => val.toDate().toISOString().split('T')[0]

  const handleClickSaveAsImage = () => {
    const hideElements = document.getElementsByClassName('hide-on-capture')

    for (let i = 0; i < hideElements.length; i+= 1)
      hideElements[i].style.display = 'none'

    const headerElement = document.getElementsByClassName('fc-header-toolbar')[0]

    const headerBtns = headerElement.children[headerElement.childNodes.length - 1];
    headerBtns.style = 'display:none;'

    exportAsImage(exportRef.current, `${studentInfo.name}-${selectedYearMonth.month}-${selectedYearMonth.year}`)


    headerBtns.style = 'display:block;'
    for (let i = 0; i < hideElements.length; i+= 1)
      hideElements[i].style.display = 'block'
  }

  const exportAsImage = async (el, imageFileName) => {
    const canvas = await html2canvas(el);
    const image = canvas.toDataURL("image/png", 1.0);

    downloadImage(image, imageFileName);

  }

  const downloadImage = (blob, fileName) => {
    const fakeLink = window.document.createElement("a");
    fakeLink.style = "display:none;";
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);

    fakeLink.click();

    document.body.removeChild(fakeLink);

    fakeLink.remove();
    // setIsReadyCapture(false)
  };

  const applyRegularSchedule = () => {
    const batch = db.batch()
    const scheduleMapRes = schedule.map(
      (schedule, index) => schedule.schedules.map(
        item => {
          const start = moment(item.start).format('HH:mm')
          const end = moment(item.end).format('HH:mm')
          const mapRes = dayList[index].map((date) => {
            const docRef = db.collection('Schedule').doc()
            const data =  {
              startDT: moment(`${selectedYearMonth.month} ${date} ${selectedYearMonth.year} ${start}`).toDate(),
              endDT: moment(`${selectedYearMonth.month} ${date} ${selectedYearMonth.year} ${end}`).toDate(),
              title: "",
              targetStudent: db.collection('Student').doc(studentInfo.id)
            }
            batch.set(docRef, data)
            return true
          })
          return mapRes
        }
      )
    )
    batch.commit()
    calendarRef.current.callFetchSchedule()
  }

  const deleteStudent = async () => {
    try {

      await db.collection('Student').doc(studentInfo.id).delete()

      navigate('/dashboard/student')
    } catch(e) {
      console.error(e.code, e.message)
    }
  }
  return (
    <Page>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            학생 상세페이지
          </Typography>
          <div style={{ gap: 4, display: 'flex' }}>
            <Button variant="contained" component={RouterLink} to="/dashboard/student/add" startIcon={<Iconify icon="material-symbols:edit-document" />}>
              수정하기
            </Button>
            <Button 
              variant="contained"
              color='error'
              startIcon={<Iconify icon="material-symbols:delete-forever-rounded" />}
              onClick={() => deleteStudent()}
            >
              삭제하기
            </Button>
          </div>
        </Stack>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" gutterBottom>
                      학생 정보
                    </Typography>
                    <Typography variant="h6">
                      이름
                    </Typography>
                    <Typography variant="body6">
                      {studentInfo?.name}
                    </Typography>
                    <Typography sx={{ mt: 2 }} variant="h6">
                      연락처
                    </Typography>
                    <Typography variant="body6">
                      {studentInfo?.phone}
                    </Typography>
                    <Typography sx={{ mt: 2 }} variant="h6">
                      생년월일
                    </Typography>
                    <Typography variant="body6">
                      { studentInfo.birth && getDisplayableBirth(studentInfo.birth) }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card
                  style={{
                    overflow: 'visible'
                  }}
                >
                  <CardContent>
                    <RegularSchedule
                      schedules={schedule}
                      studentInfo={studentInfo}
                      onChangeSchedule={(data) => setSchedule(data)}
                    />
                    <div
                      style={{
                        display: 'flex',
                        gap: 4
                      }}
                    >
                      <Button
                        fullWidth
                        variant='contained'
                        onClick={() => updateSchedule()}
                      >
                        저장하기
                      </Button>
                      <Button
                        fullWidth
                        variant='contained'
                        onClick={() => applyRegularSchedule()}
                      >
                        반영하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={8} xs={12} style={{ gap: 4 }}>
            <div
              ref={exportRef}
            >
              <Card>
                <CardContent>
                  <h2>{studentInfo.name}</h2>
                  <Calendar
                    ref={calendarRef}
                    setDayList={setDayList}
                    studentInfo={studentInfo}
                    setBillItems={setBillItems}
                    selectedYearMonth={selectedYearMonth}
                    setSelectedYearMonth={setSelectedYearMonth}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent>

                    <Table
                      year={selectedYearMonth.year && selectedYearMonth.year}
                      month={selectedYearMonth.month && selectedYearMonth.month}
                      classBill={billItems}
                      targetId={studentInfo && studentInfo.id}
                    />
                </CardContent>
              </Card>
            </div>
              <Button
                style={{ marginTop: 8 }}
                fullWidth
                variant='contained'
                onClick={() => handleClickSaveAsImage()}
              >
                이미지로 저장하기
              </Button>

          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}

const DayPicker = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`

const DayTimeWrap = styled.div`
  margin-bottom: 8px;
`

const TimePickerWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`