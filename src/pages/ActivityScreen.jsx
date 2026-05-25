import React,{useState,useEffect} from "react";
import supabase from "../services/supabase";

import {
DndContext,
useDraggable,
useDroppable
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

const style=transform
?{
transform:
`translate3d(
${transform.x}px,
${transform.y}px,
0
)`
}
:{}

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

return(

<DndContext
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
o=>

<DragCard

key={o}

id={o}

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

<button>

Submit

</button>

</div>

</DndContext>

)

}
