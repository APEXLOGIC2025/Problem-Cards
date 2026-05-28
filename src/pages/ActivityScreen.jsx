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
?
`translate3d(${transform.x}px,${transform.y}px,0)`
:
undefined,

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
useDroppable({id})

return(

<div
ref={setNodeRef}

style={{

width:"160px",
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
]
=
useState([])

const[
placed,
setPlaced
]
=
useState({})

const[
attempts,
setAttempts
]
=
useState({})

const[
completed,
setCompleted
]
=
useState({})

const id=
window.location.pathname
.split("/")
.pop()

const teamName=
localStorage.getItem("team")
||
"Unknown"

useEffect(()=>{

load()

},[])

async function load(){

const{
data,
error
}
=
await supabase
.from("activities")
.select("*")
.eq("session_id",id)

if(error){

console.log(error)
return

}

setQuestions(data||[])

}

function handleDragEnd(event){

const{
active,
over
}=event

if(over){

const actual=
active.id
.split("-")
.slice(2)
.join("-")

setPlaced(prev=>({

...prev,

[over.id]:
actual

}))

}

}

async function submitQuestion(q,index){

if(completed[q.id]){

alert("Already Correct")
return

}

const currentAttempt=
(attempts[q.id]||0)+1

if(currentAttempt>5){

alert("Max Attempts Over")
return

}

const correctAnswers=[

q.right1,
q.right2,
q.right3,
q.right4

]
.filter(Boolean)
.sort()

const userAnswers=[

placed[q.id+"-0"],
placed[q.id+"-1"],
placed[q.id+"-2"],
placed[q.id+"-3"]

]
.filter(Boolean)
.sort()

const isCorrect=
JSON.stringify(correctAnswers)
===
JSON.stringify(userAnswers)

setAttempts(prev=>({

...prev,

[q.id]:
currentAttempt

}))

if(!isCorrect){

alert(
"Wrong Answer Attempt "
+currentAttempt
)

return

}

const sessionMinutes=10

const perQuestionTime=
(sessionMinutes*60)
/questions.length

const startTime=
Number(
localStorage.getItem(
"startTime"
)
)

const elapsed=
Math.floor(
(Date.now()-startTime)/1000
)

const remaining=
Math.max(
perQuestionTime-elapsed,
0
)

const timeFactor=
remaining/perQuestionTime

const attemptFactorMap={

1:1,
2:0.9,
3:0.8,
4:0.7,
5:0.6

}

const attemptFactor=
attemptFactorMap[currentAttempt]

const questionMarks=
Number(q.marks || 0)

const finalScore=
Math.round(

questionMarks
*
timeFactor
*
attemptFactor

)

await supabase
.from("submissions")
.insert([{

participant:teamName,

session_id:id,

attempt:currentAttempt,

score:finalScore,

question_id:q.id

}])

setCompleted(prev=>({

...prev,

[q.id]:true

}))

await supabase
.from("participants")
.update({

team_name:
teamName+
" | submitted"

})
.eq("session_id",id)
.eq("team_name",teamName)

alert(
"Correct! Score: "
+finalScore
)

}

return(

<DndContext
sensors={sensors}
onDragEnd={handleDragEnd}
>

<div style={{padding:"20px"}}>

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

]
.filter(Boolean)

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
key={q.id}

style={{

border:"1px solid #ddd",
padding:"20px",
marginBottom:"30px"

}}
>

<h2>

{q.problem}

</h2>

<div style={{display:"flex",flexWrap:"wrap"}}>

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

options.map((o,i)=>(

<DragCard

key={q.id+"-"+i}

id={
q.id+
"-"+
i+
"-"+
o
}

label={o}

/>

))

}

</div>

<button

onClick={()=>
submitQuestion(q,index)
}

disabled={
completed[q.id]
||
(attempts[q.id]||0)>=5
}

style={{

marginTop:"15px",
padding:"10px"

}}
>

{

completed[q.id]
?
"Completed"
:
"Submit Question"

}

</button>

<div>

Attempts:
{attempts[q.id]||0}
/5

</div>

</div>

)

})

}

</div>

</DndContext>

)

}
