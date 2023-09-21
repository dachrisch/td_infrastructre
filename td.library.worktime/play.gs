
function myFunction() {
  let worklogService =new CalendarRetrieverService(new cWrap.CalendarAppWrapper())

  const bookable = worklogService.retrieveBookable(moment('01.09.2023', 'DD.MM.YYYY'), moment())

  console.log(bookable)
}
