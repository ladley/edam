// import './App.css';
import React from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick

import styled from 'styled-components'
import moment from 'moment'
import ScheduleAddingModal from './ScheduleAddingModal';
import ScheduleModifyModal from './ScheduleModifyModal';
import { db } from '../firebase'

const Calendar = React.forwardRef(({ studentInfo, setBillItems, selectedYearMonth, setSelectedYearMonth, setDayList }, ref) => {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [schedule, setSchedule] = React.useState([])
  const [modifierOpen, setModifierOpen] = React.useState(false)
  const [scheduleInfo, setScheduleInfo] = React.useState({
    ...studentInfo,
    day: undefined
  })

  const [selectedSchedule, setSelectedSchedule] = React.useState({})

  React.useImperativeHandle(ref, () => ({
     callFetchSchedule() {
      fetchSchedule()
     }
  }))

  React.useEffect(() => {
    calculateMonthlyPrice()
  }, [selectedYearMonth, schedule])

  React.useEffect(() => {
    fetchSchedule()
    setScheduleInfo((prev) => ({
      ...prev,
      ...studentInfo
    }))
  }, [studentInfo])

  const calculateMonthlyPrice = () => {
    if(selectedYearMonth !== undefined) {

      const monthFilteredScheduleschedule = schedule.filter((item) => {
        const itemMonth = moment(item.start).toDate().toDateString().slice(4, 7)
        const itemYear = moment(item.start).toDate().getFullYear()
        return (String(itemYear) === selectedYearMonth.year) && (String(itemMonth) === selectedYearMonth.month)
      })
      let totalStudyTime = 0
      monthFilteredScheduleschedule.map((schedule) => {
        totalStudyTime += Number(schedule.time)
        return true
      })
      setBillItems({
        name: '수업',
        price: studentInfo.price || 0,
        each: totalStudyTime,
      })
    }
  }
  const handleDateClick = (arg) => {
    setScheduleInfo((prev) => ({
      ...prev,
      day: arg.date
    }))
  };

  const fetchSchedule = async () => {
    try {
      setSchedule([])
      setSelectedSchedule({})
      const res = await db
        .collection('Schedule')
        .where('targetStudent', '==', db.collection('Student').doc(studentInfo.id))
        .get()
      res.forEach((doc) => {
        setSchedule(prev => {
          const start = moment(new Date(doc.data().startDT.seconds * 1000))
          const end = moment(new Date(doc.data().endDT.seconds * 1000))
          return [...prev, {
          time: moment.duration(end.diff(start)).asHours(),
          start: start.format('YYYY-MM-DDTHH:mm:ss'),
          end: end.format('YYYY-MM-DDTHH:mm:ss'),
          extendedProps: {
            id: doc.id,
            fetchSchedule,
            modifierOpen,
            setModifierOpen
          },
          ...doc.data()
        }]})
      })
    } catch(e) {
      console.error(e)
    }
  }

  React.useEffect(() => {
    if (scheduleInfo.day === undefined) return
    setModalOpen(true)
  }, [scheduleInfo])

  const calendarRef = React.useRef(null);

  const handleEventClick = (event) => {
    console.log(event.event.extendedProps.id)
    setSelectedSchedule(event.event)
    setModifierOpen(true)
  }

  const getMonthText = (month) => {
    switch (Number(month)) {
      case 1:
        return 'Jan'
      case 2:
        return 'Feb'
      case 3:
        return 'Mar'
      case 4:
        return 'Apr'
      case 5:
        return 'May'
      case 6:
        return 'Jun'
      case 7:
        return 'Jul'
      case 8:
        return 'Aug'
      case 9:
        return 'Sep'
      case 10:
        return 'Oct'
      case 11:
        return 'Nov'
      case 12:
        return 'Dec'
      default:
        console.error('no month data')
        break
    }
  }
  return (
    <Container>
      <FullCalendar
        headerToolbar={{
          left: 'title',
        //   center: 'dayGridMonth timeGridWeek',
          right: 'prev next',
        }}
        height={"auto"}
        firstDay={1}
        locale='ko'
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        // showNonCurrentDates={false}
        dayCellContent={(info) => info.dayNumberText.slice(0, info.dayNumberText.length - 1)}
        dayCellDidMount={(info) => {
          // console.log(info.date.getMonth() + 1 ,info.date.getDate())
          if(selectedYearMonth.month === getMonthText(moment(info.date).month() + 1)) {
            const day = moment(info.date).day()
            const date = moment(info.date).date()
            setDayList(prev => [
              ...prev.slice(0, day),
              [ ...prev[day], date],
              ...prev.slice(day + 1)
            ])
          }
        }}
        dateClick={(arg) => handleDateClick(arg)}
        datesSet={(arg) =>
          setSelectedYearMonth({
          year: arg.view.title.slice(0,4),
          month: getMonthText(arg.view.title.slice(-3, -1))
        })}
        eventContent={renderEventContent}
        eventClick={(arg) => handleEventClick(arg)}
        events={[
          ...schedule
        ]}

      />
      <ScheduleAddingModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        scheduleInfo={scheduleInfo}
        fetchSchedule={fetchSchedule}
      />
      <ScheduleModifyModal
        id={selectedSchedule.extendedProps?.id}
        modalOpen={modifierOpen}
        setModalOpen={setModifierOpen}
        fetchSchedule={fetchSchedule}
      />
    </Container>
  );
})

function renderEventContent(eventInfo) {

  const startTime = new Date(eventInfo.event.startStr).toTimeString().split(' ')[0].slice(0, 5)
  const endTime = new Date(eventInfo.event.endStr).toTimeString().split(' ')[0].slice(0, 5)
  // const endDate = new Date(eventInfo.endStr)
  return (
    <DaySchedule>
      {
        // console.log(eventInfo.event.extendedProps)
      }
      <span>{startTime} ~ {endTime}</span>
      { eventInfo.event.title &&
        <p>{eventInfo.event.title}</p>
      }
    </DaySchedule>
  );
}
const Container = styled.div`

  & .fc-daygrid-day.fc-day-today{
    background-color: white;
  }

  & .fc-daygrid-event-harness {
    border-bottom: 1px dashed #ddd;

    &:nth-last-child(-n+2) {
      border: none;
    }

  }
  & .fc-daygrid-day-frame{
    /* overflow: scroll; */

    &:hover {
      background-color: #eee;
    }
  }
`

const DaySchedule = styled.div`
  /* background-color: #ffcfcf; */
  flex: 1;
  padding: 2px;
  font-size: 12px;
  text-align: center;
  /* &:last-child {
    border: none;
  } */
`
export default Calendar