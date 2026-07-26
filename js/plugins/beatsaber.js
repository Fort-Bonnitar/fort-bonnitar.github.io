export const BeatSaberPlugin = {
    id: 'com.beatgames.beatsaber',
    name: 'Beat Saber',
    
    // Logic to find where the data is actually hiding
    discoveryRules: [
        { path: '/sdcard/ModData/com.beatgames.beatsaber/files/', weight: 100 },
        { path: '/sdcard/Android/data/com.beatgames.beatsaber/files/', weight: 80 },
        { path: '/sdcard/BMBFData/', weight: 50 }
    ],

    requiredFiles: [
        'PlayerData.dat',
        'settings.cfg'
    ],

    async diagnose(adb) {
        const report = { score: 0, issues: [], paths: {} };
        
        for (let rule of this.discoveryRules) {
            const hasData = await adb.exists(rule.path + 'PlayerData.dat');
            if (hasData) {
                report.score += rule.weight;
                report.paths.active = rule.path;
            }
        }

        if (report.score < 50) report.issues.push("No valid PlayerData found.");
        return report;
    },

    async createManifest(adb, snapshotType) {
        const bsVersion = await adb.shell("dumpsys package com.beatgames.beatsaber | grep versionName");
        
        return {
            guardianVersion: "2.0",
            timestamp: new Date().toISOString(),
            beatSaberVersion: bsVersion.trim(),
            snapshotType: snapshotType,
            schemaVersion: 4,
            files: await this.mapFiles(adb)
        };
    }
};
