/**
 * Fix Guide Assignments Script
 * This script checks and fixes guide assignments in the database
 * Run with: node fix-guide-assignments.js
 */

import { MongoClient, ObjectId } from 'mongodb';

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function fixGuideAssignments() {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    
    console.log('🔧 Fixing Guide Assignments\n');
    console.log('═══════════════════════════════════════════════\n');
    
    // Step 1: Check all projects
    console.log('Step 1: Checking all projects...');
    const projects = await db.collection('topics').find({}).toArray();
    console.log(`Found ${projects.length} project(s)\n`);
    
    // Step 2: Check projects with guide_id
    console.log('Step 2: Checking projects with guide assignments...');
    const projectsWithGuides = projects.filter(p => p.guide_id);
    console.log(`${projectsWithGuides.length} project(s) have guide_id\n`);
    
    if (projectsWithGuides.length === 0) {
      console.log('⚠️  No guide assignments found!');
      console.log('\nTo assign guides:');
      console.log('1. Login as admin');
      console.log('2. Go to "Guide Assignments"');
      console.log('3. Click "Assign Guide" on projects\n');
      return;
    }
    
    // Step 3: Validate guide_id format and existence
    console.log('Step 3: Validating guide assignments...\n');
    
    let fixedCount = 0;
    let validCount = 0;
    let invalidCount = 0;
    
    for (const project of projectsWithGuides) {
      console.log(`Project: ${project.title}`);
      console.log(`  Student ID: ${project.student_id}`);
      console.log(`  Guide ID: ${project.guide_id}`);
      
      // Check if guide_id is valid ObjectId format
      let isValidObjectId = false;
      try {
        new ObjectId(project.guide_id);
        isValidObjectId = true;
      } catch (e) {
        console.log(`  ❌ Invalid ObjectId format`);
      }
      
      if (!isValidObjectId) {
        console.log(`  ⚠️  Attempting to fix...`);
        // Try to find guide by other means
        const guide = await db.collection('users').findOne({ 
          role: 'guide',
          $or: [
            { _id: project.guide_id },
            { email: project.guide_id }
          ]
        });
        
        if (guide) {
          // Update with correct ObjectId
          await db.collection('topics').updateOne(
            { _id: project._id },
            { $set: { guide_id: guide._id.toString() } }
          );
          console.log(`  ✅ Fixed! Updated to: ${guide._id.toString()}`);
          fixedCount++;
        } else {
          console.log(`  ❌ Could not find guide`);
          invalidCount++;
        }
      } else {
        // Verify guide exists
        const guide = await db.collection('users').findOne({ 
          _id: new ObjectId(project.guide_id) 
        });
        
        if (guide) {
          console.log(`  ✅ Valid - Guide: ${guide.full_name}`);
          validCount++;
        } else {
          console.log(`  ❌ Guide not found in database`);
          invalidCount++;
        }
      }
      console.log('');
    }
    
    // Step 4: Summary
    console.log('═══════════════════════════════════════════════');
    console.log('Summary');
    console.log('═══════════════════════════════════════════════');
    console.log(`Total projects with guides: ${projectsWithGuides.length}`);
    console.log(`Valid assignments: ${validCount}`);
    console.log(`Fixed assignments: ${fixedCount}`);
    console.log(`Invalid assignments: ${invalidCount}`);
    console.log('');
    
    // Step 5: Test student lookup
    console.log('Step 5: Testing student-to-guide lookup...\n');
    
    const students = await db.collection('users').find({ role: 'student' }).toArray();
    console.log(`Found ${students.length} student(s)\n`);
    
    for (const student of students.slice(0, 3)) { // Test first 3 students
      console.log(`Student: ${student.full_name} (${student.student_id || student._id.toString()})`);
      
      // Try to find their project
      const project = await db.collection('topics').findOne({ 
        student_id: student.student_id || student._id.toString() 
      });
      
      if (project) {
        console.log(`  ✅ Project found: ${project.title}`);
        
        if (project.guide_id) {
          console.log(`  ✅ Has guide_id: ${project.guide_id}`);
          
          // Try to find guide
          let guide;
          try {
            guide = await db.collection('users').findOne({ 
              _id: new ObjectId(project.guide_id) 
            });
          } catch (e) {
            guide = await db.collection('users').findOne({ 
              _id: project.guide_id 
            });
          }
          
          if (guide) {
            console.log(`  ✅ Guide found: ${guide.full_name}`);
          } else {
            console.log(`  ❌ Guide not found!`);
          }
        } else {
          console.log(`  ⚠️  No guide assigned`);
        }
      } else {
        console.log(`  ❌ No project found`);
      }
      console.log('');
    }
    
    console.log('═══════════════════════════════════════════════');
    console.log('Next Steps');
    console.log('═══════════════════════════════════════════════');
    console.log('1. Restart the server: node server.js');
    console.log('2. Hard refresh browser: Ctrl+Shift+R');
    console.log('3. Login as student and check guide details');
    console.log('4. Check server console for [DEBUG] messages');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Run the fix
fixGuideAssignments();
