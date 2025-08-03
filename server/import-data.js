const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('📥 Importing data to production database...');
    
    if (!fs.existsSync('local-data-export.json')) {
      console.error('❌ local-data-export.json not found. Run export-data.js first.');
      return;
    }

    const exportData = JSON.parse(fs.readFileSync('local-data-export.json', 'utf8'));
    console.log(`📊 Found ${exportData.users.length} users to import`);

    for (const userData of exportData.users) {
      console.log(`👤 Importing user: ${userData.name} (${userData.email})`);
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
        include: {
          recruitmentProcesses: {
            include: {
              actionItems: true
            }
          }
        }
      });

      let targetUser;

      if (existingUser) {
        console.log(`   🔄 User ${userData.email} already exists, deleting and recreating...`);
        
        // Delete existing user and all related data (cascading delete)
        await prisma.user.delete({
          where: { id: existingUser.id }
        });
        
        console.log(`   🗑️  Deleted existing user and all related data`);
      }

      // Create user (fresh or replacement)
      targetUser = await prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email,
          password: userData.password, // Already hashed
          name: userData.name,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt
        }
      });

      console.log(`   ✅ Created user: ${targetUser.name}`);

      // Import recruitment processes
      for (const processData of userData.recruitmentProcesses) {
        const createdProcess = await prisma.recruitmentProcess.create({
          data: {
            id: processData.id,
            userId: targetUser.id,
            companyName: processData.companyName,
            position: processData.position,
            status: processData.status,
            contactEmail: processData.contactEmail,
            contactPhone: processData.contactPhone,
            contactName: processData.contactName,
            rejectionReason: processData.rejectionReason,
            notes: processData.notes,
            appliedDate: processData.appliedDate,
            lastContactDate: processData.lastContactDate,
            location: processData.location,
            jobType: processData.jobType,
            source: processData.source,
            createdAt: processData.createdAt,
            updatedAt: processData.updatedAt
          }
        });

        console.log(`     📋 Created application: ${processData.companyName} - ${processData.position}`);

        // Import action items
        for (const actionData of processData.actionItems) {
          await prisma.actionItem.create({
            data: {
              id: actionData.id,
              processId: createdProcess.id,
              title: actionData.title,
              description: actionData.description,
              dueDate: actionData.dueDate,
              completed: actionData.completed,
              createdAt: actionData.createdAt,
              updatedAt: actionData.updatedAt
            }
          });

          console.log(`       ✅ Created action: ${actionData.title}`);
        }
      }
    }

    console.log('🎉 Import completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();