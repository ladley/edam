import React from 'react';
import styled from 'styled-components'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import { useNavigate, useLocation } from 'react-router-dom'

import { Box, Button, Card, CardContent, Divider, TextField } from '@mui/material';

import { db } from '../../firebase'

const startOfToday = new Date()
startOfToday.setHours(0)
startOfToday.setMinutes(0)
startOfToday.setSeconds(0)

export const DEFAULT_REGULAR_SCHEDULE = [
  {
    day: 'Sunday',
    korLabel: '일',
    use: false,
    schedules: []
  },
  {
    day: 'Monday',
    korLabel: '월',
    use: false,
    schedules: []
  },
  {
    day: 'Tuesday',
    korLabel: '화',
    use: false,
    schedules: []
  },
  {
    day: 'Wednesday',
    korLabel: '수',
    use: false,
    schedules: []
  },
  {
    day: 'Thursday',
    korLabel: '목',
    use: false,
    schedules: []
  },
  {
    day: 'Friday',
    korLabel: '금',
    use: false,
    schedules: []
  },
  {
    day: 'Saturday',
    korLabel: '토',
    use: false,
    schedules: []
  },
]

export default function Add() {

  const [name, setName] = React.useState('')
  const [birth, setBirth] = React.useState(new Date())
  const [phone, setPhone] = React.useState('')
  const navigate = useNavigate()
  const location = useLocation()
  React.useEffect(() => {
    fetchStudent()
  }, [])

  const fetchStudent = async () => {
    try {
      const studentDocId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
      const studentInfo = await db.collection('Student').doc(studentDocId).get()

      if (studentInfo.exists) {
        setName(studentInfo.data().name)
        setPhone(studentInfo.data().phone)
        setBirth(new Date(studentInfo.data().birth.seconds * 1000))
      }
    } catch (e) {
      console.error(e)
    }

  }

  const handleUpdateStudent = async () => {
    try {
      const studentDocId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)

      await db.collection('Student').doc(studentDocId).update({
        name, birth, phone
      })

      console.log('data update success')

      navigate(`/dashboard/student/${studentDocId}`)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Card>
      <CardContent>
        <Box>
          <h1 style={{ marginBottom: 12 }}>{name} 학생 정보 수정</h1>
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

            <Button
              style={{ margin: 8 }}
              fullWidth
              variant='contained'
              onClick={() => handleUpdateStudent()}
            >
              수정하기
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
