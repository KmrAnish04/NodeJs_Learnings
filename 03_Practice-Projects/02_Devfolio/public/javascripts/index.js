console.log("You're on Home Page!");
let isLoggedIn = getCookieValue('isLoggedIn');
console.log("cookie: Is User LoggedIn", isLoggedIn)


function getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match) {
        return match[2]
    }
}