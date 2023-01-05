import React from 'react';

import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Container,
  // Paper,
  Chip,
  Typography,
  Stack,
  Button
} from '@mui/material'
import DatePicker from 'react-datepicker';
import styled from 'styled-components'
import moment from 'moment'
import html2canvas from 'html2canvas';

import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

import Calendar from '../../components/Calendar'
import Table from '../../components/Table'
import "./react-datepicker.css";
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { db } from '../../firebase'

export default function Detail() {
  const [studentInfo, setStudentInfo] = React.useState({})
  const [loadSchedule, setLoadSchedule] = React.useState(false)
  const [regularSchedule, setRegularSchedule] = React.useState([])
  const [billItems, setBillItems] = React.useState([])
  const [selectedYearMonth, setSelectedYearMonth] = React.useState({
    month: undefined,
    yean: undefined,
  })
  const { pathname } = useLocation()
  const documentId = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length)
  const exportRef = React.useRef()
  React.useEffect(() => {
    fetchInformation()
    fetchRegularSchedules()
  }, [])

  React.useEffect(() => {
    // console.log(regularSchedule)
    updateSchedule()
  }, [regularSchedule])

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
        'regularSchedule': regularSchedule.map(item => ({
          ...item,
          startTM: moment(item.startTM).format('HH:mm').toString(),
          endTM: moment(item.endTM).format('HH:mm').toString()
        }))
      })

      // console.log(res)
    } catch(e) {
      console.error('error occured in updateSchdule function', e)
    }
  }
  const getMinutes = (string) => {
    const split = String(string).split(':')
    const hours = split[0]
    let minutes = Number(split[1])

    minutes += Number(hours * 60)

    return (minutes)
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
        setRegularSchedule(res.data().regularSchedule.map(item => {
          const startOfToday = new Date()
          startOfToday.setHours(0)
          startOfToday.setMinutes(0)
          startOfToday.setSeconds(0)
          // console.log(startOfToday)
          const startMins = getMinutes(item.startTM)
          const endMins = getMinutes(item.endTM)
          return {
            ...item,
            startTM: item.startTM ? moment(startOfToday).add(startMins, 'minutes').toDate() : null,
            endTM: item.endTM ? moment(startOfToday).add(endMins, 'minutes').toDate() : null,
          }
        }))
      }
      setLoadSchedule(true)
    } catch(e) {
      console.error('error occured while fetching student\'s regular schedule: ', e)
    }
  }

  const handleClickDay = (index) => {
    setRegularSchedule(prev => [
      ...prev.slice(0, index),
      {
        ...prev[index],
        use: !prev[index].use
      },
      ...prev.slice(index + 1)
    ])
  }

  const handleClickTime = (index, type, time) => {
    // console.log(moment(time).format('hh:mm a'))
    setRegularSchedule(prev => [
      ...prev.slice(0, index),
      {
        ...prev[index],
        [type]: time
      },
      ...prev.slice(index + 1)
    ])
    if (type === 'startTM') {
      setRegularSchedule(prev => [
        ...prev.slice(0, index),
        {
          ...prev[index],
          'endTM': moment(time).add('4', 'hour').toDate()
        },
        ...prev.slice(index + 1)
      ])
    }
    // console.log(index, type, time)
  }

  const getDisplayableBirth = (val) => val.toDate().toISOString().split('T')[0]

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
    const headerElement = document.getElementsByClassName('fc-header-toolbar')[0]
    const hideElements = document.getElementsByClassName('hide-on-capture')
    console.log(hideElements)
    for (let i = 0; i < hideElements.length; i+= 1)
      hideElements[i].style.display = 'none'
    const headerBtns = headerElement.children[headerElement.childNodes.length - 1];
    headerBtns.style = 'display:none;'
    fakeLink.click();

    document.body.removeChild(fakeLink);

    headerBtns.style = 'display:block;'
    for (let i = 0; i < hideElements.length; i+= 1)
      hideElements[i].style.display = 'block'


    fakeLink.remove();
  };

  return (
    <Page>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            학생 상세페이지
          </Typography>
          <Button variant="contained" component={RouterLink} to="/dashboard/user/add" startIcon={<Iconify icon="eva:plus-fill" />}>
            학생 추가하기
          </Button>
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
                    <Typography variant="h4" gutterBottom>
                      정기 스케줄
                    </Typography>
                    <DayPicker>
                      { regularSchedule.map((value, index) =>
                        <Chip
                          key={`${value.day} use selector-${index}`}
                          color='primary'
                          label={value.korLabel}
                          variant={value.use ? 'filled' : 'outlined'}
                          clickable
                          onClick={() => handleClickDay(index)}
                        />
                      )}
                    </DayPicker>
                    { regularSchedule.map((value, index) => {
                      let strColor = 'default'
                      if (value.day === 'Sunday') strColor = 'error'
                      else if (value.day === 'Saturday') strColor = 'primary'
                      return <DayTimeWrap key={`${value.day} selector-${index}`}>
                        <Typography variant="h5" gutterBottom color={strColor}>
                          {value.korLabel}요일
                        </Typography>
                        <TimePickerWrap>
                          <DatePicker
                            placeholderText='시작시간'
                            selected={value.startTM}
                            onChange={(time) => handleClickTime(index, 'startTM', time)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm a"
                            timeIntervals={30}
                            timeCaption="시작시간"
                            dateFormat="hh:mm a"
                            disabled={!value.use}
                            minTime={setHours(setMinutes(new Date(), 0), 9)}
                            maxTime={setHours(setMinutes(new Date(), 0), 22)}
                          />
                          ~
                          <DatePicker
                            placeholderText='종료시간'
                            selected={value.endTM}
                            onChange={(time) => handleClickTime(index, 'endTM', time)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm a"
                            timeIntervals={30}
                            timeCaption="종료시간"
                            dateFormat="hh:mm a"
                            disabled={!value.use}
                            minTime={setHours(setMinutes(new Date(), 0), 10)}
                            maxTime={setHours(setMinutes(new Date(), 0), 23)}
                          />
                        </TimePickerWrap>
                      </DayTimeWrap>
                    }
                    )}
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
                      month={selectedYearMonth.month && selectedYearMonth.month}
                      classBill={billItems}
                    />
                </CardContent>
              </Card>
            </div>
              <Button
                style={{ marginTop: 8 }}
                fullWidth
                variant='contained'
                onClick={() => exportAsImage(exportRef.current, `${studentInfo.name}-${selectedYearMonth.month}-${selectedYearMonth.year}`)}
              >
                저장하기
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