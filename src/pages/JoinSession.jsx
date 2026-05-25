import React,{useState,useEffect} from "react";
import supabase from "../services/supabase";

export default function JoinSession(){

const [team,setTeam]=useState("")
const [session,setSession]=useState("")

useEffect(()=>{

const path=
window.location.pathname

const id=
path.split("/").pop()

setSession(id)

},[])

async function join(){

if(!team)return

localStorage.setItem(
"team",
team
)

await supabase
.from("participants")
.insert([{
session_id:session,
team_name:team
}])

window.location=
"/activity/"+session

}

return(

<div
style={{
padding:"40px",
maxWidth:"500px",
margin:"auto",
fontFamily:"Arial"
}}
>

<h1>

Join Session

</h1>

<p>

Session:

<b>{session}</b>

</p>

<input
placeholder="Team Name"
value={team}
onChange={
e=>setTeam(
e.target.value
)
}
style={{
width:"100%",
padding:"10px"
}}
/>

<br/><br/>

<button
onClick={join}
>

Join

</button>

</div>

)

}
