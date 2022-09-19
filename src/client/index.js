// Import js files
// import { setMinDate } from './js/dataCheck'
// import { checkUrl } from './js/urlChecker'
// import { handleSubmit } from './js/formHandler'

// Import style sass files
import './styles/index.scss'

// Set min date field to current date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
var yyyy = today.getFullYear();
// Add format for date to use it as 'min' attribute
if(dd<10) {
  dd='0'+dd
}
if(mm<10) {
  mm='0'+mm
}
today = yyyy+'-'+mm+'-'+dd;

document.querySelector('#start-date').setAttribute('min', today);
document.querySelector('#end-date').setAttribute('min', today);


// Add logo in App
// import logo from './assets/logo.png'
// const logoImg = document.querySelector('#logo-img');
// logoImg.src = logo;

// Export js files
// export {
//   // checkUrl,
//   // handleSubmit
// }