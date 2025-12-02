/**
 * Check Database State
 * Shows current users and projects
 */

import { MongoClient } from 'mongodb';

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function checkDatabase() {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    
    console.log('🔍 Database Check\n');
    console.log('═══════════════════════════════════════════════\n');
    
    // Check students
    console.log('👥 Students:\n');
    const students = await db.collection('users').find({ role: 'student' }).toArray();
    
    students.forEach((s, i) => {
      console.log(`${i + 1}. ${s.full_name}`);
      console.log(`   Email: ${s.email}`);
      console.log(`   student_id: ${s.student_id || 'NOT SET'}`);
      console.log(`   _id: ${s._id.toString()}`);
      console.log('');
    });
    
    // Check projects
    console.log('📚 Projects:\n');
    const projects = await db.collection('topics').find({}).toArray();
    
    if (projects.length === 0) {
      console.log('   No projects found in database\n');
    } else {
      projects.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title}`);
        console.log(`   student_id: ${p.student_id}`);
        console.log(`   guide_id: ${p.guide_id || 'Not assigned'}`);
        console.log(`   status: ${p.status}`);
        console.log('');
      });
    }
    
    // Check guides
    console.log('🎓 Guides:\n');
    const guides = await db.collection('users').find({ role: 'guide' }).toArray();
    
    guides.forEach((g, i) => {
      console.log(`${i + 1}. ${g.full_name}`);
      console.log(`   _id: ${g._id.toString()}`);
      console.log('');
    });
    
    // Summary
    console.log('═══════════════════════════════════════════════');
    console.log('Summary');
    console.log('═══════════════════════════════════════════════');
    console.log(`Students: ${students.length}`);
    console.log(`Projects: ${projects.length}`);
    console.log(`Guides: ${guides.length}`);
    console.log('');
    
    // Check for mismatches
    console.log('🔍 Checking for issues:\n');
    
    let issuesFound = false;
    
    // Check if students have student_id field
    const studentsWithoutId = students.filter(s => !s.student_id);
    if (studentsWithoutId.length > 0) {
      console.log(`⚠️  ${studentsWithoutId.length} student(s) missing student_id field:`);
      studentsWithoutId.forEach(s => {
        console.log(`   - ${s.full_name} (${s.email})`);
      });
      console.log('');
      issuesFound = true;
    }
    
    // Check if projects have matching students
    for (const project of projects) {
      const student = students.find(s => s.student_id === project.student_id);
      if (!student) {
        console.log(`⚠️  Project "${project.title}" has student_id "${project.student_id}" but no matching student found`);
        issuesFound = true;
      }
    }
    
    if (!issuesFound) {
      console.log('✅ No issues found!\n');
    } else {
      console.log('');
      console.log('💡 Recommended Actions:\n');
      console.log('1. Make sure all students have student_id field');
      console.log('2. Make sure project student_id matches user student_id');
      console.log('3. Run: node server.js');
      console.log('4. Try assigning guide again');
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkDatabase();
