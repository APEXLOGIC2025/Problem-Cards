import React,{useState} from "react";
import {QRCodeCanvas} from "qrcode.react";
import * as XLSX from "xlsx";

export default function App(){

const [sessionName,setSessionName]=useState("")
const [time,setTime]=useState(10)
const [attempt,setAttempt]=useState(3)
const [marks,setMarks]=useState(100)

const [sessionId,setSessionId]=useState("")
const [joinLink,setJoinLink]=useState("")

const [activities,setActivities]=useState([])

function createSession(){

const id=Math.random()
.toString(36)
.substring(2,7)
.toUpperCase()

setSessionId(id)

setJoinLink(
window.location.origin+
"/join/"+id
)

}

function handleExcel(e){

const file=e.target.files[0]

const reader=new FileReader()

reader.onload=(evt)=>{

const workbook=
XLSX.read(
evt.target.result,
{type:"binary"}
)

const sheet=
workbook.Sheets[
workbook.SheetNames[0]
]

const data=
XLSX.utils.sheet_to_json(sheet)

setActivities(data)

}

reader.readAsBinaryString(file)

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

<div
style={{
border:"1px solid #ddd",
padding:"20px"
}}
>

<h2>Host Dashboard</h2>

<p>Session Name</p>

<input
value={sessionName}
onChange={(e)=>
setSessionName(e.target.value)}
style={{
width:"100%",
padding:"10px"
}}
/>

<p>Time Limit</p>

<input
type="number"
value={time}
onChange={(e)=>
setTime(e.target.value)}
style={{
width:"100%",
padding:"10px"
}}
/>

<p>Max Attempts</p>

<input
type="number"
value={attempt}
onChange={(e)=>
setAttempt(e.target.value)}
style={{
width:"100%",
padding:"10px"
}}
/>

<p>Total Marks</p>

<input
type="number"
value={marks}
onChange={(e)=>
setMarks(e.target.value)}
style={{
width:"100%",
padding:"10px"
}}
/>

<p>Upload Excel</p>

<input
type="file"
onChange={handleExcel}
/>

<br/><br/>

<button
onClick={createSession}>
Create Session
</button>

</div>

{sessionId && (

<div
style={{
border:"1px solid #ddd",
padding:"20px",
marginTop:"20px"
}}
>

<h2>Session Created</h2>

<p>

Session ID:

<b>{sessionId}</b>

</p>

<QRCodeCanvas
value={joinLink}
/>

<p>

{joinLink}

</p>

</div>

)}

{activities.length>0 &&(

<div
style={{
marginTop:"20px",
border:"1px solid #ddd",
padding:"20px"
}}
>

<h2>
Loaded Activities
</h2>

{

activities.map(
(a,i)=>(

<div
key={i}
style={{
marginBottom:"20px"
}}
>

<h3>

{a.Problem}

</h3>

<p>

Correct:

{a.Right1}

{a.Right2}

{a.Right3}

</p>

</div>

)

)

}

</div>

)}

</div>

)

}
