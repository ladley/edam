import React from 'react';
import styled from 'styled-components'
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import moment from 'moment'

import { Box, Chip, Card, CardContent, Divider, TextField, Typography } from '@mui/material';

export default function Add() {
  const [name, setName] = React.useState('')
  const [birth, setBirth]  = React.useState(new Date())
  const [phone, setPhone] = React.useState('')
  const [regularSchedule, setRegularSchedule] = React.useState([
    {
      day: 'Sunday',
      korLabel: '일',
      startTM: new Date(),
      endTM: new Date(),
      use: false
    },
    {
      day: 'Monday',
      korLabel: '월',
      startTM: new Date(),
      endTM: new Date(),
      use: false
    },
    {
      day: 'Tuesday',
      korLabel: '화',
      startTM: new Date(),
      endTM: new Date(),
      use: false
    },
    {
      day: 'Wednesday',
      korLabel: '수',
      startTM: new Date(),
      endTM: new Date(),
      use: false
    },
    {
      day: 'THursday',
      korLabel: '목',
      startTM: new Date(),
      endTM: new Date(),
      use: false
    },
    {
      day: 'Friday',
      korLabel: '금',
      startTM: new Date(),
      endTM: new Date(),
      use: false
    },
    {
      day: 'Saturday',
      korLabel: '토',
      startTM: new Date(),
      endTM: new Date(),
      use: false
    },
  ])


  const handleClickDay = (index) => {
    // setRegularSchedule(prev => [
    //   ...prev.slice(0, index),
    //   {
    //     ...prev[index],
    //     use: !prev[index].use
    //   },
    //   ...prev.slice(index + 1)
    // ])
  }

  const handleClickTime = (index, type, time) => {
    // setRegularSchedule(prev => [
    //   ...prev.slice(0, index),
    //   {
    //     ...prev[index],
    //     [type]: time
    //   },
    //   ...prev.slice(index + 1)
    // ])
    // if (type === 'startTM') {
    //   setRegularSchedule(prev => [
    //     ...prev.slice(0, index),
    //     {
    //       ...prev[index],
    //       'endTM': moment(time).add('4', 'hour').toDate()
    //     },
    //     ...prev.slice(index + 1)
    //   ])
    // }
    // console.log(index, type, time)
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="생년월일"
                value={birth}
                onChange={(newValue) => {
                  setBirth(newValue);
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
{/* 
                      <DatePicker
                        placeholderText='시작시간'
                        selected={value.startTM}
                        onChange={(time) => handleClickTime(index, 'startTM', time)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeFormat="aa HH:mm"
                        timeIntervals={30}
                        timeCaption="시작시간"
                        dateFormat="aa hh:mm"
                        disabled={!value.use}
                      />
                      ~
                      <DatePicker
                        placeholderText='종료시간'
                        selected={value.endTM}
                        onChange={(time) => handleClickTime(index, 'endTM', time)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeFormat="aa HH:mm"
                        timeIntervals={30}
                        timeCaption="종료시간"
                        dateFormat="aa hh:mm"
                        disabled={!value.use}
                      /> */}
                    </TimePickerWrap>
                  </DayTimeWrap>
                }
                )}
              </CardContent>
            </Card>
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