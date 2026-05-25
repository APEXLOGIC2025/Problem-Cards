import React,{useState} from "react";

export default function App(){

const [sessionName,setSessionName]=useState("")
const [time,setTime]=useState(10)
const [attempt,setAttempt]=useState(3)
const [marks,setMarks]=useState(100)

function createSession(){

const id=Math.random()
.toString(36)
.substring(2,7)
.toUpperCase()

alert(
"Session Created: "+id
)

}

return(

<div
style={{
padding:"30px",
fontFamily:"Arial",
maxWidth:"800px",
margin:"auto"
}}
>

<h1>
Activity Engine 🚀
</h1>

<div
style={{
border:"1px solid #ddd",
padding:"20px",
marginTop:"20px"
}}
>

<h2>
Host Dashboard
</h2>

<p>
Session Name
</p>

<input
value={sessionName}
onChange={(e)=>
setSessionName(
e.target.value
)
}
style={{
width:"100%",
padding:"10px"
}}
/>

<p>
Time Limit(min)
</p>

<input
type="number"
value={time}
onChange={(e)=>
setTime(
e.target.value
)}
style={{
width:"100%",
padding:"10px"
}}
/>

<p>
Max Attempts
</p>

<input
type="number"
value={attempt}
onChange={(e)=>
setAttempt(
e.target.value
)}
style={{
width:"100%",
padding:"10px"
}}
/>

<p>
Total Marks
</p>

<input
type="number"
value={marks}
onChange={(e)=>
setMarks(
e.target.value
)}
style={{
width:"100%",
padding:"10px"
}}
/>

<p>
Upload Excel
</p>

<input
type="file"
/>

<br/><br/>

<button
onClick={createSession}
style={{
padding:"12px",
cursor:"pointer"
}}
>

Create Session

</button>

</div>

</div>

)

}
