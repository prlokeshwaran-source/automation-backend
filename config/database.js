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
    // Check if admin user already exists (include password for verification)
    const existingAdmin = await User.findOne({ email: 'admin@example.com' }).select('+password');

    // Ensure default organization exists
    let org = await Organization.findOne({ slug: 'default-org' });
    if (!org) {
      org = await Organization.create({
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
    }

    // Create or verify default admin
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    if (!existingAdmin) {
      if (!org) {
        console.log('No organization available for admin seeding'.yellow);
        return;
      }

      await User.create({
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
      // Ensure admin is active and has correct password
      let needsUpdate = false;
      if (!existingAdmin.isActive) {
        existingAdmin.isActive = true;
        needsUpdate = true;
      }
      const passwordValid = await bcrypt.compare('admin123', existingAdmin.password);
      if (!passwordValid) {
        existingAdmin.password = hashedPassword;
        needsUpdate = true;
      }
      if (existingAdmin.role !== 'super_admin') {
        existingAdmin.role = 'super_admin';
        needsUpdate = true;
      }
      if (needsUpdate) {
        await existingAdmin.save();
        console.log('Updated default admin user credentials'.green);
      }
    }
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - user already exists, which is fine
    } else {
      console.error(`Seeding error: ${error.message}`.red);
    }
  }
};

module.exports = connectDB;