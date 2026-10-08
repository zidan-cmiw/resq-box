const fs = require('fs');
const content = fs.readFileSync('src/missions/data/missions.ts', 'utf8');

const missionBlocks = content.split(/id:\s*'job_/g).slice(1);

missionBlocks.forEach((block, idx) => {
  const levelMatch = block.match(/level:\s*(\d+)/);
  const titleMatch = block.match(/title:\s*'([^']+)'/);
  const scenarioMatch = block.match(/scenario:\s*'([^']+)'/);
  const objectiveMatch = block.match(/objective:\s*'([^']+)'/);
  const hintMatch = block.match(/hint:\s*["']([^"']+)["']/);
  const blocksMatch = block.match(/requiredBlocks:\s*\[([\s\S]*?)\]/);

  const level = levelMatch ? levelMatch[1] : (idx + 1);
  const title = titleMatch ? titleMatch[1] : '';
  const scenario = scenarioMatch ? scenarioMatch[1] : '';
  const objective = objectiveMatch ? objectiveMatch[1] : '';
  const hint = hintMatch ? hintMatch[1] : '';
  const reqBlocks = blocksMatch ? blocksMatch[1].replace(/['"\s]/g, ' ').trim().split(/\s+/).filter(Boolean) : [];

  console.log(`=== LEVEL ${level}: ${title} ===`);
  console.log(`Skenario: ${scenario}`);
  console.log(`Tujuan: ${objective}`);
  console.log(`Panduan: ${hint}`);
  console.log(`Blok: ${reqBlocks.join(', ')}`);
  console.log('');
});
