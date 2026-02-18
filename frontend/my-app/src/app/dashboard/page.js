'use client'
export default function DashBoard(){
    const token=localStorage.getItem("token");
    return (
        <div>
            hello {localStorage.getItem("username")} your Token is {token}
            <button type="button" onClick={()=>{
                localStorage.removeItem("token");
                window.location.href="/";
            }
                }>Logout</button>
        </div>
    );
}