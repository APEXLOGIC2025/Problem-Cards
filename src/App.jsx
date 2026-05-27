import React,{useState,useEffect} from "react";
import {QRCodeCanvas} from "qrcode.react";
import * as XLSX from "xlsx";

import supabase from "./services/supabase";

import JoinSession from "./pages/JoinSession";
import ActivityScreen from "./pages/ActivityScreen";

export default function App(){

const isJoin=
window.location.pathname.includes("/join/")

const isActivity=
window.location.pathname.includes("/activity/")

const[
sessionName,
setSessionName
]=useState("")

const[
time,
setTime
]=useState(10)

const[
attempt,
setAttempt
]=useState(3)

const[
marks,
setMarks
]=useState(100)

const[
sessionId,
setSessionId
]=useState("")

const[
joinLink,
setJoinLink
]=useState("")

const[
activities,
setActivities
]=useState([])

const[
participants,
setParticipants
]=useState([])


useEffect(()=>{

const saved=
localStorage.getItem(
"activeSession"
)

if(saved){

setSessionId(saved)

}

},[])


useEffect(()=>{

if(sessionId){

setJoinLink(

window.location.origin+
"/join/"+
sessionId

)

}

},[sessionId])


useEffect(()=>{

console.log(
"useEffect fired:",
sessionId
)

if(!sessionId){

return

}

async function loadParticipants(){

console.log(
"Loading:",
sessionId
)

const{
data,
error
}
=
await supabase

.from(
"participants"
)

.select("*")

.eq(
"session_id",
sessionId
)

.order(
"joined_at",
{
ascending:true
}
)

if(error){

console.log(error)

return

}

console.log(
"Participants:",
data
)

setParticipants(
data||[]
)

}

loadParticipants()

const interval=
setInterval(
loadParticipants,
1000
)

return()=>{

clearInterval(
interval
)

}

},[sessionId])


function handleExcel(e){

const file=
e.target.files[0]

if(!file)return

const reader=
new FileReader()

reader.onload=
(evt)=>{

const workbook=
XLSX.read(
evt.target.result,
{
type:"binary"
}
)

const sheet=
workbook.Sheets[
workbook.SheetNames[0]
]

const data=
XLSX.utils.sheet_to_json(
sheet
)

setActivities(data)

}

reader.readAsBinaryString(
file
)

}


async function createSession(){

const id=
Math.random()
.toString(36)
.substring(2,7)
.toUpperCase()

localStorage.setItem(
"activeSession",
id
)

setSessionId(id)

await supabase
.from("sessions")
.insert([{

id:id,

session_name:
sessionName,

time_limit:
time,

max_attempt:
attempt,

total_marks:
marks

}])


for(
let a of activities
){

await supabase
.from(
"activities"
)
.insert([{

session_id:id,

problem:
a.Problem,

right1:
a.Right1||
a["Right 1"],

right2:
a.Right2||
a["Right 2"],

right3:
a.Right3||
a["Right 3"],

right4:
a.Right4||
a["Right 4"],

option1:
a.Option1||
a["Option 1"],

option2:
a.Option2||
a["Option 2"],

option3:
a.Option3||
a["Option 3"],

option4:
a.Option4||
a["Option 4"],

option5:
a.Option5||
a["Option 5"]

}])

}

alert(
"Session Saved"
)

}


if(isJoin){

return <JoinSession/>

}

if(isActivity){

return <ActivityScreen/>

}


return(

<div
style={{
padding:"30px",
fontFamily:"Arial",
maxWidth:"900px",
margin:"auto"
}}
>

<h1>

Activity Engine 🚀

</h1>


<input
placeholder=
"Session Name"

value={
sessionName
}

onChange={
e=>
setSessionName(
e.target.value
)
}
/>

<br/><br/>


<input
type="number"

value={time}

onChange={
e=>
setTime(
e.target.value
)
}
/>

<br/><br/>


<input
type="number"

value={attempt}

onChange={
e=>
setAttempt(
e.target.value
)
}
/>

<br/><br/>


<input
type="number"

value={marks}

onChange={
e=>
setMarks(
e.target.value
)
}
/>

<br/><br/>


<input
type="file"
onChange={handleExcel}
/>

<br/><br/>


<button
onClick={
createSession
}
>

Create Session

</button>


{
sessionId&&(

<div>

<h2>

Session:
{sessionId}

</h2>

<QRCodeCanvas
value={
joinLink
}
/>

<p>

{joinLink}

</p>

</div>

)
}


<h2>

Participants Live

</h2>

<div>

Current Session:
{sessionId}

</div>

<div>

Count:
{participants.length}

</div>


{
participants.map(
(p,i)=>

<div
key={i}
style={{

padding:"10px",
margin:"10px",
border:
"1px solid #ddd"

}}
>

{p.team_name}

</div>

)
}

</div>

)

}
