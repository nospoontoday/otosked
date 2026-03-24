import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import Template from '../models/Template.js';
import templates from '../data/templates.js';

dotenv.config();

async function seedTemplates() {
  await connectDB();

  const values = Object.values(templates);

  for (const template of values) {
    await Template.findOneAndUpdate(
      { key: template.key },
      template,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded templates: ${values.map((template) => template.key).join(', ')}`);
  await mongoose.connection.close();
}

seedTemplates().catch(async (error) => {
  console.error('Template seeding failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});
