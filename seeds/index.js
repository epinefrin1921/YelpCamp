const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');
const Campground = require('../models/campground');


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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            price: price,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea voluptatem delectus doloremque obcaecati, optio iure voluptatibus id temporibus laborum magnam sequi natus eum deserunt. Esse iusto eius a ducimus assumenda?'
        });
        await camp.save();
    }
}

seedDB();