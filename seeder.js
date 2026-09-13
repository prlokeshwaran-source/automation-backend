const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const colors = require('colors');
const dotenv = require('dotenv');
const User = require('./models/User');
const Organization = require('./models/Organization');

// Load env vars
dotenv.config();

const createDefaultAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...'.cyan.bold);

    // Create default organization
    const organization = await Organization.create({
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

    console.log(`Default organization created: ${organization.name}`.green);

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
      organization: organization._id,
      isActive: true,
      isEmailVerified: true,
    });

    console.log('Default admin user created'.green);
    console.log('Email: admin@example.com'.yellow);
    console.log('Password: admin123'.yellow);

    await mongoose.connection.close();
    console.log('\nSeeding completed!'.green.bold);
    process.exit(0);
  } catch (err) {
    console.error(`Error: ${err.message}`.red);
    await mongoose.connection.close();
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...'.cyan.bold);

    await User.deleteMany();
    await Organization.deleteMany();

    console.log('Data destroyed...'.red.bold);
    process.exit(0);
  } catch (err) {
    console.error(`Error: ${err.message}`.red);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  createDefaultAdmin();
}