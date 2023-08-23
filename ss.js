const DBName = 'AppointmentsDB';
let DB;
function InitIndexedDB(){
    const request=window.indexedDB.open(DBName,1);
    request.onerror=(event)=>{console.log('error creating / accessing DB');};
    request.onsuccess=(event)=>
    {
        DB=event.target.result;
        loadAppointments();
    }
    request.onupgradeneeded=(event)=>
    {
        DB= event.target.result;
        DB.createObjectStore('Appointments',{autoIncrement:true});
    };
}

 function addAppointment(Appointment)
 {
    const transaction =DB.transaction(['Appointments'],'readwrite');
    const AppointmentStore = transaction.objectStore('Appointments');
    const request= AppointmentStore.add(Appointment);
    request.onsuccess=()=>{loadAppointments();};
    transaction.onComplete=()=>{DB.close();};
 }
  function loadAppointments()
  {
    const AppointmentList = document.getElementById('Appointments');
    AppointmentList.innerHTML='';
    const ObjectStore = DB.transaction('Appointments').objectStore('Appointments');
    ObjectStore.openCursor().onsuccess=(event)=>
    {
        const cursor = event.target.result;
        if(cursor)
        {
            const Appointment = cursor.value;
            const AppointmentItem = document.createElement('li');
            AppointmentItem.className = 'list-group-item';
            AppointmentItem.textContent=`${Appointment.Name}- ${Appointment.Date}-${Appointment.Time}- ${Appointment.Problem}`;
            AppointmentList.appendChild(AppointmentItem);
            cursor.continue();
        }
    };}

 $('#AppointmentForm').submit(function(e)
  {
    e.preventDefault();
    const Name= $('#name').val();
    const Date =$('#date').val();
    const Time =$('#time').val();
    const Problem= $('#problem').val();
    const Appointment ={ Name,Date,Time,Problem};
    addAppointment(Appointment);
    $('#name').val('');
    $('#date').val('');
    $('#time').val('');
    $('#problem').val('');

  })
InitIndexedDB();