var express = require('express');
var router = express.Router();

var db = require('firebase-admin').firestore();

var { upload } = require('../cloudinary/upload')


/* Organization login success */
router.post('/login/success', (req, res) => {

    //save uuid to session
    var user = req.body.providerData[0];
    req.session.username = req.body.displayName;
    req.session.uid = user.uid;
    req.session.is_auth = true;
    req.session.is_org = true;

    // save organization in db.
    var organizations = db.collection("organization").doc(user.uid.toString());
    var obj = {
        name: user.displayName,
        uid: user.uid,
        courses: []
    }
    // save org in db
    organizations.set(obj)
        .then(result => {
            res.send({ msg: 'ok' });
        })
        .catch(err => {
            console.log(err);
            res.send({ error: err })
        })

})

router.use((req, res, next) => {
    if (req.session.is_org) {
        next();
    }
    else {
        res.redirect('/login');
    }
});

router.get('/create-course', (req, res) => {
    res.render('createCourse');
})

router.post('/create-course', (req, res) => {
    var coursename = req.body.coursename;
    var description = req.body.description;
    var tags = make_array_of_tags(req.body.tags);
    var uploader = req.session.username;
    var uid = req.session.uid;

    // push some more info in tag
    tags.push(uploader.trim().toLowerCase());
    tags.push(coursename.trim().toLowerCase());

    // create course in db,

    var obj = {
        coursename: coursename,
        description: description,
        tags: tags,
        uploader: uploader,
        uid: uid,
        lectures: [],
    }

    db.collection('courses').doc(coursename).get()
        .then(snapshot => {
            if (snapshot.data() != undefined) {
                res.send('Course already exist');
            }
            else {
                var courses = db.collection('courses').doc(coursename.toString());
                courses.set(obj)
                    .then(result => {

                        // add course to organizations.
                        db.collection('organization').doc(uid).get()
                            .then(resp => {
                                //console.log(resp);
                                var organiz = resp.data();
                                //console.log(organiz);
                                var courses = organiz.courses;
                                courses.push(coursename);
                                organiz.courses = courses;
                                //console.log(organiz);
                                db.collection('organization').doc(uid).set(organiz)
                                    .then(response => {
                                        res.redirect(`/courses/${coursename}`);
                                    })
                                    .catch(err => {
                                        req.flash('msg', JSON.stringify(err));
                                        res.redirect('/organization/create-course');
                                    })

                            })
                            .catch(err => {
                                console.log(err);
                                req.flash('msg', JSON.stringify(err));
                                res.redirect('/organization/create-course');
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('msg', JSON.stringify(err));
                        res.redirect('/organization/create-course');
                    })
            }
        })
        .catch(err => {
            req.flash('msg', JSON.stringify(err));
            res.redirect('/organization/create-course');
        })

})



router.get('/upload', (req, res) => {
    res.redirect('/organization/create-course');
})

router.post('/upload/data', (req, res) => {

    console.log(req.body)
    var uid = req.session.uid;
    var coursename = req.body.coursename;
    var title = req.body.title;
    var is_yt = false;

    console.log(coursename);

    if (!req.session.is_auth || req.session.is_auth == undefined) {
        res.redirect('/login');
    }

    if (!req.files || req.files.length === 0) {
        req.flash('msg', "No files selected");
        res.redirect(`/organization/${coursename}`);
    }
    else {
        // upload file to cloudinary 1 move to tmp then upload to cloudinary.

        var file = req.files.sampleFile;
        var filePath = file.tempFilePath;
        console.log(file)

        if (file.mimetype != 'video/mp4' && file.mimetype != "video/x-matroska" && file.mimetype != "video/3gp") {
            req.flash('msg', "Invalid file type");
            res.redirect(`/organization/${coursename}`);
        }

        else {
            upload(filePath, "video", (err, result) => {
                if (err) {
                    console.log(err);
                    req.flash('msg', JSON.stringify(err));
                    res.redirect(`/organization/courses/${coursename}`);
                }
                else {
                    //console.log(result);
                    var url = result.url;
                    //console.log(url);
                    var course = db.collection('courses').doc(coursename);
                    course.get()
                        .then(snap => {
                            if (!snap.empty) {
                                var data = snap.data();
                                var lectures = data.lectures;
                                // push title in tag to make search easy
                                var tags = data.tags;
                                tags.push(title.trim().toLowerCase());
                                var obj = {
                                    title: title,
                                    url: url,
                                    is_yt: is_yt
                                };
                                lectures.push(obj);
                                data.lectures = lectures;
                                console.log(lectures);
                                db.collection('courses').doc(coursename.toString()).set(data)
                                    .then(snap => {
                                        req.flash('msg', 'Success');
                                        res.redirect(`/courses/${coursename}`);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        req.flash('msg', 'Some error occured');
                                        res.redirect(`/courses/${coursename}`);
                                    })
                            }
                            else {
                                res.redirect(`/organization/create-course/`, { error: "Course do not exist, Craete one." })
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.redirect(`/courses/${coursename}`, { error: "Error in uploading, try again." })
                        })
                }
            })
        }
    }

});

//share link to youtube

router.post('/upload/share/video', (req, res) => {
    var uid = req.session.uid;
    var coursename = req.body.coursename;
    var title = req.body.title;
    var url = req.body.link;
    var is_yt = true;
    db.collection('courses').doc(coursename.toString()).get()
        .then(snap => {
            if (!snap.empty) {
                var data = snap.data();
                var lectures = data.lectures;
                // push title in tag to make search easy
                var tags = data.tags;
                tags.push(title.trim().toLowerCase());
                var obj = {
                    title: title,
                    url: url,
                    is_yt: is_yt
                };
                lectures.push(obj);
                data.lectures = lectures;
                console.log(lectures);
                db.collection('courses').doc(coursename.toString()).set(data)
                    .then(snap => {
                        req.flash('msg', 'Success');
                        res.redirect(`/courses/${coursename}`);
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('msg', 'Some error occured');
                        res.redirect(`/courses/${coursename}`);
                    })
            }
            else {
                res.redirect(`/organization/create-course/`, { msg: "Course do not exist, Create one." })
            }
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect(`/courses/${coursename}`, { msg: "Error in uploading, try again." })
        })
})


// share link to pdf
router.post('upload/share/pdf', (req, res) => {
    var obj = {
        url: req.body.link,
        dl_url: req.body.link,
        uploader: req.body.username,
        uid: req.body.uid, //user uid,
        tags: make_array_of_tags(req.body.tags),
        title: req.body.title,
        is_org: true
    }
    var share_name = Math.random().toString(36).substr(10);
    //push in yet to be verified.
    var files = db.collection('files');
    files.doc(share_name).set(obj) // save to db.

    // update organization db.
    var uid = req.session.uid;
    // get organozation and save shared video in their.
    var organization = db.collection("organizations").doc(uid.toString());
    organization.get()
        .then(doc => {
            if (!doc.exist) {
                console.log("No user found");
                return res.json({ "msg": "User does not exist", "code": "err" });
            }
            var organization = doc.data();
            var sharedPdfs = organization.sharedPdfs;
            sharedPdfs.push(share_name);
            organization.sharedPdfs = sharedPdfs;

            var organization_db = db.collection('organizations').doc(uid.toString());
            organization_db.set(organization);
            return res.json({ "msg": "" });
        })
        .catch(err => {
            console.log(err);
            return res.json({ "code": "err", "msg": JSON.stringify(err) });
        })

})


function make_array_of_tags(tagsString) {
    console.log(tagsString);
    var tags = tagsString.split(',');
    console.log(tags);
    return tags;
}



module.exports = router;
