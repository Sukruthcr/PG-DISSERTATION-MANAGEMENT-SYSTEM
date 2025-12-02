/**
 * Delete ALL Projects Script
 * Removes every single project from the database
 */

import { MongoClient } from 'mongodb';

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function deleteAllProjects() {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    
    console.log('🗑️  DELETE ALL PROJECTS\n');
    console.log('═══════════════════════════════════════════════\n');
    
    // Show what will be deleted
    const projects = await db.collection('topics').find({}).toArray();
    console.log(`Found ${projects.length} project(s) to delete:\n`);
    
    projects.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title || 'Untitled'}`);
      console.log(`   Student ID: ${p.student_id || 'N/A'}`);
      console.log(`   Status: ${p.status || 'N/A'}`);
      console.log('');
    });
    
    if (projects.length === 0) {
      console.log('✅ No projects to delete - database is already clean!\n');
      return;
    }
    
    // Delete all projects
    console.log('Deleting all projects...\n');
    const projectResult = await db.collection('topics').deleteMany({});
    console.log(`✅ Deleted ${projectResult.deletedCount} project(s)`);
    
    // Delete all guide assignments
    const guideResult = await db.collection('guide_assignments').deleteMany({});
    console.log(`✅ Deleted ${guideResult.deletedCount} guide assignment(s)`);
    
    // Delete all coordinator assignments
    const coordResult = await db.collection('coordinator_assignments').deleteMany({});
    console.log(`✅ Deleted ${coordResult.deletedCount} coordinator assignment(s)`);
    
    console.log('');
    
    // Verify
    const remaining = await db.collection('topics').countDocuments();
    
    if (remaining === 0) {
      console.log('═══════════════════════════════════════════════');
      console.log('✅ SUCCESS - All projects deleted!');
      console.log('═══════════════════════════════════════════════');
      console.log('');
      console.log('Next steps:');
      console.log('1. Restart server: node server.js');
      console.log('2. Hard refresh browser: Ctrl+Shift+R');
      console.log('3. Admin panel should show 0 projects');
      console.log('4. Students can now submit NEW projects');
      console.log('');
    } else {
      console.log(`⚠️  Warning: ${remaining} project(s) still remain`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

deleteAllProjects();
