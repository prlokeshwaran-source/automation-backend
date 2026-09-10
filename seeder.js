const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config();

const User = require('./models/User');
const Organization = require('./models/Organization');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Organization.deleteMany();

    const organization = await Organization.create({
      name: 'Default Organization',
      slug: 'default-organization',
      type: 'enterprise',
      status: 'active',
    });

    await User.create({
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'super_admin',
      organization: organization._id,
      isActive: true,
      isEmailVerified: true,
    });

    console.log('Data imported successfully'.green.bold);
    console.log('Admin credentials: admin@gmail.com / Admin@123'.yellow.bold);
    process.exit();
  } catch (err) {
    console.error(`${err.message}`.red);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Organization.deleteMany();

    console.log('Data destroyed successfully'.red.bold);
    process.exit();
  } catch (err) {
    console.error(`${err.message}`.red);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
