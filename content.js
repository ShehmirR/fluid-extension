let buttonStatus = false;
let numLogins = 0;

function onInit() {
    let login = document.getElementById("login");
    let buttonClone = login.cloneNode(true)
    buttonClone.style.background = "rgb(91,91,91)"
    buttonClone.id = "fluidButton"
    buttonClone.innerText = "Toggle Fluid Login: Off";
    login.parentNode.insertBefore(buttonClone, login.nextElementSibling)

    $(document).on("click", "#fluidButton", function (event) {
        event.preventDefault();
        if (!buttonStatus) {
            buttonStatus = true;
            fillField("username","fluidiscool@fluid.cx")
            fillField("password","fluidIsCool123")
            $(this).css("background-color", "rgb(204,0,0)")
            $(this).text(`Fluid Login: On  [0]`)
            numLogins = 0;
            chrome.runtime.sendMessage({"message": "buttonStatus", "status": true});
        } else {
            buttonStatus = false;
            $("#username").val('');
            $("#password").val('');
            $(this).css("background-color", "rgb(91,91,91)")
            $(this).text(`Fluid Login: Off`)
            chrome.runtime.sendMessage({"message": "buttonStatus", "status": false});
        }
    })
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "sent_login" ) {
            numLogins++;
            $("#fluidButton").text(`Fluid Login: On  [${numLogins}]`)
        }
    }
);

function fillField(id, value) {
    let element = document.getElementById(id)
    if (element) {
        element.focus();
        element.value = value;
		element.dispatchEvent(new Event('change'));
		element.blur();
    }
}

var waitForEl = function(selector, callback) {
    if ($(selector).length) {
        callback();
    } else {
        setTimeout(function() {
            waitForEl(selector, callback);
        }, 500);
    }
};

waitForEl("#login", function() {
    onInit();
    clearInterval(waitForEl);
});