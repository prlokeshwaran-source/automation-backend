const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Organization = require('../models/Organization');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // Seed default data
    await seedDefaultData();
  } catch (error) {
    console.error(`Error: ${error.message}`);
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
      console.log(`Created default organization: ${org.name}`);
    }

    // Create or verify default admin
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    if (!existingAdmin) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Smith',
        role: 'super_admin',
        organization: org ? org._id : undefined,
        isActive: true,
        isEmailVerified: true,
      });

      console.log('Created default admin user');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
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
        console.log('Updated default admin user credentials');
      }
    }
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - user already exists, which is fine
      console.log('Admin user already exists, skipping creation');
    } else {
      console.error(`Seeding error: ${error.message}`);
    }
  }
};

module.exports = connectDB;
