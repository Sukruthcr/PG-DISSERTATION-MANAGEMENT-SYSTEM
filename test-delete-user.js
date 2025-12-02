import fetch from 'node-fetch';

async function testDeleteUser() {
  try {
    // First, get all users to see what users exist
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

    // Find a user to delete (not the admin)
    const userToDelete = getUsersData.users.find(user => user.role !== 'admin');

    if (!userToDelete) {
      console.log('❌ No non-admin users found to delete');
      return;
    }

    console.log(`\nAttempting to delete user: ${userToDelete.full_name} (ID: ${userToDelete.id})`);

    // Try to delete the user
    const deleteResponse = await fetch(`http://localhost:3001/api/users/${userToDelete.id}`, {
      method: 'DELETE',
    });

    const deleteData = await deleteResponse.json();
    console.log('Delete response:', deleteData);

    if (deleteData.success) {
      console.log('✅ User deleted successfully!');
    } else {
      console.log('❌ Failed to delete user:', deleteData.message);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testDeleteUser();
