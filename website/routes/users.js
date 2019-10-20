var express = require('express');
var router = express.Router();

var db = require("firebase-admin").firestore()
//cloudinary upload.
var { upload } = require('../cloudinary/upload');


// User login
router.post('/login/success', (req, res) => {

  //save u uid to session
  var user = req.body.providerData[0];
  req.session.username = user.displayName;
  req.session.uid = user.uid;
  req.session.is_auth = true;
  req.session.is_org = false;
  // response to app.
  return res.send("To app");
})

router.get('/upload', (req, res) => {
  // show upload .html
  
  res.render('upload/uploadUser', {successMsg: req.flash('success'), errorMsg: req.flash('error')});
})



router.post('/upload/data', (req, res) => {

  if (!req.session.is_auth || req.session.is_auth == undefined) {
    res.redirect('/users/login');
  }

  if (!req.files || req.files.length === 0) {
    res.json({ saved: "false", "msg": "no file selected", "code": "err" })
  }
  else {
    // upload file to cloudinary 1 move to tmp then upload to cloudinary.
    var sampleFile = req.files.sampleFile;
    var filePath = sampleFile.tempFilePath;
    console.log(sampleFile.mimetype)
    if (sampleFile.mimetype != 'application/pdf' && sampleFile.mimetype != "application/msword") {
      req.flash("error", "Invalid file type");
      res.redirect('/users/upload');
    }

    upload(filePath, "raw", (err, result) => {
      if (err) {
        console.log(err);
        req.flash("error", JSON.stringify(err));
        res.redirect('/users/upload');
      }
      else {
        console.log(result);
        var url = result.url;
        var dl_url = result.url;
        var uploader = req.session.username;
        var uid = req.session.uid;
        var title = req.body.title;
        var description = req.body.description;
        var tags = make_array_of_tags(req.body.tags);

        tags.push(title.replace('/ ', '/').toLowerCase());
        tags.push(uploader.replace('/ ', '/').toLowerCase());
        console.log(tags);

        var obj = {
          title: title,
          description: description,
          tags: tags,
          uploader: uploader,
          url: url,
          dl_url: dl_url,
          uid: uid
        }

        var fileName = Math.random().toString(36).substr(10);

        //push in yet to be verified.
        var unverified = db.collection('unverified');
        // save to db (unverified);
        unverified.doc(fileName.toString()).set(obj)
          .then(resp => {
            console.log(resp);
            req.flash('success', "Uploaded succesfully");
            res.redirect('/users/upload');
          })
          .catch(err => {
            console.log(err);
            req.flash('error', "Unable to Upload");
            res.redirect('/users/upload');
          })
      }
    })
  }
})



// when user shares a link
router.post('/upload/share', (req, res) => {
  var tags = make_array_of_tags(req.body.tags);
  tags.push(req.body.title.replace('/ ', '/').toLowerCase());
  tags.push(req.body.uploader.replace('/ ', '/').toLowerCase());
  
  var obj = {
    url: req.body.link,
    dl_url: req.body.link,
    uploader: req.session.username,
    uid: req.session.uid, //user uid
    title: req.body.title,
    description: req.body.description,
    tags: make_array_of_tags(req.body.tags),
    is_org: false
  }
  console.log(obj);
  var name = Math.random().toString(36).substr(10);

  //push in yet to be verified.
  var unverified = db.collection('unverified');
  // save to db (unverified)
  unverified.doc(name.toString()).set(obj)
    .then(resp => {
      console.log(resp);
      req.flash('success', "Success")
      res.redirect('/users/upload');
    })
    .catch(err => {
      console.log(err);
      req.flash('error', "Error");
      res.redirect('/users/upload');
    })



});

function make_array_of_tags(tagsString) {
  console.log(tagsString);
  var tags = tagsString.split(',');
  console.log(tags);
  return tags;
}


module.exports = router;
