import React from 'react'
import { Card, CardContent, Chip, Typography } from '@mui/material'

import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

import DatePicker from 'react-datepicker';
import styled from 'styled-components'

import "./react-datepicker.css";

export default function RegularSchedule({ schedule, handleClickDay, handleClickTime }) {

  return (
    <>
      <Typography variant="h4" gutterBottom>
        정기 스케줄
      </Typography>
      <DayPicker>
        { schedule.map((value, index) =>
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
      { schedule.map((value, index) => {
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
    </>
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