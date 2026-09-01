// Run with: npm run seed
// Populates MongoDB with the admin account and the original 5 portfolio
// projects (Stellar, Neon Grid, Waveform, Nebula, Void) so the site isn't
// empty on first run.

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Project from './models/Project.js';
import Admin from './models/Admin.js';

dotenv.config();

const projects = [
  {
    title: 'STELLAR',
    year: '2025',
    role: 'Interactive Experience / WebGL',
    type: 'particles',
    color: 'c8ff00',
    large: true,
    order: 1,
  },
  {
    title: 'NEON GRID',
    year: '2025',
    role: 'CG / Motion',
    type: 'grid',
    color: '00ffc8',
    large: false,
    order: 2,
  },
  {
    title: 'WAVEFORM',
    year: '2024',
    role: 'Audio Visual / Shader',
    type: 'wave',
    color: 'ff6060',
    large: false,
    order: 3,
  },
  {
    title: 'NEBULA',
    year: '2024',
    role: 'Generative Art / CG',
    type: 'noise',
    color: 'c8ff00',
    large: false,
    order: 4,
  },
  {
    title: 'VOID',
    year: '2023',
    role: 'Interactive / Website',
    type: 'scan',
    color: '00ffc8',
    large: false,
    order: 5,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  await Project.deleteMany({});
  await Project.insertMany(projects);
  console.log(`Inserted ${projects.length} projects.`);

  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'changeme';

  await Admin.deleteMany({ email });
  const hash = await bcrypt.hash(password, 10);
  await Admin.create({ email, password: hash });
  console.log(`Admin user ready: ${email}`);

  await mongoose.disconnect();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
