const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@prognosys.com';

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingAdmin) {
        console.log('Admin user already exists. Skipping seed.');
        return;
    }

    // Hash the password with 10 salt rounds
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // Create the admin user
    const adminUser = await prisma.user.create({
        data: {
            email: adminEmail,
            passwordHash: hashedPassword, // <--- CHANGED THIS (was 'password')
            role: 'ADMIN',
            name: 'System Administrator',
            isActive: true
        }
    });

    console.log('Admin user created successfully:', adminUser.email);
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });