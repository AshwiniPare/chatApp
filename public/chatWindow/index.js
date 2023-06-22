const token = localStorage.getItem('token');
let groupId;
const getChatsCalled = setInterval(getChats, 1000);

const newGroupButton = document.getElementById('newGroup');
console.log(newGroupButton);
newGroupButton.addEventListener("click", function newgroup() {
    console.log("inside btn")
    openForm();
    

})

async function openForm() {
    let parentElem = document.getElementById('contactForm');
    parentElem.innerHTML = "";

   let groupLabel = document.createElement('label');
    groupLabel.appendChild(document.createTextNode('Add group name'));
    var groupInput = document.createElement('input'); 
   groupInput.setAttribute("id", "groupInput");
    groupInput.type = "text"; 
    parentElem.appendChild(groupLabel);
    parentElem.appendChild(groupInput);
    var br = document.createElement('br');
    parentElem.appendChild(br);
   document.getElementById("contactForm").style.display = "block";
        try {
            const response = await axios.get(`http://localhost:3000/user/get-users`);
           for(let i=0; i< response.data.allUsers.length; i++) {
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = response.data.allUsers[i].id;
                checkbox.name = 'contact';
                checkbox.value = response.data.allUsers[i].name;
             
                var label = document.createElement('label')
                label.htmlFor = response.data.allUsers[i].name;
                label.appendChild(document.createTextNode(response.data.allUsers[i].name));
             
                var br = document.createElement('br');
             
                let container = document.getElementById('contactForm');
                container.appendChild(checkbox);
                container.appendChild(label);
                container.appendChild(br);
            }
            
        } catch(error) {
            console.error(error);
        }
        closeBtn = document.createElement('input');
        closeBtn.type = "button";;
        closeBtn.value = "Create Group";
        closeBtn.onclick = closeForm;
        parentElem.appendChild(closeBtn);
        document.getElementById("contactForm").style.display = "block";
        document.getElementById('userList').hidden = true;
  }

  async function closeForm() {
    let parentElem = document.getElementById('contactForm');
    const groupName = document.getElementById('groupInput').value;
    let checkboxes = document.querySelectorAll('input[name="contact"]:checked');
            let members = [];
            checkboxes.forEach((checkbox) => {
                members.push(checkbox.id);
            });
            if(members.length > 0) {
                const group = {
                    groupName,
                    members
                };
              const response = await axios.post('http://localhost:3000/group/add-group', group, { headers: {"Authorization": token}});
            }

          // parentElem.innerHTML = "";
           document.getElementById("contactForm").style.display = "none";
           newGroupButton.style = "hidden";
          // document.getElementById('userList').hidden = false;
  }

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const decodedToken = parseJwt(token);
        console.log(decodedToken);
        showUserList();
        getChats();
    } catch(error) {
        console.error(error);
    }
})

async function showUserList() {
    try {
        const response = await axios.get(`http://localhost:3000/user/get-users`)
        const parentElem = document.getElementById('userList');
        for(let i=0; i< response.data.allUsers.length; i++) {
            let individualBtn = document.createElement('input');
            individualBtn.type = "button";
            individualBtn.className = "memberBtn";
            individualBtn.id = response.data.allUsers[i].id;
            individualBtn.value = response.data.allUsers[i].name;
            individualBtn.onclick =  (event) => {
                getChats();
            }
            var br = document.createElement('br');
            parentElem.appendChild(individualBtn);
            parentElem.appendChild(br);
        }

        const groupResponse = await axios.get(`http://localhost:3000/group/get-groups`, { headers: {"Authorization": token}})
        for(let i=0; i< groupResponse.data.allGroups.length; i++) {
            groupBtn = document.createElement('input');
            groupBtn.type = "button";
            groupBtn.className = "memberBtn";
            groupBtn.id = groupResponse.data.allGroups[i].id;
            groupBtn.value = groupResponse.data.allGroups[i].name;
            groupBtn.onclick =  (event) => {
                groupId = event.target.id;
                groupBtnClicked();
            }
            var br = document.createElement('br');
            parentElem.appendChild(groupBtn);
            parentElem.appendChild(br);
        }
    } catch(err) {
        console.error(err);
    }
}

async function groupBtnClicked() {
    
    const response = await axios.get(`http://localhost:3000/chat/get-chat?groupId=${groupId}`, { headers: {"Authorization": token}})
    const allChats = response.data.allChats;
    document.getElementById('chatsDiv').innerHTML ="";
    for(let i=0; i<response.data.allChats.length; i++) {
        const para = document.createElement("p");
        if(i%2 == 0)
            para.style.backgroundColor = "light grey";
        const node = document.createTextNode(response.data.allChats[i].user.name + ": "+ response.data.allChats[i].message);
        para.appendChild(node);

        const element = document.getElementById("chatsDiv");
        element.appendChild(para);
    }
};

async function getChats() {
    try {
        let chatLocalStorage = JSON.parse(localStorage.getItem('chats'));
        let lastMsgId;
        if(chatLocalStorage) {
            lastMsgId = chatLocalStorage[chatLocalStorage.length-1].id;
        } 

        if(lastMsgId == undefined)
            lastMsgId = -1;
            
        const response = await axios.get(`http://localhost:3000/chat/get-chat?lastMsgId=${lastMsgId}`, { headers: {"Authorization": token}})
        const allChats = response.data.allChats;
        if(chatLocalStorage)
            chatLocalStorage = chatLocalStorage.concat(allChats);
        else
            chatLocalStorage = allChats;
        localStorage.setItem('chats', JSON.stringify(chatLocalStorage));
        chatLocalStorage = JSON.parse(localStorage.getItem('chats'));
        if(chatLocalStorage.length > 10) {
            chatLocalStorage = chatLocalStorage.slice(-10);
        }

        document.getElementById('chatsDiv').innerHTML ="";
        for(let i=0; i<chatLocalStorage.length; i++) {
            const para = document.createElement("p");
            if(i%2 == 0)
                para.style.backgroundColor = "grey";
            const node = document.createTextNode(chatLocalStorage[i].user.name + ": "+ chatLocalStorage[i].message);
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
           msg,
           groupId
        }
        
        const response = await axios.post('http://localhost:3000/chat/add-message', message, { headers: {"Authorization": token}});
        if(!groupId)
            getChats();
        else {
            groupBtnClicked();
        }
        document.getElementById('message').value = '';
    } catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err.response.data.message}</div>`
        console.error(err);
    }
}