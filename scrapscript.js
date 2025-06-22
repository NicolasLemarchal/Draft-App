import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import cliProgress from 'cli-progress';

const roles = {
  top: 'top',
  jgl: 'jungle',
  mid: 'mid',
  bot: 'adc',
  sup: 'support'
};

// 🔄 Obtenir le dernier patch
const getLatestPatch = async () => {
  const res = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
  return res.data[0];
};

// 📥 Obtenir tous les champions avec id + slug
const getAllChampions = async (patch) => {
  const url = `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`;
  const res = await axios.get(url);
  return Object.values(res.data.data).map((champ) => ({
    id: champ.id,
    slug: champ.id.toLowerCase()
  }));
};

// 📊 Scraper les stats depuis u.gg
const getStats = async (championSlug, rolePath) => {
  const url = `https://u.gg/lol/champions/${championSlug}/build/${rolePath}`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const stats = {
      tier: null,
      winRate: null,
      pickRate: null,
      banRate: null
    };

    $('div').each((i, el) => {
      const text = $(el).text().trim();
      const isPercent = /^<?\s*\d{1,2}(\.\d{1,2})?%$/.test(text);

      if (isPercent) {
        const label = $(el).next().text().trim().toLowerCase();
        const value = parseFloat(text.replace(/[<>\s%]/g, ''));

        if (label.includes('win rate')) {
          stats.winRate = value;
        } else if (label.includes('pick rate')) {
          stats.pickRate = value;
        } else if (label.includes('ban rate')) {
          stats.banRate = value;
        }
      }

      // Tiers : lettre avec potentiellement un + / - (ex: S+ / S-)
      const isTierValue = /^[SABCDEF\?][\+\-]?$/i.test(text);
      if (isTierValue) {
        const nextText = $(el).next().text().trim().toLowerCase();
        if (nextText.includes('tier')) {
          stats.tier = text.toUpperCase(); // garde le format "S+ / S-"
        }
      }
    });

    return stats;
  } catch (err) {
    console.error(`❌ Erreur pour ${championSlug} (${rolePath}) : ${err.message}`);
    return {
      tier: null,
      winRate: null,
      pickRate: null,
      banRate: null
    };
  }
};

// 🧪 Exécution principale
(async () => {
  const patch = await getLatestPatch();
  console.log(`🔄 Patch détecté : ${patch}`);

  const champions = await getAllChampions(patch);
  console.log(`📦 ${champions.length} champions récupérés`);

  const totalSteps = champions.length * Object.keys(roles).length;
  const bar = new cliProgress.SingleBar({
    format: 'Progress |{bar}| {percentage}% | {value}/{total} ({champ} - {role})',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });

  bar.start(totalSteps, 0, { champ: '', role: '' });

  const result = [];

  for (const champ of champions) {
    const tier = {};
    const winrate = {};
    const pickrate = {};
    let banrate = null;

    for (const [short, long] of Object.entries(roles)) {
      bar.update(bar.value + 1, { champ: champ.slug, role: short });
      const stats = await getStats(champ.slug, long);

      winrate[short] = stats.winRate;
      pickrate[short] = stats.pickRate;
      tier[short] = stats.tier;

      if (banrate === null && stats.banRate !== null) {
        banrate = stats.banRate;
      }
    }

    result.push({
      name: champ.id,
      img: `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${champ.id}.png`,
      tier,
      winrate,
      pickrate,
      banrate
    });
  }

  bar.stop();

  fs.writeFileSync('./public/champions.json', JSON.stringify(result, null, 2));
  console.log('✅ champions.json mis à jour avec winrates, pickrates, et banrates (patch : ' + patch + ')');
})();
