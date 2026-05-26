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

const {
attributes,
listeners,
setNodeRef,
transform
}
=
useDraggable({id})

const style = {

transform: transform
? `translate3d(
${transform.x}px,
${transform.y}px,
0
)`
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

border:
"2px dashed gray",

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

const sensors =
useSensors(

useSensor(
PointerSensor
),

useSensor(
TouchSensor,{
activationConstraint:{
delay:100,
tolerance:5
}
})

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
teamName,
setTeamName
]=useState(
localStorage.getItem(
"team"
)||"Unknown"
)

const[
attemptNo,
setAttemptNo
]=useState(1)

const id=
window.location
.pathname
.split("/")
.pop()

useEffect(()=>{

load()

},[])

async function load(){

let{
data
}
=
await supabase
.from("activities")
.select("*")
.eq(
"session_id",
id
)

setQuestions(data)

}

function handleDragEnd(
event
){

const{
active,
over
}=event

if(over){

setPlaced(
prev=>({

...prev,

[over.id]:
active.id

}))

}

}

async function submitAnswers(){

await supabase
.from("submissions")
.insert([{

participant:
teamName,

session_id:
id,

attempt:
attemptNo,

score:
100-
(
(attemptNo-1)*20
),

time_taken:
Math.floor(
Date.now()/1000
)

}])

await supabase
.from("participants")
.update({

team_name:
teamName+
" | submitted"

})
.eq(
"team_name",
teamName
)

alert(
"Submitted"
)

setAttemptNo(
attemptNo+1
)

}

return(

<DndContext

sensors={sensors}

onDragEnd={
handleDragEnd
}

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

questions.map(
(q,index)=>{

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

.sort(
()=>Math.random()-0.5
)

const answers=[

q.right1,
q.right2,
q.right3,
q.right4

]

.filter(Boolean)

return(

<div
key={index}

style={

{
border:
"1px solid #ddd",

padding:"20px",

marginBottom:
"30px"
}

}

>

<h2>

{q.problem}

</h2>

{

answers.map(
(a,i)=>

<DropBox

key={i}

id={
q.id+
"-"+i
}

value={

placed[
q.id+
"-"+i
]

}

/>

)

}

<div>

{

options.map(
(o,optIndex)=>

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

)

}

</div>

</div>

)

}

)

}

<button
onClick={
submitAnswers
}

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
