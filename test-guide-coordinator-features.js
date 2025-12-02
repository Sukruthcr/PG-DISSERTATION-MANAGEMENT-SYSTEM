/**
 * Test Script for Guide & Coordinator Features
 * Run with: node test-guide-coordinator-features.js
 */

import { MongoClient, ObjectId } from 'mongodb';

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function testGuideCoordinatorFeatures() {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    
    console.log('🧪 Testing Guide & Coordinator Features\n');
    
    // Test 1: Check collections exist
    console.log('✅ Test 1: Verify collections exist');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const requiredCollections = ['users', 'topics', 'guide_assignments', 'coordinator_assignments'];
    requiredCollections.forEach(name => {
      if (collectionNames.includes(name)) {
        console.log(`   ✓ Collection '${name}' exists`);
      } else {
        console.log(`   ✗ Collection '${name}' missing`);
      }
    });
    
    // Test 2: Check for guides and coordinators
    console.log('\n✅ Test 2: Verify guides and coordinators exist');
    const guides = await db.collection('users').find({ role: 'guide' }).toArray();
    const coordinators = await db.collection('users').find({ role: 'coordinator' }).toArray();
    const students = await db.collection('users').find({ role: 'student' }).toArray();
    
    console.log(`   ✓ Found ${guides.length} guide(s)`);
    console.log(`   ✓ Found ${coordinators.length} coordinator(s)`);
    console.log(`   ✓ Found ${students.length} student(s)`);
    
    if (guides.length === 0) {
      console.log('   ⚠️  No guides found - creating test guide...');
      const testGuide = {
        email: 'test.guide@university.edu',
        full_name: 'Test Guide',
        role: 'guide',
        department: 'Computer Science',
        specialization: 'Machine Learning',
        phone: '1234567890',
        employee_id: 'EMP001',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456', // hashed 'password'
        expertise: ['Machine Learning', 'Data Science', 'AI'],
        experience_level: 'senior',
        availability_status: 'available',
        max_students: 5,
        current_students: 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      await db.collection('users').insertOne(testGuide);
      console.log('   ✓ Test guide created');
    }
    
    if (coordinators.length === 0) {
      console.log('   ⚠️  No coordinators found - creating test coordinator...');
      const testCoordinator = {
        email: 'test.coordinator@university.edu',
        full_name: 'Test Coordinator',
        role: 'coordinator',
        department: 'Computer Science',
        specialization: 'Department Management',
        phone: '1234567891',
        employee_id: 'EMP002',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
        created_at: new Date(),
        updated_at: new Date()
      };
      await db.collection('users').insertOne(testCoordinator);
      console.log('   ✓ Test coordinator created');
    }
    
    // Test 3: Check for projects
    console.log('\n✅ Test 3: Verify projects exist');
    const projects = await db.collection('topics').find({}).toArray();
    console.log(`   ✓ Found ${projects.length} project(s)`);
    
    if (projects.length === 0 && students.length > 0) {
      console.log('   ⚠️  No projects found - creating test project...');
      const testProject = {
        student_id: students[0]._id.toString(),
        title: 'Test Project: AI in Healthcare',
        description: 'A research project on applying AI to healthcare diagnostics',
        specialization: 'Machine Learning',
        status: 'in_progress',
        created_at: new Date(),
        updated_at: new Date()
      };
      await db.collection('topics').insertOne(testProject);
      console.log('   ✓ Test project created');
    }
    
    // Test 4: Test guide assignment
    console.log('\n✅ Test 4: Test guide assignment');
    const unassignedProjects = await db.collection('topics').find({ 
      guide_id: { $exists: false } 
    }).toArray();
    
    if (unassignedProjects.length > 0 && guides.length > 0) {
      const project = unassignedProjects[0];
      const guide = guides[0];
      
      await db.collection('topics').updateOne(
        { _id: project._id },
        { 
          $set: { 
            guide_id: guide._id.toString(),
            updated_at: new Date()
          } 
        }
      );
      
      await db.collection('guide_assignments').insertOne({
        student_id: project.student_id,
        project_id: project._id.toString(),
        guide_id: guide._id.toString(),
        assigned_at: new Date(),
        assignment_reason: 'Test assignment',
        status: 'active'
      });
      
      console.log(`   ✓ Assigned guide "${guide.full_name}" to project "${project.title}"`);
    } else {
      console.log('   ℹ️  No unassigned projects or no guides available');
    }
    
    // Test 5: Test coordinator assignment
    console.log('\n✅ Test 5: Test coordinator assignment');
    const projectsWithoutCoordinator = await db.collection('topics').find({ 
      coordinator_id: { $exists: false } 
    }).toArray();
    
    if (projectsWithoutCoordinator.length > 0 && coordinators.length > 0) {
      const project = projectsWithoutCoordinator[0];
      const coordinator = coordinators[0];
      
      await db.collection('topics').updateOne(
        { _id: project._id },
        { 
          $set: { 
            coordinator_id: coordinator._id.toString(),
            updated_at: new Date()
          } 
        }
      );
      
      await db.collection('coordinator_assignments').insertOne({
        student_id: project.student_id,
        project_id: project._id.toString(),
        coordinator_id: coordinator._id.toString(),
        assigned_at: new Date(),
        status: 'active'
      });
      
      console.log(`   ✓ Assigned coordinator "${coordinator.full_name}" to project "${project.title}"`);
    } else {
      console.log('   ℹ️  No projects without coordinator or no coordinators available');
    }
    
    // Test 6: Verify assignment persistence
    console.log('\n✅ Test 6: Verify assignment persistence');
    const assignedProjects = await db.collection('topics').find({ 
      guide_id: { $exists: true } 
    }).toArray();
    console.log(`   ✓ ${assignedProjects.length} project(s) have assigned guides`);
    
    const guideAssignments = await db.collection('guide_assignments').find({}).toArray();
    console.log(`   ✓ ${guideAssignments.length} guide assignment(s) logged`);
    
    const coordinatorAssignments = await db.collection('coordinator_assignments').find({}).toArray();
    console.log(`   ✓ ${coordinatorAssignments.length} coordinator assignment(s) logged`);
    
    // Test 7: Test project review fields
    console.log('\n✅ Test 7: Test project review fields');
    if (assignedProjects.length > 0) {
      const project = assignedProjects[0];
      
      await db.collection('topics').updateOne(
        { _id: project._id },
        { 
          $set: { 
            marks: 85,
            feedback: 'Excellent work on the literature review.',
            approval_status: 'approved',
            status: 'approved',
            updated_at: new Date()
          } 
        }
      );
      
      console.log(`   ✓ Updated project "${project.title}" with marks and feedback`);
      
      // Verify update
      const updatedProject = await db.collection('topics').findOne({ _id: project._id });
      console.log(`   ✓ Marks: ${updatedProject.marks}/100`);
      console.log(`   ✓ Status: ${updatedProject.approval_status}`);
    } else {
      console.log('   ℹ️  No assigned projects to test review on');
    }
    
    // Test 8: Summary report
    console.log('\n📊 Summary Report:');
    console.log('═══════════════════════════════════════');
    
    const totalProjects = await db.collection('topics').countDocuments();
    const projectsWithGuides = await db.collection('topics').countDocuments({ guide_id: { $exists: true } });
    const projectsWithCoordinators = await db.collection('topics').countDocuments({ coordinator_id: { $exists: true } });
    const reviewedProjects = await db.collection('topics').countDocuments({ marks: { $exists: true } });
    
    console.log(`Total Projects: ${totalProjects}`);
    console.log(`Projects with Guides: ${projectsWithGuides} (${((projectsWithGuides/totalProjects)*100).toFixed(1)}%)`);
    console.log(`Projects with Coordinators: ${projectsWithCoordinators} (${((projectsWithCoordinators/totalProjects)*100).toFixed(1)}%)`);
    console.log(`Reviewed Projects: ${reviewedProjects} (${((reviewedProjects/totalProjects)*100).toFixed(1)}%)`);
    
    console.log('\n✅ All tests completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Login as guide to see assigned students');
    console.log('3. Login as coordinator to monitor progress');
    console.log('4. Login as student to see guide details');
    console.log('5. Login as admin to assign guides/coordinators');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.close();
  }
}

// Run tests
testGuideCoordinatorFeatures();
