let msgInput = document.getElementById("msginput");
var provider = new firebase.auth.FacebookAuthProvider();
let userData = [];
let loginUser;
var key = firebase.database().ref("students").push().key;
let msgData = [];
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(user);
    document.getElementById("loginbtn").style.display = "none";
    document.getElementById("logOutbtn").style.display = "block";
    firebase
      .database()
      .ref("User")
      .on("value", function (data) {
        userData = Object.values(data.val());
        members(userData);
      });
    loginUser = user;
    firebase
  .database()
  .ref("Messeges")
  .on("value", function (msgs) {
    msgData = Object.values(msgs.val());
    messegeSend(msgData);
  });
  } else {
    document.getElementById("loginbtn").style.display = "block";
    document.getElementById("logOutbtn").style.display = "none";
  }
});

function members(userData) {
  document.getElementById("usersOnline").innerHTML = "";
  for (var i = 0; i < userData.length; i++) {
    if (userData[i].uid === loginUser.uid){
      document.getElementById("usersOnline").innerHTML += `
      <li id="users" class="users active">
      You
      </li>
      `;
    }else if(userData[i].uid !== loginUser.uid){
      document.getElementById("usersOnline").innerHTML += `
      <li id="users" class="users active">
      ${userData[i].name}
      </li>
      `;
    }
  }
}

function login() {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      var token = result.credential.accessToken;
      var user = result.user;
      document.getElementById("loginbtn").style.display = "none";
      document.getElementById("logOutbtn").style.display = "block";
      alert("login success");
      console.log(user.displayName);

      let User = {
        name: user.displayName,
        uid: user.uid,
        key: key,
      };
      firebase.database().ref("User").child(user.uid).set(User);
      document.getElementById('send').disabled = false

    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      console.log(error);
    });
}
function logOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      document.getElementById("loginbtn").style.display = "block";
      document.getElementById("logOutbtn").style.display = "none";
      alert("logout success");
      document.getElementById("usersOnline").innerHTML = "";
      document.getElementById('send').disabled = true
    })
    .catch(function (error) {});
  firebase.database().ref("User").child(loginUser.uid).remove();
}
function send() {
  if (msgInput.value === "") {
    return;
  }
  let msgObj = {
    name: loginUser.displayName,
    msg: msgInput.value,
    uid: loginUser.uid,
  };
  firebase.database().ref("Messeges").push(msgObj);
  msgInput.value = "";
}
firebase
  .database()
  .ref("Messeges")
  .on("value", function (msgs) {
    msgData = Object.values(msgs.val());
    messegeSend(msgData);
  });
function messegeSend(msgData) {
  console.log(loginUser);
  document.getElementById("messeges").innerHTML = "";
  console.log(msgData);
  for (let i = 0; i < msgData.length; i++) {
    if (msgData[i].uid === loginUser.uid) {
      document.getElementById("messeges").innerHTML += `
    <li id="msg" class="msg sending">
    <div class="msgdiv"> <p class="Name">You</p> <p>${msgData[i].msg}</p> </div>
    </li>
    `;
    } else if (msgData[i].uid !== loginUser.uid) {
      document.getElementById("messeges").innerHTML += `
      <li id="msg" class="msg receiving ">
      <div class="msgdiv"> <p class="Name">${msgData[i].name}</p> <p>${msgData[i].msg}</p> </div>
      </li>
      `;
    }

  }



  console.log(msgData + loginUser.uid);
}
var input = document.getElementById("msginput");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("send").click();
  }
});
