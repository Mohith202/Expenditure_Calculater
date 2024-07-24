// Frontend/src/datafetch.js

const API_URL = 'https://expenditure-calculater.onrender.com/api/users'; // Replace with your actual backend URL

export async function fetchspendbydate(username,date) {
   console.log(date)
    const response = await fetch(`${API_URL}/Spending/get/bydate/${username}`,{
        method:'POST',
        headers:{
            'Content-Type':'applcation/json',
            },
            body:JSON.stringify({fromdate:date.startDate,todate:date.endDate})
    });
    if (!response.ok) {
        alert('Server Down. Please try again later');
    }
    return response.json();
}

export async function deletespend(userid) {
    console.log("upto url")
    const response = await fetch(`${API_URL}/Spending/delete/${userid}`, { method: 'DELETE' });
    console.log(response)
    return response
}

export async function updatespend(username, updatedspend) {
    const response = await fetch(`${API_URL}/Spending/update/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedspend)
    });
    return response
}

export async function createspend(username,newspend) {
    const response = await fetch(`${API_URL}/spending/create/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newspend)
    });
   
    return response

} 