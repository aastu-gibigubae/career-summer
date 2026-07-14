import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
async function main() {
    const skills = [
        'Flutter',
        'React with TypeScript',
        'Express with TypeScript',
        'UI/UX Design',
    ];
    const persons = [
        {
            email: 'nathnaeltamirat@gmail.com',
            password: 'nathnael.tamirat.123',
        },
        {
            email: 'mosisafeiysa@gmail.com',
            password: 'mosisa.feiysa.123',
        },
        {
            email: 'meronalemayehu@gmail.com',
            password: 'meron.alemayehu.123',
        },
        {
            email: 'tsion@gmail.com',
            password: 'tsion.123',
        },
    ];
    for (const name of skills) {
        await prisma.skill.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    for (const item of persons) {
        const passwordHash = await bcrypt.hash(item['password'], 12);
        const email = item['email'];
        await prisma.user.upsert({
            where: {
                email,
            },
            update: {
                passwordHash,
            },
            create: {
                email,
                passwordHash,
            },
        });
    }
}
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
