import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Store maintenance state in a JSON file (persists across requests, survives hot-reloads)
const SETTINGS_FILE = path.join(process.cwd(), '.maintenance.json');

function readSettings(): { maintenanceMode: boolean } {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
        }
    } catch (e) {}
    return { maintenanceMode: false };
}

function writeSettings(data: object) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
}

// GET — returns current maintenance state
export async function GET() {
    const settings = readSettings();
    return NextResponse.json(settings);
}

// POST — toggle or set maintenance mode
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const current = readSettings();
        const newValue = body.maintenanceMode !== undefined ? body.maintenanceMode : !current.maintenanceMode;

        const updated = { ...current, maintenanceMode: newValue };
        writeSettings(updated);

        console.log(`[Maintenance Mode] Set to: ${newValue}`);
        return NextResponse.json(updated);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
