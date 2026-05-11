import { db } from '../../db.ts';
import { createBarbersTable } from './barbersTable.ts';
import { createCustomersTable } from './customersTable.ts';
import { createServicesTable } from './servicesTable.ts';
import { createTenantsTable } from './tenantsTable.ts';
import { createBarberServicesTable } from './barberServicesTable.ts';
import { createUsersTable } from './usersTable.ts';
import { createAppointmentsTable } from './appointmentsTable.ts';
import { createAuth } from './authTable.ts';
import { createTenantWorkingHoursTable } from './tenantWorkingHours.ts';
import { createTenantWorkingOverridesTable } from './tenantWorkingOverrides.ts';
import { createBarberWorkingHoursTable } from './barberWorkingHoursTable.ts';
import { createBarberWorkingOverridesTable } from './barberWorkingOverridesTable.ts';
import { createBarberBreaksTable } from './barberBreaksTable.ts';
// import { createBarberBreakRepeatDaysTable } from './barberBreakRepeatDaysTable.ts';
import { createBarberShiftSettingsTable } from './barberShiftSettingsTable.ts';
import { createBarberShiftWorkingHoursTable } from './barberShiftWorkingHoursTable.ts';
import { createTenantStaffTable } from './tenantStaffTable.ts';

export async function dbMigrate() {
    await db.query('use zakazitermin2');

    const args = process.argv.slice(2);
    const withTenants = args.includes('--tenants');
    const withUsers = args.includes('--users');
    const withCustomers = args.includes('--customers');
    const withBarbers = args.includes('--barbers');
    const withServices = args.includes('--services');
    const withBarberServices = args.includes('--barberServices');
    const withAppointments = args.includes('--appointments');
    const withAuth = args.includes('--auth');
    const withTenantStaff = args.includes('--tenantStaff');
    const withTenantWorkingHours = args.includes('--radnoVremeLokala');
    const withTenantWorkingOverrides = args.includes('--overrideRadnoVremeLokala');
    const withBarberScheduleRulesTable = args.includes('--barberSchedulePravila');
    const withBarberScheduleRuleDaysTable = args.includes('--barberScheduleDays');
    const withBarberWorkingHours = args.includes('--barberWorkingHours');
    const withBarberWorkingOverrides = args.includes('--barberWorkingOverrides');
    const withBarberBreaks = args.includes('--barberBreaks');
    const withBarberBreakRepeatDays = args.includes('--barberBreakRepeatDays');
    const withBarberShiftSettings = args.includes('--barberShiftSettings');
    const withBarberShiftWorkingHours = args.includes('--barberShiftWorkingHours');

    if (withTenants) {
        console.log('Kreiram tenants tabelu..');
        await createTenantsTable(db);
    }

    if (withUsers) {
        console.log('Kreiram users tabelu..');
        await createUsersTable(db);
    }

    if (withCustomers) {
        console.log('Kreiram customers tabelu..');
        await createCustomersTable(db);
    }

    if (withBarbers) {
        console.log('Kreiram barbers tabelu..');
        await createBarbersTable(db);
    }

    if (withServices) {
        console.log('Kreiram services tabelu..');
        await createServicesTable(db);
    }

    if (withBarberServices) {
        console.log('Kreiram barber_services tabelu..');
        await createBarberServicesTable(db);
    }

    if (withAppointments) {
        console.log('Kreiram appointments tabelu..');
        await createAppointmentsTable(db);
    }

    if (withAuth) {
        console.log('Kreiram auth tabele..');
        await createAuth(db);
    }

    if (withTenantStaff) {
        console.log('Kreiram tenant_staff tabelu..');
        await createTenantStaffTable(db);
    }

    if (withTenantWorkingHours) {
        console.log('Kreiram tabelu za radno vreme lokala');
        await createTenantWorkingHoursTable(db);
    }

    if (withTenantWorkingOverrides) {
        console.log('Kreiram tabelu za overrajdove radnog vremena lokala');
        await createTenantWorkingOverridesTable(db);
    }

    if (withBarberWorkingHours) {
        console.log('Kreiram tabelu barber working hours');
        await createBarberWorkingHoursTable(db);
    }

    if (withBarberWorkingOverrides) {
        console.log('Kreiram tabelu barber working hours overrides');
        await createBarberWorkingOverridesTable(db);
    }

    if (withBarberBreaks) {
        console.log('Kreiram tabelu barber breaks');
        await createBarberBreaksTable(db);
    }

    if (withBarberShiftSettings) {
        console.log('Kreiram tabelu barber shift settings');
        await createBarberShiftSettingsTable(db);
    }

    if (withBarberShiftWorkingHours) {
        console.log('Kreiram tabelu barber shift working hours');
        await createBarberShiftWorkingHoursTable(db);
    }

    console.log('Kreiranje uspesno zavrseno');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    dbMigrate()
        .then(async () => {
            await db.end();
            process.exit(0);
        })
        .catch(async (err) => {
            console.error(err);
            await db.end();
            process.exit(1);
        });
}