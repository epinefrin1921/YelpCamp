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

    for (let i = 0; i < 350; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: '5fabb0200fb3a1327cca74c3',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/nedimajdin/image/upload/v1605195845/YelpCamp/xmcngyzi3n7ifc69t3yj.png',
                    filename: 'xmcngyzi3n7ifc69t3yj'
                },
                {
                    url: 'https://res.cloudinary.com/nedimajdin/image/upload/v1605195528/YelpCamp/kgb4uwdjuyxkh4yjrltm.jpg',
                    filename: 'kgb4uwdjuyxkh4yjrltm'
                }
            ],
            price: price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea voluptatem delectus doloremque obcaecati, optio iure voluptatibus id temporibus laborum magnam sequi natus eum deserunt. Esse iusto eius a ducimus assumenda?'
        });
        await camp.save();
    }
}

seedDB();