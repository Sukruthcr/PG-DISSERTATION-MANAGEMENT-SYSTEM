import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function cleanupDuplicateAssignments() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔧 Cleaning up duplicate guide assignments...\n');

    // Get all assignments
    const allAssignments = await db.collection('guide_assignments').find({}).toArray();
    console.log(`📊 Total assignments found: ${allAssignments.length}`);

    // Group by student_id and guide_id to find duplicates
    const assignmentMap = new Map();
    const duplicatesToDelete = [];

    for (const assignment of allAssignments) {
      const key = `${assignment.student_id}_${assignment.guide_id}_${assignment.status}`;
      
      if (assignmentMap.has(key)) {
        // This is a duplicate - mark for deletion (keep the oldest one)
        duplicatesToDelete.push(assignment._id);
        console.log(`❌ Duplicate found: Student ${assignment.student_id} -> Guide ${assignment.guide_id}`);
      } else {
        // First occurrence - keep it
        assignmentMap.set(key, assignment);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Unique assignments: ${assignmentMap.size}`);
    console.log(`   Duplicates to remove: ${duplicatesToDelete.length}`);

    if (duplicatesToDelete.length > 0) {
      // Delete duplicates
      const result = await db.collection('guide_assignments').deleteMany({
        _id: { $in: duplicatesToDelete }
      });

      console.log(`\n✅ Deleted ${result.deletedCount} duplicate assignments`);
    } else {
      console.log(`\n✅ No duplicates found!`);
    }

    // Show final statistics
    const finalCount = await db.collection('guide_assignments').countDocuments({});
    console.log(`\n📊 Final assignment count: ${finalCount}`);

    // Show assignments per guide
    const guides = await db.collection('users').find({ role: 'guide' }).toArray();
    console.log(`\n👥 Assignments per guide:`);
    
    for (const guide of guides) {
      const guideId = guide._id.toString();
      const uniqueStudents = await db.collection('guide_assignments').distinct('student_id', {
        guide_id: guideId,
        status: 'active'
      });
      console.log(`   ${guide.full_name}: ${uniqueStudents.length} students`);
      uniqueStudents.forEach(studentId => {
        console.log(`      - ${studentId}`);
      });
    }

  } catch (error) {
    console.error('❌ Error cleaning up assignments:', error);
  } finally {
    await client.close();
  }
}

cleanupDuplicateAssignments();
