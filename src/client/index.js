// Import js files
// import { setMinDate } from './js/dataCheck'
// import { checkUrl } from './js/urlChecker'
// import { handleSubmit } from './js/formHandler'

// Import style sass files
import './styles/index.scss'

// Set min date field to current date
var currentDate = new Date();
var dd = currentDate.getDate();
var mm = currentDate.getMonth()+1; //January is 0 so need to add 1 to make it 1!
var yyyy = currentDate.getFullYear();
// Add format for date to use it as 'min' attribute
if(dd<10) {
  dd='0'+dd
}
if(mm<10) {
  mm='0'+mm
}
currentDate = yyyy+'-'+mm+'-'+dd;

document.querySelector('#start-date').setAttribute('min', currentDate);
document.querySelector('#end-date').setAttribute('min', currentDate);


// Add logo in App
// import logo from './assets/logo.png'
// const logoImg = document.querySelector('#logo-img');
// logoImg.src = logo;

// Export js files
// export {
//   // checkUrl,
//   // handleSubmit
// }