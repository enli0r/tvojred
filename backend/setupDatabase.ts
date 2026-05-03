import { db } from './db.js';

export async function setup() {
    // 1. Kreiraj bazu ako ne postoji
    await db.query(`CREATE DATABASE IF NOT EXISTS zakazitermin2`);
    await db.query(`USE zakazitermin2`);
    console.log('Baza spremna');
}

setup().catch(err => {
    console.error(err);
    process.exit(1);
});