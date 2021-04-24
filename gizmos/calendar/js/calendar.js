const OUTER_RADIUS = 450; // px
const INNER_RADIUS = 300; // px
const ITEMS = 12;

let canvas = document.getElementById('calender_rim');
let table = document.getElementById('calender_table');

let date = new Date();
let myDate = new MyDate(date.getFullYear());
let rim = new Rim(canvas, ITEMS, OUTER_RADIUS, INNER_RADIUS);
let curMonth = date.getMonth();
let curDate = date.getDate();
let curYear = date.getFullYear();

init(curMonth);
console.log(myDate.data);
console.log((new Date(2021,2,0).getDate()));

function init(month) {
    console.log(curMonth);
    rim.value = month;
    rim.init();
    myDate.initData(month);
    renderMonth(month);
    rim.registerEvent((value)=> {
        table.innerHTML='';
        renderMonth(value);
    });
};

function renderMonth(month) {
    let monthData = getMonthData(month);
    let innerHTML = '<caption><h1>'+curYear+'</h1></caption><tr>';
    monthData.forEach((v,i) => {
        if (curMonth == month && curDate == v) {
            innerHTML += '<td style="background-color: rgba(0,0,0,.2)">' + v +'</td>';
        } else {
            innerHTML += '<td>' + v + '</td>';
        }
        if ((i+1) % 7 == 0) {
            innerHTML += '</tr><tr>';
        }
    });
    innerHTML +='<tr>';
    table.innerHTML=innerHTML;
};

function getMonthData(month) {
    let monthData = [];
    for (let i = 0; i < myDate.data[month][0]; i++) {
        monthData.push('&nbsp;');
    }
    for (let i = 0; i < myDate.data[month][1]; i++) {
        monthData.push(i + 1);
    }
    return monthData;
};

console.log(getMonthData(7));