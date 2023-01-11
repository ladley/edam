import React from 'react'
import { Button, Chip, Typography, List, ListItemButton, ListItemText, Divider } from '@mui/material'

import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import styled from 'styled-components'

import "./react-datepicker.css";

export default function RegularSchedule({ schedule, handleClickDay, handleClickTime }) {
  const [addMode, setAddMode] = React.useState([
    false, false, false, false, false, false, false
  ])
  const [weekScheduleItems, setWeekScheduleItems] = React.useState(
      [
        {
          day: 'Sunday',
          korLabel: '일',
          use: false,
          schedules: [
          ]
        },
        {
          day: 'Monday',
          korLabel: '월',
          use: false,
          schedules: [
          ]
        },

        {
          day: 'Tuesday',
          korLabel: '화',
          use: false,
          schedules: [
          ]
        },

        {
          day: 'Wednesday',
          korLabel: '수',
          use: false,
          schedules: [
          ]
        },
      ],
    )

    const handleClickAddEachSchedule = (item, index) => {
      setWeekScheduleItems(prev => {
        console.log(index)
        return [
        ...prev.slice(0, index),
        {
          ...prev[index],
          schedules: [
            ...prev[index].schedules,
            item
          ]
        },
        ...prev.slice(index + 1)
      ]})
      setAddMode(prev => [
        ...prev.slice(0, index),
        !prev[index],
        ...prev.slice(index + 1)

      ])
    }
  return (
    <>
      <Typography variant="h4" gutterBottom>
        정기 스케줄
      </Typography>
      <DayPicker>
        { weekScheduleItems.map((value, index) =>
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
      { weekScheduleItems.map((value, index) => {
        let strColor = 'default'
        if (value.day === 'Sunday') strColor = 'error'
        else if (value.day === 'Saturday') strColor = 'primary'
        return <DayTimeWrap key={`${value.day} selector-${index}`}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <Typography variant="h5" gutterBottom color={strColor}>
              {value.korLabel}요일
            </Typography>
            <Button variant='outlined' 
              color={!addMode[index] ? 'primary' : 'error'} 
              onClick={() => setAddMode(prev => [
                ...prev.slice(0, index),
                !prev[index],
                ...prev.slice(index + 1)
              ])}
            >
              { !addMode[index] ? '추가하기' : '취소하기'}
            </Button>
          </div>
          { weekScheduleItems[index].schedules.length !== 0 &&
            <List >
              <Divider />
              { weekScheduleItems[index].schedules.map((item, index) =>
                <ListItemButton divider>
                  <span>
                    {index + 1}
                  </span>
                  <ListItemText style={{ textAlign: 'center' }} primary={moment(item.start).format('HH:mm')} />
                  ~
                  <ListItemText style={{ textAlign: 'center' }} primary={moment(item.end).format('HH:mm')} />
                </ListItemButton>
              )}
              {/* <ListItemButton divider>
                <ListItemText primary="Drafts" />
              </ListItemButton> */}

            </List>

          }
          { addMode[index] &&
            <TimeSelector
              handleClick={(item) => handleClickAddEachSchedule(item, index)}
            />
          }
        </DayTimeWrap>
      })}
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
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const TimeSelector = ({ handleClick }) => {
  const [start, setStart] = React.useState(setHours(setMinutes(new Date(), 0), 9))
  const [end, setEnd] = React.useState(setHours(setMinutes(new Date(), 0), 10))
  // const [use, setUse] = React.useState()
  return(
    <TimePickerWrap>
      <DatePicker
        placeholderText='시작시간'
        selected={start}
        onChange={(time) => setStart(time)}
        showTimeSelect
        showTimeSelectOnly
        timeFormat="HH:mm a"
        timeIntervals={30}
        timeCaption="시작시간"
        dateFormat="hh:mm a"
        // disabled={!use}
        minTime={setHours(setMinutes(new Date(), 0), 9)}
        maxTime={setHours(setMinutes(new Date(), 0), 22)}
      />
      ~
      <DatePicker
        placeholderText='종료시간'
        selected={end}
        onChange={(time) => setEnd(time)}
        showTimeSelect
        showTimeSelectOnly
        timeFormat="HH:mm a"
        timeIntervals={30}
        timeCaption="종료시간"
        dateFormat="hh:mm a"
        // disabled={!use}
        minTime={setHours(setMinutes(new Date(), 0), 10)}
        maxTime={setHours(setMinutes(new Date(), 0), 23)}
      />
      <Button onClick={() => handleClick({start, end})}>
        추가
      </Button>
    </TimePickerWrap>
  )
}

const TimePickerWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
