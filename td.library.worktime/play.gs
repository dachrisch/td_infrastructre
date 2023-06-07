
function myFunction() {
  let worklogService =new CalendarRetrieverService(new cWrap.CalendarAppWrapper())

  console.log(worklogService.retrieveWorkdays(moment('01.06.2023', 'DD.MM.YYYY'), moment()))
  console.log(worklogService.retrieveVacations(moment('01.04.2023', 'DD.MM.YYYY'), moment()))
  console.log(worklogService.retrieveHolidays(moment('01.04.2023', 'DD.MM.YYYY'), moment()))
}
