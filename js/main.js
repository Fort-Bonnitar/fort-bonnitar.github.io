import { Adb } from '@yume-chan/adb';
import { BeatSaberPlugin } from './plugins/beatsaber.js';

class GuardianSessionManager {
    constructor() {
        this.state = 'IDLE';
        this.activeAdb = null;
        this.activeSession = JSON.parse(localStorage.getItem('pending_session')) || null;
        this.init();
    }

    async init() {
        // Check if we are returning from a modding session
        if (this.activeSession) {
            this.showRecoveryUI();
        }
        
        document.getElementById('btn-prepare').onclick = () => this.startModdingSession();
    }

    async startModdingSession() {
        this.log("Step 1: Running pre-modding diagnostics...");
        const diag = await BeatSaberPlugin.diagnose(this.activeAdb);
        
        if (diag.score > 0) {
            this.log("Step 2: Creating high-integrity snapshot...");
            const ts = Date.now();
            const snapPath = `/sdcard/BeatSaberGuardian/Snapshots/${ts}/`;
            
            await this.activeAdb.shell(`mkdir -p ${snapPath}`);
            await this.activeAdb.shell(`cp -r ${diag.paths.active}* ${snapPath}`);
            
            const manifest = await BeatSaberPlugin.createManifest(this.activeAdb, 'PRE_MOD');
            await this.activeAdb.writeFile(`${snapPath}manifest.json`, JSON.stringify(manifest));

            // Save session to LocalStorage for "Welcome Back" feature
            this.activeSession = { id: ts, manifest };
            localStorage.setItem('pending_session', JSON.stringify(this.activeSession));

            this.showHandoffModal();
        }
    }

    async showHandoffModal() {
        const modal = document.getElementById('modal-handoff');
        modal.classList.remove('hidden');
        
        document.getElementById('btn-open-mbf').onclick = async () => {
            // CRITICAL: Release USB transport before opening MBF
            await this.activeAdb.transport.close();
            this.log("USB Released. Handoff complete.");
            window.open("https://mbof.xyz/", "_blank");
        };
    }

    async compareSnapshots(currentData, snapshotData) {
        // Logic to compare PlayerData.dat, Song counts, etc.
        // Returns a report for the UI: "Songs: +5, Scores: Changed"
    }
}
