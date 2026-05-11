import { Connection } from "mysql2/promise";

function normalizeSerbianPhone(phone: string) {
    let p = phone.trim();

    p = p.replace(/[\s\-()]/g, "");

    if (p.startsWith("00381")) {
        p = "+381" + p.slice(5);
    }

    if (p.startsWith("0")) {
        p = "+381" + p.slice(1);
    }

    if (p.startsWith("381")) {
        p = "+" + p;
    }

    return p;
}

export async function seedUsers(db: Connection) {
    const users = [
        {
            name: "Mirko",
            phone: "0638452725",
            role: "customer",
        },
        {
            name: "Stefan",
            phone: "0638457205",
            role: "customer",
        },
    ];

    for (const user of users) {
        const phoneNormalized = normalizeSerbianPhone(user.phone);

        await db.query(
            `
            INSERT INTO users (
                name,
                phone,
                phone_normalized,
                role
            )
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                phone = VALUES(phone),
                role = VALUES(role)
            `,
            [
                user.name,
                user.phone,
                phoneNormalized,
                user.role,
            ]
        );
    }

    console.log("Uspesno seedovanje tabele users");
}