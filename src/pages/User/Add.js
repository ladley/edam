import React from 'react';
import styled from 'styled-components'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import OtherDatePicker from 'react-datepicker';

import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import moment from 'moment'

import { useNavigate } from 'react-router-dom'

import { Box, Button, Chip, Card, CardContent, Divider, TextField, Typography } from '@mui/material';

import { db } from '../../firebase'

const startOfToday = new Date()
startOfToday.setHours(0)
startOfToday.setMinutes(0)
startOfToday.setSeconds(0)

const DEFAULT_REGULAR_SCHEDULR = [
  {
    day: 'Sunday',
    korLabel: '일',
    startTM: startOfToday,
    endTM: startOfToday,
    use: false
  },
  {
    day: 'Monday',
    korLabel: '월',
    startTM: startOfToday,
    endTM: startOfToday,
    use: false
  },
  {
    day: 'Tuesday',
    korLabel: '화',
    startTM: startOfToday,
    endTM: startOfToday,
    use: false
  },
  {
    day: 'Wednesday',
    korLabel: '수',
    startTM: startOfToday,
    endTM: startOfToday,
    use: false
  },
  {
    day: 'THursday',
    korLabel: '목',
    startTM: startOfToday,
    endTM: startOfToday,
    use: false
  },
  {
    day: 'Friday',
    korLabel: '금',
    startTM: startOfToday,
    endTM: startOfToday,
    use: false
  },
  {
    day: 'Saturday',
    korLabel: '토',
    startTM: startOfToday,
    endTM: startOfToday,
    use: false
  },
]

export default function Add() {

  const [name, setName] = React.useState('')
  const [birth, setBirth]  = React.useState(new Date())
  const [phone, setPhone] = React.useState('')
  const [regularSchedule, setRegularSchedule] = React.useState(DEFAULT_REGULAR_SCHEDULR)
  const navigate = useNavigate()

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
  }

  const handleAddStudent = async () => {
    try {
      const res = await db.collection('Student').add({})

      console.log('student added..', res)
      const addedStudentId = res.id

      const addDataRes = await db.collection('Student').doc(addedStudentId).set({
        id: addedStudentId,
        regularSchedule: regularSchedule.map(schedule => ({
          ...schedule,
          startTM: moment(schedule.startTM).format('HH:mm').toString(),
          endTM: moment(schedule.endTM).format('HH:mm').toString()
        })),
        name, birth, phone
      })

      console.log('data add success:', addDataRes)
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <Card>
      <CardContent>
        <Box>
          <h1 style={{marginBottom: 12}}>학생 추가하기</h1>
          <Divider />
          <FormWrap>
            <TextField
              label="이름"
              variant="outlined"
              margin="normal"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="전화번호"
              tyle="number"
              variant="outlined"
              margin="normal"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="생년월일"
                value={birth}
                inputFormat='YYYY-MM-DD'
                onChange={(newValue) => {
                  setBirth(newValue.$d);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
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

                      <OtherDatePicker
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
                      <OtherDatePicker
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
            <Button
              style={{ margin: 8 }}
              fullWidth
              variant='contained'
              onClick={() => handleAddStudent()}
            >
              추가하기
            </Button>
          </FormWrap>
        </Box>
      </CardContent>
    </Card>
  )
}

const FormWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

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