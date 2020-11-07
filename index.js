const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require("./utils/catchAync");
const Campground = require('./models/campground');
const catchAync = require("./utils/catchAync");
const ExpressError = require('./utils/ExpressError')
const { campgroundSchema } = require('./schemas.js');

// const { privateEncrypt } = require("crypto");

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log("Connected to DB succesfully!");
}).catch(err => {
  console.log("Error occured when connecting to DB");
  console.log(err);
});


const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
  }
  else {
    next();
  }
}

app.get("/", function (req, res) {
  res.render('home.ejs');
})

app.get('/campgrounds', catchAync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', async (req, res) => {
  res.render('campgrounds/new');
})

app.get('/campgrounds/:id', catchAync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground })
}))

app.post('/campgrounds', validateCampground, catchAync(async (req, res, next) => {
  // if (!req, body.campground) {
  //   throw new ExpressError("Invalid Campground Data", 400);
  // }
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  res.redirect(`/campgrounds`);
}))

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found!', 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, Something Went Wrong!";
  res.status(statusCode).render('error', { err });
})

app.listen(3000, function () {
  console.log("App listening on port 3000");
})


