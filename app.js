import { Adb } from 'https://cdn.skypack.dev/@yume-chan/adb';
import { AdbWebUsbBackend } from 'https://cdn.skypack.dev/@yume-chan/adb-backend-webusb';
import AdbWebCredentialStore from 'https://cdn.skypack.dev/@yume-chan/adb-credential-store-web';

class BSGuardian {
    constructor() {
        this.adb = null;
        this.backend = null;
        this.credStore = new AdbWebCredentialStore();
        this.paths = {
            base: '/sdcard/Android/data/com.beatgames.beatsaber/files',
            backup: '/sdcard/BS_Guardian/Snapshots'
        };
        this.initEventListeners();
    }

    async connect() {
        try {
            this.backend = await AdbWebUsbBackend.requestDevice();
            const connection = await this.backend.connect();
            
            // Handle RSA Authentication (Crucial for Quest)
            this.adb = await Adb.authenticate(connection, this.credStore, (res) => {
                this.log("Check your headset for the RSA prompt!", "warn");
            });

            this.log("Link Established: " + (await this.adb.getProp("ro.product.model")));
            document.getElementById('main-controls').classList.remove('disabled');
            document.getElementById('connection-badge').className = 'badge connected';
        } catch (e) {
            this.log(`Link Failed: ${e.message}`, "error");
        }
    }

    /**
     * Executive Workflow: Snapshot -> Verification -> MBF Handoff
     */
    async prepareForModding() {
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const target = `${this.paths.backup}/${ts}`;

        try {
            this.updateStep('step-1', 'active');
            this.log("Executing On-Device Snapshot...");
            
            await this.exec(`mkdir -p ${target}`);
            // Use shell cp for near-instant execution
            await this.exec(`cp -r ${this.paths.base}/* ${target}/`);
            
            this.updateStep('step-1', 'complete');
            this.updateStep('step-2', 'active');

            // Integrity Check: Ensure PlayerData.dat exists in the snapshot
            const check = await this.exec(`ls ${target}/PlayerData.dat`);
            if (check.includes('No such file')) throw new Error("Snapshot Integrity Failure");

            this.updateStep('step-2', 'complete');
            this.log("Snapshot Verified. Preparing Handoff...", "success");

            if (confirm("Safety Snapshot Created. Ready to launch Mods Before Friday?")) {
                await this.backend.close(); // Release WebUSB
                window.location.href = "https://mbof.xyz/";
            }
        } catch (e) {
            this.log(`Workflow Error: ${e.message}`, "error");
        }
    }

    async exec(cmd) {
        const process = await this.adb.subprocess.spawn(cmd);
        let output = '';
        // Handle stream reading for yume-chan
        const reader = process.stdout.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            output += new TextDecoder().decode(value);
        }
        return output;
    }

    log(msg, type = "") {
        const t = document.getElementById('terminal');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        t.appendChild(entry);
        t.scrollTop = t.scrollHeight;
    }

    updateStep(id, state) {
        document.getElementById(id).className = state;
    }

    initEventListeners() {
        document.getElementById('btn-connect').onclick = () => this.connect();
        document.getElementById('btn-prepare').onclick = () => this.prepareForModding();
    }
}

const guardian = new BSGuardian();