var provider = new firebase.auth.GoogleAuthProvider();

function signIn(user) {
    var displayName = "";
    if (!user) {
        //check name inputed
        displayName = document.getElementById("organization_name").value;
        if (displayName == "" || displayName == undefined) {
            return alert('Enter organization name first.');
        }
    }
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        console.log(token);

        var url = "/users/login/success";
        if (!user) {
            url = "/organization/login/success";
            // update user's displaye name.
            firebase.auth().currentUser.updateProfile({
                displayName: displayName
            })
                .then(() => {
                    // update succesful.
                    result.user.organization = displayName;
                    //alert(result.user.organization);
                    fetch(url, {
                        method: "POST",
                        body: JSON.stringify(result.user),
                        cache: "no-cache",
                        headers: new Headers({
                            "content-type": "application/json"
                        })
                    })
                        .then(res => {
                            console.log(res);
                            window.location.href = "/";
                        })
                        .catch(err => {
                            console.log(err);
                        })

                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            fetch(url, {
                method: "POST",
                body: JSON.stringify(result.user),
                cache: "no-cache",
                headers: new Headers({
                    "content-type": "application/json"
                })
            })
                .then(res => {
                    console.log(res);
                    window.location.href = "/";
                })
                .catch(err => {
                    console.log(err);
                })
        }
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        console.log(error);
    });
}

