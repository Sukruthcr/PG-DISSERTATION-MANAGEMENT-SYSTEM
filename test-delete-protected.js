import fetch from 'node-fetch';

async function testDeleteProtected() {
  try {
    console.log('Getting all users...');
    const getUsersResponse = await fetch('http://localhost:3001/api/users');
    const getUsersData = await getUsersResponse.json();

    if (!getUsersData.success) {
      console.log('❌ Failed to get users:', getUsersData.message);
      return;
    }

    console.log('Available users:');
    getUsersData.users.forEach(user => {
      console.log(`- ${user.full_name} (${user.role}) - ID: ${user.id}`);
    });

    // Try to delete Department Coordinator
    const coordinator = getUsersData.users.find(user => user.full_name === 'Department Coordinator');
    if (coordinator) {
      console.log(`\nAttempting to delete Department Coordinator: ${coordinator.id}`);

      const deleteResponse = await fetch(`http://localhost:3001/api/users/${coordinator.id}`, {
        method: 'DELETE',
      });

      const deleteData = await deleteResponse.json();
      console.log('Delete response:', deleteData);

      if (deleteData.success) {
        console.log('✅ Department Coordinator deleted successfully!');
      } else {
        console.log('❌ Failed to delete Department Coordinator:', deleteData.message);
      }
    } else {
      console.log('Department Coordinator not found');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testDeleteProtected();
