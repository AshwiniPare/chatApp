const token = localStorage.getItem('token');
const getChatsCalled = setInterval(getChats, 1000);

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const decodedToken = parseJwt(token);
        console.log(decodedToken);
        getChats();
        
    } catch(error) {
        console.error(error);
    }
})

async function getChats(page) {
    try {
      
        const response = await axios.get(`http://localhost:3000/chat/get-chat`, { headers: {"Authorization": token}})
        document.getElementById('chatsDiv').innerHTML ="";
        for(let i=0; i<response.data.allChats.length; i++) {
            const para = document.createElement("p");
            if(i%2 == 0)
                para.style.backgroundColor = "grey";
            const node = document.createTextNode(response.data.allChats[i].user.name + ": "+ response.data.allChats[i].message);
            para.appendChild(node);

            const element = document.getElementById("chatsDiv");
            element.appendChild(para);
          
        }
        }
    catch(error) {
        console.log(error);
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function send(event) {
    console.log('inside send method');
    try {
        event.preventDefault();
        const msg = event.target.message.value;
        console.log('inside send method2 ', msg);
        const message = {
           msg
        }
        
        const response = await axios.post('http://localhost:3000/chat/add-message', message, { headers: {"Authorization": token}});
        getChats(response.data.allChats);
    } catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err.response.data.message}</div>`
        console.error(err);
    }
}