import React,{useState,useEffect} from "react";
import supabase from "../services/supabase";

import {
DndContext,
useDraggable,
useDroppable,
PointerSensor,
TouchSensor,
useSensor,
useSensors
}
from "@dnd-kit/core";

function DragCard({id,label}){

const{
attributes,
listeners,
setNodeRef,
transform
}
=
useDraggable({id})

const style={

transform:transform
?`translate3d(${transform.x}px,${transform.y}px,0)`
:undefined,

touchAction:"none"

}

return(

<div
ref={setNodeRef}
{...listeners}
{...attributes}

style={{

padding:"10px",
border:"1px solid black",
margin:"5px",
display:"inline-block",
cursor:"grab",
background:"#f4f4f4",
borderRadius:"8px",
...style

}}
>

{label}

</div>

)

}

function DropBox({id,value}){

const{
setNodeRef
}
=
useDroppable({
id
})

return(

<div
ref={setNodeRef}

style={{

width:"140px",
height:"50px",
border:"2px dashed gray",
margin:"10px",

display:"flex",
alignItems:"center",
justifyContent:"center"

}}
>

{value||"Drop Here"}

</div>

)

}

export default function ActivityScreen(){

const sensors=
useSensors(

useSensor(PointerSensor),

useSensor(
TouchSensor,
{
activationConstraint:{
delay:100,
tolerance:5
}
}
)

)

const[
questions,
setQuestions
]=useState([])

const[
placed,
setPlaced
]=useState({})

const[
attempts,
setAttempts
]=useState({})

const[
teamName
]=useState(
localStorage.getItem("team")||"Unknown"
)

const sessionId=
window.location.pathname
.split("/")
.pop()

useEffect(()=>{

loadQuestions()

},[])

async function loadQuestions(){

const { data,error } =
await supabase
.from("activities")
.select("*")
.eq("session_id",sessionId)

console.log("SESSION =",sessionId)
console.log("QUESTIONS =",data)
console.log("ERROR =",error)

setQuestions(data||[])

}
function handleDragEnd(event){

const{
active,
over
}=event

if(!over)return

const actualLabel=
active.id
.split("-")
.slice(2)
.join("-")

setPlaced(prev=>({

...prev,

[over.id]:
actualLabel

}))

}

async function submitAnswers(){

let totalScore=0

const startTime=
Number(
localStorage.getItem("startTime")
)

if(!startTime){

localStorage.setItem(
"startTime",
Date.now()
)

}

for(let q of questions){

const correctAnswers=[

q.right1,
q.right2,
q.right3,
q.right4

].filter(Boolean)

let userAnswers=[]

for(let i=0;i<correctAnswers.length;i++){

userAnswers.push(
placed[q.id+"-"+i]
)

}

const isCorrect=

JSON.stringify(
[...userAnswers].sort()
)

===

JSON.stringify(
[...correctAnswers].sort()
)

const prevAttempt=
attempts[q.id]||0

const currentAttempt=
prevAttempt+1

const questionTime=
(10*60)/questions.length

const elapsed=
(Math.floor(Date.now()/1000))
-
Math.floor(startTime/1000)

const remaining=
Math.max(
0,
questionTime-elapsed
)

const timeFactor=
remaining/questionTime

const attemptFactor=
1-((currentAttempt-1)*0.1)

const questionMarks=
Number(q.marks||0)

let earned=0

if(isCorrect){

console.log("CORRECT")

console.log("questionMarks =",questionMarks)

console.log("timeFactor =",timeFactor)

console.log("attemptFactor =",attemptFactor)

earned=
questionMarks*
timeFactor*
attemptFactor

console.log("earned =",earned)

}
totalScore+=earned

setAttempts(prev=>({

...prev,

[q.id]:
currentAttempt

}))

await supabase
.from("submissions")
.insert([{

participant:teamName,

session_id:sessionId,

question_id:q.id,

attempt:currentAttempt,

score:Math.round(earned),

time_taken:elapsed

}])

}

await supabase
.from("participants")
.update({

team_name:
teamName+" | submitted"

})
.eq(
"session_id",
sessionId
)
.eq(
"team_name",
teamName
)

alert(
"Submitted. Score: "+
Math.round(totalScore)
)

}

return(

<DndContext
sensors={sensors}
onDragEnd={handleDragEnd}
>

<div
style={{
padding:"20px"
}}
>

<h1>

Activity

</h1>

{

questions.map((q,index)=>{

const correctAnswers=[

q.right1,
q.right2,
q.right3,
q.right4

].filter(Boolean)

const options=[

q.right1,
q.right2,
q.right3,
q.right4,

q.option1,
q.option2,
q.option3,
q.option4,
q.option5

]
.filter(Boolean)
.sort(()=>Math.random()-0.5)

return(

<div
key={index}

style={{

border:"1px solid #ddd",
padding:"20px",
marginBottom:"30px"

}}
>

<h2>

{q.problem}

</h2>

<div
style={{
display:"flex",
flexWrap:"wrap"
}}
>

{

correctAnswers.map((a,i)=>(

<DropBox

key={i}

id={q.id+"-"+i}

value={placed[q.id+"-"+i]}

/>

))

}

</div>

<div>

{

options.map((o,optIndex)=>(

<DragCard

key={
q.id+"-"+optIndex
}

id={
q.id+
"-"+
optIndex+
"-"+
o
}

label={o}

/>

))

}

</div>

</div>

)

})

}

<button

onClick={submitAnswers}

style={{

padding:"12px",
fontSize:"18px"

}}
>

Submit Answers

</button>

</div>

</DndContext>

)

}
