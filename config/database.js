const mongoose = require('mongoose');
const colors = require('colors');
const bcrypt = require('bcryptjs');
const Organization = require('../models/Organization');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    console.log(`Database: ${conn.connection.name}`.cyan.bold);

    // Seed default data if no users exist
    await seedDefaultData();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
  }
};

const seedDefaultData = async () => {
  try {
    // Check if any organization exists
    const orgCount = await Organization.countDocuments();
    const userCount = await User.countDocuments();

    if (orgCount === 0 && userCount === 0) {
      console.log('Seeding default data...'.yellow.bold);

      // Create default organization
      const org = await Organization.create({
        name: 'Default Organization',
        slug: 'default-org',
        domain: 'default.org',
        description: 'Default organization for system administration',
        type: 'enterprise',
        status: 'active',
        subscription: {
          plan: 'enterprise',
          billingCycle: 'monthly',
        },
      });

      console.log(`Created default organization: ${org.name}`.green);

      // Create default super admin
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const admin = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Smith',
        role: 'super_admin',
        organization: org._id,
        isActive: true,
        isEmailVerified: true,
      });

      console.log('Created default admin user'.green);
      console.log('Email: admin@example.com'.yellow);
      console.log('Password: admin123'.yellow);
    } else {
      console.log('Database already has data, skipping seed'.yellow);
    }
  } catch (error) {
    console.error(`Seeding error: ${error.message}`.red);
  }
};

module.exports = connectDB;