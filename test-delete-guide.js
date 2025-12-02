import fetch from 'node-fetch';

async function testDeleteGuide() {
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

    // Try to delete Senior Guide
    const guide = getUsersData.users.find(user => user.full_name === 'Senior Guide');
    if (guide) {
      console.log(`\nAttempting to delete Senior Guide: ${guide.id}`);

      const deleteResponse = await fetch(`http://localhost:3001/api/users/${guide.id}`, {
        method: 'DELETE',
      });

      const deleteData = await deleteResponse.json();
      console.log('Delete response:', deleteData);

      if (deleteData.success) {
        console.log('✅ Senior Guide deleted successfully!');
      } else {
        console.log('❌ Failed to delete Senior Guide:', deleteData.message);
      }
    } else {
      console.log('Senior Guide not found');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testDeleteGuide();
