const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function parseArrayField(str) {
  if (!str || str.trim() === '' || str.trim() === '[]') return [];
  try {
    return JSON.parse(str.replace(/'/g, '"'));
  } catch {
    return str.replace(/[\[\]']/g, '').split(',').map(s => s.trim()).filter(Boolean);
  }
}

async function main() {
  const file = fs.readFileSync('download.csv', 'utf8');
  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
  });

  for (const row of records) {
    try {
      await prisma.competition.create({
        data: {
          title: row.title,
          description: row.description,
          domain: row.domain,
          tags: parseArrayField(row.tags),
          prizeAmount: Number(row.prizeAmount) || 0,
          nonMonetaryRewards: parseArrayField(row.nonMonetaryRewards),
          deadline: row.deadline ? new Date(row.deadline) : null,
          benefits: parseArrayField(row.benefits),
          difficulty: row.difficulty,
          website: row.website,
          organizer: row.organizer,
          timeCommitment: row.timeCommitment,
          teamRequirement: row.teamRequirement,
          targetAudience: row.targetAudience,
        },
      });
      console.log(`Inserted: ${row.title}`);
    } catch (err) {
      console.error(`Error inserting ${row.title}:`, err.message);
    }
  }
  await prisma.$disconnect();
}

main(); 