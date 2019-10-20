var express = require('express');
var router = express.Router();

var db = require('firebase-admin').firestore();

/* GET home page. */
router.get('/', function (req, res, next) {

  // get courses from db.
  var courses = db.collection('courses');
  courses.get()
    .then(snapshot => {
      var courses_arr = [];
      snapshot.forEach(doc => {
        courses_arr.push(doc);
      });
      var courses_data = [];
      courses_arr.forEach(course => {
        var data = course.data();
        data.id = course.id;
        courses_data.push(data);
      })

      // part courses in 4 

      part_courses = [];
      for (var i = 0; i < courses_data.length;) {
        var part = [];
        for (var j = i; j < i + 4 && j < courses_data.length; j++) {
          part.push(courses_data[j]);
        }
        //console.log(part)
        part_courses.push(part)
        i = i + 4;
      }
      //console.log(part_courses)
      res.render('courses', { msg: req.flash('error'), courses: part_courses, noData: courses_data.length === 0 })
    })
    .catch(err => {
      console.log(err);
      req.flash('error', "Error in getting courses");
      res.render('courses', { msg: req.flash('error') })
    })
});


// Get books/
router.get('/books', (req, res) => {

  var books = db.collection('unverified');
  books.get()
    .then(snapshot => {
      ///console.log(snapshot);
      if (!snapshot.empty) {
        var books_arr = [];
        snapshot.forEach(doc => {
          books_arr.push(doc);
        })
        var books_data = [];
        books_arr.forEach(book => {
          var data = book.data();
          data.id = book.id;
          books_data.push(data);
        })
        console.log(books_data)
        part_books = [];
        for (var i = 0; i < books_data.length;) {
          var part = [];
          for (var j = i; j < i + 4 && j < books_data.length; j++) {
            part.push(books_data[j]);
          }
          part_books.push(part);
          i = i + 4;
        }
        res.render('books', { error: req.flash('error'), data: part_books, noData: books_data.length === 0 })
      }
      else {
        res.render('books', { error: 'No Books found', noData: true })
      }
    })
    .catch(err => {
      console.log(err);
      req.flash('error', "Error in getting books");
      res.render('books', { error: req.flash('error') })
    })
})

router.get("/login", (req, res) => {
  if (req.session.is_auth) {
    return res.redirect('/');
  }
  else return res.render('login/login');
})

router.get("/logout", (req, res) => {
  if (!req.session.is_auth) {
    res.redirect('/login');
  }
  else {
    req.session.destroy();
    res.redirect('/');
  }
})

router.post('/search/course/', (req, res) => {
  console.log("Inside post search");
  var query = req.body.query;
  db.collection('courses').where('tags', 'array-contains', query.toLowerCase()).get()
    .then(snap => {
      if (!snap.empty) {
        data = [];
        snap.forEach(doc => {
          var data_push = doc.data();
          data_push.id = doc.id;
          data.push(data_push);
        })
        // part courses in 4 

        part_courses = [];
        for (var i = 0; i < data.length;) {
          var part = [];
          for (var j = i; j < i + 4 && j < data.length; j++) {
            part.push(data[j]);
          }
          //console.log(part)
          part_courses.push(part)
          i = i + 4;
        }
        console.log(part_courses)
        res.render('courses', { error: req.flash('error'), courses: part_courses, noData: data.length === 0 })
      }
      else {
        console.log("No result found");
        res.render('courses', { msg: 'No Result Found' })
      }
    })
    .catch(err => {
      console.log(err);
      res.render('courses', { msg: "Some Error occured" });
    })
})

// 
router.post('/search/books', (req, res) => {
  console.log("Inside post search");
  var query = req.body.query;
  db.collection('unverified').where('tags', 'array-contains', query.toLowerCase()).get()
    .then(snap => {
      if (!snap.empty) {
        data = [];
        snap.forEach(doc => {
          var data_push = doc.data();
          data_push.id = doc.id;
          data.push(data_push);
        })
        // part courses in 4 

        part_courses = [];
        for (var i = 0; i < data.length;) {
          var part = [];
          for (var j = i; j < i + 4 && j < data.length; j++) {
            part.push(data[j]);
          }
          //console.log(part)
          part_courses.push(part)
          i = i + 4;
        }
        console.log(part_courses)
        res.render('books', { error: req.flash('error'), data: part_courses, noData: data.length === 0 })
      }
      else {
        console.log("No result found");
        res.render('books', { msg: 'No Result Found' })
      }
    })
    .catch(err => {
      console.log(err);
      res.render('books', { msg: "Some Error occured" });
    })
})

router.get('/courses/:id', (req, res) => {
  var course_id = req.params.id;

  //fetch data from course from db.
  var course = db.collection('courses').doc(course_id);
  course.get()
    .then(snapshot => {
      if (!snapshot.empty) {
        var data = snapshot.data();
        console.log(data);
        var course_title = data.coursename;
        var uploader = data.uploader;
        var lectures = data.lectures;
        var description = data.description;
        var username = req.session.username;
        if (username === uploader) {
          res.render('courseOrganization', {
            error: null,
            coursename: course_title,
            lectures: lectures,
            uploader: uploader,
            description: description,
            id: course_id
          });
        }
        else {
          res.render('courseUser', {
            error: null,
            coursename: course_title,
            lectures: lectures,
            uploader: uploader,
            description: description,
            id: course_id,
            msg: req.flash('msg')
          });
        }
      }
      else {
        req.flash('error', "No Such course exist");
        res.render('courseUser', { msg: 'No such course exist' });
      }
    })
    .catch(err => {
      console.log(err);
      res.render('courseUser', { msg: JSON.stringify(err) });
    })
})

module.exports = router;
