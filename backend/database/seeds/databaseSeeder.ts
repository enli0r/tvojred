import { db } from '../../db.ts';
import { seedBarbers } from './barbersSeed.ts';
import { seedCustomers } from './customersSeed.ts';
import { seedServices } from './servicesSeed.ts';
import { seedTenants } from './tenantsSeed.ts';
import { seedBarberServices } from './barberServicesSeed.ts';
import { seedUsers } from './usersSeed.ts';
import { seedAppointments } from './appointmentsSeed.ts';
import { seedTenantWorkingHours } from './tenantWorkingHoursSeed.ts';
import { seedBarberWorkingHours } from './barberWorkingHoursSeed.ts';
import { seedBarberWorkingOverrides } from './barberWorkingOverridesSeed.ts';
import { seedBarberBreaks } from './seedBarberBreaks.ts';
import { seedBarberBreakRepeatDays } from './seedBarberBreakRepeatDays.ts';


export async function dbSeed() {
    await db.query('use zakazitermin2');

    const args = process.argv.slice(2);
    const withTenants = args.includes('--tenants');
    const withUsers = args.includes('--users');
    const withCustomers = args.includes('--customers');
    const withBarbers = args.includes('--barbers');
    const withServices = args.includes('--services');
    const withBarberServices = args.includes('--barberServices');
    const withAppointments = args.includes('--appointments');
    const withTenantWorkingHours = args.includes('--radnoVremeLokala');
    const withBarberScheduleRulesTable = args.includes('--barberSchedulePravila');
    const withBarberScheduleRuleDaysTable = args.includes('--barberScheduleDays');
    const withBarberWorkingHours = args.includes('--barberWorkingHours');
    const withBarberWorkingOverrides = args.includes('--barberWorkingOverrides');
    const withBarberBreaks = args.includes('--barberBreaks');
    const withBarberBreakRepeatDays = args.includes('--barberBreakRepeatDays');


    if (withTenants) {
        console.log('Seedujem tenants..');
        await seedTenants(db);
    }

    if (withUsers) {
        console.log('Seedujem users..');
        await seedUsers(db);
    }

    if (withCustomers) {
        console.log('Seedujem customers');
        await seedCustomers(db);
    }

    if (withBarbers) {
        console.log('Seedujem barbers..');
        await seedBarbers(db);
    }

    if (withServices) {
        console.log('Seedujem services..');
        await seedServices(db);
    }

    if (withBarberServices) {
        console.log('Seedujem barber_services..');
        await seedBarberServices(db);
    }

    if (withAppointments) {
        console.log('Seedujem barber_services..');
        await seedAppointments(db);
    }

    if (withTenantWorkingHours) {
        console.log('Seedujem tabelu za radno vreme lokala');
        await seedTenantWorkingHours(db);
    }

    if (withBarberWorkingHours) {
        console.log('Seedujem tabelu barber working hours');
        await seedBarberWorkingHours(db);
    }

    if (withBarberWorkingOverrides) {
        console.log('Seedujem tabelu barber working hours overrides');
        await seedBarberWorkingOverrides(db);
    }

    if (withBarberBreaks) {
        console.log('Seedujem tabelu barber breaks');
        await seedBarberBreaks(db);
    }

    if (withBarberBreakRepeatDays) {
        console.log('Seedujem tabelu barber break repeat days');
        await seedBarberBreakRepeatDays(db);
    }

    console.log('Seed zavrsen');
}


//da bi moglo da se pokrene iz terminala
if (import.meta.url === `file://${process.argv[1]}`) {
    dbSeed()
        .then(async () => {
            await db.end();      // lepo zatvori konekciju
            process.exit(0);
        })
        .catch(async (err) => {
            console.error(err);
            await db.end();
            process.exit(1);
        });
}