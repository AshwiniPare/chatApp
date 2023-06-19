async function signUp(event)
{
    try {
        event.preventDefault();
        
        const name = event.target.userName.value;
        const email = event.target.userEmail.value;
        const phone = event.target.userPhone.value;
        const password = event.target.userPassword.value;
    
        const signUpDetails = {
            name,
            email,
            phone,
            password
        }
        
        const response = await axios.post('http://localhost:3000/user/add-user', signUpDetails);
            alert(response.data.message);
    }
    catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err}</div>`
        console.error(err);
    }   
}
