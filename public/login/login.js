async function login(event)
{
    try {
        event.preventDefault();
        const email = event.target.userEmail.value;
        const password = event.target.userPassword.value;
    
        const loginDetails = {
            email,
            password
        }
        console.log("inside login");
        
            const response = await axios.post('http://localhost:3000/user/login', loginDetails);
            alert(response.data.message);
            localStorage.setItem('token', response.data.token)
            window.location.href = "../chatWindow/index.html";
    } catch(err) {
            document.body.innerHTML += `<div style="color:red;">${err.response.data.message}</div>`
            console.error(JSON.stringify(err));
        } 
}
