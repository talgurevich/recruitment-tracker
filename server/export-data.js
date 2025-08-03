const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});

async function exportData() {
  try {
    console.log('🔍 Exporting data from local SQLite database...');
    
    const users = await prisma.user.findMany({
      include: {
        recruitmentProcesses: {
          include: {
            actionItems: true
          }
        }
      }
    });

    const exportData = {
      users: users,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync('local-data-export.json', JSON.stringify(exportData, null, 2));
    
    console.log(`✅ Exported ${users.length} users with their data to local-data-export.json`);
    console.log('📊 Summary:');
    users.forEach(user => {
      const processCount = user.recruitmentProcesses.length;
      const actionCount = user.recruitmentProcesses.reduce((total, process) => total + process.actionItems.length, 0);
      console.log(`   👤 ${user.name} (${user.email}): ${processCount} applications, ${actionCount} action items`);
    });
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();