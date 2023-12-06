var btn1 = document.querySelector('#green');
var btn2 = document.querySelector('#red');
console.log("hi")
btn1.addEventListener('click', function () {

  if (btn2.classList.contains('red')) {
    btn2.classList.remove('red');
  }
  this.classList.toggle('green');

});

btn2.addEventListener('click', function () {

  if (btn1.classList.contains('green')) {
    btn1.classList.remove('green');
  }
  this.classList.toggle('red');

});

function getCookieValue(name) {
  const regex = new RegExp(`(^| )${name}=([^;]+)`)
  const match = document.cookie.match(regex)
  if (match) {
    return match[2]
  }
}

function likePost(projectId) {

  let isLoggedIn = getCookieValue('isLoggedIn');
  console.log("cookie: Login", isLoggedIn)

  console.log("post id", projectId);
  if(isLoggedIn){

    console.log("post liked", projectId);
    fetch('/like', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'projectId': projectId
        })
      })
      .then(res => res.json())
      .then(result => {
        console.log("result got: ", result.data.likes);
  
        // Get the button element by its ID
        // var button = document.getElementById('green');
        var projectCard = document.querySelector('[project-id="' + projectId + '"]');
        // Find the p tag within the button using querySelector
        var button = projectCard.querySelector('button');
        var likesCount = button.querySelector('p');
        likesCount.textContent = result.data.likes.length;
        button.classList.toggle('green');
      })

  }
  else{
    console.log("You are not Logged In!")
  }
}