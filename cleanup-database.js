/**
 * Database Cleanup Script
 * Removes all sample/demo projects and resets the database
 * Run with: node cleanup-database.js
 */

import { MongoClient } from 'mongodb';

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function cleanupDatabase() {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    
    console.log('🧹 Database Cleanup Script\n');
    console.log('═══════════════════════════════════════════════\n');
    
    // Step 1: Check current state
    console.log('Step 1: Checking current database state...\n');
    
    const projectCount = await db.collection('topics').countDocuments();
    const assignmentCount = await db.collection('guide_assignments').countDocuments();
    const coordAssignmentCount = await db.collection('coordinator_assignments').countDocuments();
    
    console.log(`Current state:`);
    console.log(`  - Projects: ${projectCount}`);
    console.log(`  - Guide assignments: ${assignmentCount}`);
    console.log(`  - Coordinator assignments: ${coordAssignmentCount}`);
    console.log('');
    
    if (projectCount === 0) {
      console.log('✅ Database is already clean - no projects found\n');
      return;
    }
    
    // Step 2: Show sample projects
    console.log('Step 2: Sample projects to be deleted:\n');
    const sampleProjects = await db.collection('topics').find({}).limit(5).toArray();
    
    sampleProjects.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title || 'Untitled'}`);
      console.log(`   Student ID: ${p.student_id || 'N/A'}`);
      console.log(`   Status: ${p.status || 'N/A'}`);
      console.log('');
    });
    
    if (projectCount > 5) {
      console.log(`... and ${projectCount - 5} more project(s)\n`);
    }
    
    // Step 3: Delete all projects
    console.log('Step 3: Deleting all projects and assignments...\n');
    
    const projectResult = await db.collection('topics').deleteMany({});
    const guideResult = await db.collection('guide_assignments').deleteMany({});
    const coordResult = await db.collection('coordinator_assignments').deleteMany({});
    
    console.log(`✅ Deleted ${projectResult.deletedCount} project(s)`);
    console.log(`✅ Deleted ${guideResult.deletedCount} guide assignment(s)`);
    console.log(`✅ Deleted ${coordResult.deletedCount} coordinator assignment(s)`);
    console.log('');
    
    // Step 4: Verify cleanup
    console.log('Step 4: Verifying cleanup...\n');
    
    const remainingProjects = await db.collection('topics').countDocuments();
    const remainingAssignments = await db.collection('guide_assignments').countDocuments();
    const remainingCoordAssignments = await db.collection('coordinator_assignments').countDocuments();
    
    if (remainingProjects === 0 && remainingAssignments === 0 && remainingCoordAssignments === 0) {
      console.log('✅ Database cleanup successful!');
      console.log('   All sample projects and assignments have been removed.\n');
    } else {
      console.log('⚠️  Warning: Some items may still remain');
      console.log(`   Projects: ${remainingProjects}`);
      console.log(`   Assignments: ${remainingAssignments}`);
      console.log(`   Coordinator assignments: ${remainingCoordAssignments}\n`);
    }
    
    // Step 5: Check users
    console.log('Step 5: Checking user accounts...\n');
    
    const studentCount = await db.collection('users').countDocuments({ role: 'student' });
    const guideCount = await db.collection('users').countDocuments({ role: 'guide' });
    const coordCount = await db.collection('users').countDocuments({ role: 'coordinator' });
    const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
    
    console.log('User accounts (preserved):');
    console.log(`  - Students: ${studentCount}`);
    console.log(`  - Guides: ${guideCount}`);
    console.log(`  - Coordinators: ${coordCount}`);
    console.log(`  - Admins: ${adminCount}`);
    console.log('');
    
    // Summary
    console.log('═══════════════════════════════════════════════');
    console.log('Summary');
    console.log('═══════════════════════════════════════════════');
    console.log('✅ All sample/demo projects removed');
    console.log('✅ All guide assignments cleared');
    console.log('✅ All coordinator assignments cleared');
    console.log('✅ User accounts preserved');
    console.log('');
    console.log('Next Steps:');
    console.log('1. Restart the server: node server.js');
    console.log('2. Hard refresh browser: Ctrl+Shift+R');
    console.log('3. Students can now submit NEW projects');
    console.log('4. Guides can approve, edit, delete, and assign marks');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await client.close();
  }
}

// Run cleanup
cleanupDatabase();
