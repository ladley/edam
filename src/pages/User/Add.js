import React from 'react';
import styled from 'styled-components'

import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Box, Card, CardContent, Divider, TextField } from '@mui/material';

export default function Add() {
  const [name, setName] = React.useState('')
  const [birth, setBirth]  = React.useState(new Date())
  const [phone, setPhone] = React.useState('')
  const [regularSchedule,] = React.useState([
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